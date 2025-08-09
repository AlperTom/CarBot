/**
 * Service Management API - Handle workshop services with search and add functionality
 * Phase 2 Feature: Comprehensive service management system
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../../../lib/jwt-auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Retrieve workshop services with search functionality
export const GET = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const category = url.searchParams.get('category') || ''
    const featured = url.searchParams.get('featured') === 'true'
    const limit = parseInt(url.searchParams.get('limit')) || 50
    const offset = parseInt(url.searchParams.get('offset')) || 0

    let query = supabase
      .from('workshop_services')
      .select(`
        *,
        master_services (
          id,
          service_name,
          service_name_de,
          description_de,
          typical_duration_minutes,
          complexity_level,
          vehicle_types,
          tags,
          service_categories (
            id,
            name,
            name_de,
            icon
          )
        )
      `)
      .eq('workshop_id', workshop.id)
      .eq('is_active', true)
      .range(offset, offset + limit - 1)
      .order('display_order', { ascending: true })

    // Apply filters
    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (category) {
      query = query.eq('master_services.service_categories.name', category)
    }

    const { data: services, error } = await query

    if (error) {
      console.error('Service retrieval error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve services'
      }, { status: 500 })
    }

    // Apply text search filter (done after query for simplicity)
    let filteredServices = services
    if (search) {
      const searchLower = search.toLowerCase()
      filteredServices = services.filter(service => {
        const masterService = service.master_services
        const searchableText = [
          service.custom_name || masterService?.service_name_de || masterService?.service_name,
          service.custom_description || masterService?.description_de,
          ...(masterService?.tags || [])
        ].join(' ').toLowerCase()
        
        return searchableText.includes(searchLower)
      })

      // Log search for analytics
      if (search.length > 2) {
        await supabase
          .from('service_search_log')
          .insert({
            workshop_id: workshop.id,
            search_term: search,
            search_results_count: filteredServices.length,
            user_session_id: request.headers.get('x-session-id') || 'anonymous'
          })
      }
    }

    // Get service categories for the response
    const { data: categories } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    return NextResponse.json({
      success: true,
      data: {
        services: filteredServices,
        categories: categories || [],
        total: filteredServices.length,
        pagination: {
          limit,
          offset,
          hasMore: services.length === limit
        }
      }
    })

  } catch (error) {
    console.error('Service GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve services'
    }, { status: 500 })
  }
})

// POST - Add new service to workshop
export const POST = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const {
      masterServiceId,
      customName,
      priceMin,
      priceMax,
      customDescription,
      isFeatured = false,
      vehicleTypes = []
    } = body

    // Validate required fields
    if (!masterServiceId || priceMin === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Master service ID and price minimum are required'
      }, { status: 400 })
    }

    // Validate pricing
    const minPrice = parseFloat(priceMin)
    const maxPrice = priceMax ? parseFloat(priceMax) : minPrice
    const isFixedPrice = minPrice === maxPrice

    if (minPrice < 0 || maxPrice < minPrice) {
      return NextResponse.json({
        success: false,
        error: 'Invalid pricing configuration'
      }, { status: 400 })
    }

    // Check if service already exists for this workshop
    const { data: existingService } = await supabase
      .from('workshop_services')
      .select('id')
      .eq('workshop_id', workshop.id)
      .eq('master_service_id', masterServiceId)
      .single()

    if (existingService) {
      return NextResponse.json({
        success: false,
        error: 'Service already exists for this workshop'
      }, { status: 409 })
    }

    // Get the next display order
    const { data: maxOrderService } = await supabase
      .from('workshop_services')
      .select('display_order')
      .eq('workshop_id', workshop.id)
      .order('display_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrderService?.display_order || 0) + 1

    // Create the service
    const { data: newService, error } = await supabase
      .from('workshop_services')
      .insert({
        workshop_id: workshop.id,
        master_service_id: masterServiceId,
        custom_name: customName,
        price_min: minPrice,
        price_max: maxPrice,
        is_fixed_price: isFixedPrice,
        custom_description: customDescription,
        is_featured: isFeatured,
        display_order: nextOrder,
        is_active: true
      })
      .select(`
        *,
        master_services (
          id,
          service_name,
          service_name_de,
          description_de,
          service_categories (
            name,
            name_de,
            icon
          )
        )
      `)
      .single()

    if (error) {
      console.error('Service creation error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to create service'
      }, { status: 500 })
    }

    // Log successful service addition
    const searchTerm = request.headers.get('x-search-term')
    if (searchTerm) {
      await supabase
        .from('service_search_log')
        .update({
          was_service_added: true,
          added_service_id: newService.id
        })
        .eq('workshop_id', workshop.id)
        .eq('search_term', searchTerm)
        .eq('user_session_id', request.headers.get('x-session-id') || 'anonymous')
        .order('created_at', { ascending: false })
        .limit(1)
    }

    return NextResponse.json({
      success: true,
      data: newService,
      message: 'Service added successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Service POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add service'
    }, { status: 500 })
  }
})