import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  console.log('=== SIMPLE SIGNUP API CALLED ===')
  
  try {
    const { email, password, workshopData } = await request.json()
    console.log('Request data:', { email, workshopData })

    // Validate required fields
    if (!email || !password || !workshopData) {
      return NextResponse.json(
        { error: 'E-Mail, Passwort und Werkstatt-Daten sind erforderlich.' },
        { status: 400 }
      )
    }

    // Create auth user only (skip workshop table for now)
    console.log('Creating user with Supabase...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Set to true for testing without email confirmation
      user_metadata: {
        workshop_name: workshopData.name,
        workshop_phone: workshopData.phone,
        workshop_address: workshopData.address,
        workshop_city: workshopData.city,
        workshop_postal_code: workshopData.postalCode,
        workshop_business_type: workshopData.businessType,
        workshop_plan: workshopData.plan
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: translateAuthError(authError.message) },
        { status: 400 }
      )
    }
    
    console.log('User created successfully:', authData.user.id)
    console.log('Workshop data stored in user metadata temporarily')

    return NextResponse.json({
      success: true,
      data: {
        user: authData.user,
        workshop: { 
          id: 'temp-' + authData.user.id, 
          name: workshopData.name,
          stored_in_metadata: true 
        },
        requiresConfirmation: true
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)
    return NextResponse.json(
      { 
        error: 'Ein unerwarteter Fehler ist aufgetreten.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

function translateAuthError(message) {
  const errorMap = {
    'User already registered': 'Diese E-Mail-Adresse ist bereits registriert.',
    'Invalid email': 'Ungültige E-Mail-Adresse.',
    'Password should be at least 6 characters': 'Passwort muss mindestens 6 Zeichen lang sein.',
    'Signup disabled': 'Registrierung ist derzeit deaktiviert.',
    'Email rate limit exceeded': 'E-Mail-Limit erreicht. Bitte warten Sie vor einem erneuten Versuch.'
  }
  
  return errorMap[message] || message
}