'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function TroubleshootingPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <SharedLayout title="Problemlösung" showNavigation={true}>
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
            <div style={{ fontSize: '3rem' }}>🔧</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                Problemlösung
              </h1>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Alle Level
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
            Lösungen für häufige Probleme mit dem CarBot Widget, API-Integration 
            und Chat-Funktionalität. Schritt-für-Schritt Debugging-Anleitung.
          </p>
        </div>

        {/* Quick Diagnostic */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#22c55e', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🩺 Schnelldiagnose
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
            Prüfen Sie diese Punkte zuerst:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px' }}>
              <div style={{ color: '#22c55e', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ✅ Client Key korrekt?
              </div>
              <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                Überprüfen Sie Ihren Client Key im Dashboard
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px' }}>
              <div style={{ color: '#22c55e', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ✅ JavaScript-Fehler?
              </div>
              <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                Browser Console öffnen (F12)
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px' }}>
              <div style={{ color: '#22c55e', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ✅ Internet-Verbindung?
              </div>
              <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                Können Sie andere Websites erreichen?
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Widget Issues */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔧 Widget-Probleme
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>
              ❌ Widget erscheint nicht
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Mögliche Ursachen:</h4>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>Falscher oder fehlender Client Key</li>
                <li style={{ marginBottom: '0.25rem' }}>Script nicht korrekt eingebunden</li>
                <li style={{ marginBottom: '0.25rem' }}>JavaScript-Fehler blockieren Ausführung</li>
                <li style={{ marginBottom: '0.25rem' }}>Content Security Policy (CSP) blockiert Script</li>
                <li>Ad-Blocker verhindert Laden</li>
              </ul>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Lösungsschritte:</h4>
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
{`// 1. Browser Console öffnen (F12)
// 2. Nach Fehlern suchen:

// Häufige Fehler:
"CarBot script failed to load" 
-> Netzwerkproblem oder CSP-Block

"Cannot read property 'CarBot' of undefined"
-> Script noch nicht geladen, Timing-Problem

"Invalid client key"
-> Client Key prüfen

// 3. Debug-Modus aktivieren:
<script>
  window.carbotDebug = true;
  // Dann normales CarBot Script laden
</script>

// 4. Script-Reihenfolge prüfen:
// CarBot MUSS nach jQuery/anderen Dependencies laden`}
                </pre>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>
              ⚠️ Widget lädt, aber Chat funktioniert nicht
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// Häufige Chat-Probleme diagnostizieren

// 1. API-Endpunkt testen
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Test' }],
    clientKey: 'ihr-client-key',
    hasConsent: true
  })
})
.then(res => res.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));

// 2. GDPR-Einstellungen prüfen
console.log('GDPR Consent:', localStorage.getItem('carbot-gdpr-consent'));

// 3. Network-Tab prüfen
// -> Fehlgeschlagene Requests zu carbot.de
// -> CORS-Fehler
// -> 401/403 Authentication-Fehler

// 4. Widget-Status prüfen
if (window.CarBot) {
  console.log('Widget Status:', {
    isLoaded: window.CarBot.isLoaded,
    isOpen: window.CarBot.isOpen(),
    config: window.CarBot.getConfig()
  });
}`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#f59e0b',
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
{`// Häufige Chat-Probleme diagnostizieren

// 1. API-Endpunkt testen
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Test' }],
    clientKey: 'ihr-client-key',
    hasConsent: true
  })
})
.then(res => res.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));

// 2. GDPR-Einstellungen prüfen
console.log('GDPR Consent:', localStorage.getItem('carbot-gdpr-consent'));

// 3. Network-Tab prüfen
// -> Fehlgeschlagene Requests zu carbot.de
// -> CORS-Fehler
// -> 401/403 Authentication-Fehler

