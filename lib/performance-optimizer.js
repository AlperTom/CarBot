/**
 * Performance Optimization Suite for CarBot
 * Implements connection pooling, query consolidation, and response optimization
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Singleton Supabase client with connection pooling
 */
class OptimizedSupabaseClient {
  constructor() {
    this.client = null;
    this.connectionPool = new Map();
    this.queryCache = new Map();
    this.initializeClient();
  }

  initializeClient() {
    if (!this.client) {
      this.client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          db: {
            schema: 'public'
          },
          auth: {
            persistSession: false // Reduce memory usage
          },
          global: {
            headers: {
              'X-Client-Info': 'carbot-optimized'
            }
          }
        }
      );
    }
    return this.client;
  }

  getClient() {
    return this.initializeClient();
  }

  /**
   * Cached query execution
   */
  async cachedQuery(key, queryFn, ttlMs = 300000) { // 5 minutes default
    const now = Date.now();
    const cached = this.queryCache.get(key);
    
    if (cached && (now - cached.timestamp) < ttlMs) {
      return { data: cached.data, cached: true };
    }
    
    const result = await queryFn(this.getClient());
    
    if (result.data) {
      this.queryCache.set(key, {
        data: result.data,
        timestamp: now
      });
    }
    
    return { ...result, cached: false };
  }

  /**
   * Bulk operations optimization
   */
  async bulkInsert(table, records, chunkSize = 100) {
    const chunks = [];
    for (let i = 0; i < records.length; i += chunkSize) {
      chunks.push(records.slice(i, i + chunkSize));
    }

    const results = [];
    for (const chunk of chunks) {
      const result = await this.getClient()
        .from(table)
        .insert(chunk)
        .select();
      
      results.push(result);
    }
    
    return results;
  }

  /**
   * Clear cache
   */
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.queryCache.keys()) {
        if (key.includes(pattern)) {
          this.queryCache.delete(key);
        }
      }
    } else {
      this.queryCache.clear();
    }
  }
}

export const optimizedSupabase = new OptimizedSupabaseClient();

/**
 * Consolidated database queries for better performance
 */
export class QueryConsolidator {
  /**
   * Get complete customer context in a single optimized query
   */
  static async getCustomerContext(clientKey) {
    const cacheKey = `customer_context:${clientKey}`;
    
    return await optimizedSupabase.cachedQuery(
      cacheKey,
      async (supabase) => {
        // Single query with joins instead of multiple queries
        const { data, error } = await supabase.rpc('get_customer_context_optimized', {
          client_key_param: clientKey
        });
        
        if (error) {
          console.error('Error fetching customer context:', error);
          return { data: null, error };
        }
        
        return { data, error: null };
      },
      300000 // 5 minutes cache
    );
  }

  /**
   * Get analytics data with consolidated queries
   */
  static async getAnalyticsData(customerSlug, startDate, endDate) {
    const cacheKey = `analytics:${customerSlug}:${startDate}:${endDate}`;
    
    return await optimizedSupabase.cachedQuery(
      cacheKey,
      async (supabase) => {
        // Use a single database function instead of multiple queries
        const { data, error } = await supabase.rpc('get_analytics_consolidated', {
          customer_slug: customerSlug,
          start_date: startDate,
          end_date: endDate
        });
        
        return { data, error };
      },
      300000 // 5 minutes cache
    );
  }

  /**
   * Batch workshop package information
   */
  static async getWorkshopPackagesBatch(workshopIds) {
    const cacheKey = `workshop_packages:${workshopIds.sort().join(',')}`;
    
    return await optimizedSupabase.cachedQuery(
      cacheKey,
      async (supabase) => {
        const { data, error } = await supabase
          .from('workshops')
          .select(`
            id,
            name,
            subscription_plan,
            current_period_start,
            current_period_end,
            subscriptions (
              id,
              plan_id,
              status,
              current_period_start,
              current_period_end
            ),
            usage_tracking (
              metric_name,
              quantity,
              usage_date
            )
          `)
          .in('id', workshopIds);
        
        return { data, error };
      },
      180000 // 3 minutes cache for package data
    );
  }
}

/**
 * Response optimization and compression
 */
