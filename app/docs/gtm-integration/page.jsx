'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function GTMIntegrationPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  return (
    <SharedLayout title="Google Tag Manager Integration" showNavigation={true}>
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
            <div style={{ fontSize: '3rem' }}>📊</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                Google Tag Manager Integration
              </h1>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{
                  background: '#f59e0b',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Mittel
                </span>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  🕐 15 Minuten
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
            Installieren Sie CarBot über Google Tag Manager für erweiterte Tracking-Möglichkeiten 
            und zentrale Tag-Verwaltung.
          </p>
        </div>

        {/* Prerequisites */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            📋 Voraussetzungen
          </h2>
          <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Aktives CarBot-Konto</li>
            <li style={{ marginBottom: '0.5rem' }}>Google Tag Manager Container auf Ihrer Website</li>
            <li style={{ marginBottom: '0.5rem' }}>GTM-Bearbeiterrechte</li>
            <li>Ihr CarBot Client Key</li>
          </ul>
        </GlassCard>

        {/* Step 1 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            1️⃣ Client Key finden
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
            Loggen Sie sich in Ihr CarBot-Dashboard ein und kopieren Sie Ihren Client Key:
          </p>
          <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Gehen Sie zu <Link href="/dashboard/client-keys" style={{ color: '#fb923c' }}>Dashboard → Client-Keys</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>Kopieren Sie Ihren Client Key (z.B. <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>workshop-berlin-abc123</code>)</li>
            <li>Notieren Sie sich den Key für die nächsten Schritte</li>
          </ol>
        </GlassCard>

        {/* Step 2 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            2️⃣ Tag in Google Tag Manager erstellen
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              A) Neuen Tag erstellen
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Öffnen Sie Ihren GTM Container</li>
              <li style={{ marginBottom: '0.5rem' }}>Klicken Sie auf <strong>"Neuer Tag"</strong></li>
              <li style={{ marginBottom: '0.5rem' }}>Benennen Sie den Tag: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>CarBot Widget</code></li>
              <li>Wählen Sie <strong>"Benutzerdefiniertes HTML"</strong> als Tag-Typ</li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              B) HTML-Code einfügen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Kopieren Sie diesen Code in das HTML-Feld (ersetzen Sie <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>IHR_CLIENT_KEY</code> durch Ihren echten Key):
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`<script>
  // CarBot Widget via Google Tag Manager
  (function() {
    // Prüfen ob bereits geladen
    if (window.carbotLoaded) return;
    window.carbotLoaded = true;
    
    // Widget Script laden
    var script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', 'IHR_CLIENT_KEY');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-color', '#0070f3');
    script.async = true;
    
    // Script zum DOM hinzufügen
    document.head.appendChild(script);
    
    // GTM DataLayer Event senden
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'carbot_loaded',
      'carbot_client': 'IHR_CLIENT_KEY'
    });
  })();
</script>`)}
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
{`<script>
  // CarBot Widget via Google Tag Manager
  (function() {
    // Prüfen ob bereits geladen
    if (window.carbotLoaded) return;
    window.carbotLoaded = true;
    
    // Widget Script laden
    var script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', 'IHR_CLIENT_KEY');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-color', '#0070f3');
    script.async = true;
    
    // Script zum DOM hinzufügen
    document.head.appendChild(script);
    
    // GTM DataLayer Event senden
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'carbot_loaded',
      'carbot_client': 'IHR_CLIENT_KEY'
    });
  })();
</script>`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Step 3 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            3️⃣ Trigger konfigurieren
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Einfache Konfiguration (empfohlen)
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Wählen Sie <strong>"All Pages"</strong> als Trigger</li>
              <li style={{ marginBottom: '0.5rem' }}>Das Widget erscheint auf allen Seiten</li>
              <li>Ideal für Werkstatt-Websites</li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Erweiterte Konfiguration
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '0.75rem' }}>
              Für spezifische Seiten oder Bedingungen:
            </p>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Bestimmte Seiten:</strong> Page URL contains "service" OR "werkstatt"
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Nach Scroll:</strong> Scroll Depth 25%
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Zeitverzögerung:</strong> Timer nach 30 Sekunden
              </li>
              <li>
                <strong>Mobile Geräte:</strong> Device Category equals "mobile"
              </li>
            </ul>
          </div>
        </GlassCard>

        {/* Step 4 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            4️⃣ Erweiterte Optionen (optional)
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              A) GTM-Variablen verwenden
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Für dynamische Konfiguration erstellen Sie GTM-Variablen:
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
{`// Variable: carbot_client_key
{{carbot_client_key}} 

// Variable: carbot_position  
{{carbot_position}}

// Variable: carbot_color
{{carbot_color}}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              B) Event-Tracking aktivieren
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Fügen Sie diesen Code zum Widget-Script hinzu für erweiterte Analytics:
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
{`// Event-Listener für Chat-Interaktionen
window.addEventListener('message', function(event) {
  if (event.data.type === 'carbot_chat_opened') {
    dataLayer.push({
      'event': 'carbot_interaction',
      'carbot_action': 'chat_opened'
    });
  }
  
  if (event.data.type === 'carbot_lead_captured') {
    dataLayer.push({
      'event': 'carbot_conversion',
      'carbot_action': 'lead_captured',
      'lead_data': event.data.leadData
    });
  }
});`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Step 5 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            5️⃣ Testen und Veröffentlichen
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Vorschau-Modus
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Klicken Sie auf <strong>"Vorschau"</strong> in GTM</li>
              <li style={{ marginBottom: '0.5rem' }}>Öffnen Sie Ihre Website in einem neuen Tab</li>
              <li style={{ marginBottom: '0.5rem' }}>Prüfen Sie, ob das CarBot Widget erscheint</li>
              <li>Testen Sie eine Chat-Interaktion</li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Debugging
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '0.75rem' }}>
              Bei Problemen prüfen Sie:
            </p>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>GTM Debug Console auf Fehler</li>
              <li style={{ marginBottom: '0.5rem' }}>Netzwerk-Tab für Script-Laden</li>
              <li style={{ marginBottom: '0.5rem' }}>Console auf JavaScript-Fehler</li>
              <li>Client Key korrekt eingesetzt</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Veröffentlichen
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Klicken Sie auf <strong>"Senden"</strong></li>
              <li style={{ marginBottom: '0.5rem' }}>Geben Sie eine Versionsbeschreibung ein</li>
              <li style={{ marginBottom: '0.5rem' }}>Bestätigen Sie die Veröffentlichung</li>
              <li>CarBot ist jetzt live auf Ihrer Website!</li>
            </ol>
          </div>
        </GlassCard>

        {/* Analytics Integration */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            📊 Google Analytics Integration
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
            Verfolgen Sie CarBot-Interaktionen in Google Analytics:
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              GA4 Event-Tracking
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
{`// GA4 Event für Chat-Öffnung
gtag('event', 'carbot_chat_opened', {
  'event_category': 'CarBot',
  'event_label': 'Chat Widget',
  'value': 1
});

// GA4 Event für Lead-Erfassung
gtag('event', 'carbot_lead_captured', {
  'event_category': 'CarBot',
  'event_label': 'Lead Generation',
  'value': 10
});`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Troubleshooting */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔧 Häufige Probleme
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Widget erscheint nicht
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ GTM Container korrekt eingebunden</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Tag ist veröffentlicht (nicht nur Vorschau)</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Client Key ist korrekt</li>
              <li>✅ Keine JavaScript-Fehler in Console</li>
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Widget lädt mehrfach
            </h3>
            <p style={{ color: '#d1d5db' }}>
              Verwenden Sie die <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>window.carbotLoaded</code> 
              Prüfung wie im obigen Code gezeigt.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Events werden nicht getrackt
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Prüfen Sie dataLayer in Browser Console</li>
              <li style={{ marginBottom: '0.5rem' }}>Aktivieren Sie GTM Debug-Modus</li>
              <li>Verwenden Sie GA4 DebugView</li>
            </ul>
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎉 Geschafft!
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            CarBot ist jetzt über Google Tag Manager installiert. Nächste Schritte:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/docs/widget-customization">
              Widget anpassen
            </PrimaryButton>
            <SecondaryButton href="/docs/api-reference">
              API erkunden
            </SecondaryButton>
            <SecondaryButton href="/dashboard/analytics">
              Analytics ansehen
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
          <Link href="/docs/html-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← HTML Integration
          </Link>
          <Link href="/docs/shopify-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Shopify Integration →
          </Link>
        </div>
      </div>
    </SharedLayout>
  )
}