/**
 * CarBot Email Service
 * Professional email handling for German automotive workshops
 */

import { Resend } from 'resend'

// Initialize Resend with API key (only if available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Email configuration
const EMAIL_CONFIG = {
  from: `${process.env.EMAIL_FROM_NAME || 'CarBot'} <${process.env.EMAIL_FROM || 'noreply@carbot.chat'}>`,
  replyTo: process.env.WORKSHOP_EMAIL || 'support@carbot.chat'
}

/**
 * Send email using Resend service
 * @param {Object} emailData - Email data object
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - HTML content
 * @param {string} emailData.text - Plain text content (optional)
 * @returns {Promise<Object>} - Email sending result
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, html')
    }

    // Validate API key
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key-here') {
      console.warn('⚠️ RESEND_API_KEY not configured. Email will be logged instead of sent.')
      
      // Log email for development
      console.log('📧 Email would be sent:', {
        from: EMAIL_CONFIG.from,
        to,
        subject,
        html: html.substring(0, 200) + '...',
        replyTo: EMAIL_CONFIG.replyTo
      })
      
      return {
        success: true,
        id: 'dev-email-' + Date.now(),
        message: 'Email logged (development mode)'
      }
    }

    // Send email via Resend
    if (!resend) {
      throw new Error('Resend client not initialized - missing API key')
    }
    
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      text: text || extractTextFromHtml(html),
      replyTo: EMAIL_CONFIG.replyTo
    })

    console.log('✅ Email sent successfully:', result.data?.id)
    
    return {
      success: true,
      id: result.data?.id,
      message: 'Email sent successfully'
    }

  } catch (error) {
    console.error('❌ Email sending failed:', error)
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    }
  }
}

/**
 * Send welcome email for new workshop registration
 * @param {Object} userData - User and workshop data
 */
export async function sendWelcomeEmail(userData) {
  const { email, workshopName, ownerName } = userData
  
  const subject = `Willkommen bei CarBot, ${ownerName}! 🚗`
  
  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Willkommen bei CarBot</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0070f3 0%, #0051cc 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🚗 Willkommen bei CarBot!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Ihr AI-Assistent für mehr Kunden</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 30px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #0070f3; margin-top: 0;">Hallo ${ownerName}!</h2>
        
        <p>Herzlich willkommen bei CarBot! Wir freuen uns, dass Sie sich für unsere AI-gestützte Kundenbindungslösung entschieden haben.</p>
        
        <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0070f3; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #0070f3;">✅ Ihr Account ist fast bereit</h3>
          <p style="margin: 0;">Ihr CarBot-System für <strong>${workshopName}</strong> wurde erfolgreich eingerichtet.</p>
        </div>
        
        <h3 style="color: #0070f3;">🚀 Nächste Schritte:</h3>
        <ol style="line-height: 1.8;">
          <li><strong>E-Mail bestätigen:</strong> Klicken Sie auf den Bestätigungslink in der separaten E-Mail</li>
          <li><strong>Dashboard erkunden:</strong> Melden Sie sich an und entdecken Sie Ihre neuen Funktionen</li>
          <li><strong>Chat-Widget einrichten:</strong> Integrieren Sie CarBot in Ihre Website</li>
          <li><strong>Erste Leads generieren:</strong> Beginnen Sie, qualifizierte Kundenanfragen zu erhalten</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" 
             style="background: #0070f3; color: white; padding: 15px 30px; text-decoration: none; 
                    border-radius: 8px; font-weight: 600; display: inline-block;">
            🔐 Jetzt anmelden
          </a>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">💡 Wussten Sie schon?</h4>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            Werkstätten, die CarBot verwenden, steigern ihre Online-Anfragen um durchschnittlich 40% 
            und reduzieren die Antwortzeit auf Kundenanfragen um 80%.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <h3 style="color: #0070f3;">📞 Brauchen Sie Hilfe?</h3>
        <p>Unser Support-Team steht Ihnen gerne zur Verfügung:</p>
        <ul style="list-style: none; padding: 0;">
          <li>📧 E-Mail: <a href="mailto:support@carbot.chat" style="color: #0070f3;">support@carbot.chat</a></li>
          <li>📚 Hilfe-Center: <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #0070f3;">Dokumentation & FAQs</a></li>
        </ul>
        
        <p style="margin-top: 30px;">Viel Erfolg mit CarBot!</p>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          Ihr CarBot-Team<br>
          <a href="https://carbot.chat" style="color: #0070f3;">carbot.chat</a>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 0 0 10px 0;">
          Diese E-Mail wurde automatisch generiert von CarBot.<br>
          Bitte antworten Sie nicht direkt auf diese E-Mail.
        </p>
        <p style="margin: 0;">
          CarBot GmbH • Musterstraße 123 • 12345 Berlin • Deutschland
        </p>
      </div>
    </body>
    </html>
  `
  
  return await sendEmail({
    to: email,
    subject,
    html
  })
}

/**
 * Send email confirmation for account activation
 * @param {Object} data - Confirmation data
 */
export async function sendEmailConfirmation({ email, confirmationUrl, ownerName }) {
  const subject = 'E-Mail bestätigen - CarBot Account aktivieren'
  
  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-Mail bestätigen</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">✉️ E-Mail bestätigen</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Aktivieren Sie Ihr CarBot-Konto</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 30px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #10b981; margin-top: 0;">Hallo ${ownerName}!</h2>
        
        <p>Um Ihr CarBot-Konto zu aktivieren, bestätigen Sie bitte Ihre E-Mail-Adresse.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; 
                    border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
            ✅ E-Mail bestätigen
          </a>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>⏰ Wichtig:</strong> Dieser Link ist 24 Stunden gültig. 
            Nach der Bestätigung können Sie sich sofort anmelden.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
          <a href="${confirmationUrl}" style="color: #0070f3; word-break: break-all;">${confirmationUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280;">
          Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.<br>
          Ihr Konto wird ohne Bestätigung nicht aktiviert.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          Ihr CarBot-Team<br>
          <a href="https://carbot.chat" style="color: #0070f3;">carbot.chat</a>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">CarBot GmbH • Musterstraße 123 • 12345 Berlin • Deutschland</p>
      </div>
    </body>
    </html>
  `
  
  return await sendEmail({
    to: email,
    subject,
    html
  })
}

