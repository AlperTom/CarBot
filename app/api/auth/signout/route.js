import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { user_id, workshop_id } = await request.json()

    // Get client IP for audit log
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip')

    // Create audit log if user data provided
    if (user_id && workshop_id) {
      await supabaseAdmin.rpc('create_audit_log', {
        p_user_id: user_id,
        p_workshop_id: workshop_id,
        p_action: 'logout',
        p_resource_type: 'user',
        p_resource_id: user_id,
        p_ip_address: ip,
        p_user_agent: request.headers.get('user-agent')
      })
    }

    // Deactivate user sessions
    if (user_id) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ active: false })
        .eq('user_id', user_id)
    }

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich abgemeldet.'
    })

  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abmelden.' },
      { status: 500 }
    )
  }
}