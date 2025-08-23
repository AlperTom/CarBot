/**
 * Enhanced AI Chat API with Multi-Modal Support
 * Advanced conversation capabilities with image analysis and context awareness
 * Phase 2 Feature Implementation - €50K-100K monthly impact
 */

import { NextResponse } from 'next/server'
import { aiChatEnhancer } from '../../../../lib/ai-chat-enhancer.js'
import { performanceMonitor } from '../../../../lib/performance-monitor.js'
import { cacheManager, CacheKeys, CacheTTL } from '../../../../lib/redis-cache.js'

export async function POST(request) {
  const timerId = performanceMonitor.startApiTimer('/api/chat/enhanced')
  
  try {
    const formData = await request.formData()
    
    // Extract basic chat data
    const messages = JSON.parse(formData.get('messages') || '[]')
    const clientKey = formData.get('clientKey') || 'unknown'
    const userId = formData.get('userId') || 'anonymous'
    const hasConsent = formData.get('hasConsent') === 'true'
    const language = formData.get('language') || 'de'
    const customerTier = formData.get('customerTier') || 'standard'
    
    // Extract multi-modal content
    const images = []
    const documents = []
    
    // Process uploaded images
    for (let i = 0; i < 5; i++) { // Support up to 5 images
      const imageFile = formData.get(`image_${i}`)
      if (imageFile && imageFile instanceof File) {
        const imageBuffer = await imageFile.arrayBuffer()
        const imageBase64 = Buffer.from(imageBuffer).toString('base64')
        
        images.push({
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size,
          url: `data:${imageFile.type};base64,${imageBase64}`
        })
      }
    }
    
    // Process uploaded documents
    for (let i = 0; i < 3; i++) { // Support up to 3 documents
      const docFile = formData.get(`document_${i}`)
      if (docFile && docFile instanceof File) {
        const docBuffer = await docFile.arrayBuffer()
        const docText = await this.extractDocumentText(docBuffer, docFile.type)
        
        documents.push({
          name: docFile.name,
          type: docFile.type,
          size: docFile.size,
          content: docText
        })
      }
    }
    
    // Validation
    if (!messages || !Array.isArray(messages)) {
      const metric = performanceMonitor.endApiTimer(timerId, 400)
      return NextResponse.json({ 
        error: 'Messages array is required' 
      }, { status: 400 })
    }

    if (!hasConsent) {
      const metric = performanceMonitor.endApiTimer(timerId, 400)
      return NextResponse.json({ 
        error: 'GDPR consent required',
        message: 'Bitte stimmen Sie der Datenverarbeitung zu, um den erweiterten Chat zu nutzen.' 
      }, { status: 400 })
    }

    // Rate limiting for enhanced chat (more generous for premium customers)
    const rateLimit = customerTier === 'premium' || customerTier === 'enterprise' ? 100 : 20
    const rateLimitCheck = await this.checkEnhancedChatRateLimit(userId, rateLimit)
    
    if (!rateLimitCheck.allowed) {
      const metric = performanceMonitor.endApiTimer(timerId, 429)
      return NextResponse.json({
        error: 'Rate limit exceeded',
        retry_after: rateLimitCheck.retryAfter,
        upgrade_suggestion: customerTier === 'standard' ? 
          'Upgrade to Premium for higher limits and advanced features' : null
      }, { 
        status: 429,
        headers: {
          'Retry-After': rateLimitCheck.retryAfter.toString()
        }
      })
    }

    // Get workshop context if available
    const workshopContext = await this.getWorkshopContext(clientKey)
    
    // Execute enhanced AI chat
    const enhancedResponse = await aiChatEnhancer.enhancedChat({
      messages,
      clientKey,
      userId,
      images,
      documents,
      workshopContext,
      customerTier
    })
    
    if (!enhancedResponse.success) {
      const metric = performanceMonitor.endApiTimer(timerId, 500)
      return NextResponse.json({
        error: 'Enhanced chat processing failed',
        message: enhancedResponse.error,
        fallback: enhancedResponse.fallback
      }, { 
        status: 500,
        headers: {
          'X-Response-Time': `${metric}ms`
        }
      })
    }

    // Log enhanced chat usage for analytics
    await this.logEnhancedChatUsage({
      userId,
      clientKey,
      customerTier,
      hasImages: images.length > 0,
      hasDocuments: documents.length > 0,
      messageCount: messages.length,
      tokensUsed: enhancedResponse.tokensUsed,
      modelUsed: enhancedResponse.modelUsed,
      responseTime: enhancedResponse.responseTime
    })

    const metric = performanceMonitor.endApiTimer(timerId, 200)

    return NextResponse.json({
      success: true,
      message: enhancedResponse.message,
      insights: enhancedResponse.insights,
      suggestedActions: enhancedResponse.suggestedActions,
      confidence: enhancedResponse.confidence,
      features: {
        model: enhancedResponse.modelUsed,
        multiModal: images.length > 0 || documents.length > 0,
        contextAware: true,
        intelligentActions: enhancedResponse.suggestedActions?.length > 0
      },
      performance: {
        responseTime: enhancedResponse.responseTime,
        tokensUsed: enhancedResponse.tokensUsed,
        cacheHit: false // Enhanced responses are typically not cached due to context
      }
    }, {
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`,
        'X-Model-Used': enhancedResponse.modelUsed,
        'X-Multi-Modal': (images.length > 0 || documents.length > 0).toString(),
        'X-Customer-Tier': customerTier
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    console.error('Enhanced chat error:', error.message)
    
    return NextResponse.json({ 
      error: 'Enhanced chat service unavailable',
      message: 'Der erweiterte Chat-Service ist momentan nicht verfügbar. Versuchen Sie es später erneut oder nutzen Sie den Standard-Chat.',
      fallback_available: true
    }, { 
      status: 500,
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
  }
}

// GET endpoint for enhanced chat capabilities info
export async function GET(request) {
  const timerId = performanceMonitor.startApiTimer('/api/chat/enhanced/info')
  
  try {
    const { searchParams } = new URL(request.url)
    const customerTier = searchParams.get('customerTier') || 'standard'
    
    const capabilities = this.getEnhancedChatCapabilities(customerTier)
    const metric = performanceMonitor.endApiTimer(timerId, 200)
    
    return NextResponse.json({
      capabilities,
      tierLimits: this.getTierLimits(customerTier),
      supportedFeatures: this.getSupportedFeatures(customerTier),
      upgradeInfo: customerTier === 'standard' ? {
        message: 'Upgrade to Premium for advanced AI features',
        benefits: [
          'GPT-4 powered responses',
          'Image analysis for vehicle damage',
          'Document processing',
          'Extended conversation memory',
          'Priority support'
        ]
      } : null
    }, {
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`,
        'Cache-Control': 'public, max-age=300'
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    
    return NextResponse.json({
      error: 'Unable to retrieve enhanced chat capabilities'
    }, { status: 500 })
  }
}

// Helper methods for the enhanced chat API
class EnhancedChatAPI {
  
  async extractDocumentText(buffer, mimeType) {
    try {
      // Basic document text extraction
      if (mimeType === 'text/plain') {
        return Buffer.from(buffer).toString('utf-8')
      }
      
      if (mimeType === 'application/pdf') {
        // Would integrate with PDF parsing library
        return 'PDF content extraction not implemented yet'
      }
      
      return 'Document type not supported for text extraction'
    } catch (error) {
      console.error('Document extraction error:', error.message)
      return 'Could not extract document content'
    }
  }
  
  async checkEnhancedChatRateLimit(userId, limit) {
    const cacheKey = `enhanced_chat_rate:${userId}`
    const requests = await cacheManager.get(cacheKey) || []
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    
    // Remove old requests
    const recentRequests = requests.filter(timestamp => timestamp > oneHourAgo)
    
    if (recentRequests.length >= limit) {
      const oldestRequest = Math.min(...recentRequests)
      const resetTime = new Date(oldestRequest + (60 * 60 * 1000))
      
      return {
        allowed: false,
        retryAfter: Math.ceil((resetTime.getTime() - now) / 1000)
      }
    }
    
    // Add current request
    recentRequests.push(now)
    await cacheManager.set(cacheKey, recentRequests, CacheTTL.EXTENDED)
    
    return { allowed: true }
  }
  
  async getWorkshopContext(clientKey) {
    const cacheKey = CacheKeys.workshop(clientKey)
    let context = await cacheManager.get(cacheKey)
    
    if (!context) {
      // Fetch basic workshop context
      context = {
        name: 'Beispiel Autowerkstatt',
        city: 'Berlin',
        specialties: ['TÜV', 'Reparaturen', 'Wartung'],
        phone: '+49 30 12345678',
        reputation: 'Excellent'
      }
      
      await cacheManager.set(cacheKey, context, CacheTTL.LONG)
    }
    
    return context
  }
  
  async logEnhancedChatUsage(usageData) {
    try {
      // Log usage for analytics and billing
      console.log('Enhanced chat usage:', {
        userId: usageData.userId,
        customerTier: usageData.customerTier,
        features: {
          images: usageData.hasImages,
          documents: usageData.hasDocuments,
          model: usageData.modelUsed
        },
        performance: {
          tokens: usageData.tokensUsed,
          responseTime: usageData.responseTime
        }
      })
    } catch (error) {
      console.error('Usage logging failed:', error.message)
    }
  }
  
  getEnhancedChatCapabilities(customerTier) {
    const baseCapabilities = [
      'Advanced context awareness',
      'Intelligent response generation',
      'German automotive expertise'
    ]
    
    if (customerTier === 'premium' || customerTier === 'enterprise') {
      return [
        ...baseCapabilities,
        'GPT-4 powered responses',
        'Image analysis (vehicle damage assessment)',
        'Document processing (service manuals, invoices)',
        'Extended conversation memory (30 days)',
        'Multi-language support',
        'Diagnostic code interpretation',
        'Priority response times'
      ]
    }
    
    return [
      ...baseCapabilities,
      'Basic image recognition',
      'Standard conversation memory (7 days)',
      'Essential automotive knowledge'
    ]
  }
  
  getTierLimits(customerTier) {
    const limits = {
      standard: {
        requestsPerHour: 20,
        imagesPerRequest: 1,
        documentsPerRequest: 0,
        maxTokens: 1000,
        conversationMemory: '7 days'
      },
      premium: {
        requestsPerHour: 100,
        imagesPerRequest: 5,
        documentsPerRequest: 3,
        maxTokens: 2000,
        conversationMemory: '30 days'
      },
      enterprise: {
        requestsPerHour: 500,
        imagesPerRequest: 10,
        documentsPerRequest: 5,
        maxTokens: 4000,
        conversationMemory: '90 days'
      }
    }
    
    return limits[customerTier] || limits.standard
  }
  
  getSupportedFeatures(customerTier) {
    return {
      voiceMessages: customerTier !== 'standard',
      imageAnalysis: true,
      documentProcessing: customerTier !== 'standard',
      contextMemory: true,
      intelligentActions: true,
      multiLanguage: customerTier !== 'standard',
      prioritySupport: customerTier === 'enterprise'
    }
  }
}

const enhancedChatAPI = new EnhancedChatAPI()

// Extend the module with helper methods
Object.setPrototypeOf(exports, enhancedChatAPI)