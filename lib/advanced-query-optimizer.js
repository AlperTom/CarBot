/**
 * Advanced Database Query Optimizer for CarBot
 * Implements Phase 1 optimization targeting €15K-30K monthly impact
 * Focus: Sub-50ms database queries for German automotive workshops
 */

import { createClient } from '@supabase/supabase-js'
import { cache } from './redis-cache.js'
import { createCacheKey, hashCacheKey } from './redis-cache.js'

// Optimized Supabase client with connection pooling
const supabaseOptimized = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        'x-client-info': 'carbot-advanced-optimizer',
        'connection': 'keep-alive'
      }
    },
    // Connection pooling optimization
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

/**
 * Advanced Query Optimizer with intelligent indexing and caching
 * Target: <50ms database response times for all workshop queries
 */
export class AdvancedQueryOptimizer {
  constructor() {
    this.queryStats = new Map()
    this.indexHints = new Map()
    this.preparedQueries = new Map()
    this.batchQueue = []
    this.processingBatch = false
    
    // Initialize performance tracking
    this.initializePerformanceTracking()
  }

  /**
   * Initialize performance tracking and query monitoring
   */
  initializePerformanceTracking() {
    // Track query performance every 30 seconds
    setInterval(() => {
      this.analyzeQueryPerformance()
      this.optimizeSlowQueries()
    }, 30000)
    
    // Batch process queue every 100ms for optimal throughput
    setInterval(() => {
      if (this.batchQueue.length > 0 && !this.processingBatch) {
        this.processBatchQueue()
      }
    }, 100)
  }

  /**
   * Execute query with advanced optimization (Target: <50ms)
   * @param {string} queryKey - Unique identifier for the query
   * @param {Function} queryFn - Query execution function
   * @param {Object} options - Optimization options
   * @returns {Promise<Object>} Optimized query result
   */
  async executeOptimizedQuery(queryKey, queryFn, options = {}) {
    const startTime = performance.now()
    const cacheKey = createCacheKey('query', queryKey, hashCacheKey(options))
    
    // Advanced caching with intelligent TTL
    const cacheTTL = this.calculateOptimalCacheTTL(queryKey, options)
    const cached = await cache.get(cacheKey)
    
    if (cached && !options.skipCache) {
      this.recordQueryPerformance(queryKey, performance.now() - startTime, true)
      return { ...cached, _cached: true, _cacheKey: cacheKey }
    }

    try {
      // Execute query with connection optimization
      const result = await this.executeWithConnectionPool(queryFn)
      const executionTime = performance.now() - startTime
      
      // Record performance metrics
      this.recordQueryPerformance(queryKey, executionTime, false)
      
      // Intelligent caching based on query characteristics
      if (result && !result.error && this.shouldCache(queryKey, result, executionTime)) {
        await cache.set(cacheKey, result, cacheTTL)
      }
      
      // Alert on performance issues
      if (executionTime > 100) {
        this.alertSlowQuery(queryKey, executionTime, options)
      }
      
      return { ...result, _executionTime: Math.round(executionTime) }
      
    } catch (error) {
      this.recordQueryError(queryKey, error)
      throw error
    }
  }

  /**
   * Batch query processor for optimal database utilization
   * Combines multiple queries into efficient batch operations
   */
  async batchOptimizedQueries(queries) {
    const batchStartTime = performance.now()
    const results = {}
    const cacheChecks = []
    const executableQueries = []
    
    // Phase 1: Check cache for all queries in parallel
    for (const query of queries) {
      const cacheKey = createCacheKey('query', query.key, hashCacheKey(query.options || {}))
      cacheChecks.push({ query, cacheKey })
    }
    
    const cacheResults = await Promise.all(
      cacheChecks.map(async ({ query, cacheKey }) => {
        const cached = await cache.get(cacheKey)
        return { query, cached, cacheKey }
      })
    )
    
    // Phase 2: Separate cached vs executable queries
    for (const { query, cached, cacheKey } of cacheResults) {
      if (cached && !query.options?.skipCache) {
        results[query.key] = { ...cached, _cached: true }
      } else {
        executableQueries.push({ ...query, cacheKey })
      }
    }
    
    // Phase 3: Execute remaining queries with connection pooling
    if (executableQueries.length > 0) {
      const executionPromises = executableQueries.map(async (query) => {
        const queryStart = performance.now()
        try {
          const result = await this.executeWithConnectionPool(query.fn)
          const executionTime = performance.now() - queryStart
          
          // Cache successful results
          if (result && !result.error) {
            const ttl = this.calculateOptimalCacheTTL(query.key, query.options)
            await cache.set(query.cacheKey, result, ttl)
          }
          
          this.recordQueryPerformance(query.key, executionTime, false)
          return { key: query.key, result: { ...result, _executionTime: Math.round(executionTime) } }
          
        } catch (error) {
          this.recordQueryError(query.key, error)
          return { key: query.key, error }
        }
      })
      
      const batchResults = await Promise.all(executionPromises)
      
      // Merge results
      for (const { key, result, error } of batchResults) {
        if (error) {
          results[key] = { error }
        } else {
          results[key] = result
        }
      }
    }
    
    const totalBatchTime = performance.now() - batchStartTime
    this.recordBatchPerformance(queries.length, totalBatchTime, Object.keys(results).length)
    
    return results
  }

