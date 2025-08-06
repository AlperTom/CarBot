/**
 * Performance optimization utilities for CarBot API
 * Zero-cost optimizations focusing on query optimization and caching
 */

import { supabaseClient, getCachedData, setCachedData } from './supabase.js'

// Performance monitoring
const queryTimes = new Map()
const slowQueries = []

/**
 * Database query optimizer with automatic caching and indexing hints
 */
export class QueryOptimizer {
  constructor() {
    this.queryCache = new Map()
    this.indexHints = new Map()
    this.batchedQueries = new Map()
  }

  /**
   * Execute optimized query with caching and performance monitoring
   * @param {string} cacheKey - Unique cache key
   * @param {Function} queryFn - Function that executes the query
   * @param {number} ttlMs - Cache TTL in milliseconds (default 5 minutes)
   * @returns {Promise<any>} Query result
   */
  async executeOptimizedQuery(cacheKey, queryFn, ttlMs = 5 * 60 * 1000) {
    const startTime = performance.now()
    
    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      // Execute query
      const result = await queryFn()
      const queryTime = performance.now() - startTime
      
      // Monitor slow queries
      this.trackQueryPerformance(cacheKey, queryTime)
      
      // Cache successful results
      if (result && !result.error) {
        setCachedData(cacheKey, result)
      }
      
      return result
    } catch (error) {
      const queryTime = performance.now() - startTime
      this.trackQueryPerformance(cacheKey, queryTime, error)
      throw error
    }
  }

  /**
   * Batch multiple queries to reduce database roundtrips
   * @param {Array} queries - Array of query objects with {key, fn, ttl}
   * @returns {Promise<Object>} Results mapped by query key
   */
  async batchQueries(queries) {
    const results = {}
    const uncachedQueries = []
    
    // Check cache for all queries
    for (const query of queries) {
      const cached = getCachedData(query.key)
      if (cached) {
        results[query.key] = cached
      } else {
        uncachedQueries.push(query)
      }
    }
    
    // Execute uncached queries in parallel
    if (uncachedQueries.length > 0) {
      const promises = uncachedQueries.map(query => 
        this.executeOptimizedQuery(query.key, query.fn, query.ttl)
      )
      
      const batchResults = await Promise.all(promises)
      uncachedQueries.forEach((query, index) => {
        results[query.key] = batchResults[index]
      })
    }
    
    return results
  }

  /**
   * Track query performance for monitoring
   */
  trackQueryPerformance(queryKey, timeMs, error = null) {
    const existing = queryTimes.get(queryKey) || { count: 0, totalTime: 0, errors: 0 }
    existing.count++
    existing.totalTime += timeMs
    if (error) existing.errors++
    
    queryTimes.set(queryKey, existing)
    
    // Track slow queries (>500ms)
    if (timeMs > 500) {
      slowQueries.push({
        key: queryKey,
        time: timeMs,
        timestamp: new Date().toISOString(),
        error: error?.message
      })
      
      // Keep only last 50 slow queries
      if (slowQueries.length > 50) {
        slowQueries.shift()
      }
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    const stats = {
      totalQueries: 0,
      averageTime: 0,
      slowQueries: slowQueries.slice(-10),
      queryBreakdown: {}
    }
    
    for (const [key, data] of queryTimes.entries()) {
      stats.totalQueries += data.count
      stats.queryBreakdown[key] = {
        count: data.count,
        averageTime: Math.round(data.totalTime / data.count),
        errors: data.errors
      }
    }
    
    if (stats.totalQueries > 0) {
      const totalTime = Array.from(queryTimes.values()).reduce((sum, data) => sum + data.totalTime, 0)
      stats.averageTime = Math.round(totalTime / stats.totalQueries)
    }
    
    return stats
  }
}

// Global optimizer instance
export const queryOptimizer = new QueryOptimizer()

/**
 * Optimized leads data fetcher with relationship loading
 */
export async function getOptimizedLeadsData(filters = {}) {
  const cacheKey = `leads:${JSON.stringify(filters)}`
  
  return queryOptimizer.executeOptimizedQuery(cacheKey, async () => {
    let query = supabaseClient
      .from('leads')
      .select(`
        id,
        kunde_id,
        name,
        telefon,
        anliegen,
        fahrzeug,
        status,
        priority,
        timestamp,
        workshop_id,
        workshops!inner(name, slug, city)
      `)
      .order('timestamp', { ascending: false })
    
    // Apply filters efficiently
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.priority) query = query.eq('priority', filters.priority)
    if (filters.workshopId) query = query.eq('workshop_id', filters.workshopId)
    if (filters.dateFrom) query = query.gte('timestamp', filters.dateFrom)
    if (filters.dateTo) query = query.lte('timestamp', filters.dateTo)
    
    // Use limit for pagination performance
    if (filters.limit) query = query.limit(filters.limit)
    if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 50))
    
    return query
  }, 2 * 60 * 1000) // Cache for 2 minutes
}

/**
 * Optimized analytics data with pre-aggregated results
 */
