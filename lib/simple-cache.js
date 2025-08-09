/**
 * Simple in-memory cache for CarBot
 * Lightweight alternative to node-cache for automotive SaaS
 */

class SimpleCache {
  constructor(options = {}) {
    this.cache = new Map()
    this.ttl = options.stdTTL || 300 // 5 minutes default
    this.maxKeys = options.maxKeys || 1000
    
    // Cleanup interval
    if (typeof window === 'undefined') { // Server-side only
      setInterval(() => this.cleanup(), 60000) // Every minute
    }
  }

  set(key, value, ttl = null) {
    const expireTime = Date.now() + ((ttl || this.ttl) * 1000)
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxKeys) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, {
      value,
      expireTime
    })
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    if (Date.now() > item.expireTime) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expireTime) {
        this.cache.delete(key)
      }
    }
  }

  stats() {
    return {
      keys: this.cache.size,
      maxKeys: this.maxKeys,
      usage: (this.cache.size / this.maxKeys * 100).toFixed(1) + '%'
    }
  }
}

// Export for CarBot automotive SaaS
export default SimpleCache

// Create singleton instance for server-side use
let cacheInstance = null

export function getCache(options = {}) {
  if (!cacheInstance) {
    cacheInstance = new SimpleCache(options)
  }
  return cacheInstance
}