// 4. Widget-Status prüfen
if (window.CarBot) {
  console.log('Widget Status:', {
    isLoaded: window.CarBot.isLoaded,
    isOpen: window.CarBot.isOpen(),
    config: window.CarBot.getConfig()
  });
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>
              🔄 Widget lädt mehrfach
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Problem: Das Widget wird mehrmals geladen oder flackert.
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
{`// Lösung: Single-Load Pattern verwenden
(function() {
  // Mehrfach-Laden verhindern
  if (window.carbotLoaded) return;
  window.carbotLoaded = true;
  
  var script = document.createElement('script');
  script.src = 'https://carbot.de/widget.js';
  script.setAttribute('data-client', 'ihr-client-key');
  script.async = true;
  document.head.appendChild(script);
})();

// Für React/Vue/Angular:
// useEffect/onMounted mit Dependency Array verwenden
useEffect(() => {
  // Widget laden
}, []); // Leeres Dependency Array!`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Integration Issues */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔌 Integrations-Probleme
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>
              🚫 CORS-Fehler
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              "Access to fetch at 'https://carbot.de' has been blocked by CORS policy"
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
{`// Problem: Lokaler file:// Zugriff
// Lösung: Lokalen Server verwenden

// Python
python -m http.server 8000
python3 -m http.server 8000

// Node.js
npx http-server
npx live-server

// PHP
php -S localhost:8000

// VS Code Live Server Extension

// Dann über http://localhost:8000 öffnen`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>
              🔒 Content Security Policy (CSP)
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              "Refused to load the script because it violates the following Content Security Policy directive"
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
{`<!-- CSP Header erweitern -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://carbot.de; 
               connect-src 'self' https://api.carbot.de;
               frame-src 'self' https://carbot.de;">

<!-- Nginx Konfiguration -->
add_header Content-Security-Policy "script-src 'self' https://carbot.de;";

<!-- Apache .htaccess -->
Header always set Content-Security-Policy "script-src 'self' https://carbot.de;"`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>
              📱 Mobile Darstellungsprobleme
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
{`/* Mobile CSS Fixes */
@media (max-width: 768px) {
  /* Widget zu groß auf Mobile */
  #carbot-widget-container {
    width: calc(100vw - 20px) !important;
    height: 80vh !important;
    bottom: 10px !important;
    right: 10px !important;
  }
  
  /* Widget überlappt mit Fixed Navigation */
  .has-fixed-nav #carbot-widget-container {
    bottom: 70px !important; /* Höhe der Navigation */
  }
  
  /* iOS Safari spezifische Fixes */
  @supports (-webkit-touch-callout: none) {
    #carbot-widget-container {
      bottom: calc(10px + env(safe-area-inset-bottom)) !important;
    }
  }
}

/* WordPress Admin Bar Konflikt */
.admin-bar #carbot-widget-container {
  bottom: 46px !important;
}

@media screen and (max-width: 782px) {
  .admin-bar #carbot-widget-container {
    bottom: 46px !important;
  }
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>
              ⚡ Performance-Probleme
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
{`// Lazy Loading implementieren
const loadCarBotLazy = () => {
  // Erst nach Benutzer-Interaktion laden
  const loadWidget = () => {
    const script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', 'ihr-client-key');
    script.async = true;
    document.head.appendChild(script);
  };
  
  // Nach Scroll-Event laden
  let scrolled = false;
  window.addEventListener('scroll', () => {
    if (!scrolled) {
      scrolled = true;
      setTimeout(loadWidget, 1000);
    }
  }, { once: true });
  
  // Oder nach 5 Sekunden
  setTimeout(loadWidget, 5000);
};

// Intersection Observer für bessere Performance
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadCarBotLazy();
      observer.disconnect();
    }
  });
});

// Beobachte Footer oder bestimmten Bereich
observer.observe(document.querySelector('.footer'));`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Platform Specific */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🌐 Plattform-spezifische Probleme
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#61dafb', fontSize: '1rem', marginBottom: '0.5rem' }}>
              ⚛️ React/Next.js
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
{`// Problem: "window is not defined" (SSR)
// Lösung: Client-side Only Loading
useEffect(() => {
  if (typeof window !== 'undefined') {
    // CarBot laden
  }
}, []);

// Next.js Dynamic Import
import dynamic from 'next/dynamic';

const CarBotWidget = dynamic(
  () => import('../components/CarBotWidget'),
  { ssr: false }
);

// Problem: Widget lädt bei Route-Wechsel neu
// Lösung: Global State oder Persistent Component
const [widgetLoaded, setWidgetLoaded] = useState(false);

