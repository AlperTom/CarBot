/**
 * Enhanced Security Configuration for CarBot
 * Addresses critical JWT and session management vulnerabilities
 */

import { createClient } from 'redis';
import crypto from 'crypto';

// Singleton Redis client
let redisClient = null;

/**
 * Initialize Redis client for session management
 */
export async function initializeRedis() {
  if (redisClient) return redisClient;
  
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({
      url: redisUrl,
      password: process.env.REDIS_PASSWORD,
      socket: {
        connectTimeout: 5000,
        lazyConnect: true
      }
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    
    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    // Fall back to in-memory storage for development
    return null;
  }
}

/**
 * Generate cryptographically secure JWT secret
 */
export function generateSecureJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Get or generate JWT secret with proper security
 */
export function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  
  // Check for weak development secrets
  const weakSecrets = [
    'carbot_dev_secret_change_in_production',
    'your_super_secure_jwt_secret_min_32_chars_long',
    'development',
    'secret'
  ];
  
  if (!secret || weakSecrets.includes(secret) || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SECURITY ERROR: Weak or missing JWT secret in production');
    }
    
    console.warn('⚠️  WARNING: Using insecure JWT secret. Generate a new one with: openssl rand -base64 64');
    return generateSecureJWTSecret();
  }
  
  return secret;
}

/**
 * Enhanced session management with Redis persistence
 */
export class SecureSessionManager {
  constructor() {
    this.redis = null;
    this.inMemoryStore = new Map(); // Fallback for development
    this.initRedis();
  }
  
  async initRedis() {
    try {
      this.redis = await initializeRedis();
    } catch (error) {
      console.warn('Redis not available, using in-memory storage');
    }
  }
  
  /**
   * Blacklist JWT token
   */
  async blacklistToken(tokenId, expiresIn = 86400) {
    const key = `blacklist:${tokenId}`;
    
    if (this.redis) {
      await this.redis.setEx(key, expiresIn, 'blacklisted');
    } else {
      this.inMemoryStore.set(key, {
        value: 'blacklisted',
        expires: Date.now() + (expiresIn * 1000)
      });
    }
  }
  
  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(tokenId) {
    const key = `blacklist:${tokenId}`;
    
    if (this.redis) {
      const result = await this.redis.get(key);
      return result === 'blacklisted';
    } else {
      const stored = this.inMemoryStore.get(key);
      if (stored && stored.expires > Date.now()) {
        return stored.value === 'blacklisted';
      }
      // Clean up expired entries
      if (stored && stored.expires <= Date.now()) {
        this.inMemoryStore.delete(key);
      }
      return false;
    }
  }
  
  /**
   * Store refresh token securely
   */
  async storeRefreshToken(tokenId, userId, expiresIn = 604800) { // 7 days
    const key = `refresh:${tokenId}`;
    const value = JSON.stringify({
      userId,
      created: Date.now(),
      expires: Date.now() + (expiresIn * 1000)
    });
    
    if (this.redis) {
      await this.redis.setEx(key, expiresIn, value);
    } else {
      this.inMemoryStore.set(key, {
        value,
        expires: Date.now() + (expiresIn * 1000)
      });
    }
  }
  
  /**
   * Validate refresh token
   */
  async validateRefreshToken(tokenId) {
    const key = `refresh:${tokenId}`;
    
    let stored;
    if (this.redis) {
      stored = await this.redis.get(key);
    } else {
      const entry = this.inMemoryStore.get(key);
      if (entry && entry.expires > Date.now()) {
        stored = entry.value;
      }
    }
    
    if (!stored) return null;
    
    try {
      const tokenData = JSON.parse(stored);
      if (tokenData.expires <= Date.now()) {
        // Clean up expired token
        await this.removeRefreshToken(tokenId);
        return null;
      }
      return tokenData;
    } catch (error) {
      console.error('Error parsing refresh token:', error);
      return null;
    }
  }
  
  /**
   * Remove refresh token
   */
  async removeRefreshToken(tokenId) {
    const key = `refresh:${tokenId}`;
    
    if (this.redis) {
      await this.redis.del(key);
    } else {
      this.inMemoryStore.delete(key);
    }
  }
  
