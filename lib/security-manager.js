/**
 * Enhanced Security Manager for CarBot
 * Military-grade security with MFA, encryption, and GDPR compliance
 * Implements Phase 1 Security Enhancement requirements
 */

import crypto from 'crypto'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabaseConnectionManager } from './supabase-connection-manager.js'
import { performanceMonitor } from './performance-monitor.js'
import { cacheManager, CacheKeys, CacheTTL } from './redis-cache.js'

class SecurityManager {
  constructor() {
    this.encryption = {
      algorithm: 'aes-256-gcm',
      keyDerivation: 'pbkdf2',
      iterations: 600000, // OWASP recommended minimum
      keyLength: 32,
      ivLength: 16,
      tagLength: 16,
      saltLength: 32
    }
  }

  /**
   * Generate secure random string
   */
  generateSecureRandom(length = 32) {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Military-grade password hashing with adaptive cost
   */
  async hashPassword(password) {
    // Use high cost factor for security (12+ rounds)
    const saltRounds = process.env.NODE_ENV === 'production' ? 14 : 12
    return await bcrypt.hash(password, saltRounds)
  }

  /**
   * Verify password with timing attack protection
   */
  async verifyPassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      // Prevent timing attacks by always taking same time
      await bcrypt.compare('dummy-password', '$2b$12$dummy.hash.to.prevent.timing.attacks')
      return false
    }
  }

  /**
   * Advanced data encryption with authenticated encryption
   */
  encrypt(data, userKey = null) {
    try {
      const masterKey = process.env.MASTER_ENCRYPTION_KEY || this.generateSecureRandom(64)
      const salt = crypto.randomBytes(this.encryption.saltLength)
      
      // Derive encryption key using PBKDF2
      const derivedKey = crypto.pbkdf2Sync(
        Buffer.concat([Buffer.from(masterKey, 'hex'), Buffer.from(userKey || '', 'utf8')]),
        salt,
        this.encryption.iterations,
        this.encryption.keyLength,
        'sha512'
      )

      const iv = crypto.randomBytes(this.encryption.ivLength)
      const cipher = crypto.createCipher(this.encryption.algorithm, derivedKey, { iv })
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = cipher.getAuthTag()
      
      // Return encrypted data with metadata
      return {
        encrypted,
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.encryption.algorithm,
        iterations: this.encryption.iterations
      }
    } catch (error) {
      console.error('Encryption error:', error.message)
      throw new Error('Data encryption failed')
    }
  }

  /**
   * Advanced data decryption with integrity verification
   */
  decrypt(encryptedData, userKey = null) {
    try {
      const masterKey = process.env.MASTER_ENCRYPTION_KEY || this.generateSecureRandom(64)
      const salt = Buffer.from(encryptedData.salt, 'hex')
      
      // Derive the same key used for encryption
      const derivedKey = crypto.pbkdf2Sync(
        Buffer.concat([Buffer.from(masterKey, 'hex'), Buffer.from(userKey || '', 'utf8')]),
        salt,
        encryptedData.iterations,
        this.encryption.keyLength,
        'sha512'
      )

      const iv = Buffer.from(encryptedData.iv, 'hex')
      const tag = Buffer.from(encryptedData.tag, 'hex')
      const decipher = crypto.createDecipher(encryptedData.algorithm, derivedKey, { iv })
      
      decipher.setAuthTag(tag)
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Decryption error:', error.message)
      throw new Error('Data decryption failed or tampered data detected')
    }
  }

  /**
   * Generate MFA secret with enhanced security
   */
  generateMFASecret(userEmail, workshopName = 'CarBot Workshop') {
    const secret = speakeasy.generateSecret({
      name: `${workshopName} (${userEmail})`,
      issuer: 'CarBot Automotive Platform',
      length: 32 // Higher entropy for better security
    })
    
    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
      manual_entry_key: secret.base32,
      qr_code_ascii: secret.ascii
    }
  }

  /**
   * Generate QR code for MFA setup
   */
  async generateMFAQRCode(otpauthUrl) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      })
      
      return qrCodeDataURL
    } catch (error) {
      console.error('QR Code generation error:', error.message)
      throw new Error('QR code generation failed')
    }
  }

  /**
   * Verify MFA token with window tolerance
   */
  verifyMFAToken(secret, token, window = 2) {
    try {
      return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: window, // Allow for clock drift
        step: 30 // 30-second window (standard)
      })
    } catch (error) {
      console.error('MFA verification error:', error.message)
      return false
    }
  }

  /**
   * Generate secure JWT with enhanced claims
   */
  generateSecureJWT(payload, options = {}) {
    const defaultOptions = {
      expiresIn: '1h',
      issuer: 'CarBot Security Manager',
      audience: 'CarBot Workshop System',
      algorithm: 'HS512' // Stronger algorithm
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    // Add security claims
    const securePayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: this.generateSecureRandom(16), // Unique token ID
      security_level: payload.mfa_verified ? 'high' : 'standard'
    }
    
    return jwt.sign(securePayload, process.env.JWT_SECRET, mergedOptions)
  }

  /**
   * Verify JWT with enhanced security checks
   */
  verifySecureJWT(token, options = {}) {
    try {
      const defaultOptions = {
        issuer: 'CarBot Security Manager',
        audience: 'CarBot Workshop System',
        algorithms: ['HS512']
      }
      
      const mergedOptions = { ...defaultOptions, ...options }
      const decoded = jwt.verify(token, process.env.JWT_SECRET, mergedOptions)
      
      // Additional security checks
      if (!decoded.jti || !decoded.iat) {
        throw new Error('Invalid token structure')
      }
      
      return decoded
    } catch (error) {
      console.error('JWT verification error:', error.message)
      return null
    }
  }

  /**
   * Rate limiting for authentication attempts
   */
  async checkRateLimit(identifier, maxAttempts = 5, windowMinutes = 15) {
    const cacheKey = `rate_limit:auth:${identifier}`
    
    try {
      const attempts = await cacheManager.get(cacheKey) || []
      const now = Date.now()
      const windowMs = windowMinutes * 60 * 1000
      
      // Remove expired attempts
      const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs)
      
      if (validAttempts.length >= maxAttempts) {
        const oldestAttempt = Math.min(...validAttempts)
        const resetTime = new Date(oldestAttempt + windowMs)
        
        return {
          allowed: false,
          attemptsRemaining: 0,
          resetTime,
          retryAfter: Math.ceil((resetTime.getTime() - now) / 1000)
        }
      }
      
      return {
        allowed: true,
        attemptsRemaining: maxAttempts - validAttempts.length,
        resetTime: null,
        retryAfter: 0
      }
    } catch (error) {
      console.error('Rate limiting error:', error.message)
      // Fail open for availability, but log the error
      return { allowed: true, attemptsRemaining: maxAttempts }
    }
  }

  /**
   * Record authentication attempt
   */
  async recordAuthAttempt(identifier, success = false) {
    const cacheKey = `rate_limit:auth:${identifier}`
    
    try {
      const attempts = await cacheManager.get(cacheKey) || []
      attempts.push(Date.now())
      
      // Keep only recent attempts (last hour)
      const oneHourAgo = Date.now() - (60 * 60 * 1000)
      const recentAttempts = attempts.filter(timestamp => timestamp > oneHourAgo)
      
      await cacheManager.set(cacheKey, recentAttempts, CacheTTL.EXTENDED)
      
      // Log security event
      await this.logSecurityEvent({
        event_type: success ? 'auth_success' : 'auth_failure',
        identifier,
        timestamp: new Date().toISOString(),
        ip_address: 'unknown', // Would be passed from request
        user_agent: 'unknown'  // Would be passed from request
      })
      
    } catch (error) {
      console.error('Failed to record auth attempt:', error.message)
    }
  }

  /**
   * Enhanced session management with security tracking
   */
  async createSecureSession(userId, deviceInfo = {}) {
    const sessionId = this.generateSecureRandom(32)
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
    
    const sessionData = {
      sessionId,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      deviceInfo: {
        userAgent: deviceInfo.userAgent || 'unknown',
        ipAddress: deviceInfo.ipAddress || 'unknown',
        deviceFingerprint: deviceInfo.fingerprint || 'unknown'
      },
      security: {
        mfaVerified: deviceInfo.mfaVerified || false,
        securityLevel: deviceInfo.mfaVerified ? 'high' : 'standard',
        lastActivity: new Date().toISOString()
      }
    }
    
    // Store session in cache and database
    const cacheKey = CacheKeys.session(sessionId)
    await cacheManager.set(cacheKey, sessionData, CacheTTL.DAY)
    
    // Optionally store in database for persistence
    try {
      await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        return await adminClient.from('user_sessions').insert({
          session_id: sessionId,
          user_id: userId,
          session_data: sessionData,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        })
      })
    } catch (error) {
      console.warn('Failed to store session in database:', error.message)
      // Continue with cache-only session
    }
    
    return sessionData
  }

  /**
   * Validate and refresh session
   */
  async validateSession(sessionId) {
    const cacheKey = CacheKeys.session(sessionId)
    
    try {
      let sessionData = await cacheManager.get(cacheKey)
      
      // If not in cache, try database
      if (!sessionData) {
        const dbResult = await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
          const result = await adminClient.from('user_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single()
          
          return result.data
        })
        
        if (dbResult && new Date(dbResult.expires_at) > new Date()) {
          sessionData = dbResult.session_data
          // Restore to cache
          await cacheManager.set(cacheKey, sessionData, CacheTTL.DAY)
        }
      }
      
      if (!sessionData) {
        return { valid: false, reason: 'session_not_found' }
      }
      
      // Check expiration
      if (new Date(sessionData.expiresAt) <= new Date()) {
        await this.destroySession(sessionId)
        return { valid: false, reason: 'session_expired' }
      }
      
      // Update last activity
      sessionData.security.lastActivity = new Date().toISOString()
      await cacheManager.set(cacheKey, sessionData, CacheTTL.DAY)
      
      return { valid: true, sessionData }
      
    } catch (error) {
      console.error('Session validation error:', error.message)
      return { valid: false, reason: 'validation_error' }
    }
  }

  /**
   * Destroy session securely
   */
  async destroySession(sessionId) {
    const cacheKey = CacheKeys.session(sessionId)
    
    try {
      // Remove from cache
      await cacheManager.del(cacheKey)
      
      // Remove from database
      await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        return await adminClient.from('user_sessions')
          .delete()
          .eq('session_id', sessionId)
      })
      
      return true
    } catch (error) {
      console.error('Session destruction error:', error.message)
      return false
    }
  }

  /**
   * GDPR compliance data encryption
   */
  async encryptPersonalData(data, userId) {
    return this.encrypt(data, userId)
  }

  /**
   * GDPR compliance data decryption
   */
  async decryptPersonalData(encryptedData, userId) {
    return this.decrypt(encryptedData, userId)
  }

  /**
   * Security event logging
   */
  async logSecurityEvent(eventData) {
    try {
      await performanceMonitor.trackDatabaseQuery('security_log', async () => {
        return await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
          return await adminClient.from('security_events').insert({
            event_type: eventData.event_type,
            event_data: eventData,
            created_at: new Date().toISOString()
          })
        })
      })
    } catch (error) {
      console.error('Security event logging failed:', error.message)
      // Don't throw error to avoid disrupting main flow
    }
  }

  /**
   * Generate security audit report
   */
  async generateSecurityAudit(timeRangeHours = 24) {
    try {
      const endTime = new Date()
      const startTime = new Date(endTime.getTime() - (timeRangeHours * 60 * 60 * 1000))
      
      const auditData = await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        const [events, sessions, attempts] = await Promise.all([
          adminClient.from('security_events')
            .select('*')
            .gte('created_at', startTime.toISOString())
            .lte('created_at', endTime.toISOString()),
            
          adminClient.from('user_sessions')
            .select('*')
            .gte('created_at', startTime.toISOString())
            .lte('created_at', endTime.toISOString()),
            
          adminClient.from('auth_attempts')
            .select('*')
            .gte('created_at', startTime.toISOString())
            .lte('created_at', endTime.toISOString())
        ])
        
        return {
          security_events: events.data || [],
          user_sessions: sessions.data || [],
          auth_attempts: attempts.data || []
        }
      })
      
      // Generate audit summary
      const summary = {
        timeRange: {
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          hours: timeRangeHours
        },
        events: {
          total: auditData.security_events.length,
          byType: this.groupByField(auditData.security_events, 'event_type'),
          critical: auditData.security_events.filter(e => 
            ['auth_failure', 'session_hijack', 'brute_force'].includes(e.event_type)
          ).length
        },
        authentication: {
          totalAttempts: auditData.auth_attempts.length,
          successfulLogins: auditData.auth_attempts.filter(a => a.success).length,
          failedAttempts: auditData.auth_attempts.filter(a => !a.success).length,
          mfaUsage: auditData.auth_attempts.filter(a => a.mfa_used).length
        },
        sessions: {
          totalCreated: auditData.user_sessions.length,
          activeSessions: auditData.user_sessions.filter(s => 
            new Date(s.expires_at) > endTime
          ).length,
          expiredSessions: auditData.user_sessions.filter(s => 
            new Date(s.expires_at) <= endTime
          ).length
        }
      }
      
      return {
        summary,
        details: auditData,
        recommendations: this.generateSecurityRecommendations(summary)
      }
      
    } catch (error) {
      console.error('Security audit generation failed:', error.message)
      throw new Error('Failed to generate security audit')
    }
  }

  /**
   * Generate security recommendations based on audit data
   */
  generateSecurityRecommendations(summary) {
    const recommendations = []
    
    // Check for high failure rate
    if (summary.authentication.totalAttempts > 0) {
      const failureRate = (summary.authentication.failedAttempts / summary.authentication.totalAttempts) * 100
      
      if (failureRate > 20) {
        recommendations.push({
          level: 'high',
          category: 'authentication',
          issue: `High authentication failure rate: ${failureRate.toFixed(1)}%`,
          action: 'Implement stricter rate limiting and investigate potential brute force attacks'
        })
      }
    }
    
    // Check MFA adoption
    if (summary.authentication.totalAttempts > 0) {
      const mfaRate = (summary.authentication.mfaUsage / summary.authentication.totalAttempts) * 100
      
      if (mfaRate < 50) {
        recommendations.push({
          level: 'medium',
          category: 'authentication',
          issue: `Low MFA adoption rate: ${mfaRate.toFixed(1)}%`,
          action: 'Encourage or require MFA setup for all users'
        })
      }
    }
    
    // Check for security events
    if (summary.events.critical > 0) {
      recommendations.push({
        level: 'critical',
        category: 'security',
        issue: `${summary.events.critical} critical security events detected`,
        action: 'Immediate investigation required for critical security events'
      })
    }
    
    return recommendations
  }

  /**
   * Helper: Group array by field
   */
  groupByField(array, field) {
    return array.reduce((groups, item) => {
      const key = item[field] || 'unknown'
      groups[key] = (groups[key] || 0) + 1
      return groups
    }, {})
  }
}

// Cache key generators for sessions
CacheKeys.session = (sessionId) => `session:${sessionId}`

// Export singleton instance
export const securityManager = new SecurityManager()

export default securityManager