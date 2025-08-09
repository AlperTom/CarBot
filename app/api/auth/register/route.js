/**
 * User Registration API - Account Creation for CarBot
 * MVP Critical Component - Enables new user signups
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateTokens } from '../../../../lib/jwt-auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      businessName, 
      name, 
      phone, 
      templateType = 'klassische',
      useJWT = true 
    } = body

    // Validate required fields
    if (!email || !password || !businessName || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email, password, business name, and contact name are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long'
      }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('workshops')
      .select('id, owner_email')
      .eq('owner_email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email already exists'
      }, { status: 409 })
    }

    if (useJWT) {
      // JWT-based registration
      try {
        // Create workshop record first
        const { data: workshop, error: workshopError } = await supabase
          .from('workshops')
          .insert({
            business_name: businessName,
            name: businessName,
            owner_email: email,
            phone: phone || null,
            template_type: templateType,
            active: true,
            verified: false
          })
          .select()
          .single()

        if (workshopError) {
          console.error('Workshop creation error:', workshopError)
          return NextResponse.json({
            success: false,
            error: 'Failed to create workshop account'
          }, { status: 500 })
        }

        // Create user session record (password would be hashed in production)
        const userId = workshop.id // Using workshop ID as user ID for simplicity
        
        // Generate JWT tokens
        const tokens = generateTokens({
          userId: userId,
          email: email,
          workshopId: workshop.id,
          role: 'owner'
        })

        // Store session in database
        const { error: sessionError } = await supabase
          .from('user_sessions')
          .insert({
            user_id: userId,
            workshop_id: workshop.id,
            session_token: tokens.accessToken.substring(0, 100), // Truncated for storage
            refresh_token_hash: tokens.refreshToken.substring(0, 255),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            active: true
          })

        if (sessionError) {
          console.error('Session creation error:', sessionError)
          // Continue anyway as this is not critical for registration
        }

        // Create default client key for the workshop
        const { error: keyError } = await supabase
          .from('client_keys')
          .insert({
            workshop_id: workshop.id,
            name: 'Default Key',
            client_key_hash: `ck_live_${workshop.id}_${Date.now()}`,
            prefix: 'ck_live_',
            authorized_domains: ['localhost:3000'],
            is_active: true
          })

        if (keyError) {
          console.error('Client key creation error:', keyError)
          // Continue anyway
        }

        const userData = {
          id: userId,
          email: email,
          name: name,
          workshopId: workshop.id,
          role: 'owner'
        }

        return NextResponse.json({
          success: true,
          message: 'Account created successfully',
          data: {
            user: userData,
            workshop: workshop,
            tokens: tokens,
            authMethod: 'jwt'
          }
        }, { status: 201 })

      } catch (jwtError) {
        console.error('JWT registration error:', jwtError)
        return NextResponse.json({
          success: false,
          error: 'Registration failed due to authentication error'
        }, { status: 500 })
      }

    } else {
      // Supabase Auth registration (fallback)
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              business_name: businessName,
              contact_name: name,
              phone: phone,
              template_type: templateType
            }
          }
        })

        if (authError) {
          console.error('Supabase auth error:', authError)
          return NextResponse.json({
            success: false,
            error: authError.message
          }, { status: 400 })
        }

        if (!authData.user) {
          return NextResponse.json({
            success: false,
            error: 'User creation failed'
          }, { status: 500 })
        }

        // Create workshop record
        const { data: workshop, error: workshopError } = await supabase
          .from('workshops')
          .insert({
            business_name: businessName,
            name: businessName,
            owner_email: email,
            phone: phone || null,
            template_type: templateType,
            active: true,
            verified: false
          })
          .select()
          .single()

        if (workshopError) {
          console.error('Workshop creation error:', workshopError)
          // Try to clean up auth user if workshop creation fails
          await supabase.auth.admin.deleteUser(authData.user.id)
          return NextResponse.json({
            success: false,
            error: 'Failed to create workshop account'
          }, { status: 500 })
        }

        const userData = {
          id: authData.user.id,
          email: email,
          name: name,
          workshopId: workshop.id,
          role: 'owner'
        }

        return NextResponse.json({
          success: true,
          message: 'Account created successfully. Please check your email for verification.',
          data: {
            user: userData,
            workshop: workshop,
            session: authData.session,
            authMethod: 'supabase'
          }
        }, { status: 201 })

      } catch (supabaseError) {
        console.error('Supabase registration error:', supabaseError)
        return NextResponse.json({
          success: false,
          error: 'Registration failed due to database error'
        }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error during registration'
    }, { status: 500 })
  }
}

// OPTIONS for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}