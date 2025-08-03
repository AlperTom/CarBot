// AI-powered lead scoring system for CarBot
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export class LeadScorer {
  constructor() {
    this.weights = {
      urgency: 0.25,
      engagement: 0.20,
      intent: 0.25, 
      demographics: 0.15,
      behavior: 0.15
    }
  }

  async scoreLead(leadData, chatHistory = [], customerContext = {}) {
    try {
      const scores = {
        urgency: this.calculateUrgencyScore(leadData, chatHistory),
        engagement: this.calculateEngagementScore(chatHistory),
        intent: await this.calculateIntentScore(leadData, chatHistory),
        demographics: this.calculateDemographicsScore(leadData),
        behavior: this.calculateBehaviorScore(chatHistory)
      }

      const totalScore = Object.keys(scores).reduce((total, key) => {
        return total + (scores[key] * this.weights[key])
      }, 0)

      const leadScore = {
        total: Math.round(totalScore),
        breakdown: scores,
        classification: this.classifyLead(totalScore),
        recommendations: this.generateRecommendations(scores, leadData),
        priority: this.calculatePriority(totalScore, scores),
        estimatedValue: this.estimateLeadValue(scores, customerContext),
        followUpSuggestions: this.generateFollowUpSuggestions(scores, leadData)
      }

      // Store the lead score for tracking
      await this.storeLeadScore(leadData, leadScore)

      return leadScore

    } catch (error) {
      console.error('Lead scoring error:', error)
      return this.getDefaultScore()
    }
  }

  calculateUrgencyScore(leadData, chatHistory) {
    let score = 50 // Base score

    const urgentKeywords = [
      'sofort', 'dringend', 'notfall', 'hilfe', 'kaputt', 'defekt',
      'immediately', 'urgent', 'emergency', 'help', 'broken',
      'acil', 'yardım', 'bozuk', 'arızalı',
      'pilnie', 'natychmiast', 'pomoc', 'zepsuty'
    ]

    const timeKeywords = [
      'heute', 'morgen', 'asap', 'schnell',
      'today', 'tomorrow', 'quickly', 'fast',
      'bugün', 'yarın', 'hızlı', 'çabuk',
      'dziś', 'jutro', 'szybko', 'natychmiast'
    ]

    // Check lead description for urgency indicators
    const text = (leadData.anliegen || '').toLowerCase()
    
    urgentKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 15
    })

    timeKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10
    })

    // Check chat history for urgency escalation
    const urgentMessages = chatHistory.filter(msg => 
      urgentKeywords.some(keyword => 
        msg.content?.toLowerCase().includes(keyword)
      )
    ).length

    score += urgentMessages * 8

    // Time-based urgency (recent leads are more urgent)
    const leadAge = Date.now() - new Date(leadData.timestamp || leadData.created_at).getTime()
    const hoursOld = leadAge / (1000 * 60 * 60)
    
    if (hoursOld < 1) score += 20
    else if (hoursOld < 6) score += 15
    else if (hoursOld < 24) score += 10
    else if (hoursOld < 72) score += 5

    return Math.min(100, Math.max(0, score))
  }

  calculateEngagementScore(chatHistory) {
    let score = 30 // Base score for any interaction

    if (!chatHistory || chatHistory.length === 0) return score

    const userMessages = chatHistory.filter(msg => msg.role === 'user')
    const messageCount = userMessages.length

    // Message count scoring
    if (messageCount >= 10) score += 30
    else if (messageCount >= 5) score += 20
    else if (messageCount >= 3) score += 15
    else if (messageCount >= 2) score += 10

    // Message length and quality
    const avgMessageLength = userMessages.reduce((sum, msg) => 
      sum + (msg.content?.length || 0), 0) / userMessages.length

    if (avgMessageLength > 100) score += 15
    else if (avgMessageLength > 50) score += 10
    else if (avgMessageLength > 20) score += 5

    // Question complexity (indicates serious interest)
    const complexQuestions = userMessages.filter(msg => {
      const content = msg.content?.toLowerCase() || ''
      return content.includes('?') || 
             content.includes('wie') || content.includes('how') ||
             content.includes('wann') || content.includes('when') ||
             content.includes('kosten') || content.includes('cost') ||
             content.includes('preis') || content.includes('price')
    }).length

    score += complexQuestions * 8

    // Response time (faster responses indicate higher engagement)
    const responseTimes = []
    for (let i = 1; i < chatHistory.length; i++) {
      if (chatHistory[i-1].role === 'assistant' && chatHistory[i].role === 'user') {
        const prevTime = new Date(chatHistory[i-1].timestamp || Date.now())
        const currTime = new Date(chatHistory[i].timestamp || Date.now())
        responseTimes.push(currTime - prevTime)
      }
    }

    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      const minutes = avgResponseTime / (1000 * 60)
      
      if (minutes < 2) score += 15
      else if (minutes < 5) score += 10
      else if (minutes < 15) score += 5
    }

    return Math.min(100, Math.max(0, score))
  }

  async calculateIntentScore(leadData, chatHistory) {
    let score = 40 // Base score

    // High-intent keywords
    const purchaseIntent = [
      'kaufen', 'buchen', 'bestellen', 'reservieren', 'termin',
      'buy', 'book', 'order', 'reserve', 'appointment',
      'satın al', 'rezervasyon', 'randevu',
      'kupić', 'zamówić', 'rezerwacja', 'wizyta'
    ]

    const serviceIntent = [
      'reparatur', 'wartung', 'service', 'inspektion',
      'repair', 'maintenance', 'service', 'inspection',
      'tamir', 'bakım', 'servis',
      'naprawa', 'konserwacja', 'serwis'
    ]

    const urgentService = [
      'tüv', 'hauptuntersuchung', 'bremsen', 'motor',
      'inspection', 'brakes', 'engine',
      'muayene', 'fren', 'motor',
      'przegląd', 'hamulce', 'silnik'
    ]

    // Analyze lead description
    const text = (leadData.anliegen || '').toLowerCase()
    
    purchaseIntent.forEach(keyword => {
      if (text.includes(keyword)) score += 20
    })

    serviceIntent.forEach(keyword => {
      if (text.includes(keyword)) score += 15
    })

    urgentService.forEach(keyword => {
      if (text.includes(keyword)) score += 25
    })

    // Analyze chat history for intent progression
    const allMessages = chatHistory.map(msg => msg.content?.toLowerCase() || '').join(' ')
    
    purchaseIntent.forEach(keyword => {
      const occurrences = (allMessages.match(new RegExp(keyword, 'g')) || []).length
      score += occurrences * 12
    })

    // Price inquiries indicate high intent
    if (allMessages.includes('kosten') || allMessages.includes('preis') || 
        allMessages.includes('cost') || allMessages.includes('price')) {
      score += 20
    }

    // Vehicle details provided indicates serious intent
    if (leadData.fahrzeug && leadData.fahrzeug.length > 5) {
      score += 15
    }

    // Contact information provided readily
    if (leadData.telefon && leadData.name) {
      score += 15
    }

    return Math.min(100, Math.max(0, score))
  }

  calculateDemographicsScore(leadData) {
    let score = 50 // Neutral base

    // Professional email domains
    const businessDomains = ['.de', '.com', '.org', '.net']
    const freeEmailDomains = ['gmail', 'yahoo', 'hotmail', 'web.de', 't-online']

    if (leadData.email) {
      const email = leadData.email.toLowerCase()
      const isBusiness = businessDomains.some(domain => 
        email.includes(domain) && 
        !freeEmailDomains.some(free => email.includes(free))
      )
      
      if (isBusiness) score += 20
      else score += 10 // Any email is better than none
    }

    // Phone number format (professional vs personal)
    if (leadData.telefon) {
      const phone = leadData.telefon.replace(/\s/g, '')
      
      // German business number patterns
      if (phone.match(/^\+49[1-9]\d{10,11}$/) || phone.match(/^0[1-9]\d{9,10}$/)) {
        score += 15
      } else {
        score += 10
      }
    }

    // Name completeness
    if (leadData.name) {
      const nameParts = leadData.name.trim().split(' ')
      if (nameParts.length >= 2) score += 10
      if (nameParts.length >= 3) score += 5 // Full name including title
    }

    // Request detail level
    if (leadData.anliegen && leadData.anliegen.length > 50) {
      score += 15 // Detailed requests from serious prospects
    }

    return Math.min(100, Math.max(0, score))
  }

  calculateBehaviorScore(chatHistory) {
    let score = 40 // Base score

    if (!chatHistory || chatHistory.length === 0) return score

    const userMessages = chatHistory.filter(msg => msg.role === 'user')
    
    // Professional communication style
    const politeWords = [
      'bitte', 'danke', 'vielen dank', 'freundliche grüße',
      'please', 'thank you', 'thanks', 'best regards',
      'lütfen', 'teşekkür', 'saygılar',
      'proszę', 'dziękuję', 'pozdrawiam'
    ]

    const professionalLanguage = userMessages.filter(msg => 
      politeWords.some(word => 
        msg.content?.toLowerCase().includes(word)
      )
    ).length

    score += professionalLanguage * 8

    // Technical knowledge (indicates serious buyer)
    const technicalTerms = [
      'motor', 'getriebe', 'bremse', 'kupplung', 'turbo',
      'engine', 'transmission', 'brake', 'clutch', 'turbo',
      'motor', 'şanzıman', 'fren', 'debriyaj',
      'silnik', 'skrzynia', 'hamulec', 'sprzęgło'
    ]

    const technicalMentions = userMessages.filter(msg => 
      technicalTerms.some(term => 
        msg.content?.toLowerCase().includes(term)
      )
    ).length

    score += technicalMentions * 10

    // Specific vehicle details
    const hasVehicleDetails = userMessages.some(msg => {
      const content = msg.content?.toLowerCase() || ''
      return content.match(/\d{4}/) || // Year
             content.includes('km') ||  // Mileage
             content.includes('baujahr') ||
             content.includes('model')
    })

    if (hasVehicleDetails) score += 20

    // Follow-up questions (indicates engagement)
    const questionCount = userMessages.filter(msg => 
      msg.content?.includes('?')
    ).length

    score += questionCount * 5

    return Math.min(100, Math.max(0, score))
  }

  classifyLead(totalScore) {
    if (totalScore >= 80) return 'Hot'
    if (totalScore >= 60) return 'Warm'
    if (totalScore >= 40) return 'Cold'
    return 'Very Cold'
  }

  calculatePriority(totalScore, scores) {
    const urgencyWeight = scores.urgency * 0.4
    const intentWeight = scores.intent * 0.3
    const engagementWeight = scores.engagement * 0.3
    
    const priorityScore = urgencyWeight + intentWeight + engagementWeight
    
    if (priorityScore >= 70) return 'High'
    if (priorityScore >= 50) return 'Medium'
    return 'Low'
  }

  estimateLeadValue(scores, customerContext) {
    const baseValue = customerContext.averageJobValue || 300 // Default €300

    let multiplier = 1
    
    // Adjust based on intent and demographics
    if (scores.intent > 80) multiplier += 0.5
    if (scores.demographics > 70) multiplier += 0.3
    if (scores.urgency > 70) multiplier += 0.2
    
    return Math.round(baseValue * multiplier)
  }

  generateRecommendations(scores, leadData) {
    const recommendations = []

    if (scores.urgency > 70) {
      recommendations.push({
        type: 'immediate_contact',
        message: 'Contact within 1 hour - high urgency detected',
        priority: 'high'
      })
    }

    if (scores.intent > 80) {
      recommendations.push({
        type: 'appointment_offer',
        message: 'Offer immediate appointment booking',
        priority: 'high'
      })
    }

    if (scores.engagement < 40) {
      recommendations.push({
        type: 'engagement_boost',
        message: 'Send follow-up with additional information',
        priority: 'medium'
      })
    }

    if (!leadData.telefon) {
      recommendations.push({
        type: 'contact_collection',
        message: 'Request phone number for better communication',
        priority: 'medium'
      })
    }

    if (scores.demographics < 50) {
      recommendations.push({
        type: 'qualification',
        message: 'Qualify lead further before heavy investment',
        priority: 'low'
      })
    }

    return recommendations
  }

  generateFollowUpSuggestions(scores, leadData) {
    const suggestions = []

    if (scores.intent > 70) {
      suggestions.push('Call within 2 hours to discuss specific needs')
      suggestions.push('Send personalized quote based on vehicle details')
    }

    if (scores.urgency > 60) {
      suggestions.push('Offer emergency/same-day service slot')
      suggestions.push('Provide direct phone line for immediate assistance')
    }

    if (scores.engagement > 60) {
      suggestions.push('Send technical information about discussed services')
      suggestions.push('Invite for workshop tour or consultation')
    }

    return suggestions
  }

  async storeLeadScore(leadData, leadScore) {
    try {
      await supabase.from('lead_scores').insert({
        lead_id: leadData.id,
        kunde_id: leadData.kunde_id,
        total_score: leadScore.total,
        score_breakdown: leadScore.breakdown,
        classification: leadScore.classification,
        priority: leadScore.priority,
        estimated_value: leadScore.estimatedValue,
        recommendations: leadScore.recommendations,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error storing lead score:', error)
    }
  }

  getDefaultScore() {
    return {
      total: 50,
      breakdown: {
        urgency: 50,
        engagement: 50,
        intent: 50,
        demographics: 50,
        behavior: 50
      },
      classification: 'Cold',
      recommendations: [],
      priority: 'Medium',
      estimatedValue: 300,
      followUpSuggestions: ['Contact lead within 24 hours']
    }
  }

  // Batch scoring for analytics
  async scoreBatchLeads(leads, limit = 100) {
    const results = []
    
    for (let i = 0; i < Math.min(leads.length, limit); i++) {
      const lead = leads[i]
      
      // Get chat history for this lead
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('client_key', lead.kunde_id)
        .order('created_at')
      
      const score = await this.scoreLead(lead, messages || [])
      results.push({ ...lead, score })
      
      // Small delay to avoid overwhelming the system
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return results
  }
}

// Export singleton instance
export const leadScorer = new LeadScorer()

// Helper function for quick scoring
export async function scoreLeadQuick(leadData, chatHistory = []) {
  return await leadScorer.scoreLead(leadData, chatHistory)
}