'use client'
import { useState, useEffect } from 'react'

export default function LeadScoreDisplay({ lead, onScoreUpdate = null, compact = false }) {
  const [score, setScore] = useState(lead?.lead_score || 0)
  const [classification, setClassification] = useState(lead?.score_classification || 'Cold')
  const [priority, setPriority] = useState(lead?.priority || 'Medium')
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lead) {
      setScore(lead.lead_score || 0)
      setClassification(lead.score_classification || 'Cold')
      setPriority(lead.priority || 'Medium')
    }
  }, [lead])

  const handleRescore = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/leads/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'score',
          leadId: lead.id
        })
      })

      const data = await response.json()
      if (data.success) {
        setScore(data.score.total)
        setClassification(data.score.classification)
        setPriority(data.score.priority)
        onScoreUpdate?.(data.score)
      }
    } catch (error) {
      console.error('Error rescoring lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a' // Green
    if (score >= 60) return '#ea580c' // Orange
    if (score >= 40) return '#2563eb' // Blue
    return '#6b7280' // Gray
  }

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Hot': return '#dc2626' // Red
      case 'Warm': return '#ea580c' // Orange
      case 'Cold': return '#2563eb' // Blue
      default: return '#6b7280' // Gray
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc2626' // Red
      case 'Medium': return '#ea580c' // Orange
      case 'Low': return '#16a34a' // Green
      default: return '#6b7280' // Gray
    }
  }

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
      }}>
        <div style={{
          padding: '4px 8px',
          borderRadius: '12px',
          background: getScoreColor(score),
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          minWidth: '35px',
          textAlign: 'center'
        }}>
          {score}
        </div>
        <span style={{
          padding: '2px 6px',
          borderRadius: '4px',
          background: getClassificationColor(classification),
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          {classification}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      background: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#1a202c', fontSize: '18px' }}>
          Lead Score Analysis
        </h3>
        <button
          onClick={handleRescore}
          disabled={loading}
          style={{
            padding: '6px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            background: 'white',
            color: '#666',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Rescoring...' : '🔄 Rescore'}
        </button>
      </div>

      {/* Score Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <ScoreCard
          label="Total Score"
          value={score}
          color={getScoreColor(score)}
          suffix="/100"
        />
        <ScoreCard
          label="Classification"
          value={classification}
          color={getClassificationColor(classification)}
        />
        <ScoreCard
          label="Priority"
          value={priority}
          color={getPriorityColor(priority)}
        />
        <ScoreCard
          label="Est. Value"
          value={`€${lead?.estimated_value || 300}`}
          color="#7c3aed"
        />
      </div>

      {/* Score Breakdown */}
      {lead?.score_breakdown && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            margin: '0 0 15px 0', 
            color: '#374151', 
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Score Breakdown
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {Object.entries(lead.score_breakdown).map(([key, value]) => (
              <ScoreBreakdownItem
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                score={value}
                maxScore={100}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {lead?.recommendations && lead.recommendations.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            margin: '0 0 15px 0', 
            color: '#374151', 
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Recommendations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lead.recommendations.map((rec, index) => (
              <RecommendationItem
                key={index}
                recommendation={rec}
              />
            ))}
          </div>
        </div>
      )}

      {/* Follow-up Suggestions */}
      {lead?.followUpSuggestions && lead.followUpSuggestions.length > 0 && (
        <div>
          <h4 style={{ 
            margin: '0 0 15px 0', 
            color: '#374151', 
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Follow-up Suggestions
          </h4>
          <ul style={{ 
            margin: 0, 
            padding: '0 0 0 20px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            {lead.followUpSuggestions.map((suggestion, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Details Toggle */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: '#f8fafc',
            color: '#0070f3',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Detailed Analysis */}
      {showDetails && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <div><strong>Lead ID:</strong> {lead?.id}</div>
          <div><strong>Customer:</strong> {lead?.kunde_id}</div>
          <div><strong>Created:</strong> {new Date(lead?.created_at).toLocaleString()}</div>
          <div><strong>Last Scored:</strong> {lead?.last_scored_at ? new Date(lead.last_scored_at).toLocaleString() : 'Never'}</div>
          {lead?.scoring_notes && (
            <div><strong>Notes:</strong> {lead.scoring_notes}</div>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreCard({ label, value, color, suffix = '' }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '15px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      background: '#fafafa'
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: color,
        marginBottom: '5px'
      }}>
        {value}{suffix}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: 'medium'
      }}>
        {label}
      </div>
    </div>
  )
}

function ScoreBreakdownItem({ label, score, maxScore }) {
  const percentage = (score / maxScore) * 100
  
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: '12px'
      }}>
        <span style={{ color: '#374151' }}>{label}</span>
        <span style={{ fontWeight: 'bold', color: '#1a202c' }}>{score}/{maxScore}</span>
      </div>
      <div style={{
        width: '100%',
        height: '6px',
        background: '#e2e8f0',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: score >= 70 ? '#16a34a' : score >= 50 ? '#ea580c' : '#6b7280',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  )
}

function RecommendationItem({ recommendation }) {
  const priorityColors = {
    high: '#dc2626',
    medium: '#ea580c',
    low: '#16a34a'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      background: '#f8fafc',
      borderRadius: '4px',
      borderLeft: `3px solid ${priorityColors[recommendation.priority] || '#6b7280'}`
    }}>
      <div style={{
        padding: '2px 6px',
        borderRadius: '10px',
        background: priorityColors[recommendation.priority] || '#6b7280',
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}>
        {recommendation.priority}
      </div>
      <div style={{ fontSize: '13px', color: '#374151' }}>
        {recommendation.message}
      </div>
    </div>
  )
}