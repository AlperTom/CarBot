/**
 * Production Rate Limiting System for CarBot
 * Protects API endpoints from abuse and ensures fair usage
 */

import { logSecurityError, logApiError, ErrorSeverity } from './error-logger.js'

// In-memory store for development (use Redis in production)
const rateLimitStore = new Map()
const CLEANUP_INTERVAL = 60000 // Cleanup every minute

/**
 * Rate limiting configurations for different endpoint types
 */
export const RateLimitConfig = {
  // Authentication endpoints - strict limits
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts. Please try again later.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Registration - very strict
  REGISTER: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour per IP
    message: 'Registration limit exceeded. Please try again later.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Password reset - prevent brute force
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: 'Password reset limit exceeded. Please try again later.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // General API endpoints
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'API rate limit exceeded. Please slow down.',
    skipSuccessfulRequests: true, // Only count failed requests
    skipFailedRequests: false
  },

  // Chat/AI endpoints - moderate limits
  CHAT: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 chat messages per minute
    message: 'Chat rate limit exceeded. Please wait before sending more messages.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Email endpoints - prevent spam
  EMAIL: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 emails per hour
    message: 'Email sending limit exceeded. Please try again later.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // File upload endpoints
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 uploads per hour
    message: 'Upload limit exceeded. Please try again later.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Webhook endpoints - prevent spam
  WEBHOOK: {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 webhooks per minute
    message: 'Webhook rate limit exceeded.',
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  }
}

/**
 * Get client identifier (IP + User Agent + User ID if available)
 */
function getClientId(req) {
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection?.remoteAddress || 
             req.socket?.remoteAddress ||
             'unknown'
  
  const userAgent = req.headers['user-agent'] || 'unknown'
  const userId = req.user?.id || req.headers['authorization']?.split(' ')[1] || 'anonymous'
  
  // Create a hash-like identifier
  return `${ip}_${userAgent.substring(0, 50)}_${userId}`.replace(/[^a-zA-Z0-9_]/g, '')
}

/**
 * Check if request should be rate limited
 */
function shouldRateLimit(clientId, config, now) {
  const key = `${clientId}_${config.windowMs}`
  const record = rateLimitStore.get(key)

  if (!record) {
    // First request - create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
      firstRequest: now
    })
    return { limited: false, record: { count: 1, remaining: config.max - 1 } }
  }

  // Check if window has expired
  if (now > record.resetTime) {
    // Reset the window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
      firstRequest: now
    })
    return { limited: false, record: { count: 1, remaining: config.max - 1 } }
  }

  // Within current window
  record.count++
  rateLimitStore.set(key, record)

  const remaining = Math.max(0, config.max - record.count)
  const limited = record.count > config.max

  return {
    limited,
    record: {
      count: record.count,
      remaining,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    }
  }
}

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(configType = 'API', customConfig = {}) {
  const config = { ...RateLimitConfig[configType], ...customConfig }
  
  return async (req, res, next) => {
    const now = Date.now()
    const clientId = getClientId(req)
    
    try {
      const result = shouldRateLimit(clientId, config, now)
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': config.max,
        'X-RateLimit-Remaining': result.record.remaining,
        'X-RateLimit-Reset': new Date(result.record.resetTime || now + config.windowMs).toISOString()
      })

      if (result.limited) {
        // Log rate limit violation
        await logSecurityError(
          `Rate limit exceeded for ${configType}`,
          {
            clientId: clientId.substring(0, 50), // Don't log full client ID for privacy
            ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
            userAgent: req.headers['user-agent'],
            url: req.url,
            method: req.method,
            attempts: result.record.count,
            limit: config.max
          }
        )

        // Set retry-after header
        if (result.record.retryAfter) {
          res.set('Retry-After', result.record.retryAfter)
        }

        // Send rate limit response
        return res.status(429).json({
          success: false,
          error: config.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: result.record.retryAfter,
          limit: config.max,
          remaining: 0,
          reset: new Date(result.record.resetTime).toISOString()
        })
      }

      // Request is within limits, continue
      if (next) next()
      
    } catch (error) {
      await logApiError(
        `Rate limiter error: ${error.message}`,
        { clientId, url: req.url, method: req.method },
        ErrorSeverity.HIGH
      )
      
      // On rate limiter failure, allow the request (fail open)
      if (next) next()
    }
  }
}

