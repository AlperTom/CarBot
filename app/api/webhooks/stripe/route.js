import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/stripe';
import { supabase } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    // Verify webhook signature
    const verification = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (!verification.success) {
      console.error('Stripe webhook signature verification failed:', verification.error);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const event = verification.event;
    console.log('Processing Stripe webhook event:', event.type, event.id);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        return await handleCheckoutSessionCompleted(event);
      
      case 'customer.subscription.created':
        return await handleSubscriptionCreated(event);
      
      case 'customer.subscription.updated':
        return await handleSubscriptionUpdated(event);
      
      case 'customer.subscription.deleted':
        return await handleSubscriptionDeleted(event);
      
      case 'invoice.payment_succeeded':
        return await handleInvoicePaymentSucceeded(event);
      
      case 'invoice.payment_failed':
        return await handleInvoicePaymentFailed(event);
      
      case 'customer.subscription.trial_will_end':
        return await handleTrialWillEnd(event);
      
      case 'customer.created':
        return await handleCustomerCreated(event);
      
      case 'customer.updated':
        return await handleCustomerUpdated(event);
      
      case 'payment_method.attached':
        return await handlePaymentMethodAttached(event);
      
      default:
        console.log(`Unhandled Stripe webhook event type: ${event.type}`);
        return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout session completion
async function handleCheckoutSessionCompleted(event) {
  const session = event.data.object;
  const subscriptionId = session.subscription;
  const customerId = session.customer;
  const workshopId = session.metadata?.workshop_id;

  try {
    console.log('Processing checkout session completion:', session.id);

    if (!workshopId) {
      console.error('No workshop_id in session metadata');
      return NextResponse.json({ error: 'Missing workshop_id' }, { status: 400 });
    }

    // Update workshop with subscription details
    const { error: workshopError } = await supabase
      .from('workshops')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        trial_ends_at: session.mode === 'subscription' && session.subscription 
          ? new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)).toISOString() // 14 days trial
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workshopId);

    if (workshopError) {
      console.error('Failed to update workshop:', workshopError);
      throw workshopError;
    }

    // Log successful payment event
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshopId,
        event_type: 'checkout_completed',
        stripe_event_id: event.id,
        stripe_session_id: session.id,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        amount: session.amount_total,
        currency: session.currency,
        metadata: {
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
          payment_method_types: session.payment_method_types,
        },
        created_at: new Date().toISOString(),
      });

    // Send welcome email for successful subscription
    if (session.customer_details?.email) {
      await sendSubscriptionWelcomeEmail(
        session.customer_details.email,
        workshopId,
        session
      );
    }

    console.log('Checkout session completed successfully for workshop:', workshopId);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling checkout session completion:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(event) {
  const subscription = event.data.object;
  const customerId = subscription.customer;
  const workshopId = subscription.metadata?.workshop_id;

  try {
    console.log('Processing subscription creation:', subscription.id);

    if (!workshopId) {
      // Try to find workshop by customer ID
      const { data: workshop } = await supabase
        .from('workshops')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (!workshop) {
        console.error('No workshop found for customer:', customerId);
        return NextResponse.json({ error: 'Workshop not found' }, { status: 400 });
      }

      workshopId = workshop.id;
    }

    // Update workshop with subscription details
    const { error } = await supabase
      .from('workshops')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_plan: getSubscriptionPlan(subscription),
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_ends_at: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString() 
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workshopId);

    if (error) {
      console.error('Failed to update workshop subscription:', error);
      throw error;
    }

    // Log subscription creation
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshopId,
        event_type: 'subscription_created',
        stripe_event_id: event.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        metadata: {
          plan: getSubscriptionPlan(subscription),
          status: subscription.status,
          trial_end: subscription.trial_end,
          current_period_end: subscription.current_period_end,
        },
        created_at: new Date().toISOString(),
      });

    console.log('Subscription created successfully for workshop:', workshopId);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling subscription creation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle subscription updates (plan changes, renewals, etc.)
