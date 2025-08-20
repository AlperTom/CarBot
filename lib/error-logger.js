/**
 * Production Error Logging System for CarBot
 * Comprehensive error tracking, monitoring, and reporting
 */

import { createClient } from '@supabase/supabase-js'

// Initialize logging client
let supabase = null
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (supabaseUrl && supabaseKey && !supabaseKey.includes('placeholder')) {
    supabase = createClient(supabaseUrl, supabaseKey)
  }
} catch (error) {
  console.warn('🔴 [Error Logger] Failed to initialize Supabase client:', error.message)
}

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Error categories for better organization
 */
export const ErrorCategory = {
  AUTHENTICATION: 'authentication',
  DATABASE: 'database',
  EMAIL: 'email',
  API: 'api',
  PAYMENT: 'payment',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  SYSTEM: 'system'
}

/**
 * Log error to multiple destinations (database, console, external services)
 * @param {Error|string} error - Error object or error message
 * @param {object} context - Additional context information
 * @param {string} severity - Error severity level
 * @param {string} category - Error category
 * @param {object} metadata - Additional metadata
 */
export async function logError(error, context = {}, severity = ErrorSeverity.MEDIUM, category = ErrorCategory.SYSTEM, metadata = {}) {
  const timestamp = new Date().toISOString()
  const errorMessage = typeof error === 'string' ? error : error.message
  const errorStack = typeof error === 'object' && error.stack ? error.stack : null
  
  // Create comprehensive error log entry
  const errorLog = {
    timestamp,
    message: errorMessage,
    stack: errorStack,
    severity,
    category,
    context: JSON.stringify(context),
    metadata: JSON.stringify({
      ...metadata,
      userAgent: context.userAgent || 'Unknown',
      url: context.url || 'Unknown',
      userId: context.userId || 'Anonymous',
      workshopId: context.workshopId || null,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.0'
    }),
    resolved: false,
    created_at: timestamp
  }

  // Log to console with color coding
  const severityColors = {
    [ErrorSeverity.LOW]: '🟢',
    [ErrorSeverity.MEDIUM]: '🟡', 
    [ErrorSeverity.HIGH]: '🟠',
    [ErrorSeverity.CRITICAL]: '🔴'
  }

  console.error(`${severityColors[severity]} [${category.toUpperCase()}] ${errorMessage}`)
  if (errorStack && process.env.NODE_ENV === 'development') {
    console.error(errorStack)
  }

  // Store in database if available
  if (supabase) {
    try {
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert([errorLog])

      if (dbError) {
        console.warn('⚠️ [Error Logger] Failed to store error in database:', dbError.message)
      }
    } catch (dbError) {
      console.warn('⚠️ [Error Logger] Database logging failed:', dbError.message)
    }
  }

  // Send to external monitoring service (if configured)
  if (process.env.SENTRY_DSN && severity === ErrorSeverity.CRITICAL) {
    try {
      // In production, integrate with Sentry or similar service
      console.log('🚨 [Error Logger] Critical error - would send to monitoring service')
    } catch (monitoringError) {
      console.warn('⚠️ [Error Logger] External monitoring failed:', monitoringError.message)
    }
  }

  // For critical errors in production, consider immediate notifications
  if (severity === ErrorSeverity.CRITICAL && process.env.NODE_ENV === 'production') {
    try {
      await notifyCriticalError(errorLog)
    } catch (notificationError) {
      console.warn('⚠️ [Error Logger] Critical error notification failed:', notificationError.message)
    }
  }

  return errorLog
}

/**
 * Log authentication-related errors
 */
export async function logAuthError(error, context = {}) {
  return logError(error, context, ErrorSeverity.HIGH, ErrorCategory.AUTHENTICATION)
}

/**
 * Log database-related errors
 */
export async function logDatabaseError(error, context = {}) {
  return logError(error, context, ErrorSeverity.HIGH, ErrorCategory.DATABASE)
}

/**
 * Log email-related errors
 */
export async function logEmailError(error, context = {}) {
  return logError(error, context, ErrorSeverity.MEDIUM, ErrorCategory.EMAIL)
}

/**
 * Log API-related errors
 */
export async function logApiError(error, context = {}, severity = ErrorSeverity.MEDIUM) {
  return logError(error, context, severity, ErrorCategory.API)
}

/**
 * Log payment-related errors
 */
