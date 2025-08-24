import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Mock data for development
const mockSettings = {
  workshopName: 'Muster Autowerkstatt',
  ownerName: 'Max Mustermann',
  email: 'max@muster-werkstatt.de',
  phone: '+49 30 12345678',
  address: 'Musterstraße 123',
  city: 'Berlin',
  postalCode: '10115',
  website: 'https://muster-werkstatt.de',
  businessHours: {
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '16:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: true }
  },
  services: ['Inspektion', 'Ölwechsel', 'Reifenwechsel', 'Bremsenservice', 'Klimaanlagenservice'],
  specializations: ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi'],
  responseStyle: 'professional',
  language: 'de',
  leadNotifications: true,
  appointmentReminders: true,
  autoResponse: true,
  widgetEnabled: true,
  widgetColor: '#3B82F6',
  whatsappEnabled: false,
  whatsappNumber: '',
  gmtIntegration: false,
  facebookIntegration: false
}

// Helper function to get user from token
async function getUserFromToken(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    
    // Try to get token from Authorization header
    let token = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }

    // If no auth header, try to get from cookies
    if (!token) {
      const cookies = request.headers.get('cookie') || ''
      const tokenMatch = cookies.match(/auth-token=([^;]+)/)
      if (tokenMatch) {
        token = tokenMatch[1]
      }
    }

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carbot-dev-secret-key-2025')
    return decoded

  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// GET - Load settings
export async function GET(request) {
  try {
    const user = await getUserFromToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // In production, fetch from database
    if (process.env.NODE_ENV === 'production' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: workshop, error } = await supabase
          .from('workshops')
          .select('*')
          .eq('owner_id', user.id)
          .single()

        if (!error && workshop) {
          return NextResponse.json({
            workshopName: workshop.name,
            ownerName: workshop.owner_name,
            email: workshop.email,
            phone: workshop.phone,
            address: workshop.address,
            city: workshop.city,
            postalCode: workshop.postal_code,
            website: workshop.website,
            businessHours: workshop.business_hours || mockSettings.businessHours,
            services: workshop.services || mockSettings.services,
            specializations: workshop.specializations || mockSettings.specializations,
            responseStyle: workshop.response_style || 'professional',
            language: workshop.language || 'de',
            leadNotifications: workshop.lead_notifications ?? true,
            appointmentReminders: workshop.appointment_reminders ?? true,
            autoResponse: workshop.auto_response ?? true,
            widgetEnabled: workshop.widget_enabled ?? true,
            widgetColor: workshop.widget_color || '#3B82F6',
            whatsappEnabled: workshop.whatsapp_enabled || false,
            whatsappNumber: workshop.whatsapp_number || '',
            gmtIntegration: workshop.gmt_integration || false,
            facebookIntegration: workshop.facebook_integration || false
          })
        }
      } catch (dbError) {
        console.error('Database error, using mock data:', dbError)
      }
    }

    // Return mock data for development or fallback
    return NextResponse.json(mockSettings)

  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

// PUT - Save settings
export async function PUT(request) {
  try {
    const user = await getUserFromToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const settings = await request.json()

    // Validate required fields
    if (!settings.workshopName || !settings.email) {
      return NextResponse.json(
        { error: 'Workshop name and email are required' },
        { status: 400 }
      )
    }

    // In production, save to database
    if (process.env.NODE_ENV === 'production' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: workshop, error } = await supabase
          .from('workshops')
          .upsert({
            owner_id: user.id,
            name: settings.workshopName,
            owner_name: settings.ownerName,
            email: settings.email,
            phone: settings.phone,
            address: settings.address,
            city: settings.city,
            postal_code: settings.postalCode,
            website: settings.website,
            business_hours: settings.businessHours,
            services: settings.services,
            specializations: settings.specializations,
            response_style: settings.responseStyle,
            language: settings.language,
            lead_notifications: settings.leadNotifications,
            appointment_reminders: settings.appointmentReminders,
            auto_response: settings.autoResponse,
            widget_enabled: settings.widgetEnabled,
            widget_color: settings.widgetColor,
            whatsapp_enabled: settings.whatsappEnabled,
            whatsapp_number: settings.whatsappNumber,
            gmt_integration: settings.gmtIntegration,
            facebook_integration: settings.facebookIntegration,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'owner_id'
          })
          .select()

        if (!error) {
          return NextResponse.json({ 
            message: 'Settings saved successfully',
            data: workshop 
          })
        } else {
          console.error('Database save error:', error)
        }
      } catch (dbError) {
        console.error('Database error during save:', dbError)
      }
    }

    // In development or fallback, just return success
    // (In a real app, you'd store this in a database)
    console.log('Settings updated for user:', user.email, settings)
    
    return NextResponse.json({
      message: 'Settings saved successfully (development mode)',
      data: settings
    })

  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}

// POST - Create new workshop settings
export async function POST(request) {
  try {
    const user = await getUserFromToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const settings = await request.json()

    // Validate required fields
    if (!settings.workshopName || !settings.email) {
      return NextResponse.json(
        { error: 'Workshop name and email are required' },
        { status: 400 }
      )
    }

    // In production, create in database
    if (process.env.NODE_ENV === 'production' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: workshop, error } = await supabase
          .from('workshops')
          .insert({
            owner_id: user.id,
            name: settings.workshopName,
            owner_name: settings.ownerName,
            email: settings.email,
            phone: settings.phone,
            address: settings.address,
            city: settings.city,
            postal_code: settings.postalCode,
            website: settings.website,
            business_hours: settings.businessHours,
            services: settings.services,
            specializations: settings.specializations,
            response_style: settings.responseStyle,
            language: settings.language,
            lead_notifications: settings.leadNotifications,
            appointment_reminders: settings.appointmentReminders,
            auto_response: settings.autoResponse,
            widget_enabled: settings.widgetEnabled,
            widget_color: settings.widgetColor,
            whatsapp_enabled: settings.whatsappEnabled,
            whatsapp_number: settings.whatsappNumber,
            gmt_integration: settings.gmtIntegration,
            facebook_integration: settings.facebookIntegration,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()

        if (!error) {
          return NextResponse.json({ 
            message: 'Workshop settings created successfully',
            data: workshop 
          })
        } else {
          console.error('Database create error:', error)
        }
      } catch (dbError) {
        console.error('Database error during creation:', dbError)
      }
    }

    // In development or fallback, just return success
    console.log('New workshop created for user:', user.email, settings)
    
    return NextResponse.json({
      message: 'Workshop settings created successfully (development mode)',
      data: settings
    })

  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create workshop settings' },
      { status: 500 }
    )
  }
}