/**
 * Package-based Feature System for CarBot
 * Enforces subscription limits and feature availability
 * Based on German pricing tiers: Basic (29€), Professional (79€), Enterprise (Individual)
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Package definitions with German pricing structure
export const PACKAGES = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    priceEur: 29,
    limits: {
      monthlyLeads: 100,
      users: 1,
      apiCalls: 0,
      storageGB: 1,
      integrations: 1
    },
    features: {
      emailSupport: true,
      phoneSupport: false,
      basicDashboard: true,
      advancedAnalytics: false,
      apiAccess: false,
      customIntegrations: false,
      personalSupport: false,
      whiteLabel: false
    },
    supportLevel: 'email'
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    priceEur: 79,
    limits: {
      monthlyLeads: -1, // Unlimited
      users: 5,
      apiCalls: 10000,
      storageGB: 10,
      integrations: 10
    },
    features: {
      emailSupport: true,
      phoneSupport: true,
      basicDashboard: true,
      advancedAnalytics: true,
      apiAccess: true,
      customIntegrations: false,
      personalSupport: false,
      whiteLabel: false
    },
    supportLevel: 'phone'
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise Individual',
    priceEur: null, // Individual pricing
    limits: {
      monthlyLeads: -1, // Unlimited
      users: -1, // Unlimited
      apiCalls: -1, // Unlimited
      storageGB: -1, // Unlimited
      integrations: -1 // Unlimited
    },
    features: {
      emailSupport: true,
      phoneSupport: true,
      basicDashboard: true,
      advancedAnalytics: true,
      apiAccess: true,
      customIntegrations: true,
      personalSupport: true,
      whiteLabel: true
    },
    supportLevel: 'dedicated'
  }
}

/**
 * Get workshop's current subscription package
 * @param {string} workshopId - Workshop UUID
 * @returns {Promise<Object>} Package information with current usage
 */
export async function getWorkshopPackage(workshopId) {
  try {
    // Get workshop with subscription info
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select(`
        id,
        name,
        subscription_plan,
        current_period_start,
        current_period_end,
        monthly_leads_limit,
        subscriptions (
          id,
          plan_id,
          status,
          current_period_start,
          current_period_end
        )
      `)
      .eq('id', workshopId)
      .single()

    if (workshopError) {
      console.error('Error fetching workshop:', workshopError)
      return null
    }

    // Default to Basic package if no subscription
    const planId = workshop.subscriptions?.[0]?.plan_id || 'basic'
    const packageInfo = PACKAGES[planId.toUpperCase()] || PACKAGES.BASIC

    // Get current usage for this billing period
    const periodStart = workshop.current_period_start || new Date().toISOString().split('T')[0]
    const periodEnd = workshop.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('metric_name, quantity')
      .eq('workshop_id', workshopId)
      .gte('usage_date', periodStart)
      .lte('usage_date', periodEnd)

    // Calculate current usage
    const currentUsage = {
      leads: usage?.find(u => u.metric_name === 'leads')?.quantity || 0,
      apiCalls: usage?.find(u => u.metric_name === 'api_calls')?.quantity || 0,
      storage: usage?.find(u => u.metric_name === 'storage_gb')?.quantity || 0
    }

    return {
      ...packageInfo,
      subscription: workshop.subscriptions?.[0] || null,
      currentUsage,
      billingPeriod: {
        start: periodStart,
        end: periodEnd
      },
      workshop: {
        id: workshop.id,
        name: workshop.name
      }
    }
  } catch (error) {
    console.error('Error getting workshop package:', error)
    return null
  }
}

/**
 * Check if workshop can perform specific action based on package limits
 * @param {string} workshopId - Workshop UUID
 * @param {string} action - Action to check (leads, apiCall, storage, etc.)
 * @param {number} quantity - Quantity requested (default: 1)
 * @returns {Promise<Object>} Check result with allowed status and details
 */