async function handleSubscriptionUpdated(event) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  try {
    console.log('Processing subscription update:', subscription.id);

    // Find workshop by customer ID or subscription ID
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id')
      .or(`stripe_customer_id.eq.${customerId},stripe_subscription_id.eq.${subscription.id}`)
      .single();

    if (!workshop) {
      console.error('No workshop found for subscription:', subscription.id);
      return NextResponse.json({ error: 'Workshop not found' }, { status: 400 });
    }

    // Update workshop subscription details
    const { error } = await supabase
      .from('workshops')
      .update({
        subscription_status: subscription.status,
        subscription_plan: getSubscriptionPlan(subscription),
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_ends_at: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString() 
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workshop.id);

    if (error) {
      console.error('Failed to update workshop subscription:', error);
      throw error;
    }

    // Determine event type based on subscription changes
    let eventType = 'subscription_updated';
    const previousAttributes = event.data.previous_attributes;

    if (previousAttributes?.cancel_at_period_end !== undefined) {
      eventType = subscription.cancel_at_period_end ? 'subscription_canceled' : 'subscription_reactivated';
    } else if (previousAttributes?.items) {
      eventType = 'subscription_plan_changed';
    } else if (previousAttributes?.status) {
      eventType = `subscription_${subscription.status}`;
    }

    // Log subscription update
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshop.id,
        event_type: eventType,
        stripe_event_id: event.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        metadata: {
          plan: getSubscriptionPlan(subscription),
          status: subscription.status,
          previous_status: previousAttributes?.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          changes: previousAttributes,
        },
        created_at: new Date().toISOString(),
      });

    console.log('Subscription updated successfully for workshop:', workshop.id);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling subscription update:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle subscription deletion (immediate cancellation)
async function handleSubscriptionDeleted(event) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  try {
    console.log('Processing subscription deletion:', subscription.id);

    // Find workshop by subscription ID
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, owner_email')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!workshop) {
      console.error('No workshop found for deleted subscription:', subscription.id);
      return NextResponse.json({ error: 'Workshop not found' }, { status: 400 });
    }

    // Update workshop to canceled status
    const { error } = await supabase
      .from('workshops')
      .update({
        subscription_status: 'canceled',
        subscription_plan: null,
        stripe_subscription_id: null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workshop.id);

    if (error) {
      console.error('Failed to update workshop on subscription deletion:', error);
      throw error;
    }

    // Log subscription deletion
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshop.id,
        event_type: 'subscription_deleted',
        stripe_event_id: event.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        metadata: {
          canceled_at: new Date(subscription.canceled_at * 1000).toISOString(),
          cancellation_reason: subscription.cancellation_details?.reason,
        },
        created_at: new Date().toISOString(),
      });

    // Send subscription cancellation email
    await sendSubscriptionCancellationEmail(workshop.owner_email, workshop.id);

    console.log('Subscription deleted successfully for workshop:', workshop.id);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle successful invoice payments
async function handleInvoicePaymentSucceeded(event) {
  const invoice = event.data.object;
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  try {
    console.log('Processing successful invoice payment:', invoice.id);

    // Find workshop
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (!workshop) {
      console.error('No workshop found for invoice payment:', invoice.id);
      return NextResponse.json({ error: 'Workshop not found' }, { status: 400 });
    }

    // Log successful payment
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshop.id,
        event_type: 'invoice_payment_succeeded',
        stripe_event_id: event.id,
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        metadata: {
          invoice_number: invoice.number,
          period_start: invoice.period_start,
          period_end: invoice.period_end,
          payment_method: invoice.default_payment_method,
        },
        created_at: new Date().toISOString(),
      });

    // Update workshop if this was a trial conversion
    if (invoice.billing_reason === 'subscription_cycle' && invoice.amount_paid > 0) {
      await supabase
        .from('workshops')
        .update({
          subscription_status: 'active',
          trial_ends_at: null, // Clear trial end date
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshop.id);
    }

    console.log('Invoice payment processed successfully for workshop:', workshop.id);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling invoice payment success:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle failed invoice payments
async function handleInvoicePaymentFailed(event) {
  const invoice = event.data.object;
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  try {
    console.log('Processing failed invoice payment:', invoice.id);

    // Find workshop
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, owner_email')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (!workshop) {
      console.error('No workshop found for failed invoice payment:', invoice.id);
      return NextResponse.json({ error: 'Workshop not found' }, { status: 400 });
    }

    // Log failed payment
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshop.id,
        event_type: 'invoice_payment_failed',
        stripe_event_id: event.id,
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        amount: invoice.amount_due,
        currency: invoice.currency,
        metadata: {
          invoice_number: invoice.number,
          attempt_count: invoice.attempt_count,
          failure_reason: invoice.last_finalization_error?.message,
        },
        created_at: new Date().toISOString(),
      });

    // Send payment failure notification email
    await sendPaymentFailureEmail(workshop.owner_email, workshop.id, invoice);

    console.log('Failed invoice payment processed for workshop:', workshop.id);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle trial ending soon notifications
