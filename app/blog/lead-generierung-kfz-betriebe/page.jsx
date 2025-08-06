import { Metadata } from 'next'
import Link from 'next/link'
import SharedLayout, { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'Lead-Generierung für KFZ-Betriebe: +150% mehr Kunden in 6 Monaten | CarBot',
  description: 'Erfahren Sie, wie moderne KFZ-Betriebe ihre Kundenakquise revolutionieren. Bewährte Strategien für mehr Leads, höhere Conversion und nachhaltiges Wachstum.',
  keywords: 'Lead-Generierung KFZ, Kundenakquise Autowerkstatt, Automotive Marketing, Werkstatt Marketing, Neukunden gewinnen, Digital Marketing Automotive',
  openGraph: {
    title: 'Lead-Generierung für KFZ-Betriebe: +150% mehr Kunden in 6 Monaten',
    description: 'Bewährte Strategien und Tools für erfolgreiche Kundenakquise in der Automobilbranche.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/lead-generierung-kfz-betriebe'
  }
}

export default function BlogPost() {
  return (
    <SharedLayout title="Lead-Generierung für KFZ-Betriebe" showNavigation={true}>
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
          <span>Lead-Generierung KFZ-Betriebe</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Marketing & Vertrieb
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Lead-Generierung für KFZ-Betriebe: Wie Sie systematisch mehr Kunden gewinnen
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Schluss mit Zufallskunden! Moderne KFZ-Betriebe setzen auf datengetriebene Lead-Generierung 
            und erreichen planbare Umsatzsteigerungen von über 150% in nur 6 Monaten.
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 8. Januar 2025</span>
            <span>📖 9 Min. Lesezeit</span>
            <span>👤 Sandra Meyer, Marketing-Expertin</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Das Lead-Problem der KFZ-Branche
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              <strong>82% der KFZ-Betriebe</strong> verlassen sich noch immer auf Mundpropaganda und 
              Zufallskunden. Während sich das Kaufverhalten grundlegend gewandelt hat, hinken viele 
              Werkstätten bei der systematischen Neukundengewinnung hinterher.
            </p>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>Die harte Realität:</h4>
              <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.875rem' }}>
                <li>67% der Kunden recherchieren online, bevor sie eine Werkstatt kontaktieren</li>
                <li>Nur 23% der KFZ-Betriebe haben eine wirksame Online-Marketing-Strategie</li>
                <li>85% verlieren potenzielle Kunden durch schlecht optimierte Websites</li>
                <li>Durchschnittliche Kundenakquise-Kosten: €127 pro Neukunde</li>
              </ul>
            </div>
            <p>
              <strong>Die gute Nachricht:</strong> Betriebe mit systematischer Lead-Generierung 
              wachsen 3x schneller und haben 40% niedrigere Akquisitionskosten.
            </p>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Der moderne Lead-Generierungs-Funnel für KFZ-Betriebe
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  Aufmerksamkeit → Lead → Kunde → Stammkunde → Empfehler
                </div>
              </div>
            </div>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Stufe 1: Aufmerksamkeit erzeugen (Traffic generieren)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🎯 Google Ads</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Sofortige Sichtbarkeit bei relevanten Suchanfragen wie "Werkstatt in meiner Nähe"
                </p>
              </div>
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>📱 Social Media</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Facebook, Instagram und TikTok für lokale Reichweite und Vertrauensaufbau
                </p>
              </div>
              <div style={{ 
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>🔍 SEO</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Langfristige organische Sichtbarkeit für kostenlosen Traffic
                </p>
              </div>
            </div>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Stufe 2: Leads konvertieren (Interessenten zu Kontakten)
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li><strong>Lead-Magnets:</strong> Kostenlose Fahrzeug-Checks, Wartungspläne oder Preisrechner</li>
              <li><strong>Landing Pages:</strong> Speziell optimierte Seiten für jede Traffic-Quelle</li>
              <li><strong>Chatbots:</strong> 24/7 verfügbare Erstberatung und Terminvereinbarung</li>
              <li><strong>Call-to-Actions:</strong> Klare Handlungsaufforderungen auf jeder Seite</li>
            </ul>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Stufe 3: Leads zu Kunden entwickeln (Nurturing)
            </h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li><strong>E-Mail-Sequenzen:</strong> Automatisierte Follow-ups mit Mehrwert</li>
              <li><strong>Retargeting:</strong> Gezielte Werbung für Website-Besucher</li>
              <li><strong>Persönliche Beratung:</strong> Qualifizierte Leads erhalten individuelle Angebote</li>
              <li><strong>Social Proof:</strong> Bewertungen und Erfolgsgeschichten zeigen</li>
            </ul>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die 7 effektivsten Lead-Generierungs-Strategien
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                1. Google My Business Optimierung
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Warum effektiv:</strong> 76% der lokalen Suchanfragen führen innerhalb 24h zu einem Werkstattbesuch.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                <strong>Umsetzung:</strong><br />
                ✅ Vollständiges Profil mit Fotos und Services<br />
                ✅ Regelmäßige Posts und Updates<br />
                ✅ Aktive Bewertungssammlung<br />
                ✅ Google Q&A Betreuung<br />
                <strong>Resultat:</strong> +65% lokale Anfragen in 3 Monaten
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                2. Content Marketing mit SEO
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Warum effektiv:</strong> Hochwertige Inhalte positionieren Sie als Experten und ziehen qualifizierte Leads an.
              </p>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Top-Content-Ideen:</strong><br />
                • "Wann sollte ich meine Bremsen prüfen lassen?"<br />
                • "Kosten für TÜV-Nachprüfung - was kommt auf mich zu?"<br />
                • "Winterreifen wechseln: Der richtige Zeitpunkt"<br />
                • "E-Auto Wartung: Das ist anders als beim Verbrenner"
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
                3. Facebook und Instagram Ads
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Warum effektiv:</strong> Präzises Targeting nach Standort, Fahrzeugtyp und Verhalten.
              </p>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Erfolgreiche Ad-Formate:</strong><br />
                🎯 Carousel Ads mit Before/After Reparaturen<br />
                🎯 Video-Testimonials zufriedener Kunden<br />
                🎯 Saisonale Angebote (Wintercheck, Klimaservice)<br />
                <strong>Kosten:</strong> Ø €3,50 pro Lead bei lokaler Zielgruppe
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                4. Landing Pages für spezielle Services
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Warum effektiv:</strong> Dedicated Pages konvertieren 5x besser als allgemeine Website-Seiten.
              </p>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Top-Converting Landing Pages:</strong><br />
                🔧 "TÜV-Hauptuntersuchung: Direkt online Termin buchen"<br />
                🔧 "Kostenloser Wintercheck: Ist Ihr Auto winterfit?"<br />
                🔧 "Klimaanlagen-Service: 30% Rabatt bis Ende März"<br />
                <strong>Conversion-Rate:</strong> 12-18% (vs. 2-4% normale Website)
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                5. E-Mail-Marketing und Automation
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Warum effektiv:</strong> ROI von 1:42 - für jeden investierten Euro 42€ Umsatz.
              </p>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Automatisierte Sequenzen:</strong><br />
                📧 Welcome-Serie für neue Newsletter-Abonnenten<br />
                📧 Wartungserinnerungen basierend auf Fahrzeugdaten<br />
                📧 Follow-up nach Werkstattbesuch<br />
                📧 Reaktivierung inaktiver Kunden<br />
                <strong>Open-Rate:</strong> 28% (Branchendurchschnitt: 18%)
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#06b6d4', fontSize: '1.25rem', marginBottom: '1rem' }}>
                6. Referral-Marketing und Kundenbindung
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Warum effektiv:</strong> Empfohlene Kunden haben 4x höhere Conversion-Raten.
              </p>
              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Referral-Programm Setup:</strong><br />
                🎁 €25 Gutschrift für Empfehler und Neukunden<br />
                🎁 Treuekarten mit Stempel-System<br />
                🎁 Exklusive VIP-Services für Stammkunden<br />
                <strong>Empfehlungsrate:</strong> 34% der Stammkunden empfehlen aktiv weiter
              </div>
            </div>

            <div>
              <h3 style={{ color: '#84cc16', fontSize: '1.25rem', marginBottom: '1rem' }}>
                7. Chatbot und Live-Chat Integration
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Warum effektiv:</strong> 24/7 Verfügbarkeit steigert Lead-Konversion um 67%.
              </p>
              <div style={{
                background: 'rgba(132, 204, 22, 0.1)',
                border: '1px solid rgba(132, 204, 22, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Chatbot-Funktionen:</strong><br />
                💬 Automatische Terminvereinbarung<br />
                💬 FAQ-Beantwortung zu Services und Preisen<br />
                💬 Lead-Qualifikation durch gezielte Fragen<br />
                💬 Weiterleitung an Mitarbeiter bei komplexen Anfragen<br />
                <strong>Response-Zeit:</strong> Sofort (vs. 4+ Stunden E-Mail)
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Erfolgsgeschichte: KFZ Müller & Sohn
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Die traditionelle Werkstatt "KFZ Müller & Sohn" aus Dresden implementierte ab 
              März 2024 eine systematische Lead-Generierungsstrategie. Die Transformation war beeindruckend:
            </p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Ausgangssituation (März 2024):
              </h3>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>15-20 Neukunden pro Monat (nur Mundpropaganda)</li>
                <li>Keine digitale Präsenz außer einfacher Website</li>
                <li>Akquisitionskosten: €145 pro Neukunde</li>
                <li>Monatsumsatz: €28.000</li>
              </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Implementierte Maßnahmen:
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>Monat 1-2:</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem' }}>
                    <li>Google My Business Optimierung</li>
                    <li>Landing Page für TÜV-Service</li>
                    <li>Facebook Business Seite</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>Monat 3-4:</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem' }}>
                    <li>Google Ads Kampagnen</li>
                    <li>E-Mail-Marketing Setup</li>
                    <li>Content-Marketing Blog</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>Monat 5-6:</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem' }}>
                    <li>Chatbot Implementation</li>
                    <li>Referral-Programm</li>
                    <li>Social Media Ads</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>52</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Neukunden/Monat</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>+160% Steigerung</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>€71.500</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Monatsumsatz</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>+155% Steigerung</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>€47</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Akquisitionskosten</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>-68% Reduzierung</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>4.9/5</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Google Bewertung</div>
                <div style={{ color: '#22c55e', fontSize: '0.75rem' }}>187 Bewertungen</div>
              </div>
            </div>

            <blockquote style={{
              borderLeft: '4px solid #22c55e',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '1rem',
              borderRadius: '0 8px 8px 0'
            }}>
              "Ich war zunächst skeptisch, ob digitales Marketing für unsere traditionelle Werkstatt funktioniert. 
              Aber die Zahlen sprechen für sich. Wir haben unseren Umsatz mehr als verdoppelt und 
              arbeiten trotzdem effizienter als je zuvor."
              <br /><br />
              <strong>— Hans-Peter Müller, Geschäftsführer KFZ Müller & Sohn</strong>
            </blockquote>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Ihr 90-Tage Lead-Generierungs-Fahrplan
            </h2>
            
            <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🚀 Tage 1-30: Quick Wins (Sofortige Ergebnisse)
            </h3>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Woche 1:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Google My Business Profil vervollständigen</li>
                  <li>5 bestehende Kunden um Google-Bewertungen bitten</li>
                  <li>Basis-Landing Page für Hauptservice erstellen</li>
                </ul>
              </div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Woche 2-3:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Facebook Business Seite einrichten</li>
                  <li>Erste Google Ads Kampagne starten (Budget: €300/Monat)</li>
                  <li>E-Mail-Sammlung auf Website integrieren</li>
                </ul>
              </div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Woche 4:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Erste Erfolgs-Messung und Optimierung</li>
                  <li>Erwartetes Ergebnis: +25% mehr Anfragen</li>
                </ul>
              </div>
            </div>

            <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
              ⚡ Tage 31-60: Skalierung (Systematischer Ausbau)
            </h3>
            <div style={{ marginBottom: '2rem' }}>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Content-Marketing Blog mit 2 Artikeln/Woche</li>
                <li>E-Mail-Automation für Lead-Nurturing</li>
                <li>Facebook/Instagram Ads A/B Testing</li>
                <li>Chatbot für automatische Terminvereinbarung</li>
                <li>Referral-Programm für bestehende Kunden</li>
                <li><strong>Erwartetes Ergebnis:</strong> +65% mehr qualifizierte Leads</li>
              </ul>
            </div>

            <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🎯 Tage 61-90: Optimierung (Maximale Effizienz)
            </h3>
            <div>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li>Erweiterte Zielgruppen-Segmentierung</li>
                <li>Personalisierte E-Mail-Sequenzen</li>
                <li>Video-Content für Social Media</li>
                <li>Conversion-Rate-Optimierung aller Touchpoints</li>
                <li>CRM-Integration für perfekte Lead-Verfolgung</li>
                <li><strong>Erwartetes Ergebnis:</strong> +120% mehr Umsatz durch Leads</li>
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
              Bereit für systematische Lead-Generierung?
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Starten Sie noch heute mit Ihrem kostenlosen Lead-Audit und entdecken Sie, 
              wie Sie in 90 Tagen deutlich mehr qualifizierte Kunden gewinnen können.
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
                🎯 Kostenloses Lead-Audit
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
                📊 Lead-Rechner
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
                Sandra Meyer
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                Marketing-Expertin mit 9 Jahren Erfahrung in der Kundenakquise für KFZ-Betriebe
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