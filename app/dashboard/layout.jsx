'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import EnhancedDashboardNav from '../../components/EnhancedDashboardNav'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// JWT token verification (client-side)
function verifyJWTToken(token) {
  try {
    // Basic JWT decode without signature verification (client-side)
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(window.atob(base64))
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn('🔒 [Dashboard] JWT token expired')
      return null
    }
    
    return decoded
  } catch (error) {
    console.warn('🔒 [Dashboard] JWT token decode failed:', error.message)
    return null
  }
}

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [workshop, setWorkshop] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log('🔍 [Dashboard] Checking authentication...')
      
      // First try to get JWT token from localStorage
      const jwtToken = localStorage.getItem('carbot_access_token')
      
      if (jwtToken) {
        console.log('🔍 [Dashboard] JWT token found, verifying...')
        const decoded = verifyJWTToken(jwtToken)
        
        if (decoded) {
          console.log('✅ [Dashboard] JWT token valid, user authenticated via JWT')
          
          // Create user object from JWT token
          const jwtUser = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.email.split('@')[0], // Fallback name from email
            role: decoded.role || 'owner'
          }
          
          setUser(jwtUser)
          
          // Create workshop object from JWT token
          const jwtWorkshop = {
            id: decoded.workshop_id,
            name: decoded.workshop_name,
            owner_email: decoded.email,
            owner_name: decoded.email.split('@')[0] // Fallback name
          }
          
          setWorkshop(jwtWorkshop)
          console.log('✅ [Dashboard] User and workshop data loaded from JWT')
          setLoading(false)
          return
        } else {
          console.warn('⚠️ [Dashboard] JWT token invalid or expired')
          // Clear invalid tokens
          localStorage.removeItem('carbot_access_token')
          localStorage.removeItem('carbot_refresh_token')
        }
      }
      
      // Fallback to Supabase auth if no valid JWT token
      console.log('🔍 [Dashboard] Checking Supabase session as fallback...')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('❌ [Dashboard] No valid authentication found, redirecting to login')
        router.push('/auth/login')
        return
      }

      console.log('✅ [Dashboard] User authenticated via Supabase')
      setUser(user)

      // Get workshop data from database
      const { data: workshopData } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.email)
        .single()

      if (!workshopData) {
        console.log('⚠️ [Dashboard] No workshop found, redirecting to onboarding')
        router.push('/dashboard/onboarding')
        return
      }

      setWorkshop(workshopData)
      console.log('✅ [Dashboard] Workshop data loaded from database')
    } catch (error) {
      console.error('❌ [Dashboard] Auth check error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🚗</div>
          <div style={{ color: '#666' }}>Lade Dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <EnhancedDashboardNav user={user} workshop={workshop} onLogout={() => {
        console.log('🔒 [Dashboard] Logging out user...')
        // Clear JWT tokens
        localStorage.removeItem('carbot_access_token')
        localStorage.removeItem('carbot_refresh_token')
        // Also sign out from Supabase if there's a session
        supabase.auth.signOut()
        router.push('/auth/login')
      }} />
      
      <main style={{
        marginLeft: '0',
        padding: '20px',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {children}
        </div>
      </main>
    </div>
  )
}