/**
 * TemplateWebsiteWrapper - Integration component for existing templates
 * Transforms existing automotive landing page templates into complete websites
 */

import { useState, useEffect } from 'react'
import WebsiteRouter from '../routing/WebsiteRouter'
import CookieConsent from '../shared/CookieConsent'

// Import existing templates (these would be the original landing page components)
const AutomotiveTemplates = {
  klassische: null, // Will be loaded dynamically
  moderne: null,
  premium: null,
  family: null,
  electric: null
}

export default function TemplateWebsiteWrapper({
  templateType = 'klassische',
  config = {},
  enableFullWebsite = true
}) {
  const [isFullWebsite, setIsFullWebsite] = useState(enableFullWebsite)
  const [templateConfig, setTemplateConfig] = useState(null)

  // Enhanced configuration that merges template-specific settings
  const getTemplateConfig = () => {
    const baseConfig = {
      // Default workshop configuration
      businessName: "AutoService Müller",
      ownerName: "Hans Müller",
      phone: "+49 30 123456789",
      email: "info@autoservice-mueller.de",
      address: {
        street: "Hauptstraße 123",
        city: "Berlin",
        postalCode: "10115"
      },
      
      // Template-specific configurations
      templateType: templateType,
      slug: config.slug || templateType.toLowerCase(),
      domain: config.domain || `${templateType.toLowerCase()}-werkstatt.de`,
      
      // Theme and branding
      theme: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745'
      },
      
      ...config
    }

    // Template-specific overrides
    switch (templateType) {
      case 'klassische':
        return {
          ...baseConfig,
          businessName: config.businessName || "Klassische Autowerkstatt Müller",
          tagline: "Traditionelle Handwerkskunst seit 1995",
          specializations: ['general', 'classic'],
          theme: {
            primary: '#1f2937', // Dark gray
            secondary: '#6b7280',
            accent: '#f59e0b' // Amber
          },
          hero: {
            title: "Klassische Autowerkstatt mit Tradition",
            subtitle: "Meisterhafte Reparaturen für alle Fahrzeugmarken",
            description: "Seit über 25 Jahren Ihr vertrauensvoller Partner für Kfz-Reparaturen. Traditionelle Handwerkskunst trifft moderne Technik."
          }
        }

      case 'moderne':
        return {
          ...baseConfig,
          businessName: config.businessName || "ModernTech Autowerkstatt",
          tagline: "Innovation trifft Präzision",
          specializations: ['modern', 'diagnostic'],
          theme: {
            primary: '#8b5cf6', // Purple
            secondary: '#6b7280',
            accent: '#06b6d4' // Cyan
          },
          hero: {
            title: "Moderne Autowerkstatt der Zukunft",
            subtitle: "Hightech-Diagnose und innovative Reparaturen",
            description: "Modernste Ausstattung und digitale Services für perfekte Fahrzeugbetreuung. Die Zukunft der Kfz-Reparatur."
          }
        }

      case 'premium':
        return {
          ...baseConfig,
          businessName: config.businessName || "Premium Automotive Service",
          tagline: "Exzellenz in der Fahrzeugtechnik",
          specializations: ['premium', 'luxury'],
          theme: {
            primary: '#1f2937', // Dark
            secondary: '#6b7280',
            accent: '#f59e0b' // Gold
          },
          hero: {
            title: "Premium-Werkstatt für anspruchsvolle Fahrzeuge",
            subtitle: "Luxus-Service auf höchstem Niveau",
            description: "Spezialist für Premiummarken und Luxusfahrzeuge. Exklusive Betreuung mit höchsten Qualitätsstandards."
          },
          pricing: {
            showPricing: false, // Premium doesn't show prices
            priceRange: "€€€"
          }
        }

      case 'family':
        return {
          ...baseConfig,
          businessName: config.businessName || "Familien-Autowerkstatt Schmidt",
          tagline: "Die Werkstatt für die ganze Familie",
          specializations: ['family', 'general'],
          theme: {
            primary: '#059669', // Green
            secondary: '#6b7280',
            accent: '#f97316' // Orange
          },
          hero: {
            title: "Ihre familienfreundliche Autowerkstatt",
            subtitle: "Vertrauen und Service für die ganze Familie",
            description: "Kinderecke, flexible Termine und ehrliche Beratung. Bei uns fühlt sich die ganze Familie wohl."
          },
          amenities: {
            childrenArea: true,
            flexibleHours: true,
            shuttleService: true
          }
        }

      case 'electric':
        return {
          ...baseConfig,
          businessName: config.businessName || "ElektroMobil Werkstatt",
          tagline: "Spezialist für Elektro- und Hybridfahrzeuge",
          specializations: ['electric', 'hybrid', 'modern'],
          theme: {
            primary: '#059669', // Emerald
            secondary: '#6b7280',
            accent: '#0ea5e9' // Sky blue
          },
          hero: {
            title: "Elektro & Hybrid Spezialist",
            subtitle: "Die Zukunft der Mobilität - schon heute",
            description: "Zertifizierte Werkstatt für E-Fahrzeuge und Hybridtechnik. Umweltbewusst und zukunftsorientiert."
          },
          services: {
            batteryService: true,
            chargingStations: true,
            hybridSpecialist: true,
            ecoFriendly: true
          }
        }

      default:
        return baseConfig
    }
  }

  // Initialize template configuration
  useEffect(() => {
    const config = getTemplateConfig()
    setTemplateConfig(config)
    
    // Set document title and meta
    document.title = `${config.businessName} - ${config.tagline}`
    
    // Update favicon based on template
    const favicon = document.querySelector('link[rel="icon"]')
    if (favicon) {
      const faviconEmojis = {
        klassische: '🔧',
        moderne: '💻',
        premium: '👑',
        family: '👨‍👩‍👧‍👦',
        electric: '⚡'
      }
      // In a real implementation, you'd generate actual favicon files
      console.log(`Favicon should be: ${faviconEmojis[templateType] || '🚗'}`)
    }
    
  }, [templateType, config])

  // Handle template mode switching (landing page vs full website)
  const toggleWebsiteMode = () => {
    setIsFullWebsite(!isFullWebsite)
    
    // Track mode switch for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'website_mode_switch', {
        template_type: templateType,
        new_mode: !isFullWebsite ? 'full_website' : 'landing_page',
        business_name: templateConfig?.businessName
      })
    }
  }

  // Legacy landing page mode (for compatibility)
  const renderLandingPage = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Legacy Template Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Legacy Modus:</strong> Dies ist eine einfache Landingpage. 
                  <button 
                    onClick={toggleWebsiteMode}
                    className="ml-2 underline hover:no-underline"
                  >
                    Zur vollständigen Website wechseln
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Original Template Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {templateConfig?.businessName}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {templateConfig?.tagline}
            </p>
            <p className="text-lg text-gray-500">
              {templateConfig?.hero?.description}
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Kontaktieren Sie uns
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-2xl mr-4">📞</span>
                <div>
                  <div className="font-semibold">Telefon:</div>
                  <a href={`tel:${templateConfig?.phone}`} className="text-blue-600">
                    {templateConfig?.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-4">✉️</span>
                <div>
                  <div className="font-semibold">E-Mail:</div>
                  <a href={`mailto:${templateConfig?.email}`} className="text-blue-600">
                    {templateConfig?.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-4">📍</span>
                <div>
                  <div className="font-semibold">Adresse:</div>
                  <div>{templateConfig?.address?.street}</div>
                  <div>{templateConfig?.address?.postalCode} {templateConfig?.address?.city}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={toggleWebsiteMode}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🌐 Vollständige Website anzeigen
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while configuration is being set up
  if (!templateConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Lade Werkstatt-Website...</p>
        </div>
      </div>
    )
  }

  // Render based on mode
  return (
    <>
      {/* Full Website Mode */}
      {isFullWebsite ? (
        <>
          <WebsiteRouter 
            config={templateConfig}
            templateType={templateType}
          />
          
          {/* Cookie Consent */}
          <CookieConsent 
            config={templateConfig}
            onAccept={(consent) => {
              console.log('Cookies accepted:', consent)
              // Initialize analytics, marketing tools, etc.
            }}
            onDecline={(consent) => {
              console.log('Cookies declined:', consent)
              // Only essential cookies
            }}
          />

          {/* Website Mode Toggle (for demo/testing) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 z-50">
              <button
                onClick={toggleWebsiteMode}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700 transition-colors shadow-lg"
                title="Zu Legacy Landing Page wechseln"
              >
                🔄 Legacy Mode
              </button>
            </div>
          )}
        </>
      ) : (
        // Legacy Landing Page Mode
        renderLandingPage()
      )}

      {/* Analytics and Performance Tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Template performance tracking
            if (typeof window !== 'undefined') {
              window.carbot_template_metrics = {
                template_type: '${templateType}',
                mode: '${isFullWebsite ? 'full_website' : 'landing_page'}',
                business_name: '${templateConfig?.businessName}',
                load_time: Date.now()
              };
              
              // Track template usage
              console.log('CarBot Template Active:', window.carbot_template_metrics);
            }
          `
        }}
      />
    </>
  )
}

// Helper function to get template configuration without rendering
export const getTemplateConfig = (templateType, customConfig = {}) => {
  const baseConfig = {
    businessName: "AutoService Müller",
    templateType: templateType,
    slug: customConfig.slug || templateType.toLowerCase(),
    ...customConfig
  }

  // Apply template-specific settings
  switch (templateType) {
    case 'klassische':
      return { ...baseConfig, specializations: ['general', 'classic'] }
    case 'moderne':
      return { ...baseConfig, specializations: ['modern', 'diagnostic'] }
    case 'premium':
      return { ...baseConfig, specializations: ['premium', 'luxury'] }
    case 'family':
      return { ...baseConfig, specializations: ['family', 'general'] }
    case 'electric':
      return { ...baseConfig, specializations: ['electric', 'hybrid', 'modern'] }
    default:
      return baseConfig
  }
}

// Export template wrapper for easy integration
export const createAutomotiveWebsite = (templateType, config = {}) => {
  const AutomotiveWebsite = (props) => (
    <TemplateWebsiteWrapper 
      templateType={templateType}
      config={{ ...config, ...props }}
      enableFullWebsite={true}
    />
  )
  AutomotiveWebsite.displayName = `AutomotiveWebsite_${templateType}`
  return AutomotiveWebsite
}