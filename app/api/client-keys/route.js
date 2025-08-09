/**
 * CarBot Client Keys API
 * Secure client key management for German automotive workshops
 * Enterprise-grade security for workshop data protection
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Initialize Supabase client for CarBot automotive SaaS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Generate cryptographically secure client key
 * Format: cb_env_32-char-hash for CarBot automotive workshops
 */
function generateClientKey(environment = 'prod') {
  const randomBytes = crypto.randomBytes(32)
  const keyHash = crypto.createHash('sha256').update(randomBytes).digest('hex')
  return `cb_${environment}_${keyHash.substring(0, 32)}`
}

/**
 * Validate client key format for security
 */
function validateClientKeyFormat(key) {
  const pattern = /^cb_(prod|test)_[a-f0-9]{32}$/
  return pattern.test(key)
}

/**
 * GET - List all client keys for authenticated workshop
 * German automotive workshops can manage multiple domains
 */
export async function GET(request) {
  try {
    // TODO: Add authentication middleware
    const workshopId = request.headers.get('x-workshop-id') || 'demo'
    
    // Fetch client keys for German workshop
    const { data: clientKeys, error } = await supabase
      .from('client_keys')
      .select(`
        id,
        key_value,
        domain,
        name,
        is_active,
        usage_limit,
        current_usage,
        last_used_at,
        created_at
      `)
      .eq('workshop_id', workshopId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('CarBot client keys fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch client keys' },
        { status: 500 }
      )
    }

    // Calculate German automotive market metrics
    const totalUsage = clientKeys.reduce((sum, key) => sum + key.current_usage, 0)
    const activeKeys = clientKeys.filter(key => key.is_active).length

    return NextResponse.json({
      success: true,
      client_keys: clientKeys.map(key => ({
        ...key,
        // Partially hide key for security (German data protection)
        key_value: key.key_value.substring(0, 16) + '...' + key.key_value.substring(-8)
      })),
      statistics: {
        total_keys: clientKeys.length,
        active_keys: activeKeys,
        total_usage: totalUsage,
        automotive_optimization: 'German market ready'
      }
    })

  } catch (error) {
    console.error('CarBot client keys API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create new client key for automotive workshop
 * German workshops can embed CarBot widget on multiple domains
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { domain, name, usage_limit } = body
    
    // TODO: Add authentication and get real workshop ID
    const workshopId = request.headers.get('x-workshop-id') || 'demo'

    // Validate German domain requirements
    if (!domain || domain.length < 3) {
      return NextResponse.json(
        { error: 'Valid domain is required for automotive workshop' },
        { status: 400 }
      )
    }

    // Generate secure client key for CarBot
    const clientKey = generateClientKey('prod')
    
    // Determine usage limits based on CarBot package tiers
    // Basic (€29): 3 keys, Premium (€79): 10 keys, Enterprise (€199): unlimited
    const defaultUsageLimit = usage_limit || 10000 // Default for automotive workshops

    // Insert into CarBot database
    const { data, error } = await supabase
      .from('client_keys')
      .insert([
        {
          workshop_id: workshopId,
          key_value: clientKey,
          domain: domain.toLowerCase(),
          name: name || `${domain} - CarBot Widget`,
          usage_limit: defaultUsageLimit,
          current_usage: 0,
          is_active: true,
          automotive_workshop: true, // German automotive market flag
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('CarBot client key creation error:', error)
      
      // Handle duplicate domain error for German workshops
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Domain already has a CarBot client key' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create client key' },
        { status: 500 }
      )
    }

    // Generate widget embedding code for German automotive workshops
    const embedCode = generateEmbedCode(clientKey, domain)

    return NextResponse.json({
      success: true,
      message: 'CarBot client key created for automotive workshop',
      client_key: {
        id: data.id,
        key: clientKey, // Full key shown only once for security
        domain: data.domain,
        name: data.name,
        usage_limit: data.usage_limit,
        created_at: data.created_at
      },
      embed_code: embedCode,
      german_market_ready: true
    }, { status: 201 })

  } catch (error) {
    console.error('CarBot client key creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update existing client key
 * German workshops can modify domains and settings
 */
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, domain, name, is_active, usage_limit } = body
    
    // TODO: Add authentication and workshop ownership validation
    const workshopId = request.headers.get('x-workshop-id') || 'demo'

    if (!id) {
      return NextResponse.json(
        { error: 'Client key ID required' },
        { status: 400 }
      )
    }

    // Update client key for German automotive workshop
    const { data, error } = await supabase
      .from('client_keys')
      .update({
        ...(domain && { domain: domain.toLowerCase() }),
        ...(name && { name }),
        ...(typeof is_active === 'boolean' && { is_active }),
        ...(usage_limit && { usage_limit }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('workshop_id', workshopId)
      .select()
      .single()

    if (error) {
      console.error('CarBot client key update error:', error)
      return NextResponse.json(
        { error: 'Failed to update client key' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Client key not found or not authorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'CarBot client key updated successfully',
      client_key: {
        ...data,
        key_value: data.key_value.substring(0, 16) + '...' + data.key_value.substring(-8)
      }
    })

  } catch (error) {
    console.error('CarBot client key update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remove client key
 * German workshops can remove unused keys
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // TODO: Add authentication
    const workshopId = request.headers.get('x-workshop-id') || 'demo'

    if (!id) {
      return NextResponse.json(
        { error: 'Client key ID required' },
        { status: 400 }
      )
    }

    // Delete client key from CarBot database
    const { data, error } = await supabase
      .from('client_keys')
      .delete()
      .eq('id', id)
      .eq('workshop_id', workshopId)
      .select()
      .single()

    if (error) {
      console.error('CarBot client key deletion error:', error)
      return NextResponse.json(
        { error: 'Failed to delete client key' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Client key not found or not authorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'CarBot client key deleted successfully',
      deleted_key_domain: data.domain
    })

  } catch (error) {
    console.error('CarBot client key deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Generate widget embedding code for German automotive workshops
 */
function generateEmbedCode(clientKey, domain) {
  return `<!-- CarBot Widget für ${domain} - Deutsche Autowerkstatt -->
<script>
  window.CarBotConfig = {
    clientKey: '${clientKey}',
    language: 'de',
    theme: 'automotive',
    position: 'bottom-right',
    automotive: true,
    germanMarket: true
  };
</script>
<script src="https://widget.carbot.de/v1/embed.js" async></script>
<!-- Ende CarBot Widget - Jetzt für deutsche Autowerkstätten optimiert -->`
}