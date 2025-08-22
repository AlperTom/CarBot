/**
 * Supabase Connection Manager
 * Enhanced connection handling with retry logic, fallbacks, and detailed diagnostics
 */

import { createClient } from '@supabase/supabase-js'

// Connection retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
}

// Connection health cache
let connectionHealth = {
  isHealthy: false,
  lastCheck: 0,
  lastError: null,
  checkInterval: 30000 // 30 seconds
}

class SupabaseConnectionManager {
  constructor() {
    this.client = null
    this.adminClient = null
    this.isInitialized = false
  }

  /**
   * Validate environment variables
   */
  validateEnvironment() {
    const issues = []
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      issues.push('NEXT_PUBLIC_SUPABASE_URL is missing')
    } else if (process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
      issues.push('NEXT_PUBLIC_SUPABASE_URL contains placeholder value')
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
    } else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-production-supabase-anon-key-here')) {
      issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value')
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      issues.push('SUPABASE_SERVICE_ROLE_KEY is missing')
    } else if (process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-production-supabase-service-role-key-here')) {
      issues.push('SUPABASE_SERVICE_ROLE_KEY contains placeholder value')
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }

  /**
   * Initialize Supabase clients with validation
   */
  async initialize() {
    if (this.isInitialized) {
      return { success: true, client: this.client, adminClient: this.adminClient }
    }

    try {
      // Validate environment first
      const envCheck = this.validateEnvironment()
      if (!envCheck.isValid) {
        throw new Error(`Environment validation failed: ${envCheck.issues.join(', ')}`)
      }

      // Create standard client
      this.client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          db: {
            schema: 'public',
          },
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
          },
          global: {
            headers: { 'x-client-info': 'carbot-api/2.0' },
          },
        }
      )

      // Create admin client
      this.adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          },
          global: {
            headers: { 'x-client-info': 'carbot-admin/2.0' },
          }
        }
      )

      // Test connection
      await this.testConnection()
      
      this.isInitialized = true
      connectionHealth.isHealthy = true
      connectionHealth.lastCheck = Date.now()
      connectionHealth.lastError = null

      return {
        success: true,
        client: this.client,
        adminClient: this.adminClient
      }

    } catch (error) {
      connectionHealth.isHealthy = false
      connectionHealth.lastError = error.message
      connectionHealth.lastCheck = Date.now()
      
      throw new Error(`Supabase initialization failed: ${error.message}`)
    }
  }

  /**
   * Test database connection with retry logic
   */
  async testConnection(retryCount = 0) {
    if (!this.adminClient) {
      throw new Error('Admin client not initialized')
    }

    try {
      // Use raw SQL query to test connection - most reliable approach
      const { data, error } = await this.adminClient.from('users').select('count').limit(0)

      // If users table doesn't exist, that's fine - connection is working
      if (error && !error.message.includes('relation "public.users" does not exist')) {
        throw new Error(`Database query failed: ${error.message}`)
      }

      // Connection successful, even if no tables exist yet
      return { success: true, data: data || [] }

    } catch (error) {
      // Check for specific connection errors vs table existence errors
      const isConnectionError = error.message.includes('fetch failed') || 
                               error.message.includes('network') ||
                               error.message.includes('timeout') ||
                               error.message.includes('ECONNREFUSED') ||
                               error.message.includes('getaddrinfo')

      if (isConnectionError && retryCount < RETRY_CONFIG.maxRetries) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount),
          RETRY_CONFIG.maxDelay
        )
        
        console.warn(`Connection test failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries + 1})`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.testConnection(retryCount + 1)
      }
      
      // If it's just a table not existing, that's fine for connection test
      if (error.message.includes('does not exist')) {
        return { success: true, data: [], message: 'Connection successful, schema not initialized' }
      }
      
      throw error
    }
  }

  /**
   * Get connection health status
   */
  async getHealthStatus() {
    const now = Date.now()
    
    // Return cached status if recent
    if (connectionHealth.lastCheck > 0 && 
        (now - connectionHealth.lastCheck) < connectionHealth.checkInterval) {
      return {
        status: connectionHealth.isHealthy ? 'healthy' : 'error',
        message: connectionHealth.isHealthy ? 'Connection active' : connectionHealth.lastError,
        lastCheck: connectionHealth.lastCheck,
        cached: true
      }
    }

    // Perform fresh health check
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      await this.testConnection()
      
      connectionHealth.isHealthy = true
      connectionHealth.lastError = null
      connectionHealth.lastCheck = now

      return {
        status: 'healthy',
        message: 'Connection verified',
        lastCheck: now,
        cached: false
      }

    } catch (error) {
      connectionHealth.isHealthy = false
      connectionHealth.lastError = error.message
      connectionHealth.lastCheck = now

      return {
        status: 'error',
        message: error.message,
        lastCheck: now,
        cached: false
      }
    }
  }

  /**
   * Execute query with retry logic
   */
  async executeQuery(queryFn, retryCount = 0) {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      return await queryFn(this.client, this.adminClient)

    } catch (error) {
      // Check if it's a connection error and we can retry
      const isConnectionError = error.message.includes('fetch failed') || 
                               error.message.includes('network') ||
                               error.message.includes('timeout')

      if (isConnectionError && retryCount < RETRY_CONFIG.maxRetries) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount),
          RETRY_CONFIG.maxDelay
        )
        
        console.warn(`Query failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries + 1})`)
        
        // Reset initialization to force reconnect
        this.isInitialized = false
        connectionHealth.isHealthy = false
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.executeQuery(queryFn, retryCount + 1)
      }
      
      throw error
    }
  }

  /**
   * Get diagnostic information
   */
  getDiagnostics() {
    const envCheck = this.validateEnvironment()
    
    return {
      environment: {
        valid: envCheck.isValid,
        issues: envCheck.issues,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
             process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/[a-z0-9]{20}/gi, '***') : 'missing',
        anonKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceKeySet: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      connection: {
        initialized: this.isInitialized,
        healthy: connectionHealth.isHealthy,
        lastCheck: connectionHealth.lastCheck,
        lastError: connectionHealth.lastError
      },
      retry_config: RETRY_CONFIG
    }
  }
}

// Export singleton instance
export const supabaseConnectionManager = new SupabaseConnectionManager()

// Export clients for backward compatibility
export const getSupabaseClient = async () => {
  const result = await supabaseConnectionManager.initialize()
  return result.client
}

export const getSupabaseAdmin = async () => {
  const result = await supabaseConnectionManager.initialize()
  return result.adminClient
}

// Export health check function
export const checkDatabaseHealth = async () => {
  return await supabaseConnectionManager.getHealthStatus()
}

// Export diagnostics
export const getDatabaseDiagnostics = () => {
  return supabaseConnectionManager.getDiagnostics()
}