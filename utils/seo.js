/**
 * SEO utilities for customer-specific landing pages
 */

/**
 * Generate SEO-optimized title for customer page
 */
export function generateCustomerTitle(customer) {
  const location = customer.city || customer.address || ''
  const name = customer.name || 'KFZ-Werkstatt'
  
  if (location) {
    return `${name} in ${location} | CarBot Serviceberater`
  }
  return `${name} | CarBot Serviceberater`
}

/**
 * Generate SEO-optimized description for customer page
 */
export function generateCustomerDescription(customer) {
  const name = customer.name || 'KFZ-Werkstatt'
  const location = customer.city || customer.address || ''
  const services = customer.services?.slice(0, 3).join(', ') || 'KFZ-Service'
  
  let description = `${name} - Professioneller KFZ-Service`
  
  if (location) {
    description += ` in ${location}`
  }
  
  description += `. Spezialisiert auf: ${services}. Jetzt online beraten lassen!`
  
  return description
}

/**
 * Generate keywords array for customer page
 */
export function generateCustomerKeywords(customer) {
  const baseKeywords = [
    'KFZ-Werkstatt',
    'Auto-Service',
    'Autoreparatur',
    'Fahrzeugwartung',
    'TÜV',
    'Inspektion',
    'CarBot'
  ]
  
  const customerKeywords = []
  
  // Add customer name
  if (customer.name) {
    customerKeywords.push(customer.name)
  }
  
  // Add location-based keywords
  if (customer.city) {
    customerKeywords.push(customer.city)
    customerKeywords.push(`KFZ-Werkstatt ${customer.city}`)
    customerKeywords.push(`Autoreparatur ${customer.city}`)
  }
  
  // Add service-based keywords
  if (customer.services?.length) {
    customerKeywords.push(...customer.services)
    customer.services.forEach(service => {
      if (customer.city) {
        customerKeywords.push(`${service} ${customer.city}`)
      }
    })
  }
  
  return [...customerKeywords, ...baseKeywords]
}

/**
 * Generate Open Graph metadata for customer page
 */
export function generateOpenGraphData(customer) {
  const title = generateCustomerTitle(customer)
  const description = generateCustomerDescription(customer)
  const location = customer.city || ''
  
  return {
    title: location ? `${customer.name} | KFZ-Service in ${location}` : `${customer.name} | KFZ-Service`,
    description: `Professioneller Autoservice bei ${customer.name}. Online-Beratung verfügbar.`,
    images: customer.logo ? [customer.logo] : [],
    type: 'business.business',
    url: `https://carbot.chat/${customer.slug}`,
    siteName: 'CarBot Serviceberater'
  }
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCardData(customer) {
  const location = customer.city || ''
  
  return {
    card: 'summary_large_image',
    title: `${customer.name} | KFZ-Service`,
    description: location ? `Professioneller Autoservice in ${location}` : 'Professioneller Autoservice',
    images: customer.hero_image ? [customer.hero_image] : customer.logo ? [customer.logo] : []
  }
}

/**
 * Generate JSON-LD structured data for local business
 */
export function generateLocalBusinessJsonLd(customer) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: customer.name,
    description: customer.description,
    url: `https://carbot.chat/${customer.slug}`,
    telephone: customer.phone,
    email: customer.email
  }
  
  // Add logo if available
  if (customer.logo) {
    jsonLd.logo = customer.logo
  }
  
  // Add hero image if available
  if (customer.hero_image) {
    jsonLd.image = customer.hero_image
  }
  
  // Add address information
  if (customer.address || customer.city || customer.postal_code) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: customer.address,
      addressLocality: customer.city,
      postalCode: customer.postal_code,
      addressCountry: 'DE'
    }
  }
  
  // Add geographic coordinates
  if (customer.latitude && customer.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: customer.latitude,
      longitude: customer.longitude
    }
  }
  
  // Add opening hours
  if (customer.opening_hours) {
    jsonLd.openingHours = formatOpeningHoursForSchema(customer.opening_hours)
  }
  
  // Add price range
  if (customer.price_range) {
    jsonLd.priceRange = customer.price_range
  }
  
  // Add Google rating if available
  if (customer.google_rating && customer.google_review_count) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: customer.google_rating,
      reviewCount: customer.google_review_count
    }
  }
  
  // Add service offerings
  if (customer.services?.length) {
    jsonLd.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'KFZ-Services',
      itemListElement: customer.services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service
        }
      }))
    }
  }
  
  return jsonLd
}

/**
 * Format opening hours for Schema.org
 */
function formatOpeningHoursForSchema(openingHours) {
  const dayMapping = {
    monday: 'Mo',
    tuesday: 'Tu', 
    wednesday: 'We',
    thursday: 'Th',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'Su'
  }
  
  const formatted = []
  
  Object.entries(openingHours).forEach(([day, hours]) => {
    if (hours && hours !== 'closed') {
      const schemaDay = dayMapping[day.toLowerCase()]
      if (schemaDay) {
        formatted.push(`${schemaDay} ${hours}`)
      }
    }
  })
  
  return formatted
}

/**
 * Generate business metadata for enhanced SEO
 */
export function generateBusinessMetadata(customer) {
  const metadata = {}
  
  // Add business-specific meta tags
  if (customer.city) {
    metadata['business:contact_data:locality'] = customer.city
  }
  
  if (customer.state) {
    metadata['business:contact_data:region'] = customer.state
  }
  
  if (customer.postal_code) {
    metadata['business:contact_data:postal_code'] = customer.postal_code
  }
  
  metadata['business:contact_data:country_name'] = 'Deutschland'
  
  // Add geographic metadata
  if (customer.latitude && customer.longitude) {
    metadata['geo.position'] = `${customer.latitude};${customer.longitude}`
    metadata['geo.placename'] = customer.city || customer.name
    metadata['ICBM'] = `${customer.latitude}, ${customer.longitude}`
  }
  
  return metadata
}

/**
 * Generate canonical URL for customer page
 */
export function generateCanonicalUrl(customerSlug) {
  return `https://carbot.chat/${customerSlug}`
}

/**
 * Generate hreflang tags for international SEO (if needed in future)
 */
export function generateHreflangTags(customerSlug) {
  return {
    'de-DE': `https://carbot.chat/${customerSlug}`,
    'x-default': `https://carbot.chat/${customerSlug}`
  }
}