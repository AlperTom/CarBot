import { Metadata } from 'next'
import Link from 'next/link'
import SharedLayout, { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'DSGVO-konforme Kundenkommunikation für Werkstätten: Rechtssicher & Effektiv | CarBot',
  description: 'Erfahren Sie, wie Sie als KFZ-Betrieb rechtssicher mit Kundendaten umgehen. DSGVO-Compliance, Datenschutz und sichere Kommunikation einfach erklärt.',
  keywords: 'DSGVO Werkstatt, Datenschutz KFZ-Betrieb, GDPR Automotive, Kundendaten sicher, Rechtssichere Kommunikation, Datenschutz-Grundverordnung',
  openGraph: {
    title: 'DSGVO-konforme Kundenkommunikation für Werkstätten: Rechtssicher & Effektiv',
    description: 'Kompletter Leitfaden für rechtssichere Kundenkommunikation in KFZ-Betrieben nach DSGVO.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/dsgvo-konforme-kundenkommunikation'
  }
}

export default function BlogPost() {
  return (
    <SharedLayout title="DSGVO-konforme Kundenkommunikation" showNavigation={true}>
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
          <span>DSGVO-konforme Kundenkommunikation</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Recht & Compliance
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            DSGVO-konforme Kundenkommunikation: So bleiben Werkstätten rechtssicher
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Datenschutz muss nicht kompliziert sein. Erfahren Sie, wie Sie als KFZ-Betrieb 
            rechtssicher mit Kundendaten umgehen und gleichzeitig effizient kommunizieren.
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 10. Januar 2025</span>
            <span>📖 12 Min. Lesezeit</span>
            <span>👤 Dr. Julia Hoffmann, Datenschutz-Expertin</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Warum DSGVO für Werkstätten kritisch ist
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Seit Mai 2018 ist die DSGVO in Kraft - und die Bußgelder sind real. 
              <strong>Allein 2024 wurden in Deutschland über €145 Millionen</strong> an 
              DSGVO-Bußgeldern verhängt. KFZ-Betriebe sind besonders betroffen, da sie:
            </p>
            
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.75rem' }}>🚨 Hochrisiko-Datenkategorien verarbeiten:</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                <li><strong>Persönliche Identitätsdaten:</strong> Name, Adresse, Telefon, E-Mail</li>
                <li><strong>Fahrzeugdaten:</strong> Kennzeichen, Fahrgestellnummer, Kilometerstand</li>
                <li><strong>Finanzdaten:</strong> Zahlungsinformationen, Finanzierungsdetails</li>
                <li><strong>Verhaltensdaten:</strong> Fahrzeugnutzung, Reparaturhistorie</li>
                <li><strong>Standortdaten:</strong> GPS-Tracking, Pannenhilfe-Koordinaten</li>
              </ul>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>Bis 20 Mio. €</div>
                <div style={{ fontSize: '0.875rem' }}>Maximales DSGVO-Bußgeld</div>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>4% Umsatz</div>
                <div style={{ fontSize: '0.875rem' }}>Alternative Bußgeld-Berechnung</div>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>73%</div>
                <div style={{ fontSize: '0.875rem' }}>der KFZ-Betriebe sind nicht compliant</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die 6 DSGVO-Grundprinzipien für Werkstätten
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{ 
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>1. Rechtmäßigkeit</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Jede Datenverarbeitung braucht eine gesetzliche Grundlage (Art. 6 DSGVO).
                </p>
                <div style={{ fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                  <strong>Werkstatt-Beispiel:</strong> Terminvereinbarung = Vertragserfüllung
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>2. Zweckbindung</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Daten nur für den angegebenen Zweck verwenden.
                </p>
                <div style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                  <strong>Werkstatt-Beispiel:</strong> E-Mail für Rechnung ≠ Newsletter-Marketing
                </div>
              </div>

              <div style={{ 
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📏</div>
                <h3 style={{ color: '#a855f7', fontSize: '1.125rem', marginBottom: '1rem' }}>3. Datenminimierung</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Nur erforderliche Daten erheben und verarbeiten.
                </p>
                <div style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                  <strong>Werkstatt-Beispiel:</strong> Für Ölwechsel keine Geburtsdaten nötig
                </div>
              </div>

              <div style={{ 
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.125rem', marginBottom: '1rem' }}>4. Richtigkeit</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Daten müssen aktuell und korrekt sein.
                </p>
                <div style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                  <strong>Werkstatt-Beispiel:</strong> Regelmäßige Aktualisierung der Kontaktdaten
                </div>
              </div>

              <div style={{ 
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗑️</div>
                <h3 style={{ color: '#06b6d4', fontSize: '1.125rem', marginBottom: '1rem' }}>5. Speicherbegrenzung</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Daten nur so lange speichern wie nötig.
                </p>
                <div style={{ fontSize: '0.75rem', background: 'rgba(6, 182, 212, 0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                  <strong>Werkstatt-Beispiel:</strong> Kundendaten nach 3 Jahren inaktiv löschen
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>6. Sicherheit</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Technische und organisatorische Schutzmaßnahmen.
                </p>
                <div style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                  <strong>Werkstatt-Beispiel:</strong> Verschlüsselung, Zugriffskontrolle, Backups
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Rechtliche Grundlagen für Werkstatt-Kommunikation
            </h2>
            
            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Art. 6 DSGVO: Wann dürfen Sie Kundendaten verarbeiten?
            </h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.75rem' }}>✅ Vertragserfüllung (Art. 6 Abs. 1 lit. b)</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Erlaubt ohne Einwilligung:</strong>
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Terminvereinbarung und -bestätigung</li>
                  <li>Reparaturauftrag und Kostenvoranschlag</li>
                  <li>Rechnungsstellung und Zahlung</li>
                  <li>Garantie- und Gewährleistungsabwicklung</li>
                  <li>Fahrzeug-Abholung und -Rückgabe</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.75rem' }}>✅ Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Erlaubt nach Interessenabwägung:</strong>
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Qualitätssicherung und Kundenzufriedenheit</li>
                  <li>Betrugsprävention und Forderungsmanagement</li>
                  <li>IT-Sicherheit und Systemwartung</li>
                  <li>Betriebsorganisation und -optimierung</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.75rem' }}>⚠️ Einwilligung erforderlich (Art. 6 Abs. 1 lit. a)</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Braucht explizite Zustimmung:</strong>
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Newsletter und Werbung</li>
                  <li>Social Media Tracking</li>
                  <li>Kundenzufriedenheits-Umfragen</li>
                  <li>Datenübertragung an Dritte (z.B. Versicherung)</li>
                </ul>
              </div>
            </div>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Muster-Einwilligungstexte für Werkstätten:
            </h3>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              <p style={{ margin: 0 }}>
                <strong>Newsletter-Einwilligung:</strong><br />
                "☐ Ich möchte den Newsletter der [Werkstatt-Name] erhalten und über 
                Services, Angebote und Termine informiert werden. Die Einwilligung 
                kann ich jederzeit per E-Mail an [email] oder über den Abmeldelink 
                im Newsletter widerrufen."
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Praktische Umsetzung: Die 10 wichtigsten Maßnahmen
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                1. Datenschutzerklärung aktualisieren
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Eine werkstattspezifische Datenschutzerklärung ist Pflicht. Sie muss alle 
                Verarbeitungszwecke transparent erklären.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Must-Have Inhalte:</strong><br />
                ✅ Welche Daten werden erhoben? (Name, Adresse, Fahrzeugdaten...)<br />
                ✅ Warum werden sie erhoben? (Reparatur, Rechnung, Garantie...)<br />
                ✅ Wie lange werden sie gespeichert? (3 Jahre, 10 Jahre...)<br />
                ✅ Wer bekommt Zugriff? (Mitarbeiter, Lieferanten, Behörden...)<br />
                ✅ Welche Rechte haben Kunden? (Auskunft, Löschung, Widerspruch...)
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                2. Einwilligungen rechtskonform einholen
              </h3>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>DSGVO-konforme Einwilligung:</strong><br />
                ✅ <strong>Freiwillig:</strong> Keine Kopplung an andere Services<br />
                ✅ <strong>Spezifisch:</strong> Für jeden Zweck separate Checkbox<br />
                ✅ <strong>Informiert:</strong> Klare Erklärung was passiert<br />
                ✅ <strong>Eindeutig:</strong> Aktive Handlung erforderlich (kein Opt-out)<br />
                ✅ <strong>Widerrufbar:</strong> Einfache Möglichkeit zum Zurückziehen
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
                3. Technische Sicherheitsmaßnahmen implementieren
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>🔐 Verschlüsselung</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>SSL/TLS für Website</li>
                    <li>E-Mail-Verschlüsselung</li>
                    <li>Festplattenverschlüsselung</li>
                  </ul>
                </div>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>👤 Zugriffsschutz</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Starke Passwörter</li>
                    <li>2-Faktor-Authentifizierung</li>
                    <li>Benutzerberechtigungen</li>
                  </ul>
                </div>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>💾 Backup & Recovery</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Regelmäßige Backups</li>
                    <li>Wiederherstellungstests</li>
                    <li>Offsite-Speicherung</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                4. Verarbeitungsverzeichnis führen
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Dokumentation aller Datenverarbeitungsprozesse ist ab 250 Mitarbeitern Pflicht, 
                für kleinere Betriebe aber empfohlen.
              </p>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Beispiel-Eintrag "Terminvereinbarung":</strong><br />
                • <strong>Zweck:</strong> Koordination von Werkstattbesuchen<br />
                • <strong>Kategorien:</strong> Name, Telefon, E-Mail, Fahrzeugdaten<br />
                • <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
                • <strong>Speicherdauer:</strong> 3 Jahre nach letztem Kontakt<br />
                • <strong>Empfänger:</strong> Interne Mitarbeiter, SMS/E-Mail-Provider
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                5. Datenschutz-Folgenabschätzung bei Risiko-Technologien
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Bei neuen Technologien mit hohem Risiko für Betroffene ist eine DSFA erforderlich.
              </p>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>DSFA erforderlich bei:</strong><br />
                ⚠️ KI-Systemen für Kundenanalyse<br />
                ⚠️ Videoüberwachung mit Gesichtserkennung<br />
                ⚠️ Automatisierter Entscheidungsfindung<br />
                ⚠️ Umfassendem Profiling von Kunden<br />
                ⚠️ Systematischer Überwachung öffentlicher Bereiche
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Fallstrick-Analyse: Die 5 häufigsten DSGVO-Verstöße
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ❌ Verstoß #1: Unzulässiges E-Mail-Marketing
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Was passiert:</strong> Newsletter ohne explizite Einwilligung oder 
                Nutzung von Geschäfts-E-Mails für Werbung.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>✅ Richtig machen:</strong><br />
                • Separate Opt-in Checkbox für Newsletter<br />
                • Klare Trennung: Service-E-Mails ≠ Marketing-E-Mails<br />
                • Double-Opt-in Verfahren implementieren<br />
                • Einfache Abmeldemöglichkeit bereitstellen
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ❌ Verstoß #2: Unsichere Datenübertragung
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Was passiert:</strong> Kundendaten per unverschlüsselter E-Mail 
                oder unsichere Cloud-Services.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>✅ Richtig machen:</strong><br />
                • E-Mail-Verschlüsselung (S/MIME oder PGP)<br />
                • DSGVO-konforme Cloud-Anbieter wählen<br />
                • Sichere Datenübertragung (SFTP, HTTPS)<br />
                • AV-Verträge mit allen Dienstleistern abschließen
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ❌ Verstoß #3: Fehlende Löschungsroutinen
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Was passiert:</strong> Kundendaten werden jahrelang ohne Grund aufbewahrt.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>✅ Richtig machen:</strong><br />
                • Löschkonzept entwickeln und dokumentieren<br />
                • Automatische Löschung nach definierten Fristen<br />
                • Jährliche Überprüfung und Bereinigung<br />
                • Ausnahmen klar definieren (Garantie, Steuerrecht)
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ❌ Verstoß #4: Unzureichende Auskunftserteilung
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Was passiert:</strong> Kundenanfragen nach Art. 15 DSGVO werden ignoriert 
                oder unvollständig beantwortet.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>✅ Richtig machen:</strong><br />
                • Standardprozess für Betroffenenrechte etablieren<br />
                • 1-Monat-Frist für Antworten einhalten<br />
                • Vollständige Datenkopie bereitstellen<br />
                • Identitätsprüfung vor Auskunftserteilung
              </div>
            </div>

            <div>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ❌ Verstoß #5: Mangelnde Mitarbeiterschulung
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Was passiert:</strong> Mitarbeiter kennen Datenschutzregeln nicht 
                und verursachen Verstöße.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>✅ Richtig machen:</strong><br />
                • Regelmäßige Datenschutz-Schulungen<br />
                • Klare Arbeitsanweisungen für den Datenumgang<br />
                • Verpflichtung auf Datenschutz dokumentieren<br />
                • Sensibilisierung für typische Risiko-Situationen
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              DSGVO-Compliance Checkliste für Werkstätten
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                📋 Sofort umsetzbar (diese Woche):
              </h3>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>☐ Aktuelle Datenschutzerklärung auf Website veröffentlichen</li>
                  <li>☐ Cookie-Banner mit Einstellungsmöglichkeiten einrichten</li>
                  <li>☐ Alle bestehenden Einwilligungen überprüfen</li>
                  <li>☐ Mitarbeiter über Datenschutz-Grundlagen informieren</li>
                  <li>☐ Notfall-Prozess für Datenpannen definieren</li>
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ⚡ Nächsten 30 Tage:
              </h3>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>☐ Verarbeitungsverzeichnis erstellen</li>
                  <li>☐ AV-Verträge mit allen Dienstleistern abschließen</li>
                  <li>☐ Löschkonzept entwickeln und implementieren</li>
                  <li>☐ Prozess für Betroffenenrechte etablieren</li>
                  <li>☐ IT-Sicherheitsmaßnahmen überprüfen und verbessern</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🎯 Nächsten 90 Tage:
              </h3>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>☐ Datenschutzbeauftragten bestellen (falls erforderlich)</li>
                  <li>☐ Umfassende Mitarbeiterschulungen durchführen</li>
                  <li>☐ DSFA für kritische Verarbeitungen erstellen</li>
                  <li>☐ Externe DSGVO-Auditierung durchführen lassen</li>
                  <li>☐ Notfallplan für Datenpannen testen</li>
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
              Rechtssichere Kundenkommunikation starten?
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Lassen Sie uns Ihre DSGVO-Compliance kostenlos prüfen und zeigen Ihnen, 
              wie Sie rechtssicher und effizient mit Ihren Kunden kommunizieren können.
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
                🔒 Kostenloser DSGVO-Check
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
                📋 Compliance-Checkliste
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
                Dr. Julia Hoffmann
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                Datenschutz-Expertin und Rechtsanwältin mit Spezialisierung auf DSGVO im Automotive-Sektor
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