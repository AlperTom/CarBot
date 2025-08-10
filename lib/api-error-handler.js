/**
 * API Error Handler and Monitoring Utilities
 * Production-ready error handling for CarBot APIs
 */

import { createClient } from '@supabase/supabase-js'

// Error codes and mappings
export const ERROR_CODES = {
  // Database errors
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  DB_TIMEOUT: 'DB_TIMEOUT',
  DB_CONSTRAINT_ERROR: 'DB_CONSTRAINT_ERROR',
  
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_ERROR: 'AUTH_TOKEN_ERROR',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  
  // Registration errors
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_INPUT: 'INVALID_INPUT',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Generic errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

// HTTP status code mappings
export const ERROR_STATUS_CODES = {
  [ERROR_CODES.DB_CONNECTION_ERROR]: 503,
  [ERROR_CODES.DB_TIMEOUT]: 504,
  [ERROR_CODES.DB_CONSTRAINT_ERROR]: 400,
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 401,
  [ERROR_CODES.AUTH_TOKEN_ERROR]: 401,
  [ERROR_CODES.AUTH_EXPIRED]: 401,
  [ERROR_CODES.DUPLICATE_EMAIL]: 409,
  [ERROR_CODES.INVALID_INPUT]: 400,
  [ERROR_CODES.REGISTRATION_FAILED]: 500,
  [ERROR_CODES.NETWORK_ERROR]: 503,
  [ERROR_CODES.TIMEOUT_ERROR]: 504,
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
  [ERROR_CODES.INTERNAL_ERROR]: 500,
  [ERROR_CODES.UNKNOWN_ERROR]: 500
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.DB_CONNECTION_ERROR]: 'Database service temporarily unavailable. Please try again in a few moments.',
  [ERROR_CODES.DB_TIMEOUT]: 'Request timeout. Please try again.',
  [ERROR_CODES.DB_CONSTRAINT_ERROR]: 'Invalid data provided.',
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password.',
  [ERROR_CODES.AUTH_TOKEN_ERROR]: 'Authentication failed. Please try logging in again.',
  [ERROR_CODES.AUTH_EXPIRED]: 'Session expired. Please log in again.',
  [ERROR_CODES.DUPLICATE_EMAIL]: 'An account with this email already exists.',
  [ERROR_CODES.INVALID_INPUT]: 'Please check your input and try again.',
  [ERROR_CODES.REGISTRATION_FAILED]: 'Registration failed. Please try again.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection issue. Please check your internet connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timeout. Please try again.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later.',
  [ERROR_CODES.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'Something went wrong. Please try again.'
}

/**
 * Enhanced error classification based on error details
 */
export function classifyError(error) {
  if (!error) {
    return ERROR_CODES.UNKNOWN_ERROR
  }

  const errorMessage = error.message?.toLowerCase() || ''
  const errorCode = error.code

  // Database errors
  if (errorCode === '23505' || errorMessage.includes('duplicate') || errorMessage.includes('unique constraint')) {
    return ERROR_CODES.DUPLICATE_EMAIL
  }
  
  if (errorCode === '23503' || errorCode === '23502' || errorCode === '23514') {
    return ERROR_CODES.DB_CONSTRAINT_ERROR
  }
  
  if (errorMessage.includes('connection') && errorMessage.includes('refused')) {
    return ERROR_CODES.DB_CONNECTION_ERROR
  }
  
  if (errorMessage.includes('timeout') || errorCode === 'PGRST102') {
    return ERROR_CODES.DB_TIMEOUT
  }

  // Network errors
  if (errorMessage.includes('fetch failed') || errorMessage.includes('network')) {
    return ERROR_CODES.NETWORK_ERROR
  }
  
  if (errorMessage.includes('timeout')) {
    return ERROR_CODES.TIMEOUT_ERROR
  }

  // Authentication errors
  if (errorMessage.includes('invalid credentials') || errorMessage.includes('wrong password')) {
    return ERROR_CODES.AUTH_INVALID_CREDENTIALS
  }
  
  if (errorMessage.includes('token') && (errorMessage.includes('invalid') || errorMessage.includes('expired'))) {
    return ERROR_CODES.AUTH_TOKEN_ERROR
  }

  // Registration specific errors
  if (errorMessage.includes('registration') || errorMessage.includes('signup')) {
    return ERROR_CODES.REGISTRATION_FAILED
  }

  // Service availability
  if (errorCode >= 500 && errorCode < 600) {
    return ERROR_CODES.SERVICE_UNAVAILABLE
  }

  return ERROR_CODES.INTERNAL_ERROR
}

/**
 * Create standardized error response
 */
export function createErrorResponse(error, context = {}) {
  const errorCode = classifyError(error)
  const statusCode = ERROR_STATUS_CODES[errorCode] || 500
  const userMessage = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]

  const response = {
    success: false,
    error: userMessage,
    code: errorCode,
    timestamp: new Date().toISOString()
  }

  // Add debug information in development
  if (process.env.NODE_ENV === 'development') {
    response.debug = {
      originalError: error.message,
      stack: error.stack,
      context
    }
  }

  return { response, statusCode }
}

