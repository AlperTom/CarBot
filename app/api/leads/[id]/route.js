import { NextResponse } from 'next/server'
import { supabaseClient } from '../../../../lib/supabase'

// Get a specific lead by ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        error: 'Lead ID is required'
      }, { status: 400 })
    }

    const { data: lead, error } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          error: 'Lead not found'
        }, { status: 404 })
      }
      
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to fetch lead'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      lead
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Update a specific lead
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({
        error: 'Lead ID is required'
      }, { status: 400 })
    }

    // Extract updateable fields
    const {
      name,
      telefon,
      anliegen,
      fahrzeug,
      chatverlauf,
      status,
      priority,
      assigned_to,
      next_follow_up,
      consent_given
    } = body

    // Build update object with only provided fields
    const updateData = {}
    
    if (name !== undefined) updateData.name = name.trim()
    if (telefon !== undefined) updateData.telefon = telefon.trim()
    if (anliegen !== undefined) updateData.anliegen = anliegen.trim()
    if (fahrzeug !== undefined) updateData.fahrzeug = fahrzeug
    if (chatverlauf !== undefined) updateData.chatverlauf = chatverlauf
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to
    if (next_follow_up !== undefined) updateData.next_follow_up = next_follow_up
    
    // Handle consent updates
    if (consent_given !== undefined) {
      updateData.consent_given = consent_given
      if (consent_given) {
        updateData.consent_timestamp = new Date().toISOString()
      }
    }

    // Update last_contact if status is being changed to contacted
    if (status === 'contacted') {
      updateData.last_contact = new Date().toISOString()
      updateData.follow_up_count = updateData.follow_up_count || 0 + 1
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        error: 'No valid fields to update'
      }, { status: 400 })
    }

    // Get the current lead data first
    const { data: currentLead, error: fetchError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({
        error: 'Lead not found'
      }, { status: 404 })
    }

    // Update the lead
    const { data: updatedLead, error: updateError } = await supabaseClient
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json({
        error: 'Failed to update lead'
      }, { status: 500 })
    }

    // Trigger webhook for lead update
    await triggerWebhooks('lead_updated', updatedLead, currentLead)

    // If status changed to converted, trigger conversion webhook
    if (status === 'converted' && currentLead.status !== 'converted') {
      await triggerWebhooks('lead_converted', updatedLead, currentLead)
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Delete a specific lead (GDPR compliance)
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        error: 'Lead ID is required'
      }, { status: 400 })
    }

    // Check if lead exists
    const { data: lead, error: fetchError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({
        error: 'Lead not found'
      }, { status: 404 })
    }

    // Delete the lead (this will cascade to related tables)
    const { error: deleteError } = await supabaseClient
      .from('leads')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json({
        error: 'Failed to delete lead'
      }, { status: 500 })
    }

    // Trigger webhook for lead deletion
    await triggerWebhooks('lead_deleted', { id, kunde_id: lead.kunde_id })

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Helper function to trigger webhooks (same as in route.js but with comparison)
async function triggerWebhooks(eventType, currentData, previousData = null) {
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
          data: currentData,
          previous_data: previousData
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
          timeout: 10000
        })

        // Log webhook delivery
        await supabaseClient
          .from('webhook_logs')
          .insert([{
            webhook_config_id: webhook.id,
            lead_id: currentData.id || null,
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
            lead_id: currentData.id || null,
            event_type: eventType,
            payload: { event: eventType, data: currentData },
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