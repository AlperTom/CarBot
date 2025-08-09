/**
 * ServicesPage - Professional Services Overview
 * Detailed services page for German automotive workshops
 */

export default function ServicesPage({ config }) {
  // Default configuration
  const defaultConfig = {
    businessName: "Musterwerkstatt",
    phone: "+49 30 123456789",
    email: "info@musterwerkstatt.de",
    specializations: ['general'], // general, premium, family, modern, electric
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745'
    },
    
    // Services configuration
    services: {
      inspections: true,
      repairs: true,
      maintenance: true,
      tires: true,
      brakes: true,
      engine: true,
      transmission: true,
      electrical: true,
      bodywork: false, // Not all workshops offer this
      towing: false
    },
    
    // Pricing display
    showPricing: true,
    priceRange: "€€", // €, €€, €€€
    
    ...config
  }

  // Comprehensive service catalog for German automotive workshops
  const serviceCategories = [
    {
      id: 'inspections',
      title: 'Inspektionen & Prüfungen',
      icon: '📋',
      description: 'Gesetzlich vorgeschriebene Untersuchungen und regelmäßige Prüfungen',
      color: 'blue',
      services: [
        {
          name: 'Hauptuntersuchung (HU)',
          description: 'Komplette technische Überprüfung nach StVZO',
          price: 'ab 89€',
          duration: '45-60 min',
          features: ['Bremsprüfung', 'Lichttest', 'Abgasuntersuchung', 'Fahrwerk', 'Lenkung']
        },
        {
          name: 'Abgasuntersuchung (AU)',
          description: 'Überprüfung der Abgaswerte und Emissionen',
          price: 'ab 49€',
          duration: '20-30 min',
          features: ['OBD-Diagnose', 'Abgasmessung', 'Partikelfilter-Check']
        },
        {
          name: 'Inspektion nach Herstellervorgabe',
          description: 'Wartung nach Inspektionsplan des Fahrzeugherstellers',
          price: 'ab 159€',
          duration: '2-4 Std.',
          features: ['Ölwechsel', 'Filter ersetzen', 'Flüssigkeiten prüfen', 'Bremsencheck']
        },
        {
          name: 'Gebrauchtwagen-Check',
          description: 'Umfassende Bewertung für Fahrzeugkauf/-verkauf',
          price: 'ab 89€',
          duration: '60-90 min',
          features: ['120-Punkte-Check', 'Elektronik-Diagnose', 'Wertermittlung']
        }
      ]
    },
    {
      id: 'repairs',
      title: 'Reparaturen',
      icon: '🔧',
      description: 'Professionelle Reparaturen aller Fahrzeugkomponenten',
      color: 'red',
      services: [
        {
          name: 'Motor-Reparaturen',
          description: 'Komplette Motorinstandsetzung und Einzelreparaturen',
          price: 'nach Aufwand',
          duration: '1-5 Tage',
          features: ['Motorrevisionen', 'Zylinderkopf', 'Steuerkette/Zahnriemen', 'Turbolader']
        },
        {
          name: 'Getriebe-Service',
          description: 'Reparatur und Wartung von Schalt- und Automatikgetrieben',
          price: 'nach Aufwand',
          duration: '1-3 Tage',
          features: ['Getriebereparatur', 'Kupplungswechsel', 'Ölwechsel', 'Elektronik']
        },
        {
          name: 'Bremsen-Service',
          description: 'Komplette Bremsenanlage - Sicherheit hat Priorität',
          price: 'ab 89€',
          duration: '1-3 Std.',
          features: ['Bremsbeläge/-scheiben', 'Bremsflüssigkeit', 'ABS-System', 'Handbremse']
        },
        {
          name: 'Fahrwerk & Lenkung',
          description: 'Reparatur und Einstellung von Fahrwerk und Lenkung',
          price: 'ab 69€',
          duration: '1-4 Std.',
          features: ['Stoßdämpfer', 'Federn', 'Spurstangen', 'Achsvermessung']
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'Wartung & Service',
      icon: '🛠️',
      description: 'Regelmäßige Wartung für optimale Fahrzeugleistung',
      color: 'green',
      services: [
        {
          name: 'Ölservice',
          description: 'Motoröl- und Filterwechsel nach Herstellervorgabe',
          price: 'ab 49€',
          duration: '30-45 min',
          features: ['Motoröl', 'Ölfilter', 'Luftfilter', 'Füllstandskontrolle']
        },
        {
          name: 'Klimaanlagen-Service',
          description: 'Wartung und Reparatur der Klimaanlage',
          price: 'ab 89€',
          duration: '1-2 Std.',
          features: ['Kältemittel auffüllen', 'Filter wechseln', 'Desinfektion', 'Dichtigkeitsprüfung']
        },
        {
          name: 'Batterie & Lichtmaschine',
          description: 'Elektrische Anlage prüfen und warten',
          price: 'ab 29€',
          duration: '30-60 min',
          features: ['Batterie testen', 'Lichtmaschine prüfen', 'Beleuchtung', 'Anlasser']
        },
        {
          name: 'Wintercheck',
          description: 'Fahrzeug winterfest machen - November bis März',
          price: 'ab 39€',
          duration: '30-45 min',
          features: ['Frostschutz prüfen', 'Batterie testen', 'Beleuchtung', 'Heizung']
        }
      ]
    },
    {
      id: 'tires',
      title: 'Reifen & Räder',
      icon: '🛞',
      description: 'Reifenservice, Einlagerung und Räderwechsel',
      color: 'orange',
      services: [
        {
          name: 'Reifenwechsel',
          description: 'Sommer-/Winterreifen wechseln und einlagern',
          price: 'ab 29€',
          duration: '30-45 min',
          features: ['Räderwechsel', 'Einlagerung', 'Profiltiefe messen', 'Luftdruck prüfen']
        },
        {
          name: 'Reifenmontage',
          description: 'Neue Reifen auf Felgen montieren und auswuchten',
          price: 'ab 15€/Reifen',
          duration: '15-30 min/Reifen',
          features: ['Montage', 'Auswuchten', 'Ventile erneuern', 'Luftdruckkontrolle']
        },
        {
          name: 'Räder-Einlagerung',
          description: 'Professionelle Lagerung Ihrer Reifen',
          price: 'ab 49€/Saison',
          duration: '-',
          features: ['Trockene Lagerung', 'Beschriftung', 'Zustandsprüfung', 'Reinigung']
        }
      ]
    },
    {
      id: 'electrical',
      title: 'Elektronik & Diagnose',
      icon: '⚡',
      description: 'Moderne Fahrzeugelektronik und Computerdiagnose',
      color: 'purple',
      services: [
        {
          name: 'Fehlerdiagnose',
          description: 'Umfassende Computerdiagnose aller Steuergeräte',
          price: 'ab 59€',
          duration: '30-60 min',
          features: ['OBD-Diagnose', 'Fehlerspeicher', 'Live-Daten', 'Aktuatortests']
        },
        {
          name: 'Software-Updates',
          description: 'Steuergeräte-Updates und Programmierungen',
          price: 'nach Aufwand',
          duration: '1-3 Std.',
          features: ['ECU-Updates', 'Codierungen', 'Adaptionen', 'Kalibrierungen']
        },
        {
          name: 'Elektrik-Reparaturen',
          description: 'Reparatur elektrischer Komponenten und Verkabelung',
          price: 'nach Aufwand',
          duration: 'variabel',
          features: ['Kabelreparatur', 'Sensoren', 'Aktoren', 'Sicherungen']
        }
      ]
    }
  ]

  // Filter services based on workshop configuration
  const availableServices = serviceCategories.filter(category => 
    defaultConfig.services[category.id] !== false
  )

  // Color schemes for different categories
  const colorSchemes = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-600' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: 'text-orange-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: 'text-purple-600' }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Unsere Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Professionelle Kfz-Services für alle Fahrzeugmarken. Von der Inspektion bis zur kompletten 
          Reparatur - Ihr Fahrzeug ist bei uns in den besten Händen.
        </p>
        <div className="flex justify-center items-center mt-8 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">15+</div>
            <div className="text-sm text-gray-600">Jahre Erfahrung</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">5000+</div>
            <div className="text-sm text-gray-600">Zufriedene Kunden</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">24h</div>
            <div className="text-sm text-gray-600">Pannenhilfe</div>
          </div>
        </div>
      </div>

      {/* Quick Contact Bar */}
      <div className="bg-blue-600 text-white rounded-lg p-6 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Schnelle Hilfe benötigt?
            </h2>
            <p className="opacity-90">
              Rufen Sie uns an oder vereinbaren Sie online einen Termin
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href={`tel:${defaultConfig.phone}`}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              📞 {defaultConfig.phone}
            </a>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              📅 Online-Termin
            </button>
          </div>
        </div>
      </div>

      {/* Services Categories */}
      <div className="space-y-16">
        {availableServices.map((category) => {
          const colors = colorSchemes[category.color] || colorSchemes.blue
          
          return (
            <section key={category.id} className={`${colors.bg} rounded-2xl p-8`}>
              {/* Category Header */}
              <div className="text-center mb-12">
                <div className={`text-6xl mb-4 ${colors.icon}`}>
                  {category.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {category.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {category.services.map((service, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {service.name}
                      </h3>
                      {defaultConfig.showPricing && service.price && (
                        <div className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-semibold`}>
                          {service.price}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    
                    {service.features && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          Leistungen:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>⏱️ Dauer: {service.duration}</span>
                      <button 
                        className={`px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity`}
                        style={{ backgroundColor: defaultConfig.theme.primary }}
                      >
                        Termin buchen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Why Choose Us Section */}
      <section className="mt-20 bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Warum {defaultConfig.businessName}?
          </h2>
          <p className="text-lg text-gray-600">
            Diese Vorteile sprechen für unsere Werkstatt
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Meisterbetrieb
            </h3>
            <p className="text-gray-600">
              Zertifizierte Qualität durch Kfz-Meister mit über 15 Jahren Erfahrung
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Faire Preise
            </h3>
            <p className="text-gray-600">
              Transparente Kostenvoranschläge ohne versteckte Kosten - Vertrauen durch Ehrlichkeit
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Schneller Service
            </h3>
            <p className="text-gray-600">
              Express-Service für dringende Reparaturen - Ihr Mobilität hat Priorität
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Service Banner */}
      <section className="mt-16 bg-red-600 text-white rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          🚨 Panne oder Notfall?
        </h2>
        <p className="text-lg opacity-90 mb-6">
          24/7 Pannenhilfe und Abschleppdienst für unsere Kunden
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={`tel:${defaultConfig.phone}`}
            className="px-8 py-4 bg-white text-red-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            📞 Notfall-Hotline: {defaultConfig.phone}
          </a>
          <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-red-600 transition-colors">
            📍 GPS-Position senden
          </button>
        </div>
      </section>

      {/* Brands We Service */}
      <section className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Wir reparieren alle Marken
          </h2>
          <p className="text-lg text-gray-600">
            Spezialisiert auf deutsche und europäische Fahrzeuge
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
          {['Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Opel', 'Ford', 'Renault', 'Peugeot'].map((brand, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-gray-400">
                  {brand.substring(0, 2)}
                </span>
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {brand}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Bereit für Ihren Service-Termin?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Vereinbaren Sie noch heute einen Termin - online oder telefonisch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              📅 Online-Terminbuchung
            </button>
            <a 
              href={`tel:${defaultConfig.phone}`}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              📞 Jetzt anrufen
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}