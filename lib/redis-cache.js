/**
 * Redis caching layer for CarBot performance optimization
 * Implements intelligent caching strategies for API endpoints and database queries
 */

// In-memory cache fallback for development/environments without Redis
class MemoryCache {
  constructor() {
    this.cache = new Map()
    this.timestamps = new Map()
  }

  async get(key) {
    const data = this.cache.get(key)
    const timestamp = this.timestamps.get(key)
    
    if (!data || !timestamp) return null
    
    // Check if expired (default 5 minutes for memory cache)
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      this.cache.delete(key)
      this.timestamps.delete(key)
      return null
    }
    
    return JSON.parse(data)
  }

  async set(key, value, ttlSeconds = 300) {
    this.cache.set(key, JSON.stringify(value))
    this.timestamps.set(key, Date.now())
    
    // Auto-cleanup after TTL + buffer
    setTimeout(() => {
      this.cache.delete(key)
      this.timestamps.delete(key)
    }, (ttlSeconds + 60) * 1000)
  }

  async del(key) {
    this.cache.delete(key)
    this.timestamps.delete(key)
  }

  async flushall() {
    this.cache.clear()
    this.timestamps.clear()
  }

  // Get cache statistics
  getStats() {
    return {
      type: 'memory',
      keys: this.cache.size,
      memory_usage: JSON.stringify([...this.cache.values()]).length,
      hit_ratio: 'N/A (memory cache)'
    }
  }
}

// Redis cache implementation
class RedisCache {
  constructor() {
    this.client = null
    this.isConnected = false
    this.connectionAttempts = 0
    this.maxRetries = 3
    
    this.init()
  }

  async init() {
    if (!process.env.REDIS_URL) {
      console.log('Redis URL not found, using memory cache fallback')
      return
    }

    try {
      // Dynamic import for Redis client
      const { createClient } = await import('redis')
      
      this.client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000,
          lazyConnect: true,
          reconnectDelay: Math.min(this.connectionAttempts * 100, 3000)
        },
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('Redis connection refused')
            return new Error('Redis connection refused')
          }
          
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Redis retry time exhausted')
          }
          
          if (options.attempt > this.maxRetries) {
            return undefined
          }
          
          return Math.min(options.attempt * 100, 3000)
        }
      })

      this.client.on('error', (err) => {
        console.error('Redis client error:', err)
        this.isConnected = false
      })

      this.client.on('connect', () => {
        console.log('Redis client connected')
        this.isConnected = true
        this.connectionAttempts = 0
      })

      this.client.on('disconnect', () => {
        console.log('Redis client disconnected')
        this.isConnected = false
      })

      await this.client.connect()
      
    } catch (error) {
      console.error('Failed to initialize Redis:', error)
      this.connectionAttempts++
      
      // Exponential backoff for reconnection
      setTimeout(() => this.init(), Math.min(this.connectionAttempts * 1000, 10000))
    }
  }

  async get(key) {
    if (!this.isConnected || !this.client) return null
    
    try {
      const data = await this.client.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  }

  async set(key, value, ttlSeconds = 300) {
    if (!this.isConnected || !this.client) return
    
    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value))
    } catch (error) {
      console.error('Redis SET error:', error)
    }
  }

  async del(key) {
    if (!this.isConnected || !this.client) return
    
    try {
      await this.client.del(key)
    } catch (error) {
      console.error('Redis DEL error:', error)
    }
  }

  async flushall() {
    if (!this.isConnected || !this.client) return
    
    try {
      await this.client.flushAll()
    } catch (error) {
      console.error('Redis FLUSHALL error:', error)
    }
  }

  // Get Redis statistics
  async getStats() {
    if (!this.isConnected || !this.client) {
      return { type: 'redis', status: 'disconnected' }
    }
    
    try {
      const info = await this.client.info('memory')
      const keyspace = await this.client.info('keyspace')
      
      return {
        type: 'redis',
        status: 'connected',
        memory_usage: this.parseInfoValue(info, 'used_memory_human'),
        keys: this.parseKeyspaceInfo(keyspace),
        hit_ratio: this.parseInfoValue(info, 'keyspace_hits') || 'N/A'
      }
    } catch (error) {
      console.error('Redis STATS error:', error)
      return { type: 'redis', status: 'error', error: error.message }
    }
  }

  parseInfoValue(info, key) {
    const match = info.match(new RegExp(`${key}:([^\\r\\n]+)`))?.[1]
    return match?.trim()
  }

  parseKeyspaceInfo(keyspace) {
    const match = keyspace.match(/keys=(\d+)/)?.[1]
    return match ? parseInt(match, 10) : 0
  }
}

// Cache configuration and strategies
const CACHE_STRATEGIES = {
  // API endpoint caching
  leads: { ttl: 120, pattern: 'leads:*' },
  analytics: { ttl: 300, pattern: 'analytics:*' },
  workshops: { ttl: 600, pattern: 'workshop:*' },
  
  // Database query caching
  queries: { ttl: 180, pattern: 'query:*' },
  
  // Static data caching  
  static: { ttl: 3600, pattern: 'static:*' },
  
  // Session data
  sessions: { ttl: 1800, pattern: 'session:*' }
}

