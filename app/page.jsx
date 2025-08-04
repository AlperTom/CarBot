'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import ChatWidget from '../components/ChatWidget'

export default function Home() {
  const [showDemo, setShowDemo] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-500 text-white px-4 py-2 rounded-lg z-50"
      >
        Zum Hauptinhalt springen
      </a>
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl blur opacity-20"></div>
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-sm">CarBot</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-gray-100 hover:text-white transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-2 py-1">Preise</Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="text-gray-100 hover:text-white transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-2 py-1"
              >
                Demo
              </button>
              <Link href="/auth/login" className="text-gray-100 hover:text-white transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-2 py-1">Anmelden</Link>
              <Link 
                href="/auth/register" 
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-black px-6 py-2 rounded-lg group-hover:bg-gray-900 transition-colors font-medium">
                  Kostenlos starten
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="main-content" className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-100">Jetzt verfügbar in Deutschland</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white drop-shadow-lg">
              KI-gestützte
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 drop-shadow-lg">
              Kundenberatung
            </span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-gray-200 font-light drop-shadow-md">
              für Autowerkstätten
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
            Automatisieren Sie Ihre Kundenberatung mit KI. Buchen Sie Termine, generieren Sie Leads 
            und bedienen Sie Kunden <span className="text-white font-semibold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">24/7 in 4 Sprachen</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/auth/register" 
              className="relative group w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-4 rounded-2xl"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg text-white hover:scale-105 transition-transform duration-200 shadow-lg">
                30 Tage kostenlos testen
              </div>
            </Link>
            
            <button 
              onClick={() => setShowDemo(true)}
              className="group flex items-center space-x-3 px-8 py-4 rounded-2xl border border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="font-medium text-lg">Live Demo ansehen</span>
            </button>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-300 mb-4">Vertraut von führenden Werkstätten</p>
            <div className="flex justify-center space-x-8 opacity-70 text-gray-300">
              <div className="text-2xl font-bold">BMW</div>
              <div className="text-2xl font-bold">Mercedes</div>
              <div className="text-2xl font-bold">Audi</div>
              <div className="text-2xl font-bold">VW</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white drop-shadow-lg">
              Warum CarBot?
            </span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-sm">
            Modernste KI-Technologie trifft auf jahrelange Automotive-Expertise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:border-white/20 transition-all duration-300">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl blur opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Intelligente KI-Beratung</h3>
              <p className="text-gray-200 leading-relaxed">
                Hochentwickelte KI versteht Fahrzeugprobleme, erstellt automatisch 
                Kostenvoranschläge und schlägt optimale Termine vor.
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:border-white/20 transition-all duration-300">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Nahtlose Terminbuchung</h3>
              <p className="text-gray-200 leading-relaxed">
                Kunden buchen direkt online Termine. Automatische Kalender-Synchronisation 
                und smarte Erinnerungen per E-Mail und SMS.
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:border-white/20 transition-all duration-300">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-teal-500/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl blur opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h3>
              <p className="text-gray-200 leading-relaxed">
                Tiefe Einblicke in Kundenverhalten, Lead-Qualität und ROI-Metriken. 
                Datengetriebene Optimierung Ihrer Werkstatt-Performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-language Support */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white drop-shadow-lg">
              Sprechen Sie die Sprache
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 drop-shadow-lg">
              Ihrer Kunden
            </span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-sm">
            Automatische Spracherkennung und native Unterstützung für den deutschen Markt
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group-hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🇩🇪</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deutsch</h3>
              <p className="text-gray-200">Muttersprachliche Beratung mit regionalen Dialekten</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group-hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🇬🇧</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">English</h3>
              <p className="text-gray-200">Professional support for international customers</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group-hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🇹🇷</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Türkçe</h3>
              <p className="text-gray-200">Türk müşteriler için tam destek</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-white rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group-hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🇵🇱</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Polski</h3>
              <p className="text-gray-200">Kompleksowa obsługa dla polskich klientów</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white drop-shadow-lg">
              Transparente Preise
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 drop-shadow-lg">
              für jede Werkstatt
            </span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-sm">
            Starten Sie kostenlos und skalieren Sie mit Ihrem Erfolg
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">49€</span>
                <span className="text-lg text-gray-400">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100 Gespräche/Monat
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basis-Analytics
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  E-Mail Support
                </li>
              </ul>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Beliebt
              </span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 group-hover:border-white/30 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">99€</span>
                <span className="text-lg text-gray-400">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  500 Gespräche/Monat
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Terminbuchung
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prioritäts-Support
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  WhatsApp Integration
                </li>
              </ul>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">199€</span>
                <span className="text-lg text-gray-400">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unbegrenzte Gespräche
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Multi-Standort
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API Zugang
                </li>
                <li className="flex items-center text-gray-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated Support
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/pricing" 
            className="group inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
          >
            <span>Alle Preise und Features ansehen</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white drop-shadow-lg">
                Bereit für die Zukunft
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 drop-shadow-lg">
                der Kundenberatung?
              </span>
            </h2>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto drop-shadow-sm">
              Starten Sie heute und transformieren Sie Ihre Werkstatt mit KI-gestützter Automatisierung
            </p>
            <Link 
              href="/auth/register" 
              className="relative group inline-block"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 transition-transform duration-200">
                30 Tage kostenlos testen - keine Kreditkarte erforderlich
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl blur opacity-20"></div>
                </div>
                <span className="text-2xl font-bold text-white drop-shadow-sm">CarBot</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                KI-gestützte Kundenberatung für moderne Autowerkstätten in Deutschland.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Produkt</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/pricing" className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-1 py-0.5">Preise</Link></li>
                <li><button onClick={() => setShowDemo(true)} className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-1 py-0.5">Demo</button></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-1 py-0.5">Kostenlos testen</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Rechtliches</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/legal/datenschutz" className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-1 py-0.5">Datenschutz</Link></li>
                <li><Link href="/legal/impressum" className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-1 py-0.5">Impressum</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="mailto:support@carbot.de" className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-1 py-0.5">support@carbot.de</a></li>
                <li><a href="tel:+4930123456789" className="hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 rounded px-1 py-0.5">+49 30 123 456 789</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 CarBot. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      {/* Demo ChatWidget */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 rounded-3xl blur opacity-75"></div>
            <div className="relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">CarBot Demo</h3>
                <button 
                  onClick={() => setShowDemo(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
        </div>
      )}
    </main>
  )
}