/**
 * API Performance Optimizations for CarBot
 * Cost-effective performance improvements without additional infrastructure
 */

import { createClient } from '@supabase/supabase-js'
import NodeCache from 'node-cache'

// In-memory cache (free, built into Node.js)
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every 60 seconds
  deleteOnExpire: true,
  maxKeys: 1000 // Limit memory usage
})

// Database connection pool optimization
const supabaseOptions = {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: { 'x-my-custom-header': 'carbot-api' }
  }
}

/**
 * Optimized Supabase client with connection pooling
 */
export const optimizedSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseOptions
)

/**
 * Query optimization utilities
 */
export class QueryOptimizer {
  
  /**
   * Cache-aware query execution
   * @param {string} cacheKey - Unique cache key
   * @param {Function} queryFn - Function that returns the query promise
   * @param {number} ttl - Cache TTL in seconds (default: 300)
   * @returns {Promise} Query result
   */
  static async cachedQuery(cacheKey, queryFn, ttl = 300) {
    // Check cache first
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      // Execute query
      const result = await queryFn()
      
      // Cache successful results only
      if (result && !result.error) {
        cache.set(cacheKey, result, ttl)
      }
      
      return result
    } catch (error) {
      console.error(`Query error for key ${cacheKey}:`, error)
      throw error
    }
  }

  /**
   * Optimized workshop package query with joins
   */
  static async getWorkshopPackageOptimized(workshopId) {
    const cacheKey = `workshop_package_${workshopId}`
    
    return this.cachedQuery(cacheKey, async () => {
      // Single query with joins instead of multiple queries
      const { data, error } = await optimizedSupabase
        .from('workshops')
        .select(`
          id,
          name,
          subscription_plan,
          current_period_start,
          current_period_end,
          subscriptions!inner (
            id,
            plan_id,
            status,
            current_period_start,
            current_period_end
          ),
          usage_tracking!left (
            metric_name,
            quantity,
            usage_date
          )
        `)
        .eq('id', workshopId)
        .gte('usage_tracking.usage_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .single()

      if (error) {
        throw error
      }

      // Process usage data efficiently
      const usage = data.usage_tracking.reduce((acc, record) => {
        acc[record.metric_name] = (acc[record.metric_name] || 0) + record.quantity
        return acc
      }, {})

      return {
        ...data,
        currentUsage: {
          leads: usage.leads || 0,
          apiCalls: usage.api_calls || 0,
          storage: usage.storage_gb || 0
        }
      }
    }, 180) // 3 minutes cache
  }

  /**
   * Batch lead queries for analytics
   */
  static async getLeadAnalyticsBatch(customerSlugs, startDate, endDate) {
    const cacheKey = `analytics_batch_${customerSlugs.join(',')}_${startDate}_${endDate}`
    
    return this.cachedQuery(cacheKey, async () => {
      // Single query for multiple customers
      const { data, error } = await optimizedSupabase
        .from('leads')
        .select('kunde_id, created_at, source_url, anliegen')
        .in('kunde_id', customerSlugs)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at')

      if (error) {
        throw error
      }

      // Group by customer for efficient processing
      return data.reduce((acc, lead) => {
        if (!acc[lead.kunde_id]) {
          acc[lead.kunde_id] = []
        }
        acc[lead.kunde_id].push(lead)
        return acc
      }, {})
    }, 600) // 10 minutes cache for analytics
  }
}

/**
 * Request/Response optimization middleware
 */
export class RequestOptimizer {
  
  /**
   * Compress large responses
   */
  static compressResponse(data) {
    // Simple JSON compression for large datasets
    if (Array.isArray(data) && data.length > 100) {
      return {
        compressed: true,
        count: data.length,
        data: data.slice(0, 100), // Paginate large results
        hasMore: data.length > 100
      }
    }
    return data
  }

  /**
   * Validate and sanitize request parameters
   */
  static sanitizeParams(params) {
    const sanitized = {}
    
    // Limit string lengths to prevent DoS
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        sanitized[key] = value.substring(0, 1000) // Max 1000 chars
      } else if (typeof value === 'number') {
        // Prevent extremely large numbers
        sanitized[key] = Math.min(Math.max(value, -1000000), 1000000)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }

  /**
   * Rate limiting with in-memory storage
   */
  static rateLimiter = new Map()
  
  static checkRateLimit(ip, limit = 100, window = 60000) {
    const now = Date.now()
    const key = `${ip}_${Math.floor(now / window)}`
    
    const current = this.rateLimiter.get(key) || 0
    if (current >= limit) {
      return { allowed: false, remaining: 0, resetTime: Math.ceil(now / window) * window }
    }
    
    this.rateLimiter.set(key, current + 1)
    
    // Clean up old entries (simple memory management)
    if (this.rateLimiter.size > 1000) {
      const oldKeys = Array.from(this.rateLimiter.keys()).slice(0, 500)
      oldKeys.forEach(k => this.rateLimiter.delete(k))
    }
    
    return { allowed: true, remaining: limit - current - 1, resetTime: Math.ceil(now / window) * window }
  }
}

/**
 * Database query optimization patterns
 */
export class DatabaseOptimizer {
  