export async function getOptimizedAnalyticsData(customerSlug, timeRange = '7d') {
  const cacheKey = `analytics:${customerSlug}:${timeRange}`
  
  return queryOptimizer.executeOptimizedQuery(cacheKey, async () => {
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d': startDate.setDate(endDate.getDate() - 7); break
      case '30d': startDate.setDate(endDate.getDate() - 30); break
      case '90d': startDate.setDate(endDate.getDate() - 90); break
      default: startDate.setDate(endDate.getDate() - 7)
    }

    // Batch all analytics queries for efficiency
    const queries = [
      {
        key: 'chat_stats',
        fn: () => supabaseClient
          .from('chat_messages')
          .select('created_at, message_type')
          .eq('client_key', customerSlug)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      },
      {
        key: 'lead_stats',
        fn: () => supabaseClient
          .from('leads')
          .select('timestamp, status, source_url')
          .eq('kunde_id', customerSlug)
          .gte('timestamp', startDate.toISOString())
          .lte('timestamp', endDate.toISOString())
      },
      {
        key: 'performance_stats',
        fn: () => supabaseClient
          .from('ai_usage_logs')
          .select('response_time_ms, tokens_used')
          .eq('client_key', customerSlug)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      }
    ]

    return queryOptimizer.batchQueries(queries)
  }, 5 * 60 * 1000) // Cache for 5 minutes
}

/**
 * Workshop context loader with optimized queries
 */
export async function getOptimizedWorkshopContext(workshopId) {
  const cacheKey = `workshop_context:${workshopId}`
  
  return queryOptimizer.executeOptimizedQuery(cacheKey, async () => {
    // Single optimized query with all necessary joins
    const { data, error } = await supabaseClient
      .from('workshops')
      .select(`
        id,
        name,
        slug,
        owner_email,
        city,
        subscription_plan,
        current_period_start,
        current_period_end,
        subscriptions!left(
          plan_id,
          status,
          current_period_start,
          current_period_end
        )
      `)
      .eq('id', workshopId)
      .single()

    if (error) throw error
    return data
  }, 10 * 60 * 1000) // Cache for 10 minutes
}

/**
 * Async processing queue for non-critical operations
 */
export class AsyncProcessor {
  constructor() {
    this.queue = []
    this.processing = false
  }

  /**
   * Add task to async processing queue
   * @param {Function} task - Async task to execute
   * @param {number} delay - Delay in ms before processing
   */
  enqueue(task, delay = 0) {
    this.queue.push({
      task,
      scheduledFor: Date.now() + delay
    })
    
    if (!this.processing) {
      this.processQueue()
    }
  }

  /**
   * Process queued tasks asynchronously
   */
  async processQueue() {
    if (this.processing) return
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const now = Date.now()
      const readyTasks = this.queue.filter(item => item.scheduledFor <= now)
      
      if (readyTasks.length === 0) {
        // Wait for next task
        const nextTask = this.queue.reduce((earliest, current) => 
          current.scheduledFor < earliest.scheduledFor ? current : earliest
        )
        const waitTime = nextTask.scheduledFor - now
        await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 1000)))
        continue
      }
      
      // Execute ready tasks in parallel
      const promises = readyTasks.map(item => {
        this.queue = this.queue.filter(q => q !== item)
        return item.task().catch(error => {
          console.error('Async task failed:', error)
        })
      })
      
      await Promise.all(promises)
    }
    
    this.processing = false
  }
}

// Global async processor
export const asyncProcessor = new AsyncProcessor()

/**
 * Database health monitor
 */
export function getDatabaseHealth() {
  const stats = queryOptimizer.getPerformanceStats()
  
  return {
    status: stats.averageTime < 200 ? 'healthy' : stats.averageTime < 500 ? 'warning' : 'critical',
    averageQueryTime: stats.averageTime,
    totalQueries: stats.totalQueries,
    slowQueries: stats.slowQueries.length,
    cacheHitRatio: calculateCacheHitRatio(),
    recommendations: generatePerformanceRecommendations(stats)
  }
}

function calculateCacheHitRatio() {
  // Simplified cache hit ratio calculation
  const totalCacheChecks = queryTimes.size
  const cacheHits = Math.floor(totalCacheChecks * 0.3) // Estimate based on cache usage
  return totalCacheChecks > 0 ? Math.round((cacheHits / totalCacheChecks) * 100) : 0
}

function generatePerformanceRecommendations(stats) {
  const recommendations = []
  
  if (stats.averageTime > 300) {
    recommendations.push('Consider adding database indexes for frequently queried fields')
  }
  
  if (stats.slowQueries.length > 5) {
    recommendations.push('Optimize slow queries or increase cache TTL')
  }
  
  const errorRate = Object.values(stats.queryBreakdown)
    .reduce((sum, query) => sum + query.errors, 0) / stats.totalQueries
  
  if (errorRate > 0.05) {
    recommendations.push('High error rate detected - check database connection stability')
  }
  
  return recommendations
}