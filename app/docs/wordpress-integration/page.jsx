'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function WordPressIntegrationPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <SharedLayout title="WordPress Integration" showNavigation={true}>
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
            <div style={{ fontSize: '3rem' }}>📝</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                WordPress Integration
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
            Integrieren Sie CarBot in Ihre WordPress-Website für Werkstatt- und Autoservice-Seiten.
            Plugin oder manueller Code-Einbau möglich.
          </p>
        </div>

        {/* Why WordPress + CarBot */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🚗 Warum CarBot für WordPress?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Werkstatt-KI</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Speziell für Autowerkstätten trainiert
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📞</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Lead-Erfassung</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Automatische Terminbuchung möglich
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Schnell & Einfach</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Installation in unter 10 Minuten
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
                ✅ Empfohlen: Plugin (Coming Soon)
              </h3>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Ein-Klick Installation</li>
                <li>Automatische Updates</li>
                <li>WordPress Dashboard Integration</li>
                <li>DSGVO-konform</li>
              </ul>
            </div>
            <div style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
                💻 Manueller Code-Einbau
              </h3>
              <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Vollständige Kontrolle</li>
                <li>Funktioniert sofort</li>
                <li>Keine Plugin-Abhängigkeiten</li>
                <li>Theme-unabhängig</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Method 1: Manual Code */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            1️⃣ Methode 1: Manueller Code-Einbau (Verfügbar jetzt)
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 1: Client Key besorgen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Registrieren Sie sich bei CarBot und holen Sie sich Ihren Client Key:
            </p>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Gehen Sie zu <Link href="/auth/register" style={{ color: '#fb923c' }}>CarBot Registrierung</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>Erstellen Sie ein kostenloses Konto</li>
              <li style={{ marginBottom: '0.5rem' }}>Kopieren Sie Ihren Client Key aus dem Dashboard</li>
              <li>Beispiel: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>autowerkstatt-muenchen-xyz123</code></li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 2: WordPress Admin öffnen
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Melden Sie sich in Ihrem WordPress Admin-Bereich an</li>
              <li style={{ marginBottom: '0.5rem' }}>Gehen Sie zu <strong>Design</strong> → <strong>Theme-Editor</strong></li>
              <li style={{ marginBottom: '0.5rem' }}>Oder verwenden Sie <strong>Plugins</strong> → <strong>Editor</strong></li>
              <li>Alternative: FTP/cPanel File Manager verwenden</li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 3: Code einfügen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Fügen Sie diesen Code in Ihre <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>functions.php</code> oder direkt vor <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>&lt;/body&gt;</code> in <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>footer.php</code> ein:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`<?php
// CarBot Widget für WordPress
function add_carbot_widget() {
    ?>
    <!-- CarBot Chat Widget -->
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = 'https://carbot.de/widget.js';
        script.setAttribute('data-client', 'IHR_CLIENT_KEY');
        script.setAttribute('data-position', 'bottom-right');
        script.setAttribute('data-color', '#0073aa'); // WordPress Blau
        script.async = true;
        
        // WordPress-spezifische Konfiguration
        script.setAttribute('data-wp-site', '<?php echo esc_url(home_url()); ?>');
        script.setAttribute('data-wp-language', '<?php echo get_locale(); ?>');
        
        document.head.appendChild(script);
        
        // Google Analytics Integration (falls vorhanden)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'carbot_loaded', {
            'event_category': 'CarBot',
            'event_label': 'WordPress Integration'
          });
        }
      })();
    </script>
    <?php
}
add_action('wp_footer', 'add_carbot_widget');
?>`)}
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
{`<?php
// CarBot Widget für WordPress
function add_carbot_widget() {
    ?>
    <!-- CarBot Chat Widget -->
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = 'https://carbot.de/widget.js';
        script.setAttribute('data-client', 'IHR_CLIENT_KEY');
        script.setAttribute('data-position', 'bottom-right');
        script.setAttribute('data-color', '#0073aa'); // WordPress Blau
        script.async = true;
        
        // WordPress-spezifische Konfiguration
        script.setAttribute('data-wp-site', '<?php echo esc_url(home_url()); ?>');
        script.setAttribute('data-wp-language', '<?php echo get_locale(); ?>');
        
        document.head.appendChild(script);
        
        // Google Analytics Integration (falls vorhanden)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'carbot_loaded', {
            'event_category': 'CarBot',
            'event_label': 'WordPress Integration'
          });
        }
      })();
    </script>
    <?php
}
add_action('wp_footer', 'add_carbot_widget');
?>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schritt 4: Testen
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Speichern Sie die Änderungen</li>
              <li style={{ marginBottom: '0.5rem' }}>Öffnen Sie Ihre Website im neuen Tab</li>
              <li style={{ marginBottom: '0.5rem' }}>Das CarBot Widget sollte unten rechts erscheinen</li>
              <li>Testen Sie eine Chat-Nachricht</li>
            </ol>
          </div>
        </GlassCard>

        {/* WordPress Hooks */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            2️⃣ Erweitert: WordPress Hooks nutzen
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
{`// Nur auf Service-Seiten anzeigen
function add_carbot_widget_conditional() {
    // Nur auf bestimmten Seiten/Posts
    if (is_page(['service', 'werkstatt', 'reparatur']) || 
        is_single() && has_category('autowerkstatt')) {
        add_carbot_widget();
    }
    
    // NICHT auf Admin-Seiten oder Checkout
    if (!is_admin() && !is_checkout()) {
        add_carbot_widget();
    }
}
add_action('wp_footer', 'add_carbot_widget_conditional');`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              WooCommerce Integration
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
{`// WooCommerce Produktdaten übertragen
function carbot_woocommerce_context() {
    if (class_exists('WooCommerce') && is_product()) {
        global $product;
        ?>
        <script>
          window.carbotContext = {
            woocommerce: {
              product_name: "<?php echo esc_js($product->get_name()); ?>",
              product_price: "<?php echo esc_js(wc_price($product->get_price())); ?>",
              product_category: "<?php echo esc_js(wp_get_post_terms(get_the_ID(), 'product_cat')[0]->name ?? ''); ?>",
              in_stock: <?php echo $product->is_in_stock() ? 'true' : 'false'; ?>
            }
          };
        </script>
        <?php
    }
}
add_action('wp_head', 'carbot_woocommerce_context');`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Shortcode */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            3️⃣ Alternative: Shortcode verwenden
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Shortcode erstellen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Für mehr Flexibilität können Sie einen Shortcode erstellen:
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
{`// CarBot Shortcode erstellen
function carbot_shortcode($atts) {
    $atts = shortcode_atts([
        'client' => 'your-client-key',
        'position' => 'bottom-right',
        'color' => '#0073aa',
        'inline' => 'false'
    ], $atts);
    
    $inline_style = $atts['inline'] === 'true' ? 'position: relative; width: 100%; height: 400px;' : '';
    
    return '<div id="carbot-container" style="' . $inline_style . '"></div>
    <script>
      (function() {
        var script = document.createElement("script");
        script.src = "https://carbot.de/widget.js";
        script.setAttribute("data-client", "' . esc_attr($atts['client']) . '");
        script.setAttribute("data-position", "' . esc_attr($atts['position']) . '");
        script.setAttribute("data-color", "' . esc_attr($atts['color']) . '");
        if ("' . $atts['inline'] . '" === "true") {
          script.setAttribute("data-container", "carbot-container");
        }
        document.head.appendChild(script);
      })();
    </script>';
}
add_shortcode('carbot', 'carbot_shortcode');`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Shortcode verwenden
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Fügen Sie den Shortcode in Posts oder Seiten ein:
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
{`<!-- Standard Widget (schwebt) -->
[carbot client="ihr-client-key"]

<!-- Inline Chat (in Seite eingebettet) -->
[carbot client="ihr-client-key" inline="true"]

<!-- Angepasste Farbe -->
[carbot client="ihr-client-key" color="#ff6b35"]

<!-- Links oben positioniert -->
[carbot client="ihr-client-key" position="top-left"]`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Plugin Blocks */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            4️⃣ Gutenberg Block (Block Editor)
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Custom Block erstellen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Für den neuen WordPress Block Editor:
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
{`// Gutenberg Block registrieren
function register_carbot_block() {
    wp_register_script(
        'carbot-block',
        get_template_directory_uri() . '/js/carbot-block.js',
        array('wp-blocks', 'wp-element', 'wp-editor')
    );
    
    register_block_type('carbot/chat-widget', array(
        'editor_script' => 'carbot-block',
        'render_callback' => 'render_carbot_block'
    ));
}
add_action('init', 'register_carbot_block');

function render_carbot_block($attributes) {
    $client_key = $attributes['clientKey'] ?? 'demo';
    return do_shortcode('[carbot client="' . $client_key . '" inline="true"]');
}`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Customization */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            5️⃣ Design-Anpassung
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              WordPress Theme-Farben
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
{`// Theme-Farben automatisch verwenden
$theme_color = get_theme_mod('accent_color', '#0073aa');
script.setAttribute('data-color', '<?php echo esc_js($theme_color); ?>');

// Customizer-Farbe verwenden
$primary_color = get_theme_mod('primary_color');
if ($primary_color) {
    script.setAttribute('data-color', '<?php echo esc_js($primary_color); ?>');
}`}
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
{`/* CarBot Mobile CSS in style.css */
@media (max-width: 768px) {
  #carbot-widget-container {
    bottom: 20px !important;
    right: 10px !important;
    width: calc(100vw - 20px) !important;
    max-width: 350px !important;
  }
  
  /* Platz für WordPress Admin Bar */
  .admin-bar #carbot-widget-container {
    bottom: 60px !important;
  }
}`}
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
              <li style={{ marginBottom: '0.5rem' }}>✅ Client Key korrekt eingesetzt</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Code in <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>functions.php</code> oder <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>footer.php</code></li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Keine JavaScript-Fehler in Browser Console</li>
              <li>✅ Cache geleert (WordPress + Browser)</li>
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Plugin-Konflikte
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Deaktivieren Sie andere Chat-Plugins temporär</li>
              <li style={{ marginBottom: '0.5rem' }}>Testen Sie mit Standard-Theme (Twenty Twenty-Three)</li>
              <li>Prüfen Sie Plugin-Kompatibilität</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Performance-Optimierung
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>CarBot lädt asynchron - keine Auswirkung auf Seitengeschwindigkeit</li>
              <li style={{ marginBottom: '0.5rem' }}>Kompatibel mit Caching-Plugins (WP Rocket, W3 Total Cache)</li>
              <li>CDN-freundlich</li>
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
            "CarBot auf unserer WordPress-Seite hat die Kundenanfragen um 60% erhöht. 
            Die Installation war super einfach und läuft stabil mit WooCommerce."
          </blockquote>
          <div style={{ color: '#22c55e', fontSize: '0.875rem' }}>
            — AutoService Berlin, WordPress + WooCommerce Shop
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎉 Installation erfolgreich!
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            CarBot ist jetzt auf Ihrer WordPress-Website aktiv. Nächste Schritte:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/docs/widget-customization">
              Widget anpassen
            </PrimaryButton>
            <SecondaryButton href="/docs/chat-personalization">
              Chat konfigurieren
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
          <Link href="/docs/shopify-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← Shopify Integration
          </Link>
          <Link href="/docs/html-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            HTML Integration →
          </Link>
        </div>
      </div>
    </SharedLayout>
  )
}