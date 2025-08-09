/**
 * CarBot Performance Monitoring Stack
 * Real User Monitoring optimized for German automotive workshops
 * Targets: API <200ms, Widget <2s, Landing <3s, DB <50ms
 */

class CarBotPerformanceMonitor {
  constructor(options = {}) {
    this.clientKey = options.clientKey || null
    this.apiEndpoint = options.apiEndpoint || '/api/analytics/web-vitals'
    this.sessionId = this.generateSessionId()
    this.metrics = []
    this.isAutomotiveWorkshop = options.automotive || false
    
    // CarBot performance targets for German market leadership
    this.targets = {
      LCP: 2500,  // Largest Contentful Paint < 2.5s
      FID: 100,   // First Input Delay < 100ms
      CLS: 0.1,   // Cumulative Layout Shift < 0.1
      FCP: 1800,  // First Contentful Paint < 1.8s
      TTFB: 600   // Time to First Byte < 600ms
    }
    
    this.init()
  }
  
  generateSessionId() {
    return `carbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  init() {
    if (typeof window === 'undefined') return
    
    // Initialize Web Vitals monitoring for CarBot
    this.initWebVitals()
    this.initCustomMetrics()
    this.initNavigationTiming()
    
    // Send metrics when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.sendMetrics(true) // Immediate send
    })
    
    // Send metrics periodically for long sessions
    setInterval(() => {
      this.sendMetrics()
    }, 30000) // Every 30 seconds
  }
  
  initWebVitals() {
    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.onVital.bind(this))
      getFID(this.onVital.bind(this))
      getFCP(this.onVital.bind(this))
      getLCP(this.onVital.bind(this))
      getTTFB(this.onVital.bind(this))
    }).catch(error => {
      console.warn('CarBot: Web Vitals not available', error)
    })
  }
  
  onVital(vital) {
    // Enhance vital with CarBot automotive context
    const enhancedVital = {
      ...vital,
      type: 'web-vital',
      clientKey: this.clientKey,
      automotive: this.isAutomotiveWorkshop,
      target: this.targets[vital.name],
      performance: this.getPerformanceRating(vital.name, vital.value),
      timestamp: Date.now()
    }
    
    this.metrics.push(enhancedVital)
    
    // Log performance issues for German automotive quality standards
    if (enhancedVital.performance === 'poor') {
      console.warn(`CarBot Performance Alert: ${vital.name} is ${vital.value}, target: <${this.targets[vital.name]}`)
    }
  }
  
  getPerformanceRating(metric, value) {
    const target = this.targets[metric]
    if (!target) return 'unknown'
    
    if (metric === 'CLS') {
      if (value <= 0.1) return 'good'
      if (value <= 0.25) return 'needs-improvement'
      return 'poor'
    } else {
      if (value <= target) return 'good'
      if (value <= target * 1.5) return 'needs-improvement'
      return 'poor'
    }
  }
  
  initCustomMetrics() {
    // CarBot-specific automotive metrics
    this.trackCustomMetric('carbot_widget_load_time', this.measureWidgetLoadTime.bind(this))
    this.trackCustomMetric('carbot_chat_response_time', this.measureChatResponseTime.bind(this))
    this.trackCustomMetric('automotive_conversion_funnel', this.trackConversionFunnel.bind(this))
  }
  
  measureWidgetLoadTime() {
    const widgetElement = document.querySelector('[data-carbot-widget]')
    if (!widgetElement) return null
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('carbot') || entry.name.includes('widget')) {
          this.addCustomMetric('widget_load_time', entry.duration, {
            resource: entry.name,
            automotive_optimized: true
          })
        }
      }
    })
    
    observer.observe({ entryTypes: ['resource', 'measure'] })
  }
  
  measureChatResponseTime() {
    // Track chat response times for automotive customer service
    window.addEventListener('carbot-chat-sent', (event) => {
      const startTime = performance.now()
      
      window.addEventListener('carbot-chat-response', (responseEvent) => {
        const responseTime = performance.now() - startTime
        this.addCustomMetric('chat_response_time', responseTime, {
          automotive_query: event.detail?.automotive || false,
          german_language: event.detail?.language === 'de'
        })
      }, { once: true })
    })
  }
  
  trackConversionFunnel() {
    // Track automotive-specific conversion events
    const automotiveEvents = [
      'workshop_contact_viewed',
      'service_inquiry_started',
      'appointment_booking_clicked',
      'phone_number_clicked',
      'location_viewed'
    ]
    
    automotiveEvents.forEach(eventName => {
      window.addEventListener(eventName, (event) => {
        this.addCustomMetric('conversion_event', 1, {
          event: eventName,
          automotive_context: true,
          workshop_type: event.detail?.workshopType,
          timestamp: Date.now()
        })
      })
    })
  }
  
  addCustomMetric(name, value, metadata = {}) {
    this.metrics.push({
      type: 'custom',
      name: name,
      value: value,
      metadata: {
        ...metadata,
        automotive: this.isAutomotiveWorkshop,
        clientKey: this.clientKey
      },
      timestamp: Date.now()
    })
  }
  
  initNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0]
        if (navigation) {
          this.metrics.push({
            type: 'navigation',
            metrics: {
              dns: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp: navigation.connectEnd - navigation.connectStart,
              request: navigation.responseStart - navigation.requestStart,
              response: navigation.responseEnd - navigation.responseStart,
              dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              load: navigation.loadEventEnd - navigation.loadEventStart
            },
            url: window.location.href,
            automotive: this.isAutomotiveWorkshop,
            timestamp: Date.now()
          })
        }
      }, 0)
    })
  }
  
  trackCustomEvent(eventName, data = {}) {
    this.addCustomMetric(eventName, 1, {
      ...data,
      custom_event: true
    })
  }
  
  async sendMetrics(immediate = false) {
    if (this.metrics.length === 0) return
    
    const metricsToSend = [...this.metrics]
    this.metrics = [] // Clear sent metrics
    
    const payload = {
      metrics: metricsToSend,
      session_id: this.sessionId,
      immediate: immediate,
      automotive: this.isAutomotiveWorkshop,
      client_key: this.clientKey,
      url: window.location.href,
      user_agent: navigator.userAgent,
      timestamp: Date.now()
    }
    
    try {
      if (immediate && navigator.sendBeacon) {
        // Use sendBeacon for reliable data transmission on page unload
        navigator.sendBeacon(
          this.apiEndpoint,
          JSON.stringify(payload)
        )
      } else {
        // Regular fetch for non-critical metrics
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Key': this.clientKey || 'unknown'
          },
          body: JSON.stringify(payload)
        })
      }
    } catch (error) {
      console.warn('CarBot: Failed to send performance metrics', error)
      // Re-add metrics to queue for retry
      this.metrics.unshift(...metricsToSend)
    }
  }
  
  // Public API for manual performance tracking
  startMeasure(name) {
    performance.mark(`${name}-start`)
  }
  
  endMeasure(name, metadata = {}) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name, 'measure')[0]
    if (measure) {
      this.addCustomMetric(name, measure.duration, metadata)
    }
  }
  
  // Get current performance summary for dashboard
  getPerformanceSummary() {
    const webVitals = this.metrics
      .filter(m => m.type === 'web-vital')
      .reduce((acc, vital) => {
        acc[vital.name] = {
          value: vital.value,
          rating: vital.performance,
          target: vital.target
        }
        return acc
      }, {})
    
    const customMetrics = this.metrics
      .filter(m => m.type === 'custom')
      .reduce((acc, metric) => {
        if (!acc[metric.name]) acc[metric.name] = []
        acc[metric.name].push(metric.value)
        return acc
      }, {})
    
    return {
      session_id: this.sessionId,
      web_vitals: webVitals,
      custom_metrics: customMetrics,
      automotive_optimized: this.isAutomotiveWorkshop,
      carbot_performance_score: this.calculateCarBotScore(webVitals)
    }
  }
  
  calculateCarBotScore(webVitals) {
    const scores = { good: 100, 'needs-improvement': 75, poor: 50 }
    const weights = { LCP: 0.3, FID: 0.3, CLS: 0.2, FCP: 0.1, TTFB: 0.1 }
    
    let weightedScore = 0
    let totalWeight = 0
    
    Object.entries(webVitals).forEach(([vital, data]) => {
      const weight = weights[vital] || 0.1
      const score = scores[data.rating] || 50
      
      weightedScore += score * weight
      totalWeight += weight
    })
    
    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 50
  }
}

// Export for CarBot automotive SaaS platform
export default CarBotPerformanceMonitor

// Auto-initialize for CarBot workshops
if (typeof window !== 'undefined') {
  window.CarBotPerformanceMonitor = CarBotPerformanceMonitor
  
  // Initialize with automotive context if available
  const automotiveContext = window.carbot_config?.automotive || false
  const clientKey = window.carbot_config?.client_key || null
  
  if (clientKey) {
    window.carbot_monitor = new CarBotPerformanceMonitor({
      clientKey: clientKey,
      automotive: automotiveContext
    })
  }
}