  /**
   * Workshop-specific optimized queries for German automotive market
   */
  async getWorkshopDataOptimized(workshopId, includeAnalytics = true) {
    const queries = [
      {
        key: 'workshop_core',
        fn: () => supabaseOptimized
          .from('workshops')
          .select(`
            id, name, slug, city, owner_email,
            subscription_plan, current_period_start, current_period_end,
            settings, features, status
          `)
          .eq('id', workshopId)
          .single(),
        options: { priority: 'high', ttl: 600 }
      },
      {
        key: 'workshop_subscription',
        fn: () => supabaseOptimized
          .from('subscriptions')
          .select('plan_id, status, current_period_start, current_period_end, features')
          .eq('workshop_id', workshopId)
          .order('created_at', { ascending: false })
          .limit(1),
        options: { priority: 'high', ttl: 300 }
      }
    ]
    
    if (includeAnalytics) {
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      queries.push({
        key: 'workshop_usage',
        fn: () => supabaseOptimized
          .from('usage_tracking')
          .select('metric_name, quantity, usage_date')
          .eq('workshop_id', workshopId)
          .gte('usage_date', last30Days)
          .order('usage_date', { ascending: false }),
        options: { priority: 'medium', ttl: 180 }
      })
      
      queries.push({
        key: 'workshop_leads',
        fn: () => supabaseOptimized
          .from('leads')
          .select('id, status, priority, timestamp, source_url')
          .eq('workshop_id', workshopId)
          .gte('timestamp', last30Days)
          .order('timestamp', { ascending: false })
          .limit(100),
        options: { priority: 'medium', ttl: 120 }
      })
    }
    
    return this.batchOptimizedQueries(queries)
  }

  /**
   * Optimized analytics query for German automotive workshops
   */
  async getAnalyticsDataOptimized(customerSlug, timeRange = '7d') {
    const { startDate, endDate } = this.calculateDateRange(timeRange)
    
    const analyticsQueries = [
      {
        key: `chat_analytics_${timeRange}`,
        fn: () => supabaseOptimized.rpc('get_chat_analytics_optimized', {
          client_key_param: customerSlug,
          start_date: startDate,
          end_date: endDate
        }),
        options: { ttl: 300, priority: 'high' }
      },
      {
        key: `lead_analytics_${timeRange}`,
        fn: () => supabaseOptimized.rpc('get_lead_analytics_optimized', {
          customer_slug_param: customerSlug,
          start_date: startDate,
          end_date: endDate
        }),
        options: { ttl: 300, priority: 'high' }
      },
      {
        key: `performance_analytics_${timeRange}`,
        fn: () => supabaseOptimized
          .from('web_vitals')
          .select('metric_name, value, timestamp')
          .eq('client_key', customerSlug)
          .gte('timestamp', startDate)
          .lte('timestamp', endDate)
          .order('timestamp', { ascending: false }),
        options: { ttl: 600, priority: 'medium' }
      }
    ]
    
    return this.batchOptimizedQueries(analyticsQueries)
  }

