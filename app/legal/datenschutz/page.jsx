export const metadata = {
  title: 'Datenschutzerklärung - CarBot',
  description: 'Datenschutzerklärung für CarBot - KI-gestützter Serviceberater für KFZ-Werkstätten'
}

export default function Datenschutz() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.6,
      color: '#1a202c'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#0070f3' }}>Datenschutzerklärung</h1>
      
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Stand: {new Date().toLocaleDateString('de-DE')}
      </div>

      <section style={{ marginBottom: '30px' }}>
        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlicher für die Datenverarbeitung auf dieser Website ist:<br/>
          <strong>CarBot Services GmbH</strong><br/>
          Musterstraße 123<br/>
          12345 Musterstadt<br/>
          Deutschland<br/>
          E-Mail: datenschutz@carbot.chat<br/>
          Telefon: +49 123 456789
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>2. Datenerfassung beim Chat-Service</h2>
        
        <h3>2.1 Art der erfassten Daten</h3>
        <p>Beim Nutzen unseres Chat-Services erfassen wir folgende Daten:</p>
        <ul>
          <li><strong>Chat-Nachrichten:</strong> Ihre Nachrichten und unsere Antworten</li>
          <li><strong>Kontaktdaten:</strong> Name, Telefonnummer (nur bei freiwilliger Angabe für Rückrufe)</li>
          <li><strong>Technische Daten:</strong> IP-Adresse, Browser-Typ, Betriebssystem</li>
          <li><strong>Nutzungsdaten:</strong> Zeitpunkt der Nutzung, Gesprächsdauer</li>
          <li><strong>Fahrzeugdaten:</strong> Angaben zu Ihrem Fahrzeug (nur bei freiwilliger Angabe)</li>
        </ul>

        <h3>2.2 Rechtsgrundlage</h3>
        <p>Die Verarbeitung erfolgt auf Grundlage:</p>
        <ul>
          <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Erfüllung eines Vertrags (Bereitstellung des Chat-Services)</li>
          <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung (für Rückrufe und erweiterte Services)</li>
          <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigtes Interesse (für technische Funktionalität und Sicherheit)</li>
        </ul>

        <h3>2.3 Zweck der Datenverarbeitung</h3>
        <ul>
          <li>Bereitstellung des KI-gestützten Beratungsservices</li>
          <li>Kontaktaufnahme für Serviceanfragen (bei Einwilligung)</li>
          <li>Verbesserung des Services durch Analyse der Gespräche</li>
          <li>Technische Sicherheit und Funktionalität</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>3. Automatische Datenlöschung</h2>
        <p>
          <strong>Wichtig:</strong> Alle Chat-Daten werden automatisch nach <strong>90 Tagen</strong> 
          unwiderruflich gelöscht. Dies erfolgt vollautomatisch ohne weitere Benachrichtigung.
        </p>
        <ul>
          <li>Chat-Verläufe: 90 Tage nach letzter Nachricht</li>
          <li>Kontaktdaten: 90 Tage nach Erfassung</li>
          <li>Technische Logs: 30 Tage</li>
          <li>Einwilligungsnachweise: 3 Jahre (rechtliche Aufbewahrungspflicht)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>4. Cookies und lokale Speicherung</h2>
        <p>Wir verwenden folgende Arten der lokalen Datenspeicherung:</p>
        
        <h3>4.1 Notwendige Cookies</h3>
        <ul>
          <li><strong>Session-ID:</strong> Für die Zuordnung Ihrer Chat-Nachrichten</li>
          <li><strong>Einwilligung:</strong> Speicherung Ihrer Datenschutz-Präferenzen</li>
        </ul>

        <h3>4.2 Analytische Cookies (optional)</h3>
        <p>Nur mit Ihrer Einwilligung verwenden wir anonymisierte Nutzungsstatistiken zur Verbesserung des Services.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>5. Weitergabe von Daten</h2>
        
        <h3>5.1 An Werkstätten</h3>
        <p>
          Bei konkreten Serviceanfragen mit Ihrer Einwilligung leiten wir folgende Daten 
          an die entsprechende KFZ-Werkstatt weiter:
        </p>
        <ul>
          <li>Name und Telefonnummer (für Rückruf)</li>
          <li>Beschreibung Ihres Anliegens</li>
          <li>Fahrzeugdaten (wenn angegeben)</li>
          <li>Relevante Teile des Chat-Verlaufs</li>
        </ul>

        <h3>5.2 An Drittanbieter</h3>
        <ul>
          <li><strong>OpenAI:</strong> Chat-Nachrichten zur KI-Verarbeitung (anonymisiert)</li>
          <li><strong>Supabase:</strong> Datenbank-Hosting in der EU</li>
          <li><strong>Vercel:</strong> Website-Hosting</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>6. Internationale Datenübertragung</h2>
        <p>
          Bei der Nutzung von OpenAI (USA) für die KI-Verarbeitung erfolgt eine Datenübertragung 
          in die USA auf Grundlage der EU-Standardvertragsklauseln. Ihre Nachrichten werden 
          dabei anonymisiert übertragen.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>7. Ihre Rechte</h2>
        <p>Sie haben folgende Rechte bezüglich Ihrer Daten:</p>
        
        <h3>7.1 Auskunftsrecht (Art. 15 DSGVO)</h3>
        <p>Sie können jederzeit Auskunft über die von uns verarbeiteten Daten verlangen.</p>

        <h3>7.2 Berichtigungsrecht (Art. 16 DSGVO)</h3>
        <p>Sie können die Berichtigung unrichtiger Daten verlangen.</p>

        <h3>7.3 Löschungsrecht (Art. 17 DSGVO)</h3>
        <p>Sie können die sofortige Löschung Ihrer Daten verlangen.</p>

        <h3>7.4 Widerspruchsrecht (Art. 21 DSGVO)</h3>
        <p>Sie können der Verarbeitung Ihrer Daten widersprechen.</p>

        <h3>7.5 Datenübertragbarkeit (Art. 20 DSGVO)</h3>
        <p>Sie können Ihre Daten in einem strukturierten Format erhalten.</p>

        <h3>7.6 Widerruf der Einwilligung</h3>
        <p>
          Sie können Ihre Einwilligung jederzeit widerrufen. Dies berührt nicht die 
          Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>8. Ausübung Ihrer Rechte</h2>
        <p>Zur Ausübung Ihrer Rechte wenden Sie sich an:</p>
        <ul>
          <li><strong>E-Mail:</strong> datenschutz@carbot.chat</li>
          <li><strong>Post:</strong> CarBot Services GmbH, Datenschutz, Musterstraße 123, 12345 Musterstadt</li>
        </ul>
        
        <p>
          <strong>Automatische Löschung:</strong> Sie können auch die sofortige Löschung Ihrer Daten 
          direkt im Chat anfordern, indem Sie "Daten löschen" schreiben.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>9. Datensicherheit</h2>
        <p>Wir setzen umfassende Sicherheitsmaßnahmen ein:</p>
        <ul>
          <li>SSL/TLS-Verschlüsselung für alle Datenübertragungen</li>
          <li>Verschlüsselte Datenspeicherung</li>
          <li>Regelmäßige Sicherheits-Updates</li>
          <li>Zugriffsbeschränkungen und Auditprotokollierung</li>
          <li>Hosting ausschließlich in EU-Rechenzentren (außer OpenAI)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>10. Beschwerderecht</h2>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über unsere 
          Verarbeitung personenbezogener Daten zu beschweren. Die für uns zuständige 
          Aufsichtsbehörde ist:
        </p>
        <p>
          <strong>Landesbeauftragte für Datenschutz und Informationsfreiheit</strong><br/>
          [Adresse wird entsprechend des Firmensitzes angepasst]
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>11. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte 
          Rechtslagen oder Änderungen des Services anzupassen. Bei wesentlichen Änderungen 
          werden wir Sie über die Chat-Oberfläche informieren.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>12. Kontakt</h2>
        <p>
          Bei Fragen zu dieser Datenschutzerklärung oder zum Datenschutz allgemein 
          wenden Sie sich gerne an uns:
        </p>
        <p>
          <strong>CarBot Services GmbH</strong><br/>
          Datenschutzbeauftragte/r<br/>
          E-Mail: datenschutz@carbot.chat<br/>
          Telefon: +49 123 456789
        </p>
      </section>

      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            background: '#0070f3',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Zurück zum Chat
        </a>
      </div>
    </div>
  )
}