useEffect(() => {
  if (!widgetLoaded) {
    // CarBot laden
    setWidgetLoaded(true);
  }
}, [widgetLoaded]);`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#4fc08d', fontSize: '1rem', marginBottom: '0.5rem' }}>
              💚 Vue.js/Nuxt.js
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
{`// Problem: Plugin wird bei Navigation neu geladen  
// Lösung: Nuxt.js Plugin erstellen

// plugins/carbot.client.js
export default ({ app }) => {
  if (process.client && !window.carbotLoaded) {
    window.carbotLoaded = true;
    
    const script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', process.env.CARBOT_CLIENT_KEY);
    script.async = true;
    document.head.appendChild(script);
  }
};

// nuxt.config.js
export default {
  plugins: [
    { src: '~/plugins/carbot.client.js', mode: 'client' }
  ]
};`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#0073aa', fontSize: '1rem', marginBottom: '0.5rem' }}>
              📝 WordPress
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
{`// Problem: Widget erscheint nicht nach Plugin-Update
// Lösung: Cache leeren und Plugin-Konflikte prüfen

// 1. Cache leeren (WP Rocket, W3 Total Cache)
// 2. Plugin-Konflikte testen
wp plugin deactivate --all
wp plugin activate carbot-widget

// Problem: jQuery-Konflikt
// Lösung: No-Conflict Mode
jQuery(document).ready(function($) {
  // CarBot Code hier
});

// Problem: Theme überschreibt Styling
// Lösung: Höhere CSS-Spezifität
.carbot-widget-container {
  z-index: 999999 !important;
  position: fixed !important;
}

// functions.php Debug-Code
add_action('wp_footer', function() {
  if (current_user_can('manage_options')) {
    echo '<script>console.log("CarBot Debug:", window.CarBot);</script>';
  }
});`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>
              🛒 Shopify
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
{`// Problem: Widget erscheint nur auf bestimmten Seiten
// Ursache: Theme-spezifische template.liquid Dateien

// Lösung: In theme.liquid einbauen (global)
// Oder conditional loading:
{% unless template contains 'checkout' %}
  <!-- CarBot Code -->
{% endunless %}

// Problem: Liquid-Variablen funktionieren nicht
// Ursache: Liquid wird serverseitig verarbeitet
// Lösung: JavaScript-Variablen verwenden

<script>
  window.shopifyData = {
    shop: '{{ shop.permanent_domain }}',
    currency: '{{ cart.currency.iso_code }}',
    customer: {% if customer %}true{% else %}false{% endif %}
  };
</script>

