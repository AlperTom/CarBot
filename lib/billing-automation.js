import { supabase } from './auth';
import { 
  getSubscription, 
  reportUsage, 
  getUsageRecords,
  getCustomerInvoices,
  createCustomerPortalSession,
  PRODUCTS,
  formatPrice
} from './stripe';

/**
 * Billing Automation for CarBot SaaS Platform
 * Handles usage tracking, billing limits, and automated subscription management
 */

// Usage tracking for different subscription tiers
const USAGE_LIMITS = {
  starter: {
    conversations_per_month: 100,
    ai_requests_per_month: 1000,
    storage_mb: 100,
    features: ['ai_chat', 'basic_analytics']
  },
  professional: {
    conversations_per_month: 500,
    ai_requests_per_month: 5000,
    storage_mb: 1000,
    features: ['ai_chat', 'advanced_analytics', 'whatsapp', 'appointment_booking', 'lead_management']
  },
  enterprise: {
    conversations_per_month: -1, // Unlimited
    ai_requests_per_month: -1, // Unlimited
    storage_mb: -1, // Unlimited
    features: ['ai_chat', 'advanced_analytics', 'whatsapp', 'appointment_booking', 'lead_management', 'custom_ai', 'api_access', 'white_label']
  }
};

/**
 * Track usage for a workshop
 */
