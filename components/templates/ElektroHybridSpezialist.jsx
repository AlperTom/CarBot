/**
 * ElektroHybridSpezialist Template
 * Landing page template for electric and hybrid vehicle specialists
 * Optimized for German automotive market and future mobility
 */

import { useState, useEffect } from 'react'

export default function ElektroHybridSpezialist({ 
  workshopName = "ElektroWerkstatt Zukunft",
  location = "München",
  phone = "+49 89 123456789",
  email = "info@elektrowerkstatt-zukunft.de",
  services = [],
  testimonials = [],
  customization = {}
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('elektro')

  const defaultServices = services.length > 0 ? services : [
    {
      icon: "⚡",
      title: "E-Auto Service",
      description: "Spezialisierte Wartung und Reparatur von Elektrofahrzeugen aller Marken",
      features: ["HV-Diagnose", "Batteriecheck", "Ladesystem-Wartung"]
    },
    {
      icon: "🔋",
      title: "Batterie-Service",
      description: "Professionelle Batterieanalyse und Hochvolt-Batteriewartung",
      features: ["Kapazitätstest", "Zellanalyse", "Batterie-Konditionierung"]
    },
    {
      icon: "⚡",
      title: "Hybrid-Systeme",
      description: "Komplette Hybrid-Technologie Betreuung und Optimierung",
      features: ["Dual-Motor Service", "Energiemanagement", "Rekuperation-Check"]
    },
    {
      icon: "🔌",
      title: "Ladeinfrastruktur",
      description: "Installation und Wartung von Ladestationen und Wallboxen",
      features: ["Wallbox Installation", "Ladestation Service", "Smart Charging"]
    },
    {
      icon: "🛠️",
      title: "Software-Updates",
      description: "Fahrzeug-Software Updates und Kalibrierung von E-Systemen",
      features: ["OTA Updates", "System-Kalibrierung", "Diagnose-Software"]
    },
    {
      icon: "🌱",
      title: "Nachhaltigkeit",
      description: "Umweltfreundliche Werkstattlösungen und Recycling-Service",
      features: ["Batterie-Recycling", "Öko-Teile", "CO2-neutrale Wartung"]
    }
  ]

  const defaultTestimonials = testimonials.length > 0 ? testimonials : [
    {
      name: "Dr. Stefan Weber",
      vehicle: "Tesla Model 3",
      rating: 5,
      text: "Endlich eine Werkstatt, die E-Autos wirklich versteht. Kompetente Beratung zur Batterieoptimierung und fairere Preise als beim Hersteller."
    },
    {
      name: "Maria Schneider",
      vehicle: "Toyota Prius Hybrid",
      rating: 5,
      text: "Hier wird mein Hybrid seit 3 Jahren perfekt betreut. Die Experten kennen sich mit beiden Antriebssystemen bestens aus."
    },
    {
      name: "Thomas Müller",
      vehicle: "BMW i3",
      rating: 5,
      text: "Schnelle Diagnose, transparente Kostenvoranschläge und echte E-Mobilität Kompetenz. Kann ich jedem E-Auto Fahrer empfehlen!"
    }
  ]

  // Theme colors for electric/hybrid specialty
  const theme = {
    primary: customization.primaryColor || '#00d4ff', // Electric blue
    secondary: customization.secondaryColor || '#4ade80', // Green for eco
    accent: customization.accentColor || '#8b5cf6', // Purple for innovation
    neutral: '#1f2937',
    light: '#f8fafc'
  }

  const electricServices = [
    "Hochvolt-System Diagnose",
    "E-Motor Wartung & Reparatur", 
    "Batteriemanagement Optimierung",
    "Ladesystem & Wallbox Service",
    "Inverter & Konverter Check",
    "Fahrzeug-Software Updates"
  ]

  const hybridServices = [
    "Dual-Antrieb System Service",
    "Verbrennungsmotor + E-Motor",
    "Hybrid-Batterie Wartung",
    "Rekuperations-System Check", 
    "Energiemanagement Analyse",
    "Start-Stop System Service"
  ]

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold" style={{ color: theme.primary }}>
                ⚡ {workshopName}
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#services" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</a>
                <a href="#technologie" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Technologie</a>
                <a href="#about" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Über uns</a>
                <a href="#contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Kontakt</a>
                <a 
                  href={`tel:${phone}`}
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: theme.primary }}
                >
                  {phone}
                </a>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#services" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Services</a>
              <a href="#technologie" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Technologie</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Über uns</a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Kontakt</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Die Zukunft der
              <span className="block" style={{ color: theme.primary }}>
                E-Mobilität
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Spezialisierte Werkstatt für Elektro- und Hybridfahrzeuge in {location}. 
              Modernste Technologie, zertifizierte HV-Techniker und nachhaltige Lösungen 
              für die Mobilität von morgen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 rounded-lg text-white text-lg font-semibold transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                ⚡ E-Auto Termin buchen
              </button>
              <button 
                className="px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 border-2 hover:bg-gray-50"
                style={{ borderColor: theme.secondary, color: theme.secondary }}
              >
                🔋 Kostenlose Batterie-Analyse
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Electric vs Hybrid Technology */}
      <section id="technologie" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Unsere Technologie-Expertise
            </h2>
            <p className="text-xl text-gray-600">
              Spezialisiert auf beide Antriebssysteme der Zukunft
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('elektro')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'elektro'
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                style={activeTab === 'elektro' ? { backgroundColor: theme.primary } : {}}
              >
                ⚡ Elektro-Fahrzeuge
              </button>
              <button
                onClick={() => setActiveTab('hybrid')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'hybrid'
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                style={activeTab === 'hybrid' ? { backgroundColor: theme.secondary } : {}}
              >
                🔋 Hybrid-Systeme
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-xl shadow-lg transition-all duration-300 ${
              activeTab === 'elektro' ? 'bg-white border-2' : 'bg-gray-50'
            }`} style={activeTab === 'elektro' ? { borderColor: theme.primary } : {}}>
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Reine Elektro-Fahrzeuge
              </h3>
              <p className="text-gray-600 mb-6">
                100% elektrischer Antrieb für emissionsfreie Mobilität. 
                Wir betreuen alle E-Auto Marken mit modernster Diagnosetechnik.
              </p>
              <ul className="space-y-3">
                {electricServices.map((service, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-3" style={{ color: theme.primary }}>✓</span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-8 rounded-xl shadow-lg transition-all duration-300 ${
              activeTab === 'hybrid' ? 'bg-white border-2' : 'bg-gray-50'
            }`} style={activeTab === 'hybrid' ? { borderColor: theme.secondary } : {}}>
              <div className="text-6xl mb-4">🔋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hybrid-Fahrzeuge
              </h3>
              <p className="text-gray-600 mb-6">
                Kombination aus Verbrennungs- und Elektromotor für optimale Effizienz. 
                Komplexe Systeme erfordern spezialisierte Wartung.
              </p>
              <ul className="space-y-3">
                {hybridServices.map((service, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-3" style={{ color: theme.secondary }}>✓</span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Unsere Services
            </h2>
            <p className="text-xl text-gray-600">
              Vollumfassende Betreuung für E-Mobilität
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultServices.map((service, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <span className="mr-2" style={{ color: theme.primary }}>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Focus */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🌱 Nachhaltigkeit & Innovation
            </h2>
            <p className="text-xl text-gray-600">
              Für eine grünere Zukunft der Mobilität
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">♻️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100% Recycling
              </h3>
              <p className="text-gray-600">
                Alle Altbatterien und E-Komponenten werden umweltgerecht entsorgt und recycelt.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                CO2-Neutral
              </h3>
              <p className="text-gray-600">
                Unser Werkstattbetrieb läuft zu 100% mit erneuerbaren Energien - komplett CO2-neutral.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Grüner Strom
              </h3>
              <p className="text-gray-600">
                Kostenlose Aufladung während der Wartung mit 100% Ökostrom aus regionalen Quellen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-gray-600">
              Erfahrungen von E-Mobilität Pionieren
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {defaultTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">({testimonial.rating}/5)</span>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pioniere der E-Mobilität
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Als eine der ersten spezialisierten E-Mobilität Werkstätten in {location} 
                haben wir bereits über 2.000 Elektro- und Hybridfahrzeuge erfolgreich betreut. 
                Unsere HV-zertifizierten Techniker bilden sich kontinuierlich weiter.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: theme.primary }}>2000+</div>
                  <div className="text-sm text-gray-600">E-Autos betreut</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: theme.secondary }}>100%</div>
                  <div className="text-sm text-gray-600">HV-zertifiziert</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: theme.accent }}>24h</div>
                  <div className="text-sm text-gray-600">Notfall-Service</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: theme.primary }}>5★</div>
                  <div className="text-sm text-gray-600">Kundenbewertung</div>
                </div>
              </div>
              <button 
                className="px-8 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-all"
                style={{ backgroundColor: theme.primary }}
              >
                Mehr über uns erfahren
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Unsere Zertifizierungen</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    HV-Technik Zertifikat (BGI 8677)
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    Tesla Approved Service Partner
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    Bosch Car Service E-Mobilität
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    TÜV Süd Qualitätsmanagement
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    Umwelt-Zertifikat ISO 14001
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section id="contact" className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Bereit für die Zukunft?
            </h2>
            <p className="text-xl opacity-90">
              Vereinbaren Sie noch heute einen Termin für Ihr E-Auto oder Hybrid
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold mb-2">Standort</h3>
              <p className="opacity-90">{location}</p>
              <p className="opacity-90">Modernste E-Mobilität Werkstatt</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-semibold mb-2">Hotline</h3>
              <p className="opacity-90">{phone}</p>
              <p className="opacity-90">24/7 Notfall-Service</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-semibold mb-2">E-Mail</h3>
              <p className="opacity-90">{email}</p>
              <p className="opacity-90">Kostenlose Beratung</p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-10 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                ⚡ Jetzt E-Auto Termin buchen
              </button>
              <button 
                className="px-10 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 border-2 border-white hover:bg-white hover:text-gray-900"
              >
                🔋 Kostenlose Batterie-Analyse
              </button>
            </div>
            <p className="mt-4 opacity-75">
              Erste Beratung kostenlos • Transparente Preise • Keine versteckten Kosten
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4" style={{ color: theme.primary }}>
                ⚡ {workshopName}
              </div>
              <p className="text-gray-400 text-sm">
                Ihre Spezialwerkstatt für E-Mobilität und Hybrid-Technologie in {location}. 
                Zertifiziert, nachhaltig und innovativ.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>E-Auto Service</li>
                <li>Hybrid-Wartung</li>
                <li>Batterie-Check</li>
                <li>Ladestation Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Über uns</li>
                <li>Karriere</li>
                <li>Zertifizierungen</li>
                <li>Nachhaltigkeit</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>{phone}</li>
                <li>{email}</li>
                <li>{location}</li>
                <li>24/7 Notfall-Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 {workshopName}. Alle Rechte vorbehalten. | Datenschutz | Impressum</p>
          </div>
        </div>
      </footer>
    </div>
  )
}