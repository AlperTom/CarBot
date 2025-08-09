/**
 * Template Publishing API - Publish/unpublish customized landing pages
 * Phase 2 Feature: Template publishing and live site management
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../../../../lib/jwt-auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// POST PUBLISH TEMPLATE - Publish customized template
export const POST = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const { publish = true } = body

    // Get current customization
    const { data: customization, error: fetchError } = await supabase
      .from('workshop_template_customizations')
      .select('*')
      .eq('workshop_id', workshop.id)
      .single()

    if (fetchError || !customization) {
      return NextResponse.json({
        success: false,
        error: 'No template customization found. Please customize a template first.'
      }, { status: 404 })
    }

    // Check if workshop has premium plan (for premium templates)
    const { data: subscription } = await supabase
      .from('workshop_subscriptions')
      .select(`
        *,
        subscription_plans (
          plan_type,
          features
        )
      `)
      .eq('workshop_id', workshop.id)
      .eq('status', 'active')
      .single()

    // Validate premium template access
    const premiumTemplates = ['premium_luxury_garage', 'elektro_hybrid_spezialist']
    if (premiumTemplates.includes(customization.template_type)) {
      if (!subscription || subscription.subscription_plans?.plan_type === 'basic') {
        return NextResponse.json({
          success: false,
          error: 'Premium template requires Professional or Enterprise plan'
        }, { status: 403 })
      }
    }

    // Validate required fields for publishing
    if (publish) {
      const requiredFields = ['custom_slug', 'template_type']
      const missingFields = requiredFields.filter(field => !customization[field])
      
      if (missingFields.length > 0) {
        return NextResponse.json({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        }, { status: 400 })
      }

      // Validate slug format
      const slugPattern = /^[a-z0-9-]+$/
      if (!slugPattern.test(customization.custom_slug)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.'
        }, { status: 400 })
      }
    }

    // Update publication status
    const { data: updatedCustomization, error: updateError } = await supabase
      .from('workshop_template_customizations')
      .update({
        is_published: publish,
        published_at: publish ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('workshop_id', workshop.id)
      .select()
      .single()

    if (updateError) {
      console.error('Template publication error:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update publication status'
      }, { status: 500 })
    }

    // Generate live URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://carbot.vercel.app'
    const liveUrl = `${baseUrl}/l/${customization.custom_slug}`

    return NextResponse.json({
      success: true,
      data: {
        customization: updatedCustomization,
        liveUrl: publish ? liveUrl : null,
        isPublished: publish
      },
      message: publish ? 
        'Landing Page erfolgreich veröffentlicht!' : 
        'Landing Page erfolgreich unveröffentlicht!'
    })

  } catch (error) {
    console.error('Template publishing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update publication status'
    }, { status: 500 })
  }
})

// GET PUBLICATION STATUS - Check current publication status
export const GET = withAuth(async (request, context) => {
  try {
    const { workshop } = context

    const { data: customization, error } = await supabase
      .from('workshop_template_customizations')
      .select('*')
      .eq('workshop_id', workshop.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Publication status fetch error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch publication status'
      }, { status: 500 })
    }

    if (!customization) {
      return NextResponse.json({
        success: true,
        data: {
          hasCustomization: false,
          isPublished: false,
          liveUrl: null
        }
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://carbot.vercel.app'
    const liveUrl = customization.is_published ? 
      `${baseUrl}/l/${customization.custom_slug}` : null

    return NextResponse.json({
      success: true,
      data: {
        hasCustomization: true,
        isPublished: customization.is_published,
        publishedAt: customization.published_at,
        liveUrl: liveUrl,
        customSlug: customization.custom_slug,
        templateType: customization.template_type
      }
    })

  } catch (error) {
    console.error('Publication status error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get publication status'
    }, { status: 500 })
  }
})