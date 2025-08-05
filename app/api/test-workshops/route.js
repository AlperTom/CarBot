import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  console.log('=== TESTING WORKSHOPS TABLE ===')
  
  try {
    // Test if workshops table exists
    console.log('Testing workshops table existence...')
    const { data, error } = await supabaseAdmin
      .from('workshops')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Workshops table error:', error)
      return NextResponse.json({
        error: 'Workshops table issue',
        details: error.message,
        code: error.code
      })
    }

    console.log('Workshops table exists and is accessible')
    return NextResponse.json({
      success: true,
      message: 'Workshops table exists',
      rowCount: data ? data.length : 0
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error.message
    })
  }
}