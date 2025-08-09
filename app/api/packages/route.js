/**
 * Package Management API - Comprehensive Package Feature Control
 * CarBot MVP - German Automotive Workshop Package System
 * Implements package-based feature access, upgrade flows, and billing integration
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
  PACKAGES, 
  getWorkshopPackage, 
  checkFeatureAccess, 
  checkPackageLimit,
  getPackageComparison,
  generateUpgradeUrl,
  formatEuroCurrency
} from '../../../lib/packageFeatures.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * GET /api/packages - Get package information and comparison
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const workshopId = searchParams.get('workshop_id')
    const action = searchParams.get('action') || 'list'

    switch (action) {
      case 'current':
        return handleGetCurrentPackage(workshopId)
      case 'comparison':
        return handleGetPackageComparison()
      case 'usage':
        return handleGetUsageDetails(workshopId)
      case 'upgrade_options':
        return handleGetUpgradeOptions(workshopId)
      default:
        return handleListAllPackages()
    }

  } catch (error) {
    console.error('Packages API error:', error)
    return NextResponse.json({
      error: 'Failed to process package request'
    }, { status: 500 })
  }
}

/**
 * POST /api/packages - Package operations (upgrade, downgrade, etc.)
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, workshop_id, target_package, billing_cycle } = body

    if (!workshop_id) {
      return NextResponse.json({
        error: 'Workshop ID required'
      }, { status: 400 })
    }

    switch (action) {
      case 'initiate_upgrade':
        return handleInitiateUpgrade(workshop_id, target_package, billing_cycle)
      case 'calculate_proration':
        return handleCalculateProration(workshop_id, target_package)
      case 'preview_limits':
        return handlePreviewLimits(target_package)
      default:
        return NextResponse.json({
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Package operation error:', error)
    return NextResponse.json({
      error: 'Failed to process package operation'
    }, { status: 500 })
  }
}

/**
 * Handle getting current package for workshop
 */
async function handleGetCurrentPackage(workshopId) {
  if (!workshopId) {
    return NextResponse.json({
      error: 'Workshop ID required'
    }, { status: 400 })
  }

  try {
    const packageInfo = await getWorkshopPackage(workshopId)
    
    if (!packageInfo) {
      return NextResponse.json({
        error: 'Workshop not found'
      }, { status: 404 })
    }

    // Get feature access details
    const featureAccess = {}
    const featureList = [
      'emailSupport', 'phoneSupport', 'basicDashboard', 'advancedAnalytics',
      'apiAccess', 'customIntegrations', 'personalSupport', 'whiteLabel'
    ]

    for (const feature of featureList) {
      featureAccess[feature] = await checkFeatureAccess(workshopId, feature)
    }

    // Get current usage percentage
    const usagePercentages = {}
    if (packageInfo.limits.monthlyLeads !== -1) {
      usagePercentages.leads = Math.round(
        (packageInfo.currentUsage.leads / packageInfo.limits.monthlyLeads) * 100
      )
    }

    return NextResponse.json({
      success: true,
      package: {
        ...packageInfo,
        feature_access: featureAccess,
        usage_percentages: usagePercentages,
        formatted_price: formatEuroCurrency(packageInfo.priceEur),
        is_unlimited: packageInfo.limits.monthlyLeads === -1
      }
    })

  } catch (error) {
    console.error('Get current package error:', error)
    return NextResponse.json({
      error: 'Failed to get package information'
    }, { status: 500 })
  }
}

/**
 * Handle package comparison
 */
