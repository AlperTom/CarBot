'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { PRODUCTS, formatPrice, calculatePriceWithVAT } from '@/lib/stripe';
import { Check, Star, Users, Zap, Shield, ArrowRight, Euro, CreditCard, Smartphone } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePricingPage = () => {
  const [billingInterval, setBillingInterval] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showVAT, setShowVAT] = useState(true);
  const [userCountry, setUserCountry] = useState('DE');

  // Detect user's country for VAT calculation
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_code || 'DE');
      } catch (error) {
        console.log('Could not detect country, defaulting to Germany');
        setUserCountry('DE');
      }
    };

    detectCountry();
  }, []);

  const getPriceWithVAT = (priceInCents, country = 'DE') => {
    if (!showVAT) return priceInCents;
    return calculatePriceWithVAT(priceInCents, country);
  };

  const handleSubscribe = async (planId) => {
    if (loading) return;

    setLoading(true);
    setSelectedPlan(planId);

    try {
      // Get user data (this would come from your auth system)
      const userData = {
        email: 'user@example.com', // Get from auth context
        name: 'Workshop Owner', // Get from user profile
        workshopName: 'Meine Werkstatt' // Get from workshop data
      };

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planId,
          billingInterval: billingInterval === 'monthly' ? 'month' : 'year',
          workshopData: {
            id: 'workshop_' + Math.random().toString(36).substr(2, 9),
            name: userData.workshopName,
            owner_id: 'user_123' // Get from auth
          },
          customerData: {
            email: userData.email,
            name: userData.name,
            country: userCountry
          },
          trialDays: 14,
          successUrl: `${window.location.origin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        });

        if (error) {
          console.error('Stripe checkout error:', error);
          alert('Fehler beim Öffnen der Checkout-Seite: ' + error.message);
        }
      } else {
        console.error('Checkout creation error:', data.error);
        alert('Fehler beim Erstellen der Checkout-Session: ' + data.error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const formatDisplayPrice = (plan, interval) => {
    const price = plan[interval === 'monthly' ? 'monthly' : 'yearly'].price;
    const priceWithVAT = getPriceWithVAT(price, userCountry);
    
    if (showVAT && typeof priceWithVAT === 'object') {
      return {
        net: formatPrice(priceWithVAT.netPrice),
        gross: formatPrice(priceWithVAT.grossPrice),
        vat: `${priceWithVAT.vatRate}% MwSt.`,
        vatAmount: formatPrice(priceWithVAT.vatAmount)
      };
    }
    
    return {
      net: formatPrice(price),
      gross: formatPrice(price),
      vat: null,
      vatAmount: null
    };
  };

  const getMonthlyEquivalent = (plan) => {
    if (billingInterval === 'monthly') return null;
    
    const yearlyPrice = plan.yearly.price;
    const monthlyEquivalent = yearlyPrice / 12;
    const priceWithVAT = getPriceWithVAT(monthlyEquivalent, userCountry);
    
    if (showVAT && typeof priceWithVAT === 'object') {
      return formatPrice(priceWithVAT.grossPrice);
    }
    
    return formatPrice(monthlyEquivalent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Wählen Sie Ihren
            <span className="text-blue-600"> CarBot</span> Plan
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Steigern Sie die Effizienz Ihrer Werkstatt mit KI-gestützter Kundenbetreuung. 
            Alle Pläne beinhalten eine 14-tägige kostenlose Testphase.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingInterval === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Monatlich
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors relative ${
                  billingInterval === 'yearly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Jährlich
                <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  2 Monate gratis
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* VAT Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVAT}
                onChange={(e) => setShowVAT(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Preise inkl. MwSt. anzeigen ({userCountry === 'DE' ? '19%' : 'lokaler Satz'})
              </span>
            </label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(PRODUCTS).map(([planKey, plan]) => {
            const pricing = formatDisplayPrice(plan, billingInterval);
            const monthlyEquivalent = getMonthlyEquivalent(plan);
            const isPopular = planKey === 'professional';
            const isEnterprise = planKey === 'enterprise';

            return (
              <div
                key={planKey}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 ${
                  isPopular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-b-lg text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Am beliebtesten
                    </div>
                  </div>
                )}

                <div className="px-8 py-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold ${isPopular ? 'text-blue-600' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    
                    <div className="mt-4">
                      {/* Main Price */}
                      <div className="text-4xl font-bold text-gray-900">
                        {showVAT ? pricing.gross : pricing.net}
                        <span className="text-lg font-normal text-gray-500">
                          /{billingInterval === 'monthly' ? 'Monat' : 'Jahr'}
                        </span>
                      </div>
                      
                      {/* VAT Information */}
                      {showVAT && pricing.vat && (
                        <div className="text-sm text-gray-600 mt-1">
                          Netto: {pricing.net} + {pricing.vatAmount} {pricing.vat}
                        </div>
                      )}
                      
                      {/* Monthly equivalent for yearly billing */}
                      {monthlyEquivalent && (
                        <div className="text-sm text-green-600 font-medium mt-2">
                          Entspricht {monthlyEquivalent}/Monat
                        </div>
                      )}
                      
                      {/* Trial information */}
                      <div className="text-sm text-blue-600 font-medium mt-2">
                        14 Tage kostenlos testen
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                          isPopular ? 'text-blue-500' : 'text-green-500'
                        }`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(planKey)}
                    disabled={loading && selectedPlan === planKey}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors flex items-center justify-center ${
                      isEnterprise
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } ${loading && selectedPlan === planKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading && selectedPlan === planKey ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {isEnterprise ? 'Kostenloses Beratungsgespräch' : 'Jetzt testen'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Sichere Bezahlung mit Stripe
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Kreditkarte</h4>
              <p className="text-gray-600 text-sm">
                Visa, Mastercard, American Express
              </p>
            </div>
            
            <div className="text-center">
              <Euro className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">SEPA Lastschrift</h4>
              <p className="text-gray-600 text-sm">
                Direkt von Ihrem deutschen Bankkonto
              </p>
            </div>
            
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">100% Sicher</h4>
              <p className="text-gray-600 text-sm">
                SSL-Verschlüsselung & DSGVO-konform
              </p>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Funktionen im Vergleich
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6">Funktion</th>
                  <th className="text-center py-4 px-6">Starter</th>
                  <th className="text-center py-4 px-6">Professional</th>
                  <th className="text-center py-4 px-6">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6">Kundengespräche pro Monat</td>
                  <td className="text-center py-4 px-6">100</td>
                  <td className="text-center py-4 px-6">500</td>
                  <td className="text-center py-4 px-6">Unbegrenzt</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6">KI-basierte Service-Beratung</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6">WhatsApp Integration</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6">Terminbuchung</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6">API Zugang</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6">Custom AI Training</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Support</td>
                  <td className="text-center py-4 px-6">E-Mail</td>
                  <td className="text-center py-4 px-6">Priority</td>
                  <td className="text-center py-4 px-6">24/7 Premium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Häufig gestellte Fragen
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Kann ich jederzeit kündigen?
              </h4>
              <p className="text-gray-600 text-sm">
                Ja, Sie können Ihr Abonnement jederzeit in Ihrem Dashboard kündigen. 
                Die Kündigung wird zum Ende der aktuellen Abrechnungsperiode wirksam.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Wie funktioniert die kostenlose Testphase?
              </h4>
              <p className="text-gray-600 text-sm">
                Sie erhalten 14 Tage vollen Zugang zu allen Funktionen Ihres gewählten Plans. 
                Eine Kreditkarte ist erforderlich, wird aber erst nach der Testphase belastet.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Ist CarBot DSGVO-konform?
              </h4>
              <p className="text-gray-600 text-sm">
                Ja, CarBot ist vollständig DSGVO-konform. Alle Daten werden in Deutschland 
                gespeichert und verarbeitet.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Kann ich meinen Plan später ändern?
              </h4>
              <p className="text-gray-600 text-sm">
                Ja, Sie können jederzeit upgraden oder downgraden. Upgrades werden sofort 
                wirksam, Downgrades zum nächsten Abrechnungszeitraum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePricingPage;