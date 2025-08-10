import { NextResponse } from 'next/server';
import { securityHeaders, rateLimiter } from './lib/security';

export async function middleware(request) {
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Enhanced rate limiting for sensitive endpoints
  const sensitiveEndpoints = [
    '/api/auth/',
    '/api/stripe/',
    '/api/chat',
    '/api/leads'
  ];
  
  const isSensitiveEndpoint = sensitiveEndpoints.some(endpoint => 
    request.nextUrl.pathname.startsWith(endpoint)
  );
  
  if (isSensitiveEndpoint) {
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Different limits for different endpoints
    let limit = 100;
    let windowMs = 60000; // 1 minute
    
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      limit = 10; // Stricter for auth endpoints
      windowMs = 60000;
    } else if (request.nextUrl.pathname.startsWith('/api/chat')) {
      limit = 50; // Moderate for chat
      windowMs = 60000;
    }
    
    const rateLimitResult = await rateLimiter.checkRateLimit(
      `${ip}:${request.nextUrl.pathname}`, 
      limit, 
      windowMs
    );
    
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - new Date()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - new Date()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.total.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toISOString()
          }
        }
      );
    }
    
    // Add rate limit headers to successful requests
    response.headers.set('X-RateLimit-Limit', rateLimitResult.total.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toISOString());
  }
  
  // GDPR compliance headers for EU requests
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  if (acceptLanguage.includes('de') || acceptLanguage.includes('en-GB')) {
    response.headers.set('X-GDPR-Required', 'true');
  }
  
  // Log security events for monitoring
  if (process.env.ENABLE_SECURITY_LOGGING === 'true') {
    console.log({
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      ip: request.ip || request.headers.get('x-forwarded-for'),
      userAgent: userAgent.substring(0, 200), // Truncate for storage
      sensitiveEndpoint: isSensitiveEndpoint
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};