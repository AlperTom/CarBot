/**
 * Database Connection Test API
 * Tests if Supabase connection is working
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  try {
    console.log('Testing database connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Has service key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    // Test basic connection
    const { data, error } = await supabase
      .from('workshops')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }, { status: 500 })
    }

    // Test if workshops table exists and has the right columns
    const { data: tableInfo, error: tableError } = await supabase
      .from('workshops')
      .select('*')
      .limit(0)

    if (tableError) {
      return NextResponse.json({
        success: false,
        error: 'Workshops table issue: ' + tableError.message,
        tableError: tableError
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connected: true,
        workshopsTableExists: true,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Test DB error:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection test failed: ' + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}