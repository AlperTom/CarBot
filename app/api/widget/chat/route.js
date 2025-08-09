/**
 * Widget Chat API - Secure Chat Processing for Embedded Widgets
 * CarBot MVP - Handles chat conversations from embedded widgets
 * Implements rate limiting, domain validation, and AI response generation
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// Validate client key function will be implemented locally
import { recordUsage } from '../../../../lib/packageFeatures.js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/widget/chat - Process chat messages from embedded widgets
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { message, clientKey, sessionId, context } = body

    // Validate required fields
    if (!message || !clientKey || !sessionId) {
      return NextResponse.json({
        error: 'Missing required fields: message, clientKey, sessionId'
      }, { status: 400 })
    }

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(clientKey, request.headers.get('x-forwarded-for'))
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        retry_after: rateLimitResult.retryAfter
      }, { status: 429 })
    }

    // Validate client key and get workshop info
    const validation = await validateClientKey(clientKey)
    if (!validation.valid) {
      console.warn(`Chat blocked for invalid key: ${clientKey}`)
      return NextResponse.json({
        error: 'Invalid client key',
        code: 'INVALID_CLIENT_KEY'
      }, { status: 403 })
    }

    // Additional domain validation if provided in context
    if (context?.domain) {
      const isDomainAuthorized = await validateDomainAuthorization(
        validation.workshop.id, 
        context.domain
      )
      
      if (!isDomainAuthorized) {
        return NextResponse.json({
          error: 'Domain not authorized',
          code: 'DOMAIN_NOT_AUTHORIZED'
        }, { status: 403 })
      }
    }

    // Check usage limits
    const usageCheck = await checkUsageLimits(validation.workshop.id, 'conversation')
    if (!usageCheck.allowed) {
      return NextResponse.json({
        error: 'Usage limit exceeded',
        upgrade_required: true,
        current_package: usageCheck.package
      }, { status: 402 })
    }

    // Get or create chat session
    const chatSession = await getOrCreateChatSession(
      validation.workshop.id,
      clientKey,
      sessionId,
      context
    )

    // Get workshop context for AI
    const workshopContext = await getWorkshopContext(validation.workshop.id)

    // Process message with AI
    const aiResponse = await processMessageWithAI(
      message,
      chatSession,
      workshopContext,
      validation.workshop
    )

    // Store conversation in database
    await storeChatMessage(chatSession.id, message, 'user', context)
    await storeChatMessage(chatSession.id, aiResponse.response, 'assistant', {
      model: aiResponse.model,
      tokens_used: aiResponse.tokensUsed,
      processing_time: aiResponse.processingTime,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence
    })

    // Update session metrics
    await updateSessionMetrics(chatSession.id, {
      message_count: chatSession.message_count + 2, // user + assistant
      last_activity: new Date().toISOString()
    })

    // Record usage for billing
    await recordUsage(validation.workshop.id, 'conversations', 1)
    await recordUsage(validation.workshop.id, 'api_calls', 1)

    // Track analytics
    await trackChatAnalytics(validation.workshop.id, {
      event_type: 'chat_message',
      session_id: sessionId,
      client_key: clientKey,
      domain: context?.domain,
      message_length: message.length,
      response_time: aiResponse.processingTime,
      intent_detected: aiResponse.intent
    })

    // Return AI response
    return NextResponse.json({
      response: aiResponse.response,
      session_id: sessionId,
      conversation_id: chatSession.id,
      suggestions: aiResponse.suggestions || [],
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      typing_delay: Math.min(aiResponse.response.length * 30, 2000) // Realistic typing simulation
    })

  } catch (error) {
    console.error('Widget chat error:', error)
    
    // Log error for monitoring
    await logError('widget_chat_error', error, {
      clientKey: body?.clientKey?.substring(0, 12) + '...',
      sessionId: body?.sessionId,
      message_preview: body?.message?.substring(0, 50) + '...'
    })

    return NextResponse.json({
      error: 'Chat service temporarily unavailable',
      fallback_response: 'Entschuldigung, ich bin momentan nicht verfügbar. Bitte versuchen Sie es in einem Moment erneut oder kontaktieren Sie uns direkt.'
    }, { status: 500 })
  }
}

/**
 * OPTIONS /api/widget/chat - Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}

/**
 * Rate limiting implementation
 */
