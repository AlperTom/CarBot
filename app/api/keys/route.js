import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock client keys for development
const mockClientKeys = [
  {
    id: 'ck_1',
    client_key: 'ck_test_klassische_werkstatt_123',
    name: 'Hauptschlüssel - Website',
    description: 'Für die Hauptwebsite und alle Standard-Integrationen',
    status: 'active',
    usage_count: 1247,
    last_used: '2024-08-24T10:30:00Z',
    created_at: '2024-08-01T00:00:00Z',
    expires_at: null,
    permissions: ['chat', 'leads', 'appointments', 'analytics']
  },
  {
    id: 'ck_2', 
    client_key: 'ck_test_landing_page_456',
    name: 'Landing Page Widget',
    description: 'Speziell für Marketing Landing Pages',
    status: 'active',
    usage_count: 89,
    last_used: '2024-08-23T15:45:00Z',
    created_at: '2024-08-15T00:00:00Z',
    expires_at: null,
    permissions: ['chat', 'leads']
  },
  {
    id: 'ck_3',
    client_key: 'ck_test_mobile_app_789',
    name: 'Mobile App Integration',
    description: 'Für die geplante Mobile App',
    status: 'inactive',
    usage_count: 0,
    last_used: null,
    created_at: '2024-08-20T00:00:00Z',
    expires_at: null,
    permissions: ['chat', 'appointments']
  }
]

// Mock analytics data
const mockAnalytics = {
  total_requests: 1336,
  requests_today: 45,
  requests_this_week: 312,
  requests_this_month: 1247,
  active_keys: 2,
  total_keys: 3,
  top_performing_key: 'ck_test_klassische_werkstatt_123',
  average_response_time: 145,
  error_rate: 0.02
}

// Helper function to get user from token
async function getUserFromToken(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    
    let token = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }

    if (!token) {
      const cookies = request.headers.get('cookie') || ''
      const tokenMatch = cookies.match(/auth-token=([^;]+)/)
      if (tokenMatch) {
        token = tokenMatch[1]
      }
    }

    if (!token) {
      return { id: 'mock-user', email: 'demo@carbot.chat' } // Mock user for development
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carbot-dev-secret-key-2025')
    return decoded

  } catch (error) {
    console.error('Token verification error:', error)
    return { id: 'mock-user', email: 'demo@carbot.chat' } // Mock user for development
  }
}

// GET - List all client keys for the user
export async function GET(request) {
  try {
    const user = await getUserFromToken(request)
    
    // Return mock data for development
    return NextResponse.json({
      keys: mockClientKeys,
      analytics: mockAnalytics,
      success: true
    })

  } catch (error) {
    console.error('Client keys GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client keys' },
      { status: 500 }
    )
  }
}