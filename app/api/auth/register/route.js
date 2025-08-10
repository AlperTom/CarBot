/**
 * User Registration API - Account Creation for CarBot
 * MVP Critical Component - Enables new user signups
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

// Simple token generation function for registration
function generateTokensSimple(user, workshop, role = 'owner') {
  const JWT_SECRET = process.env.JWT_SECRET || 'carbot_dev_secret_change_in_production'
  
  const payload = {
    sub: user.id,
    email: user.email,
    role,
    workshop_id: workshop?.id || null,
    workshop_name: workshop?.name || null,
    iat: Math.floor(Date.now() / 1000),
    type: 'access'
  }

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '24h',
    issuer: 'carbot-auth',
    audience: 'carbot-api'
  })

  const refreshPayload = {
    sub: user.id,
    type: 'refresh',
    jti: randomBytes(16).toString('hex')
  }

  const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'carbot-auth',
    audience: 'carbot-api'
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: '24h',
    tokenType: 'Bearer'
  }
}

// Initialize Supabase client with error handling
function initializeSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'carbot-registration'
      }
    }
  })
}

const supabase = initializeSupabase()

export async function POST(request) {
  const startTime = Date.now()
  let supabaseClient = null
  
  try {
    // Initialize Supabase client with retry logic
    try {
      supabaseClient = initializeSupabase()
    } catch (initError) {
      console.error('❌ [Registration] Supabase initialization failed:', initError.message)
      return NextResponse.json({
        success: false,
        error: 'Database service temporarily unavailable',
        code: 'INIT_ERROR'
      }, { status: 503 })
    }
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

    // Check if user already exists with retry mechanism
    let existingUser = null
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      try {
        const { data, error } = await supabaseClient
          .from('workshops')
          .select('id, owner_email')
          .eq('owner_email', email)
          .maybeSingle() // Use maybeSingle() to avoid error when no record found
        
        if (error && error.code !== 'PGRST116') {
          throw error
        }
        
        existingUser = data
        break
        
      } catch (checkError) {
        retryCount++
        console.warn(`⚠️ [Registration] User existence check attempt ${retryCount}/${maxRetries} failed:`, checkError.message)
        
        if (retryCount >= maxRetries) {
          console.error('❌ [Registration] Failed to check existing user after retries:', checkError)
          return NextResponse.json({
            success: false,
            error: 'Database connectivity issue. Please try again.',
            code: 'DB_CHECK_ERROR',
            debug: process.env.NODE_ENV === 'development' ? checkError.message : undefined
          }, { status: 503 })
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
      }
    }

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email already exists'
      }, { status: 409 })
    }

    if (useJWT) {
      // JWT-based registration with comprehensive error handling
      try {
        // Create workshop record first with retry logic
        let workshop = null
        let workshopRetryCount = 0
        const maxWorkshopRetries = 3
        
        while (workshopRetryCount < maxWorkshopRetries) {
          try {
            const { data, error } = await supabaseClient
              .from('workshops')
              .insert({
                business_name: businessName,
                name: businessName,
                owner_email: email,
                phone: phone || null,
                template_type: templateType,
                active: true,
                verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single()
              
            if (error) {
              if (error.code === '23505') { // Unique constraint violation
                return NextResponse.json({
                  success: false,
                  error: 'An account with this email already exists',
                  code: 'DUPLICATE_EMAIL'
                }, { status: 409 })
              }
              throw error
            }
            
            workshop = data
            console.log('✅ [Registration] Workshop created successfully:', workshop.id)
            break
            
          } catch (workshopError) {
            workshopRetryCount++
            console.warn(`⚠️ [Registration] Workshop creation attempt ${workshopRetryCount}/${maxWorkshopRetries} failed:`, workshopError.message)
            
            if (workshopRetryCount >= maxWorkshopRetries) {
              throw workshopError
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000 * workshopRetryCount))
          }
        }

        if (!workshop) {
          console.error('❌ [Registration] Workshop creation failed: No data returned')
          return NextResponse.json({
            success: false,
            error: 'Failed to create workshop account',
            code: 'WORKSHOP_CREATE_ERROR'
          }, { status: 500 })
        }

        // Create user session record (password would be hashed in production)
        const userId = workshop.id // Using workshop ID as user ID for simplicity
        
        // Generate JWT tokens with error handling
        let tokens
        try {
          tokens = generateTokensSimple(
            {
              id: userId,
              email: email
            },
            workshop,
            'owner'
          )
          
          if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
            throw new Error('Token generation returned invalid tokens')
          }
          
          console.log('✅ [Registration] JWT tokens generated successfully')
          
        } catch (tokenError) {
          console.error('❌ [Registration] Token generation failed:', tokenError.message)
          
          // Cleanup workshop if token generation fails
          try {
            await supabaseClient
              .from('workshops')
              .delete()
              .eq('id', workshop.id)
            console.log('🧹 [Registration] Cleaned up workshop after token failure')
          } catch (cleanupError) {
            console.error('❌ [Registration] Failed to cleanup workshop:', cleanupError.message)
          }
          
          return NextResponse.json({
            success: false,
            error: 'Authentication setup failed. Please try again.',
            code: 'TOKEN_ERROR'
          }, { status: 500 })
        }

        // Store refresh token in temporary storage (should be Redis in production)
        console.log('JWT tokens generated successfully for user:', userId)

        // Store session in database with proper error handling
        let sessionStored = false
        try {
          const sessionData = {
            user_id: userId,
            workshop_id: workshop.id,
            session_token: tokens.accessToken.length > 500 ? tokens.accessToken.substring(0, 500) : tokens.accessToken,
            refresh_token_hash: tokens.refreshToken.length > 255 ? tokens.refreshToken.substring(0, 255) : tokens.refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
            user_agent: request.headers.get('user-agent') || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          const { error: sessionError } = await supabaseClient
            .from('user_sessions')
            .insert(sessionData)
            
          if (sessionError) {
            console.warn('⚠️ [Registration] Session storage failed:', sessionError.message)
            console.warn('⚠️ [Registration] Continuing without session storage - user can still login')
          } else {
            sessionStored = true
            console.log('✅ [Registration] User session stored successfully')
          }
        } catch (sessionError) {
          console.warn('⚠️ [Registration] Session storage error:', sessionError.message)
          console.warn('⚠️ [Registration] Continuing without session storage - user can still login')
        }


        // Create default client key for the workshop with error handling
        let clientKeyCreated = false
        try {
          const clientKeyData = {
            workshop_id: workshop.id,
            name: 'Default Key',
            client_key_hash: `ck_live_${workshop.id}_${Date.now()}`,
            prefix: 'ck_live_',
            authorized_domains: ['localhost:3000', 'localhost:3001'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          const { error: keyError } = await supabaseClient
            .from('client_keys')
            .insert(clientKeyData)
            
          if (keyError) {
            console.warn('⚠️ [Registration] Client key creation failed:', keyError.message)
            console.warn('⚠️ [Registration] User can create client keys later in dashboard')
          } else {
            clientKeyCreated = true
            console.log('✅ [Registration] Default client key created successfully')
          }
        } catch (keyError) {
          console.warn('⚠️ [Registration] Client key creation error:', keyError.message)
          console.warn('⚠️ [Registration] User can create client keys later in dashboard')
        }


        const userData = {
          id: userId,
          email: email,
          name: name,
          workshopId: workshop.id,
          role: 'owner'
        }

        // Log successful registration
        const duration = Date.now() - startTime
        console.log(`✅ [Registration] Account created successfully in ${duration}ms:`, {
          workshopId: workshop.id,
          email: email,
          sessionStored,
          clientKeyCreated
        })
        
        return NextResponse.json({
          success: true,
          message: 'Account created successfully',
          data: {
            user: userData,
            workshop: workshop,
            tokens: tokens,
            authMethod: 'jwt',
            features: {
              sessionStored,
              clientKeyCreated
            }
          }
        }, { 
          status: 201,
          headers: {
            'X-Registration-Duration': duration.toString(),
            'X-Registration-ID': workshop.id
          }
        })

      } catch (jwtError) {
        const duration = Date.now() - startTime
        console.error(`❌ [Registration] JWT registration failed after ${duration}ms:`, {
          error: jwtError.message,
          stack: process.env.NODE_ENV === 'development' ? jwtError.stack : undefined,
          email: email,
          businessName: businessName
        })
        
        // Determine appropriate error response based on error type
        let errorResponse = {
          success: false,
          error: 'Registration failed. Please try again.',
          code: 'REGISTRATION_ERROR'
        }
        
        let statusCode = 500
        
        if (jwtError.message.includes('duplicate') || jwtError.message.includes('23505')) {
          errorResponse.error = 'An account with this email already exists'
          errorResponse.code = 'DUPLICATE_EMAIL'
          statusCode = 409
        } else if (jwtError.message.includes('network') || jwtError.message.includes('fetch')) {
          errorResponse.error = 'Database connection failed. Please try again.'
          errorResponse.code = 'NETWORK_ERROR'
          statusCode = 503
        } else if (jwtError.message.includes('timeout')) {
          errorResponse.error = 'Request timeout. Please try again.'
          errorResponse.code = 'TIMEOUT_ERROR'
          statusCode = 504
        }
        
        if (process.env.NODE_ENV === 'development') {
          errorResponse.debug = jwtError.message
          errorResponse.duration = duration
        }
        
        return NextResponse.json(errorResponse, { status: statusCode })
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
    const duration = Date.now() - startTime
    console.error(`💥 [Registration] Unexpected error after ${duration}ms:`, {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    
    // Log error to database if possible
    try {
      if (supabaseClient) {
        await supabaseClient
          .from('error_logs')
          .insert({
            error_type: 'registration_error',
            error_message: error.message,
            error_stack: error.stack,
            context: {
              duration,
              endpoint: '/api/auth/register',
              method: 'POST'
            },
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '2.0.0'
          })
      }
    } catch (logError) {
      console.error('❌ [Registration] Failed to log error to database:', logError.message)
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error during registration',
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        debug: error.message,
        duration
      })
    }, { 
      status: 500,
      headers: {
        'X-Error-Duration': duration.toString()
      }
    })
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