'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function SubscriptionManager({ workshopId }) {
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchSubscriptionData()
    fetchAvailablePlans()
  }, [workshopId])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/payments/stripe', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setSubscription(result.data)
      } else {
        console.error('Failed to fetch subscription data')
      }
    } catch (error) {
      console.error('Subscription fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailablePlans = async () => {
    try {
      // This would typically come from an API endpoint
      // For now, we'll use the predefined plans
      const planData = [
        {
          id: 'basic',
          plan_type: 'basic',
          plan_name: 'Basic Plan',
          plan_name_de: 'Basis Plan',
          price_monthly: 29.00,
          price_yearly: 290.00,
          features: {
            templates: 1,
            support: 'email',
            analytics: 'basic',
            max_contacts: 100,
            custom_domain: false,
            csv_export: false
          },
          popular: false
        },
        {
          id: 'professional',
          plan_type: 'professional',
          plan_name: 'Professional Plan',
          plan_name_de: 'Professional Plan',
          price_monthly: 79.00,
          price_yearly: 790.00,
          features: {
            templates: 5,
            support: 'phone',
            analytics: 'advanced',
            max_contacts: -1,
            custom_domain: true,
            csv_export: true,
            api_access: true
          },
          popular: true
        },
        {
          id: 'enterprise',
          plan_type: 'enterprise',
          plan_name: 'Enterprise Plan',
          plan_name_de: 'Enterprise Plan',
          price_monthly: 199.00,
          price_yearly: 1990.00,
          features: {
            templates: -1,
            support: 'priority',
            analytics: 'premium',
            max_contacts: -1,
            custom_domain: true,
            csv_export: true,
            api_access: true,
            white_label: true,
            priority_support: true
          },
          popular: false
        }
      ]
      setPlans(planData)
    } catch (error) {
      console.error('Plans fetch error:', error)
    }
  }

  const handleUpgrade = async (planType, billingCycle = 'monthly') => {
    try {
      setUpgrading(true)
      
      // For demo purposes, we'll simulate the upgrade process
      // In production, this would integrate with Stripe Elements
      const stripe = await stripePromise
      
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        },
        body: JSON.stringify({
          planType,
          billingCycle,
          // In production, you'd collect this from Stripe Elements
          paymentMethodId: 'pm_demo_payment_method'
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        await fetchSubscriptionData()
        setShowUpgradeModal(false)
      } else {
        const error = await response.json()
        alert(`Upgrade failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Upgrade failed. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Sind Sie sicher, dass Sie Ihr Abonnement kündigen möchten? Es wird am Ende der aktuellen Abrechnungsperiode beendet.')) {
      return
    }

    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        await fetchSubscriptionData()
      } else {
        const error = await response.json()
        alert(`Cancellation failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Cancellation error:', error)
      alert('Cancellation failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: isMobile ? '1rem' : '2rem', 
        textAlign: 'center' 
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #ea580c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Lade Abonnement-Daten...</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
        <h1 style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: '0 0 0.5rem 0'
        }}>
          💳 Abonnement & Billing
        </h1>
        <p style={{ 
          color: '#64748b', 
          margin: 0,
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          Verwalten Sie Ihr CarBot-Abonnement und Zahlungsmethoden
        </p>
      </div>

      {/* Current Subscription Status */}
      {subscription?.hasSubscription ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: isMobile ? '1.5rem' : '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'stretch' : 'center', 
            gap: isMobile ? '1rem' : '0',
            marginBottom: '1.5rem' 
          }}>
            <h2 style={{ 
              color: '#1e293b', 
              margin: 0,
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              🎯 Aktuelles Abonnement
            </h2>
            <div style={{
              padding: '0.5rem 1rem',
              background: subscription.stripeStatus === 'active' ? '#dcfce7' : 
                         subscription.stripeStatus === 'trialing' ? '#dbeafe' : '#fee2e2',
              color: subscription.stripeStatus === 'active' ? '#166534' :
                     subscription.stripeStatus === 'trialing' ? '#1e40af' : '#dc2626',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              {subscription.stripeStatus === 'active' ? '✅ Aktiv' :
               subscription.stripeStatus === 'trialing' ? '🎁 Testphase' :
               subscription.stripeStatus === 'past_due' ? '⚠️ Überfällig' : '❌ Inaktiv'}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: isMobile ? '1rem' : '1.5rem'
          }}>
            {/* Plan Details */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: isMobile ? '1rem' : '1.5rem'
            }}>
              <h3 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>
                📋 {subscription.subscription?.subscription_plans?.plan_name_de}
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ea580c' }}>
                  €{subscription.subscription?.subscription_plans?.price_monthly}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  /{subscription.subscription?.billing_cycle === 'yearly' ? 'Jahr' : 'Monat'}
                </span>
              </div>
              
              {/* Feature List */}
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  ✅ {subscription.subscription?.subscription_plans?.features?.templates === -1 ? 
                      'Unbegrenzte Templates' : 
                      `${subscription.subscription?.subscription_plans?.features?.templates} Template(s)`}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  ✅ {subscription.subscription?.subscription_plans?.features?.max_contacts === -1 ? 
                      'Unbegrenzte Kontakte' : 
                      `${subscription.subscription?.subscription_plans?.features?.max_contacts} Kontakte/Monat`}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  ✅ {subscription.subscription?.subscription_plans?.features?.support === 'email' ? 'E-Mail Support' :
                       subscription.subscription?.subscription_plans?.features?.support === 'phone' ? 'Telefon Support' :
                       'Priority Support'}
                </div>
                {subscription.subscription?.subscription_plans?.features?.csv_export && (
                  <div style={{ marginBottom: '0.5rem' }}>✅ CSV Export</div>
                )}
                {subscription.subscription?.subscription_plans?.features?.api_access && (
                  <div style={{ marginBottom: '0.5rem' }}>✅ API Zugang</div>
                )}
              </div>
            </div>

            {/* Billing Information */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: isMobile ? '1rem' : '1.5rem'
            }}>
              <h3 style={{ color: '#1e293b', margin: '0 0 1rem 0' }}>💰 Abrechnung</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Nächste Rechnung:</span>
                  <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '0.875rem' }}>
                    {subscription.currentPeriodEnd ? 
                      new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('de-DE') : 
                      'N/A'}
                  </span>
                </div>
                
                {subscription.trialEnd && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Testphase endet:</span>
                    <span style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '0.875rem' }}>
                      {new Date(subscription.trialEnd * 1000).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                )}
                
                {subscription.cancelAtPeriodEnd && (
                  <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginTop: '1rem'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#dc2626' }}>
                      ⚠️ Abonnement wird am {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('de-DE')} gekündigt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1rem',
            marginTop: '2rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setShowUpgradeModal(true)}
              style={{
                padding: isMobile ? '1rem 2rem' : '0.75rem 2rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: isMobile ? '1rem' : '0.875rem',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              📈 Plan ändern
            </button>
            
            {!subscription.cancelAtPeriodEnd && (
              <button
                onClick={handleCancelSubscription}
                style={{
                  padding: isMobile ? '1rem 2rem' : '0.75rem 2rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: isMobile ? '1rem' : '0.875rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                ❌ Abonnement kündigen
              </button>
            )}
          </div>
        </div>
      ) : (
        /* No Subscription - Show Plans */
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: isMobile ? '1.5rem' : '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.5rem' : '2rem' }}>
            <h2 style={{ 
              color: '#1e293b', 
              margin: '0 0 0.5rem 0',
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              🚀 Wählen Sie Ihren Plan
            </h2>
            <p style={{ 
              color: '#64748b', 
              margin: 0,
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>
              Starten Sie mit einer 14-tägigen kostenlosen Testphase
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: isMobile ? '1.5rem' : '2rem'
          }}>
            {plans.map(plan => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onSelect={() => {
                  setSelectedPlan(plan)
                  setShowUpgradeModal(true)
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          plan={selectedPlan}
          onUpgrade={handleUpgrade}
          onClose={() => {
            setShowUpgradeModal(false)
            setSelectedPlan(null)
          }}
          upgrading={upgrading}
        />
      )}
    </div>
  )
}

// Plan Card Component
function PlanCard({ plan, onSelect, isCurrentPlan = false }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return (
    <div style={{
      background: plan.popular ? 
        'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
        '#f8fafc',
      border: plan.popular ? '2px solid #f59e0b' : '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: isMobile ? '1.5rem' : '2rem',
      position: 'relative',
      cursor: isCurrentPlan ? 'default' : 'pointer',
      opacity: isCurrentPlan ? 0.7 : 1
    }}>
      {plan.popular && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#f59e0b',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}>
          ⭐ Beliebt
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: isMobile ? '1rem' : '1.5rem' }}>
        <h3 style={{ 
          color: '#1e293b', 
          margin: '0 0 0.5rem 0',
          fontSize: isMobile ? '1.1rem' : '1.25rem',
          fontWeight: 'bold'
        }}>
          {plan.plan_name_de}
        </h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ 
            fontSize: isMobile ? '2rem' : '3rem', 
            fontWeight: 'bold', 
            color: '#ea580c'
          }}>
            €{plan.price_monthly}
          </span>
          <span style={{ 
            color: '#64748b', 
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            /Monat
          </span>
        </div>
        
        <div style={{ 
          fontSize: isMobile ? '0.75rem' : '0.875rem', 
          color: '#64748b' 
        }}>
          oder €{plan.price_yearly}/Jahr (2 Monate gratis!)
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
        <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>
          ✅ {plan.features.templates === -1 ? 'Alle Templates' : `${plan.features.templates} Template(s)`}
        </div>
        <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>
          ✅ {plan.features.max_contacts === -1 ? 'Unbegrenzte Kontakte' : `${plan.features.max_contacts} Kontakte/Monat`}
        </div>
        <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>
          ✅ {plan.features.support === 'email' ? 'E-Mail Support' :
               plan.features.support === 'phone' ? 'Telefon Support' : 'Priority Support'}
        </div>
        <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>
          ✅ {plan.features.analytics === 'basic' ? 'Basis Analytics' :
               plan.features.analytics === 'advanced' ? 'Erweiterte Analytics' : 'Premium Analytics'}
        </div>
        {plan.features.csv_export && (
          <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>✅ CSV Export</div>
        )}
        {plan.features.custom_domain && (
          <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>✅ Custom Domain</div>
        )}
        {plan.features.api_access && (
          <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>✅ API Zugang</div>
        )}
        {plan.features.white_label && (
          <div style={{ 
          marginBottom: '0.75rem', 
          fontSize: isMobile ? '1rem' : '0.875rem'
        }}>✅ White Label</div>
        )}
      </div>

      <button
        onClick={onSelect}
        disabled={isCurrentPlan}
        style={{
          width: '100%',
          padding: isMobile ? '1rem' : '0.75rem',
          background: isCurrentPlan ? '#9ca3af' : 
                     plan.popular ? 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)' : 
                     'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: isMobile ? '1.1rem' : '1rem'
        }}
      >
        {isCurrentPlan ? 'Aktueller Plan' : '🚀 Plan wählen'}
      </button>
    </div>
  )
}

// Upgrade Modal Component
function UpgradeModal({ plan, onUpgrade, onClose, upgrading }) {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!plan) return null

  const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly
  const savings = billingCycle === 'yearly' ? 
    Math.round(((plan.price_monthly * 12) - plan.price_yearly) / (plan.price_monthly * 12) * 100) : 0

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '0' : '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '0' : '16px',
        padding: isMobile ? '1.5rem' : '2rem',
        maxWidth: isMobile ? '100%' : '500px',
        width: '100%',
        maxHeight: isMobile ? '100vh' : '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            color: '#1e293b', 
            margin: 0,
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}>
            🚀 Plan upgraden
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: isMobile ? '1.75rem' : '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: isMobile ? '0.5rem' : '0'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h3 style={{ 
            color: '#1e293b', 
            margin: '0 0 1rem 0',
            fontSize: isMobile ? '1.1rem' : '1.25rem'
          }}>
            {plan.plan_name_de}
          </h3>
          
          {/* Billing Cycle Toggle */}
          <div style={{
            display: 'flex',
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '0.25rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: billingCycle === 'monthly' ? 'white' : 'transparent',
                color: billingCycle === 'monthly' ? '#1e293b' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: billingCycle === 'yearly' ? 'white' : 'transparent',
                color: billingCycle === 'yearly' ? '#1e293b' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Jährlich {savings > 0 && `(-${savings}%)`}
            </button>
          </div>

          <div>
            <span style={{ 
              fontSize: isMobile ? '2rem' : '3rem', 
              fontWeight: 'bold', 
              color: '#ea580c' 
            }}>
              €{price}
            </span>
            <span style={{ 
              color: '#64748b', 
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>
              /{billingCycle === 'yearly' ? 'Jahr' : 'Monat'}
            </span>
          </div>

          {billingCycle === 'yearly' && savings > 0 && (
            <div style={{
              background: '#dcfce7',
              color: '#166534',
              padding: '0.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginTop: '1rem'
            }}>
              💰 Sie sparen {savings}% mit jährlicher Zahlung!
            </div>
          )}
        </div>

        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e293b' }}>
            ℹ️ Was passiert als Nächstes:
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>14 Tage kostenlose Testphase</li>
            <li>Danach automatische Verlängerung</li>
            <li>Jederzeit kündbar</li>
            <li>Sofortiger Zugang zu allen Features</li>
          </ul>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem' 
        }}>
          <button
            onClick={onClose}
            disabled={upgrading}
            style={{
              flex: 1,
              padding: isMobile ? '1rem' : '0.75rem',
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: upgrading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '1rem' : '0.875rem'
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={() => onUpgrade(plan.plan_type, billingCycle)}
            disabled={upgrading}
            style={{
              flex: 2,
              padding: isMobile ? '1rem' : '0.75rem',
              background: upgrading ? 
                '#9ca3af' : 
                'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: upgrading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '1rem' : '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {upgrading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Upgrade läuft...
              </>
            ) : (
              '🚀 Jetzt upgraden'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}