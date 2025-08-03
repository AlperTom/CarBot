'use client';

import React, { useState } from 'react';
import { getStoredWorkshopData } from '@/lib/auth';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfekt für kleine Werkstätten',
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        'Bis zu 100 Kundengespräche/Monat',
        'Grundlegende KI-Serviceberatung',
        'E-Mail-Support',
        'DSGVO-konforme Datenspeicherung',
        'Basis-Analytics Dashboard',
        'Mobile App Zugang'
      ],
      limitations: [
        'Keine Terminbuchung',
        'Standardisierte Antworten'
      ],
      cta: 'Kostenlos testen',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal für wachsende Betriebe',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Bis zu 500 Kundengespräche/Monat',
        'Erweiterte KI-Serviceberatung',
        'Intelligente Terminbuchung',
        'Prioritäts-Support',
        'Erweiterte Analytics',
        'Individuelle Anpassungen',
        'WhatsApp Integration',
        'Kostenvoranschlag-Generator',
        'Multi-Standort Verwaltung'
      ],
      limitations: [],
      cta: 'Jetzt starten',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Für große Werkstattketten',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Unbegrenzte Kundengespräche',
        'KI-Training auf Ihre Daten',
        'Dedizierter Account Manager',
        '24/7 Premium Support',
        'Custom Integrationen',
        'White-Label Lösung',
        'API-Zugang',
        'Erweiterte Sicherheitsfeatures',
        'Compliance-Reporting',
        'Schulungen & Onboarding'
      ],
      limitations: [],
      cta: 'Kontakt aufnehmen',
      popular: false
    }
  ];

  // Handle checkout process
  const handleCheckout = async (planId) => {
    try {
      setLoading(planId);
      setError('');

      // Get workshop data
      const { workshop } = getStoredWorkshopData();
      
      if (!workshop) {
        // Redirect to registration if no workshop found
        window.location.href = `/auth/register?plan=${planId}&billing=${isAnnual ? 'year' : 'month'}`;
        return;
      }

      // For enterprise plan, redirect to contact
      if (planId === 'enterprise') {
        window.location.href = '/contact?plan=enterprise';
        return;
      }

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingInterval: isAnnual ? 'year' : 'month',
          workshopData: {
            id: workshop.id,
            name: workshop.name,
            businessType: workshop.business_type,
          },
          customerData: {
            email: workshop.owner_email,
            name: workshop.name,
            phone: workshop.phone,
            address: workshop.address,
            city: workshop.city,
            postalCode: workshop.postal_code,
            country: 'DE',
            gdprConsent: true,
            marketingConsent: false,
          },
          trialDays: 14,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout-Fehler');
      }

      const { url } = await response.json();
      window.location.href = url;

    } catch (error) {
      console.error('Checkout error:', error);
      setError(`Fehler beim Starten des Checkout-Prozesses: ${error.message}`);
    } finally {
      setLoading('');
    }
  };

  // Handle trial start
  const handleTrialStart = () => {
    window.location.href = '/auth/register?trial=true';
  };

  const faqs = [
    {
      question: 'Gibt es eine kostenlose Testversion?',
      answer: 'Ja! Alle Pläne können 14 Tage kostenlos getestet werden. Keine Kreditkarte erforderlich. Sie erhalten sofortigen Zugang zu allen Features Ihres gewählten Plans.',
      highlight: true
    },
    {
      question: 'Wie schnell kann ich CarBot implementieren?',
      answer: 'Die Einrichtung dauert nur 5 Minuten. Unser deutsches Onboarding-Team hilft Ihnen persönlich bei der optimalen Konfiguration für Ihre Werkstatt. Bereits am ersten Tag sehen Sie erste Ergebnisse.'
    },
    {
      question: 'Ist CarBot DSGVO-konform und sicher?',
      answer: 'Absolut. CarBot wurde speziell für den deutschen Markt entwickelt und erfüllt alle DSGVO-Anforderungen. Alle Daten werden ausschließlich in deutschen, TÜV-zertifizierten Rechenzentren gespeichert. Wir sind ISO 27001 und TISAX zertifiziert.'
    },
    {
      question: 'Kann ich jederzeit kündigen?',
      answer: 'Ja, Sie können monatlich ohne Kündigungsfrist kündigen. Bei jährlicher Zahlung sparen Sie 2 Monate und können trotzdem flexibel bleiben. Keine versteckten Kosten oder Ausstiegsgebühren.'
    },
    {
      question: 'Welche Systeme unterstützt CarBot?',
      answer: 'CarBot integriert sich nahtlos in über 50+ Werkstatt-Management-Systeme wie WinWerk, Autohaus24, CarSoft und viele mehr. Auch Custom-Integrationen sind möglich. Unser Technik-Team unterstützt Sie kostenlos bei der Einrichtung.'
    },
    {
      question: 'Wie viel kann ich mit CarBot sparen?',
      answer: 'Unsere Kunden sparen durchschnittlich 3 Stunden täglich und steigern ihre Terminbuchungen um 40%. Bei einer durchschnittlichen Werkstatt entspricht das einer Umsatzsteigerung von 15.000-25.000€ pro Jahr.',
      highlight: true
    },
    {
      question: 'Bieten Sie Schulungen und Support an?',
      answer: 'Ja! Alle Pläne beinhalten deutschen Support. Professional-Kunden erhalten prioritären Support, Enterprise-Kunden einen dedizierten Account Manager. Zusätzlich bieten wir kostenlose Webinare und Online-Schulungen.'
    },
    {
      question: 'Was passiert nach der Testphase?',
      answer: 'Nach den 14 kostenlosen Tagen wird automatisch Ihr gewählter Plan aktiviert. Sie können jederzeit upgraden, downgraden oder kündigen. Es gibt keine Mindestlaufzeit.'
    },
    {
      question: 'Unterstützt CarBot mehrere Standorte?',
      answer: 'Ja, ab dem Professional-Plan können Sie mehrere Werkstatt-Standorte zentral verwalten. Jeder Standort kann individuell konfiguriert werden, während Sie zentrale Einblicke und Reports erhalten.'
    },
    {
      question: 'Wie funktioniert die KI-Technologie?',
      answer: 'CarBot nutzt speziell für Autowerkstätten trainierte KI-Modelle. Die KI lernt kontinuierlich aus Ihren Kundengesprächen und wird immer besser. Dabei bleiben alle Daten sicher in Deutschland und werden niemals für andere Zwecke verwendet.'
    }
  ];

  const testimonials = [
    {
      name: 'Thomas Weber',
      company: 'Auto Weber GmbH',
      location: 'München',
      text: 'CarBot hat unsere Kundenbetreuung revolutioniert. 40% mehr Terminbuchungen und zufriedenere Kunden. Der ROI war bereits nach 2 Monaten erreicht.',
      rating: 5,
      metrics: '+40% Terminbuchungen',
      avatar: '👨‍🔧'
    },
    {
      name: 'Sandra Müller',
      company: 'Müller Autowerkstatt',
      location: 'Hamburg',
      text: 'Endlich können wir auch außerhalb der Geschäftszeiten Kundenanfragen professionell beantworten. Unsere Kundenzufriedenheit ist um 35% gestiegen.',
      rating: 5,
      metrics: '+35% Kundenzufriedenheit',
      avatar: '👩‍🔧'
    },
    {
      name: 'Michael Fischer',
      company: 'Fischer Service Center',
      location: 'Berlin',
      text: 'Die KI versteht unsere Kunden besser als erwartet. Sehr beeindruckend und zeitsparend. Wir sparen täglich 2-3 Stunden durch die Automatisierung.',
      rating: 5,
      metrics: '3h täglich gespart',
      avatar: '👨‍💼'
    }
  ];

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CarBot",
    "description": "KI-Serviceberater für deutsche Autowerkstätten",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter",
        "description": "Perfekt für kleine Werkstätten",
        "price": "49",
        "priceCurrency": "EUR",
        "billingIncrement": "P1M",
        "category": "Subscription"
      },
      {
        "@type": "Offer",
        "name": "Professional",
        "description": "Ideal für wachsende Betriebe",
        "price": "99",
        "priceCurrency": "EUR",
        "billingIncrement": "P1M",
        "category": "Subscription"
      },
      {
        "@type": "Offer",
        "name": "Enterprise",
        "description": "Für große Werkstattketten",
        "price": "199",
        "priceCurrency": "EUR",
        "billingIncrement": "P1M",
        "category": "Subscription"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "500"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">CarBot</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="/demo" className="text-gray-600 hover:text-blue-600">Demo</a>
              <a href="/pricing" className="text-blue-600 font-medium">Preise</a>
              <a href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Anmelden</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500 bg-opacity-30 text-blue-100 border border-blue-400 border-opacity-30">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Über 500 Werkstätten vertrauen CarBot
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
            Transparente Preise für<br />
            <span className="text-blue-200">jede Werkstattgröße</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Steigern Sie Ihre Effizienz mit Deutschlands führendem KI-Serviceberater für Autowerkstätten. 
            <strong className="text-white">40% mehr Terminbuchungen</strong> und zufriedenere Kunden garantiert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={handleTrialStart}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🚀 14 Tage kostenlos testen
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
              📺 Demo ansehen
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-200 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Keine Kreditkarte erforderlich
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Setup in unter 5 Minuten
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Jederzeit kündbar
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wählen Sie Ihren Plan</h2>
            <p className="text-lg text-gray-600 mb-8">Starten Sie noch heute und sparen Sie mit jährlicher Zahlung</p>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                Monatlich
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                Jährlich
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                2 Monate gratis
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg border ${plan.popular ? 'border-blue-200 ring-2 ring-blue-600' : 'border-gray-200'} p-8`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Beliebtester Plan
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      €{isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">/Monat</span>
                    {isAnnual && (
                      <div className="text-sm text-gray-500">
                        Jährlich €{plan.annualPrice} (2 Monate gratis)
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <li key={limitIndex} className="flex items-start">
                      <svg className="h-6 w-6 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition relative ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-300'
                  } ${loading === plan.id ? 'cursor-not-allowed' : ''}`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Weiterleitung...
                    </div>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Detaillierter Funktionsvergleich</h2>
            <p className="text-lg text-gray-600">Alle Features im Überblick - finden Sie den perfekten Plan für Ihre Werkstatt</p>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-6 px-6 font-bold text-gray-900 text-lg">Features</th>
                  <th className="text-center py-6 px-6 font-bold text-gray-900 text-lg">Starter<br/><span className="text-sm font-normal text-gray-600">€49/Monat</span></th>
                  <th className="text-center py-6 px-6 font-bold text-gray-900 text-lg bg-blue-50 border-x-2 border-blue-200">Professional<br/><span className="text-sm font-normal text-blue-600">€99/Monat</span></th>
                  <th className="text-center py-6 px-6 font-bold text-gray-900 text-lg">Enterprise<br/><span className="text-sm font-normal text-gray-600">€199/Monat</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    category: 'Grundfunktionen',
                    features: [
                      ['Kundengespräche/Monat', '100', '500', 'Unbegrenzt'],
                      ['KI-Serviceberatung', '✓', '✓', '✓'],
                      ['DSGVO-konforme Datenspeicherung', '✓', '✓', '✓'],
                      ['Mobile App Zugang', '✓', '✓', '✓'],
                      ['Multi-Sprach Support', 'Deutsch', 'Deutsch + Englisch', 'Alle Sprachen']
                    ]
                  },
                  {
                    category: 'Erweiterte Features',
                    features: [
                      ['Intelligente Terminbuchung', '✗', '✓', '✓'],
                      ['WhatsApp Integration', '✗', '✓', '✓'],
                      ['Kostenvoranschlag-Generator', '✗', '✓', '✓'],
                      ['Multi-Standort Verwaltung', '✗', '✓', '✓'],
                      ['SMS-Benachrichtigungen', '✗', '50/Monat', 'Unbegrenzt']
                    ]
                  },
                  {
                    category: 'Analytics & Reporting',
                    features: [
                      ['Analytics Dashboard', 'Basic', 'Erweitert', 'Premium'],
                      ['Kundenanalyse', 'Basic', 'Detailliert', 'KI-gestützt'],
                      ['Umsatz-Tracking', '✗', '✓', '✓'],
                      ['Custom Reports', '✗', '✗', '✓'],
                      ['Compliance-Reporting', '✗', '✗', '✓']
                    ]
                  },
                  {
                    category: 'Support & Service',
                    features: [
                      ['Support', 'E-Mail', 'Priorität', '24/7 Premium'],
                      ['Onboarding', 'Self-Service', 'Begleitet', 'Persönlich'],
                      ['Schulungen', 'Online-Videos', 'Webinare', 'Vor-Ort + Online'],
                      ['Dedizierter Account Manager', '✗', '✗', '✓']
                    ]
                  },
                  {
                    category: 'Integration & Anpassung',
                    features: [
                      ['API-Zugang', '✗', 'Basic', 'Vollzugriff'],
                      ['Werkstatt-System Integration', 'Standard', 'Erweitert', 'Custom'],
                      ['White-Label Lösung', '✗', '✗', '✓'],
                      ['Custom Integrationen', '✗', '✗', '✓'],
                      ['KI-Training auf Ihre Daten', '✗', '✗', '✓']
                    ]
                  }
                ].map((section, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    <tr className="bg-gray-100">
                      <td colSpan="4" className="py-3 px-6 font-bold text-gray-900 text-sm uppercase tracking-wide">
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">{row[0]}</td>
                        <td className="py-4 px-6 text-center text-gray-600">
                          {row[1] === '✓' ? <span className="text-green-500 text-xl">✓</span> : 
                           row[1] === '✗' ? <span className="text-gray-400 text-xl">✗</span> : row[1]}
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600 bg-blue-50 border-x border-blue-100">
                          {row[2] === '✓' ? <span className="text-green-500 text-xl">✓</span> : 
                           row[2] === '✗' ? <span className="text-gray-400 text-xl">✗</span> : row[2]}
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600">
                          {row[3] === '✓' ? <span className="text-green-500 text-xl">✓</span> : 
                           row[3] === '✗' ? <span className="text-gray-400 text-xl">✗</span> : row[3]}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Alle Pläne beinhalten eine 14-tägige kostenlose Testphase</p>
            <button 
              onClick={handleTrialStart}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Jetzt kostenlos testen
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Über 500 Werkstätten vertrauen CarBot</h2>
            <p className="text-lg text-gray-600">Hören Sie, was unsere Kunden sagen</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative">
                <div className="absolute -top-4 left-6">
                  <div className="bg-blue-500 text-white p-2 rounded-full text-xs font-bold">
                    VERIFIZIERT
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                    <p className="text-gray-500 text-xs">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-semibold text-sm">{testimonial.metrics}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company Logos */}
          <div className="text-center">
            <p className="text-gray-600 mb-8 font-medium">Vertraut von führenden deutschen Werkstätten</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
              {[
                { name: 'Bosch Service', logo: '🔧' },
                { name: 'ATU Auto-Teile-Unger', logo: '🚗' },
                { name: 'Euromaster', logo: '⚙️' },
                { name: 'Pit Stop', logo: '🏁' },
                { name: 'Auto1 Group', logo: '🔧' },
                { name: 'Vergölst', logo: '🛞' }
              ].map((company, index) => (
                <div key={index} className="group bg-white border border-gray-200 px-4 py-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="text-center">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{company.logo}</div>
                    <span className="text-sm font-medium text-gray-700">{company.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ISO 27001 zertifiziert
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                DSGVO-konform
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Made in Germany
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Häufig gestellte Fragen</h2>
            <p className="text-lg text-gray-600">Alles was Sie über CarBot wissen müssen</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`border rounded-lg transition-all duration-300 ${
                faq.highlight 
                  ? 'border-blue-300 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <button
                  className="w-full text-left px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {faq.highlight && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-3">WICHTIG</span>
                      )}
                      <span className={`font-semibold ${faq.highlight ? 'text-blue-900' : 'text-gray-900'}`}>
                        {faq.question}
                      </span>
                    </div>
                    <svg
                      className={`h-5 w-5 transform transition-transform flex-shrink-0 ml-4 ${
                        openFaq === index ? 'rotate-180' : ''
                      } ${faq.highlight ? 'text-blue-600' : 'text-gray-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className={`leading-relaxed ${faq.highlight ? 'text-blue-800' : 'text-gray-700'}`}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vertrauen und Sicherheit stehen an erster Stelle</h2>
            <p className="text-lg text-gray-600">CarBot erfüllt höchste deutsche Sicherheitsstandards</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-green-100 rounded-full p-4 mb-4 mx-auto w-fit">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">DSGVO-konform</h3>
              <p className="text-gray-600 text-sm">100% deutsche Rechenzentren</p>
              <div className="mt-3 text-xs text-green-600 font-medium">✓ EU-zertifiziert</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 rounded-full p-4 mb-4 mx-auto w-fit">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">ISO 27001 zertifiziert</h3>
              <p className="text-gray-600 text-sm">Ende-zu-Ende Verschlüsselung</p>
              <div className="mt-3 text-xs text-blue-600 font-medium">✓ TÜV geprüft</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-purple-100 rounded-full p-4 mb-4 mx-auto w-fit">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Schnelle Integration</h3>
              <p className="text-gray-600 text-sm">Setup in unter 5 Minuten</p>
              <div className="mt-3 text-xs text-purple-600 font-medium">✓ Plug & Play</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-yellow-100 rounded-full p-4 mb-4 mx-auto w-fit">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">24/7 Premium Support</h3>
              <p className="text-gray-600 text-sm">Deutscher Support-Team</p>
              <div className="mt-3 text-xs text-yellow-600 font-medium">✓ <2min Response</div>
            </div>
          </div>
          
          {/* Additional Security Badges */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Zertifizierungen & Compliance</h3>
              <p className="text-gray-600">CarBot erfüllt alle deutschen und europäischen Compliance-Anforderungen</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: 'DSGVO', icon: '🛡️' },
                { name: 'ISO 27001', icon: '🔐' },
                { name: 'BSI Grundschutz', icon: '🇩🇪' },
                { name: 'SOC 2 Type II', icon: '✅' },
                { name: 'TISAX', icon: '🚗' },
                { name: 'Made in Germany', icon: '🏭' }
              ].map((cert, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{cert.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{cert.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-400 text-yellow-900">
              🎯 Limitiertes Angebot: Sparen Sie 50% in den ersten 3 Monaten
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow">
            Bereit, Ihre Werkstatt zu revolutionieren?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Schließen Sie sich über <strong className="text-white">500 erfolgreichen deutschen Werkstätten</strong> an. 
            Starten Sie noch heute mit der kostenlosen 14-Tage-Testversion.
          </p>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">40%</div>
                <div className="text-blue-200 text-sm">mehr Terminbuchungen</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">3h</div>
                <div className="text-blue-200 text-sm">täglich gespart</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">35%</div>
                <div className="text-blue-200 text-sm">höhere Kundenzufriedenheit</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={handleTrialStart}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              🚀 Jetzt kostenlos testen
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center">
              📞 Persönliche Demo
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-200 text-sm mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              14 Tage kostenlos testen
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Keine Kreditkarte erforderlich
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Jederzeit kündbar
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              ⏰ Angebot gültig bis Ende des Monats • 💯 Geld-zurück-Garantie • 🇩🇪 Deutscher Support
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">CarBot</h3>
              <p className="text-gray-400 mb-4">
                Der führende KI-Serviceberater für deutsche Autowerkstätten.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Preise</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Über uns</a></li>
                <li><a href="#" className="hover:text-white">Karriere</a></li>
                <li><a href="#" className="hover:text-white">Kontakt</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/legal/datenschutz" className="hover:text-white">Datenschutz</a></li>
                <li><a href="/legal/impressum" className="hover:text-white">Impressum</a></li>
                <li><a href="#" className="hover:text-white">AGB</a></li>
                <li><a href="#" className="hover:text-white">Cookie-Richtlinie</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarBot. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