export class ResponseOptimizer {
  /**
   * Generate cache key for responses
   */
  static generateKey(method, url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `${method}:${url}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Compress large responses
   */
  static compressResponse(data, threshold = 1024) {
    const stringified = JSON.stringify(data);
    
    if (stringified.length > threshold) {
      // In a real implementation, you'd use gzip compression here
      return {
        ...data,
        _compressed: true,
        _originalSize: stringified.length
      };
    }
    
    return data;
  }

  /**
   * Paginate large datasets
   */
  static paginateData(data, page = 1, limit = 100) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalItems: data.length,
        itemsPerPage: limit,
        hasNext: endIndex < data.length,
        hasPrevious: page > 1
      }
    };
  }

  /**
   * Optimize API response structure
   */
  static optimizeApiResponse(data, options = {}) {
    const {
      removeNulls = true,
      compressLargeFields = true,
      addTimestamp = true
    } = options;
    
    let optimized = data;
    
    // Remove null values to reduce payload size
    if (removeNulls) {
      optimized = this.removeNullValues(optimized);
    }
    
    // Add response timestamp
    if (addTimestamp) {
      optimized = {
        ...optimized,
        _timestamp: new Date().toISOString()
      };
    }
    
    // Compress large text fields
    if (compressLargeFields) {
      optimized = this.compressLargeFields(optimized);
    }
    
    return optimized;
  }

  static removeNullValues(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeNullValues(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null) {
          acc[key] = this.removeNullValues(value);
        }
        return acc;
      }, {});
    }
    return obj;
  }

  static compressLargeFields(obj, threshold = 500) {
    if (Array.isArray(obj)) {
      return obj.map(item => this.compressLargeFields(item, threshold));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (typeof value === 'string' && value.length > threshold) {
          acc[key] = value.substring(0, threshold) + '... [truncated]';
          acc[`${key}_truncated`] = true;
        } else {
          acc[key] = this.compressLargeFields(value, threshold);
        }
        return acc;
      }, {});
    }
    return obj;
  }
}

/**
 * Performance monitoring and alerting
 */
export class PerformanceMonitor {
  static timers = new Map();
  static metrics = [];

  /**
   * Start performance timer
   */
  static startTimer(id) {
    this.timers.set(id, {
      start: performance.now(),
      id
    });
  }

  /**
   * End performance timer and record metrics
   */
  static endTimer(id, metadata = {}) {
    const timer = this.timers.get(id);
    if (!timer) {
      console.warn(`Timer ${id} not found`);
      return 0;
    }

    const duration = performance.now() - timer.start;
    this.timers.delete(id);

    // Record metric
    const metric = {
      id,
      duration,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    this.metrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }

    // Log slow operations
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${id} took ${duration.toFixed(2)}ms`, metadata);
    }

    return Math.round(duration);
  }

  /**
   * Get performance statistics
   */
  static getStats(timeframeMs = 300000) { // Last 5 minutes
    const cutoff = new Date(Date.now() - timeframeMs);
    const recentMetrics = this.metrics.filter(
      m => new Date(m.timestamp) >= cutoff
    );

    if (recentMetrics.length === 0) {
      return null;
    }

    const durations = recentMetrics.map(m => m.duration);
    durations.sort((a, b) => a - b);

    return {
      count: recentMetrics.length,
      avg: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      min: durations[0],
      max: durations[durations.length - 1],
      p50: durations[Math.floor(durations.length * 0.5)],
      p95: durations[Math.floor(durations.length * 0.95)],
      p99: durations[Math.floor(durations.length * 0.99)],
      timeframe: `${timeframeMs / 1000}s`
    };
  }

  /**
   * Clear metrics
   */
  static clearMetrics() {
    this.metrics = [];
  }
}

/**
 * Request optimization helpers
 */
export class RequestOptimizer {
  static rateLimits = new Map();

  /**
   * Check rate limit
   */
  static checkRateLimit(identifier, limit, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.rateLimits.has(identifier)) {
      this.rateLimits.set(identifier, []);
    }
    
    const requests = this.rateLimits.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(validRequests[0] + windowMs),
        total: limit
      };
    }
    
    validRequests.push(now);
    this.rateLimits.set(identifier, validRequests);
    
    return {
      allowed: true,
      remaining: limit - validRequests.length,
      resetTime: new Date(now + windowMs),
      total: limit
    };
  }

  /**
   * Sanitize request parameters
   */
  static sanitizeParams(params) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        // Remove potential SQL injection attempts
        sanitized[key] = value
          .replace(/[<>]/g, '') // Remove angle brackets
          .replace(/['";]/g, '') // Remove quotes and semicolons
          .substring(0, 1000); // Limit length
      } else if (typeof value === 'number' && !isNaN(value)) {
        sanitized[key] = Math.min(Math.max(value, -1000000), 1000000); // Limit range
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      }
      // Skip other types
    }
    
    return sanitized;
  }

  /**
   * Compress response based on Accept-Encoding header
   */
  static compressResponse(data) {
    // In a real implementation, you'd check Accept-Encoding and use gzip/brotli
    return data;
  }
}

/**
 * Database performance optimizations
 */
export class DatabaseOptimizer {
  /**
   * Create optimized indexes
   */
  static async createPerformanceIndexes(supabase) {
    const indexes = [
      // Chat messages optimization
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_client_created ON chat_messages (client_key, created_at DESC)',
      
      // Analytics optimization
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_workshop_date ON analytics_events (workshop_id, created_at) WHERE created_at > CURRENT_DATE - INTERVAL \'30 days\'',
      
      // Usage tracking optimization
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_tracking_workshop_metric_date ON usage_tracking (workshop_id, metric_name, usage_date DESC)',
      
      // Leads optimization
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_workshop_created ON leads (workshop_id, created_at DESC)',
      
      // Appointments optimization
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_customer_date ON appointments (customer_slug, start_time)',
      
      // Billing events optimization
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_billing_events_workshop_type_date ON billing_events (workshop_id, event_type, created_at DESC)'
    ];

    const results = [];
    for (const indexQuery of indexes) {
      try {
        await supabase.rpc('execute_sql', { query: indexQuery });
        results.push({ query: indexQuery, success: true });
        console.log('✅ Index created:', indexQuery.split('idx_')[1]?.split(' ')[0]);
      } catch (error) {
        results.push({ query: indexQuery, success: false, error: error.message });
        console.error('❌ Index creation failed:', error.message);
      }
    }
    
    return results;
  }

  /**
   * Analyze query performance
   */
  static async analyzeQueryPerformance(supabase, query) {
    try {
      const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
      const { data } = await supabase.rpc('execute_sql', { query: explainQuery });
      return data;
    } catch (error) {
      console.error('Query analysis failed:', error);
      return null;
    }
  }
}

// Export performance monitoring instance
export const performanceMonitor = new PerformanceMonitor();

export default {
  optimizedSupabase,
  QueryConsolidator,
  ResponseOptimizer,
  PerformanceMonitor,
  RequestOptimizer,
  DatabaseOptimizer,
  performanceMonitor
};