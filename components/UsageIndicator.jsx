/**
 * Usage Indicator Component for CarBot Dashboard
 * Shows current usage statistics and limits for workshop packages
 */

'use client'
import { useState, useEffect } from 'react'
import { getWorkshopPackage, generateUpgradeUrl, formatEuroCurrency } from '../lib/packageFeatures'

export default function UsageIndicator({ workshopId, compact = false }) {
  const [packageInfo, setPackageInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (workshopId) {
      loadPackageInfo()
    }
  }, [workshopId])

  const loadPackageInfo = async () => {
    try {
      setLoading(true)
      const info = await getWorkshopPackage(workshopId)
      setPackageInfo(info)
      setError(null)
    } catch (err) {
      console.error('Error loading package info:', err)
      setError('Fehler beim Laden der Paket-Informationen')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        padding: compact ? '10px' : '20px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ color: '#6b7280', fontSize: compact ? '12px' : '14px' }}>
          Lade Nutzungsdaten...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: compact ? '10px' : '20px',
        background: '#fef2f2',
        borderRadius: '8px',
        border: '1px solid #fecaca',
        color: '#dc2626'
      }}>
        <div style={{ fontSize: compact ? '12px' : '14px' }}>
          {error}
        </div>
      </div>
    )
  }

  if (!packageInfo) {
    return null
  }

  const getUsagePercentage = (current, limit) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage) => {
    if (percentage >= 95) return '#dc2626' // Red
    if (percentage >= 80) return '#f59e0b' // Orange
    return '#059669' // Green
  }

  const renderUsageBar = (label, current, limit, metric = '') => {
    const isUnlimited = limit === -1
    const percentage = isUnlimited ? 0 : getUsagePercentage(current, limit)
    const color = getUsageColor(percentage)

    return (
      <div style={{ marginBottom: compact ? '8px' : '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px'
        }}>
          <span style={{
            fontSize: compact ? '12px' : '14px',
            fontWeight: '500',
            color: '#1f2937'
          }}>
            {label}
          </span>
          <span style={{
            fontSize: compact ? '11px' : '12px',
            color: '#6b7280'
          }}>
            {isUnlimited ? `${current}${metric} (unbegrenzt)` : `${current}${metric} / ${limit}${metric}`}
          </span>
        </div>
        
        {!isUnlimited && (
          <div style={{
            height: compact ? '4px' : '6px',
            background: '#e5e7eb',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: color,
              width: `${percentage}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}
        
        {!isUnlimited && percentage >= 80 && (
          <div style={{
            fontSize: '11px',
            color: color,
            marginTop: '2px',
            fontWeight: '500'
          }}>
            {percentage >= 95 ? '⚠️ Limit fast erreicht' : '⚠️ Achtung: 80% erreicht'}
          </div>
        )}
      </div>
    )
  }

  const renderCompactView = () => {
    const leadsPercentage = getUsagePercentage(packageInfo.currentUsage.leads, packageInfo.limits.monthlyLeads)
    const apiPercentage = packageInfo.features.apiAccess ? getUsagePercentage(packageInfo.currentUsage.apiCalls, packageInfo.limits.apiCalls) : 0
    const shouldShowUpgrade = (leadsPercentage >= 80 || apiPercentage >= 80) && packageInfo.limits.monthlyLeads !== -1

    return (
      <div style={{
        padding: '16px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        position: 'relative'
      }}>
        {/* Header with Plan Name and Status Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              {packageInfo.name}
            </span>
            <span style={{
              fontSize: '10px',
              background: shouldShowUpgrade ? '#fef3c7' : '#ecfdf5',
              color: shouldShowUpgrade ? '#92400e' : '#166534',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: '600'
            }}>
              {shouldShowUpgrade ? '⚠️ Limit erreicht' : '✅ Aktiv'}
            </span>
          </div>
          <span style={{
            fontSize: '12px',
            background: '#f1f5f9',
            color: '#1f2937',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: '500'
          }}>
            {formatEuroCurrency(packageInfo.priceEur)}/Mon
          </span>
        </div>

        {/* Critical Usage Alert */}
        {leadsPercentage >= 95 && packageInfo.limits.monthlyLeads !== -1 && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '12px',
            fontSize: '11px'
          }}>
            <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '2px' }}>
              🚨 Kritisches Limit erreicht!
            </div>
            <div style={{ color: '#991b1b' }}>
              Nur noch {packageInfo.limits.monthlyLeads - packageInfo.currentUsage.leads} Leads verfügbar
            </div>
          </div>
        )}

        {/* Enhanced Usage Bars */}
        <div style={{ marginBottom: shouldShowUpgrade ? '12px' : '0' }}>
          {renderUsageBar(
            'Leads',
            packageInfo.currentUsage.leads,
            packageInfo.limits.monthlyLeads
          )}

          {packageInfo.features.apiAccess && renderUsageBar(
            'API Calls',
            packageInfo.currentUsage.apiCalls,
            packageInfo.limits.apiCalls
          )}
        </div>
        
        {/* Smart Upgrade Prompt */}
        {shouldShowUpgrade && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '11px',
            border: '1px solid #f59e0b'
          }}>
            <div style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '4px' }}>
              🚀 Zeit für ein Upgrade!
            </div>
            <div style={{ color: '#b45309', marginBottom: '6px' }}>
              Sie nutzen {Math.max(leadsPercentage, apiPercentage).toFixed(0)}% Ihrer Kapazität. 
              Vermeiden Sie Ausfallzeiten mit einem Upgrade.
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <a 
                href={generateUpgradeUrl(workshopId, packageInfo.id === 'basic' ? 'professional' : 'enterprise')}
                style={{ 
                  background: '#059669',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              >
                Jetzt upgraden
              </a>
              <span style={{ color: '#78716c', fontSize: '10px' }}>
                ab {formatEuroCurrency(packageInfo.id === 'basic' ? 9900 : 19900)}/Mon
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderFullView = () => (
    <div style={{
      padding: '24px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h3 style={{
            margin: '0 0 4px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            📊 Aktuelle Nutzung
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {packageInfo.name} Plan • {formatEuroCurrency(packageInfo.priceEur)}/Monat
          </p>
        </div>
        
        <div style={{
          textAlign: 'right'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '2px'
          }}>
            Abrechnungszeitraum
          </div>
          <div style={{
            fontSize: '13px',
            color: '#1f2937',
            fontWeight: '500'
          }}>
            {new Date(packageInfo.billingPeriod.start).toLocaleDateString('de-DE')} -{' '}
            {new Date(packageInfo.billingPeriod.end).toLocaleDateString('de-DE')}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div>
          {renderUsageBar(
            'Monatliche Leads',
            packageInfo.currentUsage.leads,
            packageInfo.limits.monthlyLeads
          )}
          
          {packageInfo.features.apiAccess && renderUsageBar(
            'API Aufrufe',
            packageInfo.currentUsage.apiCalls,
            packageInfo.limits.apiCalls
          )}
          
          {renderUsageBar(
            'Speicher',
            packageInfo.currentUsage.storage,
            packageInfo.limits.storageGB,
            ' GB'
          )}
        </div>

        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            color: '#1f2937'
          }}>
            Verfügbare Features
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FeatureItem 
              enabled={packageInfo.features.emailSupport}
              text="E-Mail Support"
            />
            <FeatureItem 
              enabled={packageInfo.features.phoneSupport}
              text="Telefon Support"
            />
            <FeatureItem 
              enabled={packageInfo.features.advancedAnalytics}
              text="Erweiterte Analysen"
            />
            <FeatureItem 
              enabled={packageInfo.features.apiAccess}
              text="API-Zugang"
            />
            <FeatureItem 
              enabled={packageInfo.features.customIntegrations}
              text="Custom Integrationen"
            />
            <FeatureItem 
              enabled={packageInfo.features.personalSupport}
              text="Persönlicher Support"
            />
          </div>
        </div>
      </div>

      {/* Upgrade suggestion */}
      {((packageInfo.currentUsage.leads / packageInfo.limits.monthlyLeads) >= 0.8 && packageInfo.limits.monthlyLeads !== -1) && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                color: '#92400e'
              }}>
                🚀 Upgrade empfohlen
              </h4>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#b45309'
              }}>
                Sie nähern sich Ihren Limits. Upgraden Sie für unbegrenzte Nutzung.
              </p>
            </div>
            <a
              href={generateUpgradeUrl(workshopId, packageInfo.id === 'basic' ? 'professional' : 'enterprise')}
              style={{
                background: '#059669',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Jetzt upgraden
            </a>
          </div>
        </div>
      )}
    </div>
  )

  return compact ? renderCompactView() : renderFullView()
}

function FeatureItem({ enabled, text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px'
    }}>
      <span style={{
        color: enabled ? '#059669' : '#9ca3af',
        fontSize: '14px'
      }}>
        {enabled ? '✅' : '❌'}
      </span>
      <span style={{
        color: enabled ? '#1f2937' : '#9ca3af'
      }}>
        {text}
      </span>
    </div>
  )
}