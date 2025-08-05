'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function HTMLIntegrationPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <SharedLayout title="HTML/JavaScript Integration" showNavigation={true}>
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
            <div style={{ fontSize: '3rem' }}>💻</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                HTML/JavaScript Integration
              </h1>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{
                  background: '#22c55e',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Anfänger
                </span>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  🕐 10 Minuten
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
            Direkter Code-Einbau für statische Websites, HTML-Seiten und 
            selbst entwickelte Anwendungen. Einfachste Integrationsmethode.
          </p>
        </div>

        {/* Quick Start */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#22c55e', marginBottom: '1rem', fontSize: '1.25rem' }}>
            ⚡ Schnellstart (3 Minuten)
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
            Kopieren Sie diesen Code und fügen Sie ihn vor dem schließenden <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>&lt;/body&gt;</code> Tag ein:
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
  (function() {
    var script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', 'IHR_CLIENT_KEY');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-color', '#0070f3');
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`)}
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
{`<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', 'IHR_CLIENT_KEY');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-color', '#0070f3');
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`}
            </pre>
          </div>
          <p style={{ color: '#22c55e', marginTop: '1rem', fontSize: '0.875rem' }}>
            ✅ Ersetzen Sie <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>IHR_CLIENT_KEY</code> durch Ihren echten Client Key aus dem Dashboard!
          </p>
        </GlassCard>

        {/* Step by Step */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            📋 Schritt-für-Schritt Anleitung
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 1: Client Key besorgen
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Registrieren Sie sich bei <Link href="/auth/register" style={{ color: '#fb923c' }}>CarBot</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>Gehen Sie zu Dashboard → Client Keys</li>
              <li style={{ marginBottom: '0.5rem' }}>Kopieren Sie Ihren Client Key</li>
              <li>Beispiel: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>kfz-service-hamburg-abc123</code></li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 2: HTML-Datei öffnen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '0.5rem' }}>
              Öffnen Sie Ihre HTML-Datei in einem Texteditor:
            </p>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Visual Studio Code, Sublime Text, Notepad++</li>
              <li style={{ marginBottom: '0.5rem' }}>Oder Online-Editor (CodePen, JSFiddle)</li>
              <li>Oder direkt im Browser DevTools</li>
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 3: Code einfügen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Fügen Sie den CarBot-Code direkt vor dem schließenden <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>&lt;/body&gt;</code> Tag ein:
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
{`<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Meine Autowerkstatt</title>
</head>
<body>
    <!-- Ihr Website-Inhalt hier -->
    <h1>Willkommen bei KFZ-Service Hamburg</h1>
    
    <!-- CarBot Widget Code - VOR </body> -->
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = 'https://carbot.de/widget.js';
        script.setAttribute('data-client', 'IHR_CLIENT_KEY');
        script.setAttribute('data-position', 'bottom-right');
        script.setAttribute('data-color', '#0070f3');
        script.async = true;
        document.head.appendChild(script);
      })();
    </script>
