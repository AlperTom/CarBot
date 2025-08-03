import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Product configurations with German VAT
export const PRODUCTS = {
  starter: {
    name: 'CarBot Starter',
    monthly: {
      price: 4900, // €49 in cents
      priceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    },
    yearly: {
      price: 49000, // €490 in cents (2 months free)
      priceId: process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
    },
    features: [
      'Bis zu 100 Kundengespräche/Monat',
      'KI-basierte Service-Beratung',
      'E-Mail Support',
      'DSGVO-konforme Datenspeicherung',
      'Basic Analytics Dashboard'
    ]
  },
  professional: {
    name: 'CarBot Professional',
    monthly: {
      price: 9900, // €99 in cents
      priceId: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID,
    },
    yearly: {
      price: 99000, // €990 in cents (2 months free)
      priceId: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID,
    },
    features: [
      'Bis zu 500 Kundengespräche/Monat',
      'Erweiterte KI-Service-Beratung',
      'Intelligente Terminbuchung',
      'WhatsApp Integration',
      'Priority Support',
      'Erweiterte Analytics',
      'Lead-Management',
      'Kostenvoranschläge'
    ]
  },
  enterprise: {
    name: 'CarBot Enterprise',
    monthly: {
      price: 19900, // €199 in cents
      priceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    },
    yearly: {
      price: 199000, // €1990 in cents (2 months free)
      priceId: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
    },
    features: [
      'Unbegrenzte Kundengespräche',
      'Custom AI Training',
      'Dedicated Account Manager',
      '24/7 Premium Support',
      'White-Label Lösung',
      'API Zugang',
      'Custom Integrationen',
      'Prioritäts-Updates'
    ]
  }
}

// VAT rates for EU countries
export const VAT_RATES = {
  DE: 0.19, // Germany
  AT: 0.20, // Austria
  FR: 0.20, // France
  NL: 0.21, // Netherlands
  ES: 0.21, // Spain
  IT: 0.22, // Italy
  // Add more EU countries as needed
}

export function calculatePriceWithVAT(priceInCents, countryCode = 'DE') {
  const vatRate = VAT_RATES[countryCode] || VAT_RATES.DE
  const vatAmount = Math.round(priceInCents * vatRate)
  return {
    netPrice: priceInCents,
    vatAmount,
    grossPrice: priceInCents + vatAmount,
    vatRate: vatRate * 100
  }
}

export async function createCheckoutSession({
  priceId,
  customerId,
  customerEmail,
  workshopId,
  successUrl,
  cancelUrl,
  trialPeriodDays = 14,
  userId // Add userId for workshop validation
}) {
  try {
    // Validate workshop ownership before processing payment
    if (!userId || !workshopId) {
      throw new Error('User ID and Workshop ID are required for payment processing')
    }

    // Import Supabase client for validation
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )

    // Verify workshop ownership
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('id, owner_id, owner_email, active')
      .eq('id', workshopId)
      .eq('active', true)
      .single()

    if (workshopError || !workshop) {
      throw new Error('Workshop not found or inactive')
    }

    // Verify user owns this workshop
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError || !user || user.user.email !== workshop.owner_email) {
      throw new Error('Unauthorized: User does not own this workshop')
    }

    // Validate price ID against allowed plans
    const allowedPriceIds = [
      process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
      process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
      process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID,
      process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID,
      process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
      process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID
    ].filter(Boolean)

    if (!allowedPriceIds.includes(priceId)) {
      throw new Error('Invalid price ID')
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: !customerId ? customerEmail : undefined,
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: {
        enabled: true,
      },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      subscription_data: {
        trial_period_days: trialPeriodDays,
        metadata: {
          workshop_id: workshopId,
        },
      },
      metadata: {
        workshop_id: workshopId,
      },
      locale: 'de',
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error(`Checkout session creation failed: ${error.message}`)
  }
}

export async function createCustomer({
  email,
  name,
  workshopName,
  address,
  taxId
}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      description: `Workshop: ${workshopName}`,
      address: address ? {
        line1: address.street,
        city: address.city,
        postal_code: address.postalCode,
        country: address.country || 'DE',
      } : undefined,
      tax_id: taxId ? {
        type: 'eu_vat',
        value: taxId,
      } : undefined,
      metadata: {
        workshop_name: workshopName,
        created_via: 'carbot_registration',
      },
    })

    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw new Error(`Customer creation failed: ${error.message}`)
  }
}

export async function getSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'items.data.price'],
    })
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    throw new Error(`Subscription retrieval failed: ${error.message}`)
  }
}

export async function updateSubscription(subscriptionId, { priceId, prorationBehavior = 'always_invoice' }) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
      proration_behavior: prorationBehavior,
    })

    return updatedSubscription
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw new Error(`Subscription update failed: ${error.message}`)
  }
}

