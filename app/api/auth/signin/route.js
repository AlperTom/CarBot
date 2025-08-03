import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      )
    }

    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return NextResponse.json(
        { error: translateAuthError(authError.message) },
        { status: 401 }
      )
    }

    // Get workshop information
    let workshop = null
    let role = 'customer'

    // Check if user is workshop owner
    const { data: ownerWorkshop, error: ownerError } = await supabaseAdmin
      .from('workshops')
      .select('*')
      .eq('owner_email', email)
      .eq('active', true)
      .single()

    if (!ownerError && ownerWorkshop) {
      workshop = ownerWorkshop
      role = 'owner'
    } else {
      // Check if user is an employee
      const { data: employeeData, error: employeeError } = await supabaseAdmin
        .from('workshop_users')
        .select(`
          *,
          workshop:workshops(*)
        `)
        .eq('user_id', authData.user.id)
        .eq('active', true)
        .single()

      if (!employeeError && employeeData) {
        workshop = employeeData.workshop
        role = employeeData.role
        
        // Update last login
        await supabaseAdmin
          .from('workshop_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', employeeData.id)
      }
    }

    if (!workshop) {
      return NextResponse.json(
        { error: 'Kein Workshop für diese E-Mail gefunden. Bitte registrieren Sie sich zuerst.' },
        { status: 404 }
      )
    }

    // Get client IP for audit log
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip')

    // Create audit log
    await supabaseAdmin.rpc('create_audit_log', {
      p_user_id: authData.user.id,
      p_workshop_id: workshop.id,
      p_action: 'login',
      p_resource_type: 'user',
      p_resource_id: authData.user.id,
      p_details: { role },
      p_ip_address: ip,
      p_user_agent: request.headers.get('user-agent')
    })

    return NextResponse.json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
        workshop,
        role
      }
    })

  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}

function translateAuthError(message) {
  const errorMap = {
    'Invalid login credentials': 'Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.',
    'Email not confirmed': 'E-Mail noch nicht bestätigt. Bitte überprüfen Sie Ihr E-Mail-Postfach.',
    'Too many requests': 'Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.',
    'User not found': 'Benutzer nicht gefunden.',
    'Account not confirmed': 'Konto noch nicht bestätigt. Bitte überprüfen Sie Ihr E-Mail-Postfach.'
  }
  
  return errorMap[message] || message
}