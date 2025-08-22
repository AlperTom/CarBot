/**
 * DatenschutzPage - GDPR Compliant Privacy Policy
 * Auto-generates legally compliant Datenschutzerklärung for German workshops
 */

export default function DatenschutzPage({ config }) {
  // Default configuration for demonstration
  const defaultConfig = {
    businessName: "Musterwerkstatt Berlin GmbH",
    ownerName: "Hans Müller",
    address: {
      street: "Hauptstraße 123",
      city: "Berlin", 
      postalCode: "10115",
      country: "Deutschland"
    },
    phone: "+49 30 123456789",
    email: "info@musterwerkstatt-berlin.de",
    website: "www.musterwerkstatt-berlin.de",
    
    // Data Protection Officer (if applicable)
    dataProtectionOfficer: {
      name: "Hans Müller", // Or external DPO
      email: "datenschutz@musterwerkstatt-berlin.de",
      address: "Hauptstraße 123, 10115 Berlin"
    },
    
    // Services that collect data
    dataProcessing: {
      contactForms: true,
      carBotWidget: true,
      googleAnalytics: true,
      googleMaps: true,
      cookieConsent: true,
      appointmentBooking: true,
      newsletter: false,
      socialMedia: false
    },
    
    ...config // Override with provided config
  }

  // Current date for policy
  const lastUpdated = new Date().toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Datenschutzerklärung
          </h1>
          <p className="text-lg text-gray-600">
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß Art. 13, 14 DSGVO
          </p>
          <div className="w-20 h-1 bg-blue-600 mt-4"></div>
        </div>

        {/* Quick Overview */}
        <section className="mb-10 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Überblick - Das Wichtigste in Kürze
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Ihre Rechte</h3>
              <ul className="text-gray-700 space-y-1">
                <li>✓ Auskunft über Ihre Daten</li>
                <li>✓ Berichtigung falscher Daten</li>
                <li>✓ Löschung Ihrer Daten</li>
                <li>✓ Datenübertragbarkeit</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Datenverarbeitung</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Kontaktformulare und Anfragen</li>
                <li>• CarBot Chat-Widget</li>
                <li>• Website-Analytics (Google)</li>
                <li>• Terminbuchungen</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Controller */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            1. Verantwortlicher
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Verantwortliche Stelle</h3>
                <div className="text-gray-700 space-y-1">
                  <p className="font-medium">{defaultConfig.businessName}</p>
                  <p>{defaultConfig.ownerName}</p>
                  <p>{defaultConfig.address.street}</p>
                  <p>{defaultConfig.address.postalCode} {defaultConfig.address.city}</p>
                  <p className="pt-2">
                    <strong>Tel:</strong> <a href={`tel:${defaultConfig.phone}`} className="text-blue-600">{defaultConfig.phone}</a>
                  </p>
                  <p>
                    <strong>E-Mail:</strong> <a href={`mailto:${defaultConfig.email}`} className="text-blue-600">{defaultConfig.email}</a>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Datenschutzbeauftragter</h3>
                <div className="text-gray-700 space-y-1">
                  <p className="font-medium">{defaultConfig.dataProtectionOfficer.name}</p>
                  <p>{defaultConfig.dataProtectionOfficer.address}</p>
                  <p className="pt-2">
                    <strong>E-Mail:</strong> <a href={`mailto:${defaultConfig.dataProtectionOfficer.email}`} className="text-blue-600">
                      {defaultConfig.dataProtectionOfficer.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Processing Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            2. Übersicht der Datenverarbeitung
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Verarbeitete Datenarten</h3>
              <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Kontaktdaten (Name, E-Mail, Telefon)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Fahrzeugdaten (Marke, Modell, Kennzeichen)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Kommunikationsdaten (Chat-Nachrichten)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Nutzungsdaten (Website-Besuche)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Meta-/Kommunikationsdaten (IP-Adressen)</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Terminbuchungsdaten</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Verarbeitungszwecke</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></span>
                  <span><strong>Kontaktaufnahme:</strong> Bearbeitung Ihrer Anfragen und Terminvereinbarungen</span>
                </li>
                <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></span>
                  <span><strong>Kundenservice:</strong> CarBot Chat-Widget für sofortige Hilfe</span>
                </li>
                <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></span>
                  <span><strong>Website-Optimierung:</strong> Verbesserung der Benutzerfreundlichkeit</span>
                </li>
                <li className="flex items-start"><span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2"></span>
                  <span><strong>Rechtliche Verpflichtungen:</strong> Aufbewahrung von Rechnungen und Belegen</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Legal Basis */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            3. Rechtsgrundlagen der Verarbeitung
          </h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-green-600 rounded-full text-white text-sm flex items-center justify-center mr-3">a</span>
                Art. 6 Abs. 1 lit. a DSGVO - Einwilligung
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Verwendung:</strong> Newsletter (falls vorhanden), Marketing-Cookies, nicht-essenzielle Services
                <br />
                <strong>Widerruf:</strong> Jederzeit per E-Mail oder über die Datenschutz-Einstellungen möglich
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-blue-600 rounded-full text-white text-sm flex items-center justify-center mr-3">b</span>
                Art. 6 Abs. 1 lit. b DSGVO - Vertragserfüllung
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Verwendung:</strong> Terminbuchungen, Reparaturaufträge, Kundenverwaltung, Rechnungsstellung
                <br />
                <strong>Zweck:</strong> Erbringung der vereinbarten Werkstatt-Dienstleistungen
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-orange-600 rounded-full text-white text-sm flex items-center justify-center mr-3">f</span>
                Art. 6 Abs. 1 lit. f DSGVO - Berechtigte Interessen
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Verwendung:</strong> Website-Analytics, CarBot Chat-Widget, Sicherheit, Spam-Schutz
                <br />
                <strong>Interesse:</strong> Verbesserung der Website und Optimierung des Kundenservice
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-purple-600 rounded-full text-white text-sm flex items-center justify-center mr-3">c</span>
                Art. 6 Abs. 1 lit. c DSGVO - Rechtliche Verpflichtung
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Verwendung:</strong> Aufbewahrung von Rechnungen, Steuerunterlagen, HU/AU-Dokumentation
                <br />
                <strong>Grundlage:</strong> Handelsgesetzbuch (HGB), Abgabenordnung (AO), StVZO
              </p>
            </div>
          </div>
        </section>

        {/* Data Processing Details */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            4. Detaillierte Informationen zur Datenverarbeitung
          </h2>
          
          {/* Contact Forms */}
          {defaultConfig.dataProcessing.contactForms && (
            <div className="mb-8 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                📝 Kontaktformulare und Anfragen
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Verarbeitete Daten:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Name, Vorname</li>
                    <li>• E-Mail-Adresse</li>
                    <li>• Telefonnummer (optional)</li>
                    <li>• Nachrichteninhalt</li>
                    <li>• Fahrzeugdaten (bei Terminanfragen)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Zweck & Rechtsgrundlage:</h4>
                  <p className="text-gray-600 mb-2">
                    <strong>Zweck:</strong> Bearbeitung Ihrer Anfrage, Terminvereinbarung
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
                  </p>
                  <p className="text-gray-600">
                    <strong>Speicherdauer:</strong> 3 Jahre nach letztem Kontakt
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CarBot Widget */}
          {defaultConfig.dataProcessing.carBotWidget && (
            <div className="mb-8 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                🤖 CarBot Chat-Widget
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Verarbeitete Daten:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Chat-Nachrichten</li>
                    <li>• Zeitstempel</li>
                    <li>• Session-ID</li>
                    <li>• IP-Adresse (anonymisiert)</li>
                    <li>• Fahrzeug-/Serviceanfragen</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Zweck & Rechtsgrundlage:</h4>
                  <p className="text-gray-600 mb-2">
                    <strong>Zweck:</strong> Sofortiger Kundenservice, Lead-Generierung
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                  </p>
                  <p className="text-gray-600">
                    <strong>Speicherdauer:</strong> 12 Monate, dann anonymisiert
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-700">
                <strong>Besonderheit:</strong> Das CarBot-Widget verwendet KI zur Verbesserung der Antworten. 
                Ihre Nachrichten werden verschlüsselt übertragen und nicht für das Training verwendet.
              </div>
            </div>
          )}

          {/* Google Analytics */}
          {defaultConfig.dataProcessing.googleAnalytics && (
            <div className="mb-8 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                📊 Google Analytics
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Verarbeitete Daten:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• IP-Adresse (anonymisiert)</li>
                    <li>• Besuchte Seiten</li>
                    <li>• Verweildauer</li>
                    <li>• Browser/Geräteinformationen</li>
                    <li>• Referrer-URL</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Zweck & Rechtsgrundlage:</h4>
                  <p className="text-gray-600 mb-2">
                    <strong>Zweck:</strong> Website-Optimierung, Nutzerverhalten analysieren
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                  </p>
                  <p className="text-gray-600">
                    <strong>Speicherdauer:</strong> 14 Monate (automatische Löschung)
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded text-sm text-gray-700">
                <strong>Widerspruch:</strong> Sie können Google Analytics jederzeit über die 
                Cookie-Einstellungen deaktivieren oder den 
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" className="text-blue-600 underline">
                  Google Analytics Opt-Out Browser-Add-on
                </a> nutzen.
              </div>
            </div>
          )}
        </section>

        {/* Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            5. Cookies und Tracking-Technologien
          </h2>
          
          <div className="space-y-6">
            <p className="text-gray-700">
              Diese Website verwendet Cookies, um die Funktionalität zu gewährleisten und die Nutzererfahrung zu verbessern.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Notwendige Cookies</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Erforderlich für die Grundfunktionen der Website
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Session-Management</li>
                  <li>• Sicherheitseinstellungen</li>
                  <li>• Cookie-Präferenzen</li>
                </ul>
                <div className="mt-3 text-xs text-green-700 font-medium">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Analyse-Cookies</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Helfen uns, die Website zu verbessern
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Google Analytics</li>
                  <li>• Heatmap-Analyse</li>
                  <li>• Performance-Monitoring</li>
                </ul>
                <div className="mt-3 text-xs text-blue-700 font-medium">
                  Einwilligung erforderlich
                </div>
              </div>

              <div className="border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">🎯 Marketing-Cookies</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ermöglichen personalisierte Inhalte
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Remarketing</li>
                  <li>• Social Media Plugins</li>
                  <li>• Personalisierung</li>
                </ul>
                <div className="mt-3 text-xs text-orange-700 font-medium">
                  Einwilligung erforderlich
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cookie-Verwaltung</h3>
              <p className="text-sm text-gray-600 mb-3">
                Sie können Ihre Cookie-Einstellungen jederzeit ändern:
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                  Cookie-Einstellungen öffnen
                </button>
                <a href="/cookies" className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 transition-colors">
                  Detaillierte Cookie-Richtlinie
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Data Subject Rights */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            6. Ihre Rechte als Betroffener
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-800">Recht auf Auskunft (Art. 15 DSGVO)</h3>
                <p className="text-sm text-gray-600">
                  Erfahren Sie, welche Daten wir über Sie gespeichert haben
                </p>
              </div>
              
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-800">Recht auf Berichtigung (Art. 16 DSGVO)</h3>
                <p className="text-sm text-gray-600">
                  Korrektur falscher oder unvollständiger Daten
                </p>
              </div>
              
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-semibold text-gray-800">Recht auf Löschung (Art. 17 DSGVO)</h3>
                <p className="text-sm text-gray-600">
                  "Recht auf Vergessenwerden" unter bestimmten Voraussetzungen
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-600 pl-4">
                <h3 className="font-semibold text-gray-800">Recht auf Einschränkung (Art. 18 DSGVO)</h3>
                <p className="text-sm text-gray-600">
                  Einschränkung der Verarbeitung bei bestrittener Rechtmäßigkeit
                </p>
              </div>
              
              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-semibold text-gray-800">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
                <p className="text-sm text-gray-600">
                  Übertragung Ihrer Daten an einen anderen Anbieter
                </p>
              </div>
              
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-semibold text-gray-800">Widerspruchsrecht (Art. 21 DSGVO)</h3>
                <p className="text-sm text-gray-600">
                  Widerspruch gegen Verarbeitung aus berechtigtem Interesse
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Wie können Sie Ihre Rechte ausüben?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">
                  📧
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">E-Mail</h4>
                <a href={`mailto:${defaultConfig.dataProtectionOfficer.email}`} className="text-blue-600">
                  {defaultConfig.dataProtectionOfficer.email}
                </a>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">
                  📞
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Telefon</h4>
                <a href={`tel:${defaultConfig.phone}`} className="text-blue-600">
                  {defaultConfig.phone}
                </a>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">
                  📮
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Postweg</h4>
                <p className="text-gray-600 text-xs">
                  {defaultConfig.address.street}<br/>
                  {defaultConfig.address.postalCode} {defaultConfig.address.city}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Complaint Right */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            7. Beschwerderecht
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              Beschwerde bei der Aufsichtsbehörde
            </h3>
            <p className="text-gray-700 mb-4">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über unsere Verarbeitung 
              personenbezogener Daten zu beschweren.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Zuständige Behörde für Berlin:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">Berliner Beauftragte für Datenschutz und Informationsfreiheit</p>
                  <p>Friedrichstr. 219</p>
                  <p>10969 Berlin</p>
                  <p>Telefon: +49 30 13889-0</p>
                  <p>E-Mail: mailbox@datenschutz-berlin.de</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Online-Beschwerde:</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Sie können auch online eine Beschwerde einreichen:
                </p>
                <a 
                  href="https://www.datenschutz-berlin.de/beschwerde" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline hover:no-underline"
                >
                  www.datenschutz-berlin.de/beschwerde
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            8. Datensicherheit
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Technische Schutzmaßnahmen</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  SSL/TLS-Verschlüsselung (https://)
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  Regelmäßige Sicherheits-Updates
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  Firewall und Intrusion Detection
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  Sichere Datenübertragung
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Organisatorische Maßnahmen</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  Mitarbeiterschulungen zum Datenschutz
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  Zugriffskontrollen und Berechtigungen
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  Regelmäßige Datenschutz-Audits
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center mr-3">✓</span>
                  Incident Response Plan
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            9. Änderungen der Datenschutzerklärung
          </h2>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
              aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer 
              Leistungen umzusetzen.
            </p>
            <p className="text-gray-700">
              <strong>Empfehlung:</strong> Besuchen Sie diese Seite regelmäßig, um über eventuelle 
              Änderungen informiert zu bleiben. Bei wesentlichen Änderungen werden wir Sie 
              per E-Mail informieren.
            </p>
          </div>
        </section>

        {/* Contact for Privacy Questions */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            10. Fragen zum Datenschutz?
          </h2>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                🛡️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Wir sind für Sie da!
                </h3>
                <p className="text-gray-700 mb-4">
                  Bei Fragen zum Datenschutz, zur Ausübung Ihrer Rechte oder zu dieser 
                  Datenschutzerklärung kontaktieren Sie uns gerne:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>E-Mail:</strong> 
                    <a href={`mailto:${defaultConfig.dataProtectionOfficer.email}`} className="text-blue-600 ml-2">
                      {defaultConfig.dataProtectionOfficer.email}
                    </a>
                  </p>
                  <p>
                    <strong>Telefon:</strong> 
                    <a href={`tel:${defaultConfig.phone}`} className="text-blue-600 ml-2">
                      {defaultConfig.phone}
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Antwortzeit:</strong> In der Regel innerhalb von 1-2 Werktagen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>
              <strong>Letzte Aktualisierung:</strong> {lastUpdated}
            </p>
            <p>
              Erstellt mit <span className="text-blue-600 font-medium">CarBot</span> - 
              Deutsche Automotive SaaS | carbot.chat | GDPR-konform
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}