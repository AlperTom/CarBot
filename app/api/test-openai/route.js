import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request) {
  try {
    // Test if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: false,
        error: 'OpenAI API key is not configured',
        details: 'OPENAI_API_KEY environment variable is missing'
      }, { status: 500 })
    }

    // Test a simple OpenAI API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Say "OpenAI API is working" in German' }
      ],
      max_tokens: 20,
      temperature: 0.1,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ 
        success: false,
        error: 'OpenAI API returned empty response',
        details: 'API call succeeded but no response content'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'OpenAI API is working correctly',
      response: response,
      usage: completion.usage,
      model: completion.model,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('OpenAI API test error:', error)
    
    let errorMessage = 'Unknown OpenAI API error'
    let errorDetails = error.message

    if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key'
      errorDetails = 'The provided API key is not valid or has been revoked'
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI quota exceeded'
      errorDetails = 'Your OpenAI account has insufficient credits or quota'
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'OpenAI rate limit exceeded'
      errorDetails = 'Too many requests to OpenAI API'
    } else if (error.status === 401) {
      errorMessage = 'OpenAI authentication failed'
      errorDetails = 'API key is invalid or missing'
    }

    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      details: errorDetails,
      code: error.code || 'unknown',
      status: error.status || 500,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}