/**
 * Templates API - Manage landing page templates and customizations
 * Phase 2 Feature: Template customization system
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../../../lib/jwt-auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET ALL TEMPLATES - Retrieve available templates
export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const templateType = searchParams.get('type')
    const includeCustomizations = searchParams.get('include_customizations') === 'true'

    // Get predefined templates
    const templates = [
      {
        id: 'kfz_werkstatt_classic',
        name: 'KFZ-Werkstatt Klassisch',
        description: 'Klassisches Design für traditionelle Autowerkstätten',
        category: 'automotive',
        preview_image: '/templates/kfz-classic-preview.jpg',
        colors: {
          primary: '#ea580c',
          secondary: '#1e293b',
          accent: '#10b981',
          background: '#ffffff',
          text: '#1e293b'
        },
        features: ['Serviceübersicht', 'Terminbuchung', 'Kontaktformular', 'Über uns'],
        is_premium: false
      },
      {
        id: 'modern_autoservice',
        name: 'Moderner Autoservice',
        description: 'Zeitgemäßes Design mit modernen Elementen',
        category: 'automotive',
        preview_image: '/templates/modern-autoservice-preview.jpg',
        colors: {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#f59e0b',
          background: '#f8fafc',
          text: '#1e293b'
        },
        features: ['Responsive Design', 'Online Buchung', 'Service-Katalog', 'Bewertungen'],
        is_premium: false
      },
      {
        id: 'premium_luxury_garage',
        name: 'Premium Luxus Garage',
        description: 'Elegantes Design für Luxusfahrzeug-Werkstätten',
        category: 'luxury',
        preview_image: '/templates/luxury-garage-preview.jpg',
        colors: {
          primary: '#1f2937',
          secondary: '#d97706',
          accent: '#dc2626',
          background: '#111827',
          text: '#f9fafb'
        },
        features: ['Luxury Branding', 'Premium Services', 'VIP Bereich', 'Concierge Service'],
        is_premium: true
      },
      {
        id: 'elektro_hybrid_spezialist',
        name: 'Elektro & Hybrid Spezialist',
        description: 'Spezialisiert auf Elektro- und Hybridfahrzeuge',
        category: 'electric',
        preview_image: '/templates/elektro-hybrid-preview.jpg',
        colors: {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#34d399',
          background: '#ecfdf5',
          text: '#064e3b'
        },
        features: ['Umweltfreundlich', 'E-Mobilität', 'Ladestation Info', 'Nachhaltigkeit'],
        is_premium: true
      },
      {
        id: 'nutzfahrzeug_service',
        name: 'Nutzfahrzeug Service',
        description: 'Optimiert für LKW und Nutzfahrzeug-Werkstätten',
        category: 'commercial',
        preview_image: '/templates/nutzfahrzeug-preview.jpg',
        colors: {
          primary: '#f59e0b',
          secondary: '#d97706',
          accent: '#92400e',
          background: '#fffbeb',
          text: '#92400e'
        },
        features: ['Flottenservice', '24/7 Notdienst', 'Großkunden', 'Wartungsverträge'],
        is_premium: false
      }
    ]

    // Filter by type if specified
    let filteredTemplates = templates
    if (templateType) {
      filteredTemplates = templates.filter(t => t.category === templateType)
    }

    // Get workshop customizations if requested
    let customizations = null
    if (includeCustomizations && context.workshop) {
      const { data: customizationData } = await supabase
        .from('workshop_template_customizations')
        .select('*')
        .eq('workshop_id', context.workshop.id)
        .single()

      customizations = customizationData
    }

    return NextResponse.json({
      success: true,
      data: {
        templates: filteredTemplates,
        customizations: customizations
      }
    })

  } catch (error) {
    console.error('Templates fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch templates'
    }, { status: 500 })
  }
})

// POST CREATE TEMPLATE CUSTOMIZATION - Save template customization
export const POST = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const {
      template_type,
      custom_slug,
      primary_color,
      secondary_color,
      accent_color,
      background_color,
      text_color,
      font_family,
      logo_url,
      hero_title,
      hero_subtitle,
      hero_image,
      about_title,
      about_content,
      services_title,
      contact_title,
      contact_address,
      contact_phone,
      contact_email,
      opening_hours,
      impressum_content,
      privacy_policy_content,
      custom_css,
      meta_title,
      meta_description,
      meta_keywords,
      is_published = false
    } = body

    // Validate required fields
    if (!template_type || !custom_slug) {
      return NextResponse.json({
        success: false,
        error: 'Template type and custom slug are required'
      }, { status: 400 })
    }

    // Check if slug is already taken (across all workshops)
    const { data: existingSlug } = await supabase
      .from('workshop_template_customizations')
      .select('id')
      .eq('custom_slug', custom_slug)
      .neq('workshop_id', workshop.id)
      .single()

    if (existingSlug) {
      return NextResponse.json({
        success: false,
        error: 'Dieser Slug ist bereits vergeben. Bitte wählen Sie einen anderen.'
      }, { status: 409 })
    }

    // Prepare customization data
    const customizationData = {
      workshop_id: workshop.id,
      template_type,
      custom_slug: custom_slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      colors: {
        primary: primary_color || '#ea580c',
        secondary: secondary_color || '#1e293b',
        accent: accent_color || '#10b981',
        background: background_color || '#ffffff',
        text: text_color || '#1e293b'
      },
      typography: {
        font_family: font_family || 'Inter'
      },
      branding: {
        logo_url,
        hero_title: hero_title || workshop.business_name,
        hero_subtitle,
        hero_image
      },
      content: {
        about_title: about_title || 'Über uns',
        about_content,
        services_title: services_title || 'Unsere Services',
        contact_title: contact_title || 'Kontakt'
      },
      contact_details: {
        address: contact_address,
        phone: contact_phone,
        email: contact_email,
        opening_hours: opening_hours || {}
      },
      legal: {
        impressum_content,
        privacy_policy_content
      },
      custom_css,
      seo: {
        meta_title: meta_title || `${workshop.business_name} - Autowerkstatt`,
        meta_description,
        meta_keywords: meta_keywords || 'Autowerkstatt, KFZ-Service, Reparatur'
      },
      is_published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Upsert customization (update if exists, insert if not)
    const { data: customization, error } = await supabase
      .from('workshop_template_customizations')
      .upsert(customizationData, {
        onConflict: 'workshop_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Template customization save error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to save template customization'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: customization,
      message: 'Template-Anpassungen erfolgreich gespeichert!'
    }, { status: 201 })

  } catch (error) {
    console.error('Template customization creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create template customization'
    }, { status: 500 })
  }
})

// PUT UPDATE TEMPLATE CUSTOMIZATION - Update existing customization
export const PUT = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const updateData = { ...body }
    
    // Remove workshop_id from update data (should not be changed)
    delete updateData.workshop_id
    delete updateData.id
    delete updateData.created_at
    
    // Set updated timestamp
    updateData.updated_at = new Date().toISOString()

    // If custom_slug is being updated, check availability
    if (updateData.custom_slug) {
      updateData.custom_slug = updateData.custom_slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      
      const { data: existingSlug } = await supabase
        .from('workshop_template_customizations')
        .select('id')
        .eq('custom_slug', updateData.custom_slug)
        .neq('workshop_id', workshop.id)
        .single()

      if (existingSlug) {
        return NextResponse.json({
          success: false,
          error: 'Dieser Slug ist bereits vergeben.'
        }, { status: 409 })
      }
    }

    const { data: customization, error } = await supabase
      .from('workshop_template_customizations')
      .update(updateData)
      .eq('workshop_id', workshop.id)
      .select()
      .single()

    if (error) {
      console.error('Template customization update error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to update template customization'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: customization,
      message: 'Template-Anpassungen erfolgreich aktualisiert!'
    })

  } catch (error) {
    console.error('Template customization update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update template customization'
    }, { status: 500 })
  }
})

// DELETE RESET TEMPLATE CUSTOMIZATION - Reset to defaults
export const DELETE = withAuth(async (request, context) => {
  try {
    const { workshop } = context

    const { error } = await supabase
      .from('workshop_template_customizations')
      .delete()
      .eq('workshop_id', workshop.id)

    if (error) {
      console.error('Template customization deletion error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to reset template customization'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Template-Anpassungen erfolgreich zurückgesetzt!'
    })

  } catch (error) {
    console.error('Template customization deletion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to reset template customization'
    }, { status: 500 })
  }
})