export async function checkPackageLimit(workshopId, action, quantity = 1) {
  try {
    const packageInfo = await getWorkshopPackage(workshopId)
    
    if (!packageInfo) {
      return {
        allowed: false,
        reason: 'Unable to determine package information',
        upgrade_required: true
      }
    }

    const actionMap = {
      'lead': 'monthlyLeads',
      'api_call': 'apiCalls',
      'storage': 'storageGB',
      'user': 'users',
      'integration': 'integrations'
    }

    const limitKey = actionMap[action]
    if (!limitKey) {
      return {
        allowed: false,
        reason: `Unknown action: ${action}`
      }
    }

    const limit = packageInfo.limits[limitKey]
    
    // Unlimited access (-1)
    if (limit === -1) {
      return {
        allowed: true,
        unlimited: true,
        package: packageInfo.name
      }
    }

    // Check current usage against limit
    const currentUsage = packageInfo.currentUsage[action === 'lead' ? 'leads' : action === 'api_call' ? 'apiCalls' : 'storage'] || 0
    const newTotal = currentUsage + quantity

    if (newTotal > limit) {
      return {
        allowed: false,
        reason: `${action} limit exceeded`,
        current_usage: currentUsage,
        limit: limit,
        requested: quantity,
        package: packageInfo.name,
        upgrade_required: true,
        upgrade_suggestion: packageInfo.id === 'basic' ? 'professional' : 'enterprise'
      }
    }

    return {
      allowed: true,
      current_usage: currentUsage,
      limit: limit,
      remaining: limit - newTotal,
      package: packageInfo.name
    }
  } catch (error) {
    console.error('Error checking package limit:', error)
    return {
      allowed: false,
      reason: 'Error checking limits',
      error: error.message
    }
  }
}

/**
 * Check if workshop has access to specific feature
 * @param {string} workshopId - Workshop UUID
 * @param {string} feature - Feature to check
 * @returns {Promise<Object>} Feature access result
 */
export async function checkFeatureAccess(workshopId, feature) {
  try {
    const packageInfo = await getWorkshopPackage(workshopId)
    
    if (!packageInfo) {
      return {
        allowed: false,
        reason: 'Unable to determine package information'
      }
    }

    const hasAccess = packageInfo.features[feature] || false

    return {
      allowed: hasAccess,
      package: packageInfo.name,
      feature: feature,
      upgrade_required: !hasAccess,
      upgrade_suggestion: hasAccess ? null : (packageInfo.id === 'basic' ? 'professional' : 'enterprise')
    }
  } catch (error) {
    console.error('Error checking feature access:', error)
    return {
      allowed: false,
      reason: 'Error checking feature access',
      error: error.message
    }
  }
}

/**
 * Record usage for tracking and billing
 * @param {string} workshopId - Workshop UUID
 * @param {string} metric - Metric name (leads, api_calls, storage_gb)
 * @param {number} quantity - Quantity to record
 * @returns {Promise<boolean>} Success status
 */
export async function recordUsage(workshopId, metric, quantity = 1) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const packageInfo = await getWorkshopPackage(workshopId)
    
    if (!packageInfo) {
      console.error('Could not record usage - package info unavailable')
      return false
    }

    // Check if usage record exists for today
    const { data: existingUsage } = await supabase
      .from('usage_tracking')
      .select('id, quantity')
      .eq('workshop_id', workshopId)
      .eq('metric_name', metric)
      .eq('usage_date', today)
      .single()

    if (existingUsage) {
      // Update existing record
      const { error } = await supabase
        .from('usage_tracking')
        .update({
          quantity: existingUsage.quantity + quantity
        })
        .eq('id', existingUsage.id)

      if (error) {
        console.error('Error updating usage:', error)
        return false
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('usage_tracking')
        .insert({
          workshop_id: workshopId,
          metric_name: metric,
          usage_date: today,
          quantity: quantity,
          billing_period_start: packageInfo.billingPeriod.start,
          billing_period_end: packageInfo.billingPeriod.end
        })

      if (error) {
        console.error('Error inserting usage:', error)
        return false
      }
    }

    // Check if we need to send limit warnings
    await checkAndSendLimitWarnings(workshopId, metric)

    return true
  } catch (error) {
    console.error('Error recording usage:', error)
    return false
  }
}

/**
 * Check usage limits and send warnings if approaching limits
 * @param {string} workshopId - Workshop UUID
 * @param {string} metric - Metric to check
 */
