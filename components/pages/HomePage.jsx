/**
 * HomePage - Landing Page Component
 * Main homepage for automotive workshop websites with template specialization
 */

export default function HomePage({ config, navigate }) {
  // Default configuration
  const defaultConfig = {
    businessName: "Musterwerkstatt",
    tagline: "Ihre vertrauensvolle Kfz-Werkstatt",
    phone: "+49 30 123456789",
    email: "info@musterwerkstatt.de",
    address: {
      street: "Hauptstraße 123",
      city: "Berlin",
      postalCode: "10115"
    },
    templateType: 'general', // general, premium, family, modern, electric
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745'
    },
    
    // Hero section content
    hero: {
      title: "Willkommen bei {businessName}",
      subtitle: "Professioneller Kfz-Service für alle Fahrzeugmarken",
      description: "Meisterbetrieb mit über 15 Jahren Erfahrung. Ehrliche Beratung, faire Preise und zuverlässiger Service.",
      cta: {
        primary: "Termin vereinbaren",
        secondary: "Kostenvoranschlag"
      }
    },
    
    // Key services highlight
    keyServices: [
      {
        icon: '🔍',
        title: 'Inspektion & HU/AU',
        description: 'TÜV-Termine und regelmäßige Wartung',
        price: 'ab 89€'
      },
      {
        icon: '🔧',
        title: 'Reparaturen',
        description: 'Alle Reparaturen von Motor bis Bremsen',
        price: 'Kostenvoranschlag'
      },
      {
        icon: '🛞',
        title: 'Reifen-Service',
        description: 'Wechsel, Einlagerung und Montage',
        price: 'ab 29€'
      }
    ],
    
    // Social proof
    stats: {
      yearsExperience: 15,
      customersServed: 5000,
      satisfactionRate: 98
    },
    
    ...config
  }

  // Get template-specific styling and content
  const getTemplateStyles = () => {
    const styles = {
      general: {
        heroGradient: 'from-blue-600 to-blue-800',
        accentColor: 'blue-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      premium: {
        heroGradient: 'from-gray-900 to-gray-700',
        accentColor: 'yellow-500',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      },
      family: {
        heroGradient: 'from-green-600 to-green-800',
        accentColor: 'green-600',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      modern: {
        heroGradient: 'from-purple-600 to-purple-800',
        accentColor: 'purple-600',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      electric: {
        heroGradient: 'from-emerald-600 to-emerald-800',
        accentColor: 'emerald-600',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      }
    }
    return styles[defaultConfig.templateType] || styles.general
  }

  const templateStyles = getTemplateStyles()

  // Get template-specific hero content
  const getHeroContent = () => {
    const content = {
      general: {
        title: `Willkommen bei ${defaultConfig.businessName}`,
        subtitle: "Professioneller Kfz-Service für alle Fahrzeugmarken",
        features: ["Meisterbetrieb", "Faire Preise", "Schneller Service"]
      },
      premium: {
        title: `${defaultConfig.businessName} - Exzellenz in der Kfz-Technik`,
        subtitle: "Premium-Werkstatt für anspruchsvolle Fahrzeuge",
        features: ["Luxus-Spezialist", "Originalteile", "Höchste Qualität"]
      },
      family: {
        title: `${defaultConfig.businessName} - Ihre Familienwerkstatt`,
        subtitle: "Vertrauen und Service für die ganze Familie",
        features: ["Familienfreundlich", "Transparente Preise", "Kinderecke"]
      },
      modern: {
        title: `${defaultConfig.businessName} - Modern. Effizient. Zuverlässig.`,
        subtitle: "Innovative Werkstatt mit modernster Technik",
        features: ["Modernste Ausstattung", "Digital Service", "Express-Termine"]
      },
      electric: {
        title: `${defaultConfig.businessName} - Elektro & Hybrid Spezialist`,
        subtitle: "Die Zukunft der Mobilität - schon heute",
        features: ["Elektro-Expertise", "Umweltbewusst", "Nachhaltig"]
      }
    }
    return content[defaultConfig.templateType] || content.general
  }

  const heroContent = getHeroContent()

  return (
    <div>
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${templateStyles.heroGradient} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                {heroContent.title}
              </h1>
              <p className="text-xl opacity-90 mb-8">
                {heroContent.subtitle}
              </p>
              <p className="text-lg opacity-80 mb-8">
                {defaultConfig.hero.description}
              </p>
              
              {/* Key Features */}
              <div className="flex flex-wrap gap-4 mb-8">
                {heroContent.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                    <span className="text-sm font-medium">✓ {feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('contact', { type: 'appointment' })}
                  className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  📅 {defaultConfig.hero.cta.primary}
                </button>
                <button
                  onClick={() => navigate('contact', { type: 'quote' })}
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  💰 {defaultConfig.hero.cta.secondary}
                </button>
              </div>
            </div>

            {/* Hero Image/Graphic */}
            <div className="relative">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-8xl mb-4">
                    {defaultConfig.templateType === 'electric' ? '⚡' :
                     defaultConfig.templateType === 'premium' ? '🏆' :
                     defaultConfig.templateType === 'family' ? '👨‍👩‍👧‍👦' :
                     defaultConfig.templateType === 'modern' ? '🚗' : '🔧'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {defaultConfig.stats.yearsExperience}+ Jahre Erfahrung
                  </h3>
                  <p className="opacity-90">
                    {defaultConfig.stats.customersServed}+ zufriedene Kunden
                  </p>
                </div>
              </div>

              {/* Floating Contact Info */}
              <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 rounded-lg p-4 shadow-lg">
                <div className="text-sm font-semibold mb-1">Schnelle Hilfe?</div>
                <a 
                  href={`tel:${defaultConfig.phone}`}
                  className="text-lg font-bold text-blue-600 hover:text-blue-800"
                >
                  {defaultConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Unsere wichtigsten Services
            </h2>
            <p className="text-lg text-gray-600">
              Professioneller Kfz-Service für alle Bedürfnisse
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {defaultConfig.keyServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${templateStyles.iconBg} rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold text-${templateStyles.accentColor}`}>
                    {service.price}
                  </span>
                  <button
                    onClick={() => navigate('services')}
                    className={`px-4 py-2 text-${templateStyles.accentColor} border border-current rounded-lg hover:bg-current hover:text-white transition-colors`}
                  >
                    Mehr Info
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('services')}
              className={`px-8 py-3 bg-${templateStyles.accentColor} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
            >
              🔧 Alle Services anzeigen
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Warum {defaultConfig.businessName}?
            </h2>
            <p className="text-lg text-gray-600">
              Das macht uns zur ersten Wahl für Ihre Kfz-Reparaturen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className={`w-20 h-20 bg-${templateStyles.accentColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Meisterbetrieb
              </h3>
              <p className="text-gray-600">
                Zertifizierte Qualität durch erfahrene Kfz-Meister und modernste Ausstattung.
              </p>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 bg-${templateStyles.accentColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Faire Preise
              </h3>
              <p className="text-gray-600">
                Transparente Kostenvoranschläge ohne versteckte Kosten - Vertrauen durch Ehrlichkeit.
              </p>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 bg-${templateStyles.accentColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Schneller Service
              </h3>
              <p className="text-gray-600">
                Express-Termine für dringende Reparaturen - Ihre Mobilität hat Priorität.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className={`text-4xl font-bold text-${templateStyles.accentColor} mb-2`}>
                  {defaultConfig.stats.yearsExperience}+
                </div>
                <div className="text-gray-600">Jahre Erfahrung</div>
              </div>
              <div>
                <div className={`text-4xl font-bold text-${templateStyles.accentColor} mb-2`}>
                  {defaultConfig.stats.customersServed.toLocaleString()}+
                </div>
                <div className="text-gray-600">Zufriedene Kunden</div>
              </div>
              <div>
                <div className={`text-4xl font-bold text-${templateStyles.accentColor} mb-2`}>
                  {defaultConfig.stats.satisfactionRate}%
                </div>
                <div className="text-gray-600">Kundenzufriedenheit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className={`py-16 bg-gradient-to-r ${templateStyles.heroGradient} text-white`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bereit für professionellen Kfz-Service?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Vereinbaren Sie noch heute einen Termin oder fordern Sie einen Kostenvoranschlag an.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${defaultConfig.phone}`}
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              📞 {defaultConfig.phone}
            </a>
            <button
              onClick={() => navigate('contact')}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors"
            >
              📩 Kontakt aufnehmen
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}