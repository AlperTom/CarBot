import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '../../../../lib/email'

// Initialize Supabase with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  console.log('=== SIGNUP API CALLED ===')
  
  try {
    // Check environment variables
    console.log('Checking environment variables...')
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    console.log('Environment variables OK')

    console.log('Parsing request body...')
    let requestData
    try {
      requestData = await request.json()
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }
    
    const { email, password, workshopData } = requestData
    console.log('Request data parsed:', { email, workshopData })

    // Validate required fields
    if (!email || !password || !workshopData) {
      console.log('Missing required fields:', { email: !!email, password: !!password, workshopData: !!workshopData })
      return NextResponse.json(
        { error: 'E-Mail, Passwort und Werkstatt-Daten sind erforderlich.' },
        { status: 400 }
      )
    }

    // Create auth user
    console.log('Creating user with Supabase...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Enable email confirmation
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: translateAuthError(authError.message) },
        { status: 400 }
      )
    }
    
    console.log('User created successfully:', authData.user.id)

    // Create workshop record
    console.log('Creating workshop record...')
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
      console.error('Workshop creation error:', workshopError)
      // Clean up auth user if workshop creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Fehler beim Erstellen der Werkstatt-Daten.' },
        { status: 500 }
      )
    }
    
    console.log('Workshop created successfully:', workshop.id)

    // Create audit log (optional - don't fail if function doesn't exist)
    try {
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
    } catch (auditError) {
      console.warn('Failed to create audit log (non-critical):', auditError.message)
    }

    // Send welcome email
    try {
      await sendWelcomeEmail({
        email,
        workshopName: workshopData.name,
        ownerName: workshopData.ownerName || 'Workshop-Inhaber'
      })
      console.log('Welcome email sent successfully')
    } catch (emailError) {
      console.error('Failed to send welcome email (non-critical):', emailError.message)
    }

    console.log('Registration completed successfully')
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
    console.error('Error stack:', error.stack)
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