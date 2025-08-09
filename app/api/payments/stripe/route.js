/**
 * Stripe Payment Integration API - Handle subscription payments
 * Phase 2 Feature: Revenue generation through subscription management
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../../../../lib/jwt-auth.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// CREATE SUBSCRIPTION - Start new subscription
export const POST = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const { 
      planType, 
      billingCycle = 'monthly',
      paymentMethodId,
      customerInfo = {}
    } = body

    // Validate plan type
    const validPlans = ['basic', 'professional', 'enterprise']
    if (!validPlans.includes(planType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid plan type'
      }, { status: 400 })
    }

    // Get plan details from database
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('plan_type', planType)
      .eq('is_active', true)
      .single()

    if (planError || !plan) {
      return NextResponse.json({
        success: false,
        error: 'Plan not found or inactive'
      }, { status: 404 })
    }

    // Check if workshop already has active subscription
    const { data: existingSub } = await supabase
      .from('workshop_subscriptions')
      .select('*')
      .eq('workshop_id', workshop.id)
      .in('status', ['active', 'trialing'])
      .single()

    if (existingSub) {
      return NextResponse.json({
        success: false,
        error: 'Workshop already has an active subscription'
      }, { status: 409 })
    }

    // Create or retrieve Stripe customer
    let stripeCustomer
    const { data: existingCustomer } = await supabase
      .from('workshop_subscriptions')
      .select('stripe_customer_id')
      .eq('workshop_id', workshop.id)
      .not('stripe_customer_id', 'is', null)
      .single()

    if (existingCustomer?.stripe_customer_id) {
      stripeCustomer = await stripe.customers.retrieve(existingCustomer.stripe_customer_id)
    } else {
      stripeCustomer = await stripe.customers.create({
        email: workshop.owner_email,
        name: workshop.business_name,
        metadata: {
          workshop_id: workshop.id,
          workshop_name: workshop.business_name
        },
        address: {
          country: 'DE' // German market focus
        },
        ...customerInfo
      })
    }

    // Attach payment method to customer
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomer.id
      })

      await stripe.customers.update(stripeCustomer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })
    }

    // Create Stripe price for the plan
    const priceAmount = billingCycle === 'yearly' ? 
      plan.price_yearly * 100 : // Convert to cents
      plan.price_monthly * 100

    const stripePrice = await stripe.prices.create({
      unit_amount: priceAmount,
      currency: 'eur',
      recurring: {
        interval: billingCycle === 'yearly' ? 'year' : 'month'
      },
      product_data: {
        name: `CarBot ${plan.plan_name_de}`,
        description: `${plan.plan_name_de} Abonnement für ${workshop.business_name}`,
        metadata: {
          plan_type: planType,
          workshop_id: workshop.id
        }
      },
      metadata: {
        plan_id: plan.id,
        plan_type: planType
      }
    })

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{
        price: stripePrice.id
      }],
      trial_period_days: 14, // 14-day free trial
      collection_method: 'charge_automatically',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        workshop_id: workshop.id,
        plan_id: plan.id,
        plan_type: planType
      }
    })

    // Create subscription record in database
    const { data: newSubscription, error: subError } = await supabase
      .from('workshop_subscriptions')
      .insert({
        workshop_id: workshop.id,
        plan_id: plan.id,
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: stripeCustomer.id,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        billing_cycle: billingCycle
      })
      .select()
      .single()

    if (subError) {
      console.error('Database subscription creation error:', subError)
      // Clean up Stripe subscription if database fails
      await stripe.subscriptions.cancel(stripeSubscription.id)
      return NextResponse.json({
        success: false,
        error: 'Failed to create subscription record'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        subscription: newSubscription,
        stripeSubscription: {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          current_period_start: stripeSubscription.current_period_start,
          current_period_end: stripeSubscription.current_period_end,
          trial_end: stripeSubscription.trial_end
        },
        clientSecret: stripeSubscription.latest_invoice?.payment_intent?.client_secret
      },
      message: `${plan.plan_name_de} Abonnement erfolgreich erstellt!`
    }, { status: 201 })

  } catch (error) {
    console.error('Stripe subscription creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create subscription'
    }, { status: 500 })
  }
})

// GET SUBSCRIPTION STATUS - Retrieve current subscription
export const GET = withAuth(async (request, context) => {
  try {
    const { workshop } = context

    // Get current subscription from database
    const { data: subscription, error } = await supabase
      .from('workshop_subscriptions')
      .select(`
        *,
        subscription_plans (
          plan_type,
          plan_name,
          plan_name_de,
          price_monthly,
          price_yearly,
          features
        )
      `)
      .eq('workshop_id', workshop.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Subscription fetch error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch subscription'
      }, { status: 500 })
    }

    if (!subscription) {
      return NextResponse.json({
        success: true,
        data: {
          hasSubscription: false,
          trialAvailable: true
        }
      })
    }

    // Get latest Stripe subscription data
    let stripeSubscription = null
    if (subscription.stripe_subscription_id) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id,
          { expand: ['latest_invoice'] }
        )

        // Update database if Stripe status differs
        if (stripeSubscription.status !== subscription.status) {
          await supabase
            .from('workshop_subscriptions')
            .update({
              status: stripeSubscription.status,
              current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: stripeSubscription.cancel_at_period_end
            })
            .eq('id', subscription.id)
        }
      } catch (stripeError) {
        console.error('Stripe subscription fetch error:', stripeError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        hasSubscription: true,
        subscription: subscription,
        stripeStatus: stripeSubscription?.status,
        currentPeriodEnd: stripeSubscription?.current_period_end,
        cancelAtPeriodEnd: stripeSubscription?.cancel_at_period_end,
        trialEnd: stripeSubscription?.trial_end,
        nextInvoice: {
          amount: stripeSubscription?.latest_invoice?.amount_due,
          date: stripeSubscription?.latest_invoice?.period_end
        }
      }
    })

  } catch (error) {
    console.error('Subscription status error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get subscription status'
    }, { status: 500 })
  }
})

// PUT UPDATE SUBSCRIPTION - Change plan or billing cycle
export const PUT = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const { newPlanType, newBillingCycle } = body

    // Get current subscription
    const { data: currentSub, error: subError } = await supabase
      .from('workshop_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('workshop_id', workshop.id)
      .eq('status', 'active')
      .single()

    if (subError || !currentSub) {
      return NextResponse.json({
        success: false,
        error: 'No active subscription found'
      }, { status: 404 })
    }

    // Get new plan details
    const { data: newPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('plan_type', newPlanType)
      .eq('is_active', true)
      .single()

    if (planError || !newPlan) {
      return NextResponse.json({
        success: false,
        error: 'New plan not found'
      }, { status: 404 })
    }

    // Create new Stripe price for updated plan
    const priceAmount = newBillingCycle === 'yearly' ? 
      newPlan.price_yearly * 100 : 
      newPlan.price_monthly * 100

    const stripePrice = await stripe.prices.create({
      unit_amount: priceAmount,
      currency: 'eur',
      recurring: {
        interval: newBillingCycle === 'yearly' ? 'year' : 'month'
      },
      product_data: {
        name: `CarBot ${newPlan.plan_name_de}`,
        description: `${newPlan.plan_name_de} Abonnement für ${workshop.business_name}`
      },
      metadata: {
        plan_id: newPlan.id,
        plan_type: newPlanType
      }
    })

    // Update Stripe subscription
    const stripeSubscription = await stripe.subscriptions.update(
      currentSub.stripe_subscription_id,
      {
        items: [{
          id: (await stripe.subscriptions.retrieve(currentSub.stripe_subscription_id)).items.data[0].id,
          price: stripePrice.id
        }],
        proration_behavior: 'create_prorations',
        metadata: {
          workshop_id: workshop.id,
          plan_id: newPlan.id,
          plan_type: newPlanType
        }
      }
    )

    // Update database subscription
    const { data: updatedSub, error: updateError } = await supabase
      .from('workshop_subscriptions')
      .update({
        plan_id: newPlan.id,
        billing_cycle: newBillingCycle,
        status: stripeSubscription.status,
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentSub.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database subscription update error:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update subscription record'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        subscription: updatedSub,
        stripeSubscription: {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          current_period_end: stripeSubscription.current_period_end
        }
      },
      message: `Abonnement erfolgreich auf ${newPlan.plan_name_de} aktualisiert!`
    })

  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update subscription'
    }, { status: 500 })
  }
})

// DELETE CANCEL SUBSCRIPTION - Cancel at period end
export const DELETE = withAuth(async (request, context) => {
  try {
    const { workshop } = context

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('workshop_subscriptions')
      .select('*')
      .eq('workshop_id', workshop.id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      return NextResponse.json({
        success: false,
        error: 'No active subscription found'
      }, { status: 404 })
    }

    // Cancel Stripe subscription at period end
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true
      }
    )

    // Update database
    await supabase
      .from('workshop_subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id)

    return NextResponse.json({
      success: true,
      data: {
        canceledAt: stripeSubscription.current_period_end,
        remainingDays: Math.ceil((stripeSubscription.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
      },
      message: 'Abonnement wird am Ende der Abrechnungsperiode gekündigt.'
    })

  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to cancel subscription'
    }, { status: 500 })
  }
})