async function handleTrialWillEnd(event) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  try {
    console.log('Processing trial ending notification:', subscription.id);

    // Find workshop
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, owner_email')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!workshop) {
      console.error('No workshop found for trial ending:', subscription.id);
      return NextResponse.json({ error: 'Workshop not found' }, { status: 400 });
    }

    // Send trial ending email
    await sendTrialEndingEmail(
      workshop.owner_email, 
      workshop.id, 
      new Date(subscription.trial_end * 1000)
    );

    // Log trial ending notification
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshop.id,
        event_type: 'trial_will_end',
        stripe_event_id: event.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        metadata: {
          trial_end: new Date(subscription.trial_end * 1000).toISOString(),
        },
        created_at: new Date().toISOString(),
      });

    console.log('Trial ending notification processed for workshop:', workshop.id);
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling trial ending notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle customer creation
async function handleCustomerCreated(event) {
  const customer = event.data.object;
  
  try {
    console.log('Processing customer creation:', customer.id);

    // Log customer creation
    await supabase
      .from('billing_events')
      .insert({
        event_type: 'customer_created',
        stripe_event_id: event.id,
        stripe_customer_id: customer.id,
        metadata: {
          email: customer.email,
          name: customer.name,
          created: customer.created,
        },
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling customer creation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle customer updates
async function handleCustomerUpdated(event) {
  const customer = event.data.object;
  
  try {
    console.log('Processing customer update:', customer.id);

    // Update workshop customer information
    const { error } = await supabase
      .from('workshops')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customer.id);

    if (error) {
      console.error('Failed to update workshop customer info:', error);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling customer update:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle payment method attachment
async function handlePaymentMethodAttached(event) {
  const paymentMethod = event.data.object;
  
  try {
    console.log('Processing payment method attachment:', paymentMethod.id);

    // Find workshop by customer ID
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id')
      .eq('stripe_customer_id', paymentMethod.customer)
      .single();

    if (workshop) {
      // Log payment method attachment
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshop.id,
          event_type: 'payment_method_attached',
          stripe_event_id: event.id,
          stripe_customer_id: paymentMethod.customer,
          metadata: {
            payment_method_id: paymentMethod.id,
            type: paymentMethod.type,
            last4: paymentMethod.card?.last4,
            brand: paymentMethod.card?.brand,
          },
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error handling payment method attachment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to determine subscription plan from Stripe subscription
function getSubscriptionPlan(subscription) {
  const priceId = subscription.items.data[0]?.price?.id;
  
  if (priceId === process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 
      priceId === process.env.STRIPE_STARTER_YEARLY_PRICE_ID) {
    return 'starter';
  }
  if (priceId === process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || 
      priceId === process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID) {
    return 'professional';
  }
  if (priceId === process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 
      priceId === process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID) {
    return 'enterprise';
  }
  
  return 'unknown';
}

// Email notification functions
async function sendSubscriptionWelcomeEmail(email, workshopId, session) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping welcome email');
      return;
    }

    await resend.emails.send({
      from: 'CarBot <welcome@carbot.chat>',
      to: email,
      subject: 'Willkommen bei CarBot - Ihr Abonnement ist aktiv!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937;">Willkommen bei CarBot!</h1>
          <p>Vielen Dank für Ihr Vertrauen in CarBot. Ihr Abonnement ist nun aktiv und Sie können alle Funktionen nutzen.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Ihre Abonnement-Details:</h2>
            <p><strong>Abonnement-ID:</strong> ${session.subscription}</p>
            <p><strong>Status:</strong> Aktiv</p>
            <p><strong>Betrag:</strong> ${(session.amount_total / 100).toFixed(2)} €</p>
          </div>
          
          <p>Sie können Ihr Abonnement jederzeit in Ihrem Dashboard verwalten:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Zum Dashboard
          </a>
          
          <p style="margin-top: 30px;">Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          <p>Ihr CarBot Team</p>
        </div>
      `,
    });

    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

async function sendSubscriptionCancellationEmail(email, workshopId) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping cancellation email');
      return;
    }

    await resend.emails.send({
      from: 'CarBot <support@carbot.chat>',
      to: email,
      subject: 'CarBot Abonnement gekündigt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937;">Abonnement gekündigt</h1>
          <p>Ihr CarBot Abonnement wurde erfolgreich gekündigt.</p>
          
          <p>Sie haben weiterhin Zugang zu Ihrem Account und können CarBot jederzeit wieder aktivieren.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Abonnement reaktivieren
          </a>
          
          <p style="margin-top: 30px;">Vielen Dank, dass Sie CarBot verwendet haben. Wir hoffen, Sie bald wieder begrüßen zu können.</p>
          <p>Ihr CarBot Team</p>
        </div>
      `,
    });

    console.log('Cancellation email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
  }
}

async function sendPaymentFailureEmail(email, workshopId, invoice) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping payment failure email');
      return;
    }

    await resend.emails.send({
      from: 'CarBot <billing@carbot.chat>',
      to: email,
      subject: 'CarBot Zahlung fehlgeschlagen - Handlung erforderlich',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Zahlung fehlgeschlagen</h1>
          <p>Leider konnten wir Ihre Zahlung für CarBot nicht verarbeiten.</p>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #dc2626;">Rechnungs-Details:</h2>
            <p><strong>Rechnungsnummer:</strong> ${invoice.number}</p>
            <p><strong>Betrag:</strong> ${(invoice.amount_due / 100).toFixed(2)} €</p>
            <p><strong>Versuch:</strong> ${invoice.attempt_count}</p>
          </div>
          
          <p>Bitte aktualisieren Sie Ihre Zahlungsmethode, um Unterbrechungen zu vermeiden:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
             style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Zahlungsmethode aktualisieren
          </a>
          
          <p style="margin-top: 30px;">Bei Fragen kontaktieren Sie uns gerne.</p>
          <p>Ihr CarBot Team</p>
        </div>
      `,
    });

    console.log('Payment failure email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send payment failure email:', error);
  }
}

async function sendTrialEndingEmail(email, workshopId, trialEndDate) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping trial ending email');
      return;
    }

    const trialEndFormatted = trialEndDate.toLocaleDateString('de-DE');

    await resend.emails.send({
      from: 'CarBot <trial@carbot.chat>',
      to: email,
      subject: 'Ihre CarBot Testphase endet bald',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937;">Ihre Testphase endet bald</h1>
          <p>Ihre kostenlose CarBot Testphase endet am <strong>${trialEndFormatted}</strong>.</p>
          
          <p>Um weiterhin alle CarBot Funktionen nutzen zu können, wählen Sie bitte einen passenden Tarif:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Unsere Tarife:</h3>
            <p><strong>Starter:</strong> 49€/Monat - Ideal für kleinere Werkstätten</p>
            <p><strong>Professional:</strong> 99€/Monat - Erweiterte Funktionen</p>
            <p><strong>Enterprise:</strong> 199€/Monat - Vollumfängliche Lösung</p>
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Jetzt upgraden
          </a>
          
          <p style="margin-top: 30px;">Haben Sie Fragen? Wir helfen gerne weiter.</p>
          <p>Ihr CarBot Team</p>
        </div>
      `,
    });

    console.log('Trial ending email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send trial ending email:', error);
  }
}