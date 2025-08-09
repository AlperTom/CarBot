'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TemplateGallery({ 
  onTemplateSelect, 
  selectedTemplate, 
  packageInfo,
  showPremiumTemplates = true,
  filterCategory = null,
  compact = false
}) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(filterCategory || 'all')

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      const { data: templatesData, error } = await supabase
        .from('landing_page_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error

      setTemplates(templatesData || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'Alle', icon: '🎨', count: templates.length },
    { id: 'traditional', name: 'Traditionell', icon: '🔧', count: templates.filter(t => t.category === 'traditional').length },
    { id: 'modern', name: 'Modern', icon: '⚡', count: templates.filter(t => t.category === 'modern').length },
    { id: 'premium', name: 'Premium', icon: '⭐', count: templates.filter(t => t.category === 'premium').length },
    { id: 'family', name: 'Familie', icon: '👨‍👩‍👧‍👦', count: templates.filter(t => t.category === 'family').length },
    { id: 'eco', name: 'Umwelt', icon: '🌱', count: templates.filter(t => t.category === 'eco').length }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const displayTemplates = showPremiumTemplates 
    ? filteredTemplates
    : filteredTemplates.filter(t => t.category !== 'premium')

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: compact ? '200px' : '400px',
        color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎨</div>
          <div>Lade Templates...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {!compact && (
        <>
          {/* Category Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem', 
              color: '#1a202c' 
            }}>
              Template-Kategorie wählen
            </h3>
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              flexWrap: 'wrap' 
            }}>
              {categories.map(category => {
                const isLocked = category.id === 'premium' && packageInfo?.id === 'basic'
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    disabled={isLocked}
                    style={{
                      padding: '0.75rem 1rem',
                      background: selectedCategory === category.id 
                        ? (isLocked ? '#f3f4f6' : '#3b82f6')
                        : 'white',
                      color: selectedCategory === category.id 
                        ? (isLocked ? '#9ca3af' : 'white')
                        : (isLocked ? '#9ca3af' : '#374151'),
                      border: `2px solid ${selectedCategory === category.id ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isLocked ? 0.6 : 1,
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                      <span style={{
                        background: selectedCategory === category.id 
                          ? 'rgba(255,255,255,0.2)' 
                          : '#f3f4f6',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem'
                      }}>
                        {category.count}
                      </span>
                      {isLocked && (
                        <span style={{ fontSize: '0.8rem' }}>🔒</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            {selectedCategory === 'premium' && packageInfo?.id === 'basic' && (
              <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: '#92400e', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  🔒 Premium Templates sind nur in Professional und Enterprise Paketen verfügbar.
                </p>
              </div>
            )}
          </div>

          {/* Template Stats */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '2rem', color: '#0284c7', marginBottom: '0.5rem' }}>
                  {displayTemplates.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '500' }}>
                  Verfügbare Templates
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', color: '#0284c7', marginBottom: '0.5rem' }}>
                  {displayTemplates.filter(t => t.seo_optimized).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '500' }}>
                  SEO-Optimiert
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', color: '#0284c7', marginBottom: '0.5rem' }}>
                  {displayTemplates.filter(t => t.mobile_optimized).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '500' }}>
                  Mobile-Ready
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', color: '#0284c7', marginBottom: '0.5rem' }}>
                  {Math.round(displayTemplates.reduce((acc, t) => acc + t.performance_score, 0) / displayTemplates.length) || 0}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '500' }}>
                  ⌀ Performance Score
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Templates Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: compact 
          ? 'repeat(auto-fit, minmax(250px, 1fr))'
          : 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: compact ? '1rem' : '2rem',
        marginBottom: '2rem'
      }}>
        {displayTemplates.map(template => {
          const isSelected = selectedTemplate?.id === template.id
          const isLocked = template.category === 'premium' && packageInfo?.id === 'basic'
          const canSelect = !isLocked && onTemplateSelect

          return (
            <div
              key={template.id}
              onClick={() => canSelect ? onTemplateSelect(template) : null}
              style={{
                background: 'white',
                borderRadius: compact ? '12px' : '16px',
                border: isSelected 
                  ? '3px solid #3b82f6'
                  : isLocked 
                    ? '2px solid #fbbf24'
                    : '1px solid #e5e7eb',
                boxShadow: isSelected
                  ? '0 8px 25px rgba(59, 130, 246, 0.25)'
                  : isLocked
                    ? '0 4px 12px rgba(251, 191, 36, 0.25)'
                    : '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                cursor: canSelect ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                opacity: isLocked ? 0.8 : 1,
                position: 'relative'
              }}
            >
              {/* Template Preview */}
              <div style={{
                height: compact ? '150px' : '200px',
                background: template.preview_image_url 
                  ? `url(${template.preview_image_url}) center/cover`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Lock Overlay */}
                {isLocked && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem'
                  }}>
                    🔒
                  </div>
                )}

                {/* Premium Badge */}
                {template.category === 'premium' && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: isLocked ? '#fbbf24' : '#8b5cf6',
                    color: isLocked ? '#92400e' : 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    ⭐ Premium
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: '#10b981',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ✅ Ausgewählt
                  </div>
                )}

                {/* Color Scheme Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {template.color_scheme?.replace('-', ' & ').toUpperCase() || 'STANDARD'}
                </div>
              </div>

              {/* Template Info */}
              <div style={{ padding: compact ? '1rem' : '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: compact ? '1.1rem' : '1.25rem',
                    fontWeight: 'bold',
                    color: isLocked ? '#9ca3af' : '#1f2937'
                  }}>
                    {template.name}
                    {template.is_featured && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '1rem'
                      }}>🌟</span>
                    )}
                  </h3>
                  <p style={{
                    margin: '0 0 0.5rem 0',
                    color: isLocked ? '#9ca3af' : '#6b7280',
                    fontSize: compact ? '0.8rem' : '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {template.description}
                  </p>
                  {!compact && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#9ca3af',
                      fontStyle: 'italic'
                    }}>
                      Zielgruppe: {template.target_audience}
                    </div>
                  )}
                </div>

                {/* Template Features */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  marginBottom: compact ? '1rem' : '1.5rem',
                  fontSize: '0.8rem',
                  color: '#374151'
                }}>
                  {template.seo_optimized && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>✅</span>
                      <span>SEO optimiert</span>
                    </div>
                  )}
                  {template.mobile_optimized && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📱</span>
                      <span>Mobile ready</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚡</span>
                    <span>Score: {template.performance_score}/100</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎨</span>
                    <span>{template.category}</span>
                  </div>
                </div>

                {/* Action Button */}
                {onTemplateSelect && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (canSelect) onTemplateSelect(template)
                    }}
                    disabled={isLocked}
                    style={{
                      width: '100%',
                      padding: compact ? '0.75rem' : '1rem',
                      background: isSelected
                        ? '#10b981'
                        : isLocked
                          ? '#f3f4f6'
                          : '#3b82f6',
                      color: isSelected
                        ? 'white'
                        : isLocked
                          ? '#9ca3af'
                          : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: compact ? '0.9rem' : '1rem',
                      fontWeight: 'bold',
                      cursor: canSelect ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected
                      ? '✅ Ausgewählt'
                      : isLocked
                        ? '🔒 Premium erforderlich'
                        : `${template.name} auswählen`
                    }
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {displayTemplates.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>
            Keine Templates in dieser Kategorie
          </h3>
          <p style={{ margin: 0 }}>
            Probieren Sie eine andere Kategorie oder kontaktieren Sie den Support.
          </p>
        </div>
      )}
    </div>
  )
}