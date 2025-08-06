/**
 * Vitest Setup for CarBot Testing Suite
 * Automotive-focused testing configuration with German compliance
 */

import { vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock fetch for API calls
  global.fetch = vi.fn()

  // Mock crypto for UUID generation
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: vi.fn(() => 'test-uuid-123'),
      getRandomValues: vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256)
        }
        return arr
      })
    }
  })

  // Mock window location for German locale testing
  Object.defineProperty(window, 'location', {
    value: {
      origin: 'https://carbot.test',
      href: 'https://carbot.test',
      pathname: '/',
      search: '',
      hash: ''
    },
    writable: true
  })

  // Mock German Intl for currency formatting
  Object.defineProperty(global, 'Intl', {
    value: {
      NumberFormat: vi.fn((locale, options) => ({
        format: vi.fn((number) => {
          if (options?.style === 'currency' && options?.currency === 'EUR') {
            return `${number},00 €`
          }
          return number.toString()
        })
      })),
      DateTimeFormat: vi.fn((locale, options) => ({
        format: vi.fn((date) => '01.01.2024') // German date format
      }))
    }
  })

  // Mock ResizeObserver for component tests
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver for lazy loading tests
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.clearAllTimers()
})

afterAll(() => {
  vi.restoreAllMocks()
})

// Custom automotive testing utilities
export const mockCarDiagnosticData = {
  dtcCodes: [
    { code: 'P0300', description: 'Random/Multiple Cylinder Misfire Detected' },
    { code: 'P0171', description: 'System Too Lean (Bank 1)' },
    { code: 'P0420', description: 'Catalyst System Efficiency Below Threshold' }
  ],
  engineData: {
    rpm: 800,
    coolantTemp: 90,
    fuelPressure: 3.5,
    oxygenSensor: 0.45
  },
  vehicleInfo: {
    vin: 'WVWZZZ1KZ9W123456',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2020,
    engine: '1.6 TDI'
  }
}

export const mockGermanWorkshopData = {
  name: 'Mustermann Auto Service GmbH',
  address: {
    street: 'Hauptstraße 123',
    city: 'München',
    postalCode: '80333',
    country: 'Deutschland'
  },
  businessInfo: {
    ustId: 'DE123456789',
    handelsregisterId: 'HRB 12345',
    phone: '+49 89 12345678',
    email: 'info@mustermann-auto.de'
  },
  services: [
    'Hauptuntersuchung (HU)',
    'Abgasuntersuchung (AU)',
    'Inspektion',
    'Reparaturen',
    'Reifenservice'
  ]
}

export const mockStripeTestCards = {
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  declined: '4000000000000002',
  requiresAuth: '4000000000003220',
  expired: '4000000000000069'
}

// Helper functions for testing
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

export const mockSupabaseAuth = {
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
  signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: null, session: null } })),
  signUp: vi.fn(() => Promise.resolve({ data: { user: null, session: null } })),
  signOut: vi.fn(() => Promise.resolve({ error: null })),
  resetPasswordForEmail: vi.fn(() => Promise.resolve({ error: null })),
  updateUser: vi.fn(() => Promise.resolve({ error: null }))
}

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => ({ data: null, error: null })),
        gte: vi.fn(() => ({
          lte: vi.fn(() => ({ data: [] }))
        }))
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({ data: null, error: null }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({ error: null }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({ error: null }))
    }))
  }))
}

// Mock Supabase module
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}))

// Mock OpenAI for chat testing
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn(() => Promise.resolve({
          choices: [{
            message: {
              content: 'Hallo! Wie kann ich Ihnen mit Ihrem Fahrzeug helfen?'
            }
          }]
        }))
      }
    }
  }))
}))

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    paymentIntents: {
      create: vi.fn(() => Promise.resolve({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret_456'
      }))
    },
    customers: {
      create: vi.fn(() => Promise.resolve({
        id: 'cus_test_123'
      }))
    },
    subscriptions: {
      create: vi.fn(() => Promise.resolve({
        id: 'sub_test_123'
      }))
    }
  }))
}))

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/'
  }))
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams())
}))

console.log('🧪 CarBot Test Setup Complete - Automotive Testing Environment Ready')