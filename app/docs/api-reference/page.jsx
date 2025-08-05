'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function APIReferencePage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <SharedLayout title="API Referenz" showNavigation={true}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/docs" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            ← Zurück zur Dokumentation
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>📖</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                API Referenz
              </h1>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Fortgeschritten
                </span>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  🕐 30 Minuten
                </span>
              </div>
            </div>
          </div>
          
          <p style={{ 
            color: '#d1d5db', 
            margin: 0,
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            Vollständige API-Dokumentation für CarBot Chat-Widget, REST-Endpunkte 
            und JavaScript-Schnittstellen für erweiterte Integrationen.
          </p>
        </div>

        {/* Quick Navigation */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            📚 Schnellnavigation
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <a href="#widget-api" style={{ color: '#fb923c', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔧</div>
                <div>Widget JavaScript API</div>
              </div>
            </a>
            <a href="#rest-api" style={{ color: '#22c55e', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌐</div>
                <div>REST API Endpunkte</div>
              </div>
            </a>
            <a href="#webhooks" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔔</div>
                <div>Webhooks</div>
              </div>
            </a>
            <a href="#events" style={{ color: '#ef4444', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
                <div>Events & Callbacks</div>
              </div>
            </a>
          </div>
        </GlassCard>

        {/* Widget JavaScript API */}
        <GlassCard style={{ marginBottom: '2rem' }} id="widget-api">
          <h2 style={{ color: '#fb923c', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔧 Widget JavaScript API
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Grundlegende Methoden
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// Widget öffnen
window.CarBot.open()

// Widget schließen  
window.CarBot.close()

// Widget umschalten (öffnen/schließen)
window.CarBot.toggle()

// Status abfragen
const isOpen = window.CarBot.isOpen()

// Widget minimieren/maximieren
window.CarBot.minimize()
window.CarBot.maximize()

// Widget-Verfügbarkeit prüfen
if (window.CarBot) {
  console.log('CarBot ist geladen');
}`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#fb923c',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📋 Kopieren
              </button>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'auto'
              }}>
{`// Widget öffnen
window.CarBot.open()

// Widget schließen  
window.CarBot.close()

// Widget umschalten (öffnen/schließen)
window.CarBot.toggle()

// Status abfragen
const isOpen = window.CarBot.isOpen()

// Widget minimieren/maximieren
window.CarBot.minimize()
window.CarBot.maximize()

// Widget-Verfügbarkeit prüfen
if (window.CarBot) {
  console.log('CarBot ist geladen');
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Nachrichten-API
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Nachricht senden
window.CarBot.sendMessage('Hallo, ich brauche Hilfe!')

// Vordefinierte Nachricht mit Auto-Öffnung
window.CarBot.sendMessage('Kostenvoranschlag benötigt', { 
  autoOpen: true 
})

// Nachricht mit Kontext
window.CarBot.sendMessage('Frage zum BMW 320i', {
  context: {
    vehicle: 'BMW 320i',
    year: 2018,
    issue: 'Bremsen quietschen'
  }
})

// Chat-Verlauf abrufen
const messages = window.CarBot.getMessages()

// Chat-Verlauf löschen
window.CarBot.clearMessages()

// Typing-Indikator anzeigen
window.CarBot.showTyping(true) // oder false`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Konfiguration zur Laufzeit
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Farbe ändern
window.CarBot.setColor('#ff6b35')

// Position ändern
window.CarBot.setPosition('top-left')

// Sprache ändern
window.CarBot.setLanguage('en')

// Begrüßung anpassen
window.CarBot.setGreeting('Willkommen bei AutoService Hamburg!')

// Theme wechseln
window.CarBot.setTheme('dark') // 'light', 'dark', 'auto'

// Alle Einstellungen auf einmal
window.CarBot.configure({
  color: '#ff6b35',
  position: 'bottom-left',
  language: 'de',
  greeting: 'Wie kann ich helfen?',
  theme: 'auto'
})`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Erweiterte Funktionen
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Benutzer-Kontext setzen
window.CarBot.setUserContext({
  name: 'Max Mustermann',
  email: 'max@example.com',
  vehicle: 'BMW 320i',
  customerId: '12345'
})

// Lead-Formular öffnen
window.CarBot.openLeadForm({
  prefill: {
    name: 'Max Mustermann',
    phone: '+49 123 456789'
  }
})

// Termin-Buchung öffnen
window.CarBot.openAppointmentBooking()

// Ungelesene Nachrichten-Badge
window.CarBot.setBadgeCount(3)
window.CarBot.clearBadge()

// Widget-Größe anpassen (nur Inline-Modus)
window.CarBot.resize(400, 600) // Breite, Höhe

// Screenshot für Support
const screenshot = window.CarBot.takeScreenshot()
console.log('Screenshot URL:', screenshot)`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* REST API */}
        <GlassCard style={{ marginBottom: '2rem' }} id="rest-api">
          <h2 style={{ color: '#22c55e', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🌐 REST API Endpunkte
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Basis-URL & Authentifizierung
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`Basis-URL: https://api.carbot.de/v1
Authentifizierung: Bearer Token oder Client Key

Headers:
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
X-Client-Key: YOUR_CLIENT_KEY`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Chat API
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// Chat-Nachricht senden
POST /api/chat

{
  "messages": [
    {"role": "user", "content": "Hallo, ich brauche einen Termin"}
  ],
  "clientKey": "ihr-client-key",
  "hasConsent": true,
  "language": "de",
  "context": {
    "vehicle": "BMW 320i",
    "customerName": "Max Mustermann"
  }
}

// Antwort
{
  "text": "Gerne! Wann wäre ein Termin passend?",
  "context": {
    "customer": "Max Mustermann",
    "has_services": true
  },
  "usage": {
    "tokens": 45,
    "cost": 0.001
  }
}`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📋 Kopieren
              </button>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'auto'
              }}>
{`// Chat-Nachricht senden
POST /api/chat

{
  "messages": [
    {"role": "user", "content": "Hallo, ich brauche einen Termin"}
  ],
  "clientKey": "ihr-client-key",
  "hasConsent": true,
  "language": "de",
  "context": {
    "vehicle": "BMW 320i",
    "customerName": "Max Mustermann"
  }
}

// Antwort
{
  "text": "Gerne! Wann wäre ein Termin passend?",
  "context": {
    "customer": "Max Mustermann",
    "has_services": true
  },
  "usage": {
    "tokens": 45,
    "cost": 0.001
  }
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Leads API
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Lead erstellen
POST /api/leads

{
  "clientKey": "ihr-client-key",
  "name": "Max Mustermann",
  "phone": "+49 123 456789",
  "email": "max@example.com",
  "message": "Brauche TÜV für BMW 320i",
  "vehicle": "BMW 320i, Baujahr 2018",
  "chatHistory": [...],
  "source": "widget_chat"
}

// Leads abrufen
GET /api/leads?clientKey=ihr-client-key&limit=10&offset=0

// Lead aktualisieren
PUT /api/leads/{leadId}

{
  "status": "contacted",
  "notes": "Termin vereinbart für Donnerstag 14:00"
}

// Lead löschen
DELETE /api/leads/{leadId}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Analytics API
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Chat-Statistiken
GET /api/analytics/chat?clientKey=ihr-client-key&period=30d

{
  "totalChats": 127,
  "totalMessages": 856,
  "avgResponseTime": 1.2,
  "satisfactionScore": 4.7,
  "topQuestions": [
    "TÜV Kosten",
    "Öffnungszeiten", 
    "Terminbuchung"
  ]
}

// Lead-Statistiken
GET /api/analytics/leads?clientKey=ihr-client-key&period=30d

{
  "totalLeads": 45,
  "conversionRate": 0.35,
  "leadSources": {
    "widget_chat": 32,
    "contact_form": 13
  },
  "avgLeadValue": 185.50
}

// Echtzeit-Metriken
GET /api/analytics/realtime?clientKey=ihr-client-key

{
  "activeUsers": 3,
  "ongoingChats": 1,
  "avgResponseTime": 0.8
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Konfiguration API
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Widget-Konfiguration abrufen
GET /api/config?clientKey=ihr-client-key

{
  "clientKey": "ihr-client-key",
  "color": "#0070f3",
  "position": "bottom-right",
  "greeting": "Hallo! Wie kann ich helfen?",
  "language": "de",
  "features": {
    "leadCapture": true,
    "appointmentBooking": true,
    "fileUpload": false
  }
}

// Konfiguration aktualisieren
PUT /api/config

{
  "clientKey": "ihr-client-key",
  "color": "#ff6b35",
  "greeting": "Willkommen bei AutoService!",
  "operatingHours": {
    "monday": "08:00-18:00",
    "tuesday": "08:00-18:00",
    "saturday": "09:00-14:00",
    "sunday": "closed"
  }
}`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Webhooks */}
        <GlassCard style={{ marginBottom: '2rem' }} id="webhooks">
          <h2 style={{ color: '#8b5cf6', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔔 Webhooks
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Setup & Konfiguration
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Webhooks senden Echtzeit-Benachrichtigungen an Ihre Endpunkte:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Webhook konfigurieren
POST /api/webhooks

{
  "clientKey": "ihr-client-key",
  "url": "https://ihre-website.de/webhooks/carbot",
  "events": ["lead.created", "chat.started", "chat.ended"],
  "secret": "ihr-webhook-secret"
}

// Webhook-Signatur verifizieren (Node.js Beispiel)
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return signature === \`sha256=\${expectedSignature}\`;
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Lead-Events
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// lead.created
{
  "event": "lead.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "leadId": "lead_12345",
    "name": "Max Mustermann",
    "phone": "+49 123 456789",
    "email": "max@example.com",
    "message": "Brauche TÜV für BMW 320i",
    "vehicle": "BMW 320i, Baujahr 2018",
    "source": "widget_chat",
    "score": 85,
    "chatHistory": [...]
  }
}

// lead.updated
{
  "event": "lead.updated", 
  "timestamp": "2024-01-15T11:15:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "leadId": "lead_12345",
    "status": "contacted",
    "updatedFields": ["status", "notes"],
    "notes": "Termin vereinbart"
  }
}`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📋 Kopieren
              </button>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'auto'
              }}>
{`// lead.created
{
  "event": "lead.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "leadId": "lead_12345",
    "name": "Max Mustermann",
    "phone": "+49 123 456789",
    "email": "max@example.com",
    "message": "Brauche TÜV für BMW 320i",
    "vehicle": "BMW 320i, Baujahr 2018",
    "source": "widget_chat",
    "score": 85,
    "chatHistory": [...]
  }
}

// lead.updated
{
  "event": "lead.updated", 
  "timestamp": "2024-01-15T11:15:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "leadId": "lead_12345",
    "status": "contacted",
    "updatedFields": ["status", "notes"],
    "notes": "Termin vereinbart"
  }
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Chat-Events
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// chat.started
{
  "event": "chat.started",
  "timestamp": "2024-01-15T10:25:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "sessionId": "session_abc123",
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://ihre-website.de/service",
    "language": "de"
  }
}

// chat.message
{
  "event": "chat.message",
  "timestamp": "2024-01-15T10:26:30Z",
  "clientKey": "ihr-client-key", 
  "data": {
    "sessionId": "session_abc123",
    "role": "user",
    "content": "Wann haben Sie geöffnet?",
    "messageId": "msg_xyz789"
  }
}

// chat.ended
{
  "event": "chat.ended",
  "timestamp": "2024-01-15T10:35:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "sessionId": "session_abc123",
    "duration": 570,
    "messageCount": 8,
    "satisfaction": 5,
    "leadGenerated": true
  }
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Appointment-Events
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// appointment.booked
{
  "event": "appointment.booked",
  "timestamp": "2024-01-15T10:40:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "appointmentId": "apt_def456",
    "customerName": "Max Mustermann",
    "customerPhone": "+49 123 456789",
    "appointmentDate": "2024-01-18T14:00:00Z",
    "service": "TÜV Hauptuntersuchung",
    "vehicle": "BMW 320i",
    "notes": "Bremsen prüfen"
  }
}

// appointment.cancelled
{
  "event": "appointment.cancelled",
  "timestamp": "2024-01-16T09:15:00Z",
  "clientKey": "ihr-client-key",
  "data": {
    "appointmentId": "apt_def456",
    "reason": "customer_request",
    "cancelledBy": "customer"
  }
}`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Events & Callbacks */}
        <GlassCard style={{ marginBottom: '2rem' }} id="events">
          <h2 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.25rem' }}>
            ⚡ Events & Callbacks
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Widget-Events
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// Widget geladen
window.addEventListener('carbot:loaded', function(event) {
  console.log('CarBot ist bereit!');
  console.log('Konfiguration:', event.detail);
});

// Widget geöffnet/geschlossen
window.addEventListener('carbot:opened', function() {
  console.log('Chat geöffnet');
  // Analytics Event
  gtag('event', 'chat_opened', { event_category: 'CarBot' });
});

window.addEventListener('carbot:closed', function() {
  console.log('Chat geschlossen');
});

// Widget minimiert/maximiert
window.addEventListener('carbot:minimized', function() {
  console.log('Chat minimiert');
});

window.addEventListener('carbot:maximized', function() {
  console.log('Chat maximiert');
});

// Fehler-Events
window.addEventListener('carbot:error', function(event) {
  console.error('CarBot Fehler:', event.detail);
  // Fehler an Monitoring senden
  Sentry.captureException(new Error(event.detail.message));
});`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📋 Kopieren
              </button>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'auto'
              }}>
{`// Widget geladen
window.addEventListener('carbot:loaded', function(event) {
  console.log('CarBot ist bereit!');
  console.log('Konfiguration:', event.detail);
});

// Widget geöffnet/geschlossen
window.addEventListener('carbot:opened', function() {
  console.log('Chat geöffnet');
  // Analytics Event
  gtag('event', 'chat_opened', { event_category: 'CarBot' });
});

window.addEventListener('carbot:closed', function() {
  console.log('Chat geschlossen');
});

// Widget minimiert/maximiert
window.addEventListener('carbot:minimized', function() {
  console.log('Chat minimiert');
});

window.addEventListener('carbot:maximized', function() {
  console.log('Chat maximiert');
});

// Fehler-Events
window.addEventListener('carbot:error', function(event) {
  console.error('CarBot Fehler:', event.detail);
  // Fehler an Monitoring senden
  Sentry.captureException(new Error(event.detail.message));
});`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Chat-Events
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Neue Nachricht empfangen
window.addEventListener('carbot:message', function(event) {
  const message = event.detail;
  console.log('Neue Nachricht:', message.content);
  
  // Nachricht in eigenem System speichern
  if (message.role === 'assistant') {
    saveMessageToDatabase(message);
  }
});

// Nachricht gesendet
window.addEventListener('carbot:message_sent', function(event) {
  const message = event.detail;
  console.log('Nachricht gesendet:', message.content);
});

// Typing-Indikator
window.addEventListener('carbot:typing_start', function() {
  console.log('Bot tippt...');
});

window.addEventListener('carbot:typing_end', function() {
  console.log('Bot hat aufgehört zu tippen');
});

// Chat-Session Events
window.addEventListener('carbot:session_start', function(event) {
  const sessionId = event.detail.sessionId;
  console.log('Neue Chat-Session:', sessionId);
});

window.addEventListener('carbot:session_end', function(event) {
  const session = event.detail;
  console.log('Chat-Session beendet:', session);
  
  // Session-Statistiken tracken
  gtag('event', 'chat_session_end', {
    'session_duration': session.duration,
    'message_count': session.messageCount
  });
});`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Lead & Appointment Events
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Lead erfasst
window.addEventListener('carbot:lead_captured', function(event) {
  const lead = event.detail;
  console.log('Neuer Lead:', lead);
  
  // CRM-Integration
  sendToCRM(lead);
  
  // Analytics
  gtag('event', 'generate_lead', {
    'event_category': 'Conversion',
    'value': 50
  });
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', {
      content_name: 'CarBot Chat Lead',
      value: 50,
      currency: 'EUR'
    });
  }
});

// Lead-Formular geöffnet
window.addEventListener('carbot:lead_form_opened', function() {
  console.log('Lead-Formular geöffnet');
  gtag('event', 'lead_form_opened', { event_category: 'CarBot' });
});

// Termin gebucht
window.addEventListener('carbot:appointment_booked', function(event) {
  const appointment = event.detail;
  console.log('Termin gebucht:', appointment);
  
  // Kalender-Integration
  addToCalendar(appointment);
  
  // Bestätigungs-E-Mail
  sendConfirmationEmail(appointment);
});

// Zufriedenheitsbewertung
window.addEventListener('carbot:satisfaction_rated', function(event) {
  const rating = event.detail;
  console.log('Bewertung:', rating.score);
  
  // Feedback an Backend
  submitFeedback(rating);
});`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Callback-Funktionen
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Callbacks bei Widget-Initialisierung
window.carbotCallbacks = {
  onLoad: function() {
    console.log('CarBot geladen');
  },
  
  onMessage: function(message) {
    console.log('Nachricht:', message);
  },
  
  onLeadCaptured: function(lead) {
    console.log('Lead erfasst:', lead);
    // Eigene Lead-Verarbeitung
  },
  
  onError: function(error) {
    console.error('Fehler:', error);
  },
  
  // Custom Validation
  validateLead: function(leadData) {
    // Eigene Validierung
    if (!leadData.phone.startsWith('+49')) {
      return {
        valid: false,
        message: 'Bitte deutsche Telefonnummer angeben'
      };
    }
    return { valid: true };
  },
  
  // Custom Styling
  getCustomCSS: function() {
    return \`
      .carbot-widget {
        border-radius: 20px !important;
      }
      .carbot-header {
        background: linear-gradient(45deg, #ff6b35, #f7931e);
      }
    \`;
  }
};`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Error Handling */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🚨 Fehlerbehandlung
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              HTTP-Statuscodes
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid #22c55e' }}>
                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>200 OK</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Erfolgreich</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '8px', border: '1px solid #fb923c' }}>
                <div style={{ color: '#fb923c', fontWeight: 'bold' }}>400 Bad Request</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Ungültige Anfrage</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid #ef4444' }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold' }}>401 Unauthorized</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Authentication fehlt</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid #8b5cf6' }}>
                <div style={{ color: '#8b5cf6', fontWeight: 'bold' }}>429 Rate Limited</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Zu viele Anfragen</div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Fehler-Beispiele
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// 400 Bad Request
{
  "error": "VALIDATION_ERROR",
  "message": "Pflichtfelder fehlen",
  "details": {
    "missing_fields": ["clientKey", "hasConsent"]
  }
}

// 401 Unauthorized  
{
  "error": "UNAUTHORIZED",
  "message": "Ungültiger Client Key"
}

// 403 Forbidden
{
  "error": "GDPR_CONSENT_REQUIRED", 
  "message": "DSGVO-Einwilligung erforderlich"
}

// 429 Rate Limited
{
  "error": "RATE_LIMITED",
  "message": "Zu viele Anfragen. Versuchen Sie es in 60 Sekunden erneut.",
  "retryAfter": 60
}

// 500 Internal Server Error
{
  "error": "INTERNAL_ERROR",
  "message": "Unerwarteter Serverfehler",
  "requestId": "req_abc123"
}`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Rate Limits */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            ⏱️ Rate Limits
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Basic Plan</h3>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>1000 Chat-Nachrichten/Monat</li>
                <li>50 Leads/Monat</li>
                <li>10 API-Calls/Minute</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '8px' }}>
              <h3 style={{ color: '#fb923c', fontSize: '1rem', marginBottom: '0.5rem' }}>Pro Plan</h3>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>5000 Chat-Nachrichten/Monat</li>
                <li>250 Leads/Monat</li>
                <li>100 API-Calls/Minute</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>Enterprise</h3>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Unbegrenzte Nachrichten</li>
                <li>Unbegrenzte Leads</li>
                <li>1000 API-Calls/Minute</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎉 API-Integration bereit!
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            Mit dieser API-Dokumentation können Sie CarBot vollständig in Ihre Systeme integrieren:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/dashboard/api-keys">
              API-Schlüssel generieren
            </PrimaryButton>
            <SecondaryButton href="/docs/webhooks">
              Webhooks einrichten
            </SecondaryButton>
            <SecondaryButton href="/dashboard/analytics">
              API-Usage anzeigen
            </SecondaryButton>
          </div>
        </GlassCard>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '2rem',
          padding: '1rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Link href="/docs/framework-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← Framework Integration
          </Link>
          <Link href="/docs/webhooks" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Webhooks →
          </Link>
        </div>
      </div>
    </SharedLayout>
  )
}