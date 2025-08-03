export default function Datenschutz() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.6' }}>
      <h1 style={{ marginBottom: '30px', color: '#0070f3' }}>Datenschutzerklärung</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <p><strong>Stand:</strong> {new Date().toLocaleDateString('de-DE')}</p>
        <p><strong>Verantwortlicher:</strong> CarBot GmbH</p>
        <p><strong>Kontakt:</strong> datenschutz@carbot.de</p>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>1. Allgemeine Hinweise</h2>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
          passiert, wenn Sie unsere CarBot-Plattform nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie 
          persönlich identifiziert werden können.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>2. Datenerfassung auf unserer Website</h2>
        
        <h3 style={{ marginBottom: '15px' }}>Wer ist verantwortlich für die Datenerfassung?</h3>
        <p>
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber CarBot GmbH. 
          Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
        </p>

        <h3 style={{ marginBottom: '15px' }}>Wie erfassen wir Ihre Daten?</h3>
        <p>
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um 
          Daten handeln, die Sie in den Chat eingeben.
        </p>
        <p>
          Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor 
          allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
        </p>

        <h3 style={{ marginBottom: '15px' }}>Wofür nutzen wir Ihre Daten?</h3>
        <ul style={{ paddingLeft: '30px' }}>
          <li>Zur Bereitstellung des CarBot Chat-Services</li>
          <li>Zur Beantwortung Ihrer automotive Fragen</li>
          <li>Zur Verbesserung unserer Dienstleistungen</li>
          <li>Zur Gewährleistung der technischen Sicherheit</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>3. Chat-Service und Datenverarbeitung</h2>
        
        <h3 style={{ marginBottom: '15px' }}>Chat-Nachrichten</h3>
        <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
        <p><strong>Zweck:</strong> Bereitstellung des AI-gestützten Automotive-Beratungsservices</p>
        <p><strong>Speicherdauer:</strong> 90 Tage ab letzter Interaktion</p>
        <p><strong>Automatische Löschung:</strong> Alle Chat-Daten werden nach 90 Tagen automatisch und unwiderruflich gelöscht</p>
        
        <h3 style={{ marginBottom: '15px' }}>Einwilligungsbasierte Verarbeitung</h3>
        <p><strong>Kommunikation:</strong> Kontaktaufnahme für Serviceverbesserungen (Art. 6 Abs. 1 lit. a DSGVO)</p>
        <p><strong>Analytics:</strong> Anonyme Nutzungsstatistiken (Art. 6 Abs. 1 lit. f DSGVO - berechtigtes Interesse)</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>4. Ihre Rechte</h2>
        
        <p>Sie haben folgende Rechte:</p>
        <ul style={{ paddingLeft: '30px' }}>
          <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über die von uns verarbeiteten personenbezogenen Daten verlangen</li>
          <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger Daten verlangen</li>
          <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen</li>
          <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen</li>
          <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in einem strukturierten Format erhalten</li>
          <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen</li>
          <li><strong>Widerruf der Einwilligung (Art. 7 DSGVO):</strong> Erteilte Einwilligungen können jederzeit widerrufen werden</li>
        </ul>
        
        <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
          <p><strong>Ihre Rechte ausüben:</strong></p>
          <p>Kontaktieren Sie uns unter: <a href="mailto:datenschutz@carbot.de" style={{ color: '#0070f3' }}>datenschutz@carbot.de</a></p>
          <p>Oder nutzen Sie unsere automatisierte Datenbearbeitung über die API: <code>/api/gdpr/request</code></p>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>5. Datensicherheit</h2>
        
        <h3 style={{ marginBottom: '15px' }}>EU-Hosting und Datenresidenz</h3>
        <p>Alle Daten werden ausschließlich auf Servern innerhalb der Europäischen Union verarbeitet und gespeichert. Eine Übermittlung in Drittländer findet nicht statt.</p>
        
        <h3 style={{ marginBottom: '15px' }}>Technische Sicherheitsmaßnahmen</h3>
        <ul style={{ paddingLeft: '30px' }}>
          <li>SSL/TLS-Verschlüsselung für alle Datenübertragungen</li>
          <li>Verschlüsselung der Datenbank</li>
          <li>Regelmäßige Sicherheitsaudits</li>
          <li>Zugriffskontrolle und Protokollierung</li>
          <li>Automatische Datenlöschung nach 90 Tagen</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>6. Cookies und Tracking</h2>
        
        <p>Diese Website verwendet nur technisch notwendige Cookies für:</p>
        <ul style={{ paddingLeft: '30px' }}>
          <li>Speicherung Ihrer Einwilligungspräferenzen</li>
          <li>Session-Management des Chat-Services</li>
        </ul>
        
        <p>
          Marketing-Cookies oder Tracking-Tools von Drittanbietern werden nicht eingesetzt. 
          Analytics werden nur bei entsprechender Einwilligung und in anonymisierter Form durchgeführt.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>7. Externe Dienste</h2>
        
        <h3 style={{ marginBottom: '15px' }}>OpenAI GPT (AI-Service)</h3>
        <p>
          Für die Bereitstellung der AI-gestützten Antworten nutzen wir OpenAI GPT. 
          Die Verarbeitung erfolgt auf Basis eines Auftragsverarbeitungsvertrags (Art. 28 DSGVO).
        </p>
        <p><strong>Datenübertragung:</strong> Chat-Nachrichten werden verschlüsselt an OpenAI übermittelt</p>
        <p><strong>Speicherdauer bei OpenAI:</strong> Keine dauerhafte Speicherung (Zero Retention Policy)</p>
        <p><strong>Datenschutz:</strong> <a href="https://openai.com/privacy" target="_blank" style={{ color: '#0070f3' }}>OpenAI Privacy Policy</a></p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>8. Beschwerderecht</h2>
        
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über unsere Verarbeitung 
          personenbezogener Daten zu beschweren.
        </p>
        <p>
          <strong>Zuständige Behörde für Deutschland:</strong><br />
          Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit<br />
          Graurheindorfer Str. 153, 53117 Bonn<br />
          <a href="https://www.bfdi.bund.de" target="_blank" style={{ color: '#0070f3' }}>www.bfdi.bund.de</a>
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>9. Änderungen der Datenschutzerklärung</h2>
        
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen 
          rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der 
          Datenschutzerklärung umzusetzen.
        </p>
        <p>
          <strong>Letzte Aktualisierung:</strong> {new Date().toLocaleDateString('de-DE')}
        </p>
      </section>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f1f8e9', borderRadius: '8px', border: '1px solid #4caf50' }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>Datenschutz by Design</h3>
        <p>
          CarBot wurde nach den Prinzipien "Privacy by Design" und "Privacy by Default" entwickelt. 
          Wir verarbeiten nur die minimal notwendigen Daten und löschen diese automatisch nach 90 Tagen.
        </p>
      </div>
    </div>
  )
}
