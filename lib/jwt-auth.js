/**
 * JWT Authentication System - Enhanced JWT handling for CarBot
 * Provides JWT token management with fallback for non-Supabase setups
 */

import jwt from 'jsonwebtoken'
import { createHash, randomBytes } from 'crypto'

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'carbot_dev_secret_change_in_production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'

// In-memory storage for development (replace with Redis/database in production)
const refreshTokens = new Map()
const blacklistedTokens = new Set()

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @param {Object} workshop - Workshop object  
 * @param {string} role - User role
 * @returns {Object} Token data
 */
export function generateTokens(user, workshop = null, role = 'customer') {
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
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'carbot-auth',
    audience: 'carbot-api'
  })

  // Generate refresh token
  const refreshPayload = {
    sub: user.id,
    type: 'refresh',
    jti: randomBytes(16).toString('hex') // unique token ID
  }

  const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'carbot-auth',
    audience: 'carbot-api'
  })

  // Store refresh token
  refreshTokens.set(refreshPayload.jti, {
    userId: user.id,
    token: refreshToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN,
    tokenType: 'Bearer'
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token or null
 */
export function verifyToken(token) {
  try {
    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      throw new Error('Token is blacklisted')
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'carbot-auth',
      audience: 'carbot-api'
    })

    return decoded
  } catch (error) {
    console.warn('Token verification failed:', error.message)
    return null
  }
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New token data or null
 */
export async function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET, {
      issuer: 'carbot-auth',
      audience: 'carbot-api'
    })

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type')
    }

    // Check if refresh token exists and is valid
    const storedToken = refreshTokens.get(decoded.jti)
    if (!storedToken || storedToken.token !== refreshToken) {
      throw new Error('Refresh token not found')
    }

    if (storedToken.expiresAt < new Date()) {
      refreshTokens.delete(decoded.jti)
      throw new Error('Refresh token expired')
    }

    // Get user data (this would come from database in production)
    const userData = await getUserById(decoded.sub)
    if (!userData) {
      throw new Error('User not found')
    }

    // Generate new tokens
    const newTokens = generateTokens(
      userData.user, 
      userData.workshop, 
      userData.role
    )

    // Remove old refresh token
    refreshTokens.delete(decoded.jti)

    return newTokens

  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

/**
 * Blacklist a token (logout)
 * @param {string} token - Token to blacklist
 */
export function blacklistToken(token) {
  blacklistedTokens.add(token)
  
  // Clean up old blacklisted tokens periodically
  if (blacklistedTokens.size > 1000) {
    // In production, implement proper cleanup with expiration times
    const tokensToKeep = Array.from(blacklistedTokens).slice(-500)
    blacklistedTokens.clear()
    tokensToKeep.forEach(t => blacklistedTokens.add(t))
  }
}

/**
 * Revoke refresh token
 * @param {string} refreshToken - Refresh token to revoke
 */
export function revokeRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET)
    if (decoded.jti) {
      refreshTokens.delete(decoded.jti)
    }
  } catch (error) {
    console.warn('Failed to revoke refresh token:', error)
  }
}

/**
 * Create password hash
 * @param {string} password - Plain password
 * @returns {string} Hashed password
 */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(password + salt).digest('hex')
  return `${salt}:${hash}`
}

/**
 * Verify password against hash
 * @param {string} password - Plain password
 * @param {string} hashedPassword - Stored hash
 * @returns {boolean} Password is valid
 */
export function verifyPassword(password, hashedPassword) {
  try {
    const [salt, hash] = hashedPassword.split(':')
    const newHash = createHash('sha256').update(password + salt).digest('hex')
    return hash === newHash
  } catch (error) {
    return false
  }
}

/**
 * Mock user data for development (replace with database calls)
 */
