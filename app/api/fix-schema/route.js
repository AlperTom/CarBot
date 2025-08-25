import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    console.log('🔧 Adding missing columns to workshops table...')

    // List of missing columns to add
    const missingColumns = [
      'appointment_reminders BOOLEAN DEFAULT true',
      'auto_response BOOLEAN DEFAULT true', 
      'lead_notifications BOOLEAN DEFAULT true',
      'widget_enabled BOOLEAN DEFAULT true',
      'widget_color VARCHAR(20) DEFAULT \'#3B82F6\'',
      'whatsapp_enabled BOOLEAN DEFAULT false',
      'whatsapp_number VARCHAR(50)',
      'gmt_integration BOOLEAN DEFAULT false',
      'facebook_integration BOOLEAN DEFAULT false',
      'response_style VARCHAR(50) DEFAULT \'professional\'',
      'language VARCHAR(10) DEFAULT \'de\'',
      'business_hours JSONB DEFAULT \'{}\'',
      'services TEXT[] DEFAULT \'{}\'',
      'specializations TEXT[] DEFAULT \'{}\'',
      'owner_name VARCHAR(255)',
      'address TEXT',
      'city VARCHAR(100)',
      'postal_code VARCHAR(20)',
      'website VARCHAR(255)',
      'created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
      'updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'
    ]

    const results = []
    
    // Try to add each column individually
    for (const column of missingColumns) {
      try {
        const columnName = column.split(' ')[0]
        
        // Test if column exists by trying to select it
        const { data: testData, error: testError } = await supabase
          .from('workshops')
          .select(columnName)
          .limit(0)
        
        if (testError && testError.message.includes('not found')) {
          console.log(`🔄 Adding column: ${columnName}`)
          
          // Column doesn't exist, we need to add it
          // Since we can't use ALTER TABLE directly, we'll create a temporary workaround
          results.push({
            column: columnName,
            status: 'needs_manual_addition',
            sql: `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS ${column};`
          })
        } else if (!testError) {
          console.log(`✅ Column ${columnName} already exists`)
          results.push({
            column: columnName,
            status: 'exists'
          })
        } else {
          console.warn(`⚠️ Error checking column ${columnName}:`, testError.message)
          results.push({
            column: columnName,
            status: 'error',
            error: testError.message
          })
        }
      } catch (columnError) {
        console.error(`❌ Error with column ${column}:`, columnError.message)
        results.push({
          column: column.split(' ')[0],
          status: 'error',
          error: columnError.message
        })
      }
    }

    const missingColumnsList = results.filter(r => r.status === 'needs_manual_addition')
    
    if (missingColumnsList.length > 0) {
      const sqlCommands = missingColumnsList.map(r => r.sql).join('\n')
      
      return NextResponse.json({
        success: false,
        message: 'Database schema needs manual update',
        missing_columns: missingColumnsList.length,
        sql_to_run: sqlCommands,
        instructions: [
          '1. Go to your Supabase Dashboard',
          '2. Open the SQL Editor',
          '3. Run the provided SQL commands',
          '4. Test registration again'
        ],
        results: results
      }, { status: 200 })
    }

    return NextResponse.json({
      success: true,
      message: 'All required columns exist in workshops table',
      results: results
    })

  } catch (error) {
    console.error('Schema fix error:', error)
    return NextResponse.json({
      success: false,
      error: 'Schema fix failed: ' + error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to check and fix workshop table schema',
    endpoint: 'POST /api/fix-schema'
  })
}