'use client'

import Link from 'next/link'
import { useState } from 'react'
import ChatWidget from '../components/ChatWidget'

export default function Home() {
  const [showDemo, setShowDemo] = useState(false)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🚗</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">CarBot</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium">Preise</Link>
            <button 
              onClick={() => setShowDemo(true)}
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Demo
            </button>
            <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 font-medium">Anmelden</Link>
            <Link 
              href="/auth/register" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            KI-gestützte
            <span className="text-blue-600 block mt-2">Kundenberatung</span>
            für Ihre Werkstatt
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            CarBot automatisiert Ihre Kundenberatung, bucht Termine und generiert qualifizierte Leads. 
            24/7 verfügbar in 4 Sprachen - Deutsch, Englisch, Türkisch und Polnisch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              30 Tage kostenlos testen
            </Link>
            <button 
              onClick={() => setShowDemo(true)}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Live Demo ansehen
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-blue-600 text-2xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligente Beratung</h3>
            <p className="text-gray-600 leading-relaxed">
              KI-gestützte Beratung zu Reparaturen, Wartung und Services. 
              Automatische Kostenvoranschläge und Terminvorschläge.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-green-600 text-2xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatische Terminbuchung</h3>
            <p className="text-gray-600 leading-relaxed">
              Kunden können direkt Termine buchen. Automatische Kalender-Integration 
              und Erinnerungen per E-Mail und SMS.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-purple-600 text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600 leading-relaxed">
              Detaillierte Einblicke in Kundeninteraktionen, Lead-Qualität 
              und Conversion-Raten. Optimieren Sie Ihre Strategie.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-language Support */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sprechen Sie die Sprache Ihrer Kunden
            </h2>
            <p className="text-xl text-gray-600">
              CarBot unterstützt automatisch 4 Sprachen für den deutschen Markt
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇩🇪</span>
              </div>
              <h3 className="font-bold text-gray-900">Deutsch</h3>
              <p className="text-gray-600">Muttersprachliche Beratung</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇬🇧</span>
              </div>
              <h3 className="font-bold text-gray-900">English</h3>
              <p className="text-gray-600">International customers</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇹🇷</span>
              </div>
              <h3 className="font-bold text-gray-900">Türkçe</h3>
              <p className="text-gray-600">Türk müşteriler için</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇵🇱</span>
              </div>
              <h3 className="font-bold text-gray-900">Polski</h3>
              <p className="text-gray-600">Dla polskich klientów</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transparente Preise für jede Werkstatt
          </h2>
          <p className="text-xl text-gray-600">
            Starten Sie kostenlos und skalieren Sie mit Ihrem Erfolg
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">49€<span className="text-lg text-gray-500">/Monat</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                100 Gespräche/Monat
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Basis-Analytics
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                E-Mail Support
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-xl border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Beliebt</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">99€<span className="text-lg text-gray-500">/Monat</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                500 Gespräche/Monat
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Terminbuchung
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Prioritäts-Support
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                WhatsApp Integration
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">199€<span className="text-lg text-gray-500">/Monat</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Unbegrenzte Gespräche
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Multi-Standort
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                API Zugang
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Dedicated Support
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/pricing" 
            className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            Alle Preise und Features ansehen →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bereit für die Zukunft der Kundenberatung?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Starten Sie heute und erhöhen Sie Ihre Kundenzufriedenheit und Umsätze
          </p>
          <Link 
            href="/auth/register" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
          >
            30 Tage kostenlos testen - keine Kreditkarte erforderlich
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🚗</span>
                </div>
                <span className="text-xl font-bold">CarBot</span>
              </div>
              <p className="text-gray-400">
                KI-gestützte Kundenberatung für Autowerkstätten in Deutschland.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Preise</Link></li>
                <li><button onClick={() => setShowDemo(true)} className="hover:text-white transition-colors">Demo</button></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Kostenlos testen</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/legal/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
                <li><Link href="/legal/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:support@carbot.de" className="hover:text-white transition-colors">support@carbot.de</a></li>
                <li><a href="tel:+4930123456789" className="hover:text-white transition-colors">+49 30 123 456 789</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarBot. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      {/* Demo ChatWidget */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">CarBot Demo</h3>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-96">
              <ChatWidget 
                clientKey="demo-client" 
                isEmbedded={true}
                onClose={() => setShowDemo(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}