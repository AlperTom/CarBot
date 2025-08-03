import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { leadScorer } from '../../../../lib/leadScoring.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { leadId, leadData, action = 'score' } = body

    switch (action) {
      case 'score':
        return await scoreSingleLead(leadData, leadId)
      case 'batch':
        return await scoreBatchLeads(body.leads || [])
      case 'rescore':
        return await rescoreExistingLeads(body.customerSlug)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Lead scoring API error:', error)
    return NextResponse.json(
      { error: 'Failed to score lead', details: error.message },
      { status: 500 }
    )
  }
}

async function scoreSingleLead(leadData, leadId) {
  // Get lead from database if only ID provided
  if (leadId && !leadData) {
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    leadData = lead
  }

  // Get chat history for this lead
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('client_key', leadData.kunde_id)
    .order('created_at')

  // Get customer context for better scoring
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('slug', leadData.kunde_id)
    .single()

  // Calculate lead score
  const leadScore = await leadScorer.scoreLead(
    leadData, 
    messages || [], 
    customer || {}
  )

  // Update lead with score if it exists in database
  if (leadData.id) {
    await supabase
      .from('leads')
      .update({ 
        lead_score: leadScore.total,
        score_classification: leadScore.classification,
        priority: leadScore.priority,
        estimated_value: leadScore.estimatedValue,
        last_scored_at: new Date().toISOString()
      })
      .eq('id', leadData.id)
  }

  return NextResponse.json({
    success: true,
    leadId: leadData.id,
    score: leadScore
  })
}

async function scoreBatchLeads(leads) {
  const results = []
  const batchSize = 10
  
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize)
    
    const batchPromises = batch.map(async (lead) => {
      try {
        // Get chat history
        const { data: messages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('client_key', lead.kunde_id)
          .order('created_at')

        // Get customer context
        const { data: customer } = await supabase
          .from('customers')
          .select('*')
          .eq('slug', lead.kunde_id)
          .single()

        const score = await leadScorer.scoreLead(lead, messages || [], customer || {})
        
        // Update database
        if (lead.id) {
          await supabase
            .from('leads')
            .update({
              lead_score: score.total,
              score_classification: score.classification,
              priority: score.priority,
              estimated_value: score.estimatedValue,
              last_scored_at: new Date().toISOString()
            })
            .eq('id', lead.id)
        }

        return { leadId: lead.id, score, success: true }
      } catch (error) {
        return { leadId: lead.id, error: error.message, success: false }
      }
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Small delay between batches
    if (i + batchSize < leads.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  return NextResponse.json({
    success: true,
    processed: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  })
}

async function rescoreExistingLeads(customerSlug) {
  // Get all leads for customer from last 90 days
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 90)

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('kunde_id', customerSlug)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })

  if (!leads || leads.length === 0) {
    return NextResponse.json({
      success: true,
      message: 'No leads found to rescore'
    })
  }

  // Process in batches
  return await scoreBatchLeads(leads)
}

// GET endpoint for retrieving lead scores
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')
    const customerSlug = searchParams.get('customer')
    const classification = searchParams.get('classification')
    const priority = searchParams.get('priority')
    const limit = parseInt(searchParams.get('limit')) || 50

    let query = supabase
      .from('leads')
      .select(`
        *,
        lead_scores (
          total_score,
          score_breakdown,
          classification,
          priority,
          estimated_value,
          recommendations,
          created_at
        )
      `)

    if (leadId) {
      query = query.eq('id', leadId)
    }

    if (customerSlug) {
      query = query.eq('kunde_id', customerSlug)
    }

    if (classification) {
      query = query.eq('score_classification', classification)
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    query = query
      .order('lead_score', { ascending: false })
      .limit(limit)

    const { data: leads } = await query

    // Get summary statistics
    const { data: stats } = await supabase
      .from('leads')
      .select('lead_score, score_classification, priority, estimated_value')
      .eq('kunde_id', customerSlug)

    const summary = {
      total: stats?.length || 0,
      classifications: {
        hot: stats?.filter(s => s.score_classification === 'Hot').length || 0,
        warm: stats?.filter(s => s.score_classification === 'Warm').length || 0,
        cold: stats?.filter(s => s.score_classification === 'Cold').length || 0
      },
      priorities: {
        high: stats?.filter(s => s.priority === 'High').length || 0,
        medium: stats?.filter(s => s.priority === 'Medium').length || 0,
        low: stats?.filter(s => s.priority === 'Low').length || 0
      },
      averageScore: stats?.length > 0 ? 
        Math.round(stats.reduce((sum, s) => sum + (s.lead_score || 0), 0) / stats.length) : 0,
      totalEstimatedValue: stats?.reduce((sum, s) => sum + (s.estimated_value || 0), 0) || 0
    }

    return NextResponse.json({
      success: true,
      leads: leads || [],
      summary
    })

  } catch (error) {
    console.error('Lead scores GET error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve lead scores' },
      { status: 500 }
    )
  }
}

// PUT endpoint for updating lead scores manually
export async function PUT(request) {
  try {
    const body = await request.json()
    const { leadId, manualScore, notes, priority } = body

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }

    const updates = {}
    if (manualScore !== undefined) updates.lead_score = manualScore
    if (priority !== undefined) updates.priority = priority
    if (notes !== undefined) updates.scoring_notes = notes
    updates.manually_scored_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      lead: data[0]
    })

  } catch (error) {
    console.error('Lead score update error:', error)
    return NextResponse.json(
      { error: 'Failed to update lead score' },
      { status: 500 }
    )
  }
}