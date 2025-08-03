import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  try {
    // Get session from headers or cookies
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Keine gültige Sitzung gefunden.' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    // Verify the JWT token
    const { data: user, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json(
        { error: 'Ungültige Sitzung.' },
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
      .eq('owner_email', user.user.email)
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
        .eq('user_id', user.user.id)
        .eq('active', true)
        .single()

      if (!employeeError && employeeData) {
        workshop = employeeData.workshop
        role = employeeData.role
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user: user.user,
        workshop,
        role
      }
    })

  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Validieren der Sitzung.' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { user_id, workshop_id, session_token, ip_address, user_agent } = await request.json()

    // Create or update user session
    const { data, error } = await supabaseAdmin
      .from('user_sessions')
      .upsert({
        user_id,
        workshop_id,
        session_token,
        ip_address,
        user_agent,
        last_activity: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        active: true
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Fehler beim Erstellen der Sitzung.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Sitzung.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { user_id } = await request.json()

    // Deactivate all sessions for user
    const { error } = await supabaseAdmin
      .from('user_sessions')
      .update({ active: false })
      .eq('user_id', user_id)

    if (error) {
      return NextResponse.json(
        { error: 'Fehler beim Beenden der Sitzungen.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Alle Sitzungen erfolgreich beendet.'
    })

  } catch (error) {
    console.error('Session deletion error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Beenden der Sitzungen.' },
      { status: 500 }
    )
  }
}