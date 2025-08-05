/**
 * API Key Management for CarBot
 * Professional and Enterprise plans can generate and manage API keys
 * Includes rate limiting and usage tracking per key
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkFeatureAccess, checkPackageLimit, recordUsage } from '../../../lib/packageFeatures.js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Generate API key with proper entropy and format
 * @param {string} prefix - Key prefix (e.g., 'cb_live_', 'cb_test_')
 * @returns {string} Generated API key
 */
function generateApiKey(prefix = 'cb_live_') {
  const randomBytes = crypto.randomBytes(32)
  const key = randomBytes.toString('hex')
  return `${prefix}${key}`
}

/**
 * Hash API key for secure storage
 * @param {string} apiKey - Plain text API key
 * @returns {string} Hashed API key
 */
function hashApiKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

/**
 * GET /api/keys - List API keys for workshop
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const workshopId = request.headers.get('x-workshop-id')
    
    if (!workshopId) {
      return NextResponse.json({
        error: 'Workshop ID required'
      }, { status: 400 })
    }

    // Check if workshop has API access
    const featureCheck = await checkFeatureAccess(workshopId, 'apiAccess')
    if (!featureCheck.allowed) {
      return NextResponse.json({
        error: 'API access not available in your current plan',
        upgrade_required: featureCheck.upgrade_required,
        suggested_package: featureCheck.upgrade_suggestion
      }, { status: 403 })
    }

    // Get API keys for workshop (excluding hashed keys)
    const { data: keys, error } = await supabase
      .from('api_keys')
      .select(`
        id,
        name,
        key_prefix,
        is_active,
        rate_limit_per_minute,
        allowed_origins,
        last_used_at,
        created_at,
        expires_at
      `)
      .eq('workshop_id', workshopId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Unable to retrieve API keys'
      }, { status: 500 })
    }

    // Get usage statistics for each key
    const keysWithUsage = await Promise.all(keys.map(async (key) => {
      // Get usage for last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const { data: usage } = await supabase
        .from('api_key_usage')
        .select('usage_date, requests, errors')
        .eq('api_key_id', key.id)
        .gte('usage_date', thirtyDaysAgo)

      const totalRequests = usage?.reduce((sum, u) => sum + (u.requests || 0), 0) || 0
      const totalErrors = usage?.reduce((sum, u) => sum + (u.errors || 0), 0) || 0

      return {
        ...key,
        usage_30_days: {
          total_requests: totalRequests,
          total_errors: totalErrors,
          error_rate: totalRequests > 0 ? (totalErrors / totalRequests * 100).toFixed(2) + '%' : '0%'
        }
      }
    }))

    return NextResponse.json({
      success: true,
      keys: keysWithUsage,
      feature_access: featureCheck
    })

  } catch (error) {
    console.error('API keys GET error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * POST /api/keys - Create new API key
 */