async function checkAndSendLimitWarnings(workshopId, metric) {
  try {
    const limitCheck = await checkPackageLimit(workshopId, metric === 'leads' ? 'lead' : metric)
    
    if (limitCheck.allowed && limitCheck.limit && !limitCheck.unlimited) {
      const usagePercentage = (limitCheck.current_usage / limitCheck.limit) * 100
      
      // Send warning at 80% usage
      if (usagePercentage >= 80 && usagePercentage < 95) {
        await sendUsageWarning(workshopId, metric, '80_percent', limitCheck)
      }
      // Send urgent warning at 95% usage
      else if (usagePercentage >= 95) {
        await sendUsageWarning(workshopId, metric, '95_percent', limitCheck)
      }
    }
  } catch (error) {
    console.error('Error checking limit warnings:', error)
  }
}

/**
 * Send usage warning notification
 * @param {string} workshopId - Workshop UUID
 * @param {string} metric - Metric name
 * @param {string} warningType - Type of warning (80_percent, 95_percent, limit_exceeded)
 * @param {Object} limitCheck - Current limit check result
 */
async function sendUsageWarning(workshopId, metric, warningType, limitCheck) {
  try {
    const warningMessages = {
      '80_percent': `Sie haben 80% Ihres ${metric}-Limits erreicht (${limitCheck.current_usage}/${limitCheck.limit})`,
      '95_percent': `Achtung: Sie haben 95% Ihres ${metric}-Limits erreicht (${limitCheck.current_usage}/${limitCheck.limit})`,
      'limit_exceeded': `Ihr ${metric}-Limit wurde erreicht (${limitCheck.current_usage}/${limitCheck.limit})`
    }

    // Store notification in database
    await supabase
      .from('billing_events')
      .insert({
        workshop_id: workshopId,
        event_type: 'usage_warning',
        event_data: {
          metric,
          warning_type: warningType,
          current_usage: limitCheck.current_usage,
          limit: limitCheck.limit,
          message: warningMessages[warningType]
        },
        created_at: new Date().toISOString()
      })

    console.log(`Usage warning sent for workshop ${workshopId}: ${warningMessages[warningType]}`)
  } catch (error) {
    console.error('Error sending usage warning:', error)
  }
}

/**
 * Get package features comparison for upgrade suggestions
 * @returns {Object} Features comparison between packages
 */
export function getPackageComparison() {
  return {
    basic: PACKAGES.BASIC,
    professional: PACKAGES.PROFESSIONAL,
    enterprise: PACKAGES.ENTERPRISE,
    comparison: {
      limits: {
        monthlyLeads: {
          basic: PACKAGES.BASIC.limits.monthlyLeads,
          professional: 'Unbegrenzt',
          enterprise: 'Unbegrenzt'
        },
        support: {
          basic: 'E-Mail Support',
          professional: 'Telefon Support',
          enterprise: 'Persönlicher Support'
        },
        analytics: {
          basic: 'Basis-Dashboard',
          professional: 'Erweiterte Analysen',
          enterprise: 'Erweiterte Analysen + Custom Reports'
        },
        api: {
          basic: 'Kein API-Zugang',
          professional: 'API-Zugang',
          enterprise: 'API-Zugang + Custom Integrationen'
        }
      }
    }
  }
}

/**
 * Generate upgrade URL for workshop
 * @param {string} workshopId - Workshop UUID
 * @param {string} targetPackage - Target package (professional, enterprise)
 * @returns {string} Upgrade URL
 */
export function generateUpgradeUrl(workshopId, targetPackage) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://carbot.chat'
  return `${baseUrl}/dashboard/billing?upgrade=${targetPackage}&workshop=${workshopId}`
}

/**
 * Helper to format German currency
 * @param {number} amount - Amount in EUR
 * @returns {string} Formatted currency string
 */
export function formatEuroCurrency(amount) {
  if (!amount) return 'Individuell'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export default {
  PACKAGES,
  getWorkshopPackage,
  checkPackageLimit,
  checkFeatureAccess,
  recordUsage,
  getPackageComparison,
  generateUpgradeUrl,
  formatEuroCurrency
}