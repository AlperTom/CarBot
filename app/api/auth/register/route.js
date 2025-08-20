/**
 * User Registration API - Account Creation for CarBot
 * MVP Critical Component - Enables new user signups
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseConnectionManager } from '../../../../lib/supabase-connection-manager.js'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { sendWelcomeEmail, sendEmailConfirmation } from '../../../../lib/email.js'
import { logAuthError, logEmailError, measurePerformance } from '../../../../lib/error-logger.js'
import { createRateLimiter } from '../../../../lib/rate-limiter.js'
import { sanitizeInput } from '../../../../lib/security-headers.js'

// Apply rate limiting to registration endpoint
const registrationRateLimit = createRateLimiter('REGISTER')

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

// Mock database for fallback mode
const mockDatabase = new Map()

// Initialize Supabase client with error handling and mock fallback
function initializeSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('🔍 [Registration] Checking Supabase credentials...')
  console.log('🔍 [Registration] URL:', supabaseUrl ? 'Present' : 'Missing')
  console.log('🔍 [Registration] Service Key:', supabaseServiceKey ? 'Present (first 10 chars: ' + supabaseServiceKey.substring(0, 10) + '...)' : 'Missing')

  // Check for placeholder values that indicate missing configuration
  const hasPlaceholderKey = !supabaseServiceKey ||
                           supabaseServiceKey.includes('your-production-supabase') || 
                           supabaseServiceKey.includes('placeholder') ||
                           supabaseServiceKey.includes('your_') ||
                           supabaseServiceKey.length < 50 // Real Supabase service keys are much longer
  
  const hasPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('placeholder')

  if (hasPlaceholderKey || hasPlaceholderUrl) {
    console.warn('⚠️ [Registration] Supabase credentials not properly configured, using mock mode')
    console.warn('⚠️ [Registration] Placeholder key detected:', hasPlaceholderKey)
    console.warn('⚠️ [Registration] Placeholder URL detected:', hasPlaceholderUrl)
    return null // Return null to indicate mock mode should be used
  }

  try {
    // Test if we can create a client successfully
    const client = createClient(supabaseUrl, supabaseServiceKey, {
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

    console.log('✅ [Registration] Supabase client created successfully')
    return client
  } catch (error) {
    console.warn('⚠️ [Registration] Failed to create Supabase client:', error.message)
    console.warn('⚠️ [Registration] Falling back to mock mode')
    return null
  }
}

// Mock registration function
async function handleMockRegistration(email, password, businessName, name, phone, templateType) {
  console.log('🔄 [Mock Registration] Processing registration in mock mode...')
  
  // Check if user already exists in mock database
  if (mockDatabase.has(email)) {
    throw new Error('DUPLICATE_EMAIL')
  }

  // Create mock user and workshop data
  const workshopId = `workshop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const workshop = {
    id: workshopId,
    business_name: businessName,
    name: businessName,
    owner_email: email,
    phone: phone || null,
    template_type: templateType,
    active: true,
    verified: false,
    mock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const user = {
    id: userId,
    email: email,
    name: name,
    workshop_id: workshopId,
    mock: true,
    created_at: new Date().toISOString()
  }

  // Generate JWT tokens with mock flag
  const mockTokens = generateTokensSimple(user, workshop, 'owner')
  // Add mock flag to tokens
  mockTokens.mock = true

  // Store in mock database
  const userData = {
    user,
    workshop,
    password: password, // In production, this would be hashed
    tokens: mockTokens,
    sessions: [],
    created_at: new Date().toISOString()
  }

  mockDatabase.set(email, userData)

  console.log(`✅ [Mock Registration] Mock account created: ${email}`)

  return {
    user: {
      id: userId,
      email: email,
      name: name,
      workshopId: workshopId,
      role: 'owner'
    },
    workshop: workshop,
    tokens: mockTokens,
    authMethod: 'mock-jwt',
    features: {
      sessionStored: true,
      clientKeyCreated: true,
      mockMode: true
    }
  }
}

let supabase = null
try {
  supabase = initializeSupabase()
} catch (error) {
  console.warn('⚠️ [Registration] Supabase initialization failed, mock mode will be used')
}

export async function POST(request) {
  const startTime = Date.now()
  const performanceTracker = measurePerformance('user_registration')
  let supabaseConnection = null
  let useMockMode = false
  
  // Apply rate limiting
  try {
    await new Promise((resolve, reject) => {
      registrationRateLimit(request, { 
        status: (code) => ({ json: (data) => reject({ status: code, data }) }),
        set: () => {},
        setHeader: () => {}
      }, resolve)
    })
  } catch (rateLimitError) {
    if (rateLimitError.status === 429) {
      await logAuthError('Registration rate limit exceeded', {
        ip: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent')
      })
      
      return NextResponse.json(rateLimitError.data, { status: rateLimitError.status })
    }
  }
  
  try {
    // Try to establish database connection with enhanced retry logic
    console.log('🔄 [Registration] Establishing database connection...')
    
    if (!supabase) {
      console.log('🔄 [Registration] Supabase not initialized, using mock mode')
      useMockMode = true
    } else {
      console.log('✅ [Registration] Supabase client available')
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

    // Handle mock mode registration
    if (useMockMode) {
      try {
        const mockResult = await handleMockRegistration(email, password, businessName, name, phone, templateType)
        const duration = Date.now() - startTime
        
        console.log(`✅ [Mock Registration] Account created in ${duration}ms for: ${email}`)

        // Send welcome email (async - don't wait for it)
        try {
          console.log('📧 [Mock Registration] Sending welcome email...')
          sendWelcomeEmail({
            email: email,
            workshopName: businessName,
            ownerName: name
          }).then(emailResult => {
            if (emailResult.success) {
              console.log('✅ [Mock Registration] Welcome email sent successfully:', emailResult.id)
            } else {
              console.warn('⚠️ [Mock Registration] Welcome email failed:', emailResult.error)
            }
          }).catch(emailError => {
            console.warn('⚠️ [Mock Registration] Welcome email error:', emailError.message)
          })
        } catch (emailError) {
          console.warn('⚠️ [Mock Registration] Email sending failed:', emailError.message)
        }
        
        return NextResponse.json({
          success: true,
          message: 'Account created successfully (Demo Mode)',
          data: mockResult,
          mock: true,
          notice: 'This is a demo account. Data will be reset periodically.'
        }, { 
          status: 201,
          headers: {
            'X-Registration-Duration': duration.toString(),
            'X-Registration-ID': mockResult.workshop.id,
            'X-Mock-Mode': 'true'
          }
        })
        
      } catch (mockError) {
        if (mockError.message === 'DUPLICATE_EMAIL') {
          return NextResponse.json({
            success: false,
            error: 'An account with this email already exists'
          }, { status: 409 })
        }
        
        console.error('❌ [Mock Registration] Error:', mockError.message)
        return NextResponse.json({
          success: false,
          error: 'Registration failed. Please try again.',
          code: 'MOCK_REGISTRATION_ERROR'
        }, { status: 500 })
      }
    }

    // Check if user already exists with enhanced retry mechanism
    let existingUser = null
    if (!useMockMode && supabase) {
      try {
        const { data, error } = await supabase
          .from('workshops')
          .select('id, owner_email')
          .eq('owner_email', email)
          .maybeSingle()
        
        if (error && error.code !== 'PGRST116') {
          throw error
        }
        
        existingUser = data
        console.log('✅ [Registration] User existence check completed')
        
      } catch (checkError) {
        console.warn('⚠️ [Registration] User existence check failed, switching to mock mode:', checkError.message)
        useMockMode = true
      }
    }

    // If we switched to mock mode due to database issues, handle it here
    if (useMockMode) {
      try {
        const mockResult = await handleMockRegistration(email, password, businessName, name, phone, templateType)
        const duration = Date.now() - startTime
        
        console.log(`✅ [Mock Registration] Account created in ${duration}ms for: ${email} (switched due to DB failure)`)

        // Send welcome email (async - don't wait for it)
        try {
          console.log('📧 [Mock Registration] Sending welcome email...')
          sendWelcomeEmail({
            email: email,
            workshopName: businessName,
            ownerName: name
          }).then(emailResult => {
            if (emailResult.success) {
              console.log('✅ [Mock Registration] Welcome email sent successfully:', emailResult.id)
            } else {
              console.warn('⚠️ [Mock Registration] Welcome email failed:', emailResult.error)
            }
          }).catch(emailError => {
            console.warn('⚠️ [Mock Registration] Welcome email error:', emailError.message)
          })
        } catch (emailError) {
          console.warn('⚠️ [Mock Registration] Email sending failed:', emailError.message)
        }
        
        return NextResponse.json({
          success: true,
          message: 'Account created successfully (Demo Mode - Database Fallback)',
          data: mockResult,
          mock: true,
          notice: 'This is a demo account created due to database connectivity issues. Data will be reset periodically.'
        }, { 
          status: 201,
          headers: {
            'X-Registration-Duration': duration.toString(),
            'X-Registration-ID': mockResult.workshop.id,
            'X-Mock-Mode': 'true',
            'X-Mock-Reason': 'database-fallback'
          }
        })
        
      } catch (mockError) {
        if (mockError.message === 'DUPLICATE_EMAIL') {
          return NextResponse.json({
            success: false,
            error: 'An account with this email already exists'
          }, { status: 409 })
        }
        
        console.error('❌ [Mock Registration] Error:', mockError.message)
        return NextResponse.json({
          success: false,
          error: 'Registration failed. Please try again.',
          code: 'MOCK_REGISTRATION_ERROR'
        }, { status: 500 })
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
        // Create workshop record with enhanced retry logic
        const { data: workshop, error: workshopError } = await supabase
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
          
        if (workshopError) {
          if (workshopError.code === '23505') { // Unique constraint violation
            throw new Error('DUPLICATE_EMAIL')
          }
          throw workshopError
        }
        
        console.log('✅ [Registration] Workshop created successfully:', workshop.id)

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
            await supabase
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

        // Store session in database with enhanced error handling
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
          
          const { error: sessionError } = await supabase
            .from('user_sessions')
            .insert(sessionData)
            
          if (sessionError) {
            throw sessionError
          }
          
          sessionStored = true
          console.log('✅ [Registration] User session stored successfully')
          
        } catch (sessionError) {
          console.warn('⚠️ [Registration] Session storage error:', sessionError.message)
          console.warn('⚠️ [Registration] Continuing without session storage - user can still login')
        }


        // Create default client key for the workshop with enhanced error handling
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
          
          const { error: keyError } = await supabase
            .from('client_keys')
            .insert(clientKeyData)
            
          if (keyError) {
            throw keyError
          }
          
          clientKeyCreated = true
          console.log('✅ [Registration] Default client key created successfully')
          
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

        // Send welcome email (async - don't wait for it)
        try {
          console.log('📧 [Registration] Sending welcome email...')
          sendWelcomeEmail({
            email: email,
            workshopName: businessName,
            ownerName: name
          }).then(emailResult => {
            if (emailResult.success) {
              console.log('✅ [Registration] Welcome email sent successfully:', emailResult.id)
            } else {
              console.warn('⚠️ [Registration] Welcome email failed:', emailResult.error)
              logEmailError('Welcome email delivery failed', {
                email: email,
                workshopName: businessName,
                error: emailResult.error
              })
            }
          }).catch(emailError => {
            console.warn('⚠️ [Registration] Welcome email error:', emailError.message)
            logEmailError('Welcome email error', {
              email: email,
              workshopName: businessName,
              error: emailError.message
            })
          })
        } catch (emailError) {
          console.warn('⚠️ [Registration] Email sending failed:', emailError.message)
          logEmailError('Email system error', {
            email: email,
            error: emailError.message
          })
        }
        
        // Track performance
        await performanceTracker.end(true, {
          registrationType: 'jwt',
          emailSent: true,
          workshopId: workshop.id
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
        
        // If it's a duplicate email error, handle it specifically
        if (jwtError.message === 'DUPLICATE_EMAIL') {
          return NextResponse.json({
            success: false,
            error: 'An account with this email already exists',
            code: 'DUPLICATE_EMAIL'
          }, { status: 409 })
        }
        
        // For other database errors, try mock mode as fallback
        if (jwtError.message.includes('network') || jwtError.message.includes('fetch') || jwtError.message.includes('connection')) {
          console.log('🔄 [Registration] Database error detected, attempting mock mode fallback')
          
          try {
            const mockResult = await handleMockRegistration(email, password, businessName, name, phone, templateType)
            const mockDuration = Date.now() - startTime
            
            console.log(`✅ [Mock Registration] Account created in ${mockDuration}ms for: ${email} (database fallback)`)

            // Send welcome email (async - don't wait for it)
            try {
              console.log('📧 [Mock Registration] Sending welcome email...')
              sendWelcomeEmail({
                email: email,
                workshopName: businessName,
                ownerName: name
              }).then(emailResult => {
                if (emailResult.success) {
                  console.log('✅ [Mock Registration] Welcome email sent successfully:', emailResult.id)
                } else {
                  console.warn('⚠️ [Mock Registration] Welcome email failed:', emailResult.error)
                }
              }).catch(emailError => {
                console.warn('⚠️ [Mock Registration] Welcome email error:', emailError.message)
              })
            } catch (emailError) {
              console.warn('⚠️ [Mock Registration] Email sending failed:', emailError.message)
            }
            
            return NextResponse.json({
              success: true,
              message: 'Account created successfully (Demo Mode - Database Fallback)',
              data: mockResult,
              mock: true,
              notice: 'This is a demo account created due to database connectivity issues. Data will be reset periodically.'
            }, { 
              status: 201,
              headers: {
                'X-Registration-Duration': mockDuration.toString(),
                'X-Registration-ID': mockResult.workshop.id,
                'X-Mock-Mode': 'true',
                'X-Mock-Reason': 'database-error-fallback'
              }
            })
            
          } catch (fallbackError) {
            console.error('❌ [Registration] Mock fallback also failed:', fallbackError.message)
          }
        }
        
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
      if (supabase) {
        await supabase
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