export async function trackUsage(workshopId, usageType, quantity = 1) {
  try {
    console.log(`Tracking usage for workshop ${workshopId}: ${usageType} (+${quantity})`);

    // Get current usage for the month
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format

    // Check if usage record exists for this month
    let { data: existingUsage, error: fetchError } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('usage_type', usageType)
      .eq('period', currentMonth)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUsage) {
      // Update existing usage
      const { error: updateError } = await supabase
        .from('usage_tracking')
        .update({
          quantity: existingUsage.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUsage.id);

      if (updateError) throw updateError;

      console.log(`Updated usage: ${existingUsage.quantity} -> ${existingUsage.quantity + quantity}`);
    } else {
      // Create new usage record
      const { error: insertError } = await supabase
        .from('usage_tracking')
        .insert({
          workshop_id: workshopId,
          usage_type: usageType,
          quantity: quantity,
          period: currentMonth,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      console.log(`Created new usage record: ${quantity}`);
    }

    // Check if usage limits are approaching
    await checkUsageLimits(workshopId);

    return { success: true };
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }
}

/**
 * Check if a workshop is approaching or has exceeded usage limits
 */
export async function checkUsageLimits(workshopId) {
  try {
    // Get workshop subscription details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('subscription_plan, subscription_status, owner_email, stripe_subscription_id')
      .eq('id', workshopId)
      .single();

    if (workshopError || !workshop) {
      console.error('Workshop not found:', workshopError);
      return;
    }

    const plan = workshop.subscription_plan || 'starter';
    const limits = USAGE_LIMITS[plan];

    if (!limits) {
      console.error('Unknown subscription plan:', plan);
      return;
    }

    const currentMonth = new Date().toISOString().substring(0, 7);

    // Get current usage for all types
    const { data: currentUsage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('period', currentMonth);

    if (usageError) {
      console.error('Error fetching usage data:', usageError);
      return;
    }

    const usageMap = {};
    currentUsage?.forEach(record => {
      usageMap[record.usage_type] = record.quantity;
    });

    const warnings = [];
    const exceeded = [];

    // Check each limit
    Object.entries(limits).forEach(([limitType, limitValue]) => {
      if (limitType === 'features' || limitValue === -1) return; // Skip features and unlimited

      const currentUsageValue = usageMap[limitType] || 0;
      const usagePercentage = (currentUsageValue / limitValue) * 100;

      if (usagePercentage >= 100) {
        exceeded.push({
          type: limitType,
          current: currentUsageValue,
          limit: limitValue,
          percentage: usagePercentage
        });
      } else if (usagePercentage >= 80) {
        warnings.push({
          type: limitType,
          current: currentUsageValue,
          limit: limitValue,
          percentage: usagePercentage
        });
      }
    });

    // Handle warnings and exceeded limits
    if (warnings.length > 0 || exceeded.length > 0) {
      await handleUsageLimitNotifications(workshop, warnings, exceeded);
    }

    return { warnings, exceeded };
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return { warnings: [], exceeded: [] };
  }
}

/**
 * Handle usage limit notifications and actions
 */
async function handleUsageLimitNotifications(workshop, warnings, exceeded) {
  try {
    // Log usage events
    const events = [];

    warnings.forEach(warning => {
      events.push({
        workshop_id: workshop.id,
        event_type: 'usage_warning',
        metadata: {
          usage_type: warning.type,
          current_usage: warning.current,
          limit: warning.limit,
          percentage: warning.percentage,
          plan: workshop.subscription_plan
        },
        created_at: new Date().toISOString(),
      });
    });

    exceeded.forEach(limit => {
      events.push({
        workshop_id: workshop.id,
        event_type: 'usage_exceeded',
        metadata: {
          usage_type: limit.type,
          current_usage: limit.current,
          limit: limit.limit,
          percentage: limit.percentage,
          plan: workshop.subscription_plan
        },
        created_at: new Date().toISOString(),
      });
    });

    if (events.length > 0) {
      await supabase
        .from('billing_events')
        .insert(events);
    }

    // Send email notifications
    if (warnings.length > 0) {
      await sendUsageWarningEmail(workshop.owner_email, workshop, warnings);
    }

    if (exceeded.length > 0) {
      await sendUsageExceededEmail(workshop.owner_email, workshop, exceeded);
    }

  } catch (error) {
    console.error('Error handling usage limit notifications:', error);
  }
}

/**
 * Check if a workshop can use a specific feature
 */
export async function canUseFeature(workshopId, feature) {
  try {
    const { data: workshop } = await supabase
      .from('workshops')
      .select('subscription_plan, subscription_status')
      .eq('id', workshopId)
      .single();

    if (!workshop || workshop.subscription_status !== 'active') {
      return false;
    }

    const plan = workshop.subscription_plan || 'starter';
    const limits = USAGE_LIMITS[plan];

    return limits.features.includes(feature);
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

/**
 * Get usage summary for a workshop
 */
export async function getUsageSummary(workshopId, period = null) {
  try {
    const targetPeriod = period || new Date().toISOString().substring(0, 7);

    const { data: usage, error } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('period', targetPeriod);

    if (error) throw error;

    const { data: workshop } = await supabase
      .from('workshops')
      .select('subscription_plan')
      .eq('id', workshopId)
      .single();

    const plan = workshop?.subscription_plan || 'starter';
    const limits = USAGE_LIMITS[plan];

    const summary = {
      period: targetPeriod,
      plan: plan,
      limits: limits,
      usage: {},
      percentages: {},
      warnings: [],
      exceeded: []
    };

    // Initialize usage with zeros
    Object.keys(limits).forEach(key => {
      if (key !== 'features' && limits[key] !== -1) {
        summary.usage[key] = 0;
        summary.percentages[key] = 0;
      }
    });

    // Fill in actual usage
    usage?.forEach(record => {
      summary.usage[record.usage_type] = record.quantity;
      
      if (limits[record.usage_type] && limits[record.usage_type] !== -1) {
        const percentage = (record.quantity / limits[record.usage_type]) * 100;
        summary.percentages[record.usage_type] = Math.round(percentage);

        if (percentage >= 100) {
          summary.exceeded.push(record.usage_type);
        } else if (percentage >= 80) {
          summary.warnings.push(record.usage_type);
        }
      }
    });

    return summary;
  } catch (error) {
    console.error('Error getting usage summary:', error);
    throw error;
  }
}

/**
 * Process trial-to-paid conversion
 */
export async function processTrialConversion(workshopId) {
  try {
    console.log(`Processing trial conversion for workshop: ${workshopId}`);

    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single();

    if (workshopError || !workshop) {
      throw new Error('Workshop not found');
    }

    // Check if workshop is in trial and trial has ended
    const now = new Date();
    const trialEnd = workshop.trial_ends_at ? new Date(workshop.trial_ends_at) : null;

    if (!trialEnd || now < trialEnd) {
      console.log('Trial is still active, no conversion needed');
      return { success: false, reason: 'Trial still active' };
    }

    if (!workshop.stripe_subscription_id) {
      console.log('No Stripe subscription found, trial conversion not possible');
      return { success: false, reason: 'No subscription' };
    }

    // Get subscription status from Stripe
    const subscription = await getSubscription(workshop.stripe_subscription_id);

    if (subscription.status === 'active' && !subscription.trial_end) {
      // Already converted to paid
      await supabase
        .from('workshops')
        .update({
          subscription_status: 'active',
          trial_ends_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshopId);

      // Log successful conversion
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshopId,
          event_type: 'trial_converted',
          stripe_subscription_id: subscription.id,
          metadata: {
            converted_at: new Date().toISOString(),
            plan: workshop.subscription_plan
          },
          created_at: new Date().toISOString(),
        });

      // Send conversion welcome email
      await sendTrialConversionEmail(workshop.owner_email, workshop);

      return { success: true, converted: true };
    }

    return { success: false, reason: 'Subscription not active' };
  } catch (error) {
    console.error('Error processing trial conversion:', error);
    throw error;
  }
}

/**
 * Generate billing report for a workshop
 */
export async function generateBillingReport(workshopId, startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get billing events
    const { data: billingEvents, error: eventsError } = await supabase
      .from('billing_events')
      .select('*')
      .eq('workshop_id', workshopId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false });

    if (eventsError) throw eventsError;

    // Get usage data
    const periods = [];
    const current = new Date(start);
    while (current <= end) {
      periods.push(current.toISOString().substring(0, 7));
      current.setMonth(current.getMonth() + 1);
    }

    const { data: usageData, error: usageError } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('workshop_id', workshopId)
      .in('period', periods);

    if (usageError) throw usageError;

    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single();

    if (workshopError) throw workshopError;

    // Get Stripe invoices if customer exists
    let invoices = [];
    if (workshop.stripe_customer_id) {
      try {
        invoices = await getCustomerInvoices(workshop.stripe_customer_id, 100);
        invoices = invoices.filter(invoice => {
          const invoiceDate = new Date(invoice.created * 1000);
          return invoiceDate >= start && invoiceDate <= end;
        });
      } catch (error) {
        console.error('Error fetching Stripe invoices:', error);
      }
    }

    return {
      workshop: workshop,
      period: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      billing_events: billingEvents || [],
      usage_data: usageData || [],
      stripe_invoices: invoices,
      summary: {
        total_events: billingEvents?.length || 0,
        total_usage_records: usageData?.length || 0,
        total_invoices: invoices.length,
        total_amount_paid: invoices.reduce((sum, inv) => sum + inv.amount_paid, 0)
      }
    };
  } catch (error) {
    console.error('Error generating billing report:', error);
    throw error;
  }
}

// Email notification functions
async function sendUsageWarningEmail(email, workshop, warnings) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping usage warning email');
      return;
    }

    const warningsList = warnings.map(w => 
      `<li><strong>${formatUsageType(w.type)}</strong>: ${w.current} von ${w.limit} (${Math.round(w.percentage)}%)</li>`
    ).join('');

    await resend.emails.send({
      from: 'CarBot <alerts@carbot.chat>',
      to: email,
      subject: 'CarBot - Nutzungsgrenze bald erreicht',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b;">⚠️ Nutzungsgrenze bald erreicht</h1>
          <p>Ihr CarBot Abonnement nähert sich den monatlichen Nutzungsgrenzen:</p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Aktuelle Nutzung (${workshop.subscription_plan} Plan):</h2>
            <ul>${warningsList}</ul>
          </div>
          
          <p>Erwägen Sie ein Upgrade auf einen höheren Plan, um mehr Ressourcen zu erhalten:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Plan upgraden
          </a>
          
          <p style="margin-top: 30px;">Ihr CarBot Team</p>
        </div>
      `,
    });

    console.log('Usage warning email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send usage warning email:', error);
  }
}

async function sendUsageExceededEmail(email, workshop, exceeded) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping usage exceeded email');
      return;
    }

    const exceededList = exceeded.map(e => 
      `<li><strong>${formatUsageType(e.type)}</strong>: ${e.current} von ${e.limit} (${Math.round(e.percentage)}%)</li>`
    ).join('');

    await resend.emails.send({
      from: 'CarBot <alerts@carbot.chat>',
      to: email,
      subject: 'CarBot - Nutzungsgrenze überschritten',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">🚨 Nutzungsgrenze überschritten</h1>
          <p>Ihr CarBot Abonnement hat die monatlichen Nutzungsgrenzen überschritten:</p>
          
          <div style="background: #fef2f2; border: 1px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Überschrittene Limits (${workshop.subscription_plan} Plan):</h2>
            <ul>${exceededList}</ul>
          </div>
          
          <p><strong>Wichtig:</strong> Einige Funktionen könnten eingeschränkt werden, bis Sie upgraden oder der nächste Abrechnungszeitraum beginnt.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
             style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Sofort upgraden
          </a>
          
          <p style="margin-top: 30px;">Ihr CarBot Team</p>
        </div>
      `,
    });

    console.log('Usage exceeded email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send usage exceeded email:', error);
  }
}

