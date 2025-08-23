/**
 * Redis Caching System for CarBot
 * High-performance caching with TTL strategies
 * Target: >85% cache hit ratio, <10ms cache latency
 */

// In-memory cache as Redis fallback
class InMemoryCache {
  constructor() {
    this.cache = new Map()
    this.ttls = new Map()
  }

  async set(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + (ttlSeconds * 1000)
    this.cache.set(key, value)
    this.ttls.set(key, expiresAt)
    
    // Auto cleanup expired keys
    setTimeout(() => {
      if (this.ttls.get(key) === expiresAt) {
        this.cache.delete(key)
        this.ttls.delete(key)
      }
    }, ttlSeconds * 1000)
    
    return 'OK'
  }

  async get(key) {
    const expiresAt = this.ttls.get(key)
    if (!expiresAt || Date.now() > expiresAt) {
      this.cache.delete(key)
      this.ttls.delete(key)
      return null
    }
    
    return this.cache.get(key)
  }

  async del(key) {
    this.cache.delete(key)
    this.ttls.delete(key)
    return 1
  }

  async exists(key) {
    const expiresAt = this.ttls.get(key)
    return expiresAt && Date.now() <= expiresAt ? 1 : 0
  }

  async flushall() {
    this.cache.clear()
    this.ttls.clear()
    return 'OK'
  }

  async keys(pattern) {
    const keys = Array.from(this.cache.keys())
    if (pattern === '*') return keys
    
    // Simple pattern matching
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return keys.filter(key => regex.test(key))
  }
}

class CacheManager {
  constructor() {
    this.client = null
    this.fallbackCache = new InMemoryCache()
    this.isConnected = false
    this.useRedis = false
  }

  /**
   * Initialize cache connection
   */
  async initialize() {
    if (this.client) {
      return { success: true, type: this.useRedis ? 'redis' : 'memory' }
    }

    try {
      // Try Redis if available
      if (process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL) {
        const { createClient } = await import('redis')
        
        if (process.env.UPSTASH_REDIS_REST_URL) {
          // Upstash Redis
          this.client = createClient({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN
          })
        } else {
          // Standard Redis
          this.client = createClient({
            url: process.env.REDIS_URL
          })
        }

        this.client.on('error', (err) => {
          console.warn('Redis connection error:', err.message)
          this.isConnected = false
        })

        this.client.on('connect', () => {
          console.log('✅ Redis cache connected')
          this.isConnected = true
          this.useRedis = true
        })

        await this.client.connect()
        
        // Test connection
        await this.client.ping()
        
        return { success: true, type: 'redis' }
      }
    } catch (error) {
      console.warn('Redis initialization failed, using in-memory cache:', error.message)
    }

    // Fall back to in-memory cache
    this.client = this.fallbackCache
    this.isConnected = true
    this.useRedis = false
    
    console.log('📦 Using in-memory cache (Redis unavailable)')
    return { success: true, type: 'memory' }
  }

  /**
   * Get cache client
   */
  async getClient() {
    if (!this.client) {
      await this.initialize()
    }
    return this.client
  }

  /**
   * Set cache value with TTL
   */
  async set(key, value, ttlSeconds = 300) {
    try {
      const client = await this.getClient()
      const serialized = typeof value === 'string' ? value : JSON.stringify(value)
      
      if (this.useRedis) {
        await client.setEx(key, ttlSeconds, serialized)
      } else {
        await client.set(key, serialized, ttlSeconds)
      }
      
      return true
    } catch (error) {
      console.error('Cache set error:', error.message)
      return false
    }
  }

  /**
   * Get cache value
   */
  async get(key) {
    try {
      const client = await this.getClient()
      const value = await client.get(key)
      
      if (!value) return null
      
      try {
        return JSON.parse(value)
      } catch {
        return value // Return as string if not JSON
      }
    } catch (error) {
      console.error('Cache get error:', error.message)
      return null
    }
  }

  /**
   * Delete cache key
   */
  async del(key) {
    try {
      const client = await this.getClient()
      await client.del(key)
      return true
    } catch (error) {
      console.error('Cache delete error:', error.message)
      return false
    }
  }

  /**
   * Check if key exists
   */
  async exists(key) {
    try {
      const client = await this.getClient()
      const result = await client.exists(key)
      return result > 0
    } catch (error) {
      console.error('Cache exists error:', error.message)
      return false
    }
  }

  /**
   * Cache a function result
   */
  async cacheFunction(key, fn, ttlSeconds = 300) {
    try {
      // Try to get from cache first
      const cached = await this.get(key)
      if (cached !== null) {
        return { data: cached, fromCache: true }
      }
      
      // Execute function and cache result
      const result = await fn()
      await this.set(key, result, ttlSeconds)
      
      return { data: result, fromCache: false }
    } catch (error) {
      console.error('Cache function error:', error.message)
      // Return function result without caching on error
      return { data: await fn(), fromCache: false }
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    try {
      const client = await this.getClient()
      
      if (this.useRedis && client.info) {
        const info = await client.info('memory')
        return {
          type: 'redis',
          connected: this.isConnected,
          memory: info.split('\n').reduce((acc, line) => {
            const [key, value] = line.split(':')
            if (key && value) acc[key] = value.trim()
            return acc
          }, {})
        }
      }
      
      // In-memory cache stats
      return {
        type: 'memory',
        connected: this.isConnected,
        keysCount: this.fallbackCache.cache.size,
        memoryUsage: process.memoryUsage()
      }
    } catch (error) {
      console.error('Cache stats error:', error.message)
      return {
        type: this.useRedis ? 'redis' : 'memory',
        connected: false,
        error: error.message
      }
    }
  }

  /**
   * Clear all cache
   */
  async flush() {
    try {
      const client = await this.getClient()
      
      if (this.useRedis) {
        await client.flushAll()
      } else {
        await client.flushall()
      }
      
      return true
    } catch (error) {
      console.error('Cache flush error:', error.message)
      return false
    }
  }

  /**
   * Get cache keys by pattern
   */
  async keys(pattern = '*') {
    try {
      const client = await this.getClient()
      return await client.keys(pattern)
    } catch (error) {
      console.error('Cache keys error:', error.message)
      return []
    }
  }
}

// Cache TTL strategies
export const CacheTTL = {
  SHORT: 60,        // 1 minute - frequent updates
  MEDIUM: 300,      // 5 minutes - moderate updates  
  LONG: 1800,       // 30 minutes - stable data
  EXTENDED: 3600,   // 1 hour - static content
  DAY: 86400        // 1 day - rarely changing data
}

// Cache key generators
export const CacheKeys = {
  user: (id) => `user:${id}`,
  workshop: (id) => `workshop:${id}`,
  analytics: (workshopId, period) => `analytics:${workshopId}:${period}`,
  apiResponse: (endpoint, params) => `api:${endpoint}:${JSON.stringify(params)}`,
  chatHistory: (userId) => `chat:${userId}`,
  healthCheck: () => 'health:database',
  leads: (workshopId) => `leads:${workshopId}`,
  services: (workshopId) => `services:${workshopId}`
}

// Export singleton instance
export const cacheManager = new CacheManager()

export default cacheManager