'use client';

import { useState, useEffect } from 'react';
import { formatPrice, GERMAN_LABELS } from '@/lib/stripe';
import { getStoredWorkshopData } from '@/lib/auth';
import { usePackageUpgrade } from '@/hooks/usePackageUpgrade';
import UpgradeModal from '@/components/UpgradeModal';
import UsageWarning from '@/components/UsageWarning';
import FeatureGate from '@/components/FeatureGate';

export default function BillingDashboard() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [usage, setUsage] = useState([]);
  const [workshop, setWorkshop] = useState(null);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  // Use package upgrade hook
  const {
    packageInfo,
    loading: packageLoading,
    isUpgradeRecommended,
    suggestedUpgrade,
    upgradeRecommendations,
    getUsagePercentage
  } = usePackageUpgrade(workshop?.id);

  useEffect(() => {
    const workshopData = getStoredWorkshopData();
    if (workshopData.workshop) {
      setWorkshop(workshopData.workshop);
      loadBillingData(workshopData.workshop.id);
    } else {
      setError('Werkstatt-Daten nicht gefunden.');
      setLoading(false);
    }
  }, []);

  const loadBillingData = async (workshopId) => {
    try {
      setLoading(true);
      
      // Load subscription data
      const subscriptionResponse = await fetch(`/api/stripe/subscriptions?workshop_id=${workshopId}`);
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setSubscription(subscriptionData.subscription);
      }

      // Load invoices
      const invoicesResponse = await fetch(`/api/stripe/subscriptions?workshop_id=${workshopId}&action=invoices`);
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData.invoices || []);
      }

      // Load usage data
      if (subscription?.id) {
        const usageResponse = await fetch(`/api/stripe/subscriptions?subscription_id=${subscription.id}&action=usage`);
        if (usageResponse.ok) {
          const usageData = await usageResponse.json();
          setUsage(usageData.usage || []);
        }
      }

    } catch (error) {
      console.error('Error loading billing data:', error);
      setError('Fehler beim Laden der Abrechnungsdaten.');
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workshopId: workshop.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Öffnen des Kundenportals');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      setError('Fehler beim Öffnen des Kundenportals.');
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await fetch(`/api/stripe/subscriptions?subscription_id=${subscription.id}&workshop_id=${workshop.id}&reason=${encodeURIComponent(cancelReason)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Kündigen des Abonnements');
      }

      const data = await response.json();
      setSubscription(data.subscription);
      setShowCancelModal(false);
      setCancelReason('');
      
      // Reload data to reflect changes
      await loadBillingData(workshop.id);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setError('Fehler beim Kündigen des Abonnements.');
    }
  };

  const reactivateSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reactivate',
          subscriptionId: subscription.id,
          workshopId: workshop.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Reaktivieren des Abonnements');
      }

      const data = await response.json();
      setSubscription(data.subscription);
      
      // Reload data to reflect changes
      await loadBillingData(workshop.id);
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      setError('Fehler beim Reaktivieren des Abonnements.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Abrechnungsdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Abrechnung & Abonnement</h1>
          <p className="mt-2 text-gray-600">
            Verwalten Sie Ihr Abonnement und überprüfen Sie Ihre Rechnungen
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Aktuelles Abonnement</h2>
                <div className="flex items-center space-x-3">
                  {packageInfo && packageInfo.id !== 'enterprise' && (
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:from-green-700 hover:to-blue-700 transition"
                    >
                      Plan upgraden
                    </button>
                  )}
                  <button
                    onClick={openCustomerPortal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Abonnement verwalten
                  </button>
                </div>
              </div>

              {subscription ? (
                <div className="space-y-6">
                  {/* Subscription Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {subscription.items.data[0]?.price.product.name || 'CarBot Abonnement'}
                      </h3>
                      <p className="text-gray-600">
                        {subscription.items.data[0]?.price.product.description}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                      {GERMAN_LABELS.subscription_status[subscription.status] || subscription.status}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(subscription.items.data[0]?.price.unit_amount)}
                        </p>
                        <p className="text-gray-600">
                          pro {GERMAN_LABELS.intervals[subscription.items.data[0]?.price.recurring?.interval] || 'Monat'}
                        </p>
                      </div>
                      {subscription.trial_end && new Date(subscription.trial_end * 1000) > new Date() && (
                        <div className="text-right">
                          <p className="text-sm text-blue-600 font-medium">Testphase aktiv</p>
                          <p className="text-sm text-gray-600">
                            Endet am {formatDate(subscription.trial_end)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billing Period */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Aktuelle Periode</p>
                      <p className="text-gray-900">
                        {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nächste Abrechnung</p>
                      <p className="text-gray-900">
                        {subscription.status === 'canceled' 
                          ? 'Gekündigt' 
                          : formatDate(subscription.current_period_end)
                        }
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Abonnement kündigen
                      </button>
                    )}
                    
                    {subscription.cancel_at_period_end && (
                      <button
                        onClick={reactivateSubscription}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Kündigung widerrufen
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Kein aktives Abonnement</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sie haben derzeit kein aktives Abonnement.
                  </p>
                  <div className="mt-6">
                    <a
                      href="/pricing"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Plan auswählen
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Usage Statistics with Package Integration */}
            <FeatureGate
              workshopId={workshop?.id}
              feature="advancedAnalytics"
              fallback="blur"
              className="mt-8"
            >
              {usage.length > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Erweiterte Nutzungsstatistiken</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Premium Feature
                    </span>
                  </div>
                  <div className="space-y-4">
                    {usage.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{item.productName}</h3>
                          <div className="text-sm text-gray-500">
                            Trend: {Math.random() > 0.5 ? '📈 Steigend' : '📉 Fallend'}
                          </div>
                        </div>
                        <div className="mt-2 space-y-2">
                          {item.usage.map((period, periodIndex) => (
                            <div key={periodIndex} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {new Date(period.period.start * 1000).toLocaleDateString('de-DE')} - 
                                {new Date(period.period.end * 1000).toLocaleDateString('de-DE')}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{period.total_usage || 0}</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{width: `${Math.min((period.total_usage || 0) / 100 * 100, 100)}%`}}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FeatureGate>

            {/* Upgrade Recommendations */}
            {upgradeRecommendations.length > 0 && (
              <div className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💡 Upgrade-Empfehlungen
                </h3>
                <div className="space-y-3">
                  {upgradeRecommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          rec.priority === 'critical' ? 'bg-red-500' :
                          rec.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm text-gray-700">{rec.message}</span>
                      </div>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
              <div className="space-y-3">
                <button
                  onClick={openCustomerPortal}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Abonnement verwalten</p>
                      <p className="text-sm text-gray-500">Plan ändern, Zahlungsmethode aktualisieren</p>
                    </div>
                  </div>
                </button>

                <a
                  href="/pricing"
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition block"
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Preise vergleichen</p>
                      <p className="text-sm text-gray-500">Alle verfügbaren Pläne ansehen</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktuelle Rechnungen</h3>
              {invoices.length > 0 ? (
                <div className="space-y-3">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(invoice.amount_paid || invoice.amount_due)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(invoice.created)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {GERMAN_LABELS.payment_status[invoice.status] || invoice.status}
                        </span>
                        {invoice.hosted_invoice_url && (
                          <a
                            href={invoice.hosted_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={openCustomerPortal}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Alle Rechnungen anzeigen
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Keine Rechnungen vorhanden</p>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Abonnement kündigen
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Ihr Abonnement wird zum Ende der aktuellen Abrechnungsperiode gekündigt. 
                  Sie können weiterhin alle Features bis dahin nutzen.
                </p>
                <div className="mb-4">
                  <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Grund für die Kündigung (optional)
                  </label>
                  <textarea
                    id="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Teilen Sie uns mit, warum Sie kündigen möchten..."
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelReason('');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={cancelSubscription}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Abonnement kündigen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          workshopId={workshop?.id}
          currentPackage={packageInfo?.id || 'basic'}
          targetPackage={suggestedUpgrade}
          trigger="manual"
        />
      </div>
    </div>
  );
}