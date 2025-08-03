import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  // Only allow in UAT environment
  if (process.env.NODE_ENV !== 'uat' && !process.env.UAT_MODE) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const { type, count = 10 } = await request.json()

    switch (type) {
      case 'conversations':
        await generateTestConversations(count)
        break
      case 'clients':
        await generateTestClients(count)
        break
      case 'analytics':
        await generateTestAnalytics(count)
        break
      case 'appointments':
        await generateTestAppointments(count)
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Generated ${count} test ${type}`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('UAT data generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function generateTestConversations(count) {
  const workshops = await supabase
    .from('workshops')
    .select('id, slug')
    .ilike('slug', '%-uat')

  const conversations = []
  const messages = [
    'Hallo, ich brauche einen Termin für mein Auto',
    'Können Sie mir einen Kostenvoranschlag machen?',
    'Wann haben Sie Zeit für eine Inspektion?',
    'Mein Auto macht komische Geräusche',
    'Ich brauche neue Reifen',
    'Hello, I need service for my car',
    'Can you fix my brakes?',
    'Merhaba, arabam için servis lazım',
    'Cześć, potrzebuję naprawy samochodu'
  ]

  for (let i = 0; i < count; i++) {
    const workshop = workshops.data[Math.floor(Math.random() * workshops.data.length)]
    const message = messages[Math.floor(Math.random() * messages.length)]
    
    conversations.push({
      workshop_id: workshop.id,
      client_key: workshop.slug + '-test',
      message: message,
      response: 'Gerne helfe ich Ihnen! Wann passt Ihnen ein Termin?',
      language: detectLanguage(message),
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  await supabase.from('ai_usage_logs').insert(
    conversations.map(conv => ({
      client_key: conv.client_key,
      workshop_id: conv.workshop_id,
      model_name: 'gpt-3.5-turbo',
      prompt_tokens: Math.floor(Math.random() * 100 + 50),
      completion_tokens: Math.floor(Math.random() * 80 + 30),
      total_tokens: Math.floor(Math.random() * 180 + 80),
      cost_cents: Math.floor(Math.random() * 30 + 10),
      language: conv.language,
      created_at: conv.created_at
    }))
  )
}

async function generateTestClients(count) {
  const workshops = await supabase
    .from('workshops')
    .select('id')
    .ilike('slug', '%-uat')

  const clients = []
  const names = ['Müller', 'Schmidt', 'Wagner', 'Fischer', 'Weber', 'Meyer', 'Schulz']
  const firstNames = ['Hans', 'Maria', 'Peter', 'Anna', 'Klaus', 'Petra', 'Thomas']
  const cities = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart']
  const statuses = ['registered_ordered', 'registered_no_order', 'registered_no_confirmation', 'lead_only']

  for (let i = 0; i < count; i++) {
    const workshop = workshops.data[Math.floor(Math.random() * workshops.data.length)]
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = names[Math.floor(Math.random() * names.length)]
    
    clients.push({
      workshop_id: workshop.id,
      workshop_name: `${firstName} ${lastName} Werkstatt`,
      owner_name: `${firstName} ${lastName}`,
      owner_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@uat-test.de`,
      phone: `+49 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      registration_status: statuses[Math.floor(Math.random() * statuses.length)],
      subscription_plan: ['starter', 'professional', 'enterprise'][Math.floor(Math.random() * 3)],
      subscription_status: ['trial', 'active', 'inactive'][Math.floor(Math.random() * 3)],
      total_conversations: Math.floor(Math.random() * 50),
      total_leads: Math.floor(Math.random() * 20),
      total_appointments: Math.floor(Math.random() * 10),
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  await supabase.from('workshop_clients').insert(clients)
}

async function generateTestAnalytics(count) {
  const workshops = await supabase
    .from('workshops')
    .select('id, slug')
    .ilike('slug', '%-uat')

  const events = []
  const eventTypes = [
    'chat_response_generated',
    'lead_captured', 
    'appointment_booked',
    'conversation_started',
    'user_feedback_positive',
    'conversion_completed'
  ]

  for (let i = 0; i < count; i++) {
    const workshop = workshops.data[Math.floor(Math.random() * workshops.data.length)]
    
    events.push({
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      client_key: workshop.slug + '-test',
      workshop_id: workshop.id,
      event_data: {
        user_agent: 'UAT Test Browser',
        session_duration: Math.floor(Math.random() * 600 + 60),
        page_views: Math.floor(Math.random() * 10 + 1)
      },
      session_id: `uat_session_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  await supabase.from('analytics_events').insert(events)
}

async function generateTestAppointments(count) {
  const workshops = await supabase
    .from('workshops')
    .select('id')
    .ilike('slug', '%-uat')

  const appointments = []
  const services = ['Inspektion', 'Ölwechsel', 'Reparatur', 'TÜV', 'Wartung', 'Reifenwechsel']
  const vehicles = ['BMW 3er', 'Mercedes C-Klasse', 'VW Golf', 'Audi A4', 'Opel Astra']
  const names = ['Max Mustermann', 'Anna Schmidt', 'Peter Wagner', 'Lisa Müller', 'Tom Fischer']

  for (let i = 0; i < count; i++) {
    const workshop = workshops.data[Math.floor(Math.random() * workshops.data.length)]
    const startTime = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour later
    
    appointments.push({
      workshop_id: workshop.id,
      customer_slug: `uat_customer_${Math.random().toString(36).substr(2, 9)}`,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      customer_name: names[Math.floor(Math.random() * names.length)],
      customer_phone: `+49 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
      customer_email: `uat.kunde${i}@test-email.de`,
      service_requested: services[Math.floor(Math.random() * services.length)],
      vehicle_info: vehicles[Math.floor(Math.random() * vehicles.length)] + `, Baujahr ${2015 + Math.floor(Math.random() * 8)}`,
      status: ['confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
      language: 'de',
      created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  await supabase.from('appointments').insert(appointments)
}

function detectLanguage(message) {
  if (message.includes('Hello') || message.includes('service')) return 'en'
  if (message.includes('Merhaba') || message.includes('servis')) return 'tr'
  if (message.includes('Cześć') || message.includes('potrzebuję')) return 'pl'
  return 'de'
}

export async function GET(request) {
  // Only allow in UAT environment
  if (process.env.NODE_ENV !== 'uat' && !process.env.UAT_MODE) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    // Get UAT statistics
    const stats = await supabase
      .from('workshops')
      .select('id')
      .ilike('slug', '%-uat')

    const clientsCount = await supabase
      .from('workshop_clients')
      .select('id', { count: 'exact' })

    const conversationsCount = await supabase
      .from('ai_usage_logs')
      .select('id', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    return NextResponse.json({
      environment: 'UAT',
      status: 'active',
      data: {
        workshops: stats.data?.length || 0,
        clients: clientsCount.count || 0,
        conversations_last_7_days: conversationsCount.count || 0,
        last_updated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('UAT stats error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}