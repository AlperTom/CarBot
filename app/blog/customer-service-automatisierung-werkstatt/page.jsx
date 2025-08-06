import { Metadata } from 'next'
import Link from 'next/link'
import SharedLayout, { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'Customer Service Automatisierung in der Werkstatt: 24/7 Excellence | CarBot',
  description: 'Erfahren Sie, wie Sie mit intelligenter Automatisierung Ihren Kundenservice revolutionieren. Höhere Zufriedenheit, niedrigere Kosten, 24/7 Verfügbarkeit.',
  keywords: 'Customer Service Automatisierung, Werkstatt Kundenservice, KI Kundensupport, Chatbot Werkstatt, Automatisierung KFZ Service, 24/7 Kundenbetreuung',
  openGraph: {
    title: 'Customer Service Automatisierung in der Werkstatt: 24/7 Excellence',
    description: 'Revolutionieren Sie Ihren Kundenservice mit intelligenter Automatisierung. Mehr Zufriedenheit bei niedrigeren Kosten.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/customer-service-automatisierung-werkstatt'
  }
}

export default function BlogPost() {
  return (
    <SharedLayout title="Customer Service Automatisierung Werkstatt" showNavigation={true}>
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
          <span>Customer Service Automatisierung</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Service Excellence
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Customer Service Automatisierung: Wie moderne Werkstätten 24/7 Excellence schaffen
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Nie wieder verpasste Anrufe, wartende Kunden oder überlastete Mitarbeiter. 
            Intelligente Automatisierung macht erstklassigen Kundenservice rund um die Uhr möglich.
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 9. Januar 2025</span>
            <span>📖 8 Min. Lesezeit</span>
            <span>👤 Maria Schmidt, Service-Expertin</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die Service-Krise in der KFZ-Branche
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Während Kunden heute 24/7 Service erwarten, sind die meisten Werkstätten nur 
              40-45 Stunden pro Woche erreichbar. <strong>Das Ergebnis ist dramatisch:</strong>
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📞</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>73%</div>
                <div style={{ fontSize: '0.875rem' }}>verpasste Anrufe außerhalb der Geschäftszeiten</div>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>4,2h</div>
                <div style={{ fontSize: '0.875rem' }}>durchschnittliche Antwortzeit auf E-Mails</div>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😤</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>42%</div>
                <div style={{ fontSize: '0.875rem' }}>der Kunden sind unzufrieden mit der Erreichbarkeit</div>
              </div>
            </div>

            <p>
              <strong>Die Kosten des schlechten Service:</strong> Untersuchungen zeigen, dass KFZ-Betriebe 
              durchschnittlich <strong>€18.000 pro Jahr</strong> durch unzureichende Kundenbetreuung verlieren.
            </p>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Was ist Customer Service Automatisierung?
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Customer Service Automatisierung nutzt KI und intelligente Software, um 
              Kundenanfragen automatisch zu bearbeiten, zu kategorisieren und zu beantworten. 
              Das System lernt kontinuierlich dazu und wird immer besser.
            </p>
            
            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Die 4 Säulen der Service-Automatisierung:
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{ 
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
                <h4 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>KI-Chatbot</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>24/7 Erstverfügbarkeit</li>
                  <li>Sofortige Antworten auf FAQ</li>
                  <li>Terminvereinbarung</li>
                  <li>Problemdiagnose</li>
                </ul>
              </div>
              
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📧</div>
                <h4 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>Auto-E-Mail</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Intelligente Kategorisierung</li>
                  <li>Automatische Antworten</li>
                  <li>Follow-up Sequenzen</li>
                  <li>Eskalation bei Bedarf</li>
                </ul>
              </div>

              <div style={{ 
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📱</div>
                <h4 style={{ color: '#a855f7', fontSize: '1.125rem', marginBottom: '1rem' }}>SMS & WhatsApp</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Terminbestätigungen</li>
                  <li>Fahrzeug-Updates</li>
                  <li>Rechnungsversand</li>
                  <li>Zufriedenheitsabfragen</li>
                </ul>
              </div>

              <div style={{ 
                background: 'rgba(251, 146, 60, 0.1)',
                border: '1px solid rgba(251, 146, 60, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                <h4 style={{ color: '#fb923c', fontSize: '1.125rem', marginBottom: '1rem' }}>Workflow-Automation</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Auftragsverfolgung</li>
                  <li>Status-Updates</li>
                  <li>Eskalationsmanagement</li>
                  <li>Qualitätssicherung</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Messbare Vorteile der Service-Automatisierung
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>24/7</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Service-Verfügbarkeit</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>+85%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Kundenzufriedenheit</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>-40%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Service-Kosten</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏱️</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>&lt; 1min</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Antwortzeit</div>
              </div>
            </div>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Detaillierte ROI-Analyse für mittelgroße Werkstätten:
            </h3>
            
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>💡 Kosteneinsparungen pro Jahr:</h4>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li><strong>Personal:</strong> -20h/Woche Telefonzeit = €12.000</li>
                <li><strong>Effizienz:</strong> Schnellere Abwicklung = €8.500</li>
                <li><strong>Fehlerreduzierung:</strong> Weniger Missverständnisse = €4.200</li>
                <li><strong>Überstunden:</strong> Automatisierung = €6.800</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '1.5rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>📊 Zusatzumsatz pro Jahr:</h4>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li><strong>Mehr Termine:</strong> 24/7 Buchung = €22.000</li>
                <li><strong>Cross-Selling:</strong> Automatische Empfehlungen = €15.500</li>
                <li><strong>Kundenbindung:</strong> Besserer Service = €18.300</li>
                <li><strong>Neue Kunden:</strong> Positive Bewertungen = €12.700</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die 8 wichtigsten Automatisierungs-Szenarien
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                1. Erste Kundenreaktion (0-60 Sekunden)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> Sofortige Eingangsbestätigung mit Ticketnummer und 
                geschätzter Bearbeitungszeit.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                Beispiel-Automatisierung:<br />
                📧 "Danke für Ihre Anfrage! Ticket #12345 erstellt."<br />
                📧 "Unser KI-Assistent analysiert Ihr Anliegen..."<br />
                📧 "Geschätzte Antwortzeit: 15 Minuten"
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                2. FAQ-Behandlung (Sofort)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> 80% der Standardfragen werden sofort beantwortet.
              </p>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Häufigste automatisierte Antworten:</strong><br />
                • "Was kostet eine Inspektion?" → Sofort Preisliste + Terminbuchung<br />
                • "Haben Sie einen Leihwagen?" → Verfügbarkeit + Reservierung<br />
                • "Wie lange dauert TÜV?" → Zeitplan + Online-Terminbuchung
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
                3. Terminmanagement (24/7)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> Vollständige Terminbuchung, -änderung und -bestätigung.
              </p>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Automatischer Workflow:</strong><br />
                📅 Verfügbare Slots anzeigen → Termin buchen → SMS-Bestätigung<br />
                📅 48h Erinnerung → 24h Erinnerung → Anfahrtsinfos<br />
                📅 Nach Termin: Feedback-Anfrage + Folge-Services
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                4. Auftragsstatus-Updates (Real-time)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> Kunden erhalten automatische Updates über den Reparaturfortschritt.
              </p>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Status-Pipeline:</strong><br />
                🔧 "Fahrzeug in Annahme" → "Diagnose läuft" → "Reparatur begonnen"<br />
                → "Qualitätsprüfung" → "Fahrzeug bereit zur Abholung"
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                5. Eskalationsmanagement (Intelligent)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> Komplexe oder dringende Anfragen werden automatisch priorisiert.
              </p>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Eskalations-Trigger:</strong><br />
                🚨 Notfall-Keywords → Sofort an Meister<br />
                🚨 Unzufriedenheit erkannt → Management-Benachrichtigung<br />
                🚨 Technisches Problem → Fachexperte zugewiesen
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#06b6d4', fontSize: '1.25rem', marginBottom: '1rem' }}>
                6. Proaktiver Service (Predictive)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> System erkennt Servicebedarf bevor Probleme auftreten.
              </p>
              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Predictive Szenarien:</strong><br />
                🔮 TÜV-Termin in 6 Wochen → Automatische Erinnerung<br />
                🔮 Kilometerstand erreicht → Inspektions-Einladung<br />
                🔮 Saisonwechsel → Reifenwechsel-Angebot
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#84cc16', fontSize: '1.25rem', marginBottom: '1rem' }}>
                7. Feedback & Bewertungsmanagement (Systematisch)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> Systematische Sammlung und Bearbeitung von Kundenfeedback.
              </p>
              <div style={{
                background: 'rgba(132, 204, 22, 0.1)',
                border: '1px solid rgba(132, 204, 22, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Feedback-Loop:</strong><br />
                ⭐ 24h nach Service: Bewertungs-Einladung<br />
                ⭐ Positive Bewertung → Google/Facebook Weiterleitung<br />
                ⭐ Negative Bewertung → Sofortige interne Eskalation
              </div>
            </div>

            <div>
              <h3 style={{ color: '#f97316', fontSize: '1.25rem', marginBottom: '1rem' }}>
                8. Cross-Selling & Upselling (KI-gestützt)
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Automatisierung:</strong> Intelligente Empfehlungen basierend auf Fahrzeugdaten und -historie.
              </p>
              <div style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>KI-Empfehlungen:</strong><br />
                💡 Nach Bremsenreparatur → "Reifen prüfen lassen?"<br />
                💡 Bei Wintercheck → "Batterie-Test dazu buchen?"<br />
                💡 Fahrzeug &gt; 8 Jahre → "Zusätzliche Garantie?"
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Praxisbeispiel: AutoCenter Hoffmann
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Das AutoCenter Hoffmann in Stuttgart implementierte ab August 2024 eine vollständige 
              Customer Service Automatisierung. Die Transformation war beeindruckend:
            </p>
            
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>Ausgangssituation (Juli 2024):</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                <li>65% verpasste Anrufe nach Feierabend</li>
                <li>Durchschnittliche E-Mail Antwortzeit: 6,3 Stunden</li>
                <li>Kundenzufriedenheit: 3,4/5 Sterne</li>
                <li>8h/Tag Telefonzeit für Service-Mitarbeiter</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Ergebnisse nach 6 Monaten:</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                <li>92% aller Anfragen sofort bearbeitet</li>
                <li>Durchschnittliche Antwortzeit: 45 Sekunden</li>
                <li>Kundenzufriedenheit: 4,7/5 Sterne</li>
                <li>3h/Tag Telefonzeit (60% Reduktion)</li>
              </ul>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📞</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>+340%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Bearbeitete Anfragen</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>€31.500</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Monatliche Einsparung</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>+28%</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Zusätzlicher Umsatz</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏱️</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>5h</div>
                <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Freigesetzte Arbeitszeit/Tag</div>
              </div>
            </div>

            <blockquote style={{
              borderLeft: '4px solid #06b6d4',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '1rem',
              borderRadius: '0 8px 8px 0'
            }}>
              "Die Service-Automatisierung hat unser Geschäft grundlegend verändert. Unsere 
              Kunden sind begeistert vom 24/7 Service und wir können uns auf die wirklich 
              wichtigen Aufgaben konzentrieren - die Reparatur der Fahrzeuge."
              <br /><br />
              <strong>— Klaus Hoffmann, Geschäftsführer AutoCenter Hoffmann</strong>
            </blockquote>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Implementierungs-Roadmap: In 8 Wochen zum automatisierten Service
            </h2>
            
            <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🚀 Woche 1-2: Foundation Setup
            </h3>
            <div style={{ marginBottom: '2rem' }}>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li><strong>Analyse:</strong> Aktuelle Service-Touchpoints dokumentieren</li>
                <li><strong>FAQ-Sammlung:</strong> Top 50 Kundenanfragen identifizieren</li>
                <li><strong>Chatbot-Grundsetup:</strong> Basis-Antworten definieren</li>
                <li><strong>Team-Briefing:</strong> Mitarbeiter über Änderungen informieren</li>
              </ul>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}>
                💡 <strong>Quick Win:</strong> Bereits nach Woche 2: 40% weniger Routine-Anrufe
              </div>
            </div>

            <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
              ⚡ Woche 3-4: Core Automation
            </h3>
            <div style={{ marginBottom: '2rem' }}>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li><strong>Terminbuchung:</strong> Online-Kalender Integration</li>
                <li><strong>E-Mail-Automation:</strong> Standardantworten und Follow-ups</li>
                <li><strong>SMS-Integration:</strong> Bestätigungen und Erinnerungen</li>
                <li><strong>CRM-Anbindung:</strong> Kundendaten synchronisieren</li>
              </ul>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}>
                📈 <strong>Erwartung:</strong> 70% aller Standardanfragen automatisch bearbeitet
              </div>
            </div>

            <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🎯 Woche 5-6: Advanced Features
            </h3>
            <div style={{ marginBottom: '2rem' }}>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li><strong>KI-Training:</strong> Chatbot mit werkstattspezifischen Daten füttern</li>
                <li><strong>Workflow-Automation:</strong> Status-Updates automatisieren</li>
                <li><strong>Eskalations-Regeln:</strong> Intelligente Weiterleitung einrichten</li>
                <li><strong>Multi-Channel:</strong> WhatsApp Business API integrieren</li>
              </ul>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}>
                🚀 <strong>Milestone:</strong> 85% Automatisierungsgrad erreicht
              </div>
            </div>

            <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🎉 Woche 7-8: Optimization & Launch
            </h3>
            <div>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                <li><strong>Testing:</strong> Alle Szenarien durchspielen und optimieren</li>
                <li><strong>Analytics:</strong> Monitoring und KPI-Dashboard einrichten</li>
                <li><strong>Team-Training:</strong> Mitarbeiter in neuen Prozessen schulen</li>
                <li><strong>Go-Live:</strong> Vollständige Aktivierung mit Monitoring</li>
              </ul>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}>
                🎯 <strong>Ziel:</strong> 24/7 Service Excellence mit 90%+ Kundenzufriedenheit
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
              Bereit für 24/7 Service Excellence?
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Starten Sie noch heute mit Ihrer kostenlosen Service-Analyse und entdecken Sie, 
              wie Automatisierung Ihren Kundenservice revolutionieren kann.
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
                🤖 Service-Demo starten
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
                📊 Automatisierungs-Check
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
                Maria Schmidt
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                Service-Expertin mit 11 Jahren Erfahrung in der Automatisierung von Kundenprozessen
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