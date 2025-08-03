import { NextResponse } from 'next/server'
import { supabaseClient } from '../../../lib/supabase'

// Get all webhook configurations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const active_only = searchParams.get('active_only') === 'true'

    let query = supabaseClient
      .from('webhook_configs')
      .select('*')
      .order('created_at', { ascending: false })

    if (active_only) {
      query = query.eq('active', true)
    }

    const { data: webhooks, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to fetch webhooks'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      webhooks
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Create a new webhook configuration
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, url, events, active = true, secret_key, headers = {} } = body

    // Validation
    if (!name || !url || !events || !Array.isArray(events)) {
      return NextResponse.json({
        error: 'Missing required fields: name, url, events (array)'
      }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({
        error: 'Invalid URL format'
      }, { status: 400 })
    }

    // Validate events
    const validEvents = [
      'lead_created',
      'lead_updated', 
      'lead_converted',
      'lead_deleted',
      'follow_up_due',
      'data_retention_warning'
    ]

    const invalidEvents = events.filter(event => !validEvents.includes(event))
    if (invalidEvents.length > 0) {
      return NextResponse.json({
        error: `Invalid events: ${invalidEvents.join(', ')}. Valid events: ${validEvents.join(', ')}`
      }, { status: 400 })
    }

    const webhookData = {
      name: name.trim(),
      url: url.trim(),
      events,
      active,
      secret_key: secret_key || null,
      headers: headers || {}
    }

    const { data: webhook, error } = await supabaseClient
      .from('webhook_configs')
      .insert([webhookData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to create webhook'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      webhook
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Test webhook endpoint
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { webhook_id, test_payload } = body

    if (!webhook_id) {
      return NextResponse.json({
        error: 'Webhook ID is required'
      }, { status: 400 })
    }

    // Get webhook configuration
    const { data: webhook, error } = await supabaseClient
      .from('webhook_configs')
      .select('*')
      .eq('id', webhook_id)
      .single()

    if (error) {
      return NextResponse.json({
        error: 'Webhook not found'
      }, { status: 404 })
    }

    // Send test webhook
    const payload = test_payload || {
      event: 'webhook_test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook from CarBot',
        webhook_id: webhook.id,
        webhook_name: webhook.name
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'CarBot-Webhook/1.0',
      ...webhook.headers
    }

    // Add signature if secret key is configured
    if (webhook.secret_key) {
      const signature = await generateWebhookSignature(payload, webhook.secret_key)
      headers['X-CarBot-Signature'] = signature
    }

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        timeout: 10000
      })

      const responseText = await response.text()

      // Log test webhook
      await supabaseClient
        .from('webhook_logs')
        .insert([{
          webhook_config_id: webhook.id,
          event_type: 'webhook_test',
          payload,
          response_status: response.status,
          response_body: responseText,
          succeeded: response.ok
        }])

      return NextResponse.json({
        success: true,
        test_result: {
          status: response.status,
          ok: response.ok,
          response_body: responseText,
          headers_sent: headers
        }
      })

    } catch (fetchError) {
      // Log failed test webhook
      await supabaseClient
        .from('webhook_logs')
        .insert([{
          webhook_config_id: webhook.id,
          event_type: 'webhook_test',
          payload,
          error_message: fetchError.message,
          succeeded: false
        }])

      return NextResponse.json({
        success: false,
        error: 'Webhook test failed',
        details: fetchError.message
      }, { status: 400 })
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Helper function to generate webhook signature
async function generateWebhookSignature(payload, secretKey) {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(payload))
  const key = encoder.encode(secretKey)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}