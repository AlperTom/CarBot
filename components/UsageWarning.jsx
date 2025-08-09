'use client';

import { useState, useEffect } from 'react';
import { checkPackageLimit, getWorkshopPackage, formatEuroCurrency } from '@/lib/packageFeatures';
import UpgradeModal from './UpgradeModal';

export default function UsageWarning({ 
  workshopId,
  metric = 'leads', // 'leads', 'api_calls', 'storage'
  threshold = 80, // Percentage threshold to show warning
  position = 'top', // 'top', 'bottom', 'inline'
  autoShow = true,
  onDismiss = null,
  compact = false
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (workshopId && autoShow) {
      checkUsage();
      
      // Set up periodic checks every 5 minutes
      const interval = setInterval(checkUsage, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [workshopId, metric, threshold]);

  const checkUsage = async () => {
    try {
      setLoading(true);
      
      // Get current usage data
      const limitCheck = await checkPackageLimit(workshopId, metric === 'leads' ? 'lead' : metric);
      const packageData = await getWorkshopPackage(workshopId);
      
      setUsageData(limitCheck);
      setPackageInfo(packageData);
      
      // Show warning if usage exceeds threshold and not unlimited
      if (limitCheck.limit !== -1 && limitCheck.limit > 0) {
        const percentage = (limitCheck.current_usage / limitCheck.limit) * 100;
        setShowWarning(percentage >= threshold && !dismissed);
      }
    } catch (error) {
      console.error('Error checking usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowWarning(false);
    if (onDismiss) onDismiss();
    
    // Store dismissal in localStorage to persist across sessions
    const dismissKey = `usage-warning-dismissed-${workshopId}-${metric}-${new Date().toDateString()}`;
    localStorage.setItem(dismissKey, 'true');
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const getWarningLevel = () => {
    if (!usageData || usageData.limit === -1) return 'info';
    
    const percentage = (usageData.current_usage / usageData.limit) * 100;
    if (percentage >= 95) return 'critical';
    if (percentage >= 85) return 'high';
    if (percentage >= threshold) return 'medium';
    return 'info';
  };

  const getWarningColors = (level) => {
    const colors = {
      critical: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: '🚨',
        iconColor: 'text-red-500',
        text: 'text-red-800',
        title: 'text-red-900',
        button: 'bg-red-600 hover:bg-red-700'
      },
      high: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: '⚠️',
        iconColor: 'text-orange-500',
        text: 'text-orange-800',
        title: 'text-orange-900',
        button: 'bg-orange-600 hover:bg-orange-700'
      },
      medium: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: '⚡',
        iconColor: 'text-yellow-500',
        text: 'text-yellow-800',
        title: 'text-yellow-900',
        button: 'bg-yellow-600 hover:bg-yellow-700'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'ℹ️',
        iconColor: 'text-blue-500',
        text: 'text-blue-800',
        title: 'text-blue-900',
        button: 'bg-blue-600 hover:bg-blue-700'
      }
    };
    return colors[level] || colors.info;
  };

  const getMetricInfo = () => {
    const metrics = {
      leads: {
        name: 'Leads',
        unit: '',
        description: 'Monatliche Lead-Generierung'
      },
      api_calls: {
        name: 'API Calls',
        unit: '',
        description: 'API-Aufrufe pro Monat'
      },
      storage: {
        name: 'Speicher',
        unit: ' GB',
        description: 'Verwendeter Speicherplatz'
      }
    };
    return metrics[metric] || metrics.leads;
  };

  const getWarningMessage = () => {
    if (!usageData || !packageInfo) return {};
    
    const percentage = usageData.limit === -1 ? 0 : (usageData.current_usage / usageData.limit) * 100;
    const metricInfo = getMetricInfo();
    const level = getWarningLevel();
    
    const messages = {
      critical: {
        title: `🚨 ${metricInfo.name} Limit erreicht!`,
        message: `Sie haben ${percentage.toFixed(0)}% Ihres ${metricInfo.name}-Limits verwendet (${usageData.current_usage}${metricInfo.unit} von ${usageData.limit}${metricInfo.unit}). Upgraden Sie jetzt, um Unterbrechungen zu vermeiden.`,
        cta: 'Sofort upgraden'
      },
      high: {
        title: `⚠️ ${metricInfo.name} Limit fast erreicht`,
        message: `Sie haben ${percentage.toFixed(0)}% Ihres ${metricInfo.name}-Limits verwendet (${usageData.current_usage}${metricInfo.unit} von ${usageData.limit}${metricInfo.unit}). Nur noch ${usageData.limit - usageData.current_usage}${metricInfo.unit} verfügbar.`,
        cta: 'Jetzt upgraden'
      },
      medium: {
        title: `⚡ ${metricInfo.name} Nutzung hoch`,
        message: `Sie haben ${percentage.toFixed(0)}% Ihres ${metricInfo.name}-Limits erreicht. Zeit für ein Upgrade zu mehr Kapazität.`,
        cta: 'Upgrade prüfen'
      }
    };
    
    return messages[level] || messages.medium;
  };

  const renderCompactWarning = () => {
    const warning = getWarningMessage();
    const colors = getWarningColors(getWarningLevel());
    const percentage = usageData ? (usageData.current_usage / usageData.limit) * 100 : 0;

    return (
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-3 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <span className={`${colors.iconColor} text-lg`}>{colors.icon}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${colors.title}`}>
                {percentage.toFixed(0)}% verwendet
              </div>
              <div className={`text-xs ${colors.text} truncate`}>
                {usageData.current_usage}{getMetricInfo().unit} von {usageData.limit}{getMetricInfo().unit}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpgradeClick}
              className={`${colors.button} text-white text-xs px-3 py-1 rounded transition`}
            >
              Upgrade
            </button>
            <button
              onClick={handleDismiss}
              className={`${colors.text} hover:opacity-70 text-lg leading-none`}
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                getWarningLevel() === 'critical' ? 'bg-red-500' :
                getWarningLevel() === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderFullWarning = () => {
    const warning = getWarningMessage();
    const colors = getWarningColors(getWarningLevel());
    const metricInfo = getMetricInfo();
    const percentage = usageData ? (usageData.current_usage / usageData.limit) * 100 : 0;

    return (
      <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 mb-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`${colors.iconColor} text-3xl`}>{colors.icon}</div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${colors.title} mb-2`}>
                {warning.title}
              </h3>
              <p className={`${colors.text} mb-4`}>
                {warning.message}
              </p>

              {/* Usage visualization */}
              <div className="bg-white/70 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {metricInfo.description}
                  </span>
                  <span className="text-sm text-gray-600">
                    {usageData.current_usage}{metricInfo.unit} / {usageData.limit}{metricInfo.unit}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      getWarningLevel() === 'critical' ? 'bg-red-500' :
                      getWarningLevel() === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="text-xs text-gray-600 text-center">
                  {percentage.toFixed(1)}% verwendet
                  {usageData.limit - usageData.current_usage > 0 && 
                    ` • ${usageData.limit - usageData.current_usage}${metricInfo.unit} verbleibend`
                  }
                </div>
              </div>

              {/* Upgrade benefits preview */}
              <div className="bg-white/50 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-2">💡 Mit einem Upgrade erhalten Sie:</div>
                  <div className="space-y-1">
                    {packageInfo?.id === 'basic' ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>Unbegrenzte {metricInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>Erweiterte Features</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>Prioritäts-Support</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>Alle Professional Features</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>Persönlicher Account Manager</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>Custom Integrationen</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleUpgradeClick}
                  className={`${colors.button} text-white px-6 py-2 rounded-lg transition font-medium`}
                >
                  {warning.cta}
                </button>
                <a
                  href="/pricing"
                  className={`border ${colors.border} ${colors.text} px-6 py-2 rounded-lg hover:bg-white/50 transition font-medium`}
                >
                  Pläne vergleichen
                </a>
                <button
                  onClick={handleDismiss}
                  className={`${colors.text} hover:opacity-70 text-sm`}
                >
                  Später erinnern
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`${colors.text} hover:opacity-70 text-2xl ml-4 flex-shrink-0`}
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  // Don't render if loading or no warning needed
  if (loading || !showWarning || !usageData || usageData.limit === -1) {
    return null;
  }

  const warningComponent = compact ? renderCompactWarning() : renderFullWarning();

  // Position-based rendering
  if (position === 'top') {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
        {warningComponent}
      </div>
    );
  }
  
  if (position === 'bottom') {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
        {warningComponent}
      </div>
    );
  }

  return (
    <>
      {warningComponent}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        workshopId={workshopId}
        currentPackage={packageInfo?.id || 'basic'}
        targetPackage={packageInfo?.id === 'basic' ? 'professional' : 'enterprise'}
        trigger="usage"
        usageData={{
          percentage: usageData ? (usageData.current_usage / usageData.limit) * 100 : 0,
          leads: metric === 'leads' ? {
            current: usageData?.current_usage,
            limit: usageData?.limit
          } : null,
          apiCalls: metric === 'api_calls' ? {
            current: usageData?.current_usage,
            limit: usageData?.limit
          } : null
        }}
      />
    </>
  );
}