export async function logPaymentError(error, context = {}) {
  return logError(error, context, ErrorSeverity.CRITICAL, ErrorCategory.PAYMENT)
}

/**
 * Log security-related errors
 */
export async function logSecurityError(error, context = {}) {
  return logError(error, context, ErrorSeverity.CRITICAL, ErrorCategory.SECURITY)
}

/**
 * Get error statistics for monitoring dashboard
 */
export async function getErrorStats(timeframe = '24h') {
  if (!supabase) {
    return { error: 'Database not available for error statistics' }
  }

  try {
    const hoursAgo = timeframe === '24h' ? 24 : parseInt(timeframe)
    const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('error_logs')
      .select('severity, category, created_at')
      .gte('created_at', since)

    if (error) throw error

    // Calculate statistics
    const stats = {
      total: data.length,
      bySeverity: {},
      byCategory: {},
      timeline: {}
    }

    // Count by severity
    Object.values(ErrorSeverity).forEach(severity => {
      stats.bySeverity[severity] = data.filter(log => log.severity === severity).length
    })

    // Count by category  
    Object.values(ErrorCategory).forEach(category => {
      stats.byCategory[category] = data.filter(log => log.category === category).length
    })

    // Timeline (hourly buckets)
    data.forEach(log => {
      const hour = new Date(log.created_at).getHours()
      stats.timeline[hour] = (stats.timeline[hour] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error('❌ [Error Logger] Failed to get error statistics:', error.message)
    return { error: error.message }
  }
}

/**
 * Mark error as resolved
 */
export async function resolveError(errorId, resolvedBy, resolution) {
  if (!supabase) {
    console.warn('⚠️ [Error Logger] Cannot resolve error - database not available')
    return false
  }

  try {
    const { error } = await supabase
      .from('error_logs')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
        resolution: resolution
      })
      .eq('id', errorId)

    if (error) throw error
    
    console.log(`✅ [Error Logger] Error ${errorId} marked as resolved`)
    return true
  } catch (error) {
    console.error('❌ [Error Logger] Failed to resolve error:', error.message)
    return false
  }
}

/**
 * Send critical error notifications (email, Slack, etc.)
 */
async function notifyCriticalError(errorLog) {
  // In production, implement notification system
  // For now, log to console
  console.error('🚨 CRITICAL ERROR ALERT:')
  console.error(`Timestamp: ${errorLog.timestamp}`)
  console.error(`Category: ${errorLog.category}`)
  console.error(`Message: ${errorLog.message}`)
  console.error(`Context: ${errorLog.context}`)
  
  // TODO: Implement email alerts, Slack notifications, etc.
  // Example: Send email to admin team
  // await sendCriticalErrorEmail(errorLog)
}

/**
 * Express/Next.js error handler middleware
 */
export function createErrorHandler() {
  return async (error, req, res, next) => {
    const context = {
      url: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userId: req.user?.id || null,
      workshopId: req.user?.workshopId || null
    }

    // Determine severity based on error type
    let severity = ErrorSeverity.MEDIUM
    if (error.status >= 500) severity = ErrorSeverity.HIGH
    if (error.message.includes('CRITICAL') || error.message.includes('SECURITY')) {
      severity = ErrorSeverity.CRITICAL
    }

    // Log the error
    await logError(error, context, severity, ErrorCategory.API)

    // Send response
    if (res && !res.headersSent) {
      const status = error.status || 500
      res.status(status).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 
          'Internal server error' : error.message,
        code: error.code || 'INTERNAL_ERROR'
      })
    }

    if (next) next()
  }
}

/**
 * Performance monitoring helper
 */
export function measurePerformance(operation) {
  const start = Date.now()
  
  return {
    end: async (success = true, metadata = {}) => {
      const duration = Date.now() - start
      
      if (duration > 5000) { // Log slow operations
        await logError(
          `Slow operation detected: ${operation}`,
          { operation, duration, success, ...metadata },
          ErrorSeverity.MEDIUM,
          ErrorCategory.PERFORMANCE
        )
      }
      
      return duration
    }
  }
}

export default {
  logError,
  logAuthError,
  logDatabaseError,
  logEmailError,
  logApiError,
  logPaymentError,
  logSecurityError,
  getErrorStats,
  resolveError,
  createErrorHandler,
  measurePerformance,
  ErrorSeverity,
  ErrorCategory
}