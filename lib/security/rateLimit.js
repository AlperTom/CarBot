import { createClient } from '@supabase/supabase-js';

/**
 * Advanced Rate Limiting System
 * Implements sliding window, token bucket, and adaptive rate limiting
 */
export class RateLimitManager {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // In-memory store for performance (Redis recommended for production)
    this.memoryStore = new Map();
    this.buckets = new Map();
    
    // Default rate limit configurations
    this.defaults = {
      login: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
      register: { requests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
      api: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
      password_reset: { requests: 2, windowMs: 60 * 60 * 1000 }, // 2 attempts per hour
      mfa: { requests: 5, windowMs: 5 * 60 * 1000 }, // 5 attempts per 5 minutes
      workshop_data: { requests: 10, windowMs: 60 * 1000 } // 10 requests per minute
    };
  }

  /**
   * Check if request should be rate limited using sliding window algorithm
   * @param {string} identifier - Client identifier (IP, user ID, etc.)
   * @param {string} action - Action being performed
   * @param {Object} options - Rate limit options
   * @returns {Object} Rate limit result
   */
  async checkRateLimit(identifier, action, options = {}) {
    const config = { ...this.defaults[action], ...options };
    const key = `${action}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    try {
      // Get existing requests from store
      let requests = this.memoryStore.get(key) || [];
      
      // Remove expired requests (sliding window)
      requests = requests.filter(timestamp => timestamp > windowStart);
      
      // Check if limit exceeded
      if (requests.length >= config.requests) {
        const oldestRequest = Math.min(...requests);
        const resetTime = oldestRequest + config.windowMs;
        
        // Log rate limit violation
        await this.logRateLimitViolation(identifier, action, {
          currentRequests: requests.length,
          limit: config.requests,
          windowMs: config.windowMs
        });
        
        return {
          allowed: false,
          limit: config.requests,
          remaining: 0,
          resetTime: resetTime,
          retryAfter: Math.ceil((resetTime - now) / 1000)
        };
      }

      // Add current request
      requests.push(now);
      this.memoryStore.set(key, requests);

      return {
        allowed: true,
        limit: config.requests,
        remaining: config.requests - requests.length,
        resetTime: now + config.windowMs,
        retryAfter: 0
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open for availability
      return { allowed: true, limit: config.requests, remaining: config.requests };
    }
  }

  /**
   * Token bucket rate limiting for burst requests
   * @param {string} identifier - Client identifier
   * @param {string} action - Action being performed
   * @param {Object} config - Bucket configuration
   * @returns {Object} Token bucket result
   */
  async checkTokenBucket(identifier, action, config = {}) {
    const bucketConfig = {
      capacity: config.capacity || 10,
      refillRate: config.refillRate || 1, // tokens per second
      cost: config.cost || 1
    };

    const key = `bucket:${action}:${identifier}`;
    const now = Date.now();

    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = {
        tokens: bucketConfig.capacity,
        lastRefill: now
      };
    }

    // Refill tokens based on time passed
    const timePassed = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = Math.floor(timePassed * bucketConfig.refillRate);
    bucket.tokens = Math.min(bucketConfig.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    // Check if enough tokens available
    if (bucket.tokens < bucketConfig.cost) {
      return {
        allowed: false,
        tokens: bucket.tokens,
        capacity: bucketConfig.capacity,
        retryAfter: Math.ceil((bucketConfig.cost - bucket.tokens) / bucketConfig.refillRate)
      };
    }

    // Consume tokens
    bucket.tokens -= bucketConfig.cost;
    this.buckets.set(key, bucket);

    return {
      allowed: true,
      tokens: bucket.tokens,
      capacity: bucketConfig.capacity,
      retryAfter: 0
    };
  }

  /**
   * Adaptive rate limiting based on user behavior and system load
   * @param {string} identifier - Client identifier
   * @param {string} action - Action being performed
   * @param {Object} context - Request context
   * @returns {Object} Adaptive rate limit result
   */
  async checkAdaptiveRateLimit(identifier, action, context = {}) {
    try {
      // Get user's trust score and behavior history
      const userProfile = await this.getUserProfile(identifier);
      const systemLoad = await this.getSystemLoad();
      
      // Calculate dynamic limits based on trust score
      const baseLimits = this.defaults[action];
      const trustMultiplier = this.calculateTrustMultiplier(userProfile);
      const loadMultiplier = this.calculateLoadMultiplier(systemLoad);
      
      const adaptiveLimits = {
        requests: Math.floor(baseLimits.requests * trustMultiplier * loadMultiplier),
        windowMs: baseLimits.windowMs
      };

      // Apply adaptive rate limiting
      const result = await this.checkRateLimit(identifier, action, adaptiveLimits);
      
      // Update user behavior profile
      await this.updateUserProfile(identifier, action, result.allowed);
      
      return {
        ...result,
        adaptive: true,
        trustScore: userProfile.trustScore,
        systemLoad: systemLoad,
        originalLimit: baseLimits.requests,
        adaptedLimit: adaptiveLimits.requests
      };
    } catch (error) {
      console.error('Adaptive rate limit check failed:', error);
      // Fall back to standard rate limiting
      return await this.checkRateLimit(identifier, action);
    }
  }

  /**
   * Progressive rate limiting with increasing penalties
   * @param {string} identifier - Client identifier
   * @param {string} action - Action being performed
   * @returns {Object} Progressive rate limit result
   */
  async checkProgressiveRateLimit(identifier, action) {
    const violationKey = `violations:${action}:${identifier}`;
    const violationCount = await this.getViolationCount(violationKey);
    
    // Calculate progressive penalty
    const penalty = Math.min(violationCount * 2, 24); // Max 24 hour penalty
    const penaltyMs = penalty * 60 * 60 * 1000; // Convert to milliseconds
    
    // Check if still in penalty period
    const lastViolation = await this.getLastViolationTime(violationKey);
    if (lastViolation && (Date.now() - lastViolation) < penaltyMs) {
      return {
        allowed: false,
        penaltyActive: true,
        violationCount: violationCount,
        penaltyHours: penalty,
        retryAfter: Math.ceil((penaltyMs - (Date.now() - lastViolation)) / 1000)
      };
    }

    // Apply normal rate limiting
    const result = await this.checkRateLimit(identifier, action);
    
    // Record violation if rate limited
    if (!result.allowed) {
      await this.recordViolation(violationKey);
    } else if (violationCount > 0) {
      // Gradually reduce violation count for good behavior
      await this.reduceViolationCount(violationKey);
    }
    
    return { ...result, violationCount: violationCount };
  }

  /**
   * IP-based geographical rate limiting
   * @param {string} ipAddress - Client IP address
   * @param {string} action - Action being performed
   * @returns {Object} Geo rate limit result
   */
  async checkGeographicalRateLimit(ipAddress, action) {
    try {
      // Get IP geolocation (in production, use a geolocation service)
      const geoData = await this.getIPGeolocation(ipAddress);
      
      // Define geo-specific limits
      const geoLimits = {
        'DE': { multiplier: 1.0 }, // Germany - normal limits
        'EU': { multiplier: 0.8 }, // EU countries - slightly reduced
        'US': { multiplier: 0.6 }, // US - more restricted
        'DEFAULT': { multiplier: 0.3 } // Other countries - heavily restricted
      };
      
      const country = geoData.country || 'DEFAULT';
      const isEU = this.isEUCountry(country);
      const geoKey = country === 'DE' ? 'DE' : (isEU ? 'EU' : (country === 'US' ? 'US' : 'DEFAULT'));
      
      const multiplier = geoLimits[geoKey].multiplier;
      const baseLimits = this.defaults[action];
      
      const geoLimits_final = {
        requests: Math.floor(baseLimits.requests * multiplier),
        windowMs: baseLimits.windowMs
      };
      
      const result = await this.checkRateLimit(ipAddress, action, geoLimits_final);
      
      return {
        ...result,
        geographical: true,
        country: country,
        isEU: isEU,
        multiplier: multiplier
      };
    } catch (error) {
      console.error('Geographical rate limit check failed:', error);
      return await this.checkRateLimit(ipAddress, action);
    }
  }

  /**
   * Log rate limit violations for security monitoring
   * @param {string} identifier - Client identifier
   * @param {string} action - Action that was rate limited
   * @param {Object} details - Violation details
   */
  async logRateLimitViolation(identifier, action, details) {
    try {
      await this.supabase
        .from('security_events')
        .insert([{
          event_type: 'rate_limit_violation',
          identifier: identifier,
          action: action,
          details: details,
          timestamp: new Date().toISOString(),
          severity: this.calculateSeverity(details.currentRequests, details.limit)
        }]);
    } catch (error) {
      console.error('Failed to log rate limit violation:', error);
    }
  }

  /**
   * Get user profile for adaptive rate limiting
   * @param {string} identifier - User identifier
   * @returns {Object} User profile
   */
  async getUserProfile(identifier) {
    try {
      const { data, error } = await this.supabase
        .from('user_behavior_profiles')
        .select('*')
        .eq('identifier', identifier)
        .single();

      if (error || !data) {
        return {
          trustScore: 0.5, // Default trust score
          violationCount: 0,
          lastActivity: null
        };
      }

      return data;
    } catch (error) {
      return { trustScore: 0.5, violationCount: 0, lastActivity: null };
    }
  }

  /**
   * Update user profile based on behavior
   * @param {string} identifier - User identifier
   * @param {string} action - Action performed
   * @param {boolean} allowed - Whether action was allowed
   */
  async updateUserProfile(identifier, action, allowed) {
    try {
      const profile = await this.getUserProfile(identifier);
      
      // Adjust trust score based on behavior
      let newTrustScore = profile.trustScore;
      if (allowed) {
        newTrustScore = Math.min(1.0, newTrustScore + 0.01); // Increase trust
      } else {
        newTrustScore = Math.max(0.0, newTrustScore - 0.1); // Decrease trust
      }

      await this.supabase
        .from('user_behavior_profiles')
        .upsert({
          identifier: identifier,
          trustScore: newTrustScore,
          lastActivity: new Date().toISOString(),
          violationCount: allowed ? profile.violationCount : profile.violationCount + 1
        });
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  }

  /**
   * Calculate trust multiplier for adaptive rate limiting
   * @param {Object} userProfile - User profile
   * @returns {number} Trust multiplier
   */
  calculateTrustMultiplier(userProfile) {
    const baseTrust = userProfile.trustScore || 0.5;
    // Trust score of 1.0 = 2x limits, 0.0 = 0.2x limits
    return Math.max(0.2, Math.min(2.0, 0.2 + (baseTrust * 1.8)));
  }

  /**
   * Calculate system load multiplier
   * @param {number} systemLoad - Current system load (0-1)
   * @returns {number} Load multiplier
   */
  calculateLoadMultiplier(systemLoad) {
    // High load = lower limits
    return Math.max(0.1, 1.0 - (systemLoad * 0.8));
  }

  /**
   * Get current system load (simplified)
   * @returns {number} System load (0-1)
   */
  async getSystemLoad() {
    // In production, this would check actual system metrics
    // For now, return a simulated load based on time of day
    const hour = new Date().getHours();
    const peakHours = [9, 10, 11, 14, 15, 16]; // Business hours
    return peakHours.includes(hour) ? 0.7 : 0.3;
  }

  /**
   * Calculate violation severity
   * @param {number} currentRequests - Current request count
   * @param {number} limit - Rate limit
   * @returns {string} Severity level
   */
  calculateSeverity(currentRequests, limit) {
    const ratio = currentRequests / limit;
    if (ratio >= 3) return 'high';
    if (ratio >= 2) return 'medium';
    return 'low';
  }

  /**
   * Check if country is in EU
   * @param {string} country - Country code
   * @returns {boolean} True if EU country
   */
  isEUCountry(country) {
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];
    return euCountries.includes(country);
  }

  // Helper methods for violation tracking
  async getViolationCount(key) {
    // Implementation would retrieve from persistent storage
    return 0;
  }

  async getLastViolationTime(key) {
    // Implementation would retrieve from persistent storage
    return null;
  }

  async recordViolation(key) {
    // Implementation would record in persistent storage
  }

  async reduceViolationCount(key) {
    // Implementation would reduce violation count
  }

  async getIPGeolocation(ip) {
    // Mock implementation - in production, use a geolocation service
    return { country: 'DE', region: 'Bavaria', city: 'Munich' };
  }
}

export default new RateLimitManager();