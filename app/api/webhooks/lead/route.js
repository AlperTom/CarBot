import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const leadData = await request.json()
    
    // Validate required fields
    if (!leadData.name || !leadData.telefon || !leadData.anliegen) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Log lead capture for audit
    console.log('New lead captured:', {
      kunde_id: leadData.kunde_id,
      name: leadData.name,
      anliegen: leadData.anliegen,
      timestamp: leadData.timestamp
    })

    // In a production environment, this would trigger:
    // 1. Email notification to the workshop
    // 2. n8n workflow for automated follow-up
    // 3. CRM integration
    // 4. SMS notification (optional)

    // Simulate n8n webhook call
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.N8N_API_KEY}`
          },
          body: JSON.stringify({
            event: 'lead_captured',
            data: leadData,
            source: 'carbot-widget'
          })
        })
      } catch (n8nError) {
        console.error('n8n webhook failed:', n8nError)
        // Don't fail the lead capture if n8n is down
      }
    }

    // Simulate email notification
    if (process.env.SMTP_ENABLED === 'true') {
      try {
        // This would use a service like SendGrid, Mailgun, or AWS SES
        const emailData = {
          to: process.env.WORKSHOP_EMAIL || 'workshop@example.com',
          subject: `Neue Kundenanfrage: ${leadData.anliegen}`,
          html: `
            <h2>Neue Kundenanfrage über CarBot</h2>
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Telefon:</strong> ${leadData.telefon}</p>
            <p><strong>Anliegen:</strong> ${leadData.anliegen}</p>
            <p><strong>Fahrzeug:</strong> ${leadData.fahrzeug || 'Nicht angegeben'}</p>
            <p><strong>Zeit:</strong> ${new Date(leadData.timestamp).toLocaleString('de-DE')}</p>
            <p><strong>Quelle:</strong> ${leadData.source_url || 'CarBot Widget'}</p>
            
            <h3>Chat-Verlauf:</h3>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
              ${JSON.parse(leadData.chatverlauf || '[]').map(msg => 
                `<p><strong>${msg.role === 'user' ? 'Kunde' : 'CarBot'}:</strong> ${msg.content}</p>`
              ).join('')}
            </div>
            
            <p style="margin-top: 20px;">
              <a href="tel:${leadData.telefon}" style="background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Jetzt zurückrufen
              </a>
            </p>
          `
        }

        // Here you would actually send the email
        console.log('Email notification would be sent:', emailData)
        
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
      }
    }

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Lead captured and notifications sent',
      leadId: leadData.timestamp // Use timestamp as a simple ID
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      error: 'Failed to process lead webhook',
      details: error.message 
    }, { status: 500 })
  }
}