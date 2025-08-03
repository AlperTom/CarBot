'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function WorkshopLandingPage() {
  const params = useParams()
  const { slug, pageSlug } = params
  
  const [workshop, setWorkshop] = useState(null)
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPage()
  }, [slug, pageSlug])

  async function loadPage() {
    try {
      // Get workshop
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('slug', slug)
        .single()

      if (workshopError) throw workshopError
      setWorkshop(workshopData)

      // Get landing page
      const { data: pageData, error: pageError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('workshop_id', workshopData.id)
        .eq('slug', pageSlug)
        .eq('is_published', true)
        .single()

      if (pageError) throw pageError
      setPage(pageData)

      // Update view count
      await supabase
        .from('landing_pages')
        .update({ 
          view_count: (pageData.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', pageData.id)

    } catch (error) {
      console.error('Error loading page:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Seite wird geladen...</p>
        </div>
      </div>
    )
  }

  if (!workshop || !page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Seite nicht gefunden</h1>
          <p className="text-gray-600">Die angeforderte Seite existiert nicht oder ist nicht veröffentlicht.</p>
        </div>
      </div>
    )
  }

  const content = typeof page.content === 'string' ? JSON.parse(page.content) : page.content

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">
                {workshop.name}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#services" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Leistungen
                </a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Über uns
                </a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Kontakt
                </a>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                  Termin buchen
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {content.hero?.title || workshop.name}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {content.hero?.subtitle || `Ihre zuverlässige Autowerkstatt in ${workshop.city || 'Ihrer Nähe'}`}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  {content.hero?.cta || 'Termin vereinbaren'}
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-colors">
                  Mehr erfahren
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-sm font-medium">👤</span>
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Über 500+ zufriedene Kunden</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold text-gray-800">Professioneller Service</h3>
                    <p className="text-gray-600 mt-2">Für alle Automarken</p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-gray-600">Jahre Erfahrung</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Reparaturen</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24h</div>
                    <div className="text-sm text-gray-600">Service</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Unsere Leistungen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professionelle Autowerkstatt-Services für alle Marken und Modelle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content.services || ['Reparatur', 'Wartung', 'Inspektion', 'TÜV', 'Reifenwechsel', 'Ölwechsel']).map((service, index) => (
              <div key={index} className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service}</h3>
                <p className="text-gray-600 mb-6">
                  Professionelle {service.toLowerCase()} für Ihr Fahrzeug mit modernster Technik und erfahrenen Mechanikern.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  Mehr erfahren 
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    Warum {workshop.name}?
                  </h2>
                  <p className="text-xl text-gray-600">
                    Wir bieten Ihnen erstklassigen Service mit modernster Ausstattung und jahrelanger Erfahrung.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: '⚡', title: 'Schneller Service', desc: 'Kurze Wartezeiten durch optimierte Abläufe' },
                    { icon: '🛡️', title: 'Garantie', desc: 'Umfassende Garantie auf alle Reparaturen' },
                    { icon: '💡', title: 'Moderne Technik', desc: 'Neueste Diagnosegeräte und Werkzeuge' },
                    { icon: '👥', title: 'Erfahrenes Team', desc: 'Zertifizierte Mechaniker mit langjähriger Erfahrung' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl p-8 text-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">CarBot AI Assistant</h3>
                  <p className="text-blue-100 mb-6">
                    Unser intelligenter Chatbot steht Ihnen 24/7 zur Verfügung für Fragen und Terminbuchungen.
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        🤖
                      </div>
                      <div className="text-sm font-medium">CarBot Assistant</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 text-sm">
                      "Hallo! Ich kann Ihnen bei Terminen, Fragen zu Reparaturen und Kostenvoranschlägen helfen. Wie kann ich Ihnen helfen?"
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kontakt & Öffnungszeiten
            </h2>
            <p className="text-xl text-gray-600">
              Besuchen Sie uns oder vereinbaren Sie einen Termin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Adresse</h3>
              <p className="text-gray-600">
                {workshop.address}<br/>
                {workshop.city} {workshop.postal_code}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Telefon</h3>
              <p className="text-gray-600">
                {workshop.phone}<br/>
                <span className="text-sm">Rufen Sie uns an!</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🕒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Öffnungszeiten</h3>
              <div className="text-gray-600 text-sm whitespace-pre-line">
                {workshop.opening_hours || 'Mo-Fr: 8:00-17:00\nSa: 9:00-13:00'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{workshop.name}</h3>
              <p className="text-gray-400">
                Ihre vertrauensvolle Autowerkstatt in {workshop.city}. 
                Professionell, zuverlässig und fair.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Leistungen</h4>
              <ul className="space-y-2 text-gray-400">
                {(content.services || ['Reparatur', 'Wartung', 'Inspektion']).slice(0, 4).map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
              <div className="space-y-2 text-gray-400">
                <p>{workshop.phone}</p>
                <p>{workshop.email}</p>
                <p>{workshop.city}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {workshop.name}. Alle Rechte vorbehalten. | Powered by CarBot</p>
          </div>
        </div>
      </footer>

      {/* CarBot Widget will be automatically loaded here */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.carBotConfig = {
              clientKey: '${workshop.slug}-widget',
              workshopName: '${workshop.name}',
              language: 'de'
            };
          `
        }}
      />
    </div>
  )
}