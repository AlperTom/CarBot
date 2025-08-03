import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/stripe';
import { supabase } from '@/lib/auth';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No stripe-signature header found');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const verificationResult = verifyWebhookSignature(body, signature, endpointSecret);
    
    if (!verificationResult.success) {
      console.error('Webhook signature verification failed:', verificationResult.error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = verificationResult.event;
    console.log(`Received webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;

      case 'invoice.upcoming':
        await handleUpcomingInvoice(event.data.object);
        break;

      case 'customer.created':
        await handleCustomerCreated(event.data.object);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Log webhook event
    await logWebhookEvent(event);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout session
async function handleCheckoutSessionCompleted(session) {
  try {
    console.log('Processing completed checkout session:', session.id);

    const workshopId = session.metadata?.workshop_id;
    const planId = session.metadata?.plan_name;

    if (!workshopId) {
      console.error('No workshop_id in session metadata');
      return;
    }

    // Update workshop with subscription details
    await supabase
      .from('workshops')
      .update({
        subscription_status: 'active',
        subscription_plan: planId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        trial_end: session.subscription ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', workshopId);

    // Create billing record
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshopId,
        event_type: 'checkout_completed',
        stripe_session_id: session.id,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        amount: session.amount_total,
        currency: session.currency,
        metadata: {
          mode: session.mode,
          payment_status: session.payment_status,
        },
        created_at: new Date().toISOString(),
      });

    console.log(`Workshop ${workshopId} subscription activated successfully`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  try {
    console.log('Processing subscription created:', subscription.id);

    const customerId = subscription.customer;
    
    // Find workshop by customer ID
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, name')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!workshop) {
      console.error('Workshop not found for customer:', customerId);
      return;
    }

    // Update workshop with subscription details
    await supabase
      .from('workshops')
      .update({
        subscription_status: subscription.status,
        stripe_subscription_id: subscription.id,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', workshop.id);

    // Create subscription record
    await supabase
      .from('subscriptions')
      .insert({
        id: subscription.id,
        workshop_id: workshop.id,
        stripe_customer_id: customerId,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        metadata: subscription.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    console.log(`Subscription ${subscription.id} created for workshop ${workshop.id}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  try {
    console.log('Processing subscription updated:', subscription.id);

    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        metadata: subscription.metadata || {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    // Update workshop status
    await supabase
      .from('workshops')
      .update({
        subscription_status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`Subscription ${subscription.id} updated successfully`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  try {
    console.log('Processing subscription deleted:', subscription.id);

    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    // Update workshop status
    await supabase
      .from('workshops')
      .update({
        subscription_status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`Subscription ${subscription.id} canceled successfully`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    console.log('Processing successful payment for invoice:', invoice.id);

    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;

    // Create payment record
    await supabase
      .from('payments')
      .insert({
        stripe_invoice_id: invoice.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'succeeded',
        payment_date: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
        invoice_url: invoice.hosted_invoice_url,
        invoice_pdf: invoice.invoice_pdf,
        metadata: {
          billing_reason: invoice.billing_reason,
          period_start: invoice.period_start,
          period_end: invoice.period_end,
        },
        created_at: new Date().toISOString(),
      });

    // Update workshop last payment date
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (workshop) {
      await supabase
        .from('workshops')
        .update({
          last_payment_date: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshop.id);
    }

    console.log(`Payment processed successfully for invoice ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice) {
  try {
    console.log('Processing failed payment for invoice:', invoice.id);

    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;

    // Create payment record
    await supabase
      .from('payments')
      .insert({
        stripe_invoice_id: invoice.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'failed',
        payment_date: new Date().toISOString(),
        invoice_url: invoice.hosted_invoice_url,
        metadata: {
          billing_reason: invoice.billing_reason,
          failure_reason: invoice.last_payment_error?.message,
        },
        created_at: new Date().toISOString(),
      });

    // Find and update workshop
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, name, owner_email')
      .eq('stripe_customer_id', customerId)
      .single();

    if (workshop) {
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshop.id,
          event_type: 'payment_failed',
          stripe_invoice_id: invoice.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          amount: invoice.amount_due,
          currency: invoice.currency,
          metadata: {
            failure_reason: invoice.last_payment_error?.message,
            attempt_count: invoice.attempt_count,
          },
          created_at: new Date().toISOString(),
        });

      // TODO: Send payment failure notification email
      console.log(`Payment failed notification needed for workshop ${workshop.id}`);
    }

    console.log(`Payment failure processed for invoice ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

// Handle trial ending soon
async function handleTrialWillEnd(subscription) {
  try {
    console.log('Processing trial ending for subscription:', subscription.id);

    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, name, owner_email')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (workshop) {
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshop.id,
          event_type: 'trial_ending',
          stripe_subscription_id: subscription.id,
          metadata: {
            trial_end: subscription.trial_end,
            days_remaining: Math.ceil((subscription.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
          },
          created_at: new Date().toISOString(),
        });

      // TODO: Send trial ending notification email
      console.log(`Trial ending notification needed for workshop ${workshop.id}`);
    }
  } catch (error) {
    console.error('Error handling trial will end:', error);
  }
}

// Handle upcoming invoice
async function handleUpcomingInvoice(invoice) {
  try {
    console.log('Processing upcoming invoice:', invoice.id);

    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, name, owner_email')
      .eq('stripe_customer_id', invoice.customer)
      .single();

    if (workshop) {
      await supabase
        .from('billing_events')
        .insert({
          workshop_id: workshop.id,
          event_type: 'upcoming_invoice',
          stripe_invoice_id: invoice.id,
          stripe_customer_id: invoice.customer,
          stripe_subscription_id: invoice.subscription,
          amount: invoice.amount_due,
          currency: invoice.currency,
          metadata: {
            period_start: invoice.period_start,
            period_end: invoice.period_end,
            due_date: invoice.due_date,
          },
          created_at: new Date().toISOString(),
        });

      // TODO: Send upcoming invoice notification email
      console.log(`Upcoming invoice notification needed for workshop ${workshop.id}`);
    }
  } catch (error) {
    console.error('Error handling upcoming invoice:', error);
  }
}

// Handle customer creation
async function handleCustomerCreated(customer) {
  try {
    console.log('Processing customer created:', customer.id);

    const workshopId = customer.metadata?.workshop_id;
    if (workshopId) {
      await supabase
        .from('workshops')
        .update({
          stripe_customer_id: customer.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshopId);
    }
  } catch (error) {
    console.error('Error handling customer created:', error);
  }
}

// Handle customer updates
async function handleCustomerUpdated(customer) {
  try {
    console.log('Processing customer updated:', customer.id);

    // Update workshop with any relevant customer information
    await supabase
      .from('workshops')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customer.id);
  } catch (error) {
    console.error('Error handling customer updated:', error);
  }
}

// Log webhook events for debugging and auditing
async function logWebhookEvent(event) {
  try {
    await supabase
      .from('webhook_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        livemode: event.livemode,
        api_version: event.api_version,
        created: new Date(event.created * 1000).toISOString(),
        data: event.data,
        metadata: event.data.object.metadata || {},
        processed_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error logging webhook event:', error);
  }
}