/**
 * Send password reset email
 * @param {Object} data - Reset data
 */
export async function sendPasswordResetEmail({ email, resetUrl, workshopName }) {
  const subject = 'Passwort zurücksetzen - CarBot'
  
  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Passwort zurücksetzen</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🔐 Passwort zurücksetzen</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">CarBot Account</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 30px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #f59e0b; margin-top: 0;">Passwort zurücksetzen</h2>
        
        <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für Ihr CarBot-Konto gestellt.</p>
        
        ${workshopName ? `<p><strong>Werkstatt:</strong> ${workshopName}</p>` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; 
                    border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
            🔑 Neues Passwort erstellen
          </a>
        </div>
        
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #dc2626;">
            <strong>🔒 Sicherheitshinweis:</strong> Dieser Link ist 1 Stunde gültig. 
            Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
          <a href="${resetUrl}" style="color: #0070f3; word-break: break-all;">${resetUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">🛡️ Sicherheitstipps:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #6b7280;">
            <li>Verwenden Sie ein starkes, einzigartiges Passwort</li>
            <li>Kombinieren Sie Buchstaben, Zahlen und Sonderzeichen</li>
            <li>Teilen Sie Ihr Passwort niemals mit anderen</li>
          </ul>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0; margin-top: 30px;">
          Ihr CarBot-Team<br>
          <a href="https://carbot.chat" style="color: #0070f3;">carbot.chat</a>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">CarBot GmbH • Musterstraße 123 • 12345 Berlin • Deutschland</p>
      </div>
    </body>
    </html>
  `
  
  return await sendEmail({
    to: email,
    subject,
    html
  })
}

/**
 * Send lead notification to workshop
 * @param {Object} leadData - Lead information
 * @param {string} workshopEmail - Workshop email address
 */
export async function sendLeadNotification(leadData, workshopEmail) {
  const subject = `🚗 Neue Kundenanfrage: ${leadData.anliegen || 'Anfrage'}`
  
  // Format chat history
  let chatHistoryHtml = ''
  if (leadData.chatverlauf) {
    try {
      const chatHistory = typeof leadData.chatverlauf === 'string' 
        ? JSON.parse(leadData.chatverlauf) 
        : leadData.chatverlauf
      
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        chatHistoryHtml = chatHistory.map(msg => {
          const role = msg.role === 'user' ? 'Kunde' : 'CarBot'
          const roleColor = msg.role === 'user' ? '#0070f3' : '#10b981'
          return `
            <div style="margin: 10px 0; padding: 10px; background: ${msg.role === 'user' ? '#f0f8ff' : '#f0fff4'}; border-radius: 6px;">
              <strong style="color: ${roleColor};">${role}:</strong> ${msg.content}
            </div>
          `
        }).join('')
      }
    } catch (error) {
      console.error('Error parsing chat history:', error)
    }
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Neue Kundenanfrage</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0070f3 0%, #0051cc 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🚗 Neue Kundenanfrage</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">über CarBot Chat-Widget</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 30px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0070f3; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0; color: #0070f3;">📋 Kundendaten</h2>
          <p style="margin: 0; font-size: 14px; color: #374151;">
            Eingegangen am: ${new Date(leadData.timestamp || Date.now()).toLocaleString('de-DE')}
          </p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; width: 30%;">Name:</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${leadData.name || 'Nicht angegeben'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Telefon:</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">
              <a href="tel:${leadData.telefon}" style="color: #0070f3; text-decoration: none; font-weight: 600;">
                ${leadData.telefon || 'Nicht angegeben'}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">E-Mail:</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">
              ${leadData.email ? `<a href="mailto:${leadData.email}" style="color: #0070f3;">${leadData.email}</a>` : 'Nicht angegeben'}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Anliegen:</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>${leadData.anliegen || 'Nicht angegeben'}</strong></td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">Fahrzeug:</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${leadData.fahrzeug || 'Nicht angegeben'}</td>
          </tr>
        </table>
        
        <!-- Action Buttons -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="tel:${leadData.telefon}" 
             style="background: #10b981; color: white; padding: 15px 25px; text-decoration: none; 
                    border-radius: 8px; font-weight: 600; display: inline-block; margin: 0 10px 10px 0;">
            📞 Zurückrufen
          </a>
          ${leadData.email ? `
          <a href="mailto:${leadData.email}" 
             style="background: #0070f3; color: white; padding: 15px 25px; text-decoration: none; 
                    border-radius: 8px; font-weight: 600; display: inline-block; margin: 0 10px 10px 0;">
            ✉️ E-Mail senden
          </a>
          ` : ''}
        </div>
        
        ${chatHistoryHtml ? `
        <div style="margin-top: 30px;">
          <h3 style="color: #0070f3; margin-bottom: 15px;">💬 Chat-Verlauf</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            ${chatHistoryHtml}
          </div>
        </div>
        ` : ''}
        
        <!-- Next Steps -->
        <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #0070f3;">🎯 Empfohlene nächste Schritte:</h3>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
            <li><strong>Schnell reagieren:</strong> Kontaktieren Sie den Kunden innerhalb von 2 Stunden</li>
            <li><strong>Termin vereinbaren:</strong> Bieten Sie konkrete Terminvorschläge an</li>
            <li><strong>Folgetermin planen:</strong> Bestätigen Sie den Werkstattbesuch</li>
            <li><strong>Nachfassen:</strong> Fragen Sie nach der Zufriedenheit</li>
          </ol>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 14px; color: #6b7280;">
          <p style="margin: 0;"><strong>Lead-ID:</strong> ${leadData.id || leadData.timestamp}</p>
          <p style="margin: 5px 0 0 0;"><strong>Quelle:</strong> ${leadData.source_url || 'CarBot Chat-Widget'}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0; margin-top: 30px; text-align: center;">
          Automatisch generiert von <strong>CarBot</strong><br>
          <a href="https://carbot.chat" style="color: #0070f3;">carbot.chat</a>
        </p>
      </div>
    </body>
    </html>
  `
  
  return await sendEmail({
    to: workshopEmail,
    subject,
    html
  })
}

/**
 * Extract plain text from HTML (basic implementation)
 * @param {string} html - HTML content
 * @returns {string} - Plain text content
 */
function extractTextFromHtml(html) {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Test email configuration
 * @returns {Promise<Object>} - Test result
 */
export async function testEmailConfiguration() {
  try {
    // Check environment variables
    const config = {
      hasApiKey: !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key-here',
      emailFrom: process.env.EMAIL_FROM || 'noreply@carbot.chat',
      emailFromName: process.env.EMAIL_FROM_NAME || 'CarBot',
      workshopEmail: process.env.WORKSHOP_EMAIL || 'demo@carbot.chat'
    }
    
    if (!config.hasApiKey) {
      return {
        success: false,
        message: 'RESEND_API_KEY not configured',
        config
      }
    }
    
    // Send test email
    const testResult = await sendEmail({
      to: config.workshopEmail,
      subject: 'CarBot Email Test - System funktioniert!',
      html: `
        <h2>✅ Email-System Test erfolgreich</h2>
        <p>Ihre CarBot Email-Konfiguration funktioniert korrekt!</p>
        <p><strong>Zeitpunkt:</strong> ${new Date().toLocaleString('de-DE')}</p>
        <p><strong>Von:</strong> ${config.emailFromName} &lt;${config.emailFrom}&gt;</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Dies ist eine automatische Test-E-Mail von CarBot.
        </p>
      `
    })
    
    return {
      success: testResult.success,
      message: testResult.success ? 'Email configuration test successful' : 'Email test failed',
      config,
      testResult
    }
    
  } catch (error) {
    return {
      success: false,
      message: 'Email configuration test failed',
      error: error.message
    }
  }
}