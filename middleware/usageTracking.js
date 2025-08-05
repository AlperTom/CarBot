/**
 * Usage Tracking Middleware for CarBot
 * Tracks API calls, lead creation, and other metered usage
 * Integrates with package feature system for limit enforcement
 */

import { NextResponse } from 'next/server'
import { recordUsage, checkPackageLimit } from '../lib/packageFeatures.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Usage tracking configuration for different routes
 */
const USAGE_TRACKING_ROUTES = {
  '/api/leads': {
    methods: ['POST'],
    metric: 'leads',
    requiresWorkshop: true,
    preCheck: true, // Check limits before processing
    description: 'Lead creation'
  },
  '/api/chat': {
    methods: ['POST'],
    metric: 'api_calls',
    requiresWorkshop: true,
    preCheck: false,
    description: 'Chat API call'
  },
  '/api/analytics': {
    methods: ['GET', 'POST'],
    metric: 'api_calls',
    requiresWorkshop: true,
    preCheck: false,
    description: 'Analytics API call'
  },
  '/api/keys': {
    methods: ['GET', 'POST', 'DELETE'],
    metric: 'api_calls',
    requiresWorkshop: true,
    preCheck: false,
    description: 'API key management'
  }
}

/**
 * Rate limiting configuration per package
 */
