/**
 * useAuth Hook - Enhanced authentication with JWT support
 * Provides authentication state management for CarBot
 */

import { useState, useEffect, useContext, createContext } from 'react'

// Auth Context
const AuthContext = createContext({})

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [workshop, setWorkshop] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState(null)
  const [authMethod, setAuthMethod] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    checkAuthSession()
  }, [])

  // Auto-refresh tokens
  useEffect(() => {
    if (tokens?.refreshToken && authMethod === 'jwt') {
      const refreshInterval = setInterval(() => {
        refreshTokens()
      }, 20 * 60 * 1000) // Refresh every 20 minutes

      return () => clearInterval(refreshInterval)
    }
  }, [tokens, authMethod])

  const checkAuthSession = async () => {
    try {
      setLoading(true)
      
      // Try to get tokens from localStorage
      const storedTokens = localStorage.getItem('carbot_auth_tokens')
      const storedUser = localStorage.getItem('carbot_auth_user')
      
      if (storedTokens && storedUser) {
        const parsedTokens = JSON.parse(storedTokens)
        const parsedUser = JSON.parse(storedUser)
        
        // Verify session with backend
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${parsedTokens.accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.data.user)
            setWorkshop(data.data.workshop)
            setRole(data.data.role)
            setTokens(parsedTokens)
            setAuthMethod(data.data.authMethod)
            setLoading(false)
            return
          }
        }
        
        // Session invalid, clear stored data
        clearAuthData()
      }
      
    } catch (error) {
      console.error('Session check failed:', error)
      clearAuthData()
    }
    
    setLoading(false)
  }

  const signin = async (email, password, options = {}) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          useJWT: options.useJWT !== false // Default to true
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (data.success) {
        const { user, workshop, role, tokens, session, authMethod } = data.data
        
        setUser(user)
        setWorkshop(workshop)
        setRole(role)
        setAuthMethod(authMethod)
        
        if (tokens) {
          // JWT authentication
          setTokens(tokens)
          localStorage.setItem('carbot_auth_tokens', JSON.stringify(tokens))
          localStorage.setItem('carbot_auth_user', JSON.stringify({ user, workshop, role }))
        } else if (session) {
          // Supabase authentication
          setTokens({ accessToken: session.access_token, refreshToken: session.refresh_token })
          localStorage.setItem('carbot_auth_tokens', JSON.stringify({
            accessToken: session.access_token,
            refreshToken: session.refresh_token
          }))
          localStorage.setItem('carbot_auth_user', JSON.stringify({ user, workshop, role }))
        }

        return { success: true, data: { user, workshop, role } }
      }

      throw new Error(data.error || 'Authentication failed')

    } catch (error) {
      console.error('Signin error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signout = async (allDevices = false) => {
    try {
      setLoading(true)
      
      if (tokens?.accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: tokens.refreshToken,
            allDevices
          })
        })
      }
      
    } catch (error) {
      console.error('Signout error:', error)
    } finally {
      clearAuthData()
      setLoading(false)
    }
  }

  const refreshTokens = async () => {
    try {
      if (!tokens?.refreshToken) return false

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const newTokens = data.data.tokens
          setTokens(newTokens)
          localStorage.setItem('carbot_auth_tokens', JSON.stringify(newTokens))
          return true
        }
      }

      // Refresh failed, logout user
      await signout()
      return false

    } catch (error) {
      console.error('Token refresh failed:', error)
      await signout()
      return false
    }
  }

  const clearAuthData = () => {
    setUser(null)
    setWorkshop(null)
    setRole(null)
    setTokens(null)
    setAuthMethod(null)
    localStorage.removeItem('carbot_auth_tokens')
    localStorage.removeItem('carbot_auth_user')
  }

  const getAuthHeaders = () => {
    if (tokens?.accessToken) {
      return {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    }
    return {}
  }

  const hasPermission = (requiredRole) => {
    if (!role) return false
    
    const roleHierarchy = {
      'customer': 0,
      'employee': 1,
      'manager': 2,
      'owner': 3,
      'admin': 4
    }
    
    return roleHierarchy[role] >= roleHierarchy[requiredRole]
  }

  const isAuthenticated = !!user && !!tokens
  const isWorkshopOwner = role === 'owner'
  const isEmployee = ['employee', 'manager', 'owner'].includes(role)

  const value = {
    // State
    user,
    workshop,
    role,
    tokens,
    authMethod,
    loading,
    isAuthenticated,
    isWorkshopOwner,
    isEmployee,

    // Actions
    signin,
    signout,
    refreshTokens,
    getAuthHeaders,
    hasPermission,

    // Utils
    checkAuthSession,
    clearAuthData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth hook
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Higher-order component for protected routes
export function withAuth(Component, options = {}) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading, hasPermission } = useAuth()
    const { requiredRole, fallback: Fallback } = options

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (Fallback) {
        return <Fallback />
      }
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      return null
    }

    if (requiredRole && !hasPermission(requiredRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Zugriff verweigert
            </h1>
            <p className="text-gray-600">
              Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
            </p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// Authentication status hook for non-React usage
export function getAuthStatus() {
  if (typeof window === 'undefined') return null
  
  try {
    const storedTokens = localStorage.getItem('carbot_auth_tokens')
    const storedUser = localStorage.getItem('carbot_auth_user')
    
    if (storedTokens && storedUser) {
      return {
        tokens: JSON.parse(storedTokens),
        user: JSON.parse(storedUser),
        isAuthenticated: true
      }
    }
  } catch (error) {
    console.error('Failed to get auth status:', error)
  }
  
  return { isAuthenticated: false }
}