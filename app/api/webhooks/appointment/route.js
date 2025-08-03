import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { event, data: appointmentData } = await request.json()
    
    if (event !== 'appointment_booked') {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    // Get customer details for notification
    const { data: customer } = await supabase
      .from('customers')
      .select('name, email, phone')
      .eq('slug', appointmentData.customer_slug)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Format appointment notification email
    const appointmentDate = new Date(appointmentData.start_time)
    const formattedDate = appointmentDate.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const formattedTime = appointmentDate.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const translations = {
      de: {
        subject: `🚗 Neuer Termin gebucht: ${appointmentData.customer_name}`,
        greeting: 'Neuer Termin über CarBot gebucht!',
        details: 'Termin-Details',
        customer: 'Kunde',
        datetime: 'Datum & Zeit',
        service: 'Service',
        vehicle: 'Fahrzeug',
        notes: 'Notizen',
        contact: 'Kontakt',
        actions: 'Aktionen',
        confirm: 'Termin bestätigen',
        call: 'Kunde anrufen'
      },
      en: {
        subject: `🚗 New Appointment Booked: ${appointmentData.customer_name}`,
        greeting: 'New appointment booked via CarBot!',
        details: 'Appointment Details',
        customer: 'Customer',
        datetime: 'Date & Time', 
        service: 'Service',
        vehicle: 'Vehicle',
        notes: 'Notes',
        contact: 'Contact',
        actions: 'Actions',
        confirm: 'Confirm Appointment',
        call: 'Call Customer'
      },
      tr: {
        subject: `🚗 Yeni Randevu: ${appointmentData.customer_name}`,
        greeting: 'CarBot üzerinden yeni randevu alındı!',
        details: 'Randevu Detayları',
        customer: 'Müşteri',
        datetime: 'Tarih & Saat',
        service: 'Servis',
        vehicle: 'Araç',
        notes: 'Notlar',
        contact: 'İletişim',
        actions: 'İşlemler',
        confirm: 'Randevuyu Onayla',
        call: 'Müşteriyi Ara'
      },
      pl: {
        subject: `🚗 Nowa Wizyta: ${appointmentData.customer_name}`,
        greeting: 'Nowa wizyta umówiona przez CarBot!',
        details: 'Szczegóły Wizyty',
        customer: 'Klient',
        datetime: 'Data i Czas',
        service: 'Usługa',
        vehicle: 'Pojazd',
        notes: 'Uwagi',
        contact: 'Kontakt',
        actions: 'Akcje',
        confirm: 'Potwierdź Wizytę',
        call: 'Zadzwoń do Klienta'
      }
    }

    const t = translations[appointmentData.language] || translations.de

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <div style="background: linear-gradient(135deg, #0070f3 0%, #0051a5 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🚗 ${t.greeting}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
          ${customer.name} - CarBot Terminbuchung
        </p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #0070f3; margin-bottom: 25px;">
          <h2 style="color: #0070f3; margin: 0 0 15px 0; font-size: 20px;">${t.details}</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568; width: 140px;">
                ${t.customer}:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1a202c;">
                ${appointmentData.customer_name}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">
                ${t.datetime}:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1a202c; font-weight: bold;">
                ${formattedDate}, ${formattedTime}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">
                ${t.service}:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1a202c;">
                ${appointmentData.service_requested || 'Nicht angegeben'}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">
                ${t.vehicle}:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1a202c;">
                ${appointmentData.vehicle_info || 'Nicht angegeben'}
              </td>
            </tr>
            ${appointmentData.notes ? `
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #4a5568;">
                ${t.notes}:
              </td>
              <td style="padding: 12px 0; color: #1a202c;">
                ${appointmentData.notes}
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #0070f3; margin: 0 0 15px 0; font-size: 18px;">${t.contact}</h3>
          <p style="margin: 0 0 8px 0;">
            <strong>📞 Telefon:</strong> 
            <a href="tel:${appointmentData.customer_phone}" style="color: #0070f3; text-decoration: none;">
              ${appointmentData.customer_phone}
            </a>
          </p>
          ${appointmentData.customer_email ? `
          <p style="margin: 0;">
            <strong>📧 E-Mail:</strong> 
            <a href="mailto:${appointmentData.customer_email}" style="color: #0070f3; text-decoration: none;">
              ${appointmentData.customer_email}
            </a>
          </p>
          ` : ''}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <h3 style="color: #1a202c; margin: 0 0 20px 0;">${t.actions}</h3>
          <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="tel:${appointmentData.customer_phone}" 
               style="background: #0070f3; color: white; padding: 15px 25px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block; margin: 5px;">
              📞 ${t.call}
            </a>
            <a href="mailto:${appointmentData.customer_email || customer.email}?subject=Terminbestätigung&body=Hallo ${appointmentData.customer_name}, vielen Dank für Ihre Terminbuchung am ${formattedDate} um ${formattedTime}." 
               style="background: #16a34a; color: white; padding: 15px 25px; text-decoration: none; 
                      border-radius: 6px; font-weight: bold; display: inline-block; margin: 5px;">
              ✅ ${t.confirm}
            </a>
          </div>
        </div>

        <div style="background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; margin-top: 25px;">
          <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ Wichtige Erinnerung:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #7f1d1d;">
            <li>Termin zeitnah bestätigen (idealerweise innerhalb 2 Stunden)</li>
            <li>Bei Fragen oder Änderungen direkt beim Kunden melden</li>
            <li>Termin im internen Kalender eintragen</li>
            <li>Benötigte Ersatzteile vorab bestellen</li>
          </ul>
        </div>
      </div>
      
      <div style="background: #1a202c; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">
          Automatisch generiert von <strong>CarBot</strong> | 
          <a href="https://carbot.chat" style="color: #0070f3;">carbot.chat</a>
        </p>
      </div>
    </div>
    `

    // Send notification email to workshop
    if (process.env.SMTP_ENABLED === 'true') {
      try {
        // This would integrate with your email service
        console.log('Appointment notification email would be sent:', {
          to: customer.email,
          subject: t.subject,
          html: emailHtml
        })
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
      }
    }

    // Send n8n webhook if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.N8N_API_KEY}`
          },
          body: JSON.stringify({
            event: 'appointment_booked',
            data: {
              ...appointmentData,
              customer: customer,
              formatted_date: formattedDate,
              formatted_time: formattedTime
            }
          })
        })
      } catch (n8nError) {
        console.error('n8n webhook failed:', n8nError)
      }
    }

    // Log the webhook activity
    await supabase.from('webhook_logs').insert({
      webhook_type: 'appointment_notification',
      payload: appointmentData,
      response_status: 200,
      processing_time_ms: Date.now() - Date.now(),
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true,
      message: 'Appointment notification sent',
      appointment_id: appointmentData.id 
    })

  } catch (error) {
    console.error('Appointment webhook error:', error)
    
    // Log the error
    try {
      await supabase.from('webhook_logs').insert({
        webhook_type: 'appointment_notification',
        payload: request.body,
        response_status: 500,
        error_message: error.message,
        created_at: new Date().toISOString()
      })
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return NextResponse.json({ 
      error: 'Failed to process appointment webhook',
      details: error.message 
    }, { status: 500 })
  }
}