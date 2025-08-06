import { NextResponse } from 'next/server'
import { 
  QueryOptimizer, 
  RequestOptimizer, 
  PerformanceMonitor,
  ResponseCache,
  optimizedSupabase as supabase 
} from '../../../lib/apiOptimizations'

export async function GET(request) {
  const requestId = `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  PerformanceMonitor.startTimer(requestId)
  
  try {
    const { searchParams } = new URL(request.url)
    const rawParams = Object.fromEntries(searchParams.entries())
    const params = RequestOptimizer.sanitizeParams(rawParams)
    
    const customerSlug = params.customer
    const timeRange = params.range || '7d'
    const metric = params.metric || 'overview'

    if (!customerSlug) {
      return NextResponse.json({ error: 'Customer slug required' }, { status: 400 })
    }

    // Check rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = RequestOptimizer.checkRateLimit(clientIP, 200, 60000) // 200 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retry_after: rateLimit.resetTime },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    // Check cache first
    const cacheKey = ResponseCache.generateKey('GET', '/api/analytics', params)
    const cached = ResponseCache.getCached(cacheKey)
    if (cached) {
      const duration = PerformanceMonitor.endTimer(requestId, { cached: true })
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'X-Response-Time': `${duration}ms`
        }
      })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }

    let analyticsData = {}

    switch (metric) {
      case 'overview':
        analyticsData = await getOverviewAnalytics(customerSlug, startDate, endDate)
        break
      case 'leads':
        analyticsData = await getLeadAnalytics(customerSlug, startDate, endDate)
        break
      case 'chats':
        analyticsData = await getChatAnalytics(customerSlug, startDate, endDate)
        break
      case 'appointments':
        analyticsData = await getAppointmentAnalytics(customerSlug, startDate, endDate)
        break
      case 'performance':
        analyticsData = await getPerformanceAnalytics(customerSlug, startDate, endDate)
        break
      default:
        analyticsData = await getOverviewAnalytics(customerSlug, startDate, endDate)
    }

    // Track analytics API usage
    await supabase.from('analytics_events').insert({
      event_type: 'analytics_viewed',
      client_key: customerSlug,
      event_data: {
        metric: metric,
        time_range: timeRange,
        timestamp: new Date().toISOString()
      }
    })

    // Cache the response
    const cachedResponse = ResponseCache.cacheResponse(cacheKey, analyticsData, 300) // 5 minutes cache
    
    // Compress large responses
    const optimizedResponse = RequestOptimizer.compressResponse(cachedResponse)
    
    const duration = PerformanceMonitor.endTimer(requestId, { 
      cached: false,
      metric,
      timeRange,
      dataSize: JSON.stringify(analyticsData).length
    })
    
    return NextResponse.json(optimizedResponse, {
      headers: {
        'X-Cache': 'MISS',
        'X-Response-Time': `${duration}ms`,
        'X-RateLimit-Remaining': rateLimit.remaining.toString()
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    )
  }
}

async function getOverviewAnalytics(customerSlug, startDate, endDate) {
  const [chatStats, leadStats, appointmentStats, performanceStats] = await Promise.all([
    getChatStats(customerSlug, startDate, endDate),
    getLeadStats(customerSlug, startDate, endDate),
    getAppointmentStats(customerSlug, startDate, endDate),
    getPerformanceStats(customerSlug, startDate, endDate)
  ])

  return {
    summary: {
      totalChats: chatStats.totalMessages,
      totalLeads: leadStats.totalLeads,
      totalAppointments: appointmentStats.totalAppointments,
      conversionRate: chatStats.totalMessages > 0 ? 
        ((leadStats.totalLeads / chatStats.totalMessages) * 100).toFixed(1) : 0,
      appointmentRate: leadStats.totalLeads > 0 ? 
        ((appointmentStats.totalAppointments / leadStats.totalLeads) * 100).toFixed(1) : 0,
      avgResponseTime: performanceStats.avgResponseTime,
      activeUsers: chatStats.uniqueUsers
    },
    trends: {
      chatsByDay: chatStats.dailyTrend,
      leadsByDay: leadStats.dailyTrend,
      appointmentsByDay: appointmentStats.dailyTrend
    },
    distribution: {
      chatsByHour: chatStats.hourlyDistribution,
      topQuestions: chatStats.topQuestions,
      leadSources: leadStats.sources,
      services: leadStats.serviceDistribution
    }
  }
}

async function getChatStats(customerSlug, startDate, endDate) {
  // Get chat messages
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('created_at, message_type, message')
    .eq('client_key', customerSlug)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at')

  const userMessages = messages?.filter(m => m.message_type === 'user') || []
  const assistantMessages = messages?.filter(m => m.message_type === 'assistant') || []

  // Calculate daily trend
  const dailyTrend = aggregateByDay(userMessages, 'created_at')
  
  // Calculate hourly distribution
  const hourlyDistribution = aggregateByHour(userMessages, 'created_at')

  // Analyze popular questions
  const topQuestions = analyzeQuestions(userMessages.map(m => m.message))

  // Calculate unique users (simplified - in production use proper session tracking)
  const uniqueUsers = new Set(userMessages.map(m => 
    m.created_at.split('T')[0] // Group by day as proxy for unique users
  )).size

  return {
    totalMessages: userMessages.length,
    uniqueUsers,
    dailyTrend,
    hourlyDistribution,
    topQuestions
  }
}

async function getLeadStats(customerSlug, startDate, endDate) {
  const { data: leads } = await supabase
    .from('leads')
    .select('created_at, source_url, anliegen, fahrzeug')
    .eq('kunde_id', customerSlug)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at')

  const dailyTrend = aggregateByDay(leads || [], 'created_at')
  const sources = aggregateLeadSources(leads || [])
  const serviceDistribution = aggregateServices(leads || [])

  return {
    totalLeads: leads?.length || 0,
    dailyTrend,
    sources,
    serviceDistribution
  }
}

async function getAppointmentStats(customerSlug, startDate, endDate) {
  const { data: appointments } = await supabase
    .from('appointments')
    .select('created_at, status, service_requested, start_time')
    .eq('customer_slug', customerSlug)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at')

  const dailyTrend = aggregateByDay(appointments || [], 'created_at')
  const statusDistribution = aggregateByStatus(appointments || [])
  const serviceDistribution = aggregateAppointmentServices(appointments || [])

  return {
    totalAppointments: appointments?.length || 0,
    confirmed: appointments?.filter(a => a.status === 'confirmed').length || 0,
    dailyTrend,
    statusDistribution,
    serviceDistribution
  }
}

async function getPerformanceStats(customerSlug, startDate, endDate) {
  // Get response times from AI usage logs
  const { data: aiLogs } = await supabase
    .from('ai_usage_logs')
    .select('response_time_ms, tokens_used, created_at')
    .eq('client_key', customerSlug)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  const avgResponseTime = aiLogs?.length > 0 ? 
    Math.round(aiLogs.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / aiLogs.length) : 0

  const totalTokens = aiLogs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0

  return {
    avgResponseTime,
    totalTokens,
    totalRequests: aiLogs?.length || 0,
    costEstimate: calculateCostEstimate(totalTokens)
  }
}

// Helper functions
function aggregateByDay(data, dateField) {
  const days = {}
  data.forEach(item => {
    const day = new Date(item[dateField]).toISOString().split('T')[0]
    days[day] = (days[day] || 0) + 1
  })
  
  return Object.entries(days)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

function aggregateByHour(data, dateField) {
  const hours = Array(24).fill(0)
  data.forEach(item => {
    const hour = new Date(item[dateField]).getHours()
    hours[hour]++
  })
  return hours.map((count, hour) => ({ hour, count }))
}

function analyzeQuestions(messages) {
  const keywords = {}
  const stopWords = new Set(['der', 'die', 'das', 'und', 'oder', 'ist', 'ich', 'für', 'mit', 'auf', 'ein', 'eine', 'kann', 'wie', 'was', 'wo', 'wann', 'warum'])
  
  messages.forEach(message => {
    const words = message?.toLowerCase()
      .replace(/[^\w\säöüß]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
    
    words.forEach(word => {
      keywords[word] = (keywords[word] || 0) + 1
    })
  })

  return Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .map(([keyword, count]) => ({ keyword, count }))
}

function aggregateLeadSources(leads) {
  const sources = {}
  leads.forEach(lead => {
    const source = extractDomain(lead.source_url) || 'Direct'
    sources[source] = (sources[source] || 0) + 1
  })
  
  return Object.entries(sources)
    .sort(([,a], [,b]) => b - a)
    .map(([source, count]) => ({ source, count }))
}

function aggregateServices(leads) {
  const services = {}
  leads.forEach(lead => {
    const service = categorizeService(lead.anliegen)
    services[service] = (services[service] || 0) + 1
  })
  
  return Object.entries(services)
    .sort(([,a], [,b]) => b - a)
    .map(([service, count]) => ({ service, count }))
}

function aggregateAppointmentServices(appointments) {
  const services = {}
  appointments.forEach(apt => {
    const service = apt.service_requested || 'Unspecified'
    services[service] = (services[service] || 0) + 1
  })
  
  return Object.entries(services)
    .sort(([,a], [,b]) => b - a)
    .map(([service, count]) => ({ service, count }))
}

function aggregateByStatus(appointments) {
  const statuses = {}
  appointments.forEach(apt => {
    statuses[apt.status] = (statuses[apt.status] || 0) + 1
  })
  
  return Object.entries(statuses).map(([status, count]) => ({ status, count }))
}

function extractDomain(url) {
  if (!url) return 'Direct'
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return 'Direct'
  }
}

function categorizeService(anliegen) {
  const request = anliegen?.toLowerCase() || ''
  
  if (request.includes('tüv') || request.includes('hauptuntersuchung') || request.includes('hu')) return 'TÜV/HU'
  if (request.includes('reparatur') || request.includes('defekt') || request.includes('kaputt')) return 'Reparatur'
  if (request.includes('wartung') || request.includes('service') || request.includes('inspektion')) return 'Wartung'
  if (request.includes('bremse') || request.includes('brake')) return 'Bremsen'
  if (request.includes('reifen') || request.includes('tire')) return 'Reifen'
  if (request.includes('motor') || request.includes('engine')) return 'Motor'
  if (request.includes('getriebe') || request.includes('transmission')) return 'Getriebe'
  if (request.includes('auspuff') || request.includes('exhaust')) return 'Auspuff'
  if (request.includes('klimaanlage') || request.includes('klima') || request.includes('air conditioning')) return 'Klimaanlage'
  if (request.includes('batterie') || request.includes('battery')) return 'Batterie'
  
  return 'Sonstiges'
}

function calculateCostEstimate(totalTokens) {
  // Rough cost estimation based on OpenAI pricing
  const costPerToken = 0.00002 // ~$0.02 per 1K tokens for GPT-3.5-turbo
  return (totalTokens * costPerToken).toFixed(4)
}

// Real-time analytics endpoint
export async function POST(request) {
  try {
    const body = await request.json()
    const { event, data, customerSlug } = body

    // Store analytics event
    await supabase.from('analytics_events').insert({
      event_type: event,
      client_key: customerSlug,
      event_data: data,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics event tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics event' },
      { status: 500 }
    )
  }
}