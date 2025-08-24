'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCardIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

export default function BillingPage() {
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock billing data for MVP
    const mockBillingData = {
      currentPlan: {
        name: 'Professional',
        price: 49,
        currency: 'EUR',
        period: 'monatlich'
      },
      nextBilling: '2024-09-23',
      usage: {
        chatRequests: 2847,
        leads: 156,
        appointments: 89
      }
    };
    
    setBillingData(mockBillingData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Abrechnungsdaten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Abrechnung & Pläne 💳
          </h1>
          <p className="text-gray-600">
            Verwalten Sie Ihr Abonnement und Zahlungsmethoden
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Aktueller Plan</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{billingData.currentPlan.name}</h3>
              <p className="text-gray-600 mt-1">
                €{billingData.currentPlan.price}/{billingData.currentPlan.period}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Nächste Abrechnung: {new Date(billingData.nextBilling).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{billingData.usage.chatRequests.toLocaleString('de-DE')}</div>
              <div className="text-sm text-gray-600">Chat-Anfragen</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <BanknotesIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{billingData.usage.leads}</div>
              <div className="text-sm text-gray-600">Generierte Leads</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <CalendarDaysIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{billingData.usage.appointments}</div>
              <div className="text-sm text-gray-600">Termine gebucht</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}