async function handleGetPackageComparison() {
  try {
    const comparison = getPackageComparison()
    
    // Add German-specific formatting
    const formattedComparison = {
      packages: {
        basic: {
          ...comparison.basic,
          formatted_price: formatEuroCurrency(comparison.basic.priceEur),
          billing_options: [
            { cycle: 'monthly', price: comparison.basic.priceEur, label: 'Monatlich' },
            { cycle: 'annual', price: comparison.basic.priceEur * 10, label: 'Jährlich (2 Monate kostenlos)' }
          ]
        },
        professional: {
          ...comparison.professional,
          formatted_price: formatEuroCurrency(comparison.professional.priceEur),
          billing_options: [
            { cycle: 'monthly', price: comparison.professional.priceEur, label: 'Monatlich' },
            { cycle: 'annual', price: comparison.professional.priceEur * 10, label: 'Jährlich (2 Monate kostenlos)' }
          ],
          popular: true
        },
        enterprise: {
          ...comparison.enterprise,
          formatted_price: 'Individuell',
          billing_options: [
            { cycle: 'custom', price: null, label: 'Individuelle Vereinbarung' }
          ],
          contact_required: true
        }
      },
      feature_comparison: {
        'Monatliche Leads': {
          basic: '100',
          professional: 'Unbegrenzt',
          enterprise: 'Unbegrenzt'
        },
        'API-Zugang': {
          basic: '❌ Nicht verfügbar',
          professional: '✅ 10,000 Aufrufe/Monat',
          enterprise: '✅ Unbegrenzt'
        },
        'Landing Pages': {
          basic: '❌ Nicht verfügbar',
          professional: '✅ 5 professionelle Templates',
          enterprise: '✅ Unlimited + Custom Design'
        },
        'Support': {
          basic: 'E-Mail (48h)',
          professional: 'Telefon + E-Mail (24h)',
          enterprise: 'Persönlicher Account Manager'
        },
        'Analysen': {
          basic: 'Basis-Dashboard',
          professional: 'Erweiterte Analysen',
          enterprise: 'Custom Reports + Insights'
        },
        'White-Label': {
          basic: '❌',
          professional: '❌',
          enterprise: '✅ Vollständiges Branding'
        }
      }
    }

    return NextResponse.json({
      success: true,
      comparison: formattedComparison
    })

  } catch (error) {
    console.error('Package comparison error:', error)
    return NextResponse.json({
      error: 'Failed to get package comparison'
    }, { status: 500 })
  }
}

/**
 * Handle getting detailed usage information
 */