async function checkRateLimit(clientKey, ipAddress) {
  try {
    const windowStart = new Date(Date.now() - 60000) // 1 minute window
    
    // Get current rate limit settings for client key
    const { data: rateLimit } = await supabase
      .from('client_key_rate_limits')
      .select('requests_per_minute, is_blocked, blocked_until')
      .eq('client_key_id', clientKey)
      .single()

    const limit = rateLimit?.requests_per_minute || 100

    if (rateLimit?.is_blocked && new Date(rateLimit.blocked_until) > new Date()) {
      return {
        allowed: false,
        retryAfter: Math.ceil((new Date(rateLimit.blocked_until) - new Date()) / 1000)
      }
    }

    // Count recent requests
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', windowStart.toISOString())
      .eq('client_key', clientKey)

    if (count >= limit) {
      // Block for 5 minutes
      const blockUntil = new Date(Date.now() + 300000)
      
      await supabase
        .from('client_key_rate_limits')
        .upsert({
          client_key_id: clientKey,
          is_blocked: true,
          blocked_until: blockUntil.toISOString(),
          block_reason: 'Rate limit exceeded'
        })

      return {
        allowed: false,
        retryAfter: 300
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return { allowed: true } // Fail open for availability
  }
}

/**
 * Validate domain authorization for workshop
 */
async function validateDomainAuthorization(workshopId, domain) {
  try {
    const { data: clientKeys } = await supabase
      .from('client_keys')
      .select('authorized_domains')
      .eq('workshop_id', workshopId)
      .eq('is_active', true)

    // If any client key allows this domain, authorize
    for (const key of clientKeys || []) {
      if (!key.authorized_domains || key.authorized_domains.length === 0) {
        continue // Skip keys without domain restrictions
      }
      
      const isAuthorized = key.authorized_domains.some(authorizedDomain =>
        domain === authorizedDomain || domain.endsWith('.' + authorizedDomain)
      )
      
      if (isAuthorized) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error('Domain authorization check failed:', error)
    return true // Fail open
  }
}

/**
 * Check workshop usage limits
 */
async function checkUsageLimits(workshopId, metric) {
  try {
    const { data: workshop } = await supabase
      .from('workshops')
      .select(`
        monthly_leads_limit,
        current_period_start,
        current_period_end,
        subscriptions!inner(plan_id, status)
      `)
      .eq('id', workshopId)
      .single()

    if (!workshop || !workshop.subscriptions?.[0]) {
      return { allowed: false, package: 'unknown' }
    }

    const subscription = workshop.subscriptions[0]
    if (subscription.status !== 'active') {
      return { allowed: false, package: subscription.plan_id }
    }

    // Enterprise has unlimited usage
    if (subscription.plan_id === 'enterprise') {
      return { allowed: true, unlimited: true, package: 'enterprise' }
    }

    // Check current period usage
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('quantity')
      .eq('workshop_id', workshopId)
      .eq('metric_name', 'conversations')
      .gte('usage_date', workshop.current_period_start)
      .lte('usage_date', workshop.current_period_end)

    const totalUsage = usage?.reduce((sum, u) => sum + u.quantity, 0) || 0
    const limit = workshop.monthly_leads_limit || (subscription.plan_id === 'professional' ? -1 : 100)

    if (limit !== -1 && totalUsage >= limit) {
      return {
        allowed: false,
        package: subscription.plan_id,
        usage: totalUsage,
        limit
      }
    }

    return { allowed: true, package: subscription.plan_id }
  } catch (error) {
    console.error('Usage limit check failed:', error)
    return { allowed: true } // Fail open
  }
}

/**
 * Get or create chat session
 */
async function getOrCreateChatSession(workshopId, clientKey, sessionId, context) {
  try {
    // Try to get existing session
    let { data: session } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_token', sessionId)
      .eq('workshop_id', workshopId)
      .single()

    if (!session) {
      // Create new session
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({
          workshop_id: workshopId,
          session_token: sessionId,
          client_key: clientKey,
          visitor_id: context?.visitor_id,
          ip_address: context?.ip_address,
          user_agent: context?.userAgent,
          browser_language: context?.language || 'de',
          landing_page_url: context?.page_url,
          referrer_url: context?.referrer,
          country_code: context?.country || 'DE',
          started_at: new Date().toISOString()
        })
        .select('*')
        .single()

      session = newSession
    }

    return session
  } catch (error) {
    console.error('Failed to get/create chat session:', error)
    throw error
  }
}

/**
 * Get workshop context for AI responses
 */
async function getWorkshopContext(workshopId) {
  try {
    const { data: context } = await supabase
      .from('workshops')
      .select(`
        name,
        description,
        services,
        opening_hours,
        address_line1,
        city,
        phone,
        email,
        website
      `)
      .eq('id', workshopId)
      .single()

    return context
  } catch (error) {
    console.error('Failed to get workshop context:', error)
    return null
  }
}

/**
 * Process message with OpenAI
 */
async function processMessageWithAI(message, session, workshopContext, workshop) {
  const startTime = Date.now()
  
  try {
    // Build advanced automotive context with German expertise
    const systemPrompt = buildAdvancedAutomotivePrompt(workshopContext)
    
    // Get recent conversation history
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('content, role')
      .eq('session_id', session.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Build conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(recentMessages?.reverse().map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) || []),
      { role: 'user', content: message }
    ]

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    const response = completion.choices[0]?.message?.content || 'Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten.'
    const tokensUsed = completion.usage?.total_tokens || 0
    const processingTime = Date.now() - startTime

    // Analyze intent and confidence
    const analysis = analyzeMessage(message, response)

    return {
      response,
      model: 'gpt-4-turbo-preview',
      tokensUsed,
      processingTime,
      intent: analysis.intent,
      confidence: analysis.confidence,
      suggestions: analysis.suggestions
    }

  } catch (error) {
    console.error('AI processing failed:', error)
    
    // Fallback response
    return {
      response: getFallbackResponse(message),
      model: 'fallback',
      tokensUsed: 0,
      processingTime: Date.now() - startTime,
      intent: 'fallback',
      confidence: 0.5,
      suggestions: []
    }
  }
}

/**
 * Build advanced automotive system prompt with German expertise
 */
function buildAdvancedAutomotivePrompt(workshopContext) {
  const workshop = workshopContext || {}
  
  return `Du bist CARBOT, der führende KI-Experte für deutsche Autowerkstätten und Fahrzeugtechnik. 

🚗 WORKSHOP-PROFIL:
${workshop.name ? `Werkstatt: ${workshop.name}` : 'Premium Autowerkstatt'}
${workshop.description ? `Spezialisierung: ${workshop.description}` : ''}
${workshop.services ? `Services: ${workshop.services.join(', ')}` : 'Vollservice Werkstatt'}
${workshop.opening_hours ? `Öffnungszeiten: ${JSON.stringify(workshop.opening_hours)}` : ''}
${workshop.address_line1 && workshop.city ? `Standort: ${workshop.address_line1}, ${workshop.city}` : ''}
${workshop.phone ? `Direkte Hotline: ${workshop.phone}` : ''}

🏆 AUTOMOTIVE EXPERTISE:
- DEUTSCHE PREMIUMMARKEN: BMW, Mercedes-Benz, Audi, Volkswagen, Porsche
- FAHRZEUGSYSTEME: Motor, Getriebe, Elektronik, Bremsen, Fahrwerk
- MODERNE TECHNIK: Hybrid, Elektro, Assistenzsysteme, Diagnose
- WARTUNGSZYKLEN: Herstellerspezifische Intervalle & Empfehlungen

🎯 KOMMUNIKATIONSSTIL:
- Höflich und fachkompetent auf Deutsch
- Klare, verständliche Erklärungen ohne Fachchinesisch
- Direkte Handlungsempfehlungen
- Transparente Kosteneinschätzungen
- Dringlichkeit bei Sicherheitsproblemen hervorheben

⚡ PRIORITÄTEN:
1. SICHERHEIT GEHT VOR: Bei sicherheitskritischen Problemen sofortige Werkstatt-Empfehlung
2. KOSTENKLARHEIT: Realistische Preisangaben basierend auf deutschen Stundensätzen (80-150€)
3. TERMINEFFIZIENZ: Schnelle Terminvorschläge für dringende Reparaturen
4. PRÄVENTIVE WARTUNG: Proaktive Hinweise zu anstehenden Services
5. VERTRAUEN AUFBAUEN: Ehrliche Beratung, auch wenn günstigere Lösungen möglich sind

🔧 DEUTSCHE AUTOMOTIVE STANDARDS:
- TÜV/HU Zyklen (PKW: 2 Jahre, Neuwagen: 3 Jahre)
- Abgasuntersuchung (AU) alle 24 Monate
- Wartungsintervalle nach Herstellervorgaben
- Gewährleistungsrecht nach deutschem Recht
- Umweltplaketten und Euro-Normen

⚠️ NOTFALL-KEYWORDS (sofortige Priorität):
"Notfall", "Panne", "Unfall", "Qualm", "seltsame Geräusche", "Bremsen", "Lenkung"
→ Bei Notfällen: Sofort Werkstatt kontaktieren oder Pannenhilfe rufen!

💡 LEAD-GENERIERUNG:
Bei Interesse an Services, Reparaturen oder Terminen → Lead-Formular vorschlagen
Immer: Name, Telefon, Fahrzeug, konkretes Anliegen erfragen

Sei der Experte, dem deutsche Autofahrer vertrauen! 🇩🇪🚗`
}

/**
 * Analyze message intent and generate suggestions
 */
function analyzeMessage(userMessage, aiResponse) {
  const message = userMessage.toLowerCase()
  
  // Intent detection based on keywords
  let intent = 'general_inquiry'
  let confidence = 0.6
  
  if (message.includes('termin') || message.includes('buchen') || message.includes('vereinbaren')) {
    intent = 'appointment_booking'
    confidence = 0.9
  } else if (message.includes('kosten') || message.includes('preis') || message.includes('teuer')) {
    intent = 'pricing_inquiry'
    confidence = 0.8
  } else if (message.includes('reparatur') || message.includes('defekt') || message.includes('kaputt')) {
    intent = 'repair_request'
    confidence = 0.85
  } else if (message.includes('öffnungszeit') || message.includes('geöffnet') || message.includes('wann')) {
    intent = 'hours_inquiry'
    confidence = 0.9
  } else if (message.includes('kontakt') || message.includes('telefon') || message.includes('adresse')) {
    intent = 'contact_inquiry'
    confidence = 0.9
  }

  // Generate contextual suggestions
  const suggestions = []
  if (intent === 'general_inquiry') {
    suggestions.push('Welche Services bieten Sie an?', 'Wie kann ich einen Termin buchen?', 'Was kostet eine Inspektion?')
  } else if (intent === 'appointment_booking') {
    suggestions.push('Ich möchte einen Termin für nächste Woche', 'Haben Sie heute noch Zeit?', 'Notfall - sofort Hilfe benötigt')
  }

  return { intent, confidence, suggestions }
}

/**
 * Get fallback response for AI failures
 */
function getFallbackResponse(message) {
  const fallbacks = [
    'Entschuldigung, ich bin gerade nicht verfügbar. Können Sie Ihre Frage bitte wiederholen?',
    'Es tut mir leid, ich hatte ein technisches Problem. Bitte kontaktieren Sie uns direkt für schnelle Hilfe.',
    'Momentan kann ich Ihnen nicht optimal helfen. Rufen Sie uns gerne an oder kommen Sie vorbei!',
    'Ich bin gerade überfordert. Für eine schnelle Antwort empfehle ich Ihnen unseren direkten Kontakt.'
  ]
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

/**
 * Store chat message in database
 */
async function storeChatMessage(sessionId, content, role, metadata = {}) {
  try {
    await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content,
        message_type: role,
        metadata,
        processed_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to store chat message:', error)
  }
}

/**
 * Update session metrics
 */
async function updateSessionMetrics(sessionId, metrics) {
  try {
    await supabase
      .from('chat_sessions')
      .update(metrics)
      .eq('id', sessionId)
  } catch (error) {
    console.error('Failed to update session metrics:', error)
  }
}

/**
 * Track chat analytics
 */
async function trackChatAnalytics(workshopId, data) {
  try {
    await supabase
      .from('analytics_events')
      .insert({
        workshop_id: workshopId,
        event_type: data.event_type,
        event_category: 'chat',
        event_data: data,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to track chat analytics:', error)
  }
}

/**
 * Log error for monitoring
 */
async function logError(errorType, error, context = {}) {
  try {
    await supabase
      .from('error_logs')
      .insert({
        error_type: errorType,
        error_message: error.message,
        error_stack: error.stack,
        context,
        created_at: new Date().toISOString()
      })
  } catch (e) {
    console.error('Failed to log error:', e)
  }
}