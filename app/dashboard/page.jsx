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
      // First try to get user from JWT token
      let user = null
      let workshopData = null
      
      const jwtToken = localStorage.getItem('carbot_access_token')
      if (jwtToken) {
        // Try to decode JWT token for user info
        try {
          const base64Url = jwtToken.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const decoded = JSON.parse(window.atob(base64))
          
          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000)
          if (decoded.exp && decoded.exp >= currentTime) {
            user = {
              id: decoded.sub,
              email: decoded.email
            }
            
            // Create workshop data from JWT
            workshopData = {
              id: decoded.workshop_id,
              name: decoded.workshop_name,
              owner_email: decoded.email,
              slug: decoded.workshop_id // Use workshop_id as slug
            }
            
            console.log('✅ [Dashboard Page] Using JWT token data')
          }
        } catch (tokenError) {
          console.warn('⚠️ [Dashboard Page] JWT token decode failed:', tokenError.message)
        }
      }
      
      // Fallback to Supabase auth if no valid JWT
      if (!user) {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        
        if (!supabaseUser) return
        user = supabaseUser

        // Load workshop data from database
        const { data: supabaseWorkshopData } = await supabase
          .from('workshops')
          .select('*')
          .eq('owner_email', user.email)
          .single()
          
        workshopData = supabaseWorkshopData
      }

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚗</div>
          <div className="text-gray-600">Lade Dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Willkommen zurück, {workshop?.owner_name || 'Workshop-Besitzer'}! 👋
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Hier ist eine Übersicht über Ihre CarBot Performance
            </p>
          </div>
        </div>

        {/* Setup Progress (if incomplete) */}
        {setupProgress < 100 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  🚀 Setup vervollständigen
                </h3>
                <p className="text-sm text-amber-700 mb-4">
                  Vervollständigen Sie Ihr Setup um das volle Potenzial von CarBot zu nutzen
                </p>
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-amber-600 mb-1">
                    <span>Fortschritt</span>
                    <span>{setupProgress}%</span>
                  </div>
                  <div className="bg-amber-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${setupProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/onboarding"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 text-center"
              >
                Setup fortsetzen
              </Link>
            </div>
          </div>
        )}

        {/* Usage Indicator for Basic/Professional plans */}
        {packageInfo && workshop?.id && (
          <div className="mb-8">
            <UsageIndicator workshopId={workshop.id} compact={false} />
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats customerSlug={workshop?.slug} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                📈 Neueste Aktivitäten
              </h3>
            </div>
            
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            Neuer Lead: {activity.name}
                          </div>
                          <div className="text-gray-500 text-sm mt-1">
                            {activity.anliegen.substring(0, 50)}...
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-4 flex-shrink-0">
                          {new Date(activity.created_at).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📭</div>
                  <div className="text-gray-500">Noch keine Aktivitäten vorhanden</div>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/dashboard/leads"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium block text-center transition-colors"
                >
                  Alle Leads ansehen →
                </Link>
              </div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                🔗 Integrationen
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
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
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/dashboard/settings"
                  className="block text-center bg-gray-50 hover:bg-gray-100 text-blue-600 hover:text-blue-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Integrationen verwalten
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            🚀 Schnellaktionen
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            💡 Brauchen Sie Hilfe?
          </h3>
          <p className="text-blue-700 mb-6">
            Unser Support-Team steht Ihnen bei Fragen zur Verfügung
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/help"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              📚 Dokumentation
            </Link>
            <Link
              href="mailto:support@carbot.chat"
              className="bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              💬 Support kontaktieren
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

function IntegrationItem({ icon, name, status, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {name}
          </div>
          <div className="text-gray-500 text-xs">
            {description}
          </div>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        status 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {status ? 'Aktiv' : 'Inaktiv'}
      </div>
    </div>
  )
}

function QuickActionButton({ href, icon, title, description, disabled = false, upgradeRequired = false }) {
  const baseClasses = `
    block p-6 rounded-xl border transition-all duration-200
    ${disabled 
      ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-1'
    }
  `

  const content = (
    <>
      <div className="text-2xl mb-3">
        {disabled && upgradeRequired ? '🔒' : icon}
      </div>
      <div className={`font-semibold text-base mb-2 ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
        {title}
        {upgradeRequired && (
          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            PRO
          </span>
        )}
      </div>
      <div className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </div>
    </>
  )

  if (disabled) {
    return (
      <div className={baseClasses}>
        {content}
      </div>
    )
  }

  return (
    <Link href={href} className={baseClasses}>
      {content}
    </Link>
  )
}