/**
 * Analytics Collection API - Track widget interactions and KPIs
 * Collects data for dashboard analytics and reporting
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../../../../lib/jwt-auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      eventType, 
      clientKey, 
      sessionId, 
      data = {},
      timestamp = new Date().toISOString()
    } = body

    // Validate required fields
    if (!eventType || !clientKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: eventType and clientKey'
      }, { status: 400 })
    }

    // Get client key information to identify workshop
    const { data: clientKeyData, error: keyError } = await supabase
      .from('client_keys')
      .select(`
        id,
        workshop_id,
        workshops (
          id,
          business_name
        )
      `)
      .eq('client_key_hash', clientKey)
      .eq('is_active', true)
      .single()

    if (keyError || !clientKeyData) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or inactive client key'
      }, { status: 401 })
    }

    const workshopId = clientKeyData.workshop_id
    const clientKeyId = clientKeyData.id

    // Process different event types
    switch (eventType) {
      case 'widget_load':
        await handleWidgetLoad(workshopId, clientKeyId, sessionId, data)
        break
        
      case 'chat_initiation':
        await handleChatInitiation(workshopId, clientKeyId, sessionId, data)
        break
        
      case 'message_sent':
        await handleMessageSent(workshopId, clientKeyId, sessionId, data)
        break
        
      case 'conversation_end':
        await handleConversationEnd(workshopId, clientKeyId, sessionId, data)
        break
        
      case 'lead_qualification':
        await handleLeadQualification(workshopId, clientKeyId, sessionId, data)
        break
        
      default:
        // Generic event tracking
        await handleGenericEvent(workshopId, clientKeyId, sessionId, eventType, data)
    }

    // Update daily KPIs asynchronously
    updateDailyKPIs(workshopId, eventType, data).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Analytics event recorded successfully'
    })

  } catch (error) {
    console.error('Analytics collection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to record analytics event'
    }, { status: 500 })
  }
}

// Handle widget load events
async function handleWidgetLoad(workshopId, clientKeyId, sessionId, data) {
  const { sourceUrl, userAgent, ipAddress } = data

  // Update or create widget metrics for today
  const today = new Date().toISOString().split('T')[0]
  
  const { error } = await supabase
    .from('widget_metrics')
    .upsert({
      workshop_id: workshopId,
      client_key_id: clientKeyId,
      metric_date: today,
      page_views: 1,
      widget_loads: 1
    }, {
      onConflict: 'workshop_id,client_key_id,metric_date',
      count: 'none'
    })

  if (error) console.error('Widget load tracking error:', error)
}

// Handle chat initiation
async function handleChatInitiation(workshopId, clientKeyId, sessionId, data) {
  const { sourceUrl, userAgent, ipAddress, customerName, customerEmail } = data

  // Create contact analytics record
  const { error } = await supabase
    .from('contact_analytics')
    .insert({
      workshop_id: workshopId,
      client_key_id: clientKeyId,
      session_id: sessionId,
      source_url: sourceUrl,
      user_agent: userAgent,
      ip_address: ipAddress,
      customer_name: customerName,
      customer_email: customerEmail,
      conversion_status: 'inquiry'
    })

  if (error) console.error('Chat initiation tracking error:', error)

  // Update daily metrics
  const today = new Date().toISOString().split('T')[0]
  await supabase
    .from('widget_metrics')
    .upsert({
      workshop_id: workshopId,
      client_key_id: clientKeyId,
      metric_date: today,
      chat_initiations: 1
    }, {
      onConflict: 'workshop_id,client_key_id,metric_date',
      count: 'none'
    })
}

// Handle message sending
async function handleMessageSent(workshopId, clientKeyId, sessionId, data) {
  const { messageCount = 1, isAiResponse = false } = data

  // Update contact analytics
  if (sessionId) {
    const { error } = await supabase
      .from('contact_analytics')
      .update({
        message_count: messageCount,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)

    if (error) console.error('Message tracking error:', error)
  }

  // Update daily metrics
  const today = new Date().toISOString().split('T')[0]
  const updateData = isAiResponse ? 
    { ai_responses: 1 } : 
    { messages_sent: 1 }

  await supabase
    .from('widget_metrics')
    .upsert({
      workshop_id: workshopId,
      client_key_id: clientKeyId,
      metric_date: today,
      ...updateData
    }, {
      onConflict: 'workshop_id,client_key_id,metric_date',
      count: 'none'
    })
}

// Handle conversation end
async function handleConversationEnd(workshopId, clientKeyId, sessionId, data) {
  const { duration, leadQualityScore = 0, conversionStatus = 'inquiry' } = data

  if (sessionId) {
    const { error } = await supabase
      .from('contact_analytics')
      .update({
        conversation_duration: duration,
        lead_quality_score: leadQualityScore,
        conversion_status: conversionStatus,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)

    if (error) console.error('Conversation end tracking error:', error)
  }

  // Update average session duration
  const today = new Date().toISOString().split('T')[0]
  if (duration) {
    await supabase
      .from('widget_metrics')
      .upsert({
        workshop_id: workshopId,
        client_key_id: clientKeyId,
        metric_date: today,
        average_session_duration: duration
      }, {
        onConflict: 'workshop_id,client_key_id,metric_date',
        count: 'none'
      })
  }
}

// Handle lead qualification
async function handleLeadQualification(workshopId, clientKeyId, sessionId, data) {
  const { qualificationScore, customerInfo = {}, notes } = data

  if (sessionId) {
    // Update contact analytics
    await supabase
      .from('contact_analytics')
      .update({
        lead_quality_score: qualificationScore,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        conversion_status: qualificationScore >= 70 ? 'qualified' : 'inquiry',
        notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)

    // Create or update client profile
    if (customerInfo.email) {
      await supabase
        .from('client_profiles')
        .upsert({
          workshop_id: workshopId,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          vehicle_info: customerInfo.vehicle || {},
          last_contact: new Date().toISOString(),
          notes: notes
        }, {
          onConflict: 'workshop_id,customer_email',
          count: 'none'
        })
    }
  }
}

// Handle generic events
async function handleGenericEvent(workshopId, clientKeyId, sessionId, eventType, data) {
  // Store generic events for future analysis
  console.log(`Generic event: ${eventType}`, { workshopId, clientKeyId, sessionId, data })
}

// Update daily KPI aggregations
async function updateDailyKPIs(workshopId, eventType, data) {
  const today = new Date().toISOString().split('T')[0]

  try {
    // Get current daily KPIs
    let { data: dailyKPI, error } = await supabase
      .from('daily_kpis')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found is OK
      console.error('Daily KPI fetch error:', error)
      return
    }

    // Initialize if doesn't exist
    if (!dailyKPI) {
      dailyKPI = {
        workshop_id: workshopId,
        date: today,
        total_contacts: 0,
        new_contacts: 0,
        qualified_leads: 0,
        conversions: 0,
        total_messages: 0,
        unique_visitors: 0
      }
    }

    // Update based on event type
    switch (eventType) {
      case 'chat_initiation':
        dailyKPI.total_contacts += 1
        dailyKPI.new_contacts += 1
        break
      case 'message_sent':
        dailyKPI.total_messages += 1
        break
      case 'lead_qualification':
        if (data.qualificationScore >= 70) {
          dailyKPI.qualified_leads += 1
        }
        break
      case 'conversion':
        dailyKPI.conversions += 1
        break
    }

    // Upsert daily KPIs
    await supabase
      .from('daily_kpis')
      .upsert(dailyKPI, {
        onConflict: 'workshop_id,date',
        count: 'none'
      })

  } catch (error) {
    console.error('Daily KPI update error:', error)
  }
}

// GET endpoint for retrieving analytics data (protected)
export const GET = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const url = new URL(request.url)
    const dateFrom = url.searchParams.get('from') || '30 days ago'
    const dateTo = url.searchParams.get('to') || 'now'
    const metric = url.searchParams.get('metric') || 'overview'

    let query = supabase
      .from('daily_kpis')
      .select('*')
      .eq('workshop_id', workshop.id)
      .gte('date', new Date(dateFrom).toISOString().split('T')[0])
      .lte('date', new Date(dateTo).toISOString().split('T')[0])
      .order('date', { ascending: true })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch analytics data'
      }, { status: 500 })
    }

    // Calculate summary statistics
    const summary = data.reduce((acc, day) => ({
      totalContacts: acc.totalContacts + day.total_contacts,
      totalLeads: acc.totalLeads + day.qualified_leads,
      totalConversions: acc.totalConversions + day.conversions,
      totalMessages: acc.totalMessages + day.total_messages,
      avgConversionRate: 0 // calculated below
    }), { totalContacts: 0, totalLeads: 0, totalConversions: 0, totalMessages: 0 })

    summary.avgConversionRate = summary.totalContacts > 0 ? 
      (summary.totalConversions / summary.totalContacts * 100) : 0

    return NextResponse.json({
      success: true,
      data: {
        dailyData: data,
        summary: summary,
        dateRange: { from: dateFrom, to: dateTo }
      }
    })

  } catch (error) {
    console.error('Analytics retrieval error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve analytics'
    }, { status: 500 })
  }
})