'use client'

/**
 * Landing Page Templates Interface
 * CarBot MVP - Professional Template Gallery and Management
 * Implements US-004, US-005, US-006 from specifications
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [publishedTemplates, setPublishedTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPackage, setCurrentPackage] = useState(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  
  const router = useRouter()

  // Load templates and package data
  const loadData = useCallback(async () => {
    if (refreshing) return
    setRefreshing(true)
    setError(null)

    try {
      // Get current package information
      const packageResponse = await fetch('/api/packages?action=current')
      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        setCurrentPackage(packageData.package)
      }

      // Get available templates
      const templatesResponse = await fetch('/api/landing-pages?action=list')
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData.templates || [])
      }

      // Get published templates
      const publishedResponse = await fetch('/api/landing-pages?action=published')
      if (publishedResponse.ok) {
        const publishedData = await publishedResponse.json()
        setPublishedTemplates(publishedData.templates || [])
      }

    } catch (error) {
      console.error('Error loading templates:', error)
      setError('Fehler beim Laden der Templates')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [refreshing])

  useEffect(() => {
    loadData()
  }, [])

  // Check if user can use templates
  const canUseTemplates = currentPackage?.feature_access?.landingPages || false
  const templateLimitReached = currentPackage && currentPackage.limits?.landingPages !== -1 && 
    publishedTemplates.length >= currentPackage.limits.landingPages

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Header with Package Info */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landing Page Templates</h1>
            <p className="text-gray-600 mt-2">
              Professionelle Templates für Ihre Autowerkstatt-Website
            </p>
          </div>
          
          {/* Package Status Card */}
          {currentPackage && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-900">Template-Zugang</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                  {currentPackage.name}
                </span>
              </div>
              
              {canUseTemplates ? (
                <div>
                  <p className="text-sm text-purple-700 mb-3">
                    ✅ Templates verfügbar
                  </p>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-700">Veröffentlichte Templates</span>
                        <span className="text-purple-800 font-medium">
                          {publishedTemplates.length}{currentPackage.limits?.landingPages !== -1 ? `/${currentPackage.limits.landingPages}` : ''}
                        </span>
                      </div>
                      {currentPackage.limits?.landingPages !== -1 && (
                        <div className="w-full bg-purple-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-purple-600 h-1.5 rounded-full transition-all" 
                            style={{ width: `${Math.min((publishedTemplates.length / currentPackage.limits.landingPages) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-purple-700 mb-2">❌ Templates nicht verfügbar</p>
                  <button 
                    onClick={() => router.push('/dashboard/billing')}
                    className="w-full bg-purple-600 text-white text-xs py-2 px-3 rounded hover:bg-purple-700 transition"
                  >
                    Auf Professional upgraden
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">×</button>
          </div>
        )}
      </div>

      {/* Feature Gate for Templates */}
      {!canUseTemplates && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-8 mb-8 text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h2 className="text-2xl font-bold text-orange-900 mb-2">Landing Page Templates</h2>
          <p className="text-orange-800 mb-6 max-w-2xl mx-auto">
            Erstellen Sie professionelle Landing Pages für Ihre Autowerkstatt mit unseren 
            vorgefertigten Templates. Verfügbar ab dem Professional-Paket.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold text-orange-900">5 Professional Templates</h3>
              <p className="text-sm text-orange-700">Für verschiedene Werkstatt-Typen optimiert</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-orange-900">Live-Editor</h3>
              <p className="text-sm text-orange-700">Echtzeit-Anpassung mit Vorschau</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-semibold text-orange-900">Ein-Klick Publishing</h3>
              <p className="text-sm text-orange-700">Sofort live auf Ihrer Domain</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/billing')}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105"
          >
            Jetzt auf Professional upgraden - ab €79/Monat
          </button>
        </div>
      )}

      {/* Template Gallery */}
      {canUseTemplates && (
        <>
          {/* Published Templates Section */}
          {publishedTemplates.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Ihre veröffentlichten Templates</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Aktive Landing Pages ({publishedTemplates.length} von {currentPackage?.limits?.landingPages !== -1 ? currentPackage.limits.landingPages : '∞'})
                  </p>
                </div>
                
                <button
                  onClick={() => loadData()}
                  disabled={refreshing}
                  className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                >
                  <span className={`inline-block ${refreshing ? 'animate-spin' : ''}`}>⟳</span>
                  {refreshing ? 'Lädt...' : 'Aktualisieren'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {publishedTemplates.map((template) => (
                  <PublishedTemplateCard 
                    key={template.id} 
                    template={template}
                    onEdit={(id) => router.push(`/dashboard/templates/${id}`)}
                    onUnpublish={() => {/* Handle unpublish */}}
                    onViewStats={() => {/* Handle view stats */}}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Templates Gallery */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Verfügbare Templates</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Professionelle Automotive Templates für Ihre Werkstatt
                </p>
              </div>

              {templateLimitReached && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm">
                  Template-Limit erreicht. <button className="underline hover:no-underline">Upgraden für mehr</button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATE_GALLERY.map((template) => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  currentPackage={currentPackage}
                  canCreate={!templateLimitReached}
                  onSelect={(templateId) => router.push(`/dashboard/templates/${templateId}`)}
                  onPreview={(templateId) => {/* Handle preview */}}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Template Gallery Data
const TEMPLATE_GALLERY = [
  {
    id: 'classic-workshop',
    name: 'Klassische Werkstatt',
    description: 'Zeitloses Design für traditionelle Autowerkstätten',
    preview_image: '/templates/classic-workshop-preview.jpg',
    category: 'traditional',
    features: ['Kontaktformular', 'Serviceliste', 'Öffnungszeiten', 'Standort-Karte'],
    demo_url: 'https://demo.carbot.chat/classic-workshop',
    package_required: 'professional'
  },
  {
    id: 'modern-auto',
    name: 'Moderne Autowerkstatt',
    description: 'Frisches, modernes Design für zeitgemäße Werkstätten',
    preview_image: '/templates/modern-auto-preview.jpg',
    category: 'modern',
    features: ['Hero-Video', 'Online-Termine', 'Live-Chat', 'Bewertungen'],
    demo_url: 'https://demo.carbot.chat/modern-auto',
    package_required: 'professional'
  },
  {
    id: 'premium-service',
    name: 'Premium Service',
    description: 'Luxuriöse Optik für Premium-Werkstätten und Servicezentren',
    preview_image: '/templates/premium-service-preview.jpg',
    category: 'premium',
    features: ['Animationen', 'Premium-Support', 'VIP-Bereich', 'Concierge-Service'],
    demo_url: 'https://demo.carbot.chat/premium-service',
    package_required: 'professional'
  },
  {
    id: 'family-business',
    name: 'Familienbetrieb',
    description: 'Warmes Design für Familienwerkstätten mit persönlicher Note',
    preview_image: '/templates/family-business-preview.jpg',
    category: 'family',
    features: ['Geschichte', 'Team-Vorstellung', 'Kundenstimmen', 'Tradition'],
    demo_url: 'https://demo.carbot.chat/family-business',
    package_required: 'professional'
  },
  {
    id: 'eco-specialist',
    name: 'Öko-Spezialist',
    description: 'Nachhaltiges Design für umweltbewusste Werkstätten',
    preview_image: '/templates/eco-specialist-preview.jpg',
    category: 'eco',
    features: ['Nachhaltigkeit', 'E-Auto Service', 'Umwelt-Tipps', 'Grüne Technologien'],
    demo_url: 'https://demo.carbot.chat/eco-specialist',
    package_required: 'professional'
  }
]

// Template Card Component
function TemplateCard({ template, currentPackage, canCreate, onSelect, onPreview }) {
  const canUseTemplate = currentPackage?.id === 'enterprise' || 
    (currentPackage?.id === 'professional' && template.package_required === 'professional')

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Template Preview */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <img 
          src={template.preview_image} 
          alt={template.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        
        {/* Fallback if image fails to load */}
        <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-blue-50 to-indigo-100" style={{display: 'none'}}>
          🏗️
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 space-x-3">
            <button
              onClick={() => onPreview(template.id)}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              👁️ Vorschau
            </button>
            {canUseTemplate && canCreate && (
              <button
                onClick={() => onSelect(template.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                🎨 Anpassen
              </button>
            )}
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {getCategoryName(template.category)}
          </span>
        </div>
        
        {/* Package Badge */}
        {template.package_required === 'enterprise' && (
          <div className="absolute top-3 right-3">
            <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Enterprise
            </span>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{template.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
        </div>

        {/* Features */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Funktionen</h4>
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {feature}
              </span>
            ))}
            {template.features.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{template.features.length - 3} weitere
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {canUseTemplate && canCreate ? (
            <button
              onClick={() => onSelect(template.id)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              🎨 Template anpassen
            </button>
          ) : !canUseTemplate ? (
            <div className="text-center">
              <button
                disabled
                className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
              >
                🔒 Upgrade erforderlich
              </button>
              <p className="text-xs text-gray-500 mt-1">
                {template.package_required === 'enterprise' ? 'Enterprise-Paket' : 'Professional-Paket'} benötigt
              </p>
            </div>
          ) : (
            <div className="text-center">
              <button
                disabled
                className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
              >
                📊 Template-Limit erreicht
              </button>
              <p className="text-xs text-gray-500 mt-1">Upgraden für mehr Templates</p>
            </div>
          )}
          
          <a
            href={template.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            🔗 Live-Demo ansehen
          </a>
        </div>
      </div>
    </div>
  )
}

// Published Template Card Component
function PublishedTemplateCard({ template, onEdit, onUnpublish, onViewStats }) {
  return (
    <div className="bg-white rounded-xl border border-green-200 overflow-hidden shadow-sm">
      {/* Template Preview */}
      <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 relative">
        <img 
          src={template.preview_url} 
          alt={template.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-green-50 to-blue-100" style={{display: 'none'}}>
          🌐
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            ✅ Live
          </span>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
          <p className="text-sm text-gray-600">{template.url}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{template.views || 0}</div>
            <div className="text-xs text-gray-500">Aufrufe</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{template.conversions || 0}</div>
            <div className="text-xs text-gray-500">Leads</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(template.id)}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            ✏️ Bearbeiten
          </button>
          <button
            onClick={() => onViewStats(template.id)}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-50 transition"
          >
            📊 Stats
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to get category display name
function getCategoryName(category) {
  const names = {
    traditional: 'Klassisch',
    modern: 'Modern',
    premium: 'Premium',
    family: 'Familie',
    eco: 'Öko'
  }
  return names[category] || category
}