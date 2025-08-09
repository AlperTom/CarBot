/**
 * Stripe Webhook Handler - Process subscription events
 * Handles subscription lifecycle events from Stripe
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature || !webhookSecret) {
      console.error('Missing webhook signature or secret')
      return NextResponse.json(
        { error: 'Missing webhook signature or secret' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    console.log(`Processing webhook event: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object)
        break

      case 'invoice.upcoming':
        await handleUpcomingInvoice(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription) {
  try {
    const workshopId = subscription.metadata.workshop_id
    const planId = subscription.metadata.plan_id

    if (!workshopId) {
      console.error('No workshop_id in subscription metadata')
      return
    }

    // Update or create subscription record
    const { error } = await supabase
      .from('workshop_subscriptions')
      .upsert({
        workshop_id: workshopId,
        plan_id: planId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end || false
      }, {
        onConflict: 'stripe_subscription_id'
      })

    if (error) {
      console.error('Failed to update subscription:', error)
    } else {
      console.log(`Subscription created for workshop ${workshopId}`)
    }

  } catch (error) {
    console.error('Error handling subscription creation:', error)
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
  try {
    const workshopId = subscription.metadata.workshop_id

    if (!workshopId) {
      console.error('No workshop_id in subscription metadata')
      return
    }

    // Update subscription record
    const { error } = await supabase
      .from('workshop_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Failed to update subscription:', error)
    } else {
      console.log(`Subscription updated for workshop ${workshopId}: ${subscription.status}`)
    }

    // Handle specific status changes
    if (subscription.status === 'past_due') {
      await handlePastDueSubscription(subscription)
    } else if (subscription.status === 'canceled') {
      await handleCanceledSubscription(subscription)
    }

  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

// Handle subscription deleted/canceled
async function handleSubscriptionDeleted(subscription) {
  try {
    const workshopId = subscription.metadata.workshop_id

    // Update subscription status
    const { error } = await supabase
      .from('workshop_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Failed to update canceled subscription:', error)
    } else {
      console.log(`Subscription canceled for workshop ${workshopId}`)
    }

    // TODO: Send cancellation email to workshop owner
    // await sendCancellationEmail(workshopId)

  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    const workshopId = subscription.metadata.workshop_id

    if (!workshopId) {
      console.error('No workshop_id in subscription metadata')
      return
    }

    // Record payment in payment history
    const { error } = await supabase
      .from('payment_history')
      .insert({
        workshop_id: workshopId,
        stripe_payment_intent_id: invoice.payment_intent,
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency.toUpperCase(),
        status: 'succeeded',
        payment_date: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
        description: `Payment for ${subscription.metadata.plan_type || 'CarBot'} subscription`
      })

    if (error) {
      console.error('Failed to record payment:', error)
    } else {
      console.log(`Payment recorded for workshop ${workshopId}: €${invoice.amount_paid / 100}`)
    }

    // Update subscription status if needed
    await supabase
      .from('workshop_subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    // TODO: Send payment confirmation email
    // await sendPaymentConfirmationEmail(workshopId, invoice)

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    const workshopId = subscription.metadata.workshop_id

    if (!workshopId) {
      console.error('No workshop_id in subscription metadata')
      return
    }

    // Record failed payment
    const { error } = await supabase
      .from('payment_history')
      .insert({
        workshop_id: workshopId,
        stripe_payment_intent_id: invoice.payment_intent,
        amount: invoice.amount_due / 100,
        currency: invoice.currency.toUpperCase(),
        status: 'failed',
        payment_date: new Date().toISOString(),
        description: `Failed payment for ${subscription.metadata.plan_type || 'CarBot'} subscription`
      })

    if (error) {
      console.error('Failed to record payment failure:', error)
    }

    // Update subscription status
    await supabase
      .from('workshop_subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    console.log(`Payment failed for workshop ${workshopId}`)

    // TODO: Send payment failure notification
    // await sendPaymentFailureEmail(workshopId, invoice)

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

// Handle trial ending soon
async function handleTrialWillEnd(subscription) {
  try {
    const workshopId = subscription.metadata.workshop_id

    if (!workshopId) {
      console.error('No workshop_id in subscription metadata')
      return
    }

    console.log(`Trial ending soon for workshop ${workshopId}`)

    // TODO: Send trial ending email
    // await sendTrialEndingEmail(workshopId, subscription)

  } catch (error) {
    console.error('Error handling trial will end:', error)
  }
}

// Handle upcoming invoice
async function handleUpcomingInvoice(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    const workshopId = subscription.metadata.workshop_id

    if (!workshopId) {
      console.error('No workshop_id in subscription metadata')
      return
    }

    console.log(`Upcoming invoice for workshop ${workshopId}: €${invoice.amount_due / 100}`)

    // TODO: Send upcoming invoice notification
    // await sendUpcomingInvoiceEmail(workshopId, invoice)

  } catch (error) {
    console.error('Error handling upcoming invoice:', error)
  }
}

// Handle past due subscription
async function handlePastDueSubscription(subscription) {
  try {
    const workshopId = subscription.metadata.workshop_id
    console.log(`Subscription past due for workshop ${workshopId}`)

    // TODO: Implement grace period logic
    // TODO: Send reminder emails
    // TODO: Potentially limit features

  } catch (error) {
    console.error('Error handling past due subscription:', error)
  }
}

// Handle canceled subscription
async function handleCanceledSubscription(subscription) {
  try {
    const workshopId = subscription.metadata.workshop_id
    console.log(`Subscription canceled for workshop ${workshopId}`)

    // TODO: Downgrade workshop to free tier
    // TODO: Send cancellation confirmation
    // TODO: Export user data for download

  } catch (error) {
    console.error('Error handling canceled subscription:', error)
  }
}