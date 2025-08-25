import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    console.log('🔧 Initializing database schema...')

    // Create workshops table with correct schema
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS workshops (
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
          client_key VARCHAR(255) UNIQUE,
          
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

        CREATE INDEX IF NOT EXISTS idx_workshops_owner_email ON workshops(owner_email);
        CREATE INDEX IF NOT EXISTS idx_workshops_client_key ON workshops(client_key);
      `
    })

    if (error) {
      console.error('Schema creation error:', error)
      return NextResponse.json({ error: 'Failed to create schema: ' + error.message }, { status: 500 })
    }

    // Insert test data
    const { data: insertData, error: insertError } = await supabase
      .from('workshops')
      .upsert({
        name: 'Muster Autowerkstatt',
        owner_name: 'Max Mustermann',
        owner_email: 'test@carbot.de',
        email: 'max@muster-werkstatt.de',
        phone: '+49 30 12345678',
        address: 'Musterstraße 123',
        city: 'Berlin',
        postal_code: '10115',
        website: 'https://muster-werkstatt.de',
        client_key: 'ck_test_klassische_werkstatt_123',
        business_hours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '09:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '14:00', closed: true }
        },
        services: ['Inspektion', 'Ölwechsel', 'Reifenwechsel', 'Bremsenservice', 'Klimaanlagenservice'],
        specializations: ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi']
      }, {
        onConflict: 'owner_email'
      })

    console.log('✅ Database initialized successfully')

    return NextResponse.json({
      success: true,
      message: 'Database schema created and initialized',
      schema: 'created',
      testData: 'inserted'
    })

  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database initialization failed: ' + error.message
    }, { status: 500 })
  }
}