async function handleGetUsageDetails(workshopId) {
  if (!workshopId) {
    return NextResponse.json({
      error: 'Workshop ID required'
    }, { status: 400 })
  }

  try {
    const packageInfo = await getWorkshopPackage(workshopId)
    if (!packageInfo) {
      return NextResponse.json({
        error: 'Workshop not found'
      }, { status: 404 })
    }

    // Get detailed usage over time
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const { data: dailyUsage } = await supabase
      .from('usage_tracking')
      .select('usage_date, metric_name, quantity')
      .eq('workshop_id', workshopId)
      .gte('usage_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('usage_date', { ascending: true })

    // Process usage data
    const usageByDate = {}
    const metricsTotal = {}
    
    dailyUsage?.forEach(record => {
      const date = record.usage_date
      if (!usageByDate[date]) {
        usageByDate[date] = {}
      }
      usageByDate[date][record.metric_name] = record.quantity
      metricsTotal[record.metric_name] = (metricsTotal[record.metric_name] || 0) + record.quantity
    })

    // Calculate usage trends
    const usageTrend = calculateUsageTrend(dailyUsage)
    
    // Get limit warnings
    const limitWarnings = []
    for (const metric of ['leads', 'api_calls', 'storage']) {
      const check = await checkPackageLimit(workshopId, metric)
      if (!check.allowed || (check.current_usage / check.limit) > 0.8) {
        limitWarnings.push({
          metric,
          usage: check.current_usage,
          limit: check.limit,
          percentage: Math.round((check.current_usage / check.limit) * 100),
          warning_level: check.current_usage >= check.limit ? 'critical' : 
                        (check.current_usage / check.limit) > 0.95 ? 'high' : 'medium'
        })
      }
    }

    return NextResponse.json({
      success: true,
      usage: {
        current_period: {
          start: packageInfo.billingPeriod.start,
          end: packageInfo.billingPeriod.end,
          metrics: metricsTotal
        },
        daily_breakdown: usageByDate,
        trends: usageTrend,
        warnings: limitWarnings,
        package: {
          name: packageInfo.name,
          limits: packageInfo.limits,
          unlimited_features: Object.keys(packageInfo.limits).filter(
            key => packageInfo.limits[key] === -1
          )
        }
      }
    })

  } catch (error) {
    console.error('Usage details error:', error)
    return NextResponse.json({
      error: 'Failed to get usage details'
    }, { status: 500 })
  }
}

/**
 * Handle upgrade options
 */
async function handleGetUpgradeOptions(workshopId) {
  if (!workshopId) {
    return NextResponse.json({
      error: 'Workshop ID required'
    }, { status: 400 })
  }

  try {
    const currentPackage = await getWorkshopPackage(workshopId)
    if (!currentPackage) {
      return NextResponse.json({
        error: 'Workshop not found'
      }, { status: 404 })
    }

    const upgradeOptions = []
    const currentTier = currentPackage.id

    // Define upgrade paths
    if (currentTier === 'basic') {
      upgradeOptions.push(
        {
          target_package: 'professional',
          benefits: [
            'Unbegrenzte monatliche Leads',
            '5 professionelle Landing Page Templates',
            'API-Zugang (10,000 Aufrufe/Monat)',
            'Erweiterte Analysen und Berichte',
            'Telefon-Support (24h Response)',
            'Google Analytics Integration'
          ],
          pricing: {
            monthly: PACKAGES.PROFESSIONAL.priceEur,
            annual: PACKAGES.PROFESSIONAL.priceEur * 10,
            savings_annual: PACKAGES.PROFESSIONAL.priceEur * 2
          },
          upgrade_urgency: calculateUpgradeUrgency(currentPackage, 'professional')
        },
        {
          target_package: 'enterprise',
          benefits: [
            'Alle Professional Features',
            'Unbegrenzte API-Aufrufe',
            'Custom Landing Page Design',
            'White-Label Lösung',
            'Persönlicher Account Manager',
            'Custom Integrationen',
            'Priority Feature Requests'
          ],
          pricing: {
            monthly: null,
            contact_required: true,
            estimated_range: '€199-€499/Monat'
          },
          upgrade_urgency: 'low'
        }
      )
    } else if (currentTier === 'professional') {
      upgradeOptions.push({
        target_package: 'enterprise',
        benefits: [
          'Unbegrenzte API-Aufrufe',
          'White-Label Branding',
          'Custom Template Design',
          'Dedicated Account Manager',
          'Custom Integrationen (CRM, etc.)',
          'Priority Development',
          'SLA Garantie'
        ],
        pricing: {
          contact_required: true,
          estimated_range: '€199-€499/Monat'
        },
        upgrade_urgency: calculateUpgradeUrgency(currentPackage, 'enterprise')
      })
    }

    return NextResponse.json({
      success: true,
      current_package: {
        id: currentTier,
        name: currentPackage.name,
        price: formatEuroCurrency(currentPackage.priceEur)
      },
      upgrade_options: upgradeOptions,
      discount_available: checkAvailableDiscounts(currentPackage),
      upgrade_urls: upgradeOptions.reduce((urls, option) => {
        urls[option.target_package] = generateUpgradeUrl(workshopId, option.target_package)
        return urls
      }, {})
    })

  } catch (error) {
    console.error('Upgrade options error:', error)
    return NextResponse.json({
      error: 'Failed to get upgrade options'
    }, { status: 500 })
  }
}

/**
 * Handle list all packages
 */
async function handleListAllPackages() {
  try {
    const packages = Object.values(PACKAGES).map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      price_eur: pkg.priceEur,
      formatted_price: formatEuroCurrency(pkg.priceEur),
      limits: pkg.limits,
      features: pkg.features,
      support_level: pkg.supportLevel,
      recommended: pkg.id === 'professional'
    }))

    return NextResponse.json({
      success: true,
      packages,
      currency: 'EUR',
      billing_cycles: ['monthly', 'annual'],
      trial_available: true,
      trial_period_days: 14
    })

  } catch (error) {
    console.error('List packages error:', error)
    return NextResponse.json({
      error: 'Failed to list packages'
    }, { status: 500 })
  }
}