/**
 * Advanced rate limiter with different limits for authenticated vs anonymous users
 */
export function createAdvancedRateLimiter(anonConfig, authConfig) {
  return async (req, res, next) => {
    const isAuthenticated = !!(req.user?.id || req.headers['authorization'])
    const config = isAuthenticated ? authConfig : anonConfig
    
    const limiter = createRateLimiter('CUSTOM', config)
    return limiter(req, res, next)
  }
}

/**
 * IP-based rate limiter for extreme cases
 */
export function createIPRateLimiter(maxRequests = 1000, windowMs = 60 * 60 * 1000) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    const now = Date.now()
    const key = `ip_${ip}`
    
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return next()
    }
    
    record.count++
    rateLimitStore.set(key, record)
    
    if (record.count > maxRequests) {
      logSecurityError(
        `IP rate limit exceeded: ${ip}`,
        { ip, requests: record.count, limit: maxRequests }
      )
      
      return res.status(429).json({
        success: false,
        error: 'IP rate limit exceeded. Contact support if this continues.',
        code: 'IP_RATE_LIMIT_EXCEEDED'
      })
    }
    
    next()
  }
}

/**
 * Workshop-specific rate limiter
 */
export function createWorkshopRateLimiter(maxRequests = 1000, windowMs = 60 * 60 * 1000) {
  return (req, res, next) => {
    const workshopId = req.user?.workshopId || req.headers['x-workshop-id']
    
    if (!workshopId) {
      return next() // No workshop ID, skip limiting
    }
    
    const now = Date.now()
    const key = `workshop_${workshopId}`
    
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return next()
    }
    
    record.count++
    rateLimitStore.set(key, record)
    
    if (record.count > maxRequests) {
      logApiError(
        `Workshop rate limit exceeded: ${workshopId}`,
        { workshopId, requests: record.count, limit: maxRequests }
      )
      
      return res.status(429).json({
        success: false,
        error: 'Workshop rate limit exceeded. Please upgrade your plan for higher limits.',
        code: 'WORKSHOP_RATE_LIMIT_EXCEEDED'
      })
    }
    
    next()
  }
}

/**
 * Clean up expired records
 */
function cleanupExpiredRecords() {
  const now = Date.now()
  const keysToDelete = []
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime && now > record.resetTime) {
      keysToDelete.push(key)
    }
  }
  
  keysToDelete.forEach(key => rateLimitStore.delete(key))
  
  if (keysToDelete.length > 0) {
    console.log(`🧹 [Rate Limiter] Cleaned up ${keysToDelete.length} expired records`)
  }
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStats() {
  const now = Date.now()
  const stats = {
    totalRecords: rateLimitStore.size,
    activeRecords: 0,
    expiredRecords: 0,
    topClients: []
  }
  
  const clientCounts = new Map()
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime && now > record.resetTime) {
      stats.expiredRecords++
    } else {
      stats.activeRecords++
      const clientId = key.split('_')[0]
      clientCounts.set(clientId, (clientCounts.get(clientId) || 0) + record.count)
    }
  }
  
  // Get top 10 clients by request count
  stats.topClients = Array.from(clientCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([clientId, count]) => ({ clientId: clientId.substring(0, 20), count }))
  
  return stats
}

// Start cleanup interval
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, CLEANUP_INTERVAL)
}

export default {
  createRateLimiter,
  createAdvancedRateLimiter,
  createIPRateLimiter,
  createWorkshopRateLimiter,
  getRateLimitStats,
  RateLimitConfig
}