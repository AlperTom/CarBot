/**
 * TEMPORARY Mock Registration API - Database Connection Fix
 * This bypasses Supabase connection issues for immediate functionality
 * Replace with real database once credentials are configured
 */

import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

// Mock database storage (in production, this would be Redis or actual database)
const mockDatabase = new Map()

function generateMockTokens(user, workshop, role = 'owner') {
  const JWT_SECRET = process.env.JWT_SECRET || 'carbot_dev_secret_change_in_production'
  
  const payload = {
    sub: user.id,
    email: user.email,
    role,
    workshop_id: workshop?.id || null,
    workshop_name: workshop?.name || null,
    iat: Math.floor(Date.now() / 1000),
    type: 'access',
    mock: true // Flag to indicate this is a mock token
  }

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '24h',
    issuer: 'carbot-auth',
    audience: 'carbot-api'
  })

  const refreshPayload = {
    sub: user.id,
    type: 'refresh',
    jti: randomBytes(16).toString('hex'),
    mock: true
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

export async function POST(request) {
  const startTime = Date.now()
  
  try {
    console.log('🔄 [Mock Registration] Processing registration request...')
    
    const body = await request.json()
    const { 
      email, 
      password, 
      businessName, 
      name, 
      phone, 
      templateType = 'klassische' 
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

    // Check if user already exists in mock database
    if (mockDatabase.has(email)) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email already exists'
      }, { status: 409 })
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

    // Generate JWT tokens
    const tokens = generateMockTokens(user, workshop, 'owner')

    // Store in mock database
    const userData = {
      user,
      workshop,
      password: password, // In production, this would be hashed
      tokens,
      sessions: [],
      created_at: new Date().toISOString()
    }

    mockDatabase.set(email, userData)

    console.log(`✅ [Mock Registration] Account created successfully for: ${email}`)
    console.log(`✅ [Mock Registration] Workshop ID: ${workshopId}`)

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      message: 'Account created successfully (Mock Mode)',
      data: {
        user: {
          id: userId,
          email: email,
          name: name,
          workshopId: workshopId,
          role: 'owner'
        },
        workshop: workshop,
        tokens: tokens,
        authMethod: 'mock-jwt',
        features: {
          sessionStored: true,
          clientKeyCreated: true,
          mockMode: true
        }
      },
      mock: true,
      notice: 'This is a temporary demo account. Data will be lost when the server restarts.'
    }, { 
      status: 201,
      headers: {
        'X-Registration-Duration': duration.toString(),
        'X-Registration-ID': workshopId,
        'X-Mock-Mode': 'true'
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ [Mock Registration] Error after ${duration}ms:`, error.message)
    
    return NextResponse.json({
      success: false,
      error: 'Registration failed. Please try again.',
      code: 'MOCK_REGISTRATION_ERROR',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// Export mock database for testing
export { mockDatabase }