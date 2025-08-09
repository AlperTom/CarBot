/**
 * Enhanced Stripe Checkout Integration for Package Upgrades
 * Creates checkout sessions with proper German localization and upgrade handling
 */

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getWorkshopPackage, PACKAGES } from '@/lib/packageFeatures'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * POST /api/packages/checkout - Create Stripe checkout session for upgrade
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      workshop_id, 
      target_package, 
      billing_cycle = 'monthly',
      success_url,
      cancel_url 
    } = body

    if (!workshop_id || !target_package) {
      return NextResponse.json({
        error: 'Workshop ID and target package required'
      }, { status: 400 })
    }

    // Get current package info
    const currentPackage = await getWorkshopPackage(workshop_id)
    if (!currentPackage) {
      return NextResponse.json({
        error: 'Workshop not found'
      }, { status: 404 })
    }

    // Get target package config
    const targetPackageConfig = PACKAGES[target_package.toUpperCase()]
    if (!targetPackageConfig) {
      return NextResponse.json({
        error: 'Invalid target package'
      }, { status: 400 })
    }

    // Don't allow downgrade through this endpoint
    const packageHierarchy = { basic: 1, professional: 2, enterprise: 3 }
    if (packageHierarchy[target_package] <= packageHierarchy[currentPackage.id]) {
      return NextResponse.json({
        error: 'Cannot downgrade through this endpoint'
      }, { status: 400 })
    }

    // Get workshop details for customer info
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('name, email, owner_name')
      .eq('id', workshop_id)
      .single()

    if (workshopError || !workshop) {
      return NextResponse.json({
        error: 'Workshop details not found'
      }, { status: 404 })
    }

    // Calculate pricing
    const basePrice = targetPackageConfig.priceEur * 100 // Convert to cents
    const finalPrice = billing_cycle === 'annual' ? basePrice * 10 : basePrice // 10 months for annual
    
    // Create or get Stripe customer
    let customerId = currentPackage.subscription?.stripe_customer_id
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: workshop.email,
        name: workshop.owner_name || workshop.name,
        metadata: {
          workshop_id: workshop_id,
          workshop_name: workshop.name
        }
      })
      customerId = customer.id

      // Store customer ID
      await supabase
        .from('workshops')
        .update({ stripe_customer_id: customerId })
        .eq('id', workshop_id)
    }

    // Build line items
    const lineItems = [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `CarBot ${targetPackageConfig.name} Plan`,
          description: getPackageDescription(targetPackageConfig),
          metadata: {
            package_id: target_package,
            workshop_id: workshop_id
          }
        },
        unit_amount: finalPrice,
        recurring: {
          interval: billing_cycle === 'annual' ? 'year' : 'month'
        }
      },
      quantity: 1
    }]

    // Add setup fee for immediate upgrade if mid-cycle
    if (currentPackage.subscription && isUpgradeMidCycle(currentPackage)) {
      const prorationAmount = calculateProration(currentPackage, targetPackageConfig)
      if (prorationAmount > 0) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Upgrade-Gebühr (anteiliger Betrag)',
              description: 'Sofortige Aktivierung des neuen Plans'
            },
            unit_amount: Math.round(prorationAmount * 100)
          },
          quantity: 1
        })
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card', 'sepa_debit'],
      line_items: lineItems,
      mode: 'subscription',
      locale: 'de',
      
      // URLs
      success_url: success_url || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?upgrade=cancelled`,
      
      // Customer details
      customer_update: {
        name: 'auto',
        address: 'auto'
      },
      
      // Subscription settings
      subscription_data: {
        description: `CarBot ${targetPackageConfig.name} Plan für ${workshop.name}`,
        metadata: {
          workshop_id: workshop_id,
          previous_package: currentPackage.id,
          target_package: target_package,
          billing_cycle: billing_cycle,
          upgrade_timestamp: new Date().toISOString()
        },
        trial_period_days: currentPackage.id === 'basic' && target_package === 'professional' ? 14 : 0
      },
      
      // Tax settings for German VAT
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      
      // Discounts (if annual billing)
      ...(billing_cycle === 'annual' && {
        discounts: [{
          coupon: await getOrCreateAnnualDiscount()
        }]
      }),
      
      // Additional metadata
      metadata: {
        workshop_id: workshop_id,
        target_package: target_package,
        billing_cycle: billing_cycle,
        upgrade_type: 'package_upgrade'
      }
    })

    // Store checkout session for tracking
    await supabase
      .from('checkout_sessions')
      .insert({
        session_id: session.id,
        workshop_id: workshop_id,
        target_package: target_package,
        billing_cycle: billing_cycle,
        amount: finalPrice,
        currency: 'eur',
        status: 'pending',
        created_at: new Date().toISOString()
      })

    // Log upgrade attempt
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshop_id,
        event_type: 'upgrade_attempt',
        event_data: {
          target_package: target_package,
          billing_cycle: billing_cycle,
          session_id: session.id,
          current_package: currentPackage.id
        },
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
      customer_id: customerId,
      package_info: {
        current: currentPackage.name,
        target: targetPackageConfig.name,
        price: finalPrice / 100,
        billing_cycle: billing_cycle,
        trial_days: session.subscription_data?.trial_period_days || 0
      }
    })

  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json({
      error: 'Failed to create checkout session',
      details: error.message
    }, { status: 500 })
  }
}

/**
 * GET /api/packages/checkout - Get checkout session status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const session_id = searchParams.get('session_id')
    
    if (!session_id) {
      return NextResponse.json({
        error: 'Session ID required'
      }, { status: 400 })
    }

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'customer']
    })

    // Get local session data
    const { data: localSession, error } = await supabase
      .from('checkout_sessions')
      .select('*')
      .eq('session_id', session_id)
      .single()

    if (error) {
      console.error('Error fetching local session:', error)
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.payment_status,
        mode: session.mode,
        customer: session.customer,
        subscription: session.subscription,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
        local_data: localSession
      }
    })

  } catch (error) {
    console.error('Checkout status error:', error)
    return NextResponse.json({
      error: 'Failed to retrieve checkout session',
      details: error.message
    }, { status: 500 })
  }
}

/**
 * Helper functions
 */

function getPackageDescription(packageConfig) {
  const features = []
  
  if (packageConfig.limits.monthlyLeads === -1) {
    features.push('Unbegrenzte monatliche Leads')
  } else {
    features.push(`${packageConfig.limits.monthlyLeads} Leads/Monat`)
  }
  
  if (packageConfig.features.apiAccess) {
    features.push('API-Zugang')
  }
  
  if (packageConfig.features.phoneSupport) {
    features.push('Telefon-Support')
  }
  
  if (packageConfig.features.advancedAnalytics) {
    features.push('Erweiterte Analysen')
  }
  
  return features.join(' • ')
}

function isUpgradeMidCycle(currentPackage) {
  if (!currentPackage.billingPeriod) return false
  
  const now = new Date()
  const periodEnd = new Date(currentPackage.billingPeriod.end)
  const periodStart = new Date(currentPackage.billingPeriod.start)
  
  const periodLength = periodEnd - periodStart
  const timeRemaining = periodEnd - now
  
  // Consider mid-cycle if more than 7 days remaining
  return timeRemaining > 7 * 24 * 60 * 60 * 1000
}

function calculateProration(currentPackage, targetPackage) {
  if (!currentPackage.billingPeriod || !currentPackage.priceEur || !targetPackage.priceEur) {
    return 0
  }
  
  const now = new Date()
  const periodEnd = new Date(currentPackage.billingPeriod.end)
  const periodStart = new Date(currentPackage.billingPeriod.start)
  
  const daysRemaining = Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil((periodEnd - periodStart) / (1000 * 60 * 60 * 24))
  
  if (daysRemaining <= 0 || totalDays <= 0) return 0
  
  const priceDifference = targetPackage.priceEur - currentPackage.priceEur
  const prorationRatio = daysRemaining / totalDays
  
  return Math.max(0, priceDifference * prorationRatio)
}

async function getOrCreateAnnualDiscount() {
  try {
    // Try to get existing coupon
    const existingCoupons = await stripe.coupons.list({
      limit: 1
    })
    
    const annualCoupon = existingCoupons.data.find(c => c.id === 'annual-17-percent-off')
    
    if (annualCoupon) {
      return annualCoupon.id
    }
    
    // Create new coupon
    const coupon = await stripe.coupons.create({
      id: 'annual-17-percent-off',
      name: 'Annual Billing Discount',
      percent_off: 17,
      duration: 'repeating',
      duration_in_months: 12,
      metadata: {
        discount_type: 'annual_billing'
      }
    })
    
    return coupon.id
  } catch (error) {
    console.error('Error creating annual discount:', error)
    return null
  }
}