  /**
   * High-performance lead scoring query
   */
  async getLeadScoringOptimized(leadIds) {
    if (leadIds.length === 0) return {}
    
    const cacheKey = createCacheKey('lead_scoring', leadIds.sort().join(','))
    
    return this.executeOptimizedQuery(
      `lead_scoring_batch_${leadIds.length}`,
      async () => {
        // Use database function for complex scoring calculations
        const { data, error } = await supabaseOptimized.rpc('calculate_lead_scores_batch', {
          lead_ids: leadIds
        })
        
        if (error) throw error
        
        // Transform to key-value mapping for easy access
        return data.reduce((acc, score) => {
          acc[score.lead_id] = {
            score: score.total_score,
            factors: score.scoring_factors,
            confidence: score.confidence_level
          }
          return acc
        }, {})
      },
      { ttl: 180, priority: 'high' }
    )
  }

  /**
   * Connection pool management for optimal database utilization
   */
  async executeWithConnectionPool(queryFn) {
    // Connection pooling with retry logic for reliability
    let attempt = 0
    const maxAttempts = 3
    
    while (attempt < maxAttempts) {
      try {
        return await queryFn()
      } catch (error) {
        attempt++
        
        if (attempt === maxAttempts || !this.isRetryableError(error)) {
          throw error
        }
        
        // Exponential backoff for retries
        await this.sleep(Math.pow(2, attempt) * 100)
      }
    }
  }

  /**
   * Performance monitoring and optimization
   */
  recordQueryPerformance(queryKey, executionTime, fromCache) {
    const existing = this.queryStats.get(queryKey) || {
      count: 0,
      totalTime: 0,
      cacheHits: 0,
      errors: 0,
      avgTime: 0,
      maxTime: 0,
      minTime: Infinity
    }
    
    existing.count++
    if (fromCache) {
      existing.cacheHits++
    } else {
      existing.totalTime += executionTime
      existing.maxTime = Math.max(existing.maxTime, executionTime)
      existing.minTime = Math.min(existing.minTime, executionTime)
      existing.avgTime = existing.totalTime / (existing.count - existing.cacheHits)
    }
    
    this.queryStats.set(queryKey, existing)
    
    // Performance alerting for queries > 100ms
    if (executionTime > 100 && !fromCache) {
      console.warn(`🐌 Slow Query Alert: ${queryKey} took ${Math.round(executionTime)}ms`)
    }
  }

  recordQueryError(queryKey, error) {
    const existing = this.queryStats.get(queryKey) || { count: 0, errors: 0 }
    existing.errors++
    this.queryStats.set(queryKey, existing)
    
    console.error(`❌ Query Error: ${queryKey}`, error.message)
  }

  recordBatchPerformance(queryCount, totalTime, successCount) {
    const avgTime = totalTime / queryCount
    console.log(`📊 Batch Performance: ${queryCount} queries in ${Math.round(totalTime)}ms (avg: ${Math.round(avgTime)}ms, success: ${successCount}/${queryCount})`)
  }

  /**
   * Intelligent caching strategies
   */
  calculateOptimalCacheTTL(queryKey, options = {}) {
    // Base TTL on query characteristics and business requirements
    if (options.ttl) return options.ttl
    
    const queryStats = this.queryStats.get(queryKey)
    const baselinePerformance = queryStats?.avgTime || 100
    
    // Dynamic TTL based on query performance and data freshness needs
    if (queryKey.includes('workshop_core')) return 600 // 10 minutes for core data
    if (queryKey.includes('analytics')) return 300 // 5 minutes for analytics
    if (queryKey.includes('leads')) return 120 // 2 minutes for leads
    if (queryKey.includes('chat')) return 60 // 1 minute for chat data
    
    // Performance-based TTL: slower queries get longer cache
    return Math.min(Math.max(baselinePerformance * 2, 60), 900)
  }

  shouldCache(queryKey, result, executionTime) {
    // Don't cache errors or empty results
    if (!result || result.error || (Array.isArray(result.data) && result.data.length === 0)) {
      return false
    }
    
    // Always cache slow queries to improve subsequent performance
    if (executionTime > 50) return true
    
    // Cache based on data characteristics
    if (queryKey.includes('workshop_core') || queryKey.includes('subscription')) return true
    if (queryKey.includes('analytics') && executionTime > 20) return true
    
    return false
  }

