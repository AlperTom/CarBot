import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { authenticateUser, generateTokens } from '../../../../lib/jwt-auth.js'

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
    const { email, password, useJWT = true } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      )
    }

    // Use enhanced JWT authentication system
    const authResult = await authenticateUser(email, password)
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: translateAuthError(authResult.error) },
        { status: 401 }
      )
    }

    const { user, workshop, role, session } = authResult

    // Generate JWT tokens if requested (default)
    let tokens = null
    if (useJWT) {
      tokens = generateTokens(user, workshop, role)
    }

    // Get client IP for audit log
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip')

    // Create audit log if Supabase is available
    try {
      if (workshop?.id && supabaseAdmin) {
        await supabaseAdmin.rpc('create_audit_log', {
          p_user_id: user.id,
          p_workshop_id: workshop.id,
          p_action: 'login',
          p_resource_type: 'user',
          p_resource_id: user.id,
          p_details: { role, auth_method: tokens ? 'jwt' : 'supabase' },
          p_ip_address: ip,
          p_user_agent: request.headers.get('user-agent')
        })
      }
    } catch (auditError) {
      console.warn('Failed to create audit log:', auditError)
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
        workshop,
        role,
        session: tokens ? undefined : session, // Don't return Supabase session if using JWT
        tokens: tokens || undefined,
        authMethod: tokens ? 'jwt' : 'supabase'
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