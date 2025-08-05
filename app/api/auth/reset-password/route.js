import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '../../../../lib/email'

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
    const { email, type = 'request' } = await request.json()

    if (type === 'request') {
      // Request password reset
      if (!email) {
        return NextResponse.json(
          { error: 'E-Mail-Adresse ist erforderlich.' },
          { status: 400 }
        )
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
      })

      if (error) {
        return NextResponse.json(
          { error: translateAuthError(error.message) },
          { status: 400 }
        )
      }

      // Send custom password reset email
      try {
        const { data: workshop } = await supabaseAdmin
          .from('workshops')
          .select('name')
          .eq('owner_email', email)
          .single()

        await sendPasswordResetEmail({
          email,
          resetUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
          workshopName: workshop?.name
        })
        console.log('Password reset email sent successfully')
      } catch (emailError) {
        console.error('Failed to send password reset email (non-critical):', emailError.message)
      }

      // Create audit log (if user exists)
      const { data: user } = await supabaseAdmin.auth.admin.listUsers()
      const foundUser = user?.users?.find(u => u.email === email)
      
      if (foundUser) {
        const { data: workshop } = await supabaseAdmin
          .from('workshops')
          .select('id')
          .eq('owner_email', email)
          .single()

        await supabaseAdmin.rpc('create_audit_log', {
          p_user_id: foundUser.id,
          p_workshop_id: workshop?.id || null,
          p_action: 'password_reset_request',
          p_resource_type: 'user',
          p_resource_id: foundUser.id,
          p_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip'),
          p_user_agent: request.headers.get('user-agent')
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset email sent if account exists.'
      })

    } else if (type === 'update') {
      // Update password
      const { password, access_token } = await request.json()

      if (!password || !access_token) {
        return NextResponse.json(
          { error: 'Passwort und Access Token sind erforderlich.' },
          { status: 400 }
        )
      }

      // Update password using access token
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        access_token, // This should be the user ID from the verified token
        { password }
      )

      if (error) {
        return NextResponse.json(
          { error: translateAuthError(error.message) },
          { status: 400 }
        )
      }

      // Create audit log
      const { data: workshop } = await supabaseAdmin
        .from('workshops')
        .select('id')
        .eq('owner_email', data.user.email)
        .single()

      await supabaseAdmin.rpc('create_audit_log', {
        p_user_id: data.user.id,
        p_workshop_id: workshop?.id || null,
        p_action: 'password_change',
        p_resource_type: 'user',
        p_resource_id: data.user.id,
        p_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip'),
        p_user_agent: request.headers.get('user-agent')
      })

      return NextResponse.json({
        success: true,
        message: 'Passwort erfolgreich aktualisiert.'
      })
    }

    return NextResponse.json(
      { error: 'Ungültiger Request-Typ.' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}

function translateAuthError(message) {
  const errorMap = {
    'Invalid email': 'Ungültige E-Mail-Adresse.',
    'Email rate limit exceeded': 'E-Mail-Limit erreicht. Bitte warten Sie vor einem erneuten Versuch.',
    'Password should be at least 6 characters': 'Passwort muss mindestens 6 Zeichen lang sein.',
    'Unable to validate email address: invalid format': 'Ungültige E-Mail-Adresse.',
    'Token has expired or is invalid': 'Token ist abgelaufen oder ungültig.'
  }
  
  return errorMap[message] || message
}