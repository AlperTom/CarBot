import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client for middleware
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Security headers to add to all responses
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block'
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map()

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/analytics',
  '/cases',
  '/settings',
  '/profile',
  '/workshop',
  '/api/leads',
  '/api/analytics',
  '/api/webhooks',
  '/billing'
]

// Public routes that should redirect authenticated users
const publicRoutes = [
  '/auth/login',
  '/auth/register'
]

// Routes that require specific roles
const roleBasedRoutes = {
  '/admin': ['owner', 'admin'],
  '/api/admin': ['owner', 'admin'],
  '/workshop/settings': ['owner'],
  '/workshop/users': ['owner', 'admin'],
  '/dashboard/settings': ['owner', 'admin'],
  '/dashboard/billing': ['owner'],
  '/api/stripe': ['owner'],
  '/api/webhooks/admin': ['owner', 'admin']
}

// Rate-limited routes (requests per minute)
const rateLimitedRoutes = {
  '/api/auth': 10,
  '/api/leads': 30,
  '/auth/login': 5,
  '/auth/register': 3,
  '/auth/forgot-password': 3
}

// Sensitive routes that require additional verification
const sensitiveRoutes = [
  '/dashboard/billing',
  '/dashboard/settings',
  '/api/stripe',
  '/workshop/settings'
]

// Helper function to check if route is protected
function isProtectedRoute(pathname) {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

// Helper function to check if route is public (auth pages)
function isPublicRoute(pathname) {
  return publicRoutes.some(route => pathname.startsWith(route))
}

// Helper function to check role-based access
function checkRoleAccess(pathname, userRole) {
  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole)
    }
  }
  return true // No specific role required
}

// Rate limiting helper
function checkRateLimit(request, pathname) {
  const clientIP = getClientIP(request)
  const routeKey = Object.keys(rateLimitedRoutes).find(route => pathname.startsWith(route))
  
  if (!routeKey) return { allowed: true }
  
  const limit = rateLimitedRoutes[routeKey]
  const key = `${clientIP}:${routeKey}`
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [])
  }
  
  const attempts = rateLimitStore.get(key)
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < windowMs)
  
  if (recentAttempts.length >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
    }
  }
  
  // Add current attempt
  recentAttempts.push(now)
  rateLimitStore.set(key, recentAttempts)
  
  return { allowed: true, remaining: limit - recentAttempts.length }
}

// Get client IP helper
function getClientIP(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  return cfConnectingIP || forwardedFor?.split(',')[0] || realIP || 'unknown'
}

// Check if route is sensitive
function isSensitiveRoute(pathname) {
  return sensitiveRoutes.some(route => pathname.startsWith(route))
}

// Validate session freshness for sensitive operations
function isSessionFresh(sessionData, maxAgeMinutes = 30) {
  if (!sessionData?.timestamp) return false
  const now = Date.now()
  const sessionAge = now - sessionData.timestamp
  return sessionAge < (maxAgeMinutes * 60 * 1000)
}

