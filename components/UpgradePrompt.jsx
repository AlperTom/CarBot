'use client'
import { useState, useEffect } from 'react'
import { getWorkshopPackage, generateUpgradeUrl, formatEuroCurrency } from '../lib/packageFeatures'

export default function UpgradePrompt({ workshopId, trigger = 'usage', onDismiss }) {
  const [packageInfo, setPackageInfo] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (workshopId) {
      loadPackageAndCheckTrigger()
    }
  }, [workshopId, trigger])

  const loadPackageAndCheckTrigger = async () => {
    try {
      const info = await getWorkshopPackage(workshopId)
      setPackageInfo(info)

      if (info) {
        const shouldShow = shouldShowUpgradePrompt(info, trigger)
        setShowPrompt(shouldShow)
      }
    } catch (error) {
      console.error('Error loading package info:', error)
    } finally {
      setLoading(false)
    }
  }

  const shouldShowUpgradePrompt = (packageInfo, trigger) => {
    if (!packageInfo || packageInfo.id === 'enterprise') return false

    const leadsUsage = packageInfo.limits.monthlyLeads === -1 ? 0 : 
      (packageInfo.currentUsage.leads / packageInfo.limits.monthlyLeads) * 100

    const apiUsage = !packageInfo.features.apiAccess ? 0 :
      packageInfo.limits.apiCalls === -1 ? 0 :
      (packageInfo.currentUsage.apiCalls / packageInfo.limits.apiCalls) * 100

    switch (trigger) {
      case 'usage':
        return leadsUsage >= 80 || apiUsage >= 80
      case 'feature':
        return !packageInfo.features.advancedAnalytics || !packageInfo.features.apiAccess
      case 'support':
        return !packageInfo.features.phoneSupport
      default:
        return false
    }
  }

  const getUpgradeMessage = () => {
    if (!packageInfo) return {}

    const isBasic = packageInfo.id === 'basic'
    const targetPlan = isBasic ? 'professional' : 'enterprise'
    const targetPrice = isBasic ? '99€' : 'Individual'
    
    const messages = {
      usage: {
        title: '🚀 Ihre Nutzung wächst!',
        description: `Sie nutzen bereits ${Math.max(
          packageInfo.limits.monthlyLeads === -1 ? 0 : (packageInfo.currentUsage.leads / packageInfo.limits.monthlyLeads) * 100,
          !packageInfo.features.apiAccess ? 0 : packageInfo.limits.apiCalls === -1 ? 0 : (packageInfo.currentUsage.apiCalls / packageInfo.limits.apiCalls) * 100
        ).toFixed(0)}% Ihrer Kapazität. Zeit für ein Upgrade!`,
        buttonText: `Upgrade auf ${targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1)}`
      },
      feature: {
        title: '📊 Mehr Funktionen freischalten',
        description: `Erweitern Sie CarBot mit ${isBasic ? 'erweiterten Analysen, API-Zugang und Telefon-Support' : 'custom Integrationen und persönlichem Support'}.`,
        buttonText: `Upgrade auf ${targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1)}`
      },
      support: {
        title: '📞 Brauchen Sie mehr Support?',
        description: `Erhalten Sie ${isBasic ? 'Telefon-Support' : 'persönlichen Support'} und prioritäre Betreuung.`,
        buttonText: `Upgrade auf ${targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1)}`
      }
    }

    return {
      ...messages[trigger] || messages.usage,
      targetPlan,
      targetPrice
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    if (onDismiss) onDismiss()
  }

  if (loading || !showPrompt || !packageInfo) {
    return null
  }

  const upgradeMessage = getUpgradeMessage()

  return (
    <div style={{
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      border: '1px solid #3b82f6',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      position: 'relative'
    }}>
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          color: '#6b7280',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '4px'
        }}
      >
        ×
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e40af'
          }}>
            {upgradeMessage.title}
          </h3>
          <p style={{
            margin: '0 0 12px 0',
            color: '#3730a3',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {upgradeMessage.description}
          </p>
          
          {/* Feature highlights */}
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            fontSize: '12px',
            color: '#4338ca'
          }}>
            {packageInfo.id === 'basic' && (
              <>
                <span>✅ Unbegrenzte Leads</span>
                <span>✅ API-Zugang</span>
                <span>✅ Telefon Support</span>
              </>
            )}
            {packageInfo.id === 'professional' && (
              <>
                <span>✅ Custom Integrationen</span>
                <span>✅ Persönlicher Support</span>
                <span>✅ White-Label</span>
              </>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e40af'
          }}>
            {upgradeMessage.targetPrice}
            {upgradeMessage.targetPrice !== 'Individual' && <span style={{ fontSize: '14px' }}>/Mon</span>}
          </div>
          
          <a
            href={generateUpgradeUrl(workshopId, upgradeMessage.targetPlan)}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'inline-block',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.background = '#2563eb'}
          >
            {upgradeMessage.buttonText}
          </a>
          
          <span style={{
            fontSize: '11px',
            color: '#6b7280'
          }}>
            Jederzeit kündbar
          </span>
        </div>
      </div>
    </div>
  )
}