/**
 * Enhanced database operation with retry logic
 */
export async function executeWithRetry(operation, options = {}) {
  const {
    maxRetries = 3,
    retryDelayMs = 1000,
    backoffMultiplier = 2,
    retryableErrors = [
      'connection refused',
      'timeout',
      'network',
      'fetch failed',
      'ECONNRESET',
      'ENOTFOUND'
    ]
  } = options

  let lastError
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const result = await operation()
      
      // Log successful retry if not first attempt
      if (attempt > 0) {
        console.log(`✅ [Retry Success] Operation succeeded on attempt ${attempt + 1}/${maxRetries}`)
      }
      
      return result
    } catch (error) {
      lastError = error
      attempt++
      
      const errorMessage = error.message?.toLowerCase() || ''
      const isRetryable = retryableErrors.some(retryableError => 
        errorMessage.includes(retryableError.toLowerCase())
      )

      // Don't retry non-retryable errors
      if (!isRetryable) {
        console.error(`❌ [Non-Retryable] ${error.message}`)
        throw error
      }

      // Don't retry if max attempts reached
      if (attempt >= maxRetries) {
        console.error(`❌ [Max Retries] Failed after ${maxRetries} attempts: ${error.message}`)
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = retryDelayMs * Math.pow(backoffMultiplier, attempt - 1)
      console.warn(`⚠️ [Retry ${attempt}/${maxRetries}] ${error.message}. Retrying in ${delay}ms...`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Log error to database for monitoring
 */
export async function logErrorToDatabase(error, context = {}) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const errorLog = {
      error_type: context.type || 'api_error',
      error_message: error.message || 'Unknown error',
      error_stack: error.stack,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.0',
      created_at: new Date().toISOString()
    }

    await supabase
      .from('error_logs')
      .insert(errorLog)
      
  } catch (logError) {
    console.error('❌ Failed to log error to database:', logError.message)
    // Don't throw - logging failure shouldn't break the main flow
  }
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(requiredVars = []) {
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    const error = new Error(`Missing required environment variables: ${missing.join(', ')}`)
    error.code = 'ENV_MISSING'
    throw error
  }
}

/**
 * Enhanced Supabase client with connection validation
 */
export async function createValidatedSupabaseClient(options = {}) {
  const {
    validateConnection = true,
    timeout = 10000
  } = options

  // Validate required environment variables
  validateEnvironment([
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ])

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-application-name': 'carbot-api'
        }
      }
    }
  )

  // Validate connection if requested
  if (validateConnection) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const { error } = await supabase
        .from('workshops')
        .select('count')
        .limit(1)
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)

      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (acceptable)
        throw new Error(`Database connection validation failed: ${error.message}`)
      }

      console.log('✅ Database connection validated successfully')
    } catch (connectionError) {
      clearTimeout(timeoutId)
      
      if (connectionError.name === 'AbortError') {
        throw new Error(`Database connection timeout after ${timeout}ms`)
      }
      
      throw connectionError
    }
  }

  return supabase
}

/**
 * Health check utility for API endpoints
 */
export async function performHealthCheck() {
  const checks = {}
  
  try {
    // Database connectivity
    checks.database = await checkDatabaseHealth()
    
    // Environment variables
    checks.environment = checkEnvironmentHealth()
    
    // External services (can be extended)
    checks.external = await checkExternalServicesHealth()
    
  } catch (error) {
    console.error('Health check error:', error)
    checks.error = error.message
  }

  return {
    status: Object.values(checks).every(check => check.status === 'healthy') ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  }
}

async function checkDatabaseHealth() {
  try {
    const supabase = await createValidatedSupabaseClient({ validateConnection: true, timeout: 5000 })
    return { status: 'healthy', message: 'Database connection successful' }
  } catch (error) {
    return { status: 'unhealthy', message: error.message }
  }
}

function checkEnvironmentHealth() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET'
  ]
  
  const missing = required.filter(varName => !process.env[varName])
  
  return {
    status: missing.length === 0 ? 'healthy' : 'unhealthy',
    message: missing.length === 0 ? 'All required environment variables present' : `Missing: ${missing.join(', ')}`
  }
}

async function checkExternalServicesHealth() {
  // This can be extended to check Stripe, OpenAI, etc.
  return { status: 'healthy', message: 'External services not configured for health check' }
}