// Security audit logger
async function logSecurityEvent(event, details = {}) {
  try {
    // In production, send to proper logging service
    console.log('[SECURITY]', event, details)
    
    // Could integrate with external logging service here
    // await sendToSecurityLog(event, details)
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

// Helper function to get user session and workshop data
async function getUserSessionData(request) {
  try {
    // Get session from Supabase auth
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return { user: null, workshop: null, role: null, sessionData: null }
    }

    // Create session data for validation
    const sessionData = {
      userId: session.user.id,
      timestamp: Date.now(), // Current timestamp for freshness check
      userAgent: request.headers.get('user-agent') || '',
      ip: getClientIP(request)
    }

    // Get workshop information
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .eq('owner_email', session.user.email)
      .eq('active', true)
      .single()

    if (!workshopError && workshop) {
      sessionData.workshopId = workshop.id
      return { 
        user: session.user, 
        workshop, 
        role: 'owner',
        sessionData
      }
    }

    // Check if user is an employee
    const { data: employeeData, error: employeeError } = await supabase
      .from('workshop_users')
      .select(`
        *,
        workshop:workshops(*)
      `)
      .eq('user_id', session.user.id)
      .eq('active', true)
      .single()

    if (!employeeError && employeeData) {
      sessionData.workshopId = employeeData.workshop?.id
      return { 
        user: session.user, 
        workshop: employeeData.workshop, 
        role: employeeData.role,
        sessionData
      }
    }

    // User exists but no workshop association
    return { 
      user: session.user, 
      workshop: null, 
      role: 'customer',
      sessionData
    }
  } catch (error) {
    console.error('Error getting user session data:', error)
    return { user: null, workshop: null, role: null, sessionData: null }
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  
  // Skip middleware for static files, API routes (except protected ones), and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.includes('.') ||
    (pathname.startsWith('/api/') && 
     !pathname.startsWith('/api/leads') && 
     !pathname.startsWith('/api/analytics') && 
     !pathname.startsWith('/api/admin') &&
     !pathname.startsWith('/api/auth') &&
     !pathname.startsWith('/api/stripe') &&
     !pathname.startsWith('/api/webhooks'))
  ) {
    const response = NextResponse.next()
    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // Check rate limiting
  const rateLimit = checkRateLimit(request, pathname)
  if (!rateLimit.allowed) {
    await logSecurityEvent('rate_limit_exceeded', {
      pathname,
      clientIP,
      userAgent,
      retryAfter: rateLimit.retryAfter
    })
    
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': rateLimit.retryAfter.toString(),
        ...securityHeaders
      }
    })
  }

  // Get user session and workshop data
  const { user, workshop, role, sessionData } = await getUserSessionData(request)

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!user) {
      await logSecurityEvent('unauthorized_access_attempt', {
        pathname,
        clientIP,
        userAgent
      })
      
      // Redirect to login with return URL
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user has workshop access for workshop-related routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/analytics') || pathname.startsWith('/cases')) {
      if (!workshop) {
        await logSecurityEvent('access_without_workshop', {
          pathname,
          userId: user.id,
          clientIP,
          userAgent
        })
        
        // User exists but no workshop - redirect to onboarding or error page
        const noWorkshopUrl = new URL('/auth/no-workshop', request.url)
        return NextResponse.redirect(noWorkshopUrl)
      }
    }

    // Check for sensitive routes requiring fresh session
    if (isSensitiveRoute(pathname)) {
      if (!isSessionFresh(sessionData, 30)) {
        await logSecurityEvent('stale_session_sensitive_access', {
          pathname,
          userId: user.id,
          workshopId: workshop?.id,
          clientIP,
          userAgent
        })
        
        // Redirect to login with security flag
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('returnUrl', pathname)
        loginUrl.searchParams.set('security', 'session_expired')
        return NextResponse.redirect(loginUrl)
      }
    }

    // Check role-based access
    if (!checkRoleAccess(pathname, role)) {
      await logSecurityEvent('role_access_denied', {
        pathname,
        userId: user.id,
        userRole: role,
        workshopId: workshop?.id,
        clientIP,
        userAgent
      })
      
      // User doesn't have required role - redirect to unauthorized page
      const unauthorizedUrl = new URL('/unauthorized', request.url)
      return NextResponse.redirect(unauthorizedUrl)
    }

    // Log successful access to sensitive routes
    if (isSensitiveRoute(pathname)) {
      await logSecurityEvent('sensitive_route_access', {
        pathname,
        userId: user.id,
        userRole: role,
        workshopId: workshop?.id,
        clientIP,
        userAgent
      })
    }

    // Add user and workshop data to headers for use in components
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-email', user.email)
    response.headers.set('x-client-ip', clientIP)
    
    if (workshop) {
      response.headers.set('x-workshop-id', workshop.id)
      response.headers.set('x-workshop-name', workshop.name)
    }
    if (role) {
      response.headers.set('x-user-role', role)
    }
    if (rateLimit.remaining !== undefined) {
      response.headers.set('x-ratelimit-remaining', rateLimit.remaining.toString())
    }
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  // Handle public routes (auth pages)
  if (isPublicRoute(pathname)) {
    if (user && workshop) {
      // Authenticated user with workshop - redirect to dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    if (user && !workshop && pathname !== '/auth/register') {
      // Authenticated user without workshop - allow access to registration
      const response = NextResponse.next()
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }
    
    // Add security headers to auth pages
    const response = NextResponse.next()
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // Handle root path
  if (pathname === '/') {
    if (user && workshop) {
      // Authenticated user with workshop - redirect to dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // Unauthenticated user - allow access to home page
    const response = NextResponse.next()
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // Default response with security headers
  const response = NextResponse.next()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add rate limit headers if applicable
  if (rateLimit.remaining !== undefined) {
    response.headers.set('x-ratelimit-remaining', rateLimit.remaining.toString())
  }
  
  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*|public).*)',
  ],
}