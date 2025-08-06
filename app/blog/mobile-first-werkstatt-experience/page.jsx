import { Metadata } from 'next'
import Link from 'next/link'
import SharedLayout, { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'Mobile-First Werkstatt Experience: Warum Smartphones entscheidend sind | CarBot',
  description: 'Entdecken Sie, warum mobile Optimierung für Werkstätten überlebenswichtig ist. 73% der Kunden nutzen Smartphones für Werkstatt-Services. Jetzt optimieren!',
  keywords: 'Mobile Werkstatt, Smartphone Optimierung, Mobile-First Design, Responsive Werkstatt Website, Mobile Customer Experience, Automotive UX',
  openGraph: {
    title: 'Mobile-First Werkstatt Experience: Warum Smartphones entscheidend sind',
    description: 'Warum mobile Optimierung für moderne Werkstätten überlebenswichtig ist und wie Sie davon profitieren.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/mobile-first-werkstatt-experience'
  }
}

export default function BlogPost() {
  return (
    <SharedLayout title="Mobile-First Werkstatt Experience" showNavigation={true}>
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
          <span>Mobile-First Werkstatt Experience</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              User Experience
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Mobile-First Werkstatt Experience: Warum das Smartphone über Erfolg entscheidet
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            73% der Kunden nutzen ihr Smartphone für Werkstatt-Services. Werkstätten ohne mobile 
            Optimierung verlieren täglich Kunden und Umsatz. Zeit für den Wandel!
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 12. Januar 2025</span>
            <span>📖 9 Min. Lesezeit</span>
            <span>👤 Lisa Chen, UX-Expertin</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die Mobile Revolution in der Automotive-Branche
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Während die Automobilbranche ihre Fahrzeuge digitalisiert, hinken viele Werkstätten 
              bei der mobilen Customer Experience hinterher. Das ist ein fataler Fehler, denn:
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>73%</div>
                <div style={{ fontSize: '0.875rem' }}>nutzen Smartphones für Werkstatt-Services</div>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>3 Sek.</div>
                <div style={{ fontSize: '0.875rem' }}>Aufmerksamkeitsspanne mobile Nutzer</div>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>67%</div>
                <div style={{ fontSize: '0.875rem' }}>verlassen nicht-mobile Websites sofort</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🎯 Die Realität:</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Google priorisiert mobile-optimierte Websites seit 2021. Werkstätten ohne Mobile-First 
                Approach verlieren nicht nur Kunden, sondern auch <strong>Sichtbarkeit in Suchmaschinen</strong>.
                Der durchschnittliche Umsatzverlust: <strong>€18.000 pro Jahr</strong>.
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Customer Journey: Wie Kunden heute ihre Werkstatt finden
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Die 5 Phasen der mobilen Werkstatt-Suche:
              </h3>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderLeft: '4px solid #22c55e',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>🔍</div>
                  <h4 style={{ color: '#22c55e', fontSize: '1.125rem', margin: 0 }}>Phase 1: Problem-Erkennung (Mobile: 89%)</h4>
                </div>
                <p style={{ fontSize: '0.875rem', margin: 0, paddingLeft: '2rem' }}>
                  Kunden bemerken ein Problem am Fahrzeug und googeln sofort auf dem Smartphone: 
                  "Werkstatt in der Nähe", "Auto quietscht beim Bremsen", "TÜV Hamburg".
                </p>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderLeft: '4px solid #3b82f6',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>📊</div>
                  <h4 style={{ color: '#3b82f6', fontSize: '1.125rem', margin: 0 }}>Phase 2: Recherche & Vergleich (Mobile: 81%)</h4>
                </div>
                <p style={{ fontSize: '0.875rem', margin: 0, paddingLeft: '2rem' }}>
                  Bewertungen lesen, Preise vergleichen, Services checken - alles mobil. 
                  Entscheidung fällt in <strong>unter 5 Minuten</strong>.
                </p>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderLeft: '4px solid #a855f7',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>📞</div>
                  <h4 style={{ color: '#a855f7', fontSize: '1.125rem', margin: 0 }}>Phase 3: Kontaktaufnahme (Mobile: 92%)</h4>
                </div>
                <p style={{ fontSize: '0.875rem', margin: 0, paddingLeft: '2rem' }}>
                  "Jetzt anrufen" Button oder WhatsApp-Chat. Kunden erwarten sofortige Antwort, 
                  idealerweise über Chatbot oder Live-Chat.
                </p>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderLeft: '4px solid #f59e0b',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>📅</div>
                  <h4 style={{ color: '#f59e0b', fontSize: '1.125rem', margin: 0 }}>Phase 4: Terminbuchung (Mobile: 76%)</h4>
                </div>
                <p style={{ fontSize: '0.875rem', margin: 0, paddingLeft: '2rem' }}>
                  Online-Terminbuchung direkt vom Smartphone. Kunden buchen bevorzugt abends 
                  oder am Wochenende - außerhalb der Geschäftszeiten.
                </p>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderLeft: '4px solid #ef4444',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>💬</div>
                  <h4 style={{ color: '#ef4444', fontSize: '1.125rem', margin: 0 }}>Phase 5: Service & Follow-up (Mobile: 85%)</h4>
                </div>
                <p style={{ fontSize: '0.875rem', margin: 0, paddingLeft: '2rem' }}>
                  Status-Updates, Rechnung, Bewertung abgeben - alles läuft mobil. 
                  Zufriedene Kunden teilen Erfahrungen in Social Media.
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1.5rem'
            }}>
              <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>💡 Wichtige Erkenntnis:</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                <strong>Nur 23% der deutschen Werkstätten</strong> haben ihre Customer Journey 
                vollständig mobile-optimiert. Das bedeutet: 77% verschenken täglich Umsatz!
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die 8 kritischen Mobile-UX Elemente für Werkstätten
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>1. Ladegeschwindigkeit</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Ziel: &lt; 2 Sekunden</strong><br />
                  Pro zusätzlicher Sekunde verlieren Sie 11% der mobilen Besucher.
                </p>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Optimierte Bilder<br />
                  ✅ Minimierter Code<br />
                  ✅ CDN verwenden
                </div>
              </div>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👆</div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>2. Touch-Optimierung</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Mindestgröße: 44px für Buttons</strong><br />
                  Alle Interaktionselemente müssen mit dem Daumen erreichbar sein.
                </p>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Große Buttons<br />
                  ✅ Genug Abstand<br />
                  ✅ Thumb-friendly Navigation
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📱</div>
                <h3 style={{ color: '#a855f7', fontSize: '1.125rem', marginBottom: '1rem' }}>3. Responsive Design</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Mobile-First Approach</strong><br />
                  Design beginnt beim Smartphone, dann Desktop.
                </p>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Flexible Grids<br />
                  ✅ Anpassbare Bilder<br />
                  ✅ Breakpoint-Strategie
                </div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.125rem', marginBottom: '1rem' }}>4. Call-to-Action</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Sofort sichtbar und eindeutig</strong><br />
                  "Jetzt Termin buchen" muss prominent platziert sein.
                </p>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Above the fold<br />
                  ✅ Kontrastfarben<br />
                  ✅ Klare Beschriftung
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>5. Formulare</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Minimal und intelligent</strong><br />
                  Maximal 3 Felder für Terminbuchung.
                </p>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Auto-Fill aktivieren<br />
                  ✅ Intelligente Eingabefelder<br />
                  ✅ Validierung in Echtzeit
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧭</div>
                <h3 style={{ color: '#06b6d4', fontSize: '1.125rem', marginBottom: '1rem' }}>6. Navigation</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Hamburger-Menu oder Tab-Bar</strong><br />
                  Maximal 5 Hauptkategorien.
                </p>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Klare Hierarchie<br />
                  ✅ Konsistente Icons<br />
                  ✅ Breadcrumbs
                </div>
              </div>

              <div style={{
                background: 'rgba(132, 204, 22, 0.1)',
                border: '1px solid rgba(132, 204, 22, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📞</div>
                <h3 style={{ color: '#84cc16', fontSize: '1.125rem', marginBottom: '1rem' }}>7. Click-to-Call</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Ein Tap = Anruf</strong><br />
                  Telefonnummer als direkter Link.
                </p>
                <div style={{
                  background: 'rgba(132, 204, 22, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Prominent platziert<br />
                  ✅ tel: Protocol<br />
                  ✅ Notfall-Hotline extra
                </div>
              </div>

              <div style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗺️</div>
                <h3 style={{ color: '#f97316', fontSize: '1.125rem', marginBottom: '1rem' }}>8. Standort-Integration</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Google Maps eingebettet</strong><br />
                  Navigation direkt zur Werkstatt.
                </p>
                <div style={{
                  background: 'rgba(249, 115, 22, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ✅ Interaktive Karte<br />
                  ✅ Routenplanung<br />
                  ✅ Öffnungszeiten anzeigen
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Mobile-Trends 2025: Was Werkstätten implementieren müssen
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🚀 Trend #1: Progressive Web Apps (PWA)
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                PWAs kombinieren die Vorteile von Websites und Apps. Kunden können die 
                Werkstatt-PWA wie eine App installieren und offline nutzen.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Vorteile für Werkstätten:</strong><br />
                ✅ Push-Notifications für Terminerinnerungen<br />
                ✅ Offline-Funktionalität für Notfälle<br />
                ✅ App-ähnliches Nutzererlebnis ohne App Store<br />
                ✅ 60% höhere Engagement-Rate
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🎤 Trend #2: Voice Search Optimierung
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                "Ok Google, finde eine Werkstatt in meiner Nähe" - Voice Search wird 2025 
                über 50% der mobilen Suchen ausmachen.
              </p>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Voice-SEO Optimierungen:</strong><br />
                ✅ Long-Tail Keywords: "Beste Werkstatt für BMW in Hamburg"<br />
                ✅ FAQ-Sektion für natürliche Fragen<br />
                ✅ Lokale Suchbegriffe optimieren<br />
                ✅ Structured Data Markup verwenden
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🤖 Trend #3: KI-gestützte Personalisierung
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Intelligente Websites lernen aus dem Nutzerverhalten und passen sich automatisch an.
              </p>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Personalisierungs-Features:</strong><br />
                ✅ Individuelle Service-Empfehlungen basierend auf Fahrzeugtyp<br />
                ✅ Dynamische Preisanzeige je nach Standort<br />
                ✅ Personalisierte Terminvorschläge<br />
                ✅ Adaptive UI basierend auf Nutzerverhalten
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🔒 Trend #4: Biometrische Authentifizierung
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Face ID und Fingerprint-Login für sichere und schnelle Anmeldung in Kunden-Bereichen.
              </p>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Sicherheits-Benefits:</strong><br />
                ✅ Keine vergessenen Passwörter<br />
                ✅ 3-Sekunden Login statt 30 Sekunden<br />
                ✅ DSGVO-konforme Datensicherheit<br />
                ✅ Reduzierte Abbruchrate um 45%
              </div>
            </div>

            <div>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                📡 Trend #5: 5G und Edge Computing
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Ultra-schnelle Datenübertragung ermöglicht neue mobile Erlebnisse wie AR-Diagnose.
              </p>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>5G-Features für Werkstätten:</strong><br />
                ✅ Real-time Fahrzeugdiagnose per Smartphone<br />
                ✅ AR-gestützte Reparaturanleitungen<br />
                ✅ Instant Video-Beratung<br />
                ✅ Live-Streaming von Reparaturen
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Praxisbeispiel: Mobile-Transformation der Werkstatt Neumann
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Ausgangssituation (Januar 2024):
              </h3>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Mobile-Probleme der Werkstatt Neumann:</strong><br />
                • Website nicht mobiloptimiert (nur 12% mobile Traffic)<br />
                • 78% Bounce-Rate auf mobilen Geräten<br />
                • Keine Online-Terminbuchung<br />
                • Telefon als einziger Kontaktkanal<br />
                • Google-Ranking Position 47 für lokale Suche
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Mobile-First Redesign (Investition: €12.500):
              </h3>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li><strong>Woche 1-2:</strong> UX-Analyse und Mobile-First Design</li>
                <li><strong>Woche 3-4:</strong> Responsive Website-Entwicklung</li>
                <li><strong>Woche 5:</strong> Online-Terminbuchung Integration</li>
                <li><strong>Woche 6:</strong> KI-Chatbot für mobile Nutzer</li>
                <li><strong>Woche 7:</strong> Performance-Optimierung und Testing</li>
                <li><strong>Woche 8:</strong> Go-Live und Monitoring Setup</li>
              </ul>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📱</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>68%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Mobile Traffic Anteil</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>+567% Steigerung</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>1,2s</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Ladezeit Mobile</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>-73% Verbesserung</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>Position 3</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Google Local Ranking</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>44 Plätze besser</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>+42%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Online-Termine</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>€28k Mehrumsatz</div>
              </div>
            </div>

            <blockquote style={{
              borderLeft: '4px solid #ec4899',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              background: 'rgba(236, 72, 153, 0.1)',
              padding: '1rem',
              borderRadius: '0 8px 8px 0'
            }}>
              "Die mobile Optimierung war ein Game-Changer für uns. Wir erreichen jetzt 
              eine völlig neue Kundengruppe und unsere Terminbuchungen haben sich mehr 
              als verdoppelt. Das Investment hat sich bereits nach 4 Monaten amortisiert."
              <br /><br />
              <strong>— Frank Neumann, Geschäftsführer Werkstatt Neumann</strong>
            </blockquote>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Mobile-Optimierung Schritt-für-Schritt Anleitung
            </h2>
            
            <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Phase 1: Analyse & Audit (Woche 1-2)
            </h3>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🔍 Mobile-Audit Checkliste:</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                <li>Google Mobile-Friendly Test durchführen</li>
                <li>PageSpeed Insights Mobile Score prüfen</li>
                <li>Google Analytics Mobile Traffic analysieren</li>
                <li>Heatmap-Analyse für mobile Nutzerverhalten</li>
                <li>Konkurrenz-Analyse mobile Präsenz</li>
                <li>User-Testing mit echten Smartphone-Nutzern</li>
              </ul>
            </div>

            <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Phase 2: Design & UX (Woche 3-4)
            </h3>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>🎨 Design-Prioritäten:</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                <li>Mobile-First Wireframes erstellen</li>
                <li>Touch-friendly Buttons und Navigation</li>
                <li>Content-Hierarchie für kleine Bildschirme</li>
                <li>Optimierte Farbkontraste für Outdoor-Nutzung</li>
                <li>Finger-freundliche Formulare designen</li>
                <li>Progressive Disclosure Prinzip anwenden</li>
              </ul>
            </div>

            <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Phase 3: Entwicklung & Implementierung (Woche 5-6)
            </h3>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>⚙️ Technische Umsetzung:</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                <li>Responsive CSS Framework implementieren</li>
                <li>Bilder für Retina-Displays optimieren</li>
                <li>Touch-Gesten programmieren (Swipe, Pinch)</li>
                <li>Service Worker für Offline-Funktionalität</li>
                <li>AMP (Accelerated Mobile Pages) einrichten</li>
                <li>Push-Notification System integrieren</li>
              </ul>
            </div>

            <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Phase 4: Testing & Launch (Woche 7-8)
            </h3>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>🧪 Test-Protokoll:</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                <li>Cross-Device Testing (iPhone, Android, Tablets)</li>
                <li>Performance-Tests unter verschiedenen Netzwerkbedingungen</li>
                <li>Usability-Tests mit Zielgruppe</li>
                <li>A/B Tests für kritische Conversion-Elemente</li>
                <li>SEO-Audit für Mobile-First Indexing</li>
                <li>Graduelle Rollout-Strategie (20% → 50% → 100%)</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard style={{ 
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Bereit für den Mobile-First Durchbruch?
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Lassen Sie uns Ihre mobile Customer Experience kostenlos analysieren und zeigen, 
              wie Sie mit Mobile-First Design mehr Kunden gewinnen und binden.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                📱 Kostenloser Mobile-Audit
              </Link>
              <Link 
                href="/docs" 
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                📊 Mobile-Readiness Check
              </Link>
            </div>
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
                Lisa Chen
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                UX-Expertin mit 8 Jahren Spezialisierung auf Mobile-First Design für Automotive Unternehmen
              </p>
            </div>
            <Link href="/blog" style={{ color: '#fb923c', textDecoration: 'none' }}>
              ← Alle Artikel
            </Link>
          </div>
        </footer>
      </article>
    </SharedLayout>
  )
}