import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { email, password, workshopData } = await request.json()

    // Validate required fields
    if (!email || !password || !workshopData) {
      return NextResponse.json(
        { error: 'E-Mail, Passwort und Werkstatt-Daten sind erforderlich.' },
        { status: 400 }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false // Require email confirmation
    })

    if (authError) {
      return NextResponse.json(
        { error: translateAuthError(authError.message) },
        { status: 400 }
      )
    }

    // Create workshop record
    const { data: workshop, error: workshopError } = await supabaseAdmin
      .from('workshops')
      .insert({
        owner_id: authData.user.id,
        owner_email: email,
        name: workshopData.name,
        phone: workshopData.phone,
        address: workshopData.address,
        city: workshopData.city,
        postal_code: workshopData.postalCode,
        business_type: workshopData.businessType,
        subscription_plan: workshopData.plan || 'basic',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      })
      .select()
      .single()

    if (workshopError) {
      // Clean up auth user if workshop creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Fehler beim Erstellen der Werkstatt-Daten.' },
        { status: 500 }
      )
    }

    // Create audit log
    await supabaseAdmin.rpc('create_audit_log', {
      p_user_id: authData.user.id,
      p_workshop_id: workshop.id,
      p_action: 'registration',
      p_resource_type: 'workshop',
      p_resource_id: workshop.id,
      p_details: { 
        business_type: workshopData.businessType,
        plan: workshopData.plan 
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        user: authData.user,
        workshop,
        requiresConfirmation: true
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten.' },
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