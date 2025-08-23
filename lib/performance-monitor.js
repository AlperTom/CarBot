/**
 * Performance Monitoring System
 * Real-time API performance tracking and optimization
 * Target: <100ms API responses, <50ms database queries
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      api: new Map(),
      database: new Map(),
      cache: new Map()
    }
    this.thresholds = {
      api: 100, // 100ms
      database: 50, // 50ms
      cache: 10 // 10ms
    }
  }

  /**
   * Track API endpoint performance
   */
  startApiTimer(endpoint) {
    const id = `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timer = {
      id,
      endpoint,
      startTime: performance.now(),
      timestamp: new Date().toISOString()
    }
    
    this.metrics.api.set(id, timer)
    return id
  }

  /**
   * End API timer and record metrics
   */
  endApiTimer(id, statusCode = 200, error = null) {
    const timer = this.metrics.api.get(id)
    if (!timer) return null

    const duration = performance.now() - timer.startTime
    const metric = {
      ...timer,
      duration,
      statusCode,
      error: error?.message || null,
      isSlowRequest: duration > this.thresholds.api
    }

    this.metrics.api.set(id, metric)
    
    // Log slow requests
    if (metric.isSlowRequest) {
      console.warn(`🐌 Slow API Request: ${timer.endpoint} took ${duration.toFixed(2)}ms`)
    }

    return metric
  }

  /**
   * Track database query performance
   */
  async trackDatabaseQuery(queryName, queryFn) {
    const startTime = performance.now()
    const id = `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      const result = await queryFn()
      const duration = performance.now() - startTime
      
      const metric = {
        id,
        queryName,
        duration,
        timestamp: new Date().toISOString(),
        success: true,
        isSlowQuery: duration > this.thresholds.database
      }
      
      this.metrics.database.set(id, metric)
      
      // Log slow queries
      if (metric.isSlowQuery) {
        console.warn(`🐌 Slow Database Query: ${queryName} took ${duration.toFixed(2)}ms`)
      }
      
      return { result, metric }
      
    } catch (error) {
      const duration = performance.now() - startTime
      
      const metric = {
        id,
        queryName,
        duration,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message,
        isSlowQuery: duration > this.thresholds.database
      }
      
      this.metrics.database.set(id, metric)
      console.error(`❌ Database Query Failed: ${queryName} - ${error.message}`)
      
      throw error
    }
  }

  /**
   * Track cache performance
   */
  trackCacheOperation(operation, key, hit = false) {
    const id = `cache_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const startTime = performance.now()
    
    setTimeout(() => {
      const duration = performance.now() - startTime
      
      const metric = {
        id,
        operation,
        key,
        hit,
        duration,
        timestamp: new Date().toISOString()
      }
      
      this.metrics.cache.set(id, metric)
    }, 0)
    
    return id
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    
    // Filter recent metrics
    const recentApi = Array.from(this.metrics.api.values())
      .filter(m => new Date(m.timestamp).getTime() > oneHourAgo)
    
    const recentDb = Array.from(this.metrics.database.values())
      .filter(m => new Date(m.timestamp).getTime() > oneHourAgo)
    
    const recentCache = Array.from(this.metrics.cache.values())
      .filter(m => new Date(m.timestamp).getTime() > oneHourAgo)

    // Calculate API metrics
    const apiMetrics = recentApi.length > 0 ? {
      totalRequests: recentApi.length,
      averageResponseTime: recentApi.reduce((sum, m) => sum + (m.duration || 0), 0) / recentApi.length,
      slowRequests: recentApi.filter(m => m.isSlowRequest).length,
      errorRate: recentApi.filter(m => m.statusCode >= 400).length / recentApi.length * 100,
      p95ResponseTime: this.calculatePercentile(recentApi.map(m => m.duration || 0), 95)
    } : null

    // Calculate database metrics  
    const dbMetrics = recentDb.length > 0 ? {
      totalQueries: recentDb.length,
      averageQueryTime: recentDb.reduce((sum, m) => sum + (m.duration || 0), 0) / recentDb.length,
      slowQueries: recentDb.filter(m => m.isSlowQuery).length,
      errorRate: recentDb.filter(m => !m.success).length / recentDb.length * 100,
      p95QueryTime: this.calculatePercentile(recentDb.map(m => m.duration || 0), 95)
    } : null

    // Calculate cache metrics
    const cacheMetrics = recentCache.length > 0 ? {
      totalOperations: recentCache.length,
      hitRate: recentCache.filter(m => m.hit).length / recentCache.length * 100,
      averageLatency: recentCache.reduce((sum, m) => sum + (m.duration || 0), 0) / recentCache.length
    } : null

    return {
      timestamp: new Date().toISOString(),
      period: 'Last hour',
      api: apiMetrics,
      database: dbMetrics,
      cache: cacheMetrics,
      health: {
        apiHealth: apiMetrics ? (apiMetrics.averageResponseTime < this.thresholds.api ? 'healthy' : 'degraded') : 'no_data',
        databaseHealth: dbMetrics ? (dbMetrics.averageQueryTime < this.thresholds.database ? 'healthy' : 'degraded') : 'no_data',
        cacheHealth: cacheMetrics ? (cacheMetrics.hitRate > 75 ? 'healthy' : 'degraded') : 'no_data'
      }
    }
  }

  /**
   * Calculate percentile
   */
  calculatePercentile(values, percentile) {
    if (values.length === 0) return 0
    
    const sorted = values.sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index] || 0
  }

  /**
   * Clear old metrics (keep only last 24 hours)
   */
  cleanup() {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    
    for (const [id, metric] of this.metrics.api.entries()) {
      if (new Date(metric.timestamp).getTime() < oneDayAgo) {
        this.metrics.api.delete(id)
      }
    }
    
    for (const [id, metric] of this.metrics.database.entries()) {
      if (new Date(metric.timestamp).getTime() < oneDayAgo) {
        this.metrics.database.delete(id)
      }
    }
    
    for (const [id, metric] of this.metrics.cache.entries()) {
      if (new Date(metric.timestamp).getTime() < oneDayAgo) {
        this.metrics.cache.delete(id)
      }
    }
  }

  /**
   * Get recent slow operations
   */
  getSlowOperations() {
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    
    const slowApi = Array.from(this.metrics.api.values())
      .filter(m => m.isSlowRequest && new Date(m.timestamp).getTime() > oneHourAgo)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 10)
    
    const slowDb = Array.from(this.metrics.database.values())
      .filter(m => m.isSlowQuery && new Date(m.timestamp).getTime() > oneHourAgo)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 10)
    
    return {
      slowApiRequests: slowApi,
      slowDatabaseQueries: slowDb
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Cleanup old metrics every hour
setInterval(() => {
  performanceMonitor.cleanup()
}, 60 * 60 * 1000)

export default performanceMonitor