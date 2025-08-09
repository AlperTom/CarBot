/**
 * Client Key Validation - Simple validation for development and production
 * Provides client key validation without requiring full database setup
 */

// Simple in-memory store for development (replace with database in production)
const mockClientKeys = new Map([
  ['ck_test_klassische_werkstatt_123', {
    id: 'ck_test_klassische_werkstatt_123',
    workshop: {
      id: 'ws_klassische_001',
      name: 'Klassische Autowerkstatt Müller',
      businessName: 'Klassische Autowerkstatt Müller',
      templateType: 'klassische',
      phone: '+49 30 12345678',
      email: 'info@klassische-werkstatt.de',
      address: {
        street: 'Hauptstraße 123',
        city: 'Berlin',
        postalCode: '10115'
      },
      specializations: ['general', 'classic'],
      theme: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#f59e0b'
      }
    },
    isActive: true,
    authorizedDomains: ['localhost:3000', 'klassische-werkstatt.de'],
    createdAt: '2024-01-01T00:00:00Z'
  }],
  ['ck_test_moderne_werkstatt_456', {
    id: 'ck_test_moderne_werkstatt_456',
    workshop: {
      id: 'ws_moderne_002',
      name: 'ModernTech Autowerkstatt',
      businessName: 'ModernTech Autowerkstatt',
      templateType: 'moderne',
      phone: '+49 30 87654321',
      email: 'info@moderntech-auto.de',
      address: {
        street: 'Technologiestraße 456',
        city: 'Berlin',
        postalCode: '10587'
      },
      specializations: ['modern', 'diagnostic'],
      theme: {
        primary: '#8b5cf6',
        secondary: '#6b7280',
        accent: '#06b6d4'
      }
    },
    isActive: true,
    authorizedDomains: ['localhost:3000', 'moderntech-auto.de'],
    createdAt: '2024-01-01T00:00:00Z'
  }],
  ['ck_test_premium_service_789', {
    id: 'ck_test_premium_service_789',
    workshop: {
      id: 'ws_premium_003',
      name: 'Premium Automotive Service',
      businessName: 'Premium Automotive Service',
      templateType: 'premium',
      phone: '+49 30 55555555',
      email: 'service@premium-automotive.de',
      address: {
        street: 'Luxusallee 789',
        city: 'Berlin',
        postalCode: '10719'
      },
      specializations: ['premium', 'luxury'],
      theme: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#f59e0b'
      }
    },
    isActive: true,
    authorizedDomains: ['localhost:3000', 'premium-automotive.de'],
    createdAt: '2024-01-01T00:00:00Z'
  }],
  ['ck_test_family_werkstatt_abc', {
    id: 'ck_test_family_werkstatt_abc',
    workshop: {
      id: 'ws_family_004',
      name: 'Familien-Autowerkstatt Schmidt',
      businessName: 'Familien-Autowerkstatt Schmidt',
      templateType: 'family',
      phone: '+49 30 77777777',
      email: 'info@familie-schmidt-auto.de',
      address: {
        street: 'Familienstraße 321',
        city: 'Berlin',
        postalCode: '12345'
      },
      specializations: ['family', 'general'],
      theme: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#f97316'
      }
    },
    isActive: true,
    authorizedDomains: ['localhost:3000', 'familie-schmidt-auto.de'],
    createdAt: '2024-01-01T00:00:00Z'
  }],
  ['ck_test_elektro_werkstatt_xyz', {
    id: 'ck_test_elektro_werkstatt_xyz',
    workshop: {
      id: 'ws_elektro_005',
      name: 'ElektroMobil Werkstatt',
      businessName: 'ElektroMobil Werkstatt',
      templateType: 'electric',
      phone: '+49 30 99999999',
      email: 'info@elektromobil-werkstatt.de',
      address: {
        street: 'Zukunftsweg 654',
        city: 'Berlin',
        postalCode: '10179'
      },
      specializations: ['electric', 'hybrid', 'modern'],
      theme: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#0ea5e9'
      }
    },
    isActive: true,
    authorizedDomains: ['localhost:3000', 'elektromobil-werkstatt.de'],
    createdAt: '2024-01-01T00:00:00Z'
  }]
])

/**
 * Validate client key and return workshop information
 * @param {string} clientKey - The client key to validate
 * @returns {Object} Validation result with workshop data
 */