const mockUsers = new Map([
  ['user_klassische_001', {
    user: {
      id: 'user_klassische_001',
      email: 'info@klassische-werkstatt.de',
      name: 'Hans Müller',
      created_at: '2024-01-01T00:00:00Z'
    },
    workshop: {
      id: 'ws_klassische_001',
      name: 'Klassische Autowerkstatt Müller',
      businessName: 'Klassische Autowerkstatt Müller',
      templateType: 'klassische'
    },
    role: 'owner'
  }],
  ['user_moderne_002', {
    user: {
      id: 'user_moderne_002',
      email: 'info@moderntech-auto.de',
      name: 'Maria Schmidt',
      created_at: '2024-01-01T00:00:00Z'
    },
    workshop: {
      id: 'ws_moderne_002',
      name: 'ModernTech Autowerkstatt',
      businessName: 'ModernTech Autowerkstatt',
      templateType: 'moderne'
    },
    role: 'owner'
  }]
])

/**
 * Get user by ID (mock implementation)
 * @param {string} userId - User ID
 * @returns {Object} User data or null
 */
export async function getUserById(userId) {
  // In development, use mock data
  if (process.env.NODE_ENV === 'development') {
    return mockUsers.get(userId) || null
  }

  // In production, query from database
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Get user data from Supabase
      const { data: user } = await supabase.auth.admin.getUserById(userId)
      if (!user?.user) return null

      // Get workshop information
      let workshop = null
      let role = 'customer'

      // Check if user is workshop owner
      const { data: ownerWorkshop } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.user.email)
        .eq('active', true)
        .single()

      if (ownerWorkshop) {
        workshop = ownerWorkshop
        role = 'owner'
      } else {
        // Check if user is employee
        const { data: employeeData } = await supabase
          .from('workshop_users')
          .select(`
            *,
            workshop:workshops(*)
          `)
          .eq('user_id', userId)
          .eq('active', true)
          .single()

        if (employeeData) {
          workshop = employeeData.workshop
          role = employeeData.role
        }
      }

      return {
        user: user.user,
        workshop,
        role
      }
    }
  } catch (error) {
    console.error('Failed to get user data:', error)
  }

  return null
}

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Authentication result
 */
export async function authenticateUser(email, password) {
  try {
    // In development, use simple mock authentication
    if (process.env.NODE_ENV === 'development') {
      const mockUser = Array.from(mockUsers.values()).find(
        userData => userData.user.email === email
      )
      
      if (mockUser && password === 'demo123') {
        return {
          success: true,
          user: mockUser.user,
          workshop: mockUser.workshop,
          role: mockUser.role
        }
      }
      
      return { success: false, error: 'Invalid credentials' }
    }

    // In production, use Supabase authentication
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error || !authData.user) {
        return { success: false, error: error?.message || 'Authentication failed' }
      }

      // Get user data including workshop
      const userData = await getUserById(authData.user.id)
      if (!userData) {
        return { success: false, error: 'User data not found' }
      }

      return {
        success: true,
        user: userData.user,
        workshop: userData.workshop,
        role: userData.role,
        session: authData.session
      }
    }

    return { success: false, error: 'Authentication service not configured' }

  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

/**
 * Middleware function to verify JWT tokens
 * @param {Function} handler - Next.js API handler
 * @returns {Function} Wrapped handler with auth
 */
export function withAuth(handler) {
  return async (request, context = {}) => {
    try {
      const authHeader = request.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No authorization token provided'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const token = authHeader.split(' ')[1]
      const decoded = verifyToken(token)

      if (!decoded) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid or expired token'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Add user data to request context
      const userData = await getUserById(decoded.sub)
      if (!userData) {
        return new Response(JSON.stringify({
          success: false,
          error: 'User not found'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Call original handler with user context
      return handler(request, {
        ...context,
        user: userData.user,
        workshop: userData.workshop,
        role: userData.role,
        token: decoded
      })

    } catch (error) {
      console.error('Auth middleware error:', error)
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

/**
 * Clean up expired tokens periodically
 */
export function cleanupExpiredTokens() {
  const now = new Date()
  
  // Clean up expired refresh tokens
  for (const [jti, tokenData] of refreshTokens.entries()) {
    if (tokenData.expiresAt < now) {
      refreshTokens.delete(jti)
    }
  }
  
  console.log(`Cleaned up tokens. Active refresh tokens: ${refreshTokens.size}`)
}

// Auto-cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000)
}