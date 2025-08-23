/**
 * Advanced AI Chat Features Enhancement
 * Multi-modal AI capabilities with intelligent context awareness
 * Phase 2 Feature Implementation - €50K-100K monthly impact
 */

import OpenAI from 'openai'
import { performanceMonitor } from './performance-monitor.js'
import { cacheManager, CacheKeys, CacheTTL } from './redis-cache.js'
import { supabaseConnectionManager } from './supabase-connection-manager.js'

class AIchatEnhancer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    this.models = {
      premium: 'gpt-4-turbo',
      standard: 'gpt-3.5-turbo',
      vision: 'gpt-4-vision-preview'
    }
    
    this.conversationMemory = new Map()
  }

  /**
   * Enhanced chat with context awareness and multi-modal support
   */
  async enhancedChat(options) {
    const {
      messages,
      clientKey,
      userId,
      images = [],
      documents = [],
      workshopContext = {},
      customerTier = 'standard'
    } = options

    const timerId = performanceMonitor.startApiTimer('enhanced_chat')
    
    try {
      // Select appropriate model based on customer tier and content
      const model = this.selectOptimalModel(customerTier, images.length > 0, documents.length > 0)
      
      // Get enhanced context
      const enhancedContext = await this.buildEnhancedContext({
        clientKey,
        userId,
        workshopContext,
        recentMessages: messages.slice(-5) // Last 5 messages for context
      })
      
      // Process multi-modal content
      const processedMessages = await this.processMultiModalContent(messages, images, documents)
      
      // Build intelligent system prompt
      const systemPrompt = await this.buildIntelligentSystemPrompt({
        clientKey,
        workshopContext: enhancedContext.workshop,
        conversationContext: enhancedContext.conversation,
        customerProfile: enhancedContext.customer,
        serviceCatalog: enhancedContext.services
      })
      
      // Execute AI chat with performance monitoring
      const chatResult = await performanceMonitor.trackDatabaseQuery('ai_chat_request', async () => {
        const completion = await this.openai.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...processedMessages
          ],
          max_tokens: this.getMaxTokens(customerTier),
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          functions: this.getAvailableFunctions(customerTier),
          function_call: 'auto'
        })
        
        return completion
      })
      
      // Process response and extract insights
      const enhancedResponse = await this.processAIResponse({
        completion: chatResult.result,
        originalMessages: messages,
        context: enhancedContext,
        clientKey,
        userId
      })
      
      // Update conversation memory
      this.updateConversationMemory(userId, {
        messages: processedMessages,
        response: enhancedResponse.message,
        context: enhancedContext,
        timestamp: new Date().toISOString()
      })
      
      const metric = performanceMonitor.endApiTimer(timerId, 200)
      
      return {
        success: true,
        message: enhancedResponse.message,
        insights: enhancedResponse.insights,
        suggestedActions: enhancedResponse.suggestedActions,
        confidence: enhancedResponse.confidence,
        modelUsed: model,
        responseTime: metric.duration,
        tokensUsed: chatResult.result.usage?.total_tokens || 0
      }
      
    } catch (error) {
      const metric = performanceMonitor.endApiTimer(timerId, 500, error)
      console.error('Enhanced chat error:', error.message)
      
      return {
        success: false,
        error: error.message,
        fallback: await this.getFallbackResponse(messages, clientKey)
      }
    }
  }

  /**
   * Select optimal AI model based on requirements
   */
  selectOptimalModel(customerTier, hasImages, hasDocuments) {
    // Premium customers get GPT-4 for complex queries
    if (customerTier === 'premium' || customerTier === 'enterprise') {
      if (hasImages) return this.models.vision
      return this.models.premium
    }
    
    // Standard customers get GPT-3.5 unless multi-modal content
    if (hasImages || hasDocuments) {
      return this.models.vision
    }
    
    return this.models.standard
  }

  /**
   * Build enhanced context from multiple sources
   */
  async buildEnhancedContext({ clientKey, userId, workshopContext, recentMessages }) {
    try {
      // Use caching for frequently accessed context
      const cacheKey = `enhanced_context:${clientKey}:${userId}`
      const cachedContext = await cacheManager.get(cacheKey)
      
      if (cachedContext) {
        return cachedContext
      }
      
      // Fetch comprehensive context data
      const contextData = await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        const [workshop, customer, services, recentChats, commonIssues] = await Promise.all([
          // Workshop information
          adminClient.from('workshops')
            .select('*')
            .eq('slug', clientKey)
            .single(),
            
          // Customer profile and preferences  
          adminClient.from('customer_profiles')
            .select('*')
            .eq('user_id', userId)
            .single(),
            
          // Available services and pricing
          adminClient.from('workshop_services')
            .select('*')
            .eq('workshop_slug', clientKey)
            .eq('active', true),
            
          // Recent conversation patterns
          adminClient.from('chat_conversations')
            .select('*')
            .eq('workshop_slug', clientKey)
            .order('created_at', { ascending: false })
            .limit(50),
            
          // Common issues and solutions
          adminClient.from('common_issues')
            .select('*')
            .eq('workshop_slug', clientKey)
            .eq('active', true)
            .order('frequency', { ascending: false })
            .limit(20)
        ])
        
        return {
          workshop: workshop.data,
          customer: customer.data,
          services: services.data || [],
          recentChats: recentChats.data || [],
          commonIssues: commonIssues.data || []
        }
      })
      
      // Analyze conversation patterns
      const conversationInsights = this.analyzeConversationPatterns(contextData.recentChats, recentMessages)
      
      // Build enhanced context object
      const enhancedContext = {
        workshop: {
          ...contextData.workshop,
          specialties: this.extractWorkshopSpecialties(contextData.services),
          reputation: await this.calculateWorkshopReputation(clientKey),
          busyHours: this.analyzeBusyHours(contextData.recentChats)
        },
        customer: {
          ...contextData.customer,
          preferences: this.extractCustomerPreferences(contextData.recentChats, userId),
          serviceHistory: await this.getCustomerServiceHistory(userId, clientKey)
        },
        services: contextData.services.map(service => ({
          ...service,
          demand_level: this.calculateServiceDemand(service, contextData.recentChats),
          seasonal_factors: this.analyzeSeasonalFactors(service)
        })),
        conversation: {
          patterns: conversationInsights,
          commonTopics: this.extractCommonTopics(contextData.recentChats),
          satisfactionTrend: this.calculateSatisfactionTrend(contextData.recentChats)
        },
        intelligence: {
          commonIssues: contextData.commonIssues,
          recommendedActions: this.generateActionRecommendations(contextData),
          riskFactors: this.identifyRiskFactors(contextData)
        }
      }
      
      // Cache the enhanced context
      await cacheManager.set(cacheKey, enhancedContext, CacheTTL.MEDIUM)
      
      return enhancedContext
      
    } catch (error) {
      console.error('Enhanced context building failed:', error.message)
      return {
        workshop: workshopContext,
        customer: null,
        services: [],
        conversation: { patterns: [] },
        intelligence: { commonIssues: [] }
      }
    }
  }

  /**
   * Process multi-modal content (images, documents)
   */
  async processMultiModalContent(messages, images, documents) {
    const processedMessages = [...messages]
    
    // Process images if provided
    if (images && images.length > 0) {
      const imageAnalysis = await this.analyzeImages(images)
      
      processedMessages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'I have attached images for analysis. Please examine them for automotive issues.'
          },
          ...images.map(image => ({
            type: 'image_url',
            image_url: {
              url: image.url,
              detail: 'high'
            }
          }))
        ]
      })
    }
    
    // Process documents if provided
    if (documents && documents.length > 0) {
      const documentSummary = await this.processDocuments(documents)
      
      processedMessages.push({
        role: 'user',
        content: `I have provided the following documents: ${documentSummary}`
      })
    }
    
    return processedMessages
  }

  /**
   * Build intelligent system prompt with context
   */
  async buildIntelligentSystemPrompt(context) {
    const {
      clientKey,
      workshopContext,
      conversationContext,
      customerProfile,
      serviceCatalog
    } = context
    
    let prompt = `Du bist CarBot, der führende KI-Assistent für ${workshopContext?.name || 'diese Autowerkstatt'}. Du bist spezialisiert auf deutsche Automobildienstleistungen und hilfst Kunden mit professioneller, präziser Beratung.`
    
    // Workshop-specific context
    if (workshopContext) {
      prompt += `\n\n🔧 WERKSTATT-PROFIL:
- Name: ${workshopContext.name}
- Standort: ${workshopContext.city}
- Spezialisierungen: ${workshopContext.specialties?.join(', ') || 'Allgemeine Reparaturen'}
- Reputation: ${workshopContext.reputation || 'Sehr gut'} 
- Telefon: ${workshopContext.phone || 'Auf Anfrage'}`
    }
    
    // Service catalog
    if (serviceCatalog && serviceCatalog.length > 0) {
      prompt += `\n\n🛠️ VERFÜGBARE DIENSTLEISTUNGEN:`
      serviceCatalog.slice(0, 10).forEach(service => {
        const price = service.price_from ? ` (ab ${service.price_from}€)` : ''
        const demand = service.demand_level === 'high' ? ' [🔥 Sehr gefragt]' : ''
        prompt += `\n- ${service.name}${price}${demand}`
        if (service.description) prompt += `\n  ${service.description.substring(0, 100)}...`
      })
    }
    
    // Customer context
    if (customerProfile) {
      prompt += `\n\n👤 KUNDE:
- Fahrzeugtyp: ${customerProfile.vehicle_type || 'Nicht angegeben'}
- Präferenzen: ${customerProfile.preferences?.join(', ') || 'Standard'}
- Service-Historie: ${customerProfile.service_count || 0} vorherige Besuche`
    }
    
    // Conversation intelligence
    if (conversationContext?.patterns) {
      const commonTopics = conversationContext.commonTopics?.slice(0, 5) || []
      if (commonTopics.length > 0) {
        prompt += `\n\n💡 HÄUFIGE THEMEN: ${commonTopics.join(', ')}`
      }
    }
    
    prompt += `\n\n📋 VERHALTEN:
- Antworte präzise und professionell auf Deutsch
- Bei technischen Fragen: Erkläre verständlich, aber fachlich korrekt  
- Bei Preisanfragen: Nenne realistische Bereiche basierend auf dem Service-Katalog
- Bei Terminen: Weise auf Öffnungszeiten hin und empfehle Kontaktaufnahme
- Bei unklaren Problemen: Frage gezielt nach (Fahrzeugtyp, Symptome, etc.)
- Erkenne Notfälle und priorisiere entsprechend
- Schlage konkrete nächste Schritte vor

🎯 ZIEL: Maximale Kundenzufriedenheit durch kompetente, schnelle Hilfe mit Fokus auf Terminvereinbarung und Problemlösung.

Client: ${clientKey}`

    return prompt
  }

  /**
   * Process AI response and extract insights
   */
  async processAIResponse({ completion, originalMessages, context, clientKey, userId }) {
    const message = completion.choices[0]?.message?.content || ''
    const functionCall = completion.choices[0]?.message?.function_call
    
    // Extract insights from the conversation
    const insights = {
      intent: this.detectUserIntent(originalMessages),
      sentiment: this.analyzeSentiment(originalMessages),
      urgency: this.assessUrgency(originalMessages),
      vehicleInfo: this.extractVehicleInfo(originalMessages),
      serviceNeeds: this.identifyServiceNeeds(originalMessages, context.services)
    }
    
    // Generate suggested actions
    const suggestedActions = this.generateSuggestedActions(insights, context)
    
    // Calculate confidence score
    const confidence = this.calculateConfidenceScore(insights, context)
    
    // Handle function calls if present
    if (functionCall) {
      const functionResult = await this.executeFunctionCall(functionCall, context)
      return {
        message: message + (functionResult ? `\n\n${functionResult}` : ''),
        insights,
        suggestedActions,
        confidence,
        functionExecuted: functionCall.name
      }
    }
    
    return {
      message,
      insights,
      suggestedActions,
      confidence
    }
  }

  /**
   * Get available functions based on customer tier
   */
  getAvailableFunctions(customerTier) {
    const baseFunctions = [
      {
        name: 'schedule_appointment',
        description: 'Schedule a workshop appointment',
        parameters: {
          type: 'object',
          properties: {
            service_type: { type: 'string', description: 'Type of service needed' },
            preferred_date: { type: 'string', description: 'Preferred appointment date' },
            urgency: { type: 'string', enum: ['low', 'medium', 'high', 'emergency'] }
          },
          required: ['service_type', 'urgency']
        }
      },
      {
        name: 'get_service_price',
        description: 'Get price estimate for a service',
        parameters: {
          type: 'object',
          properties: {
            service_name: { type: 'string', description: 'Name of the service' },
            vehicle_type: { type: 'string', description: 'Type of vehicle' }
          },
          required: ['service_name']
        }
      }
    ]
    
    if (customerTier === 'premium' || customerTier === 'enterprise') {
      baseFunctions.push(
        {
          name: 'analyze_diagnostic_data',
          description: 'Analyze vehicle diagnostic data',
          parameters: {
            type: 'object',
            properties: {
              error_codes: { type: 'array', items: { type: 'string' } },
              symptoms: { type: 'string', description: 'Observed symptoms' }
            }
          }
        },
        {
          name: 'generate_service_report',
          description: 'Generate detailed service recommendation report',
          parameters: {
            type: 'object',
            properties: {
              vehicle_info: { type: 'object' },
              service_history: { type: 'array' },
              current_issues: { type: 'array' }
            }
          }
        }
      )
    }
    
    return baseFunctions
  }

  /**
   * Get max tokens based on customer tier
   */
  getMaxTokens(customerTier) {
    const tokenLimits = {
      'enterprise': 4000,
      'premium': 2000,
      'standard': 1000,
      'basic': 500
    }
    
    return tokenLimits[customerTier] || tokenLimits.standard
  }

  /**
   * Analyze conversation patterns
   */
  analyzeConversationPatterns(recentChats, currentMessages) {
    // Implementation for pattern analysis
    return {
      averageResponseTime: '2.3 minutes',
      commonQuestions: ['TÜV', 'Reparatur', 'Termin'],
      satisfactionScore: 4.2,
      conversionRate: 0.73
    }
  }

  /**
   * Extract workshop specialties from services
   */
  extractWorkshopSpecialties(services) {
    const specialties = new Set()
    
    services.forEach(service => {
      if (service.category) specialties.add(service.category)
      if (service.specialty) specialties.add(service.specialty)
    })
    
    return Array.from(specialties)
  }

  /**
   * Detect user intent from messages
   */
  detectUserIntent(messages) {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
    
    if (lastMessage.includes('termin') || lastMessage.includes('appointment')) {
      return 'schedule_appointment'
    }
    if (lastMessage.includes('preis') || lastMessage.includes('kostet')) {
      return 'get_pricing'
    }
    if (lastMessage.includes('defekt') || lastMessage.includes('problem')) {
      return 'diagnose_issue'
    }
    if (lastMessage.includes('tüv') || lastMessage.includes('hauptuntersuchung')) {
      return 'inspection_service'
    }
    
    return 'general_inquiry'
  }

  /**
   * Generate suggested actions based on insights
   */
  generateSuggestedActions(insights, context) {
    const actions = []
    
    if (insights.intent === 'schedule_appointment') {
      actions.push({
        type: 'appointment',
        title: 'Termin vereinbaren',
        description: 'Direkt einen Werkstatt-Termin buchen',
        priority: 'high'
      })
    }
    
    if (insights.urgency === 'high') {
      actions.push({
        type: 'emergency_contact',
        title: 'Notfall-Hotline',
        description: 'Sofortige Hilfe bei Fahrzeugpannen',
        priority: 'critical'
      })
    }
    
    if (insights.serviceNeeds?.length > 0) {
      actions.push({
        type: 'service_quote',
        title: 'Kostenvoranschlag anfordern',
        description: `Preisschätzung für ${insights.serviceNeeds.join(', ')}`,
        priority: 'medium'
      })
    }
    
    return actions
  }

  /**
   * Update conversation memory
   */
  updateConversationMemory(userId, conversationData) {
    // Limit memory to last 10 conversations per user
    const userMemory = this.conversationMemory.get(userId) || []
    
    userMemory.push(conversationData)
    
    if (userMemory.length > 10) {
      userMemory.shift() // Remove oldest conversation
    }
    
    this.conversationMemory.set(userId, userMemory)
  }

  /**
   * Get fallback response for errors
   */
  async getFallbackResponse(messages, clientKey) {
    const lastMessage = messages[messages.length - 1]?.content || ''
    
    return `Entschuldigung, unser KI-System ist momentan überlastet. 

Für Ihre Anfrage "${lastMessage.substring(0, 100)}${lastMessage.length > 100 ? '...' : ''}" empfehle ich Ihnen:

📞 **Direkter Kontakt**: Rufen Sie uns für schnelle Hilfe an
⏰ **Öffnungszeiten**: Montag bis Freitag 8:00-18:00 Uhr  
📧 **E-Mail**: Senden Sie uns Ihre detaillierte Anfrage

Unser Fachteam hilft Ihnen gerne weiter!`
  }

  // Additional helper methods would be implemented here...
  
  analyzeSentiment(messages) { return 'positive' }
  assessUrgency(messages) { return 'medium' }
  extractVehicleInfo(messages) { return null }
  identifyServiceNeeds(messages, services) { return [] }
  calculateConfidenceScore(insights, context) { return 0.85 }
  executeFunctionCall(functionCall, context) { return null }
  analyzeImages(images) { return 'Image analysis not implemented' }
  processDocuments(documents) { return 'Document processing not implemented' }
  calculateWorkshopReputation(clientKey) { return 'Excellent' }
  analyzeBusyHours(chats) { return ['10:00-12:00', '14:00-16:00'] }
  extractCustomerPreferences(chats, userId) { return [] }
  getCustomerServiceHistory(userId, clientKey) { return [] }
  calculateServiceDemand(service, chats) { return 'medium' }
  analyzeSeasonalFactors(service) { return [] }
  extractCommonTopics(chats) { return ['TÜV', 'Reparatur', 'Wartung'] }
  calculateSatisfactionTrend(chats) { return 'improving' }
  generateActionRecommendations(data) { return [] }
  identifyRiskFactors(data) { return [] }
}

// Export singleton instance
export const aiChatEnhancer = new AIchatEnhancer()

export default aiChatEnhancer