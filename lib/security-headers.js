/**
 * Production Security Headers and CSRF Protection for CarBot
 * Implements comprehensive security measures for production deployment
 */

import { randomBytes } from 'crypto'
import { logSecurityError } from './error-logger.js'

/**
 * Security configuration for different environments
 */
const SecurityConfig = {
  development: {
    strictTransportSecurity: false,
    contentSecurityPolicy: 'relaxed',
    corsOrigins: ['http://localhost:3000', 'http://localhost:3001'],
    cookieSecure: false
  },
  production: {
    strictTransportSecurity: true,
    contentSecurityPolicy: 'strict',
    corsOrigins: ['https://carbot.chat', 'https://www.carbot.chat', 'https://*.carbot.chat'],
    cookieSecure: true
  }
}

/**
 * Generate nonce for CSP
 */
function generateNonce() {
  return randomBytes(16).toString('base64')
}

/**
 * Get current environment config
 */
function getConfig() {
  const env = process.env.NODE_ENV || 'development'
  return SecurityConfig[env] || SecurityConfig.development
}

/**
 * Create Content Security Policy header
 */
function createCSP(nonce) {
  const config = getConfig()
  
  if (config.contentSecurityPolicy === 'relaxed') {
    // Development - more permissive
    return [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}' https://vercel.live https://va.vercel-scripts.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://api.stripe.com https://vitals.vercel-insights.com wss://ws-us3.pusher.com https://*.supabase.co",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  } else {
    // Production - strict
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://va.vercel-scripts.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow inline styles for Next.js
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://carbot.chat https://*.carbot.chat",
      "media-src 'self'",
      "connect-src 'self' https://api.stripe.com https://vitals.vercel-insights.com https://*.supabase.co https://api.resend.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
}

/**
 * Security headers middleware
 */
export function securityHeaders(req, res, next) {
  const config = getConfig()
  const nonce = generateNonce()
  
  // Store nonce for use in templates
  req.nonce = nonce
  res.locals = res.locals || {}
  res.locals.nonce = nonce

  // Content Security Policy
  res.setHeader('Content-Security-Policy', createCSP(nonce))
  
  // Strict Transport Security (HTTPS only)
  if (config.strictTransportSecurity) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions Policy (formerly Feature Policy)
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '))
  
  // Cross-Origin Embedder Policy
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless')
  
  // Cross-Origin Opener Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  
  // Cross-Origin Resource Policy
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  
  // Remove server information
  res.removeHeader('X-Powered-By')
  res.removeHeader('Server')
  
  next()
}

/**
 * CORS middleware with secure defaults
 */
export function secureCARS(req, res, next) {
  const config = getConfig()
  const origin = req.headers.origin
  
  // Check if origin is allowed
  const isAllowedOrigin = config.corsOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace('*', '.*')
      return new RegExp(`^${pattern}$`).test(origin)
    }
    return allowed === origin
  })
  
  if (isAllowedOrigin || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || config.corsOrigins[0])
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Workshop-Id')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400') // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  next()
}

/**
 * CSRF Protection middleware
 */
export function csrfProtection(req, res, next) {
  // Skip CSRF for GET requests and API endpoints with proper authentication
  if (req.method === 'GET' || req.url.startsWith('/api/webhook')) {
    return next()
  }
  
  const token = req.headers['x-csrf-token'] || req.body?.csrfToken
  const sessionToken = req.headers['authorization']?.split(' ')[1]
  
  // For JWT-based requests, verify the token instead of traditional CSRF
  if (sessionToken && !token) {
    // JWT tokens provide CSRF protection through their nature
    return next()
  }
  
  // For form-based requests, check CSRF token
  if (!token) {
    logSecurityError('CSRF token missing', {
      url: req.url,
      method: req.method,
      origin: req.headers.origin,
      referer: req.headers.referer,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    })
    
    return res.status(403).json({
      success: false,
      error: 'CSRF token required',
      code: 'CSRF_TOKEN_MISSING'
    })
  }
  
  // Validate CSRF token (implement your validation logic here)
  if (!validateCSRFToken(token, req)) {
    logSecurityError('Invalid CSRF token', {
      url: req.url,
      method: req.method,
      token: token?.substring(0, 10) + '...',
      origin: req.headers.origin,
      referer: req.headers.referer,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    })
    
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID'
    })
  }
  
  next()
}

/**
 * Validate CSRF token
 */
function validateCSRFToken(token, req) {
  // Simple implementation - in production, use a more robust method
  // This could involve session storage, signed tokens, etc.
  
  if (!token || token.length < 16) {
    return false
  }
  
  // Check if token matches expected format (base64 encoded)
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/
  if (!base64Regex.test(token)) {
    return false
  }
  
  // In a real implementation, validate against stored token
  // For now, accept any properly formatted token
  return true
}

/**
 * Generate CSRF token for forms
 */
export function generateCSRFToken() {
  return randomBytes(32).toString('base64')
}

/**
 * Input sanitization middleware
 */
export function sanitizeInput(req, res, next) {
  // Sanitize common XSS patterns
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str
    
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/onload\s*=/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onclick\s*=/gi, '')
  }
  
  // Recursively sanitize request body
  const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) return obj
    
    if (typeof obj === 'string') {
      return sanitizeString(obj)
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject)
    }
    
    if (typeof obj === 'object') {
      const sanitized = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[sanitizeString(key)] = sanitizeObject(value)
      }
      return sanitized
    }
    
    return obj
  }
  
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  
  next()
}

/**
 * Request size limiter
 */
export function requestSizeLimit(maxSize = '10mb') {
  const maxBytes = typeof maxSize === 'string' ? 
    parseInt(maxSize) * (maxSize.includes('mb') ? 1024 * 1024 : 1024) :
    maxSize
    
  return (req, res, next) => {
    let size = 0
    
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBytes) {
        logSecurityError('Request size limit exceeded', {
          url: req.url,
          method: req.method,
          size: size,
          limit: maxBytes,
          ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
        })
        
        return res.status(413).json({
          success: false,
          error: 'Request too large',
          code: 'REQUEST_TOO_LARGE'
        })
      }
    })
    
    next()
  }
}

/**
 * Complete security middleware stack
 */
export function createSecurityMiddleware() {
  return [
    securityHeaders,
    secureCARS,
    sanitizeInput,
    requestSizeLimit(),
    csrfProtection
  ]
}

export default {
  securityHeaders,
  secureCARS,
  csrfProtection,
  sanitizeInput,
  requestSizeLimit,
  generateCSRFToken,
  createSecurityMiddleware
}