</body>
</html>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 4: Testen
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Speichern Sie die HTML-Datei</li>
              <li style={{ marginBottom: '0.5rem' }}>Öffnen Sie sie im Browser</li>
              <li style={{ marginBottom: '0.5rem' }}>Das CarBot Widget sollte unten rechts erscheinen</li>
              <li>Testen Sie eine Chat-Nachricht</li>
            </ol>
          </div>
        </GlassCard>

        {/* Configuration Options */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            ⚙️ Konfigurationsoptionen
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Grundlegende Optionen
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
{`script.setAttribute('data-client', 'ihr-client-key');     // Erforderlich
script.setAttribute('data-position', 'bottom-right');      // Position
script.setAttribute('data-color', '#ff6b35');              // Hauptfarbe
script.setAttribute('data-greeting', 'Hallo! Wie kann ich helfen?'); // Begrüßung
script.setAttribute('data-offline', 'false');              // Offline-Modus
script.setAttribute('data-sound', 'true');                 // Sound aktivieren`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Position & Größe
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <code style={{ color: '#22c55e' }}>bottom-right</code>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.25rem' }}>Standard</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <code style={{ color: '#f59e0b' }}>bottom-left</code>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.25rem' }}>Links unten</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <code style={{ color: '#ef4444' }}>top-right</code>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.25rem' }}>Rechts oben</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <code style={{ color: '#8b5cf6' }}>center</code>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.25rem' }}>Zentriert</div>
              </div>
            </div>
            <p style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
              Beispiel: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>script.setAttribute('data-position', 'bottom-left');</code>
            </p>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Erweiterte Optionen
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
{`// Sprache festlegen
script.setAttribute('data-language', 'de'); // de, en, tr, pl

// Custom CSS
script.setAttribute('data-theme', 'dark'); // light, dark, auto

// Minimiert starten
script.setAttribute('data-minimized', 'true');

// Custom Container (für Inline-Einbettung)
script.setAttribute('data-container', 'chat-container-id');

// Trigger Events
script.setAttribute('data-auto-open', '5000'); // Nach 5 Sekunden öffnen
script.setAttribute('data-trigger-scroll', '50'); // Bei 50% Scroll`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Inline Embedding */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            📦 Inline-Einbettung (Chat in Seite)
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Chat-Bereich erstellen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Für einen festen Chat-Bereich in Ihrer Seite:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Kontakt - KFZ Service</title>
    <style>
        .chat-section {
            width: 100%;
            max-width: 800px;
            height: 500px;
            margin: 2rem auto;
            border: 1px solid #ddd;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <h1>Kontaktieren Sie uns</h1>
    <p>Stellen Sie uns Ihre Fragen direkt über den Chat:</p>
    
    <!-- Chat Container -->
    <div id="carbot-inline-chat" class="chat-section"></div>
    
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = 'https://carbot.de/widget.js';
        script.setAttribute('data-client', 'IHR_CLIENT_KEY');
        script.setAttribute('data-container', 'carbot-inline-chat');
        script.setAttribute('data-color', '#0070f3');
        script.async = true;
        document.head.appendChild(script);
      })();
    </script>
</body>
</html>`)}
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
{`<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Kontakt - KFZ Service</title>
    <style>
        .chat-section {
            width: 100%;
            max-width: 800px;
            height: 500px;
            margin: 2rem auto;
            border: 1px solid #ddd;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <h1>Kontaktieren Sie uns</h1>
    <p>Stellen Sie uns Ihre Fragen direkt über den Chat:</p>
    
    <!-- Chat Container -->
    <div id="carbot-inline-chat" class="chat-section"></div>
    
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = 'https://carbot.de/widget.js';
        script.setAttribute('data-client', 'IHR_CLIENT_KEY');
        script.setAttribute('data-container', 'carbot-inline-chat');
        script.setAttribute('data-color', '#0070f3');
        script.async = true;
        document.head.appendChild(script);
      })();
    </script>
</body>
</html>`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* JavaScript API */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔧 JavaScript API
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Programmatische Steuerung
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Nach dem Laden können Sie CarBot über JavaScript steuern:
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
{`// Chat öffnen/schließen
window.CarBot.open();
window.CarBot.close();
window.CarBot.toggle();

// Nachricht senden
window.CarBot.sendMessage('Hallo, ich brauche einen Termin');

// Event Listener
window.addEventListener('carbot:loaded', function() {
    console.log('CarBot ist bereit!');
});

window.addEventListener('carbot:message', function(event) {
    console.log('Neue Nachricht:', event.detail);
});

window.addEventListener('carbot:lead_captured', function(event) {
    console.log('Lead erfasst:', event.detail);
    // Analytics tracken
    gtag('event', 'lead_generation', {
        'event_category': 'CarBot',
        'value': 1
    });
});`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Custom Trigger Buttons
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
{`<!-- Custom Buttons in HTML -->
<button onclick="window.CarBot.open()">
    💬 Chat starten
</button>

<button onclick="window.CarBot.sendMessage('Ich brauche einen Kostenvoranschlag')">
    💰 Kostenvoranschlag anfordern
</button>

<button onclick="window.CarBot.sendMessage('Wann haben Sie einen Termin frei?')">
    📅 Termin buchen
</button>

<!-- Mit Auto-Kontextinformationen -->
<button onclick="startCarChat()">
    🚗 Fahrzeugberatung
</button>

<script>
function startCarChat() {
    const carModel = document.getElementById('car-model').value;
    const message = \`Hallo! Ich habe einen \${carModel} und brauche Beratung.\`;
    window.CarBot.sendMessage(message);
    window.CarBot.open();
}
</script>`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Advanced Integration */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🚀 Erweiterte Integration
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Formular-Integration
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Übertragen Sie Formulardaten automatisch an CarBot:
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
{`<!-- Kontaktformular -->
<form id="contact-form">
    <input type="text" id="name" placeholder="Ihr Name" required>
    <input type="text" id="car-model" placeholder="Fahrzeugmodell">
    <textarea id="issue" placeholder="Ihr Anliegen" required></textarea>
    <button type="submit">Anfrage per Chat senden</button>
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const carModel = document.getElementById('car-model').value;
    const issue = document.getElementById('issue').value;
    
    const message = \`Hallo! Ich bin \${name}. 
Fahrzeug: \${carModel}
Anliegen: \${issue}
Bitte kontaktieren Sie mich für einen Termin.\`;
    
    window.CarBot.sendMessage(message);
    window.CarBot.open();
    
    // Form zurücksetzen
    this.reset();
});
</script>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Analytics & Tracking
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
{`// Google Analytics 4 Integration
window.addEventListener('carbot:loaded', function() {
    gtag('event', 'carbot_widget_loaded', {
        'event_category': 'CarBot',
        'event_label': 'Widget Ready'
    });
});

window.addEventListener('carbot:chat_opened', function() {
    gtag('event', 'carbot_chat_opened', {
        'event_category': 'Engagement',
        'event_label': 'Chat Started'
    });
});

window.addEventListener('carbot:lead_captured', function(event) {
    gtag('event', 'generate_lead', {
        'event_category': 'Conversion',
        'event_label': 'CarBot Lead',
        'value': 10
    });
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            source: 'CarBot',
            content_name: 'Chat Lead'
        });
    }
});`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Troubleshooting */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔧 Problemlösung
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Widget lädt nicht
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ Client Key korrekt eingefügt</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Script vor <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>&lt;/body&gt;</code> eingefügt</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Keine JavaScript-Fehler in Browser Console</li>
              <li>✅ Internet-Verbindung aktiv</li>
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Debug-Modus aktivieren
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
{`// Debug-Informationen anzeigen
script.setAttribute('data-debug', 'true');

// Browser Console öffnen (F12)
// Suchen Sie nach CarBot-Meldungen
console.log('CarBot Debug aktiviert');`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              CORS-Probleme
            </h3>
            <p style={{ color: '#d1d5db' }}>
              Bei lokaler Entwicklung (file:// URLs) können CORS-Probleme auftreten. 
              Verwenden Sie einen lokalen Server:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '0.5rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000

# Live Server Extension (VS Code)`}
              </pre>
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
            🎉 Integration erfolgreich!
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            CarBot ist jetzt auf Ihrer Website aktiv. Erweitern Sie die Funktionalität:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/docs/widget-customization">
              Widget anpassen
            </PrimaryButton>
            <SecondaryButton href="/docs/api-reference">
              JavaScript API
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
          <Link href="/docs/wordpress-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← WordPress Integration
          </Link>
          <Link href="/docs/gtm-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Google Tag Manager →
          </Link>
        </div>
      </div>
    </SharedLayout>
  )
}