'use client';

import { useState, useEffect } from 'react';
import { checkFeatureAccess, getWorkshopPackage, formatEuroCurrency, PACKAGES } from '@/lib/packageFeatures';
import UpgradeModal from './UpgradeModal';

export default function FeatureGate({ 
  workshopId,
  feature,
  children,
  fallback = null,
  showUpgradePrompt = true,
  customMessage = null,
  className = ""
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [packageInfo, setPackageInfo] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [featureCheck, setFeatureCheck] = useState(null);

  useEffect(() => {
    if (workshopId && feature) {
      checkAccess();
    }
  }, [workshopId, feature]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      
      // Check feature access
      const accessResult = await checkFeatureAccess(workshopId, feature);
      setFeatureCheck(accessResult);
      setHasAccess(accessResult.allowed);

      // Get package info for upgrade suggestions
      const packageData = await getWorkshopPackage(workshopId);
      setPackageInfo(packageData);
    } catch (error) {
      console.error('Error checking feature access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureInfo = () => {
    const features = {
      emailSupport: {
        name: 'E-Mail Support',
        description: 'Professioneller E-Mail Support mit 48h Response Zeit',
        icon: '📧',
        requiredPlan: 'basic'
      },
      phoneSupport: {
        name: 'Telefon Support',
        description: 'Direkter Telefon-Support mit 24h Response Zeit',
        icon: '📞',
        requiredPlan: 'professional'
      },
      basicDashboard: {
        name: 'Basis Dashboard',
        description: 'Grundlegende Statistiken und Übersichten',
        icon: '📊',
        requiredPlan: 'basic'
      },
      advancedAnalytics: {
        name: 'Erweiterte Analysen',
        description: 'Detaillierte Berichte, Trends und Performance-Metriken',
        icon: '📈',
        requiredPlan: 'professional'
      },
      apiAccess: {
        name: 'API-Zugang',
        description: 'Vollständiger Zugang zur CarBot REST API',
        icon: '🔌',
        requiredPlan: 'professional'
      },
      customIntegrations: {
        name: 'Custom Integrationen',
        description: 'Individuelle Integrationen mit CRM, POS und anderen Systemen',
        icon: '🔗',
        requiredPlan: 'enterprise'
      },
      personalSupport: {
        name: 'Persönlicher Support',
        description: 'Dedicated Account Manager und persönliche Betreuung',
        icon: '👨‍💼',
        requiredPlan: 'enterprise'
      },
      whiteLabel: {
        name: 'White-Label',
        description: 'Vollständiges Branding mit Ihrem Firmenlogo und Design',
        icon: '🏷️',
        requiredPlan: 'enterprise'
      },
      landingPages: {
        name: 'Landing Pages',
        description: 'Professionelle Landing Page Templates',
        icon: '🎨',
        requiredPlan: 'professional'
      },
      multiUser: {
        name: 'Mehrere Benutzer',
        description: 'Team-Zugang mit Rollen und Berechtigungen',
        icon: '👥',
        requiredPlan: 'professional'
      }
    };

    return features[feature] || {
      name: feature,
      description: `${feature} Feature`,
      icon: '⭐',
      requiredPlan: 'professional'
    };
  };

  const getUpgradeTarget = () => {
    if (!featureCheck || !packageInfo) return 'professional';
    
    const currentPlan = packageInfo.id;
    const requiredPlan = getFeatureInfo().requiredPlan;
    
    if (currentPlan === 'basic' && (requiredPlan === 'professional' || requiredPlan === 'enterprise')) {
      return 'professional';
    }
    if (currentPlan === 'professional' && requiredPlan === 'enterprise') {
      return 'enterprise';
    }
    
    return 'professional';
  };

  const renderUpgradePrompt = () => {
    const featureInfo = getFeatureInfo();
    const targetPlan = getUpgradeTarget();
    const targetPackage = PACKAGES[targetPlan.toUpperCase()];

    if (customMessage) {
      return (
        <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
          <div className="text-center">
            <div className="text-3xl mb-3">{featureInfo.icon}</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Feature gesperrt</div>
            <p className="text-gray-600 mb-4">{customMessage}</p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Jetzt upgraden
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">{featureInfo.icon}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {featureInfo.name} freischalten
          </h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            {featureInfo.description}
          </p>
          
          {/* Current vs Required Plan */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Aktuell</div>
                <div className="font-semibold text-gray-700">
                  {packageInfo?.name || 'Basic'}
                </div>
                <div className="text-gray-600">
                  {formatEuroCurrency(packageInfo?.priceEur || 29)}/Mon
                </div>
              </div>
              <div>
                <div className="text-blue-600 mb-1">Benötigt</div>
                <div className="font-semibold text-blue-700">
                  {targetPackage?.name || 'Professional'}
                </div>
                <div className="text-blue-600">
                  {targetPackage?.priceEur ? formatEuroCurrency(targetPackage.priceEur) : 'Individuell'}/Mon
                </div>
              </div>
            </div>
          </div>

          {/* Feature Benefits */}
          <div className="bg-white/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <div className="text-sm text-gray-700 space-y-2">
              <div className="font-medium text-gray-900 mb-3">Zusätzlich erhalten Sie:</div>
              {targetPlan === 'professional' && (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Unbegrenzte monatliche Leads</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>API-Zugang (10,000 Calls/Mon)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Telefon-Support</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Erweiterte Analytics</span>
                  </div>
                </>
              )}
              {targetPlan === 'enterprise' && (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Unbegrenzte API-Calls</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Persönlicher Account Manager</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>White-Label Branding</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Custom Integrationen</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-md"
            >
              {targetPlan === 'enterprise' 
                ? 'Enterprise anfragen' 
                : `Upgrade auf ${targetPackage?.name || 'Professional'}`
              }
            </button>
            <a
              href="/pricing"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Alle Pläne vergleichen
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 text-xs text-gray-500 space-x-4">
            <span>✓ Jederzeit kündbar</span>
            <span>✓ 14 Tage kostenlos testen</span>
            <span>✓ Sofortige Aktivierung</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBlurredContent = () => (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none select-none">
        <div className="bg-gray-100 animate-pulse rounded-lg p-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <div className="text-center p-6">
          <div className="text-2xl mb-2">🔒</div>
          <div className="font-semibold text-gray-900 mb-1">
            {getFeatureInfo().name} erforderlich
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Upgraden Sie für Vollzugriff
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Jetzt freischalten
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`bg-gray-100 animate-pulse rounded-lg p-8 ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no access, render appropriate fallback
  return (
    <>
      {fallback === 'blur' ? renderBlurredContent() : 
       showUpgradePrompt ? renderUpgradePrompt() : fallback}
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        workshopId={workshopId}
        currentPackage={packageInfo?.id || 'basic'}
        targetPackage={getUpgradeTarget()}
        trigger="feature"
      />
    </>
  );
}