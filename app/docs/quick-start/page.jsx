'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function QuickStartPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <SharedLayout title="Schnellstart-Anleitung" showNavigation={true}>
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
            <div style={{ fontSize: '3rem' }}>🚀</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                Schnellstart-Anleitung
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
                  🕐 5 Minuten
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
            In wenigen Minuten zu Ihrem ersten funktionsfähigen CarBot auf Ihrer Website. 
            Folgen Sie diesen einfachen Schritten für eine reibungslose Integration.
          </p>
        </div>

        {/* Prerequisites */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            📋 Voraussetzungen
          </h2>
          <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Ein CarBot-Konto (kostenlos registrieren)</li>
            <li>Zugriff auf Ihre Website (HTML bearbeiten können)</li>
            <li>5 Minuten Zeit</li>
          </ul>
        </GlassCard>

        {/* Step 1 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#22c55e', marginBottom: '1rem', fontSize: '1.25rem' }}>
            1️⃣ CarBot-Konto erstellen
          </h2>
          
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Falls Sie noch kein Konto haben, registrieren Sie sich kostenlos:
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <PrimaryButton href="/auth/register">
              Kostenlos registrieren
            </PrimaryButton>
          </div>
          
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            ✓ 30 Tage kostenloser Test<br />
            ✓ Keine Kreditkarte erforderlich<br />
            ✓ Sofort einsatzbereit
          </p>
        </GlassCard>

        {/* Step 2 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#fb923c', marginBottom: '1rem', fontSize: '1.25rem' }}>
            2️⃣ Widget-Code erhalten
          </h2>
          
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Nach der Registrierung erhalten Sie Ihren persönlichen Widget-Code:
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Dashboard besuchen
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                <li>Melden Sie sich in Ihrem CarBot-Dashboard an</li>
                <li>Gehen Sie zu "Widget-Einstellungen"</li>
                <li>Kopieren Sie den bereitgestellten HTML-Code</li>
              </ol>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <SecondaryButton href="/dashboard">
              Zum Dashboard
            </SecondaryButton>
          </div>
        </GlassCard>

        {/* Step 3 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#8b5cf6', marginBottom: '1rem', fontSize: '1.25rem' }}>
            3️⃣ Code in Website einbauen
          </h2>
          
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Fügen Sie den Widget-Code vor dem schließenden <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>&lt;/body&gt;</code> Tag ein:
          </p>
          
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            position: 'relative',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => copyToClipboard(`<!-- CarBot Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://widget.carbot.de/widget.js';
    script.setAttribute('data-client-key', 'IHR_CLIENT_KEY');
    document.head.appendChild(script);
  })();
</script>
<!-- Ende CarBot Widget -->`)}
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
{`<!-- CarBot Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://widget.carbot.de/widget.js';
    script.setAttribute('data-client-key', 'IHR_CLIENT_KEY');
    document.head.appendChild(script);
  })();
</script>
<!-- Ende CarBot Widget -->`}
            </pre>
          </div>
          
          <div style={{
            background: 'rgba(251, 146, 60, 0.1)',
            border: '1px solid #fb923c',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ⚠️ Wichtig
            </div>
            <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.875rem' }}>
              Ersetzen Sie <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '4px' }}>IHR_CLIENT_KEY</code> durch Ihren echten Client Key aus dem Dashboard!
            </p>
          </div>
        </GlassCard>

        {/* Step 4 */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.25rem' }}>
            4️⃣ Testen und konfigurieren
          </h2>
          
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Nach dem Einbau sollte das CarBot-Widget in der unteren rechten Ecke Ihrer Website erscheinen:
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Schnelltest
            </h3>
            <ol style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Besuchen Sie Ihre Website</li>
              <li>Das Chat-Widget sollte sichtbar sein</li>
              <li>Klicken Sie darauf und schreiben Sie eine Testnachricht</li>
              <li>Der Bot sollte antworten</li>
            </ol>
          </div>
          
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ color: '#22c55e', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ✅ Geschafft!
            </div>
            <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.875rem' }}>
              Ihr CarBot ist jetzt live und bereit, Kunden zu bedienen!
            </p>
          </div>
        </GlassCard>

        {/* Customization */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎨 Individuelle Anpassung
          </h2>
          
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Personalisieren Sie Ihr Widget für optimale Ergebnisse:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <h3 style={{ color: '#fb923c', fontSize: '1rem', marginBottom: '0.5rem' }}>Farben & Design</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Passen Sie Farben an Ihr Corporate Design an
              </p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Begrüßung</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Personalisierte Willkommensnachricht
              </p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>Öffnungszeiten</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Automatische Verfügbarkeit basierend auf Ihren Zeiten
              </p>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <SecondaryButton href="/dashboard/widget-customizer">
              Widget anpassen
            </SecondaryButton>
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎉 Nächste Schritte
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            Ihr CarBot ist einsatzbereit! Entdecken Sie weitere Funktionen:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Link href="/docs/html-integration" style={{ color: '#fb923c', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💻</div>
                <div>Erweiterte Integration</div>
              </div>
            </Link>
            <Link href="/dashboard/analytics" style={{ color: '#22c55e', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
                <div>Analytics Dashboard</div>
              </div>
            </Link>
            <Link href="/docs/api-reference" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️</div>
                <div>API Integration</div>
              </div>
            </Link>
            <Link href="/docs/troubleshooting" style={{ color: '#ef4444', textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔧</div>
                <div>Hilfe & Support</div>
              </div>
            </Link>
          </div>
        </GlassCard>

        {/* Support Section */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🆘 Hilfe benötigt?
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            Falls Sie Probleme bei der Integration haben, stehen wir Ihnen gerne zur Verfügung:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <SecondaryButton href="mailto:support@carbot.chat">
              📧 E-Mail Support
            </SecondaryButton>
            <SecondaryButton href="/docs/troubleshooting">
              🔍 Problemlösung
            </SecondaryButton>
            <SecondaryButton href="/demo/workshop">
              🎮 Live Demo
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
          <Link href="/docs" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← Dokumentation
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