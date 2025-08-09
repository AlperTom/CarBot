/**
 * Website Chat API - Simplified chat endpoint for CarBot website integration
 * Handles chat messages from website visitors with automotive expertise
 */

import { NextResponse } from 'next/server'
import { validateClientKey } from '../../../../lib/client-key-validation.js'

// Simple in-memory storage for development (replace with database in production)
const chatSessions = new Map()
const chatHistory = new Map()
const rateLimitMap = new Map()

// German automotive expertise database
const AUTOMOTIVE_KNOWLEDGE = {
  services: {
    'hu/au': { name: 'Hauptuntersuchung & Abgasuntersuchung', price: 'ab 89€', duration: '45-60 Min' },
    'inspektion': { name: 'Fahrzeuginspektion', price: 'ab 159€', duration: '2-4 Std' },
    'ölwechsel': { name: 'Ölservice', price: 'ab 49€', duration: '30-45 Min' },
    'reifen': { name: 'Reifenservice', price: 'ab 29€', duration: '30-45 Min' },
    'bremsen': { name: 'Bremsendienst', price: 'ab 89€', duration: '1-3 Std' },
    'motor': { name: 'Motorreparaturen', price: 'nach Aufwand', duration: '1-5 Tage' },
    'getriebe': { name: 'Getriebeservice', price: 'nach Aufwand', duration: '1-3 Tage' },
    'elektronik': { name: 'Fahrzeugelektronik', price: 'ab 59€', duration: '30-60 Min' }
  },
  
  brands: [
    'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Opel', 'Ford',
    'Skoda', 'Seat', 'Renault', 'Peugeot', 'Fiat', 'Toyota', 'Nissan'
  ],
  
  urgentKeywords: ['notfall', 'panne', 'liegengeblieben', 'unfall', 'qualm', 'rauch'],
  appointmentKeywords: ['termin', 'buchen', 'vereinbaren', 'reservation'],
  priceKeywords: ['kosten', 'preis', 'preise', 'kostenvoranschlag', 'angebot'],
  serviceKeywords: ['reparatur', 'wartung', 'service', 'inspektion', 'tüv', 'hu', 'au']
}

// Rate limiting check
function checkRateLimit(sessionId, limit = 20, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitMap.has(sessionId)) {
    rateLimitMap.set(sessionId, [])
  }
  
  const requests = rateLimitMap.get(sessionId)
  const recentRequests = requests.filter(time => time > windowStart)
  
  if (recentRequests.length >= limit) {
    return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) }
  }
  
  recentRequests.push(now)
  rateLimitMap.set(sessionId, recentRequests)
  return { allowed: true }
}