export async function cancelSubscription(subscriptionId, { immediately = false } = {}) {
  try {
    if (immediately) {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      return subscription
    } else {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })
      return subscription
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error(`Subscription cancellation failed: ${error.message}`)
  }
}

export async function createCustomerPortalSession(customerId, returnUrl) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      locale: 'de',
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw new Error(`Portal session creation failed: ${error.message}`)
  }
}

export async function getInvoices(customerId, limit = 10) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
      expand: ['data.subscription'],
    })

    return invoices.data
  } catch (error) {
    console.error('Error retrieving invoices:', error)
    throw new Error(`Invoice retrieval failed: ${error.message}`)
  }
}

export async function getUsageRecords(subscriptionItemId, startTime, endTime) {
  try {
    const usageRecords = await stripe.subscriptionItems.listUsageRecordSummaries(
      subscriptionItemId,
      {
        limit: 100,
      }
    )

    return usageRecords.data
  } catch (error) {
    console.error('Error retrieving usage records:', error)
    throw new Error(`Usage records retrieval failed: ${error.message}`)
  }
}

export function formatPrice(amountInCents, currency = 'EUR', locale = 'de-DE') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amountInCents / 100)
}

export function getProductNameFromPriceId(priceId) {
  for (const [key, product] of Object.entries(PRODUCTS)) {
    if (product.monthly.priceId === priceId || product.yearly.priceId === priceId) {
      return {
        key,
        name: product.name,
        billing: product.monthly.priceId === priceId ? 'monthly' : 'yearly'
      }
    }
  }
  return { key: 'unknown', name: 'Unknown Plan', billing: 'monthly' }
}

// Webhook signature verification with security enforcement
export function verifyWebhookSignature(payload, signature, secret) {
  try {
    // Enforce secret key requirement - never allow bypass
    if (!secret || secret.trim().length === 0) {
      throw new Error('Webhook secret key is required for security')
    }

    if (!signature || signature.trim().length === 0) {
      throw new Error('Webhook signature is required')
    }

    if (!payload) {
      throw new Error('Webhook payload is required')
    }

    // Verify signature using Stripe's built-in verification
    const event = stripe.webhooks.constructEvent(payload, signature, secret)
    
    return {
      success: true,
      event: event
    }
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Error handling with German translations
export function getErrorMessage(error, language = 'de') {
  const messages = {
    de: {
      card_declined: 'Ihre Karte wurde abgelehnt. Bitte versuchen Sie eine andere Zahlungsmethode.',
      insufficient_funds: 'Nicht genügend Guthaben auf dem Konto.',
      expired_card: 'Ihre Karte ist abgelaufen. Bitte aktualisieren Sie Ihre Zahlungsmethode.',
      incorrect_cvc: 'Der Sicherheitscode Ihrer Karte ist falsch.',
      processing_error: 'Bei der Verarbeitung Ihrer Zahlung ist ein Fehler aufgetreten.',
      default: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
    },
    en: {
      card_declined: 'Your card was declined. Please try a different payment method.',
      insufficient_funds: 'Insufficient funds in the account.',
      expired_card: 'Your card has expired. Please update your payment method.',
      incorrect_cvc: 'Your card\'s security code is incorrect.',
      processing_error: 'An error occurred while processing your payment.',
      default: 'An unexpected error occurred. Please try again.'
    }
  }

  const errorCode = error.code || 'default'
  const langMessages = messages[language] || messages.de
  return langMessages[errorCode] || langMessages.default
}

// Additional exports for compatibility
export const STRIPE_PRODUCTS = PRODUCTS
export const GERMAN_LABELS = {
  starter: 'Starter',
  professional: 'Professional', 
  enterprise: 'Enterprise',
  monthly: 'Monatlich',
  yearly: 'Jährlich',
  free_trial: '14 Tage kostenlos testen',
  cancel_anytime: 'Jederzeit kündbar'
}

export const createStripeCustomer = createCustomer
export const createPortalSession = createCustomerPortalSession
export const getCustomerInvoices = getInvoices

export function handleStripeError(error, language = 'de') {
  return getErrorMessage(error, language)
}

export async function getUsageSummary(customerId, startDate, endDate) {
  try {
    const invoices = await getInvoices(customerId, 50)
    const filteredInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created * 1000)
      return invoiceDate >= startDate && invoiceDate <= endDate
    })
    
    return {
      totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.amount_paid, 0),
      invoiceCount: filteredInvoices.length,
      period: { start: startDate, end: endDate }
    }
  } catch (error) {
    console.error('Error getting usage summary:', error)
    throw error
  }
}

export async function reactivateSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })
    return subscription
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

export async function reportUsage(subscriptionItemId, quantity, timestamp = Math.floor(Date.now() / 1000)) {
  try {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        timestamp,
        action: 'increment',
      }
    )
    return usageRecord
  } catch (error) {
    console.error('Error reporting usage:', error)
    throw error
  }
}

export default stripe