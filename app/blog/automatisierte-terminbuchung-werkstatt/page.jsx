import { Metadata } from 'next'
import Link from 'next/link'
import ModernNavigation from '../../../components/ModernNavigation'
import { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'Automatisierte Terminbuchung für Werkstätten: 24/7 online buchen | CarBot',
  description: 'Steigern Sie Ihre Terminbuchungen um 200% mit automatisierter Online-Terminvergabe. Weniger No-Shows, mehr Umsatz. Jetzt kostenlose Demo anfordern!',
  keywords: 'Terminbuchung Werkstatt, Online Termine, Werkstatt Software, Automatisierung, No-Show Reduzierung, Werkstatt Digitalisierung',
  openGraph: {
    title: 'Automatisierte Terminbuchung für Werkstätten: 24/7 online buchen',
    description: 'Steigern Sie Ihre Terminbuchungen um 200% mit automatisierter Online-Terminvergabe.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/automatisierte-terminbuchung-werkstatt'
  }
}

export default function BlogPost() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
      color: 'white'
    }}>
      {/* Modern Navigation */}
      <ModernNavigation variant="page" />
      
      <main id="main-content">
        <article style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem 1.5rem'
        }}>
        <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#9ca3af' }}>
          <Link href="/" style={{ color: '#fb923c', textDecoration: 'none' }}>Home</Link>
          {' → '}
          <Link href="/blog" style={{ color: '#fb923c', textDecoration: 'none' }}>Blog</Link>
          {' → '}
          <span>Automatisierte Terminbuchung</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Workflow & Automatisierung
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Automatisierte Terminbuchung für Werkstätten: Wie Sie Ihre Buchungen um 200% steigern
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Schluss mit Termintelefonen und No-Shows! Moderne Werkstätten setzen auf automatisierte 
            Online-Terminbuchung und steigern dabei Umsatz, Effizienz und Kundenzufriedenheit.
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 5. Januar 2025</span>
            <span>📖 7 Min. Lesezeit</span>
            <span>👤 Sarah Weber, Werkstatt-Expertin</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Das Problem: Terminvergabe als Zeitfresser
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Kennen Sie das? Es ist 17:30 Uhr, Sie wollen Feierabend machen, aber das Telefon klingelt 
              noch einmal. Ein Kunde möchte einen Termin für seinen Ölwechsel nächste Woche. 
              Sie blättern durch Ihren Terminkalender, der Kunde wartet, und eigentlich hätte 
              das alles viel einfacher sein können.
            </p>
            <p>
              <strong>Die ernüchternde Realität:</strong> Deutsche Werkstätten verlieren durchschnittlich 
              <strong>8-12 Stunden pro Woche</strong> nur mit der Terminkoordination am Telefon. 
              Zeit, die für produktive Arbeiten am Fahrzeug genutzt werden könnte.
            </p>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die Lösung: Intelligente Online-Terminbuchung
            </h2>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Automatisierte Terminbuchungssysteme revolutionieren die Art, wie Werkstätten 
              ihre Kapazitäten planen und verwalten. Statt Telefonterror gibt es klare Prozesse, 
              die sowohl für Werkstatt als auch Kunden optimal funktionieren.
            </p>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              So funktioniert moderne Terminbuchung:
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤖</div>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>KI-Chatbot</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Kunde beschreibt sein Anliegen im Chat
                </p>
              </div>
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
                <h4 style={{ color: '#10b981', fontSize: '1rem', marginBottom: '0.5rem' }}>Service-Erkennung</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  System schlägt passende Services vor
                </p>
              </div>
              <div style={{ 
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
                <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>Terminauswahl</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Verfügbare Slots werden angezeigt
                </p>
              </div>
              <div style={{ 
                background: 'rgba(251, 146, 60, 0.1)',
                border: '1px solid rgba(251, 146, 60, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
                <h4 style={{ color: '#fb923c', fontSize: '1rem', marginBottom: '0.5rem' }}>Bestätigung</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Automatische Bestätigung & Erinnerung
                </p>
              </div>
            </div>

            <blockquote style={{
              borderLeft: '4px solid #3b82f6',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '1rem',
              borderRadius: '0 8px 8px 0'
            }}>
              "Seit wir die automatisierte Terminbuchung eingeführt haben, buchen 70% unserer 
              Kunden online. Unser Telefon klingelt nur noch für wirkliche Notfälle."
              <br /><br />
              <strong>— Michael Schmidt, KFZ-Meister aus München</strong>
            </blockquote>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Messbarer Erfolg: Die Zahlen sprechen für sich
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>+200%</div>
                <div style={{ color: '#d1d5db' }}>Online-Buchungen</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📞</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>-65%</div>
                <div style={{ color: '#d1d5db' }}>Termintelefonate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>❌</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>-40%</div>
                <div style={{ color: '#d1d5db' }}>No-Show Rate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>+25%</div>
                <div style={{ color: '#d1d5db' }}>Monatsumsatz</div>
              </div>
            </div>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Konkrete Fallstudie: AutoHaus Müller (Köln)
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Das AutoHaus Müller führte im März 2024 ein automatisiertes Terminbuchungssystem ein. 
              Die Ergebnisse nach 9 Monaten:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Vorher:</strong> 85 Termine/Woche, 20% No-Show Rate, 12h Telefonzeit</li>
              <li><strong>Nachher:</strong> 145 Termine/Woche, 12% No-Show Rate, 4h Telefonzeit</li>
              <li><strong>Zusatzumsatz:</strong> €18.500 pro Monat durch bessere Auslastung</li>
              <li><strong>ROI:</strong> Das System hat sich bereits nach 2 Monaten amortisiert</li>
            </ul>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              5 Schlüsselfunktionen für erfolgreiche Terminbuchung
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                1. Intelligente Serviceerkennung
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                Das System erkennt automatisch, welche Art von Service der Kunde benötigt, 
                basierend auf seiner Beschreibung oder dem gewählten Fahrzeugtyp.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                Kunde: "Mein BMW quietscht beim Bremsen"<br />
                System: → Bremsenwartung (90 Min) + Sicherheitscheck (30 Min)
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                2. Echtzeit-Kapazitätsplanung
              </h3>
              <p>
                Das System kennt Ihre Werkstattkapazitäten, Mitarbeiterqualifikationen und 
                spezielle Ausrüstungsanforderungen. So werden nur realistisch verfügbare 
                Termine angezeigt.
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                3. Automatische Erinnerungen
              </h3>
              <p>
                48h und 24h vor dem Termin erhalten Kunden automatische Erinnerungen 
                per E-Mail oder SMS. Das reduziert No-Shows um durchschnittlich 40%.
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                4. Warteschlangen-Management
              </h3>
              <p>
                Bei ausgebuchten Terminen können sich Kunden automatisch auf eine 
                Warteliste setzen lassen. Bei Absagen werden sie sofort benachrichtigt.
              </p>
            </div>

            <div>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                5. Integration in bestehende Systeme
              </h3>
              <p>
                Nahtlose Verbindung zu Ihrer Werkstatt-Software, damit alle Termine 
                automatisch in Ihrem gewohnten System erscheinen.
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ 
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Starten Sie noch heute!
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Testen Sie 30 Tage kostenlos, wie automatisierte Terminbuchung 
              Ihre Werkstatt transformiert. Ohne Risiko, ohne Vertragsbindung.
            </p>
            <Link 
              href="/demo" 
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🚀 30 Tage kostenlos testen
            </Link>
          </GlassCard>

        </div>

        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem 0', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
                Sarah Weber
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                Werkstatt-Expertin mit 8 Jahren Erfahrung in der Digitalisierung von KFZ-Betrieben
              </p>
            </div>
            <Link href="/blog" style={{ color: '#fb923c', textDecoration: 'none' }}>
              ← Alle Artikel
            </Link>
          </div>
        </footer>
        </article>
      </main>
      
      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(107, 114, 128, 1)',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <p>&copy; 2025 CarBot. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}