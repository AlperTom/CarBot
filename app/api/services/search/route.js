/**
 * Service Search API - Search available services with add functionality
 * Implements the enhanced search and add feature requested
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../../../../lib/jwt-auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// POST - Search for services that can be added to workshop
export const POST = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const { 
      searchTerm, 
      categoryId, 
      vehicleTypes = [],
      limit = 20,
      sessionId = 'anonymous'
    } = body

    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Search term must be at least 2 characters long'
      }, { status: 400 })
    }

    // Get services already added by this workshop to exclude from results
    const { data: existingServices } = await supabase
      .from('workshop_services')
      .select('master_service_id')
      .eq('workshop_id', workshop.id)
      .eq('is_active', true)

    const existingServiceIds = existingServices?.map(s => s.master_service_id) || []

    // Build search query for master services
    let query = supabase
      .from('master_services')
      .select(`
        id,
        service_name,
        service_name_de,
        description_de,
        typical_duration_minutes,
        complexity_level,
        vehicle_types,
        tags,
        is_popular,
        service_categories (
          id,
          name,
          name_de,
          icon
        )
      `)
      .limit(limit)

    // Exclude already added services
    if (existingServiceIds.length > 0) {
      query = query.not('id', 'in', `(${existingServiceIds.join(',')})`)
    }

    // Filter by category if specified
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    // Filter by vehicle types if specified
    if (vehicleTypes.length > 0) {
      query = query.overlaps('vehicle_types', vehicleTypes)
    }

    const { data: allServices, error } = await query

    if (error) {
      console.error('Service search error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to search services'
      }, { status: 500 })
    }

    // Perform text-based search filtering
    const searchLower = searchTerm.toLowerCase().trim()
    const searchWords = searchLower.split(/\s+/).filter(word => word.length > 1)

    const searchResults = allServices.filter(service => {
      const searchableText = [
        service.service_name,
        service.service_name_de,
        service.description_de,
        ...(service.tags || []),
        service.service_categories?.name,
        service.service_categories?.name_de
      ].join(' ').toLowerCase()

      // Check if all search words are found
      return searchWords.every(word => searchableText.includes(word))
    })

    // Sort results by relevance
    const sortedResults = searchResults
      .map(service => {
        let relevanceScore = 0
        
        // Exact matches get highest score
        if (service.service_name_de.toLowerCase().includes(searchLower)) {
          relevanceScore += 10
        }
        
        // Popular services get bonus points
        if (service.is_popular) {
          relevanceScore += 5
        }
        
        // Tag matches get bonus
        const tagMatches = (service.tags || []).filter(tag => 
          tag.toLowerCase().includes(searchLower)
        ).length
        relevanceScore += tagMatches * 2
        
        // Description matches
        if (service.description_de?.toLowerCase().includes(searchLower)) {
          relevanceScore += 3
        }
        
        return {
          ...service,
          relevanceScore
        }
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Log the search for analytics
    await supabase
      .from('service_search_log')
      .insert({
        workshop_id: workshop.id,
        search_term: searchTerm,
        search_results_count: sortedResults.length,
        was_service_added: false,
        user_session_id: sessionId
      })

    // Get suggested pricing for each service based on similar workshops
    const servicesWithPricing = await Promise.all(
      sortedResults.map(async (service) => {
        const { data: pricingData } = await supabase
          .from('workshop_services')
          .select('price_min, price_max')
          .eq('master_service_id', service.id)
          .eq('is_active', true)

        let suggestedPricing = null
        if (pricingData && pricingData.length > 0) {
          const prices = pricingData.map(p => ({ min: p.price_min, max: p.price_max }))
          const avgMin = prices.reduce((sum, p) => sum + p.min, 0) / prices.length
          const avgMax = prices.reduce((sum, p) => sum + p.max, 0) / prices.length
          
          suggestedPricing = {
            minPrice: Math.round(avgMin * 0.8), // 20% below average
            maxPrice: Math.round(avgMax * 1.2), // 20% above average
            marketAverage: {
              min: Math.round(avgMin),
              max: Math.round(avgMax)
            },
            sampleSize: pricingData.length
          }
        }

        return {
          ...service,
          suggestedPricing
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        services: servicesWithPricing,
        searchTerm,
        totalResults: sortedResults.length,
        suggestions: generateSearchSuggestions(searchTerm, allServices)
      }
    })

  } catch (error) {
    console.error('Service search error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to search services'
    }, { status: 500 })
  }
})

// GET - Get popular services and categories for search suggestions
export const GET = withAuth(async (request, context) => {
  try {
    const { workshop } = context

    // Get popular services not yet added by this workshop
    const { data: existingServices } = await supabase
      .from('workshop_services')
      .select('master_service_id')
      .eq('workshop_id', workshop.id)
      .eq('is_active', true)

    const existingServiceIds = existingServices?.map(s => s.master_service_id) || []

    let popularQuery = supabase
      .from('master_services')
      .select(`
        id,
        service_name_de,
        service_categories (
          name_de,
          icon
        )
      `)
      .eq('is_popular', true)
      .limit(10)

    if (existingServiceIds.length > 0) {
      popularQuery = popularQuery.not('id', 'in', `(${existingServiceIds.join(',')})`)
    }

    const { data: popularServices } = await popularQuery

    // Get all service categories
    const { data: categories } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    // Get recent search terms for suggestions
    const { data: recentSearches } = await supabase
      .from('service_search_log')
      .select('search_term, search_results_count')
      .eq('workshop_id', workshop.id)
      .gt('search_results_count', 0)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      success: true,
      data: {
        popularServices: popularServices || [],
        categories: categories || [],
        recentSearches: recentSearches?.map(s => s.search_term) || [],
        searchTips: [
          'Versuchen Sie spezifische Begriffe wie "Ölwechsel" oder "Bremsen"',
          'Nutzen Sie Fahrzeugtypen wie "PKW", "LKW", oder "Motorrad"',
          'Suchen Sie nach Marken wie "BMW", "Mercedes", oder "Audi"'
        ]
      }
    })

  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get search suggestions'
    }, { status: 500 })
  }
})

// Generate smart search suggestions based on partial matches
function generateSearchSuggestions(searchTerm, allServices) {
  const searchLower = searchTerm.toLowerCase()
  const suggestions = new Set()

  // Extract unique tags and service names that partially match
  allServices.forEach(service => {
    // Add service names that start with search term
    if (service.service_name_de.toLowerCase().startsWith(searchLower)) {
      suggestions.add(service.service_name_de)
    }

    // Add matching tags
    (service.tags || []).forEach(tag => {
      if (tag.toLowerCase().includes(searchLower) && tag.length > searchLower.length) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5) // Return top 5 suggestions
}