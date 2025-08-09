/**
 * ImpressumPage - German Legal Notice (§5 TMG compliant)
 * Auto-generates legally compliant Impressum for automotive workshops
 */

export default function ImpressumPage({ config }) {
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
    
    // German Legal Requirements
    legal: {
      businessForm: "GmbH", // GmbH, UG, e.K., etc.
      businessRegistration: "HRB 12345 B", // Handelsregistereintrag
      registrationCourt: "Amtsgericht Charlottenburg", // Registergericht
      taxNumber: "12/345/67890", // Steuernummer
      vatId: "DE123456789", // Umsatzsteuer-ID
      managingDirector: "Hans Müller", // Geschäftsführer
      
      // Craft/Trade Registration
      chamberOfCrafts: "Handwerkskammer Berlin", // Handwerkskammer
      craftNumber: "12345", // Handwerksrollennummer
      profession: "Kraftfahrzeugtechniker-Handwerk", // Gewerbebezeichnung
      professionalTitle: "Kfz-Meister", // Berufsbezeichnung
      supervisoryAuthority: "Bezirksamt Mitte von Berlin", // Aufsichtsbehörde
      
      // Insurance (if applicable)
      professionalLiability: {
        insurer: "Allianz Versicherung AG",
        coverage: "1.000.000 EUR",
        validityArea: "Deutschland/EU"
      },
      
      // Regulatory Information
      regulations: [
        "Handwerksordnung (HwO)",
        "Straßenverkehrs-Zulassungs-Ordnung (StVZO)",
        "Kraftfahrzeugsteuergesetz (KraftStG)"
      ]
    },
    
    // Contact Person for Legal Issues
    legalContact: {
      name: "Hans Müller",
      role: "Geschäftsführer",
      email: "legal@musterwerkstatt-berlin.de"
    },
    
    ...config // Override with provided config
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Impressum
          </h1>
          <p className="text-lg text-gray-600">
            Angaben gemäß § 5 TMG (Telemediengesetz)
          </p>
          <div className="w-20 h-1 bg-blue-600 mt-4"></div>
        </div>

        {/* Business Information */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Unternehmensinformationen
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Firmenname</h3>
              <p className="text-gray-700 text-lg font-medium mb-2">
                {defaultConfig.businessName}
              </p>
              <p className="text-gray-600">
                {defaultConfig.legal.businessForm && `Rechtsform: ${defaultConfig.legal.businessForm}`}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Geschäftsführung</h3>
              <p className="text-gray-700">
                {defaultConfig.legal.managingDirector || defaultConfig.ownerName}
              </p>
              {defaultConfig.legal.professionalTitle && (
                <p className="text-gray-600 text-sm mt-1">
                  {defaultConfig.legal.professionalTitle}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Address and Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Kontakt
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Anschrift</h3>
              <div className="text-gray-700 space-y-1">
                <p>{defaultConfig.address.street}</p>
                <p>{defaultConfig.address.postalCode} {defaultConfig.address.city}</p>
                <p>{defaultConfig.address.country}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Kontaktdaten</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm w-20">Telefon:</span>
                  <a 
                    href={`tel:${defaultConfig.phone}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {defaultConfig.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm w-20">E-Mail:</span>
                  <a 
                    href={`mailto:${defaultConfig.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {defaultConfig.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm w-20">Website:</span>
                  <span className="text-gray-700">{defaultConfig.website}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Registration */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Registereintrag
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Handelsregister</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registernummer:</span>
                  <span className="font-medium">{defaultConfig.legal.businessRegistration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registergericht:</span>
                  <span>{defaultConfig.legal.registrationCourt}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Handwerksrolle</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kammer:</span>
                  <span>{defaultConfig.legal.chamberOfCrafts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nummer:</span>
                  <span className="font-medium">{defaultConfig.legal.craftNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Information */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Steuerliche Angaben
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Steuernummer</h3>
              <p className="text-gray-700 font-medium text-lg">
                {defaultConfig.legal.taxNumber}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Finanzamt Berlin Mitte/Tiergarten
              </p>
            </div>
            
            {defaultConfig.legal.vatId && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Umsatzsteuer-ID</h3>
                <p className="text-gray-700 font-medium text-lg">
                  {defaultConfig.legal.vatId}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  gem. § 27 a Umsatzsteuergesetz
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Professional Information */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Berufsrechtliche Angaben
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Gewerbebezeichnung</h3>
              <p className="text-gray-700">{defaultConfig.legal.profession}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Aufsichtsbehörde</h3>
              <p className="text-gray-700">{defaultConfig.legal.supervisoryAuthority}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Geltende Rechtsvorschriften</h3>
              <ul className="text-gray-700 space-y-1">
                {defaultConfig.legal.regulations.map((regulation, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {regulation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Professional Liability Insurance */}
        {defaultConfig.legal.professionalLiability && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Berufshaftpflichtversicherung
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Versicherer</h3>
                  <p className="text-gray-700">{defaultConfig.legal.professionalLiability.insurer}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Deckungssumme</h3>
                  <p className="text-gray-700 font-medium">{defaultConfig.legal.professionalLiability.coverage}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Geltungsbereich</h3>
                  <p className="text-gray-700">{defaultConfig.legal.professionalLiability.validityArea}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Legal Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Verantwortlich für den Inhalt
          </h2>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {defaultConfig.legalContact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {defaultConfig.legalContact.name}
                </h3>
                <p className="text-gray-600">{defaultConfig.legalContact.role}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Anschrift wie oben angegeben
                </p>
                <a 
                  href={`mailto:${defaultConfig.legalContact.email}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  {defaultConfig.legalContact.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Haftungsausschluss
          </h2>
          
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Haftung für Inhalte</h3>
            <p className="mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
              fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
              rechtswidrige Tätigkeit hinweisen.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Haftung für Links</h3>
            <p className="mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
              der Seiten verantwortlich.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Urheberrecht</h3>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </section>

        {/* Last Updated */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>Stand: {new Date().toLocaleDateString('de-DE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p>
              Erstellt mit <span className="text-blue-600 font-medium">CarBot</span> - 
              Deutsche Automotive SaaS
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}