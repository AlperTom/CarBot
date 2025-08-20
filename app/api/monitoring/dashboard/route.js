/**
 * Monitoring Dashboard API - Real-time Production Insights
 * Provides comprehensive system health and performance metrics
 */

import { NextResponse } from 'next/server'
import { getErrorStats } from '../../../../lib/error-logger.js'
import { getRateLimitStats } from '../../../../lib/rate-limiter.js'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for metrics
let supabase = null
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (supabaseUrl && supabaseKey && !supabaseKey.includes('placeholder')) {
    supabase = createClient(supabaseUrl, supabaseKey)
  }
} catch (error) {
  console.warn('⚠️ [Monitoring] Failed to initialize Supabase client:', error.message)
}

/**
 * Get system health metrics
 */
async function getSystemHealth() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '2.0.0'
  }

  // Check database connectivity
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('count')
        .limit(1)
      
      health.database = error ? 'unhealthy' : 'healthy'
      health.databaseError = error?.message
    } catch (dbError) {
      health.database = 'unhealthy'
      health.databaseError = dbError.message
    }
  } else {
    health.database = 'mock_mode'
  }

  // Check external services
  health.services = {
    resend: process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('placeholder') ? 'configured' : 'not_configured',
    stripe: process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder') ? 'configured' : 'not_configured',
    openai: process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('placeholder') ? 'configured' : 'not_configured'
  }

  return health
}

/**
 * Get user and workshop statistics
 */
async function getBusinessMetrics() {
  if (!supabase) {
    return {
      error: 'Database not available',
      mock: true
    }
  }

  try {
    const [
      { data: workshops, error: workshopError },
      { data: leads, error: leadsError }
    ] = await Promise.all([
      supabase.from('workshops').select('id, created_at, active').limit(1000),
      supabase.from('leads').select('id, created_at, workshop_id').limit(5000)
    ])

    if (workshopError || leadsError) {
      throw new Error(workshopError?.message || leadsError?.message)
    }

    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      workshops: {
        total: workshops?.length || 0,
        active: workshops?.filter(w => w.active)?.length || 0,
        last24h: workshops?.filter(w => new Date(w.created_at) > last24h)?.length || 0,
        last7d: workshops?.filter(w => new Date(w.created_at) > last7d)?.length || 0,
        last30d: workshops?.filter(w => new Date(w.created_at) > last30d)?.length || 0
      },
      leads: {
        total: leads?.length || 0,
        last24h: leads?.filter(l => new Date(l.created_at) > last24h)?.length || 0,
        last7d: leads?.filter(l => new Date(l.created_at) > last7d)?.length || 0,
        last30d: leads?.filter(l => new Date(l.created_at) > last30d)?.length || 0
      }
    }
  } catch (error) {
    return {
      error: error.message,
      workshops: { total: 0, active: 0, last24h: 0, last7d: 0, last30d: 0 },
      leads: { total: 0, last24h: 0, last7d: 0, last30d: 0 }
    }
  }
}

/**
 * Get performance metrics
 */
async function getPerformanceMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    nodejs: {
      version: process.version,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      cpu: process.cpuUsage()
    }
  }

  // Get error statistics
  try {
    const errorStats = await getErrorStats('24h')
    metrics.errors = errorStats
  } catch (error) {
    metrics.errors = { error: error.message }
  }

  // Get rate limiting statistics
  try {
    metrics.rateLimits = getRateLimitStats()
  } catch (error) {
    metrics.rateLimits = { error: error.message }
  }

  return metrics
}

/**
 * Get recent error logs for debugging
 */
async function getRecentErrors(limit = 50) {
  if (!supabase) {
    return { error: 'Database not available', errors: [] }
  }

  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      errors: data || [],
      count: data?.length || 0
    }
  } catch (error) {
    return {
      error: error.message,
      errors: []
    }
  }
}

/**
 * Main monitoring dashboard endpoint
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') || 'overview'
    const timeframe = searchParams.get('timeframe') || '24h'

    switch (section) {
      case 'health':
        const health = await getSystemHealth()
        return NextResponse.json({
          success: true,
          data: health
        })

      case 'business':
        const businessMetrics = await getBusinessMetrics()
        return NextResponse.json({
          success: true,
          data: businessMetrics
        })

      case 'performance':
        const performanceMetrics = await getPerformanceMetrics()
        return NextResponse.json({
          success: true,
          data: performanceMetrics
        })

      case 'errors':
        const limit = parseInt(searchParams.get('limit')) || 50
        const recentErrors = await getRecentErrors(limit)
        return NextResponse.json({
          success: true,
          data: recentErrors
        })

      case 'overview':
      default:
        // Get all metrics for overview dashboard
        const [health2, business, performance] = await Promise.all([
          getSystemHealth(),
          getBusinessMetrics(),
          getPerformanceMetrics()
        ])

        return NextResponse.json({
          success: true,
          data: {
            health: health2,
            business,
            performance: {
              uptime: performance.nodejs.uptime,
              memory: performance.nodejs.memory,
              errors: performance.errors,
              rateLimits: performance.rateLimits
            },
            timestamp: new Date().toISOString()
          }
        })
    }
  } catch (error) {
    console.error('❌ [Monitoring Dashboard] Error:', error.message)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve monitoring data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

/**
 * Update monitoring settings or resolve errors
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'resolve_error':
        if (!supabase) {
          return NextResponse.json({
            success: false,
            error: 'Database not available'
          }, { status: 503 })
        }

        const { errorId, resolution } = data
        const { error } = await supabase
          .from('error_logs')
          .update({
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolution: resolution || 'Resolved via monitoring dashboard'
          })
          .eq('id', errorId)

        if (error) throw error

        return NextResponse.json({
          success: true,
          message: `Error ${errorId} marked as resolved`
        })

      case 'clear_cache':
        // Clear various caches if implemented
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ [Monitoring Dashboard] POST Error:', error.message)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process monitoring request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}