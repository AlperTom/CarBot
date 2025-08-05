import { NextResponse } from 'next/server'
import { supabaseClient } from '../../../lib/supabase'
import { checkPackageLimit, recordUsage } from '../../../lib/packageFeatures'
import { sendLeadNotification } from '../../../lib/email'
import { v4 as uuidv4 } from 'uuid'

// Create a new lead
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, telefon, anliegen, fahrzeug, chatverlauf, consent_given, kunde_id } = body

    // Validation
    if (!name || !telefon || !anliegen) {
      return NextResponse.json({
        error: 'Missing required fields: name, telefon, anliegen'
      }, { status: 400 })
    }

    // Get workshop ID from kunde_id (client key)
    let workshopId = null
    if (kunde_id) {
      const { data: workshop } = await supabaseClient
        .from('workshops')
        .select('id')
        .eq('slug', kunde_id)
        .single()
      
      workshopId = workshop?.id
    }

    // Check package limits before creating lead
    if (workshopId) {
      const limitCheck = await checkPackageLimit(workshopId, 'lead', 1)
      if (!limitCheck.allowed) {
        return NextResponse.json({
          error: 'Lead limit exceeded for current package',
          limit_info: {
            current_usage: limitCheck.current_usage,
            limit: limitCheck.limit,
            package: limitCheck.package,
            upgrade_required: limitCheck.upgrade_required,
            upgrade_suggestion: limitCheck.upgrade_suggestion
          }
        }, { status: 402 }) // Payment Required
      }
    }

    // Generate unique lead ID
    const leadId = `LEAD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Prepare lead data
    const leadData = {
      kunde_id: kunde_id || 'anonymous',
      workshop_id: workshopId,
      name: name.trim(),
      telefon: telefon.trim(),
      anliegen: anliegen.trim(),
      fahrzeug: fahrzeug || {},
      chatverlauf: chatverlauf || [],
      consent_given: consent_given || false,
      consent_timestamp: consent_given ? new Date().toISOString() : null,
      status: 'new',
      priority: 'medium',
      source: 'chatbot'
    }

    // Insert lead into database
    const { data: lead, error } = await supabaseClient
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      // Log detailed error server-side but don't expose to client
      return NextResponse.json({
        error: 'Unable to process request. Please try again.'
      }, { status: 500 })
    }

    // Record usage for lead creation
    if (workshopId) {
      try {
        await recordUsage(workshopId, 'leads', 1)
      } catch (usageError) {
        console.error('Usage recording error:', usageError)
        // Don't fail the request if usage recording fails
      }
    }

    // Trigger webhook for lead creation
    await triggerWebhooks('lead_created', lead)

    // Send email notification to workshops
    await sendWorkshopNotification(lead)

    // Schedule initial follow-up
    await scheduleFollowUp(lead.id, 'email', 24) // Follow up in 24 hours

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        kunde_id: lead.kunde_id,
        name: lead.name,
        status: lead.status,
        timestamp: lead.timestamp
      }
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    // Generic error message without internal details
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again.'
    }, { status: 500 })
  }
}

// Get leads with filtering and pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 50
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const from_date = searchParams.get('from_date')
    const to_date = searchParams.get('to_date')

    let query = supabaseClient
      .from('leads')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    
    if (priority) {
      query = query.eq('priority', priority)
    }

    if (search) {
      // Sanitize search input to prevent SQL injection
      const sanitizedSearch = search.replace(/[%_\\]/g, '\\$&').substring(0, 100)
      query = query.or(`name.ilike.%${sanitizedSearch}%, telefon.ilike.%${sanitizedSearch}%, anliegen.ilike.%${sanitizedSearch}%`)
    }

    if (from_date) {
      query = query.gte('timestamp', from_date)
    }

    if (to_date) {
      query = query.lte('timestamp', to_date)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: leads, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      // Log detailed error server-side but don't expose to client
      return NextResponse.json({
        error: 'Unable to retrieve data. Please try again.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    })

  } catch (error) {
    console.error('API error:', error)
    // Generic error message without internal details
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again.'
    }, { status: 500 })
  }
}

// Helper function to trigger webhooks
async function triggerWebhooks(eventType, leadData) {
  try {
    // Get active webhook configurations for this event
    const { data: webhooks, error } = await supabaseClient
      .from('webhook_configs')
      .select('*')
      .eq('active', true)
      .contains('events', [eventType])

    if (error || !webhooks?.length) {
      return
    }

    // Send webhook to each configured endpoint
    for (const webhook of webhooks) {
      try {
        const payload = {
          event: eventType,
          timestamp: new Date().toISOString(),
          data: leadData
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

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          timeout: 10000 // 10 second timeout
        })

        // Log webhook delivery
        await supabaseClient
          .from('webhook_logs')
          .insert([{
            webhook_config_id: webhook.id,
            lead_id: leadData.id,
            event_type: eventType,
            payload,
            response_status: response.status,
            response_body: await response.text(),
            succeeded: response.ok
          }])

      } catch (webhookError) {
        console.error(`Webhook delivery failed for ${webhook.name}:`, webhookError)
        
        // Log failed webhook delivery
        await supabaseClient
          .from('webhook_logs')
          .insert([{
            webhook_config_id: webhook.id,
            lead_id: leadData.id,
            event_type: eventType,
            payload: { event: eventType, data: leadData },
            error_message: webhookError.message,
            succeeded: false
          }])
      }
    }
  } catch (error) {
    console.error('Webhook trigger error:', error)
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

// Helper function to send workshop notification
async function sendWorkshopNotification(lead) {
  try {
    // Get workshop email from the database
    let workshopEmail = process.env.WORKSHOP_EMAIL || 'demo@carbot.de'
    
    if (lead.workshop_id) {
      const { data: workshop } = await supabaseClient
        .from('workshops')
        .select('owner_email')
        .eq('id', lead.workshop_id)
        .single()
      
      if (workshop?.owner_email) {
        workshopEmail = workshop.owner_email
      }
    }

    // Send email using the new email service
    const emailResult = await sendLeadNotification(lead, workshopEmail)
    
    // Also store in database for audit trail
    const emailData = {
      lead_id: lead.id,
      to_email: workshopEmail,
      subject: `Neue Anfrage von ${lead.name} - ${lead.anliegen?.substring(0, 50) || 'Kundenanfrage'}...`,
      body: `Lead notification sent via email service`,
      status: emailResult.success ? 'sent' : 'failed',
      sent_at: emailResult.success ? new Date().toISOString() : null
    }

    await supabaseClient
      .from('email_notifications')
      .insert([emailData])

    console.log('Workshop notification result:', emailResult.success ? 'Success' : 'Failed')

  } catch (error) {
    console.error('Workshop notification error:', error)
  }
}

// Helper function to schedule follow-up
async function scheduleFollowUp(leadId, taskType, hoursFromNow) {
  try {
    const scheduledFor = new Date()
    scheduledFor.setHours(scheduledFor.getHours() + hoursFromNow)

    await supabaseClient
      .from('follow_up_tasks')
      .insert([{
        lead_id: leadId,
        task_type: taskType,
        scheduled_for: scheduledFor.toISOString(),
        template_name: 'initial_follow_up'
      }])

  } catch (error) {
    console.error('Follow-up scheduling error:', error)
  }
}