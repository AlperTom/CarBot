/**
 * Template Preview API - Generate preview for template customizations
 * Phase 2 Feature: Live preview system for template editing
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAuth } from '../../../../lib/jwt-auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// POST GENERATE PREVIEW - Create preview data for template
export const POST = withAuth(async (request, context) => {
  try {
    const { workshop } = context
    const body = await request.json()
    const {
      template_type,
      customization = {}
    } = body

    if (!template_type) {
      return NextResponse.json({
        success: false,
        error: 'Template type is required'
      }, { status: 400 })
    }

    // Get template base configuration
    const templates = {
      'kfz_werkstatt_classic': {
        name: 'KFZ-Werkstatt Klassisch',
        baseStyles: {
          fontFamily: 'Inter, sans-serif',
          headerBackground: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
          sectionBackground: '#ffffff',
          cardBackground: '#f8fafc'
        },
        layout: 'traditional',
        components: ['hero', 'services', 'about', 'contact']
      },
      'modern_autoservice': {
        name: 'Moderner Autoservice', 
        baseStyles: {
          fontFamily: 'Poppins, sans-serif',
          headerBackground: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          sectionBackground: '#f8fafc',
          cardBackground: '#ffffff'
        },
        layout: 'modern',
        components: ['hero', 'features', 'services', 'testimonials', 'contact']
      },
      'premium_luxury_garage': {
        name: 'Premium Luxus Garage',
        baseStyles: {
          fontFamily: 'Playfair Display, serif',
          headerBackground: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          sectionBackground: '#111827',
          cardBackground: '#1f2937'
        },
        layout: 'luxury',
        components: ['hero', 'premium-services', 'expertise', 'vip-contact'],
        isPremium: true
      },
      'elektro_hybrid_spezialist': {
        name: 'Elektro & Hybrid Spezialist',
        baseStyles: {
          fontFamily: 'Roboto, sans-serif',
          headerBackground: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          sectionBackground: '#ecfdf5',
          cardBackground: '#ffffff'
        },
        layout: 'eco-friendly',
        components: ['hero', 'eco-services', 'sustainability', 'green-contact'],
        isPremium: true
      },
      'nutzfahrzeug_service': {
        name: 'Nutzfahrzeug Service',
        baseStyles: {
          fontFamily: 'Open Sans, sans-serif',
          headerBackground: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          sectionBackground: '#fffbeb',
          cardBackground: '#ffffff'
        },
        layout: 'commercial',
        components: ['hero', 'fleet-services', 'emergency', 'commercial-contact']
      }
    }

    const template = templates[template_type]
    if (!template) {
      return NextResponse.json({
        success: false,
        error: 'Invalid template type'
      }, { status: 400 })
    }

    // Merge customization with template defaults
    const mergedCustomization = {
      colors: {
        primary: customization.colors?.primary || '#ea580c',
        secondary: customization.colors?.secondary || '#1e293b',
        accent: customization.colors?.accent || '#10b981',
        background: customization.colors?.background || '#ffffff',
        text: customization.colors?.text || '#1e293b'
      },
      typography: {
        font_family: customization.typography?.font_family || template.baseStyles.fontFamily
      },
      branding: {
        logo_url: customization.branding?.logo_url || null,
        hero_title: customization.branding?.hero_title || workshop.business_name,
        hero_subtitle: customization.branding?.hero_subtitle || 'Ihr zuverlässiger Partner für KFZ-Service',
        hero_image: customization.branding?.hero_image || null
      },
      content: {
        about_title: customization.content?.about_title || 'Über uns',
        about_content: customization.content?.about_content || 'Wir sind Ihr zuverlässiger Partner für alle KFZ-Services.',
        services_title: customization.content?.services_title || 'Unsere Services',
        contact_title: customization.content?.contact_title || 'Kontakt'
      },
      contact_details: {
        address: customization.contact_details?.address || workshop.address,
        phone: customization.contact_details?.phone || workshop.phone,
        email: customization.contact_details?.email || workshop.owner_email,
        opening_hours: customization.contact_details?.opening_hours || {
          monday: '08:00-17:00',
          tuesday: '08:00-17:00', 
          wednesday: '08:00-17:00',
          thursday: '08:00-17:00',
          friday: '08:00-17:00',
          saturday: '09:00-14:00',
          sunday: 'Geschlossen'
        }
      }
    }

    // Generate custom CSS based on customization
    const customCSS = generateCustomCSS(template, mergedCustomization)

    // Generate preview HTML structure
    const previewStructure = generatePreviewStructure(template, mergedCustomization)

    // Create preview session (expires in 1 hour)
    const previewId = `preview_${workshop.id}_${Date.now()}`
    const { error: previewError } = await supabase
      .from('template_previews')
      .insert({
        id: previewId,
        workshop_id: workshop.id,
        template_type,
        customization_data: mergedCustomization,
        custom_css: customCSS,
        preview_html: previewStructure,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      })

    if (previewError) {
      console.error('Preview session creation error:', previewError)
    }

    return NextResponse.json({
      success: true,
      data: {
        previewId,
        template: {
          ...template,
          customization: mergedCustomization
        },
        customCSS,
        previewStructure,
        previewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${previewId}`
      }
    })

  } catch (error) {
    console.error('Template preview generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate template preview'
    }, { status: 500 })
  }
})

// GET PREVIEW DATA - Retrieve preview by ID
export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url)
    const previewId = searchParams.get('id')

    if (!previewId) {
      return NextResponse.json({
        success: false,
        error: 'Preview ID is required'
      }, { status: 400 })
    }

    const { data: preview, error } = await supabase
      .from('template_previews')
      .select('*')
      .eq('id', previewId)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !preview) {
      return NextResponse.json({
        success: false,
        error: 'Preview not found or expired'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: preview
    })

  } catch (error) {
    console.error('Preview fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch preview'
    }, { status: 500 })
  }
})

// Helper function to generate custom CSS
function generateCustomCSS(template, customization) {
  const { colors, typography } = customization
  
  return `
    :root {
      --primary-color: ${colors.primary};
      --secondary-color: ${colors.secondary};
      --accent-color: ${colors.accent};
      --background-color: ${colors.background};
      --text-color: ${colors.text};
      --font-family: ${typography.font_family};
    }
    
    body {
      font-family: var(--font-family);
      color: var(--text-color);
      background-color: var(--background-color);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    
    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: white;
      padding: 1rem 0;
    }
    
    .hero {
      background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
                  url('${customization.branding.hero_image || '/default-hero.jpg'}');
      background-size: cover;
      background-position: center;
      color: white;
      text-align: center;
      padding: 4rem 0;
    }
    
    .hero h1 {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .hero p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .section {
      padding: 3rem 0;
    }
    
    .section:nth-child(even) {
      background-color: #f8fafc;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      background-color: var(--secondary-color);
      transform: translateY(-2px);
    }
    
    .service-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
    
    .service-card:hover {
      transform: translateY(-5px);
    }
    
    .contact-info {
      background: var(--accent-color);
      color: white;
      padding: 2rem;
      border-radius: 12px;
    }
    
    ${customization.custom_css || ''}
  `
}

// Helper function to generate preview HTML structure
function generatePreviewStructure(template, customization) {
  const { branding, content, contact_details } = customization
  
  return {
    header: {
      logo: branding.logo_url,
      navigation: ['Home', 'Services', 'Über uns', 'Kontakt']
    },
    hero: {
      title: branding.hero_title,
      subtitle: branding.hero_subtitle,
      image: branding.hero_image,
      cta: 'Termin vereinbaren'
    },
    sections: template.components.map(component => ({
      type: component,
      title: content[`${component}_title`] || getDefaultSectionTitle(component),
      content: content[`${component}_content`] || getDefaultSectionContent(component)
    })),
    contact: {
      title: content.contact_title,
      details: contact_details
    },
    footer: {
      businessName: branding.hero_title,
      links: ['Impressum', 'Datenschutz', 'AGB']
    }
  }
}

function getDefaultSectionTitle(component) {
  const titles = {
    'services': 'Unsere Services',
    'about': 'Über uns',
    'features': 'Unsere Leistungen',
    'testimonials': 'Kundenbewertungen',
    'premium-services': 'Premium Services',
    'expertise': 'Unsere Expertise',
    'eco-services': 'Umweltfreundliche Services',
    'sustainability': 'Nachhaltigkeit',
    'fleet-services': 'Flottenservice',
    'emergency': '24/7 Notdienst'
  }
  return titles[component] || 'Services'
}

function getDefaultSectionContent(component) {
  const content = {
    'services': 'Professionelle KFZ-Services für alle Fahrzeugtypen.',
    'about': 'Seit Jahren Ihr zuverlässiger Partner für KFZ-Service und Reparaturen.',
    'features': 'Modernste Technik und erfahrene Mechaniker.',
    'testimonials': 'Was unsere Kunden über uns sagen.',
    'premium-services': 'Exklusive Services für Luxusfahrzeuge.',
    'expertise': 'Spezialisiert auf hochwertige Fahrzeuge.',
    'eco-services': 'Umweltschonende Reparatur und Wartung.',
    'sustainability': 'Nachhaltige Mobilität für die Zukunft.',
    'fleet-services': 'Professionelle Betreuung Ihrer Fahrzeugflotte.',
    'emergency': 'Rund um die Uhr für Sie da.'
  }
  return content[component] || 'Professionelle Services für Ihr Fahrzeug.'
}