  /**
   * Invalidate all user sessions
   */
  async invalidateUserSessions(userId) {
    if (this.redis) {
      const pattern = `refresh:*`;
      const keys = await this.redis.keys(pattern);
      
      for (const key of keys) {
        const stored = await this.redis.get(key);
        if (stored) {
          try {
            const tokenData = JSON.parse(stored);
            if (tokenData.userId === userId) {
              await this.redis.del(key);
              // Also blacklist the token ID
              const tokenId = key.replace('refresh:', '');
              await this.blacklistToken(tokenId);
            }
          } catch (error) {
            console.error('Error processing token for invalidation:', error);
          }
        }
      }
    } else {
      // In-memory cleanup
      for (const [key, entry] of this.inMemoryStore.entries()) {
        if (key.startsWith('refresh:')) {
          try {
            const tokenData = JSON.parse(entry.value);
            if (tokenData.userId === userId) {
              this.inMemoryStore.delete(key);
              const tokenId = key.replace('refresh:', '');
              await this.blacklistToken(tokenId);
            }
          } catch (error) {
            console.error('Error processing in-memory token:', error);
          }
        }
      }
    }
  }
  
  /**
   * Clean up expired entries (maintenance task)
   */
  async cleanup() {
    if (!this.redis) {
      const now = Date.now();
      for (const [key, entry] of this.inMemoryStore.entries()) {
        if (entry.expires <= now) {
          this.inMemoryStore.delete(key);
        }
      }
    }
    // Redis handles TTL automatically
  }
}

// Singleton instance
export const sessionManager = new SecureSessionManager();

/**
 * Enhanced rate limiting with Redis
 */
export class SecureRateLimiter {
  constructor() {
    this.redis = null;
    this.inMemoryStore = new Map();
    this.initRedis();
  }
  
  async initRedis() {
    try {
      this.redis = await initializeRedis();
    } catch (error) {
      console.warn('Redis not available for rate limiting');
    }
  }
  
  /**
   * Check rate limit with sliding window
   */
  async checkRateLimit(identifier, limit = 100, windowMs = 60000) {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const window = now - windowMs;
    
    if (this.redis) {
      // Use Redis sorted set for sliding window
      await this.redis.zRemRangeByScore(key, 0, window);
      const current = await this.redis.zCard(key);
      
      if (current >= limit) {
        const oldest = await this.redis.zRange(key, 0, 0, { WITHSCORES: true });
        const resetTime = oldest[0] ? parseInt(oldest[0].score) + windowMs : now + windowMs;
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: new Date(resetTime),
          total: limit
        };
      }
      
      await this.redis.zAdd(key, { score: now, value: now.toString() });
      await this.redis.expire(key, Math.ceil(windowMs / 1000));
      
      return {
        allowed: true,
        remaining: limit - current - 1,
        resetTime: new Date(now + windowMs),
        total: limit
      };
    } else {
      // Fallback in-memory implementation
      const requests = this.inMemoryStore.get(key) || [];
      const validRequests = requests.filter(timestamp => timestamp > window);
      
      if (validRequests.length >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: new Date(validRequests[0] + windowMs),
          total: limit
        };
      }
      
      validRequests.push(now);
      this.inMemoryStore.set(key, validRequests);
      
      return {
        allowed: true,
        remaining: limit - validRequests.length,
        resetTime: new Date(now + windowMs),
        total: limit
      };
    }
  }
}

export const rateLimiter = new SecureRateLimiter();

/**
 * Security headers configuration
 */
export const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  
  // HSTS with preload
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://vitals.vercel-insights.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'
  ].join(', ')
};

/**
 * Input validation and sanitization
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password strength validation
 */
export function validatePassword(password) {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const issues = [];
  
  if (password.length < minLength) {
    issues.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (!hasUpperCase) {
    issues.push('Password must contain at least one uppercase letter');
  }
  
  if (!hasLowerCase) {
    issues.push('Password must contain at least one lowercase letter');
  }
  
  if (!hasNumbers) {
    issues.push('Password must contain at least one number');
  }
  
  if (!hasSpecialChar) {
    issues.push('Password must contain at least one special character');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    strength: calculatePasswordStrength(password)
  };
}

function calculatePasswordStrength(password) {
  let score = 0;
  
  // Length bonus
  score += Math.min(password.length * 4, 50);
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;
  
  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) score -= 15; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 10; // Sequential patterns
  
  if (score >= 80) return 'strong';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'weak';
  return 'very weak';
}

export default {
  initializeRedis,
  generateSecureJWTSecret,
  getJWTSecret,
  sessionManager,
  rateLimiter,
  securityHeaders,
  sanitizeInput,
  validateEmail,
  validatePassword
};