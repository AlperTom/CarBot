'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AppointmentBooking({ 
  customerSlug, 
  onBookingComplete, 
  language = 'de',
  leadData = null 
}) {
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [bookingData, setBookingData] = useState({
    name: leadData?.name || '',
    phone: leadData?.telefon || '',
    email: '',
    service: leadData?.anliegen || '',
    vehicle: leadData?.fahrzeug || '',
    notes: ''
  })

  const translations = {
    de: {
      title: "Termin buchen",
      selectTime: "Wählen Sie einen Termin",
      contactInfo: "Kontaktdaten",
      serviceDetails: "Service-Details", 
      name: "Name",
      phone: "Telefon",
      email: "E-Mail",
      service: "Gewünschter Service",
      vehicle: "Fahrzeug",
      notes: "Zusätzliche Notizen",
      book: "Termin buchen",
      cancel: "Abbrechen",
      success: "Termin erfolgreich gebucht!",
      error: "Fehler beim Buchen des Termins"
    },
    en: {
      title: "Book Appointment",
      selectTime: "Select an appointment time",
      contactInfo: "Contact Information",
      serviceDetails: "Service Details",
      name: "Name", 
      phone: "Phone",
      email: "Email",
      service: "Requested Service",
      vehicle: "Vehicle",
      notes: "Additional Notes",
      book: "Book Appointment",
      cancel: "Cancel",
      success: "Appointment booked successfully!",
      error: "Error booking appointment"
    },
    tr: {
      title: "Randevu Al",
      selectTime: "Randevu zamanı seçin",
      contactInfo: "İletişim Bilgileri",
      serviceDetails: "Servis Detayları",
      name: "İsim",
      phone: "Telefon", 
      email: "E-posta",
      service: "İstenen Servis",
      vehicle: "Araç",
      notes: "Ek Notlar",
      book: "Randevu Al",
      cancel: "İptal",
      success: "Randevu başarıyla alındı!",
      error: "Randevu alınırken hata"
    },
    pl: {
      title: "Umów Wizytę",
      selectTime: "Wybierz termin wizyty",
      contactInfo: "Informacje Kontaktowe",
      serviceDetails: "Szczegóły Usługi",
      name: "Imię",
      phone: "Telefon",
      email: "Email", 
      service: "Żądana Usługa",
      vehicle: "Pojazd",
      notes: "Dodatkowe Uwagi",
      book: "Umów Wizytę",
      cancel: "Anuluj",
      success: "Wizyta umówiona pomyślnie!",
      error: "Błąd podczas umawiania wizyty"
    }
  }

  const t = translations[language] || translations.de

  useEffect(() => {
    loadAvailableSlots()
  }, [customerSlug])

  const loadAvailableSlots = async () => {
    try {
      setLoading(true)
      
      // Get customer's working hours and existing appointments
      const { data: customer } = await supabase
        .from('customers')
        .select('opening_hours, appointment_duration, appointment_buffer')
        .eq('slug', customerSlug)
        .single()

      if (!customer) return

      // Get existing appointments for next 14 days
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + 14)

      const { data: existingAppointments } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('customer_slug', customerSlug)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())

      // Generate available slots
      const slots = generateAvailableSlots(
        customer.opening_hours,
        existingAppointments || [],
        customer.appointment_duration || 60,
        customer.appointment_buffer || 15
      )

      setAvailableSlots(slots)
    } catch (error) {
      console.error('Error loading appointment slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAvailableSlots = (openingHours, existingAppointments, duration, buffer) => {
    const slots = []
    const workingHours = parseOpeningHours(openingHours)
    
    for (let day = 0; day < 14; day++) {
      const date = new Date()
      date.setDate(date.getDate() + day)
      
      // Skip weekends if not in working hours
      const dayOfWeek = date.getDay()
      const daySchedule = workingHours[dayOfWeek]
      
      if (!daySchedule) continue

      // Generate time slots for this day
      const daySlots = generateDaySlots(date, daySchedule, duration, buffer)
      
      // Filter out existing appointments
      const availableSlots = daySlots.filter(slot => 
        !isSlotBooked(slot, existingAppointments)
      )
      
      slots.push(...availableSlots)
    }

    return slots.slice(0, 20) // Limit to first 20 available slots
  }

  const parseOpeningHours = (hoursString) => {
    // Parse opening hours format: "Mo-Fr: 8:00-18:00\nSa: 9:00-14:00"
    const hours = {}
    const dayMap = { Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6, So: 0 }
    
    hoursString?.split('\n').forEach(line => {
      const match = line.match(/([A-Za-z-]+):\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/)
      if (match) {
        const [, days, start, end] = match
        
        if (days.includes('-')) {
          // Range like "Mo-Fr"
          const [startDay, endDay] = days.split('-')
          const startNum = dayMap[startDay]
          const endNum = dayMap[endDay]
          
          for (let d = startNum; d <= endNum; d++) {
            hours[d] = { start, end }
          }
        } else {
          // Single day like "Sa"
          hours[dayMap[days]] = { start, end }
        }
      }
    })
    
    return hours
  }

  const generateDaySlots = (date, schedule, duration, buffer) => {
    const slots = []
    const [startHour, startMin] = schedule.start.split(':').map(Number)
    const [endHour, endMin] = schedule.end.split(':').map(Number)
    
    const startTime = new Date(date)
    startTime.setHours(startHour, startMin, 0, 0)
    
    const endTime = new Date(date)
    endTime.setHours(endHour, endMin, 0, 0)
    
    const slotDuration = duration + buffer // Include buffer time
    
    let currentTime = new Date(startTime)
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime)
      slotEnd.setMinutes(slotEnd.getMinutes() + duration)
      
      if (slotEnd <= endTime && currentTime > new Date()) {
        slots.push({
          start: new Date(currentTime),
          end: slotEnd,
          duration: duration
        })
      }
      
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration)
    }
    
    return slots
  }

  const isSlotBooked = (slot, existingAppointments) => {
    return existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.start_time)
      const appointmentEnd = new Date(appointment.end_time)
      
      return (slot.start < appointmentEnd && slot.end > appointmentStart)
    })
  }

  const formatSlotTime = (slot) => {
    const formatter = new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : language, {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    return formatter.format(slot.start)
  }

  const handleBookAppointment = async () => {
    if (!selectedSlot || !bookingData.name || !bookingData.phone) {
      alert(t.error)
      return
    }

    setBooking(true)
    
    try {
      // Create appointment record
      const appointmentData = {
        customer_slug: customerSlug,
        start_time: selectedSlot.start.toISOString(),
        end_time: selectedSlot.end.toISOString(),
        customer_name: bookingData.name,
        customer_phone: bookingData.phone,
        customer_email: bookingData.email,
        service_requested: bookingData.service,
        vehicle_info: bookingData.vehicle,
        notes: bookingData.notes,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        language: language
      }

      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single()

      if (error) throw error

      // Send confirmation webhook
      try {
        await fetch('/api/webhooks/appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'appointment_booked',
            data: appointment
          })
        })
      } catch (webhookError) {
        console.error('Webhook error:', webhookError)
      }

      // Track booking event
      await supabase.from('analytics_events').insert({
        event_type: 'appointment_booked',
        client_key: customerSlug,
        event_data: {
          service: bookingData.service,
          lead_converted: !!leadData,
          language: language
        }
      })

      alert(t.success)
      onBookingComplete?.(appointment)
      
    } catch (error) {
      console.error('Booking error:', error)
      alert(t.error)
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ color: '#666' }}>Loading available appointments...</div>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>{t.title}</h2>
      
      {/* Time Slot Selection */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>{t.selectTime}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px'
        }}>
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSelectedSlot(slot)}
              style={{
                padding: '10px 15px',
                border: '1px solid',
                borderColor: selectedSlot === slot ? '#0070f3' : '#e2e8f0',
                borderRadius: '6px',
                background: selectedSlot === slot ? '#e6f3ff' : 'white',
                color: selectedSlot === slot ? '#0070f3' : '#1a202c',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              {formatSlotTime(slot)}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>{t.contactInfo}</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <input
            type="text"
            placeholder={t.name + ' *'}
            value={bookingData.name}
            onChange={e => setBookingData(prev => ({ ...prev, name: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <input
            type="tel"
            placeholder={t.phone + ' *'}
            value={bookingData.phone}
            onChange={e => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e2e8f0', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <input
            type="email"
            placeholder={t.email}
            value={bookingData.email}
            onChange={e => setBookingData(prev => ({ ...prev, email: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px', 
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Service Details */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>{t.serviceDetails}</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <input
            type="text"
            placeholder={t.service}
            value={bookingData.service}
            onChange={e => setBookingData(prev => ({ ...prev, service: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <input
            type="text"
            placeholder={t.vehicle}
            value={bookingData.vehicle}
            onChange={e => setBookingData(prev => ({ ...prev, vehicle: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <textarea
            placeholder={t.notes}
            value={bookingData.notes}
            onChange={e => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          onClick={handleBookAppointment}
          disabled={booking || !selectedSlot || !bookingData.name || !bookingData.phone}
          style={{
            flex: 1,
            padding: '15px 20px',
            border: 'none',
            borderRadius: '6px',
            background: booking ? '#ccc' : '#0070f3',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: booking ? 'not-allowed' : 'pointer'
          }}
        >
          {booking ? '...' : t.book}
        </button>
        <button
          onClick={() => onBookingComplete?.(null)}
          style={{
            padding: '15px 20px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: 'white',
            color: '#666',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  )
}