const RATE_LIMITS = {
  basic: {
    apiCallsPerMinute: 60,
    leadsPerHour: 10,
    concurrentRequests: 5
  },
  professional: {
    apiCallsPerMinute: 300,
    leadsPerHour: 50,
    concurrentRequests: 20
  },
  enterprise: {
    apiCallsPerMinute: 1000,
    leadsPerHour: -1, // Unlimited
    concurrentRequests: 100
  }
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map()
const concurrentRequestStore = new Map()

/**
 * Main usage tracking middleware
 * @param {Request} request - HTTP request
 * @param {string} workshopId - Workshop UUID
 * @param {Object} packageInfo - Workshop package information
 * @returns {Promise<Object>} Tracking result and response modifications
 */
export async function trackUsage(request, workshopId, packageInfo) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const method = request.method
  
  // Find matching route configuration
  const routeConfig = findRouteConfig(pathname)
  if (!routeConfig || !routeConfig.methods.includes(method)) {
    return { allowed: true, tracking: false }
  }

  try {
    // Check concurrent request limits
    const concurrentCheck = await checkConcurrentRequests(workshopId, packageInfo)
    if (!concurrentCheck.allowed) {
      return {
        allowed: false,
        error: 'Concurrent request limit exceeded',
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Type': 'concurrent',
          'X-RateLimit-Limit': concurrentCheck.limit
        }
      }
    }

    // Check rate limits
    const rateLimitCheck = await checkRateLimit(workshopId, routeConfig.metric, packageInfo)
    if (!rateLimitCheck.allowed) {
      return {
        allowed: false,
        error: 'Rate limit exceeded',
        status: 429,
        headers: {
          'Retry-After': rateLimitCheck.retryAfter.toString(),
          'X-RateLimit-Type': rateLimitCheck.type,
          'X-RateLimit-Limit': rateLimitCheck.limit,
          'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
          'X-RateLimit-Reset': rateLimitCheck.resetTime.toString()
        }
      }
    }

    // Pre-check package limits if required
    if (routeConfig.preCheck) {
      const limitCheck = await checkPackageLimit(workshopId, routeConfig.metric.slice(0, -1)) // Remove 's' from metric
      if (!limitCheck.allowed) {
        return {
          allowed: false,
          error: limitCheck.reason,
          status: 402, // Payment Required
          headers: {
            'X-Package-Limit-Exceeded': 'true',
            'X-Current-Package': packageInfo.name,
            'X-Upgrade-Required': limitCheck.upgrade_required ? 'true' : 'false',
            'X-Suggested-Package': limitCheck.upgrade_suggestion || ''
          },
          upgradeInfo: {
            current_package: packageInfo.name,
            suggested_package: limitCheck.upgrade_suggestion,
            current_usage: limitCheck.current_usage,
            limit: limitCheck.limit
          }
        }
      }
    }

    return {
      allowed: true,
      tracking: true,
      routeConfig,
      trackingData: {
        workshopId,
        metric: routeConfig.metric,
        description: routeConfig.description,
        pathname,
        method,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Usage tracking error:', error)
    return {
      allowed: true, // Allow on error, but log
      tracking: false,
      error: error.message
    }
  }
}

/**
 * Post-process tracking after successful request
 * @param {Object} trackingResult - Result from trackUsage
 * @param {Response} response - HTTP response
 * @returns {Promise<void>}
 */
export async function completeTracking(trackingResult, response) {
  if (!trackingResult.tracking || !trackingResult.trackingData) {
    return
  }

  try {
    const { workshopId, metric } = trackingResult.trackingData
    
    // Record the usage
    await recordUsage(workshopId, metric, 1)
    
    // Add usage headers to response
    response.headers.set('X-Usage-Tracked', 'true')
    response.headers.set('X-Usage-Metric', metric)
    response.headers.set('X-Usage-Timestamp', trackingResult.trackingData.timestamp)
    
    // Clean up concurrent request tracking
    decrementConcurrentRequests(workshopId)
    
    console.log(`Usage tracked: ${metric} for workshop ${workshopId}`)
  } catch (error) {
    console.error('Error completing usage tracking:', error)
  }
}

/**
 * Find route configuration for pathname
 * @param {string} pathname - Request pathname
 * @returns {Object|null} Route configuration
 */
function findRouteConfig(pathname) {
  // Exact match first
  if (USAGE_TRACKING_ROUTES[pathname]) {
    return USAGE_TRACKING_ROUTES[pathname]
  }
  
  // Pattern matching for dynamic routes
  for (const [route, config] of Object.entries(USAGE_TRACKING_ROUTES)) {
    if (pathname.startsWith(route)) {
      return config
    }
  }
  
  return null
}

/**
 * Check concurrent request limits
 * @param {string} workshopId - Workshop UUID
 * @param {Object} packageInfo - Package information
 * @returns {Promise<Object>} Concurrent check result
 */
async function checkConcurrentRequests(workshopId, packageInfo) {
  const packageId = packageInfo.id || 'basic'
  const limit = RATE_LIMITS[packageId]?.concurrentRequests || RATE_LIMITS.basic.concurrentRequests
  
  const currentCount = concurrentRequestStore.get(workshopId) || 0
  
  if (currentCount >= limit) {
    return {
      allowed: false,
      limit,
      current: currentCount
    }
  }
  
  // Increment concurrent request count
  concurrentRequestStore.set(workshopId, currentCount + 1)
  
  return {
    allowed: true,
    limit,
    current: currentCount + 1
  }
}

/**
 * Decrement concurrent request count
 * @param {string} workshopId - Workshop UUID
 */
function decrementConcurrentRequests(workshopId) {
  const currentCount = concurrentRequestStore.get(workshopId) || 0
  if (currentCount > 0) {
    concurrentRequestStore.set(workshopId, currentCount - 1)
  }
}

/**
 * Check rate limits based on package
 * @param {string} workshopId - Workshop UUID
 * @param {string} metric - Metric being tracked
 * @param {Object} packageInfo - Package information
 * @returns {Promise<Object>} Rate limit check result
 */
async function checkRateLimit(workshopId, metric, packageInfo) {
  const packageId = packageInfo.id || 'basic'
  const rateLimits = RATE_LIMITS[packageId] || RATE_LIMITS.basic
  
  let limit, windowMs, rateLimitType
  
  // Determine rate limit based on metric
  if (metric === 'leads') {
    limit = rateLimits.leadsPerHour
    windowMs = 60 * 60 * 1000 // 1 hour
    rateLimitType = 'leads_per_hour'
  } else {
    limit = rateLimits.apiCallsPerMinute
    windowMs = 60 * 1000 // 1 minute
    rateLimitType = 'api_calls_per_minute'
  }
  
  // Unlimited for enterprise
  if (limit === -1) {
    return { allowed: true, unlimited: true }
  }
  
  const key = `${workshopId}:${rateLimitType}`
  const now = Date.now()
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [])
  }
  
  const attempts = rateLimitStore.get(key)
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < windowMs)
  
  if (recentAttempts.length >= limit) {
    const oldestAttempt = Math.min(...recentAttempts)
    const retryAfter = Math.ceil((oldestAttempt + windowMs - now) / 1000)
    
    return {
      allowed: false,
      limit,
      remaining: 0,
      type: rateLimitType,
      retryAfter,
      resetTime: Math.ceil((oldestAttempt + windowMs) / 1000)
    }
  }
  
  // Add current attempt
  recentAttempts.push(now)
  rateLimitStore.set(key, recentAttempts)
  
  return {
    allowed: true,
    limit,
    remaining: limit - recentAttempts.length,
    type: rateLimitType,
    resetTime: Math.ceil((now + windowMs) / 1000)
  }
}

