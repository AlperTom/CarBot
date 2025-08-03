import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Cost calculation for different AI models (prices in cents per 1K tokens)
function calculateCostCents(model, usage) {
  if (!usage || !usage.total_tokens) return 0
  
  const prices = {
    'gpt-3.5-turbo': { input: 0.15, output: 0.20 }, // $0.0015/$0.002 per 1K tokens
    'gpt-4': { input: 3.0, output: 6.0 }, // $0.03/$0.06 per 1K tokens
    'gpt-4-turbo': { input: 1.0, output: 3.0 }, // $0.01/$0.03 per 1K tokens
  }
  
  const price = prices[model] || prices['gpt-3.5-turbo']
  const inputCost = (usage.prompt_tokens / 1000) * price.input
  const outputCost = (usage.completion_tokens / 1000) * price.output
  
  return Math.round((inputCost + outputCost) * 100) // Convert to cents
}

async function getCustomerContext(clientKey) {
  if (!clientKey || clientKey === 'unknown') {
    return { customer: null, services: [], faq: [], openingHours: null }
  }

  try {
    // Get customer data
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('slug', clientKey)
      .single()

    // Get customer services
    const { data: services } = await supabase
      .from('customer_services')
      .select('*')
      .eq('customer_id', customer?.id)
      .eq('active', true)

    // Get relevant FAQ (global + customer-specific)
    const { data: faq } = await supabase
      .from('faq')
      .select('*')
      .or(`customer_id.is.null,customer_id.eq.${customer?.id}`)
      .eq('active', true)
      .order('sort_order')

    return {
      customer: customer || null,
      services: services || [],
      faq: faq || [],
      openingHours: customer?.opening_hours || null
    }
  } catch (error) {
    console.error('Error fetching customer context:', error)
    return { customer: null, services: [], faq: [], openingHours: null }
  }
}

function buildEnhancedSystemPrompt(clientKey, context, language = 'de') {
  const { customer, services, faq, openingHours } = context
  
  const prompts = {
    de: `Du bist CarBot, ein professioneller KFZ-Service-Chatbot. Antworte direkt, höflich und sachlich auf Deutsch.`,
    en: `You are CarBot, a professional automotive service chatbot. Respond directly, politely and factually in English.`,
    tr: `CarBot'sın, profesyonel bir otomotiv servis chatbotu. Türkçe olarak doğrudan, kibar ve gerçekçi cevaplar ver.`,
    pl: `Jesteś CarBot, profesjonalnym chatbotem serwisu motoryzacyjnego. Odpowiadaj bezpośrednio, grzecznie i rzeczowo po polsku.`
  }
  
  let prompt = prompts[language] || prompts.de
  
  // Add customer-specific context
  if (customer) {
    prompt += `\n\nDu berätst für: ${customer.name} in ${customer.city}`
    if (customer.phone) {
      prompt += `\nTelefon: ${customer.phone}`
    }
  }

  // Add services context
  if (services.length > 0) {
    prompt += `\n\nVerfügbare Services:`
    services.forEach(service => {
      prompt += `\n- ${service.service_name}`
      if (service.price_from && service.price_to) {
        prompt += ` (${service.price_from}€ - ${service.price_to}€ ${service.price_unit || ''})`
      } else if (service.price_from) {
        prompt += ` (ab ${service.price_from}€ ${service.price_unit || ''})`
      }
      if (service.description) {
        prompt += `: ${service.description}`
      }
    })
  }

  // Add opening hours
  if (openingHours) {
    prompt += `\n\nÖffnungszeiten:\n${openingHours}`
  }

  // Add FAQ context for better responses
  if (faq.length > 0) {
    prompt += `\n\nHäufige Fragen und Antworten:`
    faq.slice(0, 10).forEach(entry => { // Limit to top 10 FAQ
      prompt += `\nF: ${entry.question}\nA: ${entry.answer}\n`
    })
  }

  prompt += `\n\nWenn eine Frage unklar ist oder du nicht sicher bist, bitte um eine Telefonnummer für einen Rückruf und leite zur Fachwerkstatt weiter.
  
Antworte ausschließlich auf Deutsch und bleibe höflich und professionell. Bei konkreten Reparatur- oder Diagnosefragen empfehle immer den direkten Kontakt zur Werkstatt.

Client: ${clientKey || 'unknown'}`

  return prompt
}

export async function POST(request) {
  try {
    const { messages, clientKey, hasConsent, language, systemPrompt } = await request.json()
    
    // Validierung
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ 
        error: 'Messages array is required' 
      }, { status: 400 })
    }

    if (!hasConsent) {
      return NextResponse.json({ 
        error: 'GDPR consent required',
        message: 'Bitte stimmen Sie der Datenverarbeitung zu, um den Chat zu nutzen.' 
      }, { status: 400 })
    }

    // Get customer context for enhanced responses
    const context = await getCustomerContext(clientKey)
    
    // Build enhanced system prompt with customer context
    const systemMessage = {
      role: 'system',
      content: systemPrompt || buildEnhancedSystemPrompt(clientKey, context, language)
    }

    // Track API usage start time
    const startTime = Date.now()

    // Choose model based on environment or customer subscription
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    
    // OpenAI API Call with enhanced context
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content
    const usage = completion.usage

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Track AI usage for cost optimization
    try {
      const responseTime = Date.now() - startTime
      await supabase.from('ai_usage_logs').insert({
        client_key: clientKey || 'anonymous',
        model_name: model,
        prompt_tokens: usage?.prompt_tokens || 0,
        completion_tokens: usage?.completion_tokens || 0,
        total_tokens: usage?.total_tokens || 0,
        cost_cents: calculateCostCents(model, usage),
        response_time_ms: responseTime,
        language: language || 'de',
        created_at: new Date().toISOString()
      })
    } catch (usageError) {
      console.error('Error tracking AI usage:', usageError)
      // Don't fail the request if usage tracking fails
    }

    // Track analytics event
    try {
      await supabase.from('analytics_events').insert({
        event_type: 'chat_response_generated',
        client_key: clientKey || 'anonymous',
        event_data: {
          message_count: messages.length,
          response_length: aiResponse.length,
          model_used: model,
          language: language || 'de',
          has_customer_context: !!context.customer
        },
        created_at: new Date().toISOString()
      })
    } catch (analyticsError) {
      console.error('Error tracking analytics:', analyticsError)
    }

    return NextResponse.json({ 
      text: aiResponse,
      message: aiResponse,
      context: {
        customer: context.customer?.name || null,
        has_services: context.services.length > 0,
        has_faq: context.faq.length > 0
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Entschuldigung, es gab einen Fehler beim Verarbeiten Ihrer Anfrage.' 
    }, { status: 500 })
  }
}