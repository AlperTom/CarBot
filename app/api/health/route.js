/**
 * Health Check API - System Status and Diagnostics
 * MVP Critical Component - Monitors all system health
 */

import { NextResponse } from 'next/server'
import { checkDatabaseHealth, getDatabaseDiagnostics } from '../../../lib/supabase-connection-manager.js'

export async function GET(request) {
  const startTime = Date.now()
  const checks = {}
  let overallStatus = 'healthy'
  
  try {
    // 1. Database connectivity check with enhanced diagnostics
    try {
      const dbStartTime = Date.now()
      const healthStatus = await checkDatabaseHealth()
      const diagnostics = getDatabaseDiagnostics()
      
      checks.database = {
        status: healthStatus.status,
        message: healthStatus.message,
        response_time: Date.now() - dbStartTime,
        last_check: healthStatus.lastCheck,
        cached: healthStatus.cached,
        diagnostics: {
          environment_valid: diagnostics.environment.valid,
          environment_issues: diagnostics.environment.issues,
          connection_initialized: diagnostics.connection.initialized
        }
      }
      
      if (healthStatus.status === 'error') {
        overallStatus = 'degraded'
      }
    } catch (dbError) {
      checks.database = {
        status: 'error',
        message: dbError.message,
        response_time: Date.now() - startTime,
        diagnostics: getDatabaseDiagnostics()
      }
      overallStatus = 'degraded'
    }

    // 2. Environment variables check
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'OPENAI_API_KEY',
      'JWT_SECRET'
    ]
    
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    checks.environment = {
      status: missingEnvVars.length > 0 ? 'error' : 'healthy',
      message: missingEnvVars.length > 0 ? `Missing: ${missingEnvVars.join(', ')}` : 'All required variables present',
      missing_variables: missingEnvVars
    }
    
    if (missingEnvVars.length > 0) {
      overallStatus = 'error'
    }

    // 3. OpenAI API check
    try {
      const openaiCheck = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      checks.openai = {
        status: openaiCheck.ok ? 'healthy' : 'error',
        message: openaiCheck.ok ? 'API accessible' : `HTTP ${openaiCheck.status}`,
        response_time: Date.now() - startTime
      }
      
      if (!openaiCheck.ok) {
        overallStatus = 'degraded'
      }
    } catch (openaiError) {
      checks.openai = {
        status: 'error',
        message: 'API unreachable',
        error: openaiError.message
      }
      overallStatus = 'degraded'
    }

    // 4. Memory and performance check
    const memoryUsage = process.memoryUsage()
    checks.performance = {
      status: 'healthy',
      memory_usage: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heap_used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heap_total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      uptime: `${Math.round(process.uptime())}s`,
      node_version: process.version
    }

    // 5. Authentication system check
    try {
      // Test JWT functionality
      const jwt = require('jsonwebtoken')
      const testToken = jwt.sign({ test: true }, process.env.JWT_SECRET, { expiresIn: '1m' })
      const verified = jwt.verify(testToken, process.env.JWT_SECRET)
      
      checks.authentication = {
        status: verified.test ? 'healthy' : 'error',
        message: 'JWT system functional',
        test_passed: true
      }
    } catch (authError) {
      checks.authentication = {
        status: 'error',
        message: 'JWT system error',
        error: authError.message
      }
      overallStatus = 'error'
    }

    // 6. File system and deployment check
    checks.deployment = {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      build_time: process.env.BUILD_TIME || 'unknown',
      platform: process.platform,
      architecture: process.arch
    }

    const totalResponseTime = Date.now() - startTime
    
    // Response
    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      response_time: `${totalResponseTime}ms`,
      version: '2.0.0',
      service: 'CarBot Automotive Platform',
      checks,
      summary: {
        total_checks: Object.keys(checks).length,
        passed_checks: Object.values(checks).filter(check => check.status === 'healthy').length,
        failed_checks: Object.values(checks).filter(check => check.status === 'error').length
      }
    }

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 503 : 500

    return NextResponse.json(healthData, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message,
      response_time: `${Date.now() - startTime}ms`
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

// Support HEAD requests for simple health checks
export async function HEAD(request) {
  try {
    // Quick database health check
    const healthStatus = await checkDatabaseHealth()
    
    return new NextResponse(null, {
      status: healthStatus.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Database-Status': healthStatus.status,
        'X-Last-Check': healthStatus.lastCheck.toString()
      }
    })
  } catch (error) {
    return new NextResponse(null, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Error': error.message
      }
    })
  }
}