/**
 * Handle upgrade initiation
 */
async function handleInitiateUpgrade(workshopId, targetPackage, billingCycle = 'monthly') {
  try {
    // Validate target package
    const targetPackageInfo = PACKAGES[targetPackage.toUpperCase()]
    if (!targetPackageInfo) {
      return NextResponse.json({
        error: 'Invalid target package'
      }, { status: 400 })
    }

    // Get current package
    const currentPackage = await getWorkshopPackage(workshopId)
    if (!currentPackage) {
      return NextResponse.json({
        error: 'Workshop not found'
      }, { status: 404 })
    }

    // Check if it's actually an upgrade
    const packageHierarchy = { basic: 1, professional: 2, enterprise: 3 }
    if (packageHierarchy[targetPackage] <= packageHierarchy[currentPackage.id]) {
      return NextResponse.json({
        error: 'Target package is not an upgrade'
      }, { status: 400 })
    }

    // Calculate pricing
    const pricing = calculateUpgradePricing(currentPackage, targetPackageInfo, billingCycle)

    // Create upgrade session
    const upgradeSession = {
      workshop_id: workshopId,
      current_package: currentPackage.id,
      target_package: targetPackage,
      billing_cycle: billingCycle,
      pricing: pricing,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      created_at: new Date().toISOString()
    }

    // Store upgrade session
    const { data: session } = await supabase
      .from('upgrade_sessions')
      .insert(upgradeSession)
      .select('*')
      .single()

    // Generate Stripe checkout session if not enterprise
    let checkoutUrl = null
    if (targetPackage !== 'enterprise') {
      checkoutUrl = await createStripeCheckoutSession(session)
    }

    return NextResponse.json({
      success: true,
      upgrade_session: {
        id: session.id,
        target_package: targetPackageInfo,
        pricing: pricing,
        checkout_url: checkoutUrl,
        expires_at: upgradeSession.expires_at,
        benefits: getUpgradeBenefits(currentPackage.id, targetPackage)
      },
      next_steps: targetPackage === 'enterprise' ? 
        'Unser Team wird sich binnen 24h für eine individuelle Beratung melden.' :
        'Schließen Sie den Upgrade-Prozess über Stripe ab.'
    })

  } catch (error) {
    console.error('Initiate upgrade error:', error)
    return NextResponse.json({
      error: 'Failed to initiate upgrade'
    }, { status: 500 })
  }
}

/**
 * Calculate usage trend
 */
function calculateUsageTrend(dailyUsage) {
  if (!dailyUsage || dailyUsage.length < 2) {
    return { trend: 'stable', change_percentage: 0 }
  }

  const recentWeek = dailyUsage.slice(-7).reduce((sum, record) => sum + record.quantity, 0)
  const previousWeek = dailyUsage.slice(-14, -7).reduce((sum, record) => sum + record.quantity, 0)
  
  if (previousWeek === 0) {
    return { trend: 'stable', change_percentage: 0 }
  }

  const changePercentage = ((recentWeek - previousWeek) / previousWeek) * 100
  
  return {
    trend: changePercentage > 10 ? 'increasing' : changePercentage < -10 ? 'decreasing' : 'stable',
    change_percentage: Math.round(changePercentage)
  }
}

/**
 * Calculate upgrade urgency
 */
function calculateUpgradeUrgency(currentPackage, targetPackage) {
  const usagePercentage = currentPackage.limits.monthlyLeads !== -1 ? 
    (currentPackage.currentUsage.leads / currentPackage.limits.monthlyLeads) * 100 : 0

  if (usagePercentage > 90) return 'high'
  if (usagePercentage > 75) return 'medium'
  return 'low'
}

