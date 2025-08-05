import { NextResponse } from 'next/server'

export async function POST(request) {
  console.log('=== TEST API CALLED ===')
  
  try {
    const body = await request.json()
    console.log('Body received:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      receivedData: body
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { error: 'Test API failed', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Test endpoint GET working' })
}