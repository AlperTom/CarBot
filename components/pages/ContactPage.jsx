/**
 * ContactPage - Professional Contact Page
 * Complete contact page for German automotive workshops with multiple contact options
 */

import ContactForm from '../shared/ContactForm'

export default function ContactPage({ config }) {
  // Default configuration
  const defaultConfig = {
    businessName: "Musterwerkstatt",
    ownerName: "Hans Müller",
    phone: "+49 30 123456789",
    email: "info@musterwerkstatt.de",
    emergencyPhone: "+49 30 987654321",
    address: {
      street: "Hauptstraße 123",
      city: "Berlin", 
      postalCode: "10115"
    },
    coordinates: {
      lat: 52.5200,
      lng: 13.4050
    },
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745'
    },
    
    // Business hours
    businessHours: {
      monday: { open: "07:00", close: "18:00" },
      tuesday: { open: "07:00", close: "18:00" },
      wednesday: { open: "07:00", close: "18:00" },
      thursday: { open: "07:00", close: "18:00" },
      friday: { open: "07:00", close: "18:00" },
      saturday: { open: "08:00", close: "14:00" },
      sunday: { open: null, close: null } // Closed
    },
    
    // Social media and online presence
    social: {
      website: "https://musterwerkstatt.de",
      facebook: "https://facebook.com/musterwerkstatt",
      instagram: "https://instagram.com/musterwerkstatt",
      google: "https://g.page/musterwerkstatt"
    },
    
    // Contact methods
    contactMethods: [
      {
        icon: '📞',
        title: 'Telefon',
        primary: '+49 30 123456789',
        secondary: 'Mo-Fr 07:00-18:00, Sa 08:00-14:00',
        action: 'tel:+4930123456789',
        color: 'blue'
      },
      {
        icon: '✉️',
        title: 'E-Mail',
        primary: 'info@musterwerkstatt.de',
        secondary: 'Antwort innerhalb von 2 Stunden',
        action: 'mailto:info@musterwerkstatt.de',
        color: 'green'
      },
      {
        icon: '🚨',
        title: 'Notfall',
        primary: '+49 30 987654321',
        secondary: '24/7 Pannenhilfe',
        action: 'tel:+4930987654321',
        color: 'red'
      },
      {
        icon: '💬',
        title: 'WhatsApp',
        primary: '+49 30 123456789',
        secondary: 'Schnelle Antworten',
        action: 'https://wa.me/4930123456789',
        color: 'green'
      }
    ],
    
    ...config
  }

  // Get current day for business hours display
  const currentDay = new Date().toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase()
  const todaysHours = defaultConfig.businessHours[currentDay === 'montag' ? 'monday' :
                                                 currentDay === 'dienstag' ? 'tuesday' :
                                                 currentDay === 'mittwoch' ? 'wednesday' :
                                                 currentDay === 'donnerstag' ? 'thursday' :
                                                 currentDay === 'freitag' ? 'friday' :
                                                 currentDay === 'samstag' ? 'saturday' : 'sunday']

  const isOpen = todaysHours?.open && todaysHours?.close ? (() => {
    const now = new Date()
    const currentTime = now.getHours() * 100 + now.getMinutes()
    const openTime = parseInt(todaysHours.open.replace(':', ''))
    const closeTime = parseInt(todaysHours.close.replace(':', ''))
    return currentTime >= openTime && currentTime <= closeTime
  })() : false

  // Format business hours for display
  const formatBusinessHours = () => {
    const days = [
      { key: 'monday', label: 'Montag' },
      { key: 'tuesday', label: 'Dienstag' },
      { key: 'wednesday', label: 'Mittwoch' },
      { key: 'thursday', label: 'Donnerstag' },
      { key: 'friday', label: 'Freitag' },
      { key: 'saturday', label: 'Samstag' },
      { key: 'sunday', label: 'Sonntag' }
    ]

    return days.map(day => {
      const hours = defaultConfig.businessHours[day.key]
      return {
        day: day.label,
        hours: hours.open && hours.close ? `${hours.open} - ${hours.close}` : 'Geschlossen',
        isToday: currentDay === day.label.toLowerCase()
      }
    })
  }

  const businessHoursDisplay = formatBusinessHours()

  // Color schemes for contact methods
  const colorSchemes = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', button: 'bg-blue-600 hover:bg-blue-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', button: 'bg-green-600 hover:bg-green-700' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', button: 'bg-red-600 hover:bg-red-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', button: 'bg-orange-600 hover:bg-orange-700' }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      
      {/* Header Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Kontakt
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Haben Sie Fragen oder benötigen einen Termin? Wir sind für Sie da! 
          Kontaktieren Sie uns über Ihren bevorzugten Kanal.
        </p>
        
        {/* Current Status */}
        <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold ${
          isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isOpen ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {isOpen ? '🟢 Jetzt geöffnet' : '🔴 Derzeit geschlossen'}
          {todaysHours?.open && todaysHours?.close && (
            <span className="ml-2">
              • Heute: {todaysHours.open} - {todaysHours.close} Uhr
            </span>
          )}
        </div>
      </section>

      {/* Contact Methods */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultConfig.contactMethods.map((method, index) => {
            const colors = colorSchemes[method.color] || colorSchemes.blue
            
            return (
              <div key={index} className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 hover:scale-105`}>
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="font-semibold text-gray-800 mb-1">
                  {method.primary}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {method.secondary}
                </p>
                <a
                  href={method.action}
                  className={`inline-block px-4 py-2 text-white rounded-lg font-medium transition-colors ${colors.button}`}
                  {...(method.action.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  Kontakt
                </a>
              </div>
            )
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        
        {/* Contact Form */}
        <div>
          <ContactForm 
            config={defaultConfig}
            type="general"
          />
        </div>

        {/* Business Information */}
        <div className="space-y-8">
          
          {/* Location & Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              📍 Unsere Werkstatt
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Adresse:</h4>
                <div className="text-gray-600">
                  <div>{defaultConfig.businessName}</div>
                  <div>{defaultConfig.address.street}</div>
                  <div>{defaultConfig.address.postalCode} {defaultConfig.address.city}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${defaultConfig.address.street}, ${defaultConfig.address.postalCode} ${defaultConfig.address.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
                  >
                    🗺️ Route planen
                  </a>
                  <a 
                    href={`https://maps.google.com/?q=${defaultConfig.coordinates.lat},${defaultConfig.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
                  >
                    📱 GPS öffnen
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              ⏰ Öffnungszeiten
            </h3>
            
            <div className="space-y-3">
              {businessHoursDisplay.map((item, index) => (
                <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                  item.isToday ? 'bg-blue-50 border border-blue-200' : ''
                }`}>
                  <span className={`font-medium ${item.isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                    {item.day}:
                  </span>
                  <span className={`${item.isToday ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                    {item.hours}
                  </span>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 bg-red-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-red-800">
                    🚨 Notfall-Hotline:
                  </span>
                  <a 
                    href={`tel:${defaultConfig.emergencyPhone}`}
                    className="text-red-600 font-bold hover:text-red-800 transition-colors"
                  >
                    {defaultConfig.emergencyPhone}
                  </a>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  24/7 Pannenhilfe und Abschleppdienst
                </p>
              </div>
            </div>
          </div>

          {/* Services Highlight */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              🔧 Schnellservice verfügbar
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span>Express-Ölwechsel</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span>Batterie-Check</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span>Reifenwechsel</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span>HU/AU Termine</span>
              </div>
            </div>
            <div className="mt-4">
              <button 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                📅 Express-Termin buchen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🗺️ So finden Sie uns
            </h3>
            <p className="text-gray-600">
              Zentral gelegen mit guter Anbindung und kostenlosen Parkplätzen
            </p>
          </div>
          
          <div className="relative">
            {/* Map Placeholder */}
            <div className="bg-gray-200 h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🗺️</div>
                <div className="text-xl font-semibold mb-2">
                  Interactive Google Maps
                </div>
                <div className="text-sm mb-4">
                  {defaultConfig.address.street}, {defaultConfig.address.city}
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${defaultConfig.address.street}, ${defaultConfig.address.postalCode} ${defaultConfig.address.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  In Google Maps öffnen
                </a>
              </div>
            </div>

            {/* Map Features */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
              <div className="font-semibold text-gray-800 mb-2">🅿️ Parken:</div>
              <div className="text-gray-600 space-y-1">
                <div>✅ Kostenlose Parkplätze</div>
                <div>✅ Behindertengerecht</div>
                <div>✅ Überdachte Plätze</div>
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 text-sm">
              <div className="font-semibold text-gray-800 mb-2">🚌 ÖPNV:</div>
              <div className="text-gray-600 space-y-1">
                <div>Bus 123 (2 Min.)</div>
                <div>S-Bahn S1 (8 Min.)</div>
                <div>U-Bahn U6 (12 Min.)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Quick Info */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-lg text-gray-600">
            Schnelle Antworten auf die wichtigsten Fragen
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              ❓ Brauche ich einen Termin?
            </h3>
            <p className="text-gray-600 text-sm">
              Für größere Reparaturen empfehlen wir einen Termin. Express-Services wie 
              Ölwechsel oder Reifenwechsel sind oft ohne Termin möglich.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              💰 Wie erhalte ich einen Kostenvoranschlag?
            </h3>
            <p className="text-gray-600 text-sm">
              Senden Sie uns eine Nachricht über das Kontaktformular oder rufen Sie an. 
              Bei größeren Reparaturen erstellen wir kostenlos einen detaillierten Kostenvoranschlag.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              🚗 Welche Marken reparieren Sie?
            </h3>
            <p className="text-gray-600 text-sm">
              Wir arbeiten an allen Fahrzeugmarken. Besondere Expertise haben wir bei 
              deutschen und europäischen Marken (VW, BMW, Mercedes, Audi, Opel, Ford).
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              ⏱️ Wie lange dauern Reparaturen?
            </h3>
            <p className="text-gray-600 text-sm">
              Das hängt vom Umfang ab. Kleinere Services (Ölwechsel, Inspektion) dauern 
              1-2 Stunden. Bei größeren Reparaturen informieren wir Sie über die Dauer.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Bereit für den Kontakt?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Egal ob Notfall, Beratung oder Terminvereinbarung – wir sind für Sie da!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`tel:${defaultConfig.phone}`}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              📞 Jetzt anrufen
            </a>
            <a
              href={`https://wa.me/${defaultConfig.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              💬 WhatsApp
            </a>
            <a
              href={`mailto:${defaultConfig.email}`}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              ✉️ E-Mail
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}