// Initialize cache (Redis with memory fallback)
let cacheInstance = null

async function initCache() {
  if (cacheInstance) return cacheInstance
  
  if (process.env.REDIS_URL) {
    cacheInstance = new RedisCache()
    
    // Fallback to memory cache if Redis fails after timeout
    setTimeout(async () => {
      if (!cacheInstance.isConnected) {
        console.log('Redis connection timeout, falling back to memory cache')
        cacheInstance = new MemoryCache()
      }
    }, 10000)
  } else {
    cacheInstance = new MemoryCache()
  }
  
  return cacheInstance
}

// High-level cache operations
export class CacheManager {
  constructor() {
    this.cache = null
    this.hitCount = 0
    this.missCount = 0
    this.init()
  }

  async init() {
    this.cache = await initCache()
  }

  /**
   * Get cached data with automatic deserialization
   */
  async get(key, defaultValue = null) {
    if (!this.cache) await this.init()
    
    try {
      const data = await this.cache.get(key)
      
      if (data !== null) {
        this.hitCount++
        return data
      } else {
        this.missCount++
        return defaultValue
      }
    } catch (error) {
      console.error('Cache GET error:', error)
      this.missCount++
      return defaultValue
    }
  }

  /**
   * Set cached data with automatic serialization and TTL
   */
  async set(key, value, ttlSeconds) {
    if (!this.cache) await this.init()
    
    // Auto-determine TTL based on cache strategy
    if (!ttlSeconds) {
      for (const [strategy, config] of Object.entries(CACHE_STRATEGIES)) {
        if (key.match(new RegExp(config.pattern.replace('*', '.*')))) {
          ttlSeconds = config.ttl
          break
        }
      }
      ttlSeconds = ttlSeconds || 300 // Default 5 minutes
    }
    
    try {
      await this.cache.set(key, value, ttlSeconds)
    } catch (error) {
      console.error('Cache SET error:', error)
    }
  }

  /**
   * Delete cached data
   */
  async delete(key) {
    if (!this.cache) await this.init()
    
    try {
      await this.cache.del(key)
    } catch (error) {
      console.error('Cache DELETE error:', error)
    }
  }

  /**
   * Clear all cache data
   */
  async clear() {
    if (!this.cache) await this.init()
    
    try {
      await this.cache.flushall()
      this.hitCount = 0
      this.missCount = 0
    } catch (error) {
      console.error('Cache CLEAR error:', error)
    }
  }

  /**
   * Get cache statistics and performance metrics
   */
  async getStats() {
    if (!this.cache) await this.init()
    
    const baseStats = await this.cache.getStats()
    const total = this.hitCount + this.missCount
    
    return {
      ...baseStats,
      hits: this.hitCount,
      misses: this.missCount,
      hit_ratio: total > 0 ? ((this.hitCount / total) * 100).toFixed(2) + '%' : '0%',
      total_requests: total
    }
  }

  /**
   * Cached function execution with automatic key generation
   */
  async cached(key, fn, ttlSeconds) {
    const cachedResult = await this.get(key)
    
    if (cachedResult !== null) {
      return cachedResult
    }
    
    try {
      const result = await fn()
      await this.set(key, result, ttlSeconds)
      return result
    } catch (error) {
      console.error('Cached function execution error:', error)
      throw error
    }
  }

  /**
   * Batch cache operations for better performance
   */
  async batchGet(keys) {
    const results = {}
    
    for (const key of keys) {
      results[key] = await this.get(key)
    }
    
    return results
  }

  async batchSet(entries, defaultTTL = 300) {
    const promises = entries.map(({ key, value, ttl }) => 
      this.set(key, value, ttl || defaultTTL)
    )
    
    await Promise.all(promises)
  }
}

// Global cache manager instance
export const cache = new CacheManager()

// Utility functions for common caching patterns
export function createCacheKey(prefix, ...parts) {
  return `${prefix}:${parts.filter(p => p != null).join(':')}`
}

export function hashCacheKey(data) {
  // Simple hash function for cache keys
  let hash = 0
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

// Cache warming strategies
export async function warmCache() {
  console.log('Starting cache warming...')
  
  try {
    // Warm up common queries
    const warmupTasks = [
      // Pre-cache workshop context for active workshops
      { key: 'static:workshop-list', ttl: 3600 },
      
      // Pre-cache analytics data for recent periods
      { key: 'static:analytics-defaults', ttl: 900 }
    ]
    
    // Execute warmup tasks
    await Promise.allSettled(warmupTasks.map(async (task) => {
      const data = await generateWarmupData(task.key)
      await cache.set(task.key, data, task.ttl)
    }))
    
    console.log('Cache warming completed')
  } catch (error) {
    console.error('Cache warming failed:', error)
  }
}

async function generateWarmupData(key) {
  switch (key) {
    case 'static:workshop-list':
      return { workshops: [], lastUpdated: new Date().toISOString() }
    
    case 'static:analytics-defaults':
      return { periods: ['7d', '30d', '90d'], lastUpdated: new Date().toISOString() }
    
    default:
      return { cached: true, timestamp: new Date().toISOString() }
  }
}

// Export cache instance for direct usage
export default cache