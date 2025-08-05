'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import DashboardStats from '../../components/DashboardStats'
import UsageIndicator from '../../components/UsageIndicator'
import { getWorkshopPackage, checkFeatureAccess } from '../../lib/packageFeatures'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function DashboardPage() {
  const [workshop, setWorkshop] = useState(null)
  const [setupProgress, setSetupProgress] = useState(0)
  const [recentActivity, setRecentActivity] = useState([])
  const [integrations, setIntegrations] = useState({})
  const [packageInfo, setPackageInfo] = useState(null)
  const [features, setFeatures] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Load workshop data
      const { data: workshopData } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.email)
        .single()

      if (workshopData) {
        setWorkshop(workshopData)
        calculateSetupProgress(workshopData)
      }

      // Load recent activity
      const { data: activityData } = await supabase
        .from('leads')
        .select('name, anliegen, created_at')
        .eq('kunde_id', workshopData?.slug)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentActivity(activityData || [])

      // Check integrations status
      setIntegrations({
        website: workshopData?.widget_installed || false,
        whatsapp: workshopData?.whatsapp_connected || false,
        google: workshopData?.google_connected || false,
        stripe: workshopData?.stripe_connected || false
      })

      // Load package information and feature access
      if (workshopData?.id) {
        try {
          const packageData = await getWorkshopPackage(workshopData.id)
          setPackageInfo(packageData)

          // Check feature access
          const featureChecks = await Promise.all([
            checkFeatureAccess(workshopData.id, 'advancedAnalytics'),
            checkFeatureAccess(workshopData.id, 'apiAccess'),
            checkFeatureAccess(workshopData.id, 'phoneSupport'),
            checkFeatureAccess(workshopData.id, 'customIntegrations')
          ])

          setFeatures({
            advancedAnalytics: featureChecks[0].allowed,
            apiAccess: featureChecks[1].allowed,
            phoneSupport: featureChecks[2].allowed,
            customIntegrations: featureChecks[3].allowed
          })
        } catch (packageError) {
          console.error('Error loading package info:', packageError)
        }
      }

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSetupProgress = (workshop) => {
    const checks = [
      workshop.name,
      workshop.address,
      workshop.phone,
      workshop.opening_hours,
      workshop.services?.length > 0,
      workshop.widget_installed,
      workshop.stripe_connected
    ]
    
    const completed = checks.filter(Boolean).length
    setSetupProgress(Math.round((completed / checks.length) * 100))
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🚗</div>
        <div style={{ color: '#666' }}>Lade Dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1a202c',
          margin: '0 0 10px 0'
        }}>
          Willkommen zurück, {workshop?.owner_name || 'Workshop-Besitzer'}! 👋
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: 0
        }}>
          Hier ist eine Übersicht über Ihre CarBot Performance
        </p>
      </div>

      {/* Setup Progress (if incomplete) */}
      {setupProgress < 100 && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#92400e' }}>
              🚀 Setup vervollständigen
            </h3>
            <p style={{ margin: '0 0 10px 0', color: '#b45309', fontSize: '14px' }}>
              Vervollständigen Sie Ihr Setup um das volle Potenzial von CarBot zu nutzen
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '10px',
              height: '8px',
              width: '200px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#059669',
                height: '100%',
                width: `${setupProgress}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '12px', color: '#92400e', marginTop: '5px' }}>
              {setupProgress}% abgeschlossen
            </div>
          </div>
          <Link
            href="/dashboard/onboarding"
            style={{
              background: '#059669',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Setup fortsetzen
          </Link>
        </div>
      )}

      {/* Usage Indicator for Basic/Professional plans */}
      {packageInfo && workshop?.id && (
        <div style={{ marginBottom: '30px' }}>
          <UsageIndicator workshopId={workshop.id} compact={false} />
        </div>
      )}

      {/* Dashboard Stats */}
      <DashboardStats customerSlug={workshop?.slug} />

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px',
        marginTop: '30px'
      }}>
        {/* Recent Activity */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            padding: '20px 20px 10px 20px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              color: '#1a202c',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📈 Neueste Aktivitäten
            </h3>
          </div>
          
          <div style={{ padding: '0 20px 20px 20px' }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1a202c', fontSize: '14px' }}>
                      Neuer Lead: {activity.name}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                      {activity.anliegen.substring(0, 50)}...
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af',
                    textAlign: 'right'
                  }}>
                    {new Date(activity.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📭</div>
                <div>Noch keine Aktivitäten vorhanden</div>
              </div>
            )}
            
            <Link
              href="/dashboard/leads"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '15px',
                color: '#0070f3',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Alle Leads ansehen →
            </Link>
          </div>
        </div>

        {/* Integration Status */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            padding: '20px 20px 10px 20px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              color: '#1a202c',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🔗 Integrationen
            </h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <IntegrationItem
                icon="🌐"
                name="Website Widget"
                status={integrations.website}
                description="CarBot auf Ihrer Website eingebettet"
              />
              <IntegrationItem
                icon="💬"
                name="WhatsApp Business"
                status={integrations.whatsapp}
                description="Automatische WhatsApp Nachrichten"
              />
              <IntegrationItem
                icon="🗺️"
                name="Google My Business"
                status={integrations.google}
                description="Google Bewertungen und Standort"
              />
              <IntegrationItem
                icon="💳"
                name="Stripe Zahlungen"
                status={integrations.stripe}
                description="Online Zahlungen und Abonnements"
              />
            </div>
            
            <Link
              href="/dashboard/settings"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '20px',
                background: '#f8fafc',
                color: '#0070f3',
                padding: '12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Integrationen verwalten
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '30px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          color: '#1a202c'
        }}>
          🚀 Schnellaktionen
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <QuickActionButton
            href="/dashboard/settings"
            icon="⚙️"
            title="Bot konfigurieren"
            description="Einstellungen anpassen"
            disabled={false}
          />
          <QuickActionButton
            href="/analytics"
            icon="📊"
            title="Analytics ansehen"
            description={features.advancedAnalytics ? "Detaillierte Berichte" : "Upgrade für erweiterte Analysen"}
            disabled={!features.advancedAnalytics}
            upgradeRequired={!features.advancedAnalytics}
          />
          <QuickActionButton
            href="/dashboard/leads"
            icon="🎯"
            title="Leads verwalten"
            description="Kundenkontakte bearbeiten"
            disabled={false}
          />
          {features.apiAccess && (
            <QuickActionButton
              href="/dashboard/client-keys"
              icon="🔑"
              title="API Keys verwalten"
              description="API-Zugang konfigurieren"
              disabled={false}
            />
          )}
          <QuickActionButton
            href="/dashboard/help"
            icon="❓"
            title="Hilfe & Support"
            description={features.phoneSupport ? "Telefon & E-Mail Support" : "E-Mail Support"}
            disabled={false}
          />
        </div>
      </div>

      {/* Help Section */}
      <div style={{
        marginTop: '40px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1e40af', fontSize: '20px' }}>
          💡 Brauchen Sie Hilfe?
        </h3>
        <p style={{ margin: '0 0 20px 0', color: '#1e40af', fontSize: '16px' }}>
          Unser Support-Team steht Ihnen bei Fragen zur Verfügung
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link
            href="/dashboard/help"
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            📚 Dokumentation
          </Link>
          <Link
            href="mailto:support@carbot.chat"
            style={{
              background: 'white',
              color: '#2563eb',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '2px solid #2563eb'
            }}
          >
            💬 Support kontaktieren
          </Link>
        </div>
      </div>
    </div>
  )
}

function IntegrationItem({ icon, name, status, description }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <div>
          <div style={{ fontWeight: '500', color: '#1a202c', fontSize: '14px' }}>
            {name}
          </div>
          <div style={{ color: '#6b7280', fontSize: '12px' }}>
            {description}
          </div>
        </div>
      </div>
      <div style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        background: status ? '#dcfce7' : '#fef2f2',
        color: status ? '#166534' : '#dc2626'
      }}>
        {status ? 'Aktiv' : 'Inaktiv'}
      </div>
    </div>
  )
}

function QuickActionButton({ href, icon, title, description, disabled = false, upgradeRequired = false }) {
  const buttonStyle = {
    display: 'block',
    padding: '20px',
    background: disabled ? '#f9fafb' : '#f8fafc',
    borderRadius: '8px',
    textDecoration: 'none',
    border: disabled ? '1px solid #e5e7eb' : '1px solid #e2e8f0',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative'
  }

  const content = (
    <>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        {disabled && upgradeRequired ? '🔒' : icon}
      </div>
      <div style={{ 
        fontWeight: 'bold', 
        color: disabled ? '#9ca3af' : '#1a202c', 
        fontSize: '16px',
        marginBottom: '5px'
      }}>
        {title}
        {upgradeRequired && (
          <span style={{
            fontSize: '10px',
            background: '#fbbf24',
            color: '#92400e',
            padding: '2px 6px',
            borderRadius: '4px',
            marginLeft: '8px'
          }}>
            PRO
          </span>
        )}
      </div>
      <div style={{ color: disabled ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
        {description}
      </div>
    </>
  )

  if (disabled) {
    return (
      <div style={buttonStyle}>
        {content}
      </div>
    )
  }

  return (
    <Link
      href={href}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.background = '#f1f5f9'
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.background = '#f8fafc'
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = 'none'
        }
      }}
    >
      {content}
    </Link>
  )
}