export async function POST(request) {
  try {
    const workshopId = request.headers.get('x-workshop-id')
    const body = await request.json()
    const { name, rate_limit_per_minute, allowed_origins, expires_at } = body

    if (!workshopId) {
      return NextResponse.json({
        error: 'Workshop ID required'
      }, { status: 400 })
    }

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return NextResponse.json({
        error: 'API key name is required'
      }, { status: 400 })
    }

    // Check if workshop has API access
    const featureCheck = await checkFeatureAccess(workshopId, 'apiAccess')
    if (!featureCheck.allowed) {
      return NextResponse.json({
        error: 'API access not available in your current plan',
        upgrade_required: featureCheck.upgrade_required,
        suggested_package: featureCheck.upgrade_suggestion
      }, { status: 403 })
    }

    // Check API key limit (based on package)
    const { data: existingKeys } = await supabase
      .from('api_keys')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('is_active', true)

    const currentKeyCount = existingKeys?.length || 0
    const maxKeys = featureCheck.package === 'Enterprise Individual' ? 50 : 10

    if (currentKeyCount >= maxKeys) {
      return NextResponse.json({
        error: `Maximum number of API keys reached (${maxKeys} for your plan)`,
        current_count: currentKeyCount,
        limit: maxKeys
      }, { status: 400 })
    }

    // Validate rate limit
    const rateLimitValue = parseInt(rate_limit_per_minute) || 60
    if (rateLimitValue < 1 || rateLimitValue > 1000) {
      return NextResponse.json({
        error: 'Rate limit must be between 1 and 1000 requests per minute'
      }, { status: 400 })
    }

    // Validate origins format
    let validatedOrigins = null
    if (allowed_origins && Array.isArray(allowed_origins)) {
      validatedOrigins = allowed_origins.filter(origin => {
        try {
          new URL(origin)
          return true
        } catch {
          return false
        }
      })
    }

    // Generate API key
    const apiKey = generateApiKey()
    const hashedKey = hashApiKey(apiKey)
    const keyPrefix = apiKey.substring(0, 12) + '...'

    // Insert API key into database
    const { data: newKey, error } = await supabase
      .from('api_keys')
      .insert({
        workshop_id: workshopId,
        name: name.trim(),
        key_hash: hashedKey,
        key_prefix: keyPrefix,
        rate_limit_per_minute: rateLimitValue,
        allowed_origins: validatedOrigins,
        expires_at: expires_at || null,
        is_active: true
      })
      .select('id, name, key_prefix, rate_limit_per_minute, allowed_origins, created_at, expires_at')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Unable to create API key'
      }, { status: 500 })
    }

    // Record API key creation in audit log
    await supabase
      .from('audit_logs')
      .insert({
        workshop_id: workshopId,
        action: 'create',
        resource_type: 'api_key',
        resource_id: newKey.id,
        description: `API key created: ${name}`,
        metadata: {
          key_name: name,
          rate_limit: rateLimitValue,
          has_origins_restriction: !!validatedOrigins
        }
      })

    return NextResponse.json({
      success: true,
      api_key: apiKey, // Only returned once!
      key_info: newKey,
      warning: 'Store this API key securely. It will not be shown again.'
    }, { status: 201 })

  } catch (error) {
    console.error('API keys POST error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/keys - Delete/deactivate API key
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('keyId')
    const workshopId = request.headers.get('x-workshop-id')

    if (!workshopId || !keyId) {
      return NextResponse.json({
        error: 'Workshop ID and key ID required'
      }, { status: 400 })
    }

    // Check if workshop has API access
    const featureCheck = await checkFeatureAccess(workshopId, 'apiAccess')
    if (!featureCheck.allowed) {
      return NextResponse.json({
        error: 'API access not available in your current plan'
      }, { status: 403 })
    }

    // Verify key belongs to workshop
    const { data: keyData, error: fetchError } = await supabase
      .from('api_keys')
      .select('id, name, workshop_id')
      .eq('id', keyId)
      .eq('workshop_id', workshopId)
      .single()

    if (fetchError || !keyData) {
      return NextResponse.json({
        error: 'API key not found'
      }, { status: 404 })
    }

    // Deactivate the key (soft delete)
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({
        is_active: false,
        deactivated_at: new Date().toISOString()
      })
      .eq('id', keyId)

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json({
        error: 'Unable to deactivate API key'
      }, { status: 500 })
    }

    // Record API key deletion in audit log
    await supabase
      .from('audit_logs')
      .insert({
        workshop_id: workshopId,
        action: 'delete',
        resource_type: 'api_key',
        resource_id: keyId,
        description: `API key deactivated: ${keyData.name}`,
        metadata: {
          key_name: keyData.name
        }
      })

    return NextResponse.json({
      success: true,
      message: 'API key deactivated successfully'
    })

  } catch (error) {
    console.error('API keys DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * PUT /api/keys - Update API key settings
 */
export async function PUT(request) {
  try {
    const body = await request.json()
    const { keyId, name, rate_limit_per_minute, allowed_origins, is_active } = body
    const workshopId = request.headers.get('x-workshop-id')

    if (!workshopId || !keyId) {
      return NextResponse.json({
        error: 'Workshop ID and key ID required'
      }, { status: 400 })
    }

    // Check if workshop has API access
    const featureCheck = await checkFeatureAccess(workshopId, 'apiAccess')
    if (!featureCheck.allowed) {
      return NextResponse.json({
        error: 'API access not available in your current plan'
      }, { status: 403 })
    }

    // Verify key belongs to workshop
    const { data: keyData, error: fetchError } = await supabase
      .from('api_keys')
      .select('id, name, workshop_id')
      .eq('id', keyId)
      .eq('workshop_id', workshopId)
      .single()

    if (fetchError || !keyData) {
      return NextResponse.json({
        error: 'API key not found'
      }, { status: 404 })
    }

    // Prepare update object
    const updateData = {}
    
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json({
          error: 'API key name cannot be empty'
        }, { status: 400 })
      }
      updateData.name = name.trim()
    }

    if (rate_limit_per_minute !== undefined) {
      const rateLimitValue = parseInt(rate_limit_per_minute)
      if (rateLimitValue < 1 || rateLimitValue > 1000) {
        return NextResponse.json({
          error: 'Rate limit must be between 1 and 1000 requests per minute'
        }, { status: 400 })
      }
      updateData.rate_limit_per_minute = rateLimitValue
    }

    if (allowed_origins !== undefined) {
      let validatedOrigins = null
      if (allowed_origins && Array.isArray(allowed_origins)) {
        validatedOrigins = allowed_origins.filter(origin => {
          try {
            new URL(origin)
            return true
          } catch {
            return false
          }
        })
      }
      updateData.allowed_origins = validatedOrigins
    }

    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active)
      if (!is_active) {
        updateData.deactivated_at = new Date().toISOString()
      }
    }

    // Update the key
    const { data: updatedKey, error: updateError } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', keyId)
      .select('id, name, key_prefix, rate_limit_per_minute, allowed_origins, is_active, updated_at')
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json({
        error: 'Unable to update API key'
      }, { status: 500 })
    }

    // Record API key update in audit log
    await supabase
      .from('audit_logs')
      .insert({
        workshop_id: workshopId,
        action: 'update',
        resource_type: 'api_key',
        resource_id: keyId,
        description: `API key updated: ${updatedKey.name}`,
        metadata: {
          key_name: updatedKey.name,
          changes: Object.keys(updateData)
        }
      })

    return NextResponse.json({
      success: true,
      key_info: updatedKey
    })

  } catch (error) {
    console.error('API keys PUT error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Helper function to validate API key from request
 * Used by other API endpoints to authenticate API key usage
 * @param {string} apiKey - API key from request
 * @returns {Promise<Object>} Validation result
 */
export async function validateApiKey(apiKey) {
  try {
    if (!apiKey || !apiKey.startsWith('cb_')) {
      return { valid: false, error: 'Invalid API key format' }
    }

    const hashedKey = hashApiKey(apiKey)
    
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select(`
        id,
        workshop_id,
        name,
        rate_limit_per_minute,
        allowed_origins,
        is_active,
        expires_at,
        workshops (
          id,
          name,
          subscription_plan
        )
      `)
      .eq('key_hash', hashedKey)
      .eq('is_active', true)
      .single()

    if (error || !keyData) {
      return { valid: false, error: 'API key not found or inactive' }
    }

    // Check if key is expired
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      return { valid: false, error: 'API key expired' }
    }

    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.id)

    return {
      valid: true,
      key: keyData,
      workshop: keyData.workshops
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Validation error' }
  }
}