export async function validateClientKey(clientKey) {
  try {
    // Check if we're in development mode with mock keys
    if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_KEYS === 'true') {
      const mockData = mockClientKeys.get(clientKey)
      if (mockData && mockData.isActive) {
        return {
          valid: true,
          workshop: mockData.workshop,
          clientKey: mockData.id,
          authorizedDomains: mockData.authorizedDomains
        }
      }
    }

    // In production, this would connect to Supabase or your database
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Import Supabase dynamically to avoid errors when not configured
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        // Get client key from database
        const { data: clientKeyData, error } = await supabase
          .from('client_keys')
          .select(`
            id,
            client_key_hash,
            is_active,
            authorized_domains,
            workshops!inner (
              id,
              name,
              business_name,
              template_type,
              phone,
              email,
              address_line1,
              city,
              postal_code,
              specializations,
              theme_config
            )
          `)
          .eq('client_key_hash', clientKey) // In production, you'd hash the key
          .eq('is_active', true)
          .single()

        if (error || !clientKeyData) {
          console.warn(`Invalid client key attempted: ${clientKey?.substring(0, 12)}...`)
          return { valid: false, error: 'Invalid client key' }
        }

        const workshop = clientKeyData.workshops
        return {
          valid: true,
          workshop: {
            id: workshop.id,
            name: workshop.name,
            businessName: workshop.business_name,
            templateType: workshop.template_type,
            phone: workshop.phone,
            email: workshop.email,
            address: {
              street: workshop.address_line1,
              city: workshop.city,
              postalCode: workshop.postal_code
            },
            specializations: workshop.specializations || ['general'],
            theme: workshop.theme_config || {}
          },
          clientKey: clientKeyData.id,
          authorizedDomains: clientKeyData.authorized_domains || []
        }

      } catch (dbError) {
        console.error('Database validation failed, falling back to mock:', dbError)
        // Fall back to mock data if database is not available
      }
    }

    // Default fallback for invalid keys
    return { valid: false, error: 'Client key not found' }

  } catch (error) {
    console.error('Client key validation error:', error)
    return { valid: false, error: 'Validation failed' }
  }
}

/**
 * Generate a new client key for development/testing
 * @param {string} templateType - Template type (klassische, moderne, etc.)
 * @param {Object} workshopConfig - Workshop configuration
 * @returns {string} Generated client key
 */
export function generateDevelopmentClientKey(templateType, workshopConfig = {}) {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `ck_dev_${templateType}_${timestamp}_${random}`
}

/**
 * Create workshop configuration for client key
 * @param {string} templateType - Template type
 * @param {Object} customConfig - Custom configuration overrides
 * @returns {Object} Workshop configuration
 */
export function createWorkshopConfig(templateType, customConfig = {}) {
  const baseConfig = {
    id: `ws_${templateType}_${Date.now()}`,
    templateType,
    specializations: [templateType === 'electric' ? 'electric' : 'general'],
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745'
    }
  }

  // Template-specific defaults
  const templateDefaults = {
    klassische: {
      name: 'Klassische Autowerkstatt',
      businessName: 'Klassische Autowerkstatt Müller',
      tagline: 'Traditionelle Handwerkskunst seit 1995',
      phone: '+49 30 12345678',
      email: 'info@klassische-werkstatt.de',
      specializations: ['general', 'classic'],
      theme: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#f59e0b'
      }
    },
    moderne: {
      name: 'ModernTech Autowerkstatt',
      businessName: 'ModernTech Autowerkstatt',
      tagline: 'Innovation trifft Präzision',
      phone: '+49 30 87654321',
      email: 'info@moderntech-auto.de',
      specializations: ['modern', 'diagnostic'],
      theme: {
        primary: '#8b5cf6',
        secondary: '#6b7280',
        accent: '#06b6d4'
      }
    },
    premium: {
      name: 'Premium Automotive Service',
      businessName: 'Premium Automotive Service',
      tagline: 'Exzellenz in der Fahrzeugtechnik',
      phone: '+49 30 55555555',
      email: 'service@premium-automotive.de',
      specializations: ['premium', 'luxury'],
      theme: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#f59e0b'
      }
    },
    family: {
      name: 'Familien-Autowerkstatt Schmidt',
      businessName: 'Familien-Autowerkstatt Schmidt',
      tagline: 'Die Werkstatt für die ganze Familie',
      phone: '+49 30 77777777',
      email: 'info@familie-schmidt-auto.de',
      specializations: ['family', 'general'],
      theme: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#f97316'
      }
    },
    electric: {
      name: 'ElektroMobil Werkstatt',
      businessName: 'ElektroMobil Werkstatt',
      tagline: 'Spezialist für Elektro- und Hybridfahrzeuge',
      phone: '+49 30 99999999',
      email: 'info@elektromobil-werkstatt.de',
      specializations: ['electric', 'hybrid', 'modern'],
      theme: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#0ea5e9'
      }
    }
  }

  return {
    ...baseConfig,
    ...templateDefaults[templateType],
    ...customConfig
  }
}

/**
 * Get available development client keys for testing
 * @returns {Array} Array of available client keys with workshop info
 */
export function getAvailableClientKeys() {
  return Array.from(mockClientKeys.entries()).map(([key, data]) => ({
    clientKey: key,
    workshopName: data.workshop.businessName,
    templateType: data.workshop.templateType,
    isActive: data.isActive
  }))
}

/**
 * Validate domain against authorized domains for a client key
 * @param {string} clientKey - Client key
 * @param {string} domain - Domain to validate
 * @returns {boolean} Whether domain is authorized
 */
export function validateDomain(clientKey, domain) {
  const clientData = mockClientKeys.get(clientKey)
  if (!clientData || !clientData.authorizedDomains) {
    return false
  }

  // Allow localhost for development
  if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
    return true
  }

  return clientData.authorizedDomains.some(authorizedDomain =>
    domain === authorizedDomain || domain.endsWith('.' + authorizedDomain)
  )
}