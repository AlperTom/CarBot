/**
 * AboutPage - Workshop Story and Team
 * Professional about page for German automotive workshops
 */

export default function AboutPage({ config }) {
  // Default configuration
  const defaultConfig = {
    businessName: "Musterwerkstatt",
    ownerName: "Hans Müller",
    foundedYear: 2008,
    phone: "+49 30 123456789",
    email: "info@musterwerkstatt.de",
    address: {
      street: "Hauptstraße 123",
      city: "Berlin", 
      postalCode: "10115"
    },
    specializations: ['general'], // general, premium, family, modern, electric
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745'
    },
    
    // Workshop story and values
    story: {
      founding: "Gegründet aus Leidenschaft für Automobile und dem Wunsch, ehrliche Werkstattarbeit anzubieten.",
      mission: "Wir sorgen dafür, dass Sie sicher und zuverlässig unterwegs sind - mit fairem Service und transparenten Preisen.",
      vision: "Die vertrauensvollste Werkstatt der Region zu sein, bei der jeder Kunde wie Familie behandelt wird."
    },
    
    // Team members
    team: [
      {
        name: "Hans Müller",
        position: "Werkstattleiter & Inhaber",
        qualifications: ["Kfz-Meister", "HU-Prüfer", "Diagnosetechniker"],
        experience: "25 Jahre",
        specialties: ["Motorreparaturen", "Elektronik-Diagnose"],
        description: "Gründer und Herz der Werkstatt. Experte für komplexe Reparaturen."
      }
    ],
    
    // Certifications and partnerships
    certifications: [
      "TÜV Süd Qualitätsmanagement ISO 9001",
      "Umwelt-Zertifikat ISO 14001",
      "Bosch Car Service Partner",
      "Handwerkskammer Berlin - Mitglied"
    ],
    
    // Workshop stats
    stats: {
      yearsExperience: new Date().getFullYear() - (defaultConfig.foundedYear || 2008),
      customersServed: 5000,
      vehiclesRepaired: 12000,
      satisfactionRate: 98
    },
    
    ...config
  }

  // Generate years of experience
  const yearsOfExperience = new Date().getFullYear() - defaultConfig.foundedYear

  // Workshop values based on specialization
  const getWorkshopValues = () => {
    const baseValues = [
      {
        icon: '🤝',
        title: 'Vertrauen',
        description: 'Ehrliche Beratung und transparente Kostenvoranschläge - keine versteckten Kosten.'
      },
      {
        icon: '🏆',
        title: 'Qualität',
        description: 'Meisterbetrieb mit zertifizierten Technikern und modernster Ausrüstung.'
      },
      {
        icon: '💰',
        title: 'Faire Preise',
        description: 'Beste Qualität zu fairen Preisen - Ihr Budget respektieren wir.'
      },
      {
        icon: '⚡',
        title: 'Zuverlässigkeit',
        description: 'Pünktliche Termine und schnelle Reparaturen - Ihre Zeit ist wertvoll.'
      }
    ]

    // Add specialization-specific values
    if (defaultConfig.specializations.includes('electric')) {
      baseValues.push({
        icon: '🌱',
        title: 'Nachhaltigkeit',
        description: 'Umweltbewusste Reparaturen und Recycling - für eine grünere Zukunft.'
      })
    }

    if (defaultConfig.specializations.includes('family')) {
      baseValues.push({
        icon: '👨‍👩‍👧‍👦',
        title: 'Familienfreundlich',
        description: 'Verständnis für Familienbedürfnisse - flexible Termine und Kinderecke.'
      })
    }

    return baseValues
  }

  const workshopValues = getWorkshopValues()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Über {defaultConfig.businessName}
        </h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {defaultConfig.story.mission}
          </p>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {yearsOfExperience}+
              </div>
              <div className="text-gray-600">Jahre Erfahrung</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {defaultConfig.stats.customersServed.toLocaleString()}+
              </div>
              <div className="text-gray-600">Zufriedene Kunden</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {defaultConfig.stats.vehiclesRepaired.toLocaleString()}+
              </div>
              <div className="text-gray-600">Reparierte Fahrzeuge</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {defaultConfig.stats.satisfactionRate}%
              </div>
              <div className="text-gray-600">Kundenzufriedenheit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Unsere Geschichte
            </h2>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                <strong>Gegründet {defaultConfig.foundedYear}</strong> von {defaultConfig.ownerName}, 
                entstand {defaultConfig.businessName} aus einer klaren Vision: 
                {defaultConfig.story.founding}
              </p>
              <p className="leading-relaxed">
                Was als kleine Werkstatt in {defaultConfig.address.city} begann, ist heute eine 
                der vertrauensvollsten Adressen für Kfz-Service in der Region. Über die Jahre 
                haben wir uns durch ehrliche Arbeit, faire Preise und kompetenten Service 
                das Vertrauen unserer Kunden erarbeitet.
              </p>
              <p className="leading-relaxed">
                {defaultConfig.story.vision} Jedes Fahrzeug, das zu uns kommt, behandeln wir 
                mit derselben Sorgfalt, als wäre es unser eigenes.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                className="px-6 py-3 rounded-lg text-white font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: defaultConfig.theme.primary }}
              >
                📞 Jetzt kontaktieren
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                🏢 Werkstatt besichtigen
              </button>
            </div>
          </div>
          
          {/* Workshop Image Placeholder */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-gray-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🏢</div>
                <div className="text-lg font-medium">
                  {defaultConfig.businessName}
                </div>
                <div className="text-sm">
                  Seit {defaultConfig.foundedYear}
                </div>
              </div>
            </div>
            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {defaultConfig.stats.satisfactionRate}%
              </div>
              <div className="text-xs text-gray-600">
                Kundenzufriedenheit
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-20 bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Unsere Werte
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Diese Prinzipien leiten uns in allem, was wir tun
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workshopValues.map((value, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Unser Team
          </h2>
          <p className="text-lg text-gray-600">
            Lernen Sie die Experten kennen, die sich um Ihr Fahrzeug kümmern
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {defaultConfig.team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Profile Image Placeholder */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-48 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {member.description}
                </p>
                
                {/* Qualifications */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Qualifikationen:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {member.qualifications.map((qual, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Specialties */}
                {member.specialties && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Spezialgebiete:
                    </h4>
                    <div className="text-xs text-gray-600">
                      {member.specialties.join(' • ')}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 flex items-center">
                  <span>🏆 {member.experience} Berufserfahrung</span>
                </div>
              </div>
            </div>
          ))}

          {/* Join Team Card */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Wir suchen Verstärkung!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Werde Teil unseres Teams und arbeite in einer familiären Atmosphäre 
              mit modernster Ausstattung.
            </p>
            <button 
              className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: defaultConfig.theme.primary }}
            >
              Stellenangebote
            </button>
          </div>
        </div>
      </section>

      {/* Certifications & Partnerships */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Zertifizierungen & Partnerschaften
          </h2>
          <p className="text-lg text-gray-600">
            Qualität und Kompetenz, die Sie vertrauen können
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Certifications */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              🏆 Zertifizierungen
            </h3>
            <ul className="space-y-3">
              {defaultConfig.certifications.map((cert, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  {cert}
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Promise */}
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              ✅ Unser Qualitätsversprechen
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                <span>2 Jahre Garantie auf alle Reparaturen</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                <span>Nur Originalteile und hochwertige Ersatzteile</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                <span>Kostenlose Nachbesserung bei Mängeln</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                <span>Transparente Kostenvoranschläge</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 text-lg">✓</span>
                <span>24h Pannenhilfe für unsere Kunden</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Workshop Equipment & Technology */}
      <section className="mb-20 bg-gray-900 text-white rounded-2xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Modernste Ausstattung
          </h2>
          <p className="text-lg opacity-90">
            Professionelle Werkzeuge für professionelle Arbeit
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold mb-2">
              Diagnose-Computer
            </h3>
            <p className="opacity-80 text-sm">
              Modernste OBD-Diagnosegeräte für alle Fahrzeugmarken und präzise Fehlererkennung
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold mb-2">
              Hebebühnen
            </h3>
            <p className="opacity-80 text-sm">
              4-Säulen-Hebebühnen und Grube für komfortable Arbeiten an der Fahrzeugunterseite
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">
              Spezialwerkzeuge
            </h3>
            <p className="opacity-80 text-sm">
              Herstellerspezifische Werkzeuge und Software für fachgerechte Reparaturen
            </p>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sie finden uns hier
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-blue-600 text-xl mr-3 mt-1">📍</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {defaultConfig.address.street}
                  </div>
                  <div className="text-gray-600">
                    {defaultConfig.address.postalCode} {defaultConfig.address.city}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-blue-600 text-xl mr-3">📞</span>
                <a 
                  href={`tel:${defaultConfig.phone}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {defaultConfig.phone}
                </a>
              </div>
              
              <div className="flex items-center">
                <span className="text-blue-600 text-xl mr-3">✉️</span>
                <a 
                  href={`mailto:${defaultConfig.email}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {defaultConfig.email}
                </a>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Öffnungszeiten:
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Mo - Fr:</span>
                  <span>07:00 - 18:00 Uhr</span>
                </div>
                <div className="flex justify-between">
                  <span>Sa:</span>
                  <span>08:00 - 14:00 Uhr</span>
                </div>
                <div className="flex justify-between">
                  <span>So:</span>
                  <span>Geschlossen</span>
                </div>
                <div className="flex justify-between text-orange-600 font-medium">
                  <span>24/7:</span>
                  <span>Pannenhilfe</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Placeholder */}
          <div className="relative">
            <div className="bg-gray-200 rounded-2xl aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="font-medium">Google Maps</div>
                <div className="text-sm">
                  {defaultConfig.address.city}
                </div>
              </div>
            </div>
            <button className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:shadow-lg transition-shadow">
              🧭 Route planen
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Lernen Sie uns persönlich kennen!
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Besuchen Sie uns in der Werkstatt und überzeugen Sie sich selbst von 
            unserer Arbeit, unserem Team und unserer modernen Ausstattung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              📅 Besichtigungstermin
            </button>
            <a 
              href={`tel:${defaultConfig.phone}`}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              📞 {defaultConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}