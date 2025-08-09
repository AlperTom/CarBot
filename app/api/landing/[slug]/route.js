/**
 * Landing Page Data API - Fetch landing page data by slug
 * Phase 2 Feature: Public landing page data retrieval
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request, { params }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Slug parameter is required'
      }, { status: 400 })
    }

    // Fetch published landing page by slug
    const { data: customization, error: customizationError } = await supabase
      .from('workshop_template_customizations')
      .select(`
        *,
        workshops (
          id,
          business_name,
          address,
          phone,
          owner_email,
          client_keys (
            client_key_hash,
            is_active
          )
        )
      `)
      .eq('custom_slug', slug)
      .eq('is_published', true)
      .single()

    if (customizationError || !customization) {
      console.error('Landing page fetch error:', customizationError)
      return NextResponse.json({
        success: false,
        error: 'Landing page not found'
      }, { status: 404 })
    }

    // Check if the workshop is active and has valid subscription
    const { data: subscription } = await supabase
      .from('workshop_subscriptions')
      .select(`
        status,
        subscription_plans (
          plan_type,
          features
        )
      `)
      .eq('workshop_id', customization.workshops.id)
      .in('status', ['active', 'trialing'])
      .single()

    // For premium templates, check if workshop has appropriate plan
    const premiumTemplates = ['premium_luxury_garage', 'elektro_hybrid_spezialist']
    if (premiumTemplates.includes(customization.template_type)) {
      if (!subscription || subscription.subscription_plans?.plan_type === 'basic') {
        return NextResponse.json({
          success: false,
          error: 'Premium template requires active subscription'
        }, { status: 403 })
      }
    }

    // Increment page view analytics
    try {
      await supabase.rpc('increment_page_views', {
        p_workshop_id: customization.workshops.id,
        p_page_type: 'landing_page'
      })
    } catch (analyticsError) {
      console.error('Analytics increment error:', analyticsError)
      // Don't fail the request if analytics fails
    }

    // Structure the response data
    const responseData = {
      customization: {
        template_type: customization.template_type,
        custom_slug: customization.custom_slug,
        colors: customization.colors || {
          primary: '#ea580c',
          secondary: '#1e293b',
          accent: '#10b981',
          background: '#ffffff',
          text: '#1e293b'
        },
        typography: customization.typography || {
          font_family: 'Inter, sans-serif'
        },
        branding: customization.branding || {
          hero_title: customization.workshops.business_name,
          hero_subtitle: 'Ihr zuverlässiger Partner für KFZ-Service',
          logo_url: null,
          hero_image: null
        },
        content: customization.content || {
          about_title: 'Über uns',
          about_content: 'Seit Jahren sind wir Ihr vertrauensvoller Partner für alle KFZ-Services.',
          services_title: 'Unsere Services',
          contact_title: 'Kontakt'
        },
        contact_details: customization.contact_details || {
          address: customization.workshops.address,
          phone: customization.workshops.phone,
          email: customization.workshops.owner_email,
          opening_hours: {
            monday: '08:00-17:00',
            tuesday: '08:00-17:00',
            wednesday: '08:00-17:00',
            thursday: '08:00-17:00',
            friday: '08:00-17:00',
            saturday: '09:00-14:00',
            sunday: 'Geschlossen'
          }
        },
        seo: customization.seo || {
          meta_title: `${customization.workshops.business_name} - Autowerkstatt`,
          meta_description: `Professionelle KFZ-Services von ${customization.workshops.business_name}`,
          meta_keywords: 'Autowerkstatt, KFZ-Service, Reparatur'
        },
        custom_css: customization.custom_css
      },
      workshop: {
        id: customization.workshops.id,
        business_name: customization.workshops.business_name,
        address: customization.workshops.address,
        phone: customization.workshops.phone,
        owner_email: customization.workshops.owner_email,
        client_keys: customization.workshops.client_keys?.filter(key => key.is_active)
      },
      subscription: subscription ? {
        status: subscription.status,
        plan_type: subscription.subscription_plans?.plan_type,
        features: subscription.subscription_plans?.features
      } : null
    }

    // Set cache headers for better performance
    const response = NextResponse.json({
      success: true,
      data: responseData
    })

    // Cache for 5 minutes for published pages
    response.headers.set(
      'Cache-Control', 
      'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
    )

    return response

  } catch (error) {
    console.error('Landing page API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}