/**
 * Get workshop ID from request
 * @param {Request} request - HTTP request
 * @returns {Promise<string|null>} Workshop ID or null
 */
export async function getWorkshopIdFromRequest(request) {
  try {
    // Try to get from headers (set by main middleware)
    const workshopId = request.headers.get('x-workshop-id')
    if (workshopId) {
      return workshopId
    }
    
    // Try to get from authorization token
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      
      // Decode token to get user info (simplified - use proper JWT validation in production)
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) {
        // Get workshop for user
        const { data: workshop } = await supabase
          .from('workshops')
          .select('id')
          .eq('owner_id', user.id)
          .single()
        
        return workshop?.id || null
      }
    }
    
    // Try to get from client key in request body
    if (request.method === 'POST') {
      const body = await request.clone().json()
      if (body.clientKey) {
        const { data: workshop } = await supabase
          .from('workshops')
          .select('id')
          .eq('slug', body.clientKey)
          .single()
        
        return workshop?.id || null
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting workshop ID from request:', error)
    return null
  }
}

/**
 * Create usage tracking response with appropriate headers
 * @param {Object} trackingResult - Result from trackUsage
 * @returns {NextResponse} Response with tracking headers
 */
export function createTrackingResponse(trackingResult) {
  if (trackingResult.allowed) {
    return NextResponse.next()
  }
  
  const response = new NextResponse(
    JSON.stringify({
      error: trackingResult.error,
      package_info: trackingResult.upgradeInfo || null,
      retry_after: trackingResult.headers?.['Retry-After'] || null
    }),
    {
      status: trackingResult.status || 429,
      headers: {
        'Content-Type': 'application/json',
        ...trackingResult.headers
      }
    }
  )
  
  return response
}

/**
 * Generate usage report for workshop
 * @param {string} workshopId - Workshop UUID
 * @param {string} period - Period for report (day, week, month)
 * @returns {Promise<Object>} Usage report
 */
export async function generateUsageReport(workshopId, period = 'month') {
  try {
    let startDate
    const endDate = new Date().toISOString().split('T')[0]
    
    switch (period) {
      case 'day':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case 'week':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case 'month':
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
    }
    
    const { data: usage, error } = await supabase
      .from('usage_tracking')
      .select('metric_name, usage_date, quantity')
      .eq('workshop_id', workshopId)
      .gte('usage_date', startDate)
      .lte('usage_date', endDate)
      .order('usage_date', { ascending: false })
    
    if (error) {
      throw error
    }
    
    // Aggregate usage by metric
    const report = {
      period,
      start_date: startDate,
      end_date: endDate,
      total_usage: {},
      daily_breakdown: {}
    }
    
    usage.forEach(record => {
      // Total usage
      if (!report.total_usage[record.metric_name]) {
        report.total_usage[record.metric_name] = 0
      }
      report.total_usage[record.metric_name] += record.quantity
      
      // Daily breakdown
      if (!report.daily_breakdown[record.usage_date]) {
        report.daily_breakdown[record.usage_date] = {}
      }
      report.daily_breakdown[record.usage_date][record.metric_name] = record.quantity
    })
    
    return report
  } catch (error) {
    console.error('Error generating usage report:', error)
    throw error
  }
}

export default {
  trackUsage,
  completeTracking,
  getWorkshopIdFromRequest,
  createTrackingResponse,
  generateUsageReport
}