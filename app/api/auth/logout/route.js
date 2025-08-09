/**
 * Logout Endpoint - Enhanced with JWT support
 * Handles both JWT and Supabase session logout
 */

import { NextResponse } from 'next/server'
import { blacklistToken, revokeRefreshToken, verifyToken } from '../../../../lib/jwt-auth.js'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { refreshToken, allDevices = false } = body
    
    // Get access token from header
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    let userId = null
    let workshopId = null
    let authMethod = 'unknown'

    // Handle JWT logout
    if (accessToken) {
      const decoded = verifyToken(accessToken)
      
      if (decoded && decoded.type === 'access') {
        userId = decoded.sub
        workshopId = decoded.workshop_id
        authMethod = 'jwt'
        
        // Blacklist the access token
        blacklistToken(accessToken)
        
        // Revoke refresh token if provided
        if (refreshToken) {
          revokeRefreshToken(refreshToken)
        }
        
        console.log(`JWT logout for user: ${userId}`)
      } else {
        // Try Supabase token
        try {
          const { data: user, error } = await supabaseAdmin.auth.getUser(accessToken)
          if (!error && user?.user) {
            userId = user.user.id
            authMethod = 'supabase'
            
            // Sign out from Supabase
            await supabaseAdmin.auth.admin.signOut(accessToken)
            
            console.log(`Supabase logout for user: ${userId}`)
          }
        } catch (supabaseError) {
          console.warn('Supabase logout failed:', supabaseError)
        }
      }
    }

    // Create audit log if we have user info
    if (userId && workshopId) {
      try {
        const forwardedFor = request.headers.get('x-forwarded-for')
        const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip')

        await supabaseAdmin.rpc('create_audit_log', {
          p_user_id: userId,
          p_workshop_id: workshopId,
          p_action: 'logout',
          p_resource_type: 'user',
          p_resource_id: userId,
          p_details: { 
            auth_method: authMethod,
            all_devices: allDevices 
          },
          p_ip_address: ip,
          p_user_agent: request.headers.get('user-agent')
        })
      } catch (auditError) {
        console.warn('Failed to create logout audit log:', auditError)
      }
    }

    // Handle logout from all devices
    if (allDevices && userId) {
      try {
        // Deactivate all sessions for user in database
        await supabaseAdmin
          .from('user_sessions')
          .update({ active: false, logged_out_at: new Date().toISOString() })
          .eq('user_id', userId)
        
        console.log(`Logged out from all devices for user: ${userId}`)
      } catch (sessionError) {
        console.warn('Failed to deactivate all sessions:', sessionError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: allDevices 
          ? 'Erfolgreich von allen Geräten abgemeldet.'
          : 'Erfolgreich abgemeldet.',
        authMethod,
        userId: userId || 'unknown'
      }
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abmelden.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check logout status
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({
        success: true,
        data: { 
          message: 'No token provided',
          loggedOut: true 
        }
      })
    }

    // Check if JWT token is blacklisted
    const decoded = verifyToken(token)
    const isJWTValid = decoded && decoded.type === 'access'
    
    // Check Supabase token if JWT is invalid
    let isSupabaseValid = false
    if (!isJWTValid) {
      try {
        const { data: user, error } = await supabaseAdmin.auth.getUser(token)
        isSupabaseValid = !error && !!user?.user
      } catch (e) {
        isSupabaseValid = false
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        loggedOut: !isJWTValid && !isSupabaseValid,
        tokenType: isJWTValid ? 'jwt' : isSupabaseValid ? 'supabase' : 'invalid'
      }
    })

  } catch (error) {
    console.error('Logout status check error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Prüfen des Logout-Status.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}