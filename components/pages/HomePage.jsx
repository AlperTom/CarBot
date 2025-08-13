/**
 * HomePage - Enhanced Landing Page Component
 * Main homepage for automotive workshop websites with template specialization
 * Enhanced with modern parallax and scroll animations
 */

import { AnimatedSection, AnimatedContainer, AnimatedGrid } from '../layout/AnimatedLayout';
import { FadeInOnScroll, StaggeredFadeIn } from '../animations/ScrollAnimations';

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
      {/* Enhanced Hero Section */}
      <AnimatedSection 
        id="hero"
        className={`bg-gradient-to-br ${templateStyles.heroGradient} text-white relative overflow-hidden`}
        spacing="py-20"
        animation="fade-up"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/3 rounded-full blur-3xl animate-float-reverse" style={{ animationDelay: '1s' }} />
        </div>

        <AnimatedContainer>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FadeInOnScroll direction="left" delay={200}>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
                  {heroContent.title}
                </h1>
              </FadeInOnScroll>
              
              <FadeInOnScroll direction="left" delay={400}>
                <p className="text-xl opacity-90 mb-8 drop-shadow-sm">
                  {heroContent.subtitle}
                </p>
              </FadeInOnScroll>
              
              <FadeInOnScroll direction="left" delay={600}>
                <p className="text-lg opacity-80 mb-8 drop-shadow-sm">
                  {defaultConfig.hero.description}
                </p>
              </FadeInOnScroll>
              
              {/* Key Features */}
              <StaggeredFadeIn staggerDelay={150} className="flex flex-wrap gap-4 mb-8">
                {heroContent.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105">
                    <span className="text-sm font-medium">✓ {feature}</span>
                  </div>
                ))}
              </StaggeredFadeIn>

              {/* CTA Buttons */}
              <StaggeredFadeIn staggerDelay={200} className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('contact', { type: 'appointment' })}
                  className="group px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl button-hover"
                >
                  <span className="inline-flex items-center">
                    📅 {defaultConfig.hero.cta.primary}
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => navigate('contact', { type: 'quote' })}
                  className="group px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm transform hover:scale-105 hover:shadow-xl button-hover"
                >
                  <span className="inline-flex items-center">
                    💰 {defaultConfig.hero.cta.secondary}
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </span>
                </button>
              </StaggeredFadeIn>
            </div>

            {/* Hero Image/Graphic */}
            <FadeInOnScroll direction="right" delay={400}>
              <div className="relative">
                <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-500 group">
                  <div className="text-center">
                    <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-500 animate-float">
                      {defaultConfig.templateType === 'electric' ? '⚡' :
                       defaultConfig.templateType === 'premium' ? '🏆' :
                       defaultConfig.templateType === 'family' ? '👨‍👩‍👧‍👦' :
                       defaultConfig.templateType === 'modern' ? '🚗' : '🔧'}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                      {defaultConfig.stats.yearsExperience}+ Jahre Erfahrung
                    </h3>
                    <p className="opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {defaultConfig.stats.customersServed}+ zufriedene Kunden
                    </p>
                  </div>
                </div>

                {/* Floating Contact Info */}
                <FadeInOnScroll direction="up" delay={600}>
                  <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-glow">
                    <div className="text-sm font-semibold mb-1">Schnelle Hilfe?</div>
                    <a 
                      href={`tel:${defaultConfig.phone}`}
                      className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      {defaultConfig.phone}
                    </a>
                  </div>
                </FadeInOnScroll>
              </div>
            </FadeInOnScroll>
          </div>
        </AnimatedContainer>
      </AnimatedSection>

      {/* Enhanced Key Services Section */}
      <AnimatedSection 
        id="services"
        className="bg-gray-50"
        spacing="py-16"
        animation="fade-up"
      >
        <AnimatedContainer>
          <FadeInOnScroll direction="up" delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Unsere wichtigsten Services
              </h2>
              <p className="text-lg text-gray-600">
                Professioneller Kfz-Service für alle Bedürfnisse
              </p>
            </div>
          </FadeInOnScroll>

          <AnimatedGrid cols="md:grid-cols-3" gap="gap-8" staggerDelay={200}>
            {defaultConfig.keyServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 group card-hover transform hover:-translate-y-2">
                <div className={`w-16 h-16 ${templateStyles.iconBg} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl group-hover:animate-scale-pulse">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold text-${templateStyles.accentColor} group-hover:scale-110 transition-transform duration-300 inline-block`}>
                    {service.price}
                  </span>
                  <button
                    onClick={() => navigate('services')}
                    className={`px-4 py-2 text-${templateStyles.accentColor} border border-current rounded-lg hover:bg-current hover:text-white transition-all duration-300 transform hover:scale-105 button-hover`}
                  >
                    Mehr Info
                  </button>
                </div>
              </div>
            ))}
          </AnimatedGrid>

          <FadeInOnScroll direction="up" delay={600}>
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('services')}
                className={`group px-8 py-3 bg-${templateStyles.accentColor} text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 button-hover`}
              >
                <span className="inline-flex items-center">
                  🔧 Alle Services anzeigen
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </FadeInOnScroll>
        </AnimatedContainer>
      </AnimatedSection>

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