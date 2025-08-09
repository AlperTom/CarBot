/**
 * WebsiteRouter - Multi-page routing system
 * Simple client-side router for automotive workshop websites
 */

import { useState, useEffect } from 'react'
import WebsiteLayout from '../shared/WebsiteLayout'

// Page components
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import ServicesPage from '../pages/ServicesPage'
import ContactPage from '../pages/ContactPage'
import ImpressumPage from '../legal/ImpressumPage'
import DatenschutzPage from '../legal/DatenschutzPage'

export default function WebsiteRouter({ config, templateType = 'general' }) {
  const [currentPage, setCurrentPage] = useState('home')
  const [pageParams, setPageParams] = useState({})

  // Default configuration
  const defaultConfig = {
    businessName: "Musterwerkstatt",
    slug: "musterwerkstatt",
    domain: "musterwerkstatt.de",
    templateType: templateType,
    
    // Navigation configuration
    navigation: {
      home: { label: 'Startseite', icon: '🏠', enabled: true },
      services: { label: 'Services', icon: '🔧', enabled: true },
      about: { label: 'Über uns', icon: '👥', enabled: true },
      contact: { label: 'Kontakt', icon: '📞', enabled: true }
    },
    
    // Legal pages (always enabled for German compliance)
    legalPages: {
      impressum: { label: 'Impressum', enabled: true },
      datenschutz: { label: 'Datenschutz', enabled: true }
    },
    
    ...config
  }

  // Initialize router from URL hash or localStorage
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      const [page, ...paramParts] = hash.split('/')
      
      if (page && isValidPage(page)) {
        setCurrentPage(page)
        
        // Parse parameters
        const params = {}
        paramParts.forEach(param => {
          const [key, value] = param.split('=')
          if (key && value) {
            params[key] = decodeURIComponent(value)
          }
        })
        setPageParams(params)
      } else if (!hash) {
        // Default to home if no hash
        setCurrentPage('home')
        setPageParams({})
      }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    // Initial load
    handleHashChange()
    
    // Store initial visit
    const visitKey = `carbot_visit_${defaultConfig.slug}`
    if (!localStorage.getItem(visitKey)) {
      localStorage.setItem(visitKey, JSON.stringify({
        firstVisit: new Date().toISOString(),
        templateType: defaultConfig.templateType
      }))
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [defaultConfig.slug, defaultConfig.templateType])

  // Check if page is valid
  const isValidPage = (page) => {
    const validPages = [
      'home', 'services', 'about', 'contact', 
      'impressum', 'datenschutz'
    ]
    return validPages.includes(page)
  }

  // Navigate to page
  const navigateTo = (page, params = {}) => {
    if (!isValidPage(page)) {
      console.warn(`Invalid page: ${page}`)
      return
    }

    let hash = `#${page}`
    
    // Add parameters to hash
    if (Object.keys(params).length > 0) {
      const paramString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('/')
      hash += `/${paramString}`
    }

    window.location.hash = hash
  }

  // Get page title
  const getPageTitle = () => {
    const pageTitles = {
      home: `${defaultConfig.businessName} - Ihre Kfz-Werkstatt`,
      services: `Services - ${defaultConfig.businessName}`,
      about: `Über uns - ${defaultConfig.businessName}`,
      contact: `Kontakt - ${defaultConfig.businessName}`,
      impressum: `Impressum - ${defaultConfig.businessName}`,
      datenschutz: `Datenschutz - ${defaultConfig.businessName}`
    }
    return pageTitles[currentPage] || `${defaultConfig.businessName}`
  }

  // Update document title
  useEffect(() => {
    document.title = getPageTitle()
  }, [currentPage, defaultConfig.businessName])

  // Get page meta description
  const getPageDescription = () => {
    const descriptions = {
      home: `Professionelle Kfz-Werkstatt ${defaultConfig.businessName} - Reparaturen, Inspektionen und Service für alle Fahrzeugmarken.`,
      services: `Alle Services von ${defaultConfig.businessName} - HU/AU, Reparaturen, Wartung, Reifenwechsel und mehr.`,
      about: `Lernen Sie ${defaultConfig.businessName} kennen - Ihr Meisterbetrieb für Kfz-Reparaturen mit jahrelanger Erfahrung.`,
      contact: `Kontakt zu ${defaultConfig.businessName} - Termin vereinbaren, Kostenvoranschlag oder Notfall-Service.`,
      impressum: `Impressum und Kontaktdaten von ${defaultConfig.businessName} gemäß § 5 TMG.`,
      datenschutz: `Datenschutzerklärung von ${defaultConfig.businessName} - Informationen zur Datenverarbeitung gemäß DSGVO.`
    }
    return descriptions[currentPage] || descriptions.home
  }

  // Update meta description
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', getPageDescription())
    }
  }, [currentPage, defaultConfig.businessName])

  // Render current page component
  const renderPage = () => {
    const pageProps = {
      config: defaultConfig,
      params: pageParams,
      navigate: navigateTo
    }

    switch (currentPage) {
      case 'home':
        return <HomePage {...pageProps} />
      case 'services':
        return <ServicesPage {...pageProps} />
      case 'about':
        return <AboutPage {...pageProps} />
      case 'contact':
        return <ContactPage {...pageProps} />
      case 'impressum':
        return <ImpressumPage {...pageProps} />
      case 'datenschutz':
        return <DatenschutzPage {...pageProps} />
      default:
        return (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              404 - Seite nicht gefunden
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Die gewünschte Seite konnte nicht gefunden werden.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🏠 Zur Startseite
            </button>
          </div>
        )
    }
  }

  // Breadcrumb navigation
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { page: 'home', label: 'Startseite' }
    ]

    if (currentPage !== 'home') {
      const pageLabels = {
        services: 'Services',
        about: 'Über uns', 
        contact: 'Kontakt',
        impressum: 'Impressum',
        datenschutz: 'Datenschutz'
      }
      breadcrumbs.push({ page: currentPage, label: pageLabels[currentPage] })
    }

    return breadcrumbs
  }

  // Enhanced navigation object with router functions
  const navigationProps = {
    ...defaultConfig.navigation,
    currentPage,
    navigate: navigateTo,
    breadcrumbs: getBreadcrumbs()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            "name": defaultConfig.businessName,
            "url": `https://${defaultConfig.domain}`,
            "description": getPageDescription(),
            "areaServed": defaultConfig.address?.city || "Deutschland",
            "serviceType": "Automotive Repair"
          })
        }}
      />
      
      <WebsiteLayout
        config={defaultConfig}
        currentPage={currentPage}
        navigation={navigationProps}
        onNavigate={navigateTo}
      >
        {renderPage()}
      </WebsiteLayout>

      {/* Analytics tracking for page views */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Track page view for analytics
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'page_view', {
                page_title: '${getPageTitle()}',
                page_location: window.location.href,
                page_path: '#${currentPage}',
                custom_parameter: {
                  workshop: '${defaultConfig.businessName}',
                  template_type: '${defaultConfig.templateType}'
                }
              });
            }
            
            // CarBot analytics (if enabled)
            if (typeof window !== 'undefined' && window.carbot_analytics_enabled) {
              console.log('CarBot Page View:', {
                page: '${currentPage}',
                workshop: '${defaultConfig.businessName}',
                timestamp: new Date().toISOString()
              });
            }
          `
        }}
      />
    </div>
  )
}

// Export navigation helper functions
export const createWebsiteNavigation = (config) => {
  return {
    navigateTo: (page, params = {}) => {
      let hash = `#${page}`
      if (Object.keys(params).length > 0) {
        const paramString = Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('/')
        hash += `/${paramString}`
      }
      window.location.hash = hash
    },
    
    getCurrentPage: () => {
      const hash = window.location.hash.slice(1)
      const [page] = hash.split('/')
      return page || 'home'
    },
    
    getPageParams: () => {
      const hash = window.location.hash.slice(1)
      const [, ...paramParts] = hash.split('/')
      const params = {}
      paramParts.forEach(param => {
        const [key, value] = param.split('=')
        if (key && value) {
          params[key] = decodeURIComponent(value)
        }
      })
      return params
    }
  }
}