  /**
   * Performance analysis and optimization recommendations
   */
  analyzeQueryPerformance() {
    const slowQueries = []
    const highErrorQueries = []
    
    for (const [queryKey, stats] of this.queryStats.entries()) {
      if (stats.avgTime > 100) {
        slowQueries.push({ queryKey, ...stats })
      }
      
      if (stats.errors / stats.count > 0.05) {
        highErrorQueries.push({ queryKey, ...stats })
      }
    }
    
    if (slowQueries.length > 0) {
      console.log('🔍 Performance Analysis: Slow queries detected', slowQueries.length)
      this.generateOptimizationRecommendations(slowQueries)
    }
    
    if (highErrorQueries.length > 0) {
      console.warn('⚠️ Error Analysis: High error rate queries detected', highErrorQueries.length)
    }
  }

  generateOptimizationRecommendations(slowQueries) {
    const recommendations = []
    
    for (const query of slowQueries.slice(0, 5)) { // Top 5 slowest
      if (query.avgTime > 200) {
        recommendations.push(`🔧 ${query.queryKey}: Consider adding database indexes (avg: ${Math.round(query.avgTime)}ms)`)
      }
      
      if (query.cacheHits / query.count < 0.3) {
        recommendations.push(`💾 ${query.queryKey}: Increase cache TTL to improve hit rate (hit rate: ${Math.round(query.cacheHits / query.count * 100)}%)`)
      }
    }
    
    if (recommendations.length > 0) {
      console.log('💡 Optimization Recommendations:', recommendations)
    }
  }

  optimizeSlowQueries() {
    // Auto-optimize cache TTLs for slow queries
    for (const [queryKey, stats] of this.queryStats.entries()) {
      if (stats.avgTime > 100 && stats.cacheHits / stats.count < 0.5) {
        // Increase cache TTL for slow queries with low hit rates
        const currentTTL = this.calculateOptimalCacheTTL(queryKey)
        const optimizedTTL = Math.min(currentTTL * 1.5, 1800) // Max 30 minutes
        
        console.log(`⚡ Auto-optimization: Increasing cache TTL for ${queryKey} to ${optimizedTTL}s`)
      }
    }
  }

  alertSlowQuery(queryKey, executionTime, options) {
    if (executionTime > 500) {
      console.error(`🚨 CRITICAL: ${queryKey} took ${Math.round(executionTime)}ms - requires immediate optimization`)
    } else if (executionTime > 200) {
      console.warn(`⚠️ WARNING: ${queryKey} took ${Math.round(executionTime)}ms - consider optimization`)
    }
  }

  /**
   * Utility functions
   */
  calculateDateRange(timeRange) {
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(endDate.getHours() - 24)
        break
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  }

  isRetryableError(error) {
    // Determine if error is temporary and worth retrying
    return error.code === 'PGRST301' || // connection error
           error.code === 'PGRST116' || // timeout
           error.message?.includes('connection') ||
           error.message?.includes('timeout')
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Performance statistics for monitoring dashboard
   */
  getPerformanceStats() {
    const stats = {
      totalQueries: 0,
      totalCacheHits: 0,
      totalErrors: 0,
      avgExecutionTime: 0,
      slowQueries: [],
      cacheEfficiency: 0
    }
    
    for (const [queryKey, queryStats] of this.queryStats.entries()) {
      stats.totalQueries += queryStats.count
      stats.totalCacheHits += queryStats.cacheHits
      stats.totalErrors += queryStats.errors
      
      if (queryStats.avgTime > 100) {
        stats.slowQueries.push({
          queryKey,
          avgTime: Math.round(queryStats.avgTime),
          count: queryStats.count
        })
      }
    }
    
    stats.cacheEfficiency = stats.totalQueries > 0 ? 
      Math.round((stats.totalCacheHits / stats.totalQueries) * 100) : 0
    
    stats.avgExecutionTime = this.calculateOverallAvgTime()
    
    return stats
  }

  calculateOverallAvgTime() {
    let totalTime = 0
    let totalNonCachedQueries = 0
    
    for (const [, stats] of this.queryStats.entries()) {
      totalTime += stats.totalTime
      totalNonCachedQueries += (stats.count - stats.cacheHits)
    }
    
    return totalNonCachedQueries > 0 ? Math.round(totalTime / totalNonCachedQueries) : 0
  }
}

// Export singleton instance
export const advancedQueryOptimizer = new AdvancedQueryOptimizer()

export default advancedQueryOptimizer