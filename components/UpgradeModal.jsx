'use client';

import { useState, useEffect } from 'react';
import { formatEuroCurrency, PACKAGES } from '@/lib/packageFeatures';

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  workshopId, 
  currentPackage = 'basic',
  targetPackage = 'professional',
  trigger = 'manual',
  usageData = null
}) {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [upgradeDetails, setUpgradeDetails] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Select Plan, 2: Confirm & Pay, 3: Success

  useEffect(() => {
    if (isOpen && workshopId) {
      loadUpgradeDetails();
    }
  }, [isOpen, workshopId, targetPackage, billingCycle]);

  const loadUpgradeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initiate_upgrade',
          workshop_id: workshopId,
          target_package: targetPackage,
          billing_cycle: billingCycle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to load upgrade details');
      }

      const data = await response.json();
      setUpgradeDetails(data.upgrade_session);
    } catch (err) {
      setError('Fehler beim Laden der Upgrade-Details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!upgradeDetails) return;

    try {
      setLoading(true);
      
      if (targetPackage === 'enterprise') {
        // Handle enterprise contact request
        const response = await fetch('/api/packages/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workshop_id: workshopId,
            target_package: targetPackage,
            current_package: currentPackage,
            trigger: trigger,
            usage_data: usageData
          })
        });

        if (response.ok) {
          setStep(3);
        } else {
          throw new Error('Failed to submit enterprise request');
        }
      } else {
        // Redirect to Stripe Checkout
        if (upgradeDetails.checkout_url) {
          window.location.href = upgradeDetails.checkout_url;
        } else {
          throw new Error('No checkout URL available');
        }
      }
    } catch (err) {
      setError('Fehler beim Upgrade-Prozess: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPackageInfo = (packageId) => {
    return PACKAGES[packageId.toUpperCase()] || PACKAGES.PROFESSIONAL;
  };

  const getCurrentPackageInfo = () => getPackageInfo(currentPackage);
  const getTargetPackageInfo = () => getPackageInfo(targetPackage);

  const getUpgradeReason = () => {
    const reasons = {
      'usage': {
        title: '📈 Ihre Nutzung ist gewachsen',
        description: 'Sie nähern sich Ihren aktuellen Limits und brauchen mehr Kapazität.'
      },
      'feature': {
        title: '🚀 Neue Features freischalten',
        description: 'Erweitern Sie CarBot mit professionellen Features und besseren Integrationen.'
      },
      'support': {
        title: '📞 Besserer Support benötigt',
        description: 'Sie brauchen schnelleren und persönlicheren Support für Ihr wachsenendes Business.'
      },
      'manual': {
        title: '⬆️ Plan-Upgrade',
        description: 'Verbessern Sie Ihr CarBot-Erlebnis mit erweiterten Features und höheren Limits.'
      }
    };
    
    return reasons[trigger] || reasons['manual'];
  };

  const renderPlanComparison = () => {
    const current = getCurrentPackageInfo();
    const target = getTargetPackageInfo();
    const reason = getUpgradeReason();

    return (
      <div className="space-y-6">
        {/* Upgrade Reason */}
        <div className="text-center">
          <div className="text-2xl mb-2">{reason.title}</div>
          <p className="text-gray-600">{reason.description}</p>
        </div>

        {/* Usage Alert (if applicable) */}
        {usageData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-yellow-500 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Limits erreicht
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Sie haben {usageData.percentage}% Ihrer aktuellen Kapazität erreicht:</p>
                  <ul className="mt-1 list-disc pl-5">
                    <li>Leads: {usageData.leads?.current || 0} / {usageData.leads?.limit || 'Unbegrenzt'}</li>
                    {usageData.apiCalls && (
                      <li>API Calls: {usageData.apiCalls.current || 0} / {usageData.apiCalls.limit || 'Unbegrenzt'}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Current Plan */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Aktueller Plan</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{current.name}</h3>
              <div className="text-2xl font-bold text-gray-600 mb-4">
                {formatEuroCurrency(current.priceEur)}
                <span className="text-sm font-normal">/Monat</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Leads:</span>{' '}
                <span className="font-medium">
                  {current.limits.monthlyLeads === -1 ? 'Unbegrenzt' : current.limits.monthlyLeads}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Support:</span>{' '}
                <span className="font-medium">{current.supportLevel === 'email' ? 'E-Mail' : 'Telefon'}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">API-Zugang:</span>{' '}
                <span className="font-medium">{current.features.apiAccess ? '✅' : '❌'}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Erweiterte Analysen:</span>{' '}
                <span className="font-medium">{current.features.advancedAnalytics ? '✅' : '❌'}</span>
              </div>
            </div>
          </div>

          {/* Target Plan */}
          <div className="border-2 border-blue-500 rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Empfohlen
              </span>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-blue-600 mb-2">Upgrade auf</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{target.name}</h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                {target.priceEur ? formatEuroCurrency(target.priceEur) : 'Individuell'}
                {target.priceEur && <span className="text-sm font-normal">/Monat</span>}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Leads:</span>{' '}
                <span className="font-medium text-green-600">
                  {target.limits.monthlyLeads === -1 ? 'Unbegrenzt' : target.limits.monthlyLeads}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Support:</span>{' '}
                <span className="font-medium text-green-600">
                  {target.supportLevel === 'dedicated' ? 'Persönlich' : 
                   target.supportLevel === 'phone' ? 'Telefon' : 'E-Mail'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">API-Zugang:</span>{' '}
                <span className="font-medium text-green-600">
                  {target.features.apiAccess ? '✅ Ja' : '❌'}
                  {target.limits.apiCalls === -1 ? ' (Unbegrenzt)' : 
                   target.limits.apiCalls > 0 ? ` (${target.limits.apiCalls.toLocaleString()}/Mon)` : ''}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Erweiterte Analysen:</span>{' '}
                <span className="font-medium text-green-600">{target.features.advancedAnalytics ? '✅' : '❌'}</span>
              </div>
              {target.features.customIntegrations && (
                <div className="text-sm">
                  <span className="text-gray-600">Custom Integrationen:</span>{' '}
                  <span className="font-medium text-green-600">✅</span>
                </div>
              )}
              {target.features.whiteLabel && (
                <div className="text-sm">
                  <span className="text-gray-600">White-Label:</span>{' '}
                  <span className="font-medium text-green-600">✅</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing Cycle Selection */}
        {targetPackage !== 'enterprise' && (
          <div className="space-y-4">
            <div className="text-center">
              <label className="text-sm font-medium text-gray-700">Abrechnungszyklus wählen</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`p-4 border rounded-lg text-center ${
                  billingCycle === 'monthly' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Monatlich</div>
                <div className="text-sm text-gray-600">
                  {formatEuroCurrency(target.priceEur)}/Monat
                </div>
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`p-4 border rounded-lg text-center ${
                  billingCycle === 'annual' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Jährlich</div>
                <div className="text-sm text-gray-600">
                  {formatEuroCurrency(target.priceEur * 10)}/Jahr
                </div>
                <div className="text-xs text-green-600 font-medium">2 Monate kostenlos!</div>
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Benefits */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            ✨ Das erhalten Sie mit dem Upgrade:
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            {upgradeDetails?.benefits?.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">🎉</div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {targetPackage === 'enterprise' ? 'Anfrage gesendet!' : 'Upgrade erfolgreich!'}
        </h3>
        <p className="text-gray-600">
          {targetPackage === 'enterprise' 
            ? 'Unser Enterprise-Team wird sich binnen 24 Stunden bei Ihnen melden.'
            : `Willkommen beim ${getTargetPackageInfo().name} Plan! Alle Features sind sofort verfügbar.`
          }
        </p>
      </div>
      
      {targetPackage !== 'enterprise' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">🚀 Nächste Schritte:</h4>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>✓ Ihre neuen Features sind bereits aktiviert</li>
            <li>✓ Neue Limits gelten ab sofort</li>
            <li>✓ Support-Level wurde automatisch erhöht</li>
            <li>✓ API-Zugang (falls enthalten) ist verfügbar</li>
          </ul>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 3 ? 'Upgrade abgeschlossen' : 'Plan-Upgrade'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Lade Upgrade-Details...</p>
            </div>
          ) : step === 3 ? (
            renderSuccess()
          ) : (
            renderPlanComparison()
          )}
        </div>

        {/* Footer Actions */}
        {!loading && step !== 3 && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {upgradeDetails?.pricing && billingCycle === 'annual' && (
                  <span>💡 Sie sparen {formatEuroCurrency(upgradeDetails.pricing.annual_savings || 0)} pro Jahr!</span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleUpgrade}
                  disabled={loading || !upgradeDetails}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {targetPackage === 'enterprise' 
                    ? 'Enterprise anfragen' 
                    : `Upgrade für ${formatEuroCurrency(
                        billingCycle === 'annual' 
                          ? (upgradeDetails?.pricing?.annual_price || 0)
                          : (upgradeDetails?.pricing?.target_package_price || 0)
                      )}${billingCycle === 'annual' ? '/Jahr' : '/Monat'}`
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
            <div className="text-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Dashboard öffnen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}