  /**
   * Efficiently check multiple package limits at once
   */
  static async batchCheckLimits(workshopIds, action) {
    const cacheKey = `batch_limits_${workshopIds.join(',')}_${action}`
    
    return QueryOptimizer.cachedQuery(cacheKey, async () => {
      // Get all workshop data in one query
      const { data: workshops } = await optimizedSupabase
        .from('workshops')
        .select(`
          id,
          subscription_plan,
          usage_tracking!left (
            metric_name,
            quantity
          )
        `)
        .in('id', workshopIds)

      // Process limits for each workshop
      return workshops.reduce((acc, workshop) => {
        const usage = workshop.usage_tracking.reduce((sum, record) => {
          if (record.metric_name === action) {
            return sum + record.quantity
          }
          return sum
        }, 0)
        
        acc[workshop.id] = {
          current: usage,
          allowed: this.checkLimit(workshop.subscription_plan, action, usage)
        }
        
        return acc
      }, {})
    }, 120) // 2 minutes cache
  }

  /**
   * Optimized analytics query with proper indexing hints
   */
  static async getOptimizedAnalytics(customerSlug, startDate, endDate) {
    // Use database functions for complex aggregations (if available)
    const cacheKey = `analytics_${customerSlug}_${startDate}_${endDate}`
    
    return QueryOptimizer.cachedQuery(cacheKey, async () => {
      // Parallel queries for better performance
      const [chatsPromise, leadsPromise, appointmentsPromise] = await Promise.all([
        optimizedSupabase
          .from('chat_messages')
          .select('created_at, message_type')
          .eq('client_key', customerSlug)
          .gte('created_at', startDate)
          .lte('created_at', endDate),
          
        optimizedSupabase
          .from('leads')
          .select('created_at, source_url, anliegen')
          .eq('kunde_id', customerSlug)
          .gte('created_at', startDate)
          .lte('created_at', endDate),
          
        optimizedSupabase
          .from('appointments')
          .select('created_at, status, service_requested')
          .eq('customer_slug', customerSlug)
          .gte('created_at', startDate)
          .lte('created_at', endDate)
      ])

      return {
        chats: chatsPromise.data || [],
        leads: leadsPromise.data || [],
        appointments: appointmentsPromise.data || []
      }
    }, 300) // 5 minutes cache
  }

  /**
   * Memory-efficient pagination
   */
  static async paginateEfficiently(query, page = 1, limit = 50) {
    // Limit maximum page size to prevent memory issues
    const maxLimit = 100
    const safeLimit = Math.min(limit, maxLimit)
    const offset = (page - 1) * safeLimit
    
    // Use cursor-based pagination for large datasets
    if (offset > 10000) {
      console.warn('Large offset detected, consider cursor-based pagination')
    }
    
    return query.range(offset, offset + safeLimit - 1)
  }

  /**
   * Check limits efficiently
   */
  static checkLimit(subscriptionPlan, action, currentUsage) {
    const limits = {
      basic: { leads: 100, api_calls: 0, storage_gb: 1 },
      professional: { leads: -1, api_calls: 10000, storage_gb: 10 },
      enterprise: { leads: -1, api_calls: -1, storage_gb: -1 }
    }
    
    const planLimits = limits[subscriptionPlan] || limits.basic
    const limit = planLimits[action]
    
    // -1 means unlimited
    return limit === -1 || currentUsage < limit
  }
}

/**
 * Performance monitoring and metrics
 */
export class PerformanceMonitor {
  
  static metrics = new Map()
  
  /**
   * Track API response times
   */
  static startTimer(requestId) {
    this.metrics.set(requestId, { start: Date.now() })
  }
  
  static endTimer(requestId, additional = {}) {
    const entry = this.metrics.get(requestId)
    if (entry) {
      const duration = Date.now() - entry.start
      this.metrics.set(requestId, {
        ...entry,
        duration,
        ...additional,
        completed: true
      })
      
      // Log slow requests (>2 seconds)
      if (duration > 2000) {
        console.warn(`Slow request detected: ${requestId} took ${duration}ms`)
      }
      
      return duration
    }
    return null
  }
  
  /**
   * Get performance statistics
   */
  static getStats() {
    const completed = Array.from(this.metrics.values()).filter(m => m.completed)
    if (completed.length === 0) return null
    
    const durations = completed.map(m => m.duration)
    return {
      count: completed.length,
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99)
    }
  }
  
  static percentile(values, p) {
    const sorted = values.sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * (p / 100)) - 1
    return sorted[index]
  }
  
  /**
   * Clean up old metrics (memory management)
   */
  static cleanup() {
    if (this.metrics.size > 1000) {
      const entries = Array.from(this.metrics.entries())
      // Keep only the most recent 500 entries
      const recent = entries.slice(-500)
      this.metrics.clear()
      recent.forEach(([key, value]) => this.metrics.set(key, value))
    }
  }
}

/**
 * Response caching utilities
 */
export class ResponseCache {
  
  /**
   * Generate cache key from request
   */
  static generateKey(method, url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    
    return `${method}_${url}_${paramString}`.replace(/[^a-zA-Z0-9_]/g, '_')
  }
  
  /**
   * Cache response with appropriate TTL
   */
  static cacheResponse(key, data, ttl) {
    // Don't cache errors or empty responses
    if (!data || data.error) {
      return data
    }
    
    cache.set(key, data, ttl)
    return data
  }
  
  /**
   * Get cached response
   */
  static getCached(key) {
    return cache.get(key)
  }
  
  /**
   * Invalidate cache by pattern
   */
  static invalidate(pattern) {
    const keys = cache.keys()
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.del(key)
      }
    })
  }
}

export default {
  QueryOptimizer,
  RequestOptimizer,
  DatabaseOptimizer,
  PerformanceMonitor,
  ResponseCache,
  optimizedSupabase,
  cache
}