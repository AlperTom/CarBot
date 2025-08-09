/**
 * JWT Token Refresh Endpoint
 * Handles refresh token validation and new access token generation
 */

import { NextResponse } from 'next/server'
import { refreshAccessToken, verifyToken } from '../../../../lib/jwt-auth.js'

export async function POST(request) {
  try {
    const { refreshToken } = await request.json()

    // Validate required fields
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token ist erforderlich.' },
        { status: 400 }
      )
    }

    // Verify and refresh the token
    const newTokens = await refreshAccessToken(refreshToken)

    if (!newTokens) {
      return NextResponse.json(
        { error: 'Ungültiger oder abgelaufener Refresh Token.' },
        { status: 401 }
      )
    }

    // Log successful refresh
    console.log(`Token refreshed for user: ${verifyToken(newTokens.accessToken)?.sub}`)

    return NextResponse.json({
      success: true,
      data: {
        tokens: newTokens,
        message: 'Token erfolgreich erneuert.'
      }
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erneuern des Tokens.' },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}