/**
 * Enterprise Contact Request API
 * Handles enterprise upgrade requests and customer inquiries
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * POST /api/packages/contact - Submit enterprise contact request
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      workshop_id, 
      target_package, 
      current_package,
      trigger,
      usage_data,
      contact_reason = 'upgrade',
      custom_message = ''
    } = body

    if (!workshop_id) {
      return NextResponse.json({
        error: 'Workshop ID required'
      }, { status: 400 })
    }

    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select(`
        id,
        name,
        email,
        phone,
        website,
        address,
        owner_name,
        created_at,
        subscription_plan
      `)
      .eq('id', workshop_id)
      .single()

    if (workshopError || !workshop) {
      return NextResponse.json({
        error: 'Workshop not found'
      }, { status: 404 })
    }

    // Create enterprise contact request
    const contactRequest = {
      workshop_id: workshop_id,
      contact_reason: contact_reason,
      target_package: target_package,
      current_package: current_package,
      trigger: trigger,
      usage_data: usage_data,
      custom_message: custom_message,
      workshop_details: {
        name: workshop.name,
        email: workshop.email,
        phone: workshop.phone,
        website: workshop.website,
        address: workshop.address,
        owner_name: workshop.owner_name,
        account_age_days: Math.floor((new Date() - new Date(workshop.created_at)) / (1000 * 60 * 60 * 24))
      },
      status: 'pending',
      priority: determinePriority(usage_data, trigger),
      created_at: new Date().toISOString()
    }

    // Store contact request
    const { data: request_record, error: insertError } = await supabase
      .from('enterprise_contact_requests')
      .insert(contactRequest)
      .select('*')
      .single()

    if (insertError) {
      console.error('Error creating contact request:', insertError)
      return NextResponse.json({
        error: 'Failed to create contact request'
      }, { status: 500 })
    }

    // Send notification to sales team (in a real app, this would be an email/Slack notification)
    await notifySalesTeam(request_record)

    // Send confirmation email to customer
    await sendCustomerConfirmation(workshop, request_record)

    return NextResponse.json({
      success: true,
      request_id: request_record.id,
      message: 'Enterprise-Anfrage erfolgreich eingereicht',
      next_steps: [
        'Unser Enterprise-Team wurde benachrichtigt',
        'Sie erhalten binnen 24 Stunden eine persönliche Kontaktaufnahme',
        'Wir bereiten ein individuelles Angebot für Sie vor',
        'Bei dringenden Fragen erreichen Sie uns unter enterprise@carbot.chat'
      ],
      estimated_response_time: '24 Stunden',
      contact_info: {
        email: 'enterprise@carbot.chat',
        phone: '+49 (0) 30 12345678',
        calendar_link: process.env.CALENDLY_ENTERPRISE_LINK || 'https://calendly.com/carbot-enterprise'
      }
    })

  } catch (error) {
    console.error('Enterprise contact API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

/**
 * Determine priority based on usage data and trigger
 */
function determinePriority(usageData, trigger) {
  if (trigger === 'usage' && usageData?.percentage >= 95) {
    return 'high' // Critical usage level
  }
  if (trigger === 'feature' || trigger === 'support') {
    return 'medium' // Feature or support needs
  }
  return 'normal' // General inquiry
}

/**
 * Notify sales team about new enterprise request
 */
async function notifySalesTeam(requestRecord) {
  try {
    // Store notification for internal dashboard
    await supabase
      .from('internal_notifications')
      .insert({
        type: 'enterprise_request',
        priority: requestRecord.priority,
        title: `Neue Enterprise-Anfrage: ${requestRecord.workshop_details.name}`,
        message: `${requestRecord.workshop_details.name} hat eine ${requestRecord.target_package} Anfrage gestellt. Trigger: ${requestRecord.trigger}`,
        data: {
          request_id: requestRecord.id,
          workshop_id: requestRecord.workshop_id,
          workshop_name: requestRecord.workshop_details.name,
          contact_email: requestRecord.workshop_details.email,
          target_package: requestRecord.target_package,
          usage_data: requestRecord.usage_data
        },
        created_at: new Date().toISOString()
      })

    console.log(`Enterprise request notification sent for workshop: ${requestRecord.workshop_details.name}`)
  } catch (error) {
    console.error('Error notifying sales team:', error)
  }
}

/**
 * Send confirmation email to customer
 */
async function sendCustomerConfirmation(workshop, requestRecord) {
  try {
    // Store email task for email service to process
    await supabase
      .from('email_queue')
      .insert({
        to_email: workshop.email,
        to_name: workshop.owner_name || workshop.name,
        template: 'enterprise_contact_confirmation',
        subject: 'Ihre Enterprise-Anfrage wurde eingereicht - CarBot',
        template_data: {
          workshop_name: workshop.name,
          owner_name: workshop.owner_name,
          request_id: requestRecord.id,
          target_package: requestRecord.target_package,
          estimated_response_time: '24 Stunden',
          contact_email: 'enterprise@carbot.chat',
          contact_phone: '+49 (0) 30 12345678'
        },
        priority: 'high',
        send_after: new Date().toISOString()
      })

    console.log(`Confirmation email queued for: ${workshop.email}`)
  } catch (error) {
    console.error('Error sending customer confirmation:', error)
  }
}

/**
 * GET /api/packages/contact - Get contact request status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const workshop_id = searchParams.get('workshop_id')
    const request_id = searchParams.get('request_id')

    if (!workshop_id) {
      return NextResponse.json({
        error: 'Workshop ID required'
      }, { status: 400 })
    }

    let query = supabase
      .from('enterprise_contact_requests')
      .select('*')
      .eq('workshop_id', workshop_id)
      .order('created_at', { ascending: false })

    if (request_id) {
      query = query.eq('id', request_id).single()
    }

    const { data: requests, error } = await query

    if (error) {
      console.error('Error fetching contact requests:', error)
      return NextResponse.json({
        error: 'Failed to fetch contact requests'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      requests: request_id ? [requests] : requests
    })

  } catch (error) {
    console.error('Get contact requests error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}