// Problem: AJAX-Cart Konflikt
// Lösung: Event-Listener für Cart-Updates
document.addEventListener('cart:updated', function() {
  if (window.CarBot) {
    window.CarBot.updateContext(window.shopifyData);
  }
});`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* API Issues */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔌 API-Probleme
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>
              🚨 Häufige API-Fehler
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem'
            }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid #ef4444' }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  401 Unauthorized
                </div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Client Key ist ungültig oder fehlt
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                  Lösung: Client Key im Dashboard überprüfen
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid #ef4444' }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  403 GDPR Consent Required
                </div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  DSGVO-Einwilligung fehlt
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                  Lösung: hasConsent: true in API-Call setzen
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '8px', border: '1px solid #fb923c' }}>
                <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  429 Rate Limited
                </div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Zu viele API-Anfragen
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                  Lösung: Request-Rate reduzieren, Retry-Logic implementieren
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>
              🔍 API-Debugging
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// API-Debugging Script
const debugCarBotAPI = async () => {
  const clientKey = 'ihr-client-key';
  const baseURL = 'https://api.carbot.de/v1';
  
  console.log('🔍 CarBot API Debug');
  console.log('Client Key:', clientKey);
  
  // Test 1: Chat API
  try {
    const chatResponse = await fetch(\`\${baseURL}/api/chat\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Key': clientKey
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test' }],
        clientKey: clientKey,
        hasConsent: true
      })
    });
    
    console.log('✅ Chat API Status:', chatResponse.status);
    
    if (!chatResponse.ok) {
      const error = await chatResponse.json();
      console.error('❌ Chat API Error:', error);
    } else {
      const data = await chatResponse.json();
      console.log('✅ Chat API Response:', data);
    }
  } catch (error) {
    console.error('❌ Chat API Network Error:', error);
  }
  
  // Test 2: Configuration API
  try {
    const configResponse = await fetch(\`\${baseURL}/api/config?clientKey=\${clientKey}\`);
    console.log('✅ Config API Status:', configResponse.status);
    
    if (configResponse.ok) {
      const config = await configResponse.json();
      console.log('✅ Config:', config);
    }
  } catch (error) {
    console.error('❌ Config API Error:', error);
  }
  
  // Test 3: Widget-Status
  if (window.CarBot) {
    console.log('✅ Widget Status:', {
      loaded: true,
      isOpen: window.CarBot.isOpen(),
      version: window.CarBot.version
    });
  } else {
    console.warn('⚠️ Widget nicht geladen');
  }
};

// Debug ausführen
debugCarBotAPI();`)}
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
{`// API-Debugging Script
const debugCarBotAPI = async () => {
  const clientKey = 'ihr-client-key';
  const baseURL = 'https://api.carbot.de/v1';
  
  console.log('🔍 CarBot API Debug');
  console.log('Client Key:', clientKey);
  
  // Test 1: Chat API
  try {
    const chatResponse = await fetch(\`\${baseURL}/api/chat\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Key': clientKey
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test' }],
        clientKey: clientKey,
        hasConsent: true
      })
    });
    
    console.log('✅ Chat API Status:', chatResponse.status);
    
    if (!chatResponse.ok) {
      const error = await chatResponse.json();
      console.error('❌ Chat API Error:', error);
    } else {
      const data = await chatResponse.json();
      console.log('✅ Chat API Response:', data);
    }
  } catch (error) {
    console.error('❌ Chat API Network Error:', error);
  }
  
  // Test 2: Configuration API
  try {
    const configResponse = await fetch(\`\${baseURL}/api/config?clientKey=\${clientKey}\`);
    console.log('✅ Config API Status:', configResponse.status);
    
    if (configResponse.ok) {
      const config = await configResponse.json();
      console.log('✅ Config:', config);
    }
  } catch (error) {
    console.error('❌ Config API Error:', error);
  }
  
  // Test 3: Widget-Status
  if (window.CarBot) {
    console.log('✅ Widget Status:', {
      loaded: true,
      isOpen: window.CarBot.isOpen(),
      version: window.CarBot.version
    });
  } else {
    console.warn('⚠️ Widget nicht geladen');
  }
};

// Debug ausführen
debugCarBotAPI();`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Support */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#3b82f6', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🆘 Support kontaktieren
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            Wenn die obigen Lösungen nicht helfen, kontaktieren Sie unseren Support:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>E-Mail Support</h3>
              <a href="mailto:support@carbot.de" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                support@carbot.de
              </a>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Live Chat</h3>
              <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Direkt auf carbot.de</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Dokumentation</h3>
              <Link href="/docs" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Alle Guides
              </Link>
            </div>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Support-Anfrage vorbereiten:
            </h4>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>Client Key (falls vorhanden)</li>
              <li style={{ marginBottom: '0.25rem' }}>URL der betroffenen Website</li>
              <li style={{ marginBottom: '0.25rem' }}>Browser und Version</li>
              <li style={{ marginBottom: '0.25rem' }}>Screenshots von Fehlern</li>
              <li style={{ marginBottom: '0.25rem' }}>JavaScript Console Logs</li>
              <li>Beschreibung der Schritte zur Reproduktion</li>
            </ul>
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            ✅ Problem gelöst?
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            Weitere Ressourcen zur Optimierung Ihrer CarBot-Integration:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/docs/widget-customization">
              Widget anpassen
            </PrimaryButton>
            <SecondaryButton href="/docs/api-reference">
              API Dokumentation
            </SecondaryButton>
            <SecondaryButton href="/dashboard/analytics">
              Performance analysieren
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
          <Link href="/docs/api-reference" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← API Referenz
          </Link>
          <Link href="/docs/gdpr-compliance" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            DSGVO Compliance →
          </Link>
        </div>
      </div>
    </SharedLayout>
  )
}