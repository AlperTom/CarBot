'use client'

import { useState } from 'react'
import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Alle Kategorien', icon: '📚' },
    { id: 'integration', name: 'Integration', icon: '🔧' },
    { id: 'platforms', name: 'Plattformen', icon: '🌐' },
    { id: 'customization', name: 'Anpassung', icon: '🎨' },
    { id: 'api', name: 'API', icon: '⚙️' },
    { id: 'troubleshooting', name: 'Problemlösung', icon: '🔍' }
  ]

  const docs = [
    // Integration Guides
    {
      id: 'quick-start',
      title: 'Schnellstart-Anleitung',
      description: 'In 5 Minuten zu Ihrem ersten CarBot',
      category: 'integration',
      difficulty: 'Anfänger',
      time: '5 Min',
      icon: '🚀',
      href: '/docs/quick-start'
    },
    {
      id: 'html-integration',
      title: 'HTML/JavaScript Integration',
      description: 'Direkter Code-Einbau in Ihre Website',
      category: 'integration',
      difficulty: 'Anfänger',
      time: '10 Min',
      icon: '💻',
      href: '/docs/html-integration'
    },
    {
      id: 'gtm-integration',
      title: 'Google Tag Manager',
      description: 'Installation über Google Tag Manager',
      category: 'platforms',
      difficulty: 'Mittel',
      time: '15 Min',
      icon: '📊',
      href: '/docs/gtm-integration'
    },
    {
      id: 'shopify-integration',
      title: 'Shopify Integration',
      description: 'CarBot in Ihren Shopify-Shop einbauen',
      category: 'platforms',
      difficulty: 'Mittel',
      time: '20 Min',
      icon: '🛒',
      href: '/docs/shopify-integration'
    },
    {
      id: 'wordpress-integration',
      title: 'WordPress Integration',
      description: 'Plugin und manuelle Installation',
      category: 'platforms',
      difficulty: 'Anfänger',
      time: '10 Min',
      icon: '📝',
      href: '/docs/wordpress-integration'
    },
    {
      id: 'react-integration',
      title: 'React/Vue/Angular',
      description: 'Integration in moderne Web-Frameworks',
      category: 'platforms',
      difficulty: 'Fortgeschritten',
      time: '25 Min',
      icon: '⚛️',
      href: '/docs/framework-integration'
    },
    // Customization
    {
      id: 'widget-customization',
      title: 'Widget Anpassung',
      description: 'Farben, Position und Verhalten anpassen',
      category: 'customization',
      difficulty: 'Mittel',
      time: '15 Min',
      icon: '🎨',
      href: '/docs/widget-customization'
    },
    {
      id: 'chat-personalization',
      title: 'Chat Personalisierung',
      description: 'Begrüßungen und Antworten anpassen',
      category: 'customization',
      difficulty: 'Mittel',
      time: '20 Min',
      icon: '💬',
      href: '/docs/chat-personalization'
    },
    // API Documentation
    {
      id: 'api-reference',
      title: 'API Referenz',
      description: 'Vollständige API-Dokumentation',
      category: 'api',
      difficulty: 'Fortgeschritten',
      time: '30 Min',
      icon: '📖',
      href: '/docs/api-reference'
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      description: 'Ereignisse in Echtzeit empfangen',
      category: 'api',
      difficulty: 'Fortgeschritten',
      time: '25 Min',
      icon: '🔔',
      href: '/docs/webhooks'
    },
    // Troubleshooting
    {
      id: 'common-issues',
      title: 'Häufige Probleme',
      description: 'Lösungen für bekannte Probleme',
      category: 'troubleshooting',
      difficulty: 'Alle Level',
      time: '10 Min',
      icon: '🔧',
      href: '/docs/troubleshooting'
    },
    {
      id: 'gdpr-compliance',
      title: 'DSGVO Compliance',
      description: 'Datenschutz und rechtliche Aspekte',
      category: 'troubleshooting',
      difficulty: 'Mittel',
      time: '15 Min',
      icon: '🛡️',
      href: '/docs/gdpr-compliance'
    }
  ]

  const filteredDocs = selectedCategory === 'all' 
    ? docs 
    : docs.filter(doc => doc.category === selectedCategory)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Anfänger': return '#22c55e'
      case 'Mittel': return '#f59e0b'
      case 'Fortgeschritten': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <SharedLayout title="Dokumentation" showNavigation={true}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h1 style={{ 
            color: 'white', 
            margin: '0 0 1rem 0', 
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            CarBot Dokumentation
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            margin: 0,
            fontSize: '1.125rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Alles was Sie brauchen, um CarBot erfolgreich in Ihre Website zu integrieren und zu konfigurieren.
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <GlassCard style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>5 Min</div>
            <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Schnellste Integration</div>
          </GlassCard>
          
          <GlassCard style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>6+</div>
            <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Unterstützte Plattformen</div>
          </GlassCard>
          
          <GlassCard style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>DSGVO</div>
            <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Vollständig konform</div>
          </GlassCard>
          
          <GlassCard style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>100%</div>
            <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Mobile Optimiert</div>
          </GlassCard>
        </div>

        {/* Category Filter */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>
              Kategorien
            </h3>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  background: selectedCategory === category.id 
                    ? 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  if (selectedCategory !== category.id) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                  }
                }}
                onMouseLeave={e => {
                  if (selectedCategory !== category.id) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Documentation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {filteredDocs.map(doc => (
            <GlassCard key={doc.id} style={{ 
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
            >
              <Link href={doc.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    flexShrink: 0
                  }}>
                    {doc.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: 'white', 
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.125rem',
                      fontWeight: 'bold'
                    }}>
                      {doc.title}
                    </h3>
                    <p style={{ 
                      color: '#d1d5db', 
                      margin: '0 0 1rem 0',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}>
                      {doc.description}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        background: getDifficultyColor(doc.difficulty),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {doc.difficulty}
                      </span>
                      <span style={{
                        color: '#9ca3af',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        🕐 {doc.time}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </GlassCard>
          ))}
        </div>

        {/* Getting Started CTA */}
        <GlassCard style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h2 style={{ 
            color: 'white', 
            margin: '0 0 1rem 0',
            fontSize: '1.75rem',
            fontWeight: 'bold'
          }}>
            Bereit zu starten?
          </h2>
          <p style={{ 
            color: '#d1d5db', 
            margin: '0 0 2rem 0',
            fontSize: '1rem',
            maxWidth: '500px',
            margin: '0 auto 2rem auto'
          }}>
            Beginnen Sie mit unserem Schnellstart-Guide und haben Sie CarBot in wenigen Minuten auf Ihrer Website laufen.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <PrimaryButton href="/docs/quick-start">
              Schnellstart-Guide
            </PrimaryButton>
            <SecondaryButton href="/auth/register">
              Kostenloses Konto erstellen
            </SecondaryButton>
          </div>
        </GlassCard>

        {/* Support Section */}
        <div style={{ 
          marginTop: '3rem',
          textAlign: 'center',
          padding: '2rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Benötigen Sie Hilfe?</h3>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            Unser Support-Team steht Ihnen bei Fragen zur Verfügung.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <SecondaryButton href="mailto:support@carbot.chat">
              📧 E-Mail Support
            </SecondaryButton>
            <SecondaryButton href="/docs/troubleshooting">
              🔍 Problemlösung
            </SecondaryButton>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}