import { NextResponse } from 'next/server'

export async function POST(request) {
  console.log('=== SIGNUP TEST API CALLED ===')
  
  try {
    // Check environment variables
    console.log('Environment variables:')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING')
    
    const { email, password, workshopData } = await request.json()
    console.log('Request data:', { email, workshopData })

    // Validate required fields
    if (!email || !password || !workshopData) {
      return NextResponse.json(
        { error: 'E-Mail, Passwort und Werkstatt-Daten sind erforderlich.' },
        { status: 400 }
      )
    }

    // Return success without actually creating anything
    return NextResponse.json({
      success: true,
      message: 'Test signup endpoint working',
      data: {
        email,
        workshopData,
        requiresConfirmation: true
      }
    })

  } catch (error) {
    console.error('Signup test error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Signup test failed', details: error.message },
      { status: 500 }
    )
  }
}