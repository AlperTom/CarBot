import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    console.log('🔧 Creating workshops table schema directly...')

    // Try to create the workshops table if it doesn't exist
    // We'll do this by inserting a test record and seeing what happens
    try {
      // First, try to insert a test workshop to see if the table/columns exist
      const { data, error } = await supabase
        .from('workshops')
        .insert({
          name: 'Schema Test Workshop',
          owner_email: 'schema-test@carbot.de',
          owner_name: 'Schema Test',
          email: 'test@test.com',
          phone: '+49 123 456789',
          address: 'Test Street 123',
          city: 'Test City',
          postal_code: '12345',
          website: 'https://test.com',
          business_hours: {},
          services: ['Test Service'],
          specializations: ['Test Brand'],
          response_style: 'professional',
          language: 'de',
          lead_notifications: true,
          appointment_reminders: true,
          auto_response: true,
          widget_enabled: true,
          widget_color: '#3B82F6',
          whatsapp_enabled: false,
          whatsapp_number: '',
          gmt_integration: false,
          facebook_integration: false
        })
        .select()
        .single()

      if (error) {
        console.error('Table/schema issue detected:', error.message)
        
        // If we get a column error, return instructions
        if (error.message.includes('does not exist') || error.message.includes('column')) {
          return NextResponse.json({
            success: false,
            error: 'Database schema not initialized',
            instructions: 'Please create the workshops table in your Supabase dashboard',
            schema: {
              table_name: 'workshops',
              columns: [
                'id SERIAL PRIMARY KEY',
                'name VARCHAR(255) NOT NULL',
                'owner_name VARCHAR(255)',
                'owner_email VARCHAR(255) UNIQUE NOT NULL',
                'email VARCHAR(255)',
                'phone VARCHAR(50)',
                'address TEXT',
                'city VARCHAR(100)',
                'postal_code VARCHAR(20)',
                'website VARCHAR(255)',
                'business_hours JSONB DEFAULT \'{}\'',
                'services TEXT[] DEFAULT \'{}\'',
                'specializations TEXT[] DEFAULT \'{}\'',
                'response_style VARCHAR(50) DEFAULT \'professional\'',
                'language VARCHAR(10) DEFAULT \'de\'',
                'lead_notifications BOOLEAN DEFAULT true',
                'appointment_reminders BOOLEAN DEFAULT true',
                'auto_response BOOLEAN DEFAULT true',
                'widget_enabled BOOLEAN DEFAULT true',
                'widget_color VARCHAR(20) DEFAULT \'#3B82F6\'',
                'whatsapp_enabled BOOLEAN DEFAULT false',
                'whatsapp_number VARCHAR(50)',
                'gmt_integration BOOLEAN DEFAULT false',
                'facebook_integration BOOLEAN DEFAULT false',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
                'updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'
              ]
            },
            sql: `
CREATE TABLE workshops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255),
  owner_email VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  website VARCHAR(255),
  business_hours JSONB DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  response_style VARCHAR(50) DEFAULT 'professional',
  language VARCHAR(10) DEFAULT 'de',
  lead_notifications BOOLEAN DEFAULT true,
  appointment_reminders BOOLEAN DEFAULT true,
  auto_response BOOLEAN DEFAULT true,
  widget_enabled BOOLEAN DEFAULT true,
  widget_color VARCHAR(20) DEFAULT '#3B82F6',
  whatsapp_enabled BOOLEAN DEFAULT false,
  whatsapp_number VARCHAR(50),
  gmt_integration BOOLEAN DEFAULT false,
  facebook_integration BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workshops_owner_email ON workshops(owner_email);
            `
          }, { status: 400 })
        }
        
        throw error
      }

      // Success! Clean up the test record
      if (data && data.id) {
        await supabase
          .from('workshops')
          .delete()
          .eq('id', data.id)
      }

      console.log('✅ Workshop table schema verified and working')
      return NextResponse.json({
        success: true,
        message: 'Workshop table schema is working correctly',
        status: 'schema_verified'
      })

    } catch (insertError) {
      console.error('Schema verification failed:', insertError.message)
      
      return NextResponse.json({
        success: false,
        error: 'Cannot verify schema: ' + insertError.message,
        details: insertError,
        instruction: 'Please create the workshops table manually in Supabase dashboard'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Schema creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Schema creation failed: ' + error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to test/create workshop table schema',
    endpoint: 'POST /api/create-schema'
  })
}