import { NextResponse } from 'next/server';
import { 
  getSubscription,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  getCustomerInvoices,
  reportUsage,
  getUsageSummary,
  handleStripeError,
  STRIPE_PRODUCTS
} from '@/lib/stripe';
import { supabase } from '@/lib/auth';

// GET - Retrieve subscription details
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');
    const workshopId = searchParams.get('workshop_id');
    const action = searchParams.get('action');

    if (!subscriptionId && !workshopId) {
      return NextResponse.json(
        { error: 'Subscription ID oder Workshop ID ist erforderlich.' },
        { status: 400 }
      );
    }

    // Handle specific actions
    if (action === 'invoices') {
      return await getInvoicesHandler(subscriptionId, workshopId);
    }

    if (action === 'usage') {
      return await getUsageHandler(subscriptionId);
    }

    // Get subscription by ID
    if (subscriptionId) {
      const result = await getSubscription(subscriptionId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        subscription: result.subscription,
      });
    }

    // Get subscription by workshop ID
    if (workshopId) {
      const { data: workshop } = await supabase
        .from('workshops')
        .select('stripe_subscription_id, stripe_customer_id')
        .eq('id', workshopId)
        .single();

      if (!workshop?.stripe_subscription_id) {
        return NextResponse.json(
          { error: 'Kein aktives Abonnement für diese Werkstatt gefunden.' },
          { status: 404 }
        );
      }

      const result = await getSubscription(workshop.stripe_subscription_id);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        subscription: result.subscription,
      });
    }

  } catch (error) {
    console.error('Get Subscription Error:', error);
    
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { 
        error: stripeError.message,
        type: stripeError.type 
      },
      { status: 500 }
    );
  }
}

// PUT - Update subscription (upgrade/downgrade)
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      subscriptionId,
      newPlanId,
      billingInterval,
      workshopId,
      effectiveDate = 'immediate'
    } = body;

    if (!subscriptionId || !newPlanId) {
      return NextResponse.json(
        { error: 'Subscription ID und neuer Plan sind erforderlich.' },
        { status: 400 }
      );
    }

    // Validate the new plan
    const newProduct = STRIPE_PRODUCTS[newPlanId];
    if (!newProduct) {
      return NextResponse.json(
        { error: 'Ungültiger Plan ausgewählt.' },
        { status: 400 }
      );
    }

    // Determine the new price ID
    const newPriceId = billingInterval === 'year' 
      ? process.env[`STRIPE_${newPlanId.toUpperCase()}_YEARLY_PRICE_ID`]
      : process.env[`STRIPE_${newPlanId.toUpperCase()}_MONTHLY_PRICE_ID`];

    if (!newPriceId) {
      return NextResponse.json(
        { error: 'Preiskonfiguration für den neuen Plan nicht gefunden.' },
        { status: 500 }
      );
    }

    // Update the subscription
    const result = await updateSubscription(subscriptionId, newPriceId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Update workshop record
    if (workshopId) {
      await supabase
        .from('workshops')
        .update({
          subscription_plan: newPlanId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshopId);

      // Log the plan change
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshopId,
          event_type: 'plan_changed',
          stripe_subscription_id: subscriptionId,
          metadata: {
            old_plan: body.currentPlanId,
            new_plan: newPlanId,
            billing_interval: billingInterval,
            effective_date: effectiveDate,
          },
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      message: 'Abonnement erfolgreich aktualisiert.',
    });

  } catch (error) {
    console.error('Update Subscription Error:', error);
    
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { 
        error: stripeError.message,
        type: stripeError.type 
      },
      { status: 500 }
    );
  }
}

// DELETE - Cancel subscription
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');
    const workshopId = searchParams.get('workshop_id');
    const reason = searchParams.get('reason') || '';
    const immediate = searchParams.get('immediate') === 'true';

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID ist erforderlich.' },
        { status: 400 }
      );
    }

    // Cancel the subscription
    const result = await cancelSubscription(subscriptionId, reason);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Update workshop record
    if (workshopId) {
      const updateData = {
        updated_at: new Date().toISOString(),
      };

      if (immediate) {
        updateData.subscription_status = 'canceled';
      }

      await supabase
        .from('workshops')
        .update(updateData)
        .eq('id', workshopId);

      // Log the cancellation
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshopId,
          event_type: 'subscription_canceled',
          stripe_subscription_id: subscriptionId,
          metadata: {
            reason,
            immediate,
            canceled_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      message: immediate 
        ? 'Abonnement wurde sofort gekündigt.' 
        : 'Abonnement wird zum Ende der Abrechnungsperiode gekündigt.',
    });

  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { 
        error: stripeError.message,
        type: stripeError.type 
      },
      { status: 500 }
    );
  }
}

