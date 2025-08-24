'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function LandingPagesPage() {
  const [workshop, setWorkshop] = useState(null)
  const [landingPages, setLandingPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadWorkshopAndPages()
  }, [])

  async function loadWorkshopAndPages() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get workshop data
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.email)
        .single()

      if (workshopError) throw workshopError
      setWorkshop(workshopData)

      // Get landing pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('workshop_id', workshopData.id)
        .order('created_at', { ascending: false })

      if (pagesError && pagesError.code !== 'PGRST116') throw pagesError
      setLandingPages(pagesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const templates = [
    {
      id: 'modern-auto',
      name: 'Modern Autowerkstatt',
      description: 'Professionelles Design für moderne Werkstätten',
      preview: '🚗 Modern, sauber, vertrauenswürdig',
      features: ['Serviceübersicht', 'Terminbuchung', 'Kundenbewertungen', 'Kontaktformular']
    },
    {
      id: 'classic-garage',
      name: 'Klassische Garage',
      description: 'Traditionelles Design für etablierte Betriebe',
      preview: '🔧 Klassisch, bewährt, seriös',
      features: ['Über uns', 'Leistungen', 'Galerie', 'Anfahrt']
    },
    {
      id: 'premium-service',
      name: 'Premium Service',
      description: 'Luxuriöses Design für Premium-Werkstätten',
      preview: '⭐ Elegant, hochwertig, exklusiv',
      features: ['Premium Services', 'VIP Bereich', 'Marken-Spezialisierung', 'Online-Beratung']
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Landing Pages 🚀</h1>
            <p className="text-gray-600">
              Erstellen Sie professionelle Landing Pages für Ihre Werkstatt - perfekt für Werkstätten ohne eigene Website
            </p>
          </div>
        </div>

        {/* Current Landing Pages */}
        {landingPages.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">Ihre Landing Pages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {landingPages.map((page) => (
                  <div key={page.id} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        page.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.is_published ? '✅ Live' : '📝 Entwurf'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6">{page.description}</p>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/workshop/${workshop.slug}/${page.slug}`}
                        target="_blank"
                        className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        👁️ Vorschau
                      </Link>
                      <Link
                        href={`/dashboard/landing-pages/${page.id}/edit`}
                        className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        ✏️ Bearbeiten
                      </Link>
                    </div>
                    
                    {page.is_published && (
                      <div className="mt-4 p-3 bg-white rounded-lg border">
                        <p className="text-xs font-medium text-gray-700 mb-1">Live URL:</p>
                        <code className="text-xs text-blue-600 break-all">
                          {typeof window !== 'undefined' ? window.location.origin : ''}/workshop/{workshop.slug}/{page.slug}
                        </code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Landing Page Vorlagen 📋</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-200">
                  <div className="text-5xl mb-6 text-center">{template.preview}</div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900 text-center">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 text-center">{template.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3 text-gray-800">📋 Enthaltene Bereiche:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {template.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => createFromTemplate(template.id)}
                    className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🚀 Diese Vorlage verwenden
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-6 text-center text-xl">🎯 Warum Landing Pages?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-blue-800 text-sm">
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h4 className="font-bold mb-4 text-blue-900 text-base">🌐 Für Werkstätten ohne Website:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Professioneller Online-Auftritt in wenigen Minuten
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Keine technischen Kenntnisse erforderlich
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Automatische CarBot Integration
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Mobile-optimiert und SEO-freundlich
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h4 className="font-bold mb-4 text-blue-900 text-base">📈 Für Marketing-Kampagnen:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Spezielle Aktionen und Angebote bewerben
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Zielgruppen-spezifische Inhalte
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  A/B Testing verschiedener Designs
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Conversion-Tracking und Analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  async function createFromTemplate(templateId) {
    if (!workshop) return
    
    try {
      const template = templates.find(t => t.id === templateId)
      const slug = `${templateId}-${Date.now()}`
      
      const newPage = {
        workshop_id: workshop.id,
        title: `${workshop.name} - ${template.name}`,
        slug: slug,
        template_id: templateId,
        description: `${template.name} Landing Page für ${workshop.name}`,
        is_published: false,
        content: generateTemplateContent(templateId, workshop),
        seo_title: `${workshop.name} - Ihre Autowerkstatt`,
        seo_description: `${workshop.name} - Professionelle Autoreparatur und Service. ${workshop.services?.join(', ') || 'Alle Marken'}.`,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('landing_pages')
        .insert([newPage])
        .select()
        .single()

      if (error) throw error

      setLandingPages([data, ...landingPages])
      
      // Redirect to editor
      window.location.href = `/dashboard/landing-pages/${data.id}/edit`
    } catch (error) {
      console.error('Error creating landing page:', error)
      alert('Fehler beim Erstellen der Landing Page')
    }
  }
}

function generateTemplateContent(templateId, workshop) {
  const baseContent = {
    hero: {
      title: workshop.name,
      subtitle: `Ihre zuverlässige Autowerkstatt in ${workshop.city || 'Ihrer Nähe'}`,
      cta: 'Termin vereinbaren'
    },
    services: workshop.services || ['Reparatur', 'Wartung', 'Inspektion', 'TÜV'],
    specializations: workshop.specializations || ['Alle Marken'],
    contact: {
      phone: workshop.phone,
      email: workshop.email,
      address: workshop.address,
      hours: workshop.opening_hours
    }
  }

  return JSON.stringify(baseContent)
}