// Generate intelligent automotive responses
function generateIntelligentResponse(message, workshopConfig, sessionHistory = []) {
  const lowerMessage = message.toLowerCase()
  const businessName = workshopConfig?.businessName || 'unserer Werkstatt'
  const phone = workshopConfig?.phone || '+49 30 123456789'
  const email = workshopConfig?.email || 'info@werkstatt.de'
  
  // Emergency detection
  if (AUTOMOTIVE_KNOWLEDGE.urgentKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return {
      type: 'emergency',
      urgency: 'critical',
      message: `🚨 **NOTFALL ERKANNT!**\n\n**Sofortige Hilfe benötigt?**\n\n📞 **Rufen Sie SOFORT an:** ${phone}\n\n🚛 **24/7 Pannenhilfe verfügbar**\n\n**Wichtige Sicherheitshinweise:**\n• Bei Qualm/Rauch: Motor abstellen, Fahrzeug verlassen\n• Bei Panne: Warnblinker an, Warnweste anziehen\n• Standort mitteilen für schnelle Hilfe\n\n⚡ **Wir kommen zu Ihnen!**`,
      actions: [
        { type: 'call', label: '📞 Notfall-Hotline', value: phone, priority: 'high' },
        { type: 'location', label: '📍 Standort teilen', value: 'share_location' }
      ],
      followUp: ['Sind Sie in Sicherheit?', 'Wo befinden Sie sich?', 'Können Sie das Fahrzeug bewegen?']
    }
  }
  
  // Appointment booking
  if (AUTOMOTIVE_KNOWLEDGE.appointmentKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return {
      type: 'appointment',
      urgency: 'medium',
      message: `📅 **Termin bei ${businessName}**\n\n**Gerne vereinbaren wir einen Termin!**\n\n🔧 **Für welchen Service benötigen Sie den Termin?**\n\n**Unsere Services:**\n• 🔍 HU/AU (TÜV) - ab 89€\n• 🛠️ Inspektion - ab 159€\n• 🛞 Reifenwechsel - ab 29€\n• 🔧 Reparaturen - nach Kostenvoranschlag\n\n**Schnellste Terminbuchung:**\n📞 ${phone}\n📧 ${email}\n\n**Oder nutzen Sie unser Online-Formular!**`,
      actions: [
        { type: 'call', label: '📞 Anrufen', value: phone },
        { type: 'form', label: '📝 Termin-Formular', value: 'appointment_form' },
        { type: 'calendar', label: '📅 Verfügbarkeit prüfen', value: 'check_availability' }
      ],
      followUp: ['Welcher Service?', 'Wann hätten Sie Zeit?', 'Ist es dringend?']
    }
  }
  
  // Price inquiries
  if (AUTOMOTIVE_KNOWLEDGE.priceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return {
      type: 'pricing',
      urgency: 'low',
      message: `💰 **Preise & Kostenvoranschlag**\n\n**Gerne informieren wir Sie über unsere Preise!**\n\n**Standard-Preise:**\n• 🔍 HU/AU: ab 89€\n• 🛠️ Inspektion: ab 159€\n• 🛢️ Ölwechsel: ab 49€\n• 🛞 Reifenwechsel: ab 29€\n• 🔧 Kleine Reparaturen: ab 69€\n\n**Für größere Reparaturen:**\n✅ Kostenloser Kostenvoranschlag\n✅ Transparente Preise\n✅ Keine versteckten Kosten\n\n**Kostenvoranschlag anfordern:**\n📞 ${phone}`,
      actions: [
        { type: 'form', label: '📋 Kostenvoranschlag anfordern', value: 'quote_form' },
        { type: 'call', label: '📞 Preise erfragen', value: phone }
      ],
      followUp: ['Welches Fahrzeug?', 'Was ist das Problem?', 'Welcher Service?']
    }
  }
  
  // Service-specific information
  const mentionedService = Object.keys(AUTOMOTIVE_KNOWLEDGE.services).find(service => 
    lowerMessage.includes(service) || lowerMessage.includes(AUTOMOTIVE_KNOWLEDGE.services[service].name.toLowerCase())
  )
  
  if (mentionedService) {
    const service = AUTOMOTIVE_KNOWLEDGE.services[mentionedService]
    return {
      type: 'service_info',
      urgency: 'low',
      message: `🔧 **${service.name}**\n\n**Service-Details:**\n• 💰 Preis: ${service.price}\n• ⏱️ Dauer: ${service.duration}\n• ✅ Professionelle Durchführung\n• 🏆 Qualitätsgarantie\n\n**Warum bei ${businessName}?**\n• Meisterbetrieb mit Erfahrung\n• Moderne Ausstattung\n• Faire, transparente Preise\n• Schnelle Terminvergabe\n\n**Termin vereinbaren:**\n📞 ${phone}`,
      actions: [
        { type: 'call', label: '📞 Termin buchen', value: phone },
        { type: 'info', label: '📋 Mehr Services', value: 'all_services' }
      ],
      followUp: ['Termin gewünscht?', 'Weitere Fragen?', 'Andere Services?']
    }
  }
  
  // Vehicle brand mention
  const mentionedBrand = AUTOMOTIVE_KNOWLEDGE.brands.find(brand => 
    lowerMessage.includes(brand.toLowerCase())
  )
  
  if (mentionedBrand) {
    return {
      type: 'brand_expertise',
      urgency: 'low',
      message: `🚗 **${mentionedBrand}-Expertise**\n\n**Ja, wir sind ${mentionedBrand}-Spezialisten!**\n\n✅ **Unsere ${mentionedBrand}-Services:**\n• Wartung nach Herstellervorgaben\n• Originalteile & Qualitätsersatzteile\n• Spezielle ${mentionedBrand}-Diagnose\n• Alle Reparaturen vom Fachbetrieb\n\n**${mentionedBrand} bei ${businessName}:**\n🔧 Zertifizierte Techniker\n📊 Modernste Diagnosegeräte\n⚡ Schnelle Terminvergabe\n💰 Faire Preise\n\n**Wie können wir Ihnen helfen?**\n📞 ${phone}`,
      actions: [
        { type: 'call', label: `📞 ${mentionedBrand}-Service`, value: phone },
        { type: 'form', label: '📝 Service anfragen', value: 'service_request' }
      ],
      followUp: [`Welches ${mentionedBrand}-Modell?`, 'Was ist das Problem?', 'Termin gewünscht?']
    }
  }
  
  // General greeting/welcome
  const greetings = ['hallo', 'hi', 'guten tag', 'moin', 'servus']
  if (greetings.some(greeting => lowerMessage.includes(greeting)) && sessionHistory.length === 0) {
    return {
      type: 'welcome',
      urgency: 'low',
      message: `👋 **Herzlich willkommen bei ${businessName}!**\n\n**Schön, dass Sie da sind!** Ich bin Ihr virtueller Assistent und helfe Ihnen gerne weiter.\n\n🔧 **Unsere Expertise:**\n• Alle Fahrzeugmarken\n• HU/AU & Inspektionen\n• Reparaturen aller Art\n• Reifenservice\n• Wartung & Pflege\n\n🚨 **Notfall?** → Sofort anrufen: ${phone}\n📅 **Termin gewünscht?** → Ich helfe bei der Buchung!\n💡 **Fragen?** → Fragen Sie einfach!\n\n**Wie kann ich Ihnen heute helfen?**`,
      actions: [
        { type: 'quick_reply', label: '📅 Termin buchen', value: 'Ich möchte einen Termin buchen' },
        { type: 'quick_reply', label: '💰 Preise erfragen', value: 'Was kostet eine Inspektion?' },
        { type: 'quick_reply', label: '🔧 Services anzeigen', value: 'Welche Services bieten Sie an?' },
        { type: 'call', label: '📞 Direkt anrufen', value: phone }
      ],
      followUp: ['Welchen Service benötigen Sie?', 'Haben Sie ein Problem mit Ihrem Fahrzeug?', 'Möchten Sie einen Termin vereinbaren?']
    }
  }
  
  // Default helpful response
  return {
    type: 'general',
    urgency: 'low',
    message: `🤖 **${businessName} - Ihr Kfz-Experte**\n\n**Vielen Dank für Ihre Nachricht!** Gerne helfe ich Ihnen weiter.\n\n**Ich kann Ihnen helfen bei:**\n• 📅 Terminvereinbarungen\n• 💰 Preisinformationen\n• 🔧 Service-Beratung\n• 🚨 Notfällen und Pannen\n• ❓ Allgemeinen Fragen\n\n**Direkte Hilfe:**\n📞 **Anrufen:** ${phone}\n📧 **E-Mail:** ${email}\n\n**Was kann ich für Sie tun?**`,
    actions: [
      { type: 'quick_reply', label: '📅 Termin', value: 'Ich brauche einen Termin' },
      { type: 'quick_reply', label: '🚨 Notfall', value: 'Ich habe eine Panne' },
      { type: 'quick_reply', label: '💰 Preise', value: 'Was kostet das?' },
      { type: 'call', label: '📞 Anrufen', value: phone }
    ],
    followUp: ['Haben Sie eine konkrete Frage?', 'Benötigen Sie einen Service?', 'Ist es dringend?']
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      message, 
      sessionId, 
      clientKey,
      workshopConfig,
      visitorInfo = {},
      pageInfo = {}
    } = body

    // Validation
    if (!message?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Message is required'
      }, { status: 400 })
    }

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 })
    }

    // Rate limiting
    const rateLimit = checkRateLimit(sessionId)
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: rateLimit.retryAfter
      }, { status: 429 })
    }

    // Validate client key if provided
    let validatedWorkshop = workshopConfig
    if (clientKey) {
      const validation = await validateClientKey(clientKey)
      if (validation.valid) {
        validatedWorkshop = validation.workshop
      } else {
        console.warn(`Invalid client key: ${clientKey}`)
      }
    }

    // Get or create session
    if (!chatSessions.has(sessionId)) {
      chatSessions.set(sessionId, {
        id: sessionId,
        clientKey: clientKey || 'website_visitor',
        workshopConfig: validatedWorkshop,
        startTime: new Date().toISOString(),
        messageCount: 0,
        lastActivity: new Date().toISOString(),
        visitorInfo,
        pageInfo
      })
    }

    const session = chatSessions.get(sessionId)
    session.messageCount++
    session.lastActivity = new Date().toISOString()

    // Get or create chat history
    if (!chatHistory.has(sessionId)) {
      chatHistory.set(sessionId, [])
    }

    const history = chatHistory.get(sessionId)
    
    // Store user message
    const userMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      visitorInfo,
      pageInfo
    }

    history.push(userMessage)

    // Generate intelligent response
    const responseData = generateIntelligentResponse(
      message, 
      validatedWorkshop,
      history.filter(msg => msg.type === 'user')
    )
    
    // Store bot response
    const botMessage = {
      id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: 'bot',
      message: responseData.message,
      responseType: responseData.type,
      urgency: responseData.urgency,
      actions: responseData.actions || [],
      followUp: responseData.followUp || [],
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - parseInt(userMessage.id.split('_')[1])
    }

    history.push(botMessage)

    // Limit history size
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }

    // Log conversation for analytics
    console.log(`[WEBSITE-CHAT] ${validatedWorkshop?.businessName || 'Website'} | ${sessionId} | User: ${message.substring(0, 50)}...`)
    console.log(`[WEBSITE-CHAT] ${validatedWorkshop?.businessName || 'Website'} | ${sessionId} | Bot: ${responseData.type}`)

    // Prepare response
    const response = {
      success: true,
      data: {
        message: botMessage.message,
        messageId: botMessage.id,
        responseType: botMessage.responseType,
        urgency: botMessage.urgency,
        actions: botMessage.actions,
        followUp: botMessage.followUp,
        sessionInfo: {
          sessionId,
          messageCount: session.messageCount,
          conversationLength: history.length
        },
        workshop: validatedWorkshop ? {
          name: validatedWorkshop.businessName,
          phone: validatedWorkshop.phone,
          email: validatedWorkshop.email,
          templateType: validatedWorkshop.templateType
        } : null
      },
      metadata: {
        processingTime: botMessage.processingTime,
        timestamp: botMessage.timestamp,
        version: '2.0.0'
      }
    }

    // Add CORS headers
    const responseObj = NextResponse.json(response)
    responseObj.headers.set('Access-Control-Allow-Origin', '*')
    responseObj.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    responseObj.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return responseObj

  } catch (error) {
    console.error('Website Chat API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Es tut uns leid, ich bin momentan nicht verfügbar. Bitte rufen Sie uns direkt an oder versuchen Sie es später erneut.'
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}

// GET endpoint for session info and health checks
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')
    const action = url.searchParams.get('action')

    if (action === 'health') {
      return NextResponse.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        activeSessions: chatSessions.size,
        totalMessages: Array.from(chatHistory.values()).reduce((sum, hist) => sum + hist.length, 0),
        version: '2.0.0'
      })
    }

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'SessionId is required'
      }, { status: 400 })
    }

    if (action === 'history') {
      const history = chatHistory.get(sessionId) || []
      const session = chatSessions.get(sessionId)

      return NextResponse.json({
        success: true,
        data: {
          sessionId,
          session,
          history: history.map(msg => ({
            id: msg.id,
            type: msg.type,
            message: msg.message,
            timestamp: msg.timestamp,
            urgency: msg.urgency,
            actions: msg.actions
          }))
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Website Chat GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}