// POST - Special actions (reactivate, pause, etc.)
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, subscriptionId, workshopId, data = {} } = body;

    if (!action || !subscriptionId) {
      return NextResponse.json(
        { error: 'Action und Subscription ID sind erforderlich.' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'reactivate':
        return await reactivateSubscriptionHandler(subscriptionId, workshopId);

      case 'pause':
        return await pauseSubscriptionHandler(subscriptionId, workshopId, data);

      case 'resume':
        return await resumeSubscriptionHandler(subscriptionId, workshopId);

      case 'report_usage':
        return await reportUsageHandler(subscriptionId, data);

      default:
        return NextResponse.json(
          { error: 'Ungültige Aktion.' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Subscription Action Error:', error);
    
    const stripeError = handleStripeError(error);
    return NextResponse.json(
      { 
        error: stripeError.message,
        type: stripeError.type 
      },
      { status: 500 }
    );
  }
}

// Helper function to get customer invoices
async function getInvoicesHandler(subscriptionId, workshopId) {
  try {
    let customerId;

    if (workshopId) {
      const { data: workshop } = await supabase
        .from('workshops')
        .select('stripe_customer_id')
        .eq('id', workshopId)
        .single();

      if (!workshop?.stripe_customer_id) {
        return NextResponse.json(
          { error: 'Kunde nicht gefunden.' },
          { status: 404 }
        );
      }

      customerId = workshop.stripe_customer_id;
    } else {
      // Get customer ID from subscription
      const subscriptionResult = await getSubscription(subscriptionId);
      if (!subscriptionResult.success) {
        return NextResponse.json(
          { error: subscriptionResult.error },
          { status: 500 }
        );
      }
      customerId = subscriptionResult.subscription.customer;
    }

    const result = await getCustomerInvoices(customerId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invoices: result.invoices,
    });

  } catch (error) {
    console.error('Get Invoices Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Rechnungen.' },
      { status: 500 }
    );
  }
}

// Helper function to get usage summary
async function getUsageHandler(subscriptionId) {
  try {
    // Get subscription items first
    const subscriptionResult = await getSubscription(subscriptionId);
    if (!subscriptionResult.success) {
      return NextResponse.json(
        { error: subscriptionResult.error },
        { status: 500 }
      );
    }

    const subscription = subscriptionResult.subscription;
    const usageData = [];

    // Get usage for each subscription item
    for (const item of subscription.items.data) {
      const result = await getUsageSummary(item.id);
      if (result.success) {
        usageData.push({
          itemId: item.id,
          priceId: item.price.id,
          productName: item.price.product.name,
          usage: result.summary,
        });
      }
    }

    return NextResponse.json({
      success: true,
      usage: usageData,
    });

  } catch (error) {
    console.error('Get Usage Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Nutzungsdaten.' },
      { status: 500 }
    );
  }
}

// Helper function to reactivate subscription
async function reactivateSubscriptionHandler(subscriptionId, workshopId) {
  try {
    const result = await reactivateSubscription(subscriptionId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Update workshop record
    if (workshopId) {
      await supabase
        .from('workshops')
        .update({
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshopId);

      // Log the reactivation
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshopId,
          event_type: 'subscription_reactivated',
          stripe_subscription_id: subscriptionId,
          metadata: {
            reactivated_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      message: 'Abonnement erfolgreich reaktiviert.',
    });

  } catch (error) {
    console.error('Reactivate Subscription Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Reaktivieren des Abonnements.' },
      { status: 500 }
    );
  }
}

// Helper function to pause subscription
async function pauseSubscriptionHandler(subscriptionId, workshopId, data) {
  try {
    // Import stripe here to avoid issues
    const { stripe } = await import('@/lib/stripe');
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: 'void',
        resumes_at: data.resumeAt ? Math.floor(new Date(data.resumeAt).getTime() / 1000) : undefined,
      },
      metadata: {
        pause_reason: data.reason || 'User requested',
        paused_at: new Date().toISOString(),
      },
    });

    // Update workshop record
    if (workshopId) {
      await supabase
        .from('workshops')
        .update({
          subscription_status: 'paused',
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshopId);

      // Log the pause
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshopId,
          event_type: 'subscription_paused',
          stripe_subscription_id: subscriptionId,
          metadata: {
            reason: data.reason,
            resume_at: data.resumeAt,
            paused_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Abonnement erfolgreich pausiert.',
    });

  } catch (error) {
    console.error('Pause Subscription Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Pausieren des Abonnements.' },
      { status: 500 }
    );
  }
}

// Helper function to resume subscription
async function resumeSubscriptionHandler(subscriptionId, workshopId) {
  try {
    // Import stripe here to avoid issues
    const { stripe } = await import('@/lib/stripe');
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
      metadata: {
        resumed_at: new Date().toISOString(),
      },
    });

    // Update workshop record
    if (workshopId) {
      await supabase
        .from('workshops')
        .update({
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshopId);

      // Log the resume
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshopId,
          event_type: 'subscription_resumed',
          stripe_subscription_id: subscriptionId,
          metadata: {
            resumed_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Abonnement erfolgreich fortgesetzt.',
    });

  } catch (error) {
    console.error('Resume Subscription Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Fortsetzen des Abonnements.' },
      { status: 500 }
    );
  }
}

// Helper function to report usage
async function reportUsageHandler(subscriptionId, data) {
  try {
    const { itemId, quantity, timestamp, action = 'increment' } = data;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID und Quantity sind erforderlich.' },
        { status: 400 }
      );
    }

    const result = await reportUsage(itemId, quantity, timestamp);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      usageRecord: result.usageRecord,
      message: 'Nutzung erfolgreich gemeldet.',
    });

  } catch (error) {
    console.error('Report Usage Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Melden der Nutzung.' },
      { status: 500 }
    );
  }
}