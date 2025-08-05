import { NextResponse } from 'next/server'
import { 
  testEmailConfiguration, 
  sendEmail,
  sendWelcomeEmail, 
  sendPasswordResetEmail,
  sendLeadNotification 
} from '../../../../lib/email'

export async function POST(request) {
  try {
    const { type, ...data } = await request.json()

    switch (type) {
      case 'config-test':
        const configResult = await testEmailConfiguration()
        return NextResponse.json(configResult)

      case 'welcome':
        const welcomeResult = await sendWelcomeEmail({
          email: data.email || 'test@example.com',
          workshopName: data.workshopName || 'Test Werkstatt',
          ownerName: data.ownerName || 'Max Mustermann'
        })
        return NextResponse.json(welcomeResult)

      case 'password-reset':
        const resetResult = await sendPasswordResetEmail({
          email: data.email || 'test@example.com',
          resetUrl: data.resetUrl || `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=test123`,
          workshopName: data.workshopName || 'Test Werkstatt'
        })
        return NextResponse.json(resetResult)

      case 'lead-notification':
        const leadResult = await sendLeadNotification(
          {
            id: 'test-lead-123',
            name: data.customerName || 'Max Mustermann',
            telefon: data.telefon || '+49 30 12345678',
            email: data.customerEmail || 'kunde@example.com',
            anliegen: data.anliegen || 'Bremsen quietschen beim BMW 320d',
            fahrzeug: data.fahrzeug || 'BMW 320d, Baujahr 2019',
            chatverlauf: JSON.stringify([
              { role: 'user', content: 'Hallo, ich habe ein Problem mit meinem Auto.' },
              { role: 'assistant', content: 'Gerne helfe ich Ihnen! Was für ein Problem haben Sie denn?' },
              { role: 'user', content: 'Die Bremsen quietschen beim BMW 320d. Ist das gefährlich?' },
              { role: 'assistant', content: 'Das sollten Sie zeitnah überprüfen lassen. Ich kann Ihnen einen Termin anbieten.' }
            ]),
            timestamp: new Date().toISOString(),
            source_url: 'https://test-werkstatt.de'
          },
          data.workshopEmail || process.env.WORKSHOP_EMAIL || 'workshop@example.com'
        )
        return NextResponse.json(leadResult)

      case 'custom':
        const customResult = await sendEmail({
          to: data.to || 'test@example.com',
          subject: data.subject || 'CarBot Test Email',
          html: data.html || `
            <h2>CarBot Email Test</h2>
            <p>Dies ist eine Test-E-Mail von CarBot.</p>
            <p><strong>Zeitpunkt:</strong> ${new Date().toLocaleString('de-DE')}</p>
          `
        })
        return NextResponse.json(customResult)

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid test type',
          availableTypes: ['config-test', 'welcome', 'password-reset', 'lead-notification', 'custom']
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Email test failed'
    }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('type') || 'config-test'

    // Quick configuration test
    if (testType === 'config-test') {
      const result = await testEmailConfiguration()
      return NextResponse.json(result)
    }

    // Return available test options
    return NextResponse.json({
      success: true,
      message: 'CarBot Email Test API',
      availableTests: {
        'config-test': 'Test email configuration',
        'welcome': 'Test welcome email',
        'password-reset': 'Test password reset email',
        'lead-notification': 'Test lead notification email',
        'custom': 'Send custom test email'
      },
      usage: {
        GET: '/api/test/email?type=config-test',
        POST: '/api/test/email with { "type": "welcome", "email": "test@example.com" }'
      },
      configuration: {
        hasApiKey: !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here',
        emailFrom: process.env.EMAIL_FROM || 'noreply@carbot.de',
        emailFromName: process.env.EMAIL_FROM_NAME || 'CarBot',
        workshopEmail: process.env.WORKSHOP_EMAIL || 'demo@carbot.de',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      }
    })

  } catch (error) {
    console.error('Email test GET error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}