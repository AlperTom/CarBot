'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function ShopifyIntegrationPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <SharedLayout title="Shopify Integration" showNavigation={true}>
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
            <div style={{ fontSize: '3rem' }}>🛒</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                Shopify Integration
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
                  🕐 20 Minuten
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
            Integrieren Sie CarBot in Ihren Shopify-Shop für besseren Kundensupport und 
            höhere Konversionsraten bei Autoteilen und Zubehör.
          </p>
        </div>

        {/* Why Shopify + CarBot */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🚗 Warum CarBot für Shopify?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Live Support</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Beratung zu Autoteilen in Echtzeit
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛠️</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Technische Hilfe</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Einbau-Unterstützung und Kompatibilität
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Mehr Verkäufe</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Weniger Kaufabbrüche durch Beratung
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Method Selection */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎯 Installationsmethode wählen
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '8px',
              padding: '1rem',
              background: 'rgba(34, 197, 94, 0.1)'
            }}>
              <h3 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>
                ✅ Empfohlen: Theme-Code
              </h3>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Permanente Installation</li>
                <li>Keine App-Kosten</li>
                <li>Vollständige Kontrolle</li>
                <li>5 Minuten Setup</li>
              </ul>
            </div>
            <div style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
                💰 Alternative: Shopify App
              </h3>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Einfache Installation</li>
                <li>Monatliche App-Gebühren</li>
                <li>Weniger Flexibilität</li>
                <li>GUI-basiert</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Method 1: Theme Code */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            1️⃣ Methode 1: Theme-Code Integration (Empfohlen)
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 1: Client Key kopieren
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Holen Sie sich Ihren CarBot Client Key aus dem Dashboard:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <code style={{ color: '#22c55e' }}>
                Beispiel: autoteile-shop-hamburg-xyz789
              </code>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 2: Theme bearbeiten
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Shopify Admin → <strong>Online Store</strong> → <strong>Themes</strong>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Bei Ihrem aktiven Theme: <strong>Actions</strong> → <strong>Edit code</strong>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Öffnen Sie <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>theme.liquid</code>
              </li>
              <li>
                Suchen Sie nach dem schließenden <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>&lt;/body&gt;</code> Tag
              </li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 3: CarBot Code einfügen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Fügen Sie diesen Code direkt vor <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>&lt;/body&gt;</code> ein:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`<!-- CarBot Widget für Shopify -->
<script>
  // CarBot Konfiguration für Autoteile-Shop
  (function() {
    var script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', 'IHR_CLIENT_KEY');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-color', '#{{ settings.accent_color | remove: '#' }}');
    script.async = true;
    
    // Shopify-spezifische Konfiguration
    script.setAttribute('data-shop', '{{ shop.permanent_domain }}');
    script.setAttribute('data-currency', '{{ cart.currency.iso_code }}');
    script.setAttribute('data-language', '{{ localization.language.iso_code }}');
    
    document.head.appendChild(script);
    
    // Analytics Integration
    if (typeof gtag !== 'undefined') {
      gtag('event', 'carbot_loaded', {
        'event_category': 'CarBot',
        'event_label': 'Shopify Integration'
      });
    }
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
{`<!-- CarBot Widget für Shopify -->
<script>
  // CarBot Konfiguration für Autoteile-Shop
  (function() {
    var script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', 'IHR_CLIENT_KEY');
    script.setAttribute('data-position', 'bottom-right');
    script.setAttribute('data-color', '#{{ settings.accent_color | remove: '#' }}');
    script.async = true;
    
    // Shopify-spezifische Konfiguration
    script.setAttribute('data-shop', '{{ shop.permanent_domain }}');
    script.setAttribute('data-currency', '{{ cart.currency.iso_code }}');
    script.setAttribute('data-language', '{{ localization.language.iso_code }}');
    
    document.head.appendChild(script);
    
    // Analytics Integration
    if (typeof gtag !== 'undefined') {
      gtag('event', 'carbot_loaded', {
        'event_category': 'CarBot',
        'event_label': 'Shopify Integration'
      });
    }
  })();
</script>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 4: Speichern und testen
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Klicken Sie <strong>"Save"</strong></li>
              <li style={{ marginBottom: '0.5rem' }}>Öffnen Sie Ihren Shop im neuen Tab</li>
              <li style={{ marginBottom: '0.5rem' }}>Das CarBot Widget sollte unten rechts erscheinen</li>
              <li>Testen Sie eine Chat-Interaktion</li>
            </ol>
          </div>
        </GlassCard>

        {/* Conditional Display */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            2️⃣ Erweitert: Bedingte Anzeige
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Nur auf bestimmten Seiten anzeigen
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
{`{% comment %} CarBot nur auf Produkt- und Sammlungsseiten {% endcomment %}
{% if template contains 'product' or template contains 'collection' %}
  <!-- CarBot Widget Code hier -->
{% endif %}

{% comment %} CarBot NICHT auf Checkout-Seiten {% endcomment %}
{% unless template contains 'checkout' %}
  <!-- CarBot Widget Code hier -->
{% endunless %}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Basierend auf Produktkategorien
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
{`{% comment %} Nur bei Auto-/Motorradteilen {% endcomment %}
{% assign auto_tags = 'auto,motorrad,ersatzteile,zubehör' | split: ',' %}
{% assign show_carbot = false %}

{% for tag in product.tags %}
  {% if auto_tags contains tag %}
    {% assign show_carbot = true %}
    {% break %}
  {% endif %}
{% endfor %}

{% if show_carbot %}
  <!-- CarBot Widget Code hier -->
{% endif %}`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Product Integration */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            3️⃣ Produktspezifische Integration
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Produktdaten an CarBot übermitteln
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Für bessere Beratung bei Autoteilen:
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
{`<script>
  // Produktkontext für CarBot
  window.carbotContext = {
    {% if template contains 'product' %}
    product: {
      title: "{{ product.title | escape }}",
      type: "{{ product.type | escape }}",
      vendor: "{{ product.vendor | escape }}",
      price: "{{ product.price | money }}",
      tags: {{ product.tags | json }},
      sku: "{{ product.selected_variant.sku | escape }}",
      available: {{ product.available }},
      url: "{{ shop.url }}{{ product.url }}"
    },
    {% endif %}
    
    customer: {
      {% if customer %}
      logged_in: true,
      first_name: "{{ customer.first_name | escape }}",
      orders_count: {{ customer.orders_count }}
      {% else %}
      logged_in: false
      {% endif %}
    },
    
    cart: {
      item_count: {{ cart.item_count }},
      total_price: "{{ cart.total_price | money }}",
      currency: "{{ cart.currency.iso_code }}"
    }
  };
</script>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Kompatibilitäts-Button
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Zusätzlicher Button auf Produktseiten für Kompatibilitätsfragen:
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
{`{% comment %} In product-form.liquid oder product.liquid {% endcomment %}
<button type="button" onclick="openCarBotWithProduct()" 
        class="btn btn-secondary" 
        style="margin-top: 1rem;">
  🔧 Passt das zu meinem Fahrzeug?
</button>

<script>
  function openCarBotWithProduct() {
    // CarBot öffnen mit Produktkontext
    if (window.CarBot) {
      window.CarBot.open();
      window.CarBot.sendMessage(
        'Hallo! Ich interessiere mich für: {{ product.title | escape }}. ' +
        'Passt das zu meinem Fahrzeug?'
      );
    }
  }
</script>`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Styling */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            4️⃣ Design-Anpassung
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Theme-Farben verwenden
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
{`// Primärfarbe aus Theme-Einstellungen
data-color: '#{{ settings.accent_color | remove: '#' }}'

// Alternative: CSS-Variablen
data-color: 'var(--color-accent)'

// Hintergrundfarbe für Chat
data-bg-color: '#{{ settings.background_color | remove: '#' }}'`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Mobile Optimierung
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
{`<style>
  /* CarBot Mobile Anpassungen */
  @media (max-width: 768px) {
    #carbot-widget-container {
      bottom: 80px !important; /* Platz für mobile Navigation */
    }
  }
  
  /* CarBot in Shopify Dawn Theme */
  .shopify-section--header.is-sticky ~ #carbot-widget-container {
    bottom: 70px;
  }
</style>`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Analytics */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            5️⃣ Shopify Analytics Integration
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Conversion Tracking
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
{`// CarBot Events an Shopify Analytics senden
window.addEventListener('message', function(event) {
  if (event.data.type === 'carbot_lead_captured') {
    // Shopify Analytics
    if (typeof analytics !== 'undefined') {
      analytics.track('CarBot Lead Captured', {
        product: window.carbotContext?.product?.title,
        value: window.carbotContext?.product?.price
      });
    }
    
    // Google Analytics (falls vorhanden)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', {
        'event_category': 'CarBot',
        'event_label': 'Product Inquiry',
        'value': 1
      });
    }
  }
});`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Testing */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            6️⃣ Testen und Optimieren
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Testszenarien
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Produktseite:</strong> "Passt diese Bremsscheibe zu meinem BMW 320i?"
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Kategorieseite:</strong> "Welches Motoröl brauche ich für meinen Diesel?"
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Warenkorb:</strong> "Kann ich diese Teile selbst einbauen?"
              </li>
              <li>
                <strong>Mobile:</strong> Chat-Bedienung auf Smartphone testen
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Performance-Optimierung
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Widget lädt asynchron - keine Auswirkung auf Seitengeschwindigkeit</li>
              <li style={{ marginBottom: '0.5rem' }}>Lazy Loading nach 3 Sekunden für bessere Core Web Vitals</li>
              <li style={{ marginBottom: '0.5rem' }}>Minimale JavaScript-Größe (13KB komprimiert)</li>
              <li>CDN-Auslieferung für schnelle Ladezeiten</li>
            </ul>
          </div>
        </GlassCard>

        {/* Success Story */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <h2 style={{ color: '#22c55e', marginBottom: '1rem', fontSize: '1.25rem' }}>
            📈 Erfolgsgeschichte
          </h2>
          <blockquote style={{ 
            color: '#d1d5db',
            fontSize: '1rem',
            fontStyle: 'italic',
            margin: '0 0 1rem 0',
            paddingLeft: '1rem',
            borderLeft: '3px solid #22c55e'
          }}>
            "Nach der CarBot-Integration haben wir 40% weniger Produktfragen per E-Mail und 25% mehr Verkäufe 
            bei technischen Autoteilen. Kunden bekommen sofort Antworten auf Kompatibilitätsfragen."
          </blockquote>
          <div style={{ color: '#22c55e', fontSize: '0.875rem' }}>
            — AutoTechnik Hamburg, Shopify-Shop mit 15.000+ Produkten
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎉 Installation abgeschlossen!
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            CarBot ist jetzt in Ihrem Shopify-Shop aktiv. Optimieren Sie die Erfahrung weiter:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/docs/widget-customization">
              Design anpassen
            </PrimaryButton>
            <SecondaryButton href="/docs/chat-personalization">
              Chat personalisieren
            </SecondaryButton>
            <SecondaryButton href="/dashboard/analytics">
              Erfolg messen
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
          <Link href="/docs/gtm-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← Google Tag Manager
          </Link>
          <Link href="/docs/wordpress-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            WordPress Integration →
          </Link>
        </div>
      </div>
    </SharedLayout>
  )
}