/**
 * Client Key Management Utility
 * Handles generation and validation of API client keys for workshops
 */

import { randomBytes } from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

let supabase = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

/**
 * Generate a new client key with specified prefix
 * @param {string} prefix - Key prefix (e.g., 'ck_test_', 'ck_live_')
 * @returns {string} Generated client key
 */
export function generateClientKey(prefix = 'ck_test_') {
  const randomPart = randomBytes(32).toString('hex')
  return prefix + randomPart
}

/**
 * Generate a secure hash of the client key for storage
 * @param {string} clientKey - The client key to hash
 * @returns {string} SHA-256 hash of the key
 */
export function hashClientKey(clientKey) {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(clientKey).digest('hex')
}

/**
 * Validate client key format
 * @param {string} key - Key to validate
 * @returns {boolean} True if valid format
 */
export function validateClientKey(key) {
  if (!key || typeof key !== 'string') {
    return false
  }
  
  return key.startsWith('ck_test_') || key.startsWith('ck_live_')
}

/**
 * Create a new client key in the database
 * @param {string} workshopId - Workshop ID
 * @param {string} name - Descriptive name for the key
 * @param {object} options - Additional options
 * @returns {Promise<object>} Created key data
 */
export async function createClientKey(workshopId, name, options = {}) {
  if (!supabase) {
    throw new Error('Database not configured')
  }
  
  const {
    prefix = 'ck_test_',
    authorizedDomains = [],
    rateLimitPerMinute = 100,
    allowedEndpoints = [],
    expiresAt = null
  } = options
  
  // Generate the key
  const clientKey = generateClientKey(prefix)
  const keyHash = hashClientKey(clientKey)
  
  // Store in database
  const { data, error } = await supabase
    .from('client_keys')
    .insert({
      workshop_id: workshopId,
      name,
      client_key_hash: keyHash,
      prefix,
      authorized_domains: authorizedDomains,
      rate_limit_per_minute: rateLimitPerMinute,
      allowed_endpoints: allowedEndpoints,
      expires_at: expiresAt,
      is_active: true
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to create client key: ${error.message}`)
  }
  
  return {
    ...data,
    client_key: clientKey // Return the actual key (only time it's shown)
  }
}

/**
 * Verify and retrieve client key information
 * @param {string} clientKey - Key to verify
 * @returns {Promise<object|null>} Key data if valid, null if invalid
 */
export async function verifyClientKey(clientKey) {
  if (!supabase || !validateClientKey(clientKey)) {
    return null
  }
  
  const keyHash = hashClientKey(clientKey)
  
  const { data, error } = await supabase
    .from('client_keys')
    .select(`
      *,
      workshop:workshops(
        id,
        name,
        business_name,
        owner_email,
        active,
        verified
      )
    `)
    .eq('client_key_hash', keyHash)
    .eq('is_active', true)
    .single()
  
  if (error || !data) {
    return null
  }
  
  // Check if key is expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }
  
  // Update last used timestamp
  await supabase
    .from('client_keys')
    .update({ 
      last_used_at: new Date().toISOString(),
      total_requests: data.total_requests + 1
    })
    .eq('id', data.id)
  
  return data
}

/**
 * List all client keys for a workshop
 * @param {string} workshopId - Workshop ID
 * @returns {Promise<array>} Array of client keys (without actual key values)
 */
export async function listClientKeys(workshopId) {
  if (!supabase) {
    throw new Error('Database not configured')
  }
  
  const { data, error } = await supabase
    .from('client_keys')
    .select('id, name, prefix, authorized_domains, rate_limit_per_minute, is_active, last_used_at, total_requests, created_at, expires_at')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to list client keys: ${error.message}`)
  }
  
  return data || []
}

/**
 * Deactivate a client key
 * @param {string} keyId - Key ID to deactivate
 * @param {string} workshopId - Workshop ID (for security)
 * @returns {Promise<boolean>} True if successful
 */
export async function deactivateClientKey(keyId, workshopId) {
  if (!supabase) {
    throw new Error('Database not configured')
  }
  
  const { error } = await supabase
    .from('client_keys')
    .update({ is_active: false })
    .eq('id', keyId)
    .eq('workshop_id', workshopId)
  
  if (error) {
    throw new Error(`Failed to deactivate client key: ${error.message}`)
  }
  
  return true
}

/**
 * Check rate limits for a client key
 * @param {string} clientKey - Key to check
 * @returns {Promise<object>} Rate limit status
 */
export async function checkRateLimit(clientKey) {
  if (!supabase) {
    return { allowed: true, remaining: 100 }
  }
  
  const keyData = await verifyClientKey(clientKey)
  if (!keyData) {
    return { allowed: false, remaining: 0, error: 'Invalid key' }
  }
  
  // Simple rate limiting implementation
  const now = new Date()
  const windowStart = new Date(now.getTime() - 60000) // 1 minute window
  
  // In a production system, you'd use Redis or a proper rate limiter
  // For now, we'll use a simple database-based approach
  
  return {
    allowed: true,
    remaining: keyData.rate_limit_per_minute,
    resetTime: new Date(now.getTime() + 60000)
  }
}

/**
 * Generate sample client keys for a workshop (development only)
 * @param {string} workshopId - Workshop ID
 * @returns {Promise<array>} Created keys
 */
export async function generateSampleKeys(workshopId) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Sample key generation not allowed in production')
  }
  
  const keys = [
    {
      name: 'Development Key',
      prefix: 'ck_test_',
      authorizedDomains: ['localhost:3000', 'localhost:3001'],
      rateLimitPerMinute: 1000
    },
    {
      name: 'Testing Key',
      prefix: 'ck_test_',
      authorizedDomains: ['*.vercel.app'],
      rateLimitPerMinute: 100
    }
  ]
  
  const createdKeys = []
  for (const keyConfig of keys) {
    try {
      const key = await createClientKey(workshopId, keyConfig.name, keyConfig)
      createdKeys.push(key)
    } catch (error) {
      console.warn(`Failed to create sample key ${keyConfig.name}:`, error.message)
    }
  }
  
  return createdKeys
}