/**
 * Check available discounts
 */
function checkAvailableDiscounts(currentPackage) {
  const discounts = []
  
  // Annual billing discount
  discounts.push({
    type: 'annual_billing',
    description: '2 Monate kostenlos bei jährlicher Zahlung',
    savings_percentage: 17,
    condition: 'Jährliche Abrechnung wählen'
  })
  
  // Loyalty discount for long-term customers
  const accountAge = new Date() - new Date(currentPackage.workshop.created_at)
  const monthsOld = accountAge / (1000 * 60 * 60 * 24 * 30)
  
  if (monthsOld > 12) {
    discounts.push({
      type: 'loyalty',
      description: 'Treue-Rabatt für langjährige Kunden',
      savings_percentage: 10,
      condition: 'Automatisch angewendet'
    })
  }

  return discounts
}

/**
 * Calculate upgrade pricing
 */
function calculateUpgradePricing(currentPackage, targetPackage, billingCycle) {
  const targetPrice = targetPackage.priceEur
  const currentPrice = currentPackage.priceEur || 0
  
  const pricing = {
    target_package_price: targetPrice,
    current_package_price: currentPrice,
    upgrade_cost: targetPrice - currentPrice,
    billing_cycle: billingCycle,
    currency: 'EUR'
  }

  // Apply annual discount
  if (billingCycle === 'annual') {
    pricing.annual_price = targetPrice * 10 // 10 months price for 12 months
    pricing.annual_savings = targetPrice * 2
    pricing.savings_percentage = 17
  }

  // Proration calculation (simplified)
  const daysRemainingInPeriod = Math.ceil(
    (new Date(currentPackage.billingPeriod.end) - new Date()) / (1000 * 60 * 60 * 24)
  )
  
  if (daysRemainingInPeriod > 0) {
    pricing.proration = {
      days_remaining: daysRemainingInPeriod,
      prorated_amount: Math.round((pricing.upgrade_cost * daysRemainingInPeriod) / 30),
      next_full_charge_date: currentPackage.billingPeriod.end
    }
  }

  return pricing
}

/**
 * Get upgrade benefits
 */
function getUpgradeBenefits(currentPackageId, targetPackageId) {
  const benefitMap = {
    'basic_to_professional': [
      'Unbegrenzte monatliche Leads statt 100',
      '5 professionelle Landing Page Templates',
      'API-Zugang mit 10,000 Aufrufen/Monat',
      'Erweiterte Analytics und Berichte',
      'Telefon-Support statt nur E-Mail',
      'Google Analytics Integration'
    ],
    'basic_to_enterprise': [
      'Alle Professional Features',
      'Unbegrenzte API-Aufrufe',
      'Custom Landing Page Design',
      'White-Label Lösung (eigenes Branding)',
      'Persönlicher Account Manager',
      'Custom Integrationen (CRM, etc.)',
      'Priority Feature Development'
    ],
    'professional_to_enterprise': [
      'Unbegrenzte API-Aufrufe statt 10,000',
      'White-Label Branding',
      'Custom Template Design',
      'Dedicated Account Manager',
      'Custom Integrationen (CRM, POS, etc.)',
      'Priority Feature Requests',
      'SLA Garantien'
    ]
  }

  const key = `${currentPackageId}_to_${targetPackageId}`
  return benefitMap[key] || []
}

/**
 * Create Stripe checkout session (placeholder)
 */
async function createStripeCheckoutSession(upgradeSession) {
  // This would integrate with Stripe API
  // For now, return a placeholder URL
  return `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?session=${upgradeSession.id}`
}

export { 
  handleGetCurrentPackage, 
  handleGetPackageComparison, 
  handleGetUsageDetails,
  handleGetUpgradeOptions,
  handleListAllPackages,
  handleInitiateUpgrade
}