async function sendTrialConversionEmail(email, workshop) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping trial conversion email');
      return;
    }

    await resend.emails.send({
      from: 'CarBot <welcome@carbot.chat>',
      to: email,
      subject: 'Willkommen als zahlender CarBot Kunde!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">🎉 Herzlich Willkommen!</h1>
          <p>Ihre Testphase ist erfolgreich in ein bezahltes Abonnement umgewandelt worden.</p>
          
          <div style="background: #ecfdf5; border: 1px solid #059669; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Ihr aktiver Plan:</h2>
            <p><strong>${PRODUCTS[workshop.subscription_plan]?.name || workshop.subscription_plan}</strong></p>
            <p>Sie haben nun Zugang zu allen Premium-Funktionen!</p>
          </div>
          
          <p>Verwalten Sie Ihr Abonnement jederzeit in Ihrem Dashboard:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Zum Dashboard
          </a>
          
          <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen!</p>
          <p>Ihr CarBot Team</p>
        </div>
      `,
    });

    console.log('Trial conversion email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send trial conversion email:', error);
  }
}

// Helper function to format usage types for display
function formatUsageType(type) {
  const typeMap = {
    conversations_per_month: 'Gespräche pro Monat',
    ai_requests_per_month: 'KI-Anfragen pro Monat',
    storage_mb: 'Speicherplatz (MB)'
  };
  return typeMap[type] || type;
}

// Export usage limits for use in other components
export { USAGE_LIMITS };