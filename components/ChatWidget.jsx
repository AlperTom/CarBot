'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { detectLanguage, getTranslation, getSystemPrompt } from '../lib/i18n'
import AppointmentBooking from './AppointmentBooking'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Content sanitization function to prevent XSS
function sanitizeContent(content) {
  if (typeof content !== 'string') return ''
  
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .substring(0, 10000) // Limit length to prevent DoS
}

export default function ChatWidget({ 
  clientKey, 
  isEmbedded = false, 
  onLeadCaptured = null, 
  onClose = null, 
  config = {},
  parentUrl = ''
}) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState({
    name: '',
    telefon: '',
    anliegen: '',
    fahrzeug: ''
  })
  const [language, setLanguage] = useState('de')
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [showConsent, setShowConsent] = useState(true)
  const [consentData, setConsentData] = useState({
    dataProcessing: false,
    communication: false,
    analytics: false
  })

  // Check for existing consent and detect language on component mount
  useEffect(() => {
    const existingConsent = localStorage.getItem('carbot-gdpr-consent')
    if (existingConsent) {
      const consent = JSON.parse(existingConsent)
      if (consent.timestamp && Date.now() - consent.timestamp < 365 * 24 * 60 * 60 * 1000) { // 1 year validity
        setConsentGiven(true)
        setShowConsent(false)
        setConsentData(consent.preferences)
      }
    }

    // Detect user language
    const userLanguage = detectLanguage('', navigator.userAgent, navigator.language)
    setLanguage(userLanguage)
  }, [])

  const handleConsentSubmit = async () => {
    if (!consentData.dataProcessing) {
      alert(language === 'de' ? 'Die Zustimmung zur Datenverarbeitung ist erforderlich, um den Chat zu nutzen.' :
            language === 'en' ? 'Consent to data processing is required to use the chat.' :
            language === 'tr' ? 'Sohbeti kullanmak için veri işleme onayı gereklidir.' :
            'Zgoda na przetwarzanie danych jest wymagana do korzystania z czatu.')
      return
    }

    const consentRecord = {
      timestamp: Date.now(),
      preferences: consentData,
      clientKey: clientKey || 'anonymous',
      ipAddress: 'masked-for-privacy', // In production, get real IP
      userAgent: navigator.userAgent
    }

    // Store consent locally
    localStorage.setItem('carbot-gdpr-consent', JSON.stringify(consentRecord))

    // Store consent in database for audit purposes
    try {
      await supabase.from('consent_records').insert({
        client_key: clientKey || 'anonymous',
        consent_data: consentRecord,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error storing consent record:', error)
    }

    setConsentGiven(true)
    setShowConsent(false)
  }
  
  const sendMessage = async () => {
    if (!input.trim()) return
    if (!consentGiven) {
      alert(language === 'de' ? 'Bitte stimme der Datenverarbeitung zu, um den Chat zu nutzen.' :
            language === 'en' ? 'Please consent to data processing to use the chat.' :
            language === 'tr' ? 'Sohbeti kullanmak için lütfen veri işlemeyi onaylayın.' :
            'Proszę wyrazić zgodę na przetwarzanie danych, aby korzystać z czatu.')
      return
    }
    
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    
    try {
      // Store chat message in database with consent reference
      await supabase.from('chat_messages').insert({
        client_key: clientKey || 'anonymous',
        message: input,
        message_type: 'user',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days expiry
      })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg], 
          clientKey,
          hasConsent: consentGiven,
          language: language,
          systemPrompt: getSystemPrompt(language, { customer: { clientKey } })
        })
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      const assistantResponse = data.text || data.message || 'Keine Antwort erhalten'
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantResponse
      }])

      // Store assistant response in database
      await supabase.from('chat_messages').insert({
        client_key: clientKey || 'anonymous',
        message: assistantResponse,
        message_type: 'assistant',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      })

      // Check if response suggests lead capture
      if (shouldCaptureLeadFromResponse(assistantResponse)) {
        setTimeout(() => setShowLeadForm(true), 2000)
      }

      // Check if response suggests appointment booking
      if (shouldTriggerAppointmentBooking(assistantResponse)) {
        setTimeout(() => setShowAppointmentBooking(true), 2500)
      }

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: getTranslation(language, 'common.error') 
      }])
    } finally {
      setLoading(false)
    }
  }
  
  const shouldCaptureLeadFromResponse = (response) => {
    const leadTriggers = {
      de: ['kontakt', 'angebot', 'beratung', 'rückruf', 'telefon', 'email'],
      en: ['contact', 'quote', 'consultation', 'callback', 'phone', 'email'],
      tr: ['iletişim', 'teklif', 'danışmanlık', 'geri arama', 'telefon', 'e-posta'],
      pl: ['kontakt', 'oferta', 'konsultacja', 'oddzwonienie', 'telefon', 'email']
    }
    const triggers = leadTriggers[language] || leadTriggers.de
    return triggers.some(trigger => 
      response.toLowerCase().includes(trigger)
    )
  }

  const shouldTriggerAppointmentBooking = (response) => {
    const appointmentTriggers = {
      de: ['termin', 'appointment', 'buchen', 'vereinbaren', 'datum', 'zeit', 'wann'],
      en: ['appointment', 'book', 'schedule', 'date', 'time', 'when'],
      tr: ['randevu', 'rezervasyon', 'tarih', 'saat', 'ne zaman'],
      pl: ['wizyta', 'umówić', 'data', 'czas', 'kiedy']
    }
    const triggers = appointmentTriggers[language] || appointmentTriggers.de
    return triggers.some(trigger => 
      response.toLowerCase().includes(trigger)
    )
  }

  const handleLeadSubmit = async () => {
    if (!leadData.name || !leadData.telefon || !leadData.anliegen) {
      alert(language === 'de' ? 'Bitte füllen Sie alle Pflichtfelder aus.' :
            language === 'en' ? 'Please fill in all required fields.' :
            language === 'tr' ? 'Lütfen tüm gerekli alanları doldurun.' :
            'Proszę wypełnić wszystkie wymagane pola.')
      return
    }

    const lead = {
      kunde_id: clientKey || 'anonymous',
      name: leadData.name,
      telefon: leadData.telefon,
      anliegen: leadData.anliegen,
      fahrzeug: leadData.fahrzeug,
      chatverlauf: JSON.stringify(messages),
      timestamp: new Date().toISOString(),
      source_url: parentUrl || window.location.href,
      created_at: new Date().toISOString()
    }

    try {
      // Store lead in database
      const { data: insertedLead } = await supabase.from('leads').insert(lead).select().single()

      // Score the lead automatically
      try {
        await fetch('/api/leads/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'score',
            leadData: insertedLead,
            chatHistory: messages
          })
        })
      } catch (scoringError) {
        console.error('Lead scoring error:', scoringError)
      }

      // Send webhook notification
      try {
        await fetch('/api/webhooks/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insertedLead)
        })
      } catch (webhookError) {
        console.error('Webhook error:', webhookError)
      }

      // Notify parent if embedded
      if (onLeadCaptured) {
        onLeadCaptured(lead)
      }

      setShowLeadForm(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'de' ? `Vielen Dank, ${leadData.name}! Wir haben Ihre Anfrage erhalten und melden uns zeitnah bei Ihnen. 📞` :
                 language === 'en' ? `Thank you, ${leadData.name}! We have received your request and will contact you shortly. 📞` :
                 language === 'tr' ? `Teşekkürler, ${leadData.name}! Talebinizi aldık ve kısa sürede sizinle iletişime geçeceğiz. 📞` :
                 `Dziękujemy, ${leadData.name}! Otrzymaliśmy Twoją prośbę i wkrótce się z Tobą skontaktujemy. 📞`
      }])

    } catch (error) {
      console.error('Lead capture error:', error)
      alert(language === 'de' ? 'Fehler beim Speichern Ihrer Anfrage. Bitte versuchen Sie es erneut.' :
            language === 'en' ? 'Error saving your request. Please try again.' :
            language === 'tr' ? 'Talebinizi kaydetme hatası. Lütfen tekrar deneyin.' :
            'Błąd podczas zapisywania Twojej prośby. Spróbuj ponownie.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  if (showAppointmentBooking) {
    return (
      <div style={{ 
        position: isEmbedded ? 'relative' : 'fixed', 
        bottom: isEmbedded ? 'auto' : 20, 
        right: isEmbedded ? 'auto' : 20, 
        width: isEmbedded ? '100%' : 500, 
        height: isEmbedded ? '100%' : 'auto',
        background: '#fff', 
        borderRadius: isEmbedded ? 0 : 16, 
        boxShadow: isEmbedded ? 'none' : '0 4px 6px rgba(0,0,0,0.1)', 
        zIndex: isEmbedded ? 'auto' : 1000,
        padding: 0,
        overflow: 'auto'
      }}>
        <div style={{ 
          background: '#0070f3', 
          color: 'white', 
          padding: 12, 
          borderRadius: isEmbedded ? 0 : '16px 16px 0 0',
          fontWeight: 'bold',
          margin: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>📅 Termin buchen</span>
          <button 
            onClick={() => setShowAppointmentBooking(false)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
        
        <AppointmentBooking 
          customerSlug={clientKey}
          language={language}
          leadData={leadData}
          onBookingComplete={(appointment) => {
            setShowAppointmentBooking(false)
            if (appointment) {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: language === 'de' ? `✅ Termin erfolgreich gebucht! Wir freuen uns auf Ihren Besuch.` :
                         language === 'en' ? `✅ Appointment successfully booked! We look forward to your visit.` :
                         language === 'tr' ? `✅ Randevu başarıyla alındı! Ziyaretinizi bekliyoruz.` :
                         `✅ Wizyta została pomyślnie umówiona! Czekamy na Twoją wizytę.`
              }])
            }
          }}
        />
      </div>
    )
  }

  if (showLeadForm) {
    return (
      <div style={{ 
        position: isEmbedded ? 'relative' : 'fixed', 
        bottom: isEmbedded ? 'auto' : 20, 
        right: isEmbedded ? 'auto' : 20, 
        width: isEmbedded ? '100%' : 350, 
        height: isEmbedded ? '100%' : 'auto',
        background: '#fff', 
        borderRadius: isEmbedded ? 0 : 16, 
        boxShadow: isEmbedded ? 'none' : '0 4px 6px rgba(0,0,0,0.1)', 
        zIndex: isEmbedded ? 'auto' : 1000,
        padding: 20,
        overflow: 'auto'
      }}>
        <div style={{ 
          background: '#0070f3', 
          color: 'white', 
          padding: 12, 
          borderRadius: '12px 12px 0 0',
          fontWeight: 'bold',
          margin: '-20px -20px 20px -20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🚗 {getTranslation(language, 'lead_form.title')}</span>
          <button 
            onClick={() => setShowLeadForm(false)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: 20 }}>
          <p style={{ margin: '0 0 15px 0' }}>
            {getTranslation(language, 'lead_form.description')}
          </p>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '13px', fontWeight: 'bold' }}>
            {getTranslation(language, 'lead_form.name')} *
          </label>
          <input 
            type="text"
            value={leadData.name}
            onChange={e => setLeadData(prev => ({ ...prev, name: e.target.value }))}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder={getTranslation(language, 'lead_form.name')}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '13px', fontWeight: 'bold' }}>
            {getTranslation(language, 'lead_form.phone')} *
          </label>
          <input 
            type="tel"
            value={leadData.telefon}
            onChange={e => setLeadData(prev => ({ ...prev, telefon: e.target.value }))}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="+49 123 456789"
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '13px', fontWeight: 'bold' }}>
            {getTranslation(language, 'lead_form.request')} *
          </label>
          <textarea 
            value={leadData.anliegen}
            onChange={e => setLeadData(prev => ({ ...prev, anliegen: e.target.value }))}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: '14px',
              boxSizing: 'border-box',
              minHeight: 60,
              resize: 'vertical'
            }}
            placeholder="TÜV, Reparatur, Wartung, etc."
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '13px', fontWeight: 'bold' }}>
            {getTranslation(language, 'lead_form.vehicle')}
          </label>
          <input 
            type="text"
            value={leadData.fahrzeug}
            onChange={e => setLeadData(prev => ({ ...prev, fahrzeug: e.target.value }))}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="z.B. BMW 3er, Baujahr 2015"
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleLeadSubmit}
            style={{ 
              flex: 1,
              padding: '12px 20px', 
              border: 'none', 
              background: '#0070f3', 
              color: '#fff', 
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {getTranslation(language, 'lead_form.submit')}
          </button>
          <button 
            onClick={() => setShowLeadForm(false)}
            style={{ 
              padding: '12px 20px', 
              border: '1px solid #ccc', 
              background: '#fff', 
              color: '#666', 
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {getTranslation(language, 'lead_form.later')}
          </button>
        </div>
      </div>
    )
  }

  if (showConsent) {
    return (
      <div style={{ 
        position: isEmbedded ? 'relative' : 'fixed', 
        bottom: isEmbedded ? 'auto' : 20, 
        right: isEmbedded ? 'auto' : 20, 
        width: isEmbedded ? '100%' : 350, 
        height: isEmbedded ? '100%' : 'auto',
        background: '#fff', 
        borderRadius: isEmbedded ? 0 : 16, 
        boxShadow: isEmbedded ? 'none' : '0 4px 6px rgba(0,0,0,0.1)', 
        zIndex: isEmbedded ? 'auto' : 1000,
        padding: 20,
        overflow: 'auto'
      }}>
        <div style={{ 
          background: '#0070f3', 
          color: 'white', 
          padding: 12, 
          borderRadius: '12px 12px 0 0',
          fontWeight: 'bold',
          margin: '-20px -20px 20px -20px'
        }}>
          🚗 CarBot - {getTranslation(language, 'consent.title')}
        </div>
        
        <div style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: 15 }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
            {getTranslation(language, 'consent.description')}
          </p>
          <p style={{ margin: '0 0 15px 0', color: '#666' }}>
            Wir verarbeiten Ihre Daten DSGVO-konform. Alle Nachrichten werden nach 90 Tagen automatisch gelöscht.
          </p>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10, fontSize: '13px' }}>
            <input 
              type="checkbox" 
              checked={consentData.dataProcessing}
              onChange={e => setConsentData(prev => ({ ...prev, dataProcessing: e.target.checked }))}
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <span>
              <strong>{language === 'de' ? 'Erforderlich:' : 'Required:'}</strong> {getTranslation(language, 'consent.required')}
            </span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10, fontSize: '13px' }}>
            <input 
              type="checkbox" 
              checked={consentData.communication}
              onChange={e => setConsentData(prev => ({ ...prev, communication: e.target.checked }))}
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <span>
              {language === 'de' ? 'Optional:' : 'Optional:'} {getTranslation(language, 'consent.optional_communication')}
            </span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 15, fontSize: '13px' }}>
            <input 
              type="checkbox" 
              checked={consentData.analytics}
              onChange={e => setConsentData(prev => ({ ...prev, analytics: e.target.checked }))}
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <span>
              {language === 'de' ? 'Optional:' : 'Optional:'} {getTranslation(language, 'consent.optional_analytics')}
            </span>
          </label>
        </div>

        <div style={{ fontSize: '12px', color: '#666', marginBottom: 15 }}>
          <p style={{ margin: 0 }}>
            Weitere Informationen finden Sie in unserer{' '}
            <a href="/legal/datenschutz" target="_blank" style={{ color: '#0070f3' }}>
              Datenschutzerklärung
            </a>. Sie können Ihre Einwilligung jederzeit widerrufen.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleConsentSubmit}
            disabled={!consentData.dataProcessing}
            style={{ 
              flex: 1,
              padding: '10px 15px', 
              border: 'none', 
              background: consentData.dataProcessing ? '#0070f3' : '#ccc', 
              color: '#fff', 
              borderRadius: 6,
              cursor: consentData.dataProcessing ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {getTranslation(language, 'consent.start_chat')}
          </button>
          <button 
            onClick={() => setShowConsent(false)}
            style={{ 
              padding: '10px 15px', 
              border: '1px solid #ccc', 
              background: '#fff', 
              color: '#666', 
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {getTranslation(language, 'consent.decline')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      position: isEmbedded ? 'relative' : 'fixed', 
      bottom: isEmbedded ? 'auto' : 20, 
      right: isEmbedded ? 'auto' : 20, 
      width: isEmbedded ? '100%' : 300, 
      height: isEmbedded ? '100%' : 400, 
      background: '#fff', 
      borderRadius: isEmbedded ? 0 : 16, 
      boxShadow: isEmbedded ? 'none' : '0 4px 6px rgba(0,0,0,0.1)', 
      display: 'flex', 
      flexDirection: 'column',
      zIndex: isEmbedded ? 'auto' : 1000
    }}>
      <div style={{ 
        background: '#0070f3', 
        color: 'white', 
        padding: 12, 
        borderRadius: isEmbedded ? 0 : '16px 16px 0 0',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>🚗 CarBot Assistant</span>
        <div style={{ display: 'flex', gap: 5 }}>
          <button 
            onClick={() => setShowLeadForm(true)}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 4
            }}
            title="Rückruf anfordern"
          >
            📞
          </button>
          <button 
            onClick={() => setShowAppointmentBooking(true)}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 4
            }}
            title="Termin buchen"
          >
            📅
          </button>
          <button 
            onClick={() => setShowConsent(true)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: 4,
              opacity: 0.8
            }}
            title="Datenschutzeinstellungen"
          >
            ⚙️
          </button>
          {isEmbedded && onClose && (
            <button 
              onClick={onClose}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                fontSize: '16px',
                padding: '2px 6px',
                borderRadius: 4,
                opacity: 0.8
              }}
              title="Chat schließen"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {messages.length === 0 && (
          <div style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginTop: 20 }}>
            {getTranslation(language, 'greeting')}
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} style={{ 
            textAlign: m.role === 'user' ? 'right' : 'left', 
            margin: '8px 0' 
          }}>
            <span style={{ 
              display: 'inline-block', 
              padding: 8, 
              borderRadius: 8, 
              background: m.role === 'user' ? '#0070f3' : '#f1f1f1',
              color: m.role === 'user' ? 'white' : 'black',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {sanitizeContent(m.content)}
            </span>
          </div>
        ))}
        
        {loading && (
          <div style={{ textAlign: 'left', margin: '8px 0' }}>
            <span style={{ 
              display: 'inline-block', 
              padding: 8, 
              borderRadius: 8, 
              background: '#f1f1f1',
              color: '#666'
            }}>
              🤔 {getTranslation(language, 'common.loading')}
            </span>
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        padding: 8, 
        borderTop: '1px solid #ddd' 
      }}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading || !consentGiven}
          style={{ 
            flex: 1, 
            padding: 8, 
            borderRadius: '4px 0 0 4px', 
            border: '1px solid #ccc',
            outline: 'none',
            opacity: consentGiven ? 1 : 0.5
          }} 
          placeholder={consentGiven ? getTranslation(language, 'common.placeholder') : (language === 'de' ? 'Zustimmung erforderlich...' : 'Consent required...')} 
        />
        <button 
          onClick={sendMessage}
          disabled={loading || !input.trim() || !consentGiven}
          style={{ 
            padding: '0 16px', 
            border: 'none', 
            background: (loading || !consentGiven) ? '#ccc' : '#0070f3', 
            color: '#fff', 
            borderRadius: '0 4px 4px 0',
            cursor: (loading || !consentGiven) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '...' : getTranslation(language, 'common.send')}
        </button>
      </div>
    </div>
  )
}