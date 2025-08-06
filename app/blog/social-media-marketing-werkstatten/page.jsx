import { Metadata } from 'next'
import Link from 'next/link'
import SharedLayout, { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'Social Media Marketing für Werkstätten: Mehr Kunden durch digitale Präsenz | CarBot',
  description: 'Erfahren Sie, wie Werkstätten mit gezieltem Social Media Marketing neue Kunden gewinnen. Praktische Strategien für Facebook, Instagram und TikTok.',
  keywords: 'Social Media Marketing Werkstatt, Facebook Marketing KFZ, Instagram Autowerkstatt, TikTok Marketing Automotive, Digital Marketing Werkstatt',
  openGraph: {
    title: 'Social Media Marketing für Werkstätten: Mehr Kunden durch digitale Präsenz',
    description: 'Praktische Social Media Strategien für Werkstätten - von Content-Ideen bis zur Kundengewinnung.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/social-media-marketing-werkstatten'
  }
}

export default function BlogPost() {
  return (
    <SharedLayout title="Social Media Marketing Werkstätten" showNavigation={true}>
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
          <span>Social Media Marketing Werkstätten</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Digital Marketing
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Social Media Marketing für Werkstätten: Wie Sie online mehr Kunden erreichen
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            78% der Kunden informieren sich online über Werkstätten. Mit der richtigen Social Media Strategie 
            verwandeln Sie Follower in treue Kunden und steigern Ihren Umsatz nachhaltig.
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 14. Januar 2025</span>
            <span>📖 9 Min. Lesezeit</span>
            <span>👤 Emma Wagner, Social Media Strategin</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Warum Social Media für Werkstätten unverzichtbar ist
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Die Zeiten, in denen Werkstätten nur auf Mundpropaganda und Laufkundschaft 
              angewiesen waren, sind vorbei. Heute entscheidet die digitale Präsenz über 
              Erfolg oder Misserfolg eines Betriebs.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(233, 30, 99, 0.1)',
                border: '1px solid rgba(233, 30, 99, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e91e63' }}>78%</div>
                <div style={{ fontSize: '0.875rem' }}>suchen Werkstätten online</div>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>4,5+</div>
                <div style={{ fontSize: '0.875rem' }}>Sterne-Bewertung entscheidend</div>
              </div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>65%</div>
                <div style={{ fontSize: '0.875rem' }}>vertrauen Social Media Reviews</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>💡 Die Realität:</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Werkstätten mit aktiver Social Media Präsenz generieren <strong>45% mehr Neukunden</strong> 
                und haben eine <strong>32% höhere Kundenbindung</strong>. Der durchschnittliche ROI 
                von Social Media Marketing liegt bei <strong>1:4,2</strong> - für jeden investierten 
                Euro kommen 4,20€ Umsatz zurück.
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die wichtigsten Social Media Plattformen für Werkstätten
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>📘</div>
                  <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', margin: 0 }}>Facebook</h3>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Zielgruppe:</strong> 35-65 Jahre, lokale Kunden, Familienväter/-mütter
                </p>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>✅ Ideal für:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Lokale Reichweite und Community-Aufbau</li>
                  <li>Detaillierte Zielgruppen-Werbung</li>
                  <li>Kundenservice und Terminbuchung</li>
                  <li>Veranstaltungen und Aktionen bewerben</li>
                </ul>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Budget-Empfehlung:</strong> €150-400/Monat für Ads<br />
                  <strong>Content-Frequenz:</strong> 3-4 Posts/Woche
                </div>
              </div>
              
              <div style={{
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>📸</div>
                  <h3 style={{ color: '#ec4899', fontSize: '1.25rem', margin: 0 }}>Instagram</h3>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Zielgruppe:</strong> 18-45 Jahre, visuell orientiert, technikaffin
                </p>
                <h4 style={{ color: '#ec4899', fontSize: '1rem', marginBottom: '0.5rem' }}>✅ Ideal für:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Before/After Reparatur-Fotos</li>
                  <li>Behind-the-scenes Content</li>
                  <li>Stories für tägliche Updates</li>
                  <li>Hashtag-Marketing (#werkstatt #autoreparatur)</li>
                </ul>
                <div style={{
                  background: 'rgba(236, 72, 153, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Budget-Empfehlung:</strong> €100-250/Monat für Ads<br />
                  <strong>Content-Frequenz:</strong> 1 Post/Tag + 2-3 Stories
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>🎵</div>
                  <h3 style={{ color: '#a855f7', fontSize: '1.25rem', margin: 0 }}>TikTok</h3>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Zielgruppe:</strong> 16-35 Jahre, Gen Z, Millennials
                </p>
                <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>✅ Ideal für:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Kurze, unterhaltsame Repair-Videos</li>
                  <li>Trend-basierte Inhalte</li>
                  <li>Jüngere Zielgruppe erreichen</li>
                  <li>Viral-Potenzial nutzen</li>
                </ul>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Budget-Empfehlung:</strong> €50-150/Monat<br />
                  <strong>Content-Frequenz:</strong> 3-5 Videos/Woche
                </div>
              </div>

              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>💼</div>
                  <h3 style={{ color: '#22c55e', fontSize: '1.25rem', margin: 0 }}>Google My Business</h3>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Zielgruppe:</strong> Lokale Suchende aller Altersgruppen
                </p>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>✅ Ideal für:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Lokale SEO und Sichtbarkeit</li>
                  <li>Kundenbewertungen sammeln</li>
                  <li>Aktuelle Infos (Öffnungszeiten, Angebote)</li>
                  <li>Direkte Terminbuchung</li>
                </ul>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Kosten:</strong> Kostenlos<br />
                  <strong>Content-Frequenz:</strong> 2-3 Posts/Woche + regelmäßige Fotos
                </div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>💬</div>
                  <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', margin: 0 }}>WhatsApp Business</h3>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Zielgruppe:</strong> Direkter Kundenkontakt, alle Altersgruppen
                </p>
                <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>✅ Ideal für:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Direkte Kundenkommunikation</li>
                  <li>Schnelle Terminabsprachen</li>
                  <li>Status-Updates zu Reparaturen</li>
                  <li>Foto-basierte Diagnosen</li>
                </ul>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Kosten:</strong> Kostenlos<br />
                  <strong>Nutzung:</strong> Reaktiv + proaktive Updates
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>🎬</div>
                  <h3 style={{ color: '#ef4444', fontSize: '1.25rem', margin: 0 }}>YouTube</h3>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Zielgruppe:</strong> DIY-Interessierte, technikaffine Autobesitzer
                </p>
                <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>✅ Ideal für:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Tutorial-Videos und Tipps</li>
                  <li>Komplexe Reparatur-Dokumentationen</li>
                  <li>Werkstatt-Vorstellungen</li>
                  <li>Langfristiger Content-Aufbau</li>
                </ul>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Budget-Empfehlung:</strong> €100-300/Monat für Ads<br />
                  <strong>Content-Frequenz:</strong> 1-2 Videos/Woche
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              25 Content-Ideen für Werkstatt Social Media
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>🔧 Behind-the-Scenes Content</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>"Ein Tag in der Werkstatt" Stories</li>
                  <li>Zeitraffer-Videos von Reparaturen</li>
                  <li>Team-Vorstellungen mit persönlichen Details</li>
                  <li>Moderne Werkstatt-Ausstattung zeigen</li>
                  <li>Aufräumen und Reinigung der Werkstatt</li>
                </ul>
              </div>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>📚 Educational Content</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>"Wie erkenne ich..." Tipps für Autobesitzer</li>
                  <li>Saisonale Wartungstipps (Winter/Sommer)</li>
                  <li>Mythen vs. Fakten in der Autowartung</li>
                  <li>Einfache DIY-Checks für zu Hause</li>
                  <li>Erklärung komplexer Fahrzeugtechnik</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#a855f7', fontSize: '1.125rem', marginBottom: '1rem' }}>📸 Visual Success Stories</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Before/After Restaurations-Projekte</li>
                  <li>Spektakuläre Reparatur-Herausforderungen</li>
                  <li>Seltene oder exotische Fahrzeuge</li>
                  <li>Besonders knifflige Problem-Lösungen</li>
                  <li>Vintage-Car Restaurationen dokumentieren</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#f59e0b', fontSize: '1.125rem', marginBottom: '1rem' }}>👥 Community & Kunden</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Kunden-Testimonials und Reviews teilen</li>
                  <li>Kundenautos als "Auto der Woche"</li>
                  <li>Community-Fragen beantworten</li>
                  <li>Lokale Events und Sponsoring</li>
                  <li>Kundenstorys und Dankeschöns</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>🎯 Promotional Content</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Saisonale Angebote und Aktionen</li>
                  <li>Neue Services und Dienstleistungen</li>
                  <li>Partnerschaften und Kooperationen</li>
                  <li>Gewinnspiele und Contests</li>
                  <li>Last-Minute Termine verfügbar</li>
                </ul>
              </div>
            </div>

            <div style={{
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1.5rem'
            }}>
              <h4 style={{ color: '#ec4899', fontSize: '1rem', marginBottom: '0.5rem' }}>💡 Content-Erfolg Geheimtipp:</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                <strong>Die 80/20 Regel:</strong> 80% Mehrwert-Content (Tipps, Education, Entertainment) 
                und nur 20% direkter Werbe-Content. So bauen Sie Vertrauen auf und vermeiden 
                "Werbung-Overload" bei Ihren Followern.
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Social Media Advertising: Gezielt Kunden ansprechen
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🎯 Facebook & Instagram Ads Strategien
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minMax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>📍 Local Awareness Ads</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Zielgruppe im 15km Radius ansprechen
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Budget:</strong> €50-150/Monat<br />
                    <strong>Ziel:</strong> Lokale Bekanntheit steigern
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🎨 Lead Generation Ads</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Formulare für Kostenvoranschläge
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Budget:</strong> €150-400/Monat<br />
                    <strong>Ziel:</strong> Qualifizierte Leads sammeln
                  </div>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>🔄 Retargeting Ads</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Website-Besucher erneut ansprechen
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Budget:</strong> €100-250/Monat<br />
                    <strong>Ziel:</strong> Conversion-Rate erhöhen
                  </div>
                </div>

                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>⏰ Event Promotion</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    TÜV-Aktion oder Sommer-Check bewerben
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Budget:</strong> €200-500/Event<br />
                    <strong>Ziel:</strong> Schnelle Terminbuchungen
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>🎯 Perfekte Zielgruppen-Definition:</h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Demografisch:</strong> 25-65 Jahre, Haushalteinkommen 30k+, Autobesitzer<br />
                  <strong>Interesssen:</strong> Automobil, Heimwerken, lokale Unternehmen<br />
                  <strong>Verhalten:</strong> Online-Käufer, Mobile-Nutzer, lokale Suchende<br />
                  <strong>Custom Audiences:</strong> Website-Besucher, E-Mail-Liste, Lookalike von besten Kunden
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                📊 Google Ads für lokale Werkstätten
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minMax(280px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🔍 Search Ads</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Keywords: "Werkstatt Hamburg", "Autoreparatur", "TÜV"
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>CPC:</strong> €1,50-4,00<br />
                    <strong>Budget:</strong> €300-800/Monat
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>🗺️ Local Service Ads</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Erscheinen ganz oben bei lokalen Suchen
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Pay-per-Lead:</strong> €15-35<br />
                    <strong>Google Garantie</strong> inklusive
                  </div>
                </div>

                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>🎬 YouTube Ads</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Video-Anzeigen vor Auto-Content
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>CPV:</strong> €0,05-0,15<br />
                    <strong>Budget:</strong> €100-300/Monat
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Praxisbeispiel: Social Media Erfolg der Werkstatt Krüger
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Ausgangssituation (März 2024):
              </h3>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Werkstatt Krüger (Düsseldorf) - 18 Mitarbeiter:</strong><br />
                • Keine Social Media Präsenz<br />
                • 85% Stammkunden, nur 15% Neukunden<br />
                • Durchschnittliches Kundenalter: 52 Jahre<br />
                • Marketing-Budget: €0/Monat<br />
                • Monatliche Neukunden: 8-12
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Social Media Strategie (April - Dezember 2024):
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minMax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🎯 Plattform-Focus</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Facebook: 70% Budget</li>
                    <li>Instagram: 20% Budget</li>
                    <li>Google My Business: 10%</li>
                  </ul>
                </div>
                
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>📅 Content-Plan</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>3x/Woche Educational Posts</li>
                    <li>2x/Woche Behind-the-Scenes</li>
                    <li>1x/Woche Kunden-Feature</li>
                  </ul>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>💰 Ad-Budget</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Monat 1-3: €250/Monat</li>
                    <li>Monat 4-6: €450/Monat</li>
                    <li>Monat 7-12: €650/Monat</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>+185%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Neue Facebook Follower</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>2.400 → 6.850 Follower</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📞</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>+220%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Terminanfragen</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>45 → 144 pro Monat</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>+165%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Neue Kunden/Monat</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>10 → 32 Neukunden</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>+38%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Monatsumsatz</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>€42.000 Zusatzumsatz</div>
              </div>
            </div>

            <blockquote style={{
              borderLeft: '4px solid #e91e63',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              background: 'rgba(233, 30, 99, 0.1)',
              padding: '1rem',
              borderRadius: '0 8px 8px 0'
            }}>
              "Social Media hat unsere Werkstatt komplett verändert. Wir erreichen jetzt Kunden, 
              die uns sonst nie gefunden hätten. Das Beste: Die jüngeren Kunden sind oft loyaler 
              und technikaffiner - perfekt für unsere modernen Services."
              <br /><br />
              <strong>— Peter Krüger, Werkstattinhaber</strong>
            </blockquote>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Social Media Tools und Ressourcen
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>📱 Content Creation Tools</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Canva:</strong> Grafiken & Posts (€9.95/Monat)</li>
                  <li><strong>InShot:</strong> Video-Editing (kostenlos/€3.99)</li>
                  <li><strong>VSCO:</strong> Foto-Filter (kostenlos/€19.99/Jahr)</li>
                  <li><strong>Unsplash:</strong> Stock-Fotos (kostenlos)</li>
                </ul>
              </div>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>⏰ Scheduling & Management</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Hootsuite:</strong> Multi-Platform (€49/Monat)</li>
                  <li><strong>Buffer:</strong> Einfach & günstig (€15/Monat)</li>
                  <li><strong>Later:</strong> Visual Planner (€18/Monat)</li>
                  <li><strong>Creator Studio:</strong> Facebook/IG (kostenlos)</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#f59e0b', fontSize: '1.125rem', marginBottom: '1rem' }}>📊 Analytics & Monitoring</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Facebook Insights:</strong> Native Analytics</li>
                  <li><strong>Google Analytics:</strong> Traffic-Tracking</li>
                  <li><strong>Sprout Social:</strong> Profi-Monitoring (€99/Monat)</li>
                  <li><strong>Mention:</strong> Brand-Monitoring (€29/Monat)</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#a855f7', fontSize: '1.125rem', marginBottom: '1rem' }}>🎯 Advertising Tools</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Facebook Ads Manager:</strong> Meta Werbung</li>
                  <li><strong>Google Ads:</strong> Search & Display</li>
                  <li><strong>Canva for Work:</strong> Ad-Designs (€12.99/Monat)</li>
                  <li><strong>AdEspresso:</strong> A/B Testing (€49/Monat)</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ 
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Bereit für Social Media Erfolg?
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Starten Sie noch heute mit einer kostenlosen Social Media Analyse und entdecken Sie, 
              wie Sie mit der richtigen Strategie mehr Kunden erreichen und gewinnen können.
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
                📱 Kostenlose Social Media Beratung
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
                📋 Content-Kalender Template
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
                Emma Wagner
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                Social Media Strategin mit 7 Jahren Erfahrung im B2C Marketing für lokale Dienstleister
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