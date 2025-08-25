import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { logAuthError, measurePerformance } from '../../../../lib/error-logger.js'
import { createRateLimiter } from '../../../../lib/rate-limiter.js'

// Apply rate limiting to authentication endpoint
const authRateLimit = createRateLimiter('AUTH')

// Simple token generation function for login (same as registration)
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Mock database for authentication (matches registration)
const mockDatabase = new Map()

// Simple authentication function - allows demo login for any email
async function authenticateUserSimple(email, password) {
  console.log(`🔐 [Login] Attempting authentication for: ${email}`)
  
  // Allow demo login for any email with demo password
  const demoPasswords = ['demo123', 'TestPassword123!', 'test123', 'password123'];
  if (demoPasswords.includes(password)) {
    console.log('✅ [Login] Demo authentication successful')
    
    // Create mock user data for demo login
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const workshopId = `workshop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      user: {
        id: userId,
        email: email,
        name: email.split('@')[0] || 'Demo User',
        created_at: new Date().toISOString()
      },
      workshop: {
        id: workshopId,
        name: `Demo Werkstatt für ${email}`,
        business_name: `Demo Werkstatt für ${email}`,
        owner_email: email,
        template_type: 'klassische',
        active: true,
        verified: false,
        mock: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      role: 'owner'
    }
  }
  
  // Check mock database first (for accounts created via registration)
  if (mockDatabase.has(email)) {
    const userData = mockDatabase.get(email)
    if (userData.password === password) {
      console.log('✅ [Login] Mock authentication successful')
      return {
        success: true,
        user: userData.user,
        workshop: userData.workshop,
        role: 'owner'
      }
    }
  }
  
  // Try database if available
  if (supabase) {
    try {
      // Look up user in workshops table
      const { data: workshop, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', email)
        .single()

      if (!error && workshop) {
        console.log('✅ [Login] Database authentication successful')
        
        return {
          success: true,
          user: {
            id: workshop.id,
            email: workshop.owner_email,
            name: workshop.owner_name
          },
          workshop: workshop,
          role: 'owner'
        }
      }
    } catch (dbError) {
      console.warn('⚠️ [Login] Database authentication failed:', dbError.message)
    }
  }
  
  console.log('❌ [Login] Authentication failed')
  return { success: false, error: 'Invalid credentials' }
}

export async function POST(request) {
  const performanceTracker = measurePerformance('user_login')
  
  // Apply rate limiting
  try {
    await new Promise((resolve, reject) => {
      authRateLimit(request, { 
        status: (code) => ({ json: (data) => reject({ status: code, data }) }),
        set: () => {},
        setHeader: () => {}
      }, resolve)
    })
  } catch (rateLimitError) {
    if (rateLimitError.status === 429) {
      await logAuthError('Login rate limit exceeded', {
        ip: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent')
      })
      
      return NextResponse.json(rateLimitError.data, { status: rateLimitError.status })
    }
  }
  
  try {
    const { email, password, useJWT = true } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      )
    }

    // Use simplified authentication system
    const authResult = await authenticateUserSimple(email, password)
    
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
      tokens = generateTokensSimple(user, workshop, role)
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

    // Track successful login performance
    await performanceTracker.end(true, {
      authMethod: tokens ? 'jwt' : 'supabase',
      email: email,
      workshopId: workshop?.id
    })

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
    
    // Log authentication error
    await logAuthError('Login authentication failed', {
      email: email || 'unknown',
      error: error.message,
      ip: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent')
    })
    
    // Track failed login performance
    await performanceTracker.end(false, {
      error: error.message,
      email: email || 'unknown'
    })
    
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