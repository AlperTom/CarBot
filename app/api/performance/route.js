/**
 * Performance Monitoring API
 * Real-time performance metrics and system optimization insights
 * Implements Phase 1 Performance Enhancement requirements
 */

import { NextResponse } from 'next/server'
import { performanceMonitor } from '../../../lib/performance-monitor.js'
import { cacheManager, CacheKeys, CacheTTL } from '../../../lib/redis-cache.js'
import { checkDatabaseHealth } from '../../../lib/supabase-connection-manager.js'

export async function GET(request) {
  const timerId = performanceMonitor.startApiTimer('/api/performance')
  const { searchParams } = new URL(request.url)
  const detailed = searchParams.get('detailed') === 'true'
  
  try {
    // Get performance summary
    const summary = performanceMonitor.getSummary()
    const slowOps = performanceMonitor.getSlowOperations()
    
    // Get cache statistics
    const cacheStats = await cacheManager.getStats()
    
    // Calculate health scores (0-100)
    const healthScores = {
      api: calculateApiHealthScore(summary.api),
      database: calculateDatabaseHealthScore(summary.database),
      cache: calculateCacheHealthScore(summary.cache),
      overall: 0
    }
    
    healthScores.overall = Math.round(
      (healthScores.api + healthScores.database + healthScores.cache) / 3
    )
    
    // Performance recommendations
    const recommendations = generateRecommendations(summary, slowOps, healthScores)
    
    const responseData = {
      timestamp: new Date().toISOString(),
      healthScores,
      summary,
      slowOperations: slowOps,
      cacheStats,
      recommendations,
      targets: {
        api: {
          responseTime: '< 100ms',
          p95ResponseTime: '< 150ms',
          errorRate: '< 1%'
        },
        database: {
          queryTime: '< 50ms',
          p95QueryTime: '< 100ms',
          errorRate: '< 0.5%'
        },
        cache: {
          hitRate: '> 85%',
          latency: '< 10ms'
        }
      }
    }
    
    // Add detailed metrics if requested
    if (detailed) {
      responseData.detailed = {
        recentSlowRequests: Array.from(performanceMonitor.metrics.api.values())
          .filter(m => m.isSlowRequest && new Date(m.timestamp).getTime() > Date.now() - (60 * 60 * 1000))
          .slice(0, 20),
        recentSlowQueries: Array.from(performanceMonitor.metrics.database.values())
          .filter(m => m.isSlowQuery && new Date(m.timestamp).getTime() > Date.now() - (60 * 60 * 1000))
          .slice(0, 20)
      }
    }
    
    const metric = performanceMonitor.endApiTimer(timerId, 200)
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`,
        'X-Health-Score': healthScores.overall.toString()
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    
    return NextResponse.json({
      error: {
        message: error.message,
        type: error.constructor.name,
        timestamp: new Date().toISOString()
      }
    }, { 
      status: 500,
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
  }
}

/**
 * Calculate API health score (0-100)
 */
function calculateApiHealthScore(apiMetrics) {
  if (!apiMetrics) return 100
  
  let score = 100
  
  // Penalize for slow average response time
  if (apiMetrics.averageResponseTime > 100) {
    score -= Math.min(40, (apiMetrics.averageResponseTime - 100) / 10)
  }
  
  // Penalize for high error rate
  if (apiMetrics.errorRate > 1) {
    score -= Math.min(30, (apiMetrics.errorRate - 1) * 5)
  }
  
  // Penalize for slow P95
  if (apiMetrics.p95ResponseTime > 150) {
    score -= Math.min(20, (apiMetrics.p95ResponseTime - 150) / 20)
  }
  
  // Penalize for too many slow requests
  const slowRequestPercent = (apiMetrics.slowRequests / apiMetrics.totalRequests) * 100
  if (slowRequestPercent > 5) {
    score -= Math.min(10, (slowRequestPercent - 5))
  }
  
  return Math.max(0, Math.round(score))
}

/**
 * Calculate database health score (0-100)
 */
function calculateDatabaseHealthScore(dbMetrics) {
  if (!dbMetrics) return 100
  
  let score = 100
  
  // Penalize for slow average query time
  if (dbMetrics.averageQueryTime > 50) {
    score -= Math.min(40, (dbMetrics.averageQueryTime - 50) / 5)
  }
  
  // Penalize for high error rate
  if (dbMetrics.errorRate > 0.5) {
    score -= Math.min(30, (dbMetrics.errorRate - 0.5) * 10)
  }
  
  // Penalize for slow P95
  if (dbMetrics.p95QueryTime > 100) {
    score -= Math.min(20, (dbMetrics.p95QueryTime - 100) / 10)
  }
  
  // Penalize for too many slow queries
  const slowQueryPercent = (dbMetrics.slowQueries / dbMetrics.totalQueries) * 100
  if (slowQueryPercent > 2) {
    score -= Math.min(10, (slowQueryPercent - 2) * 2)
  }
  
  return Math.max(0, Math.round(score))
}

/**
 * Calculate cache health score (0-100)
 */
function calculateCacheHealthScore(cacheMetrics) {
  if (!cacheMetrics) return 100
  
  let score = 100
  
  // Penalize for low hit rate
  if (cacheMetrics.hitRate < 85) {
    score -= Math.min(50, (85 - cacheMetrics.hitRate) * 2)
  }
  
  // Penalize for high latency
  if (cacheMetrics.averageLatency > 10) {
    score -= Math.min(30, (cacheMetrics.averageLatency - 10) * 2)
  }
  
  return Math.max(0, Math.round(score))
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(summary, slowOps, healthScores) {
  const recommendations = []
  
  // API recommendations
  if (healthScores.api < 80) {
    if (summary.api && summary.api.averageResponseTime > 100) {
      recommendations.push({
        type: 'performance',
        severity: 'high',
        title: 'API Response Time Optimization',
        description: `Average API response time is ${summary.api.averageResponseTime.toFixed(0)}ms (target: <100ms)`,
        action: 'Implement caching for frequently accessed endpoints',
        impact: 'High - Improves user experience and reduces server load'
      })
    }
    
    if (summary.api && summary.api.errorRate > 1) {
      recommendations.push({
        type: 'reliability',
        severity: 'high',
        title: 'Reduce API Error Rate',
        description: `API error rate is ${summary.api.errorRate.toFixed(1)}% (target: <1%)`,
        action: 'Investigate and fix failing API endpoints',
        impact: 'High - Critical for application stability'
      })
    }
  }
  
  // Database recommendations
  if (healthScores.database < 80) {
    if (summary.database && summary.database.averageQueryTime > 50) {
      recommendations.push({
        type: 'performance',
        severity: 'high',
        title: 'Database Query Optimization',
        description: `Average database query time is ${summary.database.averageQueryTime.toFixed(0)}ms (target: <50ms)`,
        action: 'Add database indexes and optimize slow queries',
        impact: 'High - Directly impacts response times'
      })
    }
  }
  
  // Cache recommendations
  if (healthScores.cache < 80) {
    if (summary.cache && summary.cache.hitRate < 85) {
      recommendations.push({
        type: 'performance',
        severity: 'medium',
        title: 'Improve Cache Hit Rate',
        description: `Cache hit rate is ${summary.cache.hitRate.toFixed(1)}% (target: >85%)`,
        action: 'Review cache TTL strategies and add more cacheable endpoints',
        impact: 'Medium - Reduces database load and improves response times'
      })
    }
  }
  
  // Slow operations recommendations
  if (slowOps.slowApiRequests.length > 0) {
    const slowestEndpoint = slowOps.slowApiRequests[0]
    recommendations.push({
      type: 'optimization',
      severity: 'medium',
      title: 'Optimize Slowest API Endpoint',
      description: `${slowestEndpoint.endpoint} took ${slowestEndpoint.duration.toFixed(0)}ms`,
      action: 'Profile and optimize this specific endpoint',
      impact: 'Medium - Improves worst-case performance'
    })
  }
  
  return recommendations
}

export async function POST(request) {
  const timerId = performanceMonitor.startApiTimer('/api/performance')
  
  try {
    const { action } = await request.json()
    
    if (action === 'clear_metrics') {
      // Clear performance metrics
      performanceMonitor.metrics.api.clear()
      performanceMonitor.metrics.database.clear()
      performanceMonitor.metrics.cache.clear()
      
      const metric = performanceMonitor.endApiTimer(timerId, 200)
      
      return NextResponse.json({
        success: true,
        message: 'Performance metrics cleared',
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'X-Response-Time': `${metric.duration.toFixed(2)}ms`
        }
      })
    }
    
    if (action === 'flush_cache') {
      // Flush cache
      await cacheManager.flush()
      
      const metric = performanceMonitor.endApiTimer(timerId, 200)
      
      return NextResponse.json({
        success: true,
        message: 'Cache flushed successfully',
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'X-Response-Time': `${metric.duration.toFixed(2)}ms`
        }
      })
    }
    
    const metric = performanceMonitor.endApiTimer(timerId, 400)
    
    return NextResponse.json({
      error: 'Unknown action'
    }, { 
      status: 400,
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    
    return NextResponse.json({
      error: {
        message: error.message,
        type: error.constructor.name
      }
    }, { 
      status: 500,
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
  }
}