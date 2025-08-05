import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('=== SUPABASE TEST API CALLED ===')
  
  try {
    console.log('Environment variables:')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING')
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    console.log('Creating Supabase client...')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    console.log('Testing Supabase connection...')
    // Try a simple query to test connection
    const { data, error } = await supabaseAdmin
      .from('workshops')
      .select('count(*)', { count: 'exact' })
      .limit(0)

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Supabase connection failed', details: error.message },
        { status: 500 }
      )
    }

    console.log('Supabase connection successful')
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working',
      workshopCount: data
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Supabase test failed', details: error.message },
      { status: 500 }
    )
  }
}