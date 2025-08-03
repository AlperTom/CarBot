'use client'

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)

// Auth Error Messages in German
export const AUTH_ERRORS = {
  'Invalid login credentials': 'Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.',
  'Email not confirmed': 'E-Mail noch nicht bestätigt. Bitte überprüfen Sie Ihr E-Mail-Postfach.',
  'Too many requests': 'Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.',
  'User not found': 'Benutzer nicht gefunden.',
  'Password too short': 'Passwort muss mindestens 6 Zeichen lang sein.',
  'Email already registered': 'Diese E-Mail-Adresse ist bereits registriert.',
  'Network error': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
  'Signup disabled': 'Registrierung ist derzeit deaktiviert.',
  'Email rate limit exceeded': 'E-Mail-Limit erreicht. Bitte warten Sie vor einem erneuten Versuch.',
  'Invalid email': 'Ungültige E-Mail-Adresse.',
  'Weak password': 'Passwort ist zu schwach. Verwenden Sie mindestens 8 Zeichen mit Zahlen und Sonderzeichen.',
  'Account not found': 'Konto nicht gefunden.',
  'Account disabled': 'Konto ist deaktiviert. Bitte kontaktieren Sie den Support.',
  'Session expired': 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.',
  'Unauthorized': 'Nicht autorisiert. Bitte melden Sie sich an.',
  'Access denied': 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.',
  'Token invalid': 'Token ist ungültig oder abgelaufen.',
  'Account locked': 'Konto ist gesperrt. Zu viele fehlgeschlagene Anmeldeversuche.',
  'Password reset required': 'Passwort muss zurückgesetzt werden.',
  'Two factor required': 'Zwei-Faktor-Authentifizierung erforderlich.'
}

// Translate Supabase errors to German
export const translateAuthError = (error) => {
  if (!error) return ''
  
  const message = error.message || error
  return AUTH_ERRORS[message] || message
}

// User roles
export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer'
}

// Session management
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export const getUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// Workshop management
export const getWorkshopByOwner = async (email) => {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('owner_email', email)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting workshop:', error)
    return null
  }
}

export const getWorkshopByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('workshop_users')
      .select(`
        *,
        workshop:workshops(*)
      `)
      .eq('user_id', userId)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting workshop by user:', error)
    return null
  }
}

// Authentication functions
export const signUp = async (email, password, workshopData) => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`
      }
    })

    if (authError) throw authError

    // If user creation successful, create workshop
    if (authData.user && !authData.user.email_confirmed_at) {
      // User needs to confirm email first
      return { 
        success: true, 
        data: authData, 
        requiresConfirmation: true 
      }
    }

    if (authData.user) {
      // Create workshop record
      const { data: workshop, error: workshopError } = await supabase
        .from('workshops')
        .insert({
          owner_id: authData.user.id,
          owner_email: email,
          name: workshopData.name,
          phone: workshopData.phone,
          address: workshopData.address,
          city: workshopData.city,
          postal_code: workshopData.postalCode,
          business_type: workshopData.businessType,
          subscription_plan: workshopData.plan || 'basic'
        })
        .select()
        .single()

      if (workshopError) throw workshopError

      return { 
        success: true, 
        data: { user: authData.user, workshop }, 
        requiresConfirmation: false 
      }
    }

    throw new Error('Unexpected error during registration')
  } catch (error) {
    console.error('Registration error:', error)
    return { 
      success: false, 
      error: translateAuthError(error.message) 
    }
  }
}

export const signIn = async (email, password) => {
  try {
    // Sanitize inputs
    email = sanitizeInput(email)
    password = sanitizeInput(password)

    // Rate limiting check
    const rateLimitKey = `login:${email}`
    const rateCheck = rateLimit.checkLimit(rateLimitKey, 5, 15 * 60 * 1000)
    
    if (!rateCheck.allowed) {
      throw new Error(`Zu viele Anmeldeversuche. Versuchen Sie es in ${rateCheck.retryAfter} Sekunden erneut.`)
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Log failed attempt
      await logSecurityEvent('failed_login_attempt', { 
        email, 
        error: error.message,
        remainingAttempts: rateCheck.remainingAttempts - 1
      })
      throw error
    }

    // Reset rate limit on successful login
    rateLimit.reset(rateLimitKey)

    // Get workshop information
    const workshop = await getWorkshopByOwner(email)
    let role = USER_ROLES.OWNER
    let workshopData = workshop
    
    if (!workshop) {
      // Check if user is an employee
      const employeeData = await getWorkshopByUserId(data.user.id)
      
      if (!employeeData) {
        await logSecurityEvent('login_no_workshop', { email, userId: data.user.id })
        throw new Error('Kein Workshop für diese E-Mail gefunden. Bitte registrieren Sie sich zuerst.')
      }
      
      workshopData = employeeData.workshop
      role = employeeData.role || USER_ROLES.EMPLOYEE
    }

    // Create secure session
    const sessionData = await createSession(data.user, workshopData, role)
    
    // Check for suspicious activity
    const suspiciousActivity = detectSuspiciousActivity(sessionData)
    if (suspiciousActivity.suspicious) {
      await logSecurityEvent('suspicious_login_detected', {
        userId: data.user.id,
        workshopId: workshopData?.id,
        flags: suspiciousActivity.flags,
        riskScore: suspiciousActivity.riskScore
      })
    }

    // Log successful login
    await logSecurityEvent('successful_login', {
      userId: data.user.id,
      workshopId: workshopData?.id,
      role,
      deviceFingerprint: sessionData.deviceFingerprint
    })

    return { 
      success: true, 
      data: { 
        user: data.user, 
        workshop: workshopData,
        role,
        session: sessionData
      } 
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return { 
      success: false, 
      error: translateAuthError(error.message) 
    }
  }
}

export const signOut = async () => {
  try {
    // Log signout event before clearing session
    const session = await getSession()
    const workshopData = getStoredWorkshopData()
    
    if (session?.user) {
      await logSecurityEvent('user_logout', {
        userId: session.user.id,
        workshopId: workshopData?.workshop?.id
      })
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Clear all stored data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('workshop')
      localStorage.removeItem('userRole')
      localStorage.removeItem('session_data')
      
      // Clear any rate limit data for this user
      const userEmail = session?.user?.email
      if (userEmail) {
        rateLimit.reset(`login:${userEmail}`)
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { 
      success: false, 
      error: translateAuthError(error.message) 
    }
  }
}

export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return { 
      success: false, 
      error: translateAuthError(error.message) 
    }
  }
}

export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Password update error:', error)
    return { 
      success: false, 
      error: translateAuthError(error.message) 
    }
  }
}

// Role and permission checking
export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    [USER_ROLES.CUSTOMER]: 0,
    [USER_ROLES.EMPLOYEE]: 1,
    [USER_ROLES.ADMIN]: 2,
    [USER_ROLES.OWNER]: 3
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const requireAuth = async () => {
  const session = await getSession()
  if (!session) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    return null
  }
  return session
}

// Workshop utilities
export const storeWorkshopData = (workshop, role = USER_ROLES.OWNER) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('workshop', JSON.stringify(workshop))
    localStorage.setItem('userRole', role)
  }
}

export const getStoredWorkshopData = () => {
  if (typeof window !== 'undefined') {
    const workshop = localStorage.getItem('workshop')
    const role = localStorage.getItem('userRole')
    return {
      workshop: workshop ? JSON.parse(workshop) : null,
      role: role || USER_ROLES.CUSTOMER
    }
  }
  return { workshop: null, role: USER_ROLES.CUSTOMER }
}

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  const validation = {
    isValid: false,
    hasLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    score: 0,
    feedback: []
  }

  // Calculate password strength score
  if (validation.hasLength) validation.score += 1
  if (validation.hasUpperCase) validation.score += 1
  if (validation.hasLowerCase) validation.score += 1
  if (validation.hasNumbers) validation.score += 1
  if (validation.hasSpecialChar) validation.score += 1
  if (password.length >= 12) validation.score += 1

  // Check for common weak patterns
  const weakPatterns = [
    /123456/, /password/, /qwerty/, /admin/, /login/,
    /welcome/, /master/, /root/, /user/, /guest/
  ]
  const hasWeakPattern = weakPatterns.some(pattern => pattern.test(password.toLowerCase()))
  if (hasWeakPattern) validation.score -= 2

  validation.isValid = validation.score >= 4 && validation.hasLength

  // Generate feedback
  if (!validation.hasLength) validation.feedback.push('Mindestens 8 Zeichen')
  if (!validation.hasUpperCase) validation.feedback.push('Großbuchstaben')
  if (!validation.hasLowerCase) validation.feedback.push('Kleinbuchstaben')
  if (!validation.hasNumbers) validation.feedback.push('Zahlen')
  if (!validation.hasSpecialChar) validation.feedback.push('Sonderzeichen')
  if (hasWeakPattern) validation.feedback.push('Vermeiden Sie häufige Wörter')

  return validation
}

export const validatePhoneNumber = (phone) => {
  // German phone number validation
  const phoneRegex = /^(\+49|0)[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validatePostalCode = (postalCode) => {
  // German postal code validation
  const postalRegex = /^\d{5}$/
  return postalRegex.test(postalCode)
}

// Auth state listener
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Security utilities
export const generateSecureToken = () => {
  if (typeof window !== 'undefined') {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  return null
}

export const getDeviceFingerprint = () => {
  if (typeof window === 'undefined') return null
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('Device fingerprint', 2, 2)
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasFingerprint: canvas.toDataURL(),
    timestamp: Date.now()
  }
}

export const detectSuspiciousActivity = (currentSession, previousSessions = []) => {
  if (!currentSession || previousSessions.length === 0) return { suspicious: false }
  
  const flags = []
  const currentDevice = currentSession.deviceFingerprint
  const lastSession = previousSessions[0]
  
  // Check for rapid location changes
  if (lastSession && lastSession.ipAddress !== currentSession.ipAddress) {
    const timeDiff = (currentSession.timestamp - lastSession.timestamp) / 1000 / 60 // minutes
    if (timeDiff < 60) { // Less than 1 hour
      flags.push('rapid_location_change')
    }
  }
  
  // Check for device changes
  if (lastSession && lastSession.deviceFingerprint) {
    const deviceChanged = currentDevice?.userAgent !== lastSession.deviceFingerprint.userAgent ||
                         currentDevice?.platform !== lastSession.deviceFingerprint.platform
    if (deviceChanged) {
      flags.push('device_change')
    }
  }
  
  // Check for unusual access times
  const hour = new Date(currentSession.timestamp).getHours()
  if (hour < 6 || hour > 22) {
    flags.push('unusual_time')
  }
  
  return {
    suspicious: flags.length > 0,
    flags,
    riskScore: flags.length * 0.3 // 0-1 scale
  }
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export const rateLimit = {
  attempts: new Map(),
  
  checkLimit: (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const now = Date.now()
    const attempts = rateLimit.attempts.get(key) || []
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs)
    
    if (recentAttempts.length >= maxAttempts) {
      return {
        allowed: false,
        retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
      }
    }
    
    // Add current attempt
    recentAttempts.push(now)
    rateLimit.attempts.set(key, recentAttempts)
    
    return {
      allowed: true,
      remainingAttempts: maxAttempts - recentAttempts.length
    }
  },
  
  reset: (key) => {
    rateLimit.attempts.delete(key)
  }
}

// Enhanced session management
export const createSession = async (user, workshop, role) => {
  const sessionData = {
    userId: user.id,
    workshopId: workshop?.id,
    role,
    deviceFingerprint: getDeviceFingerprint(),
    ipAddress: await getClientIP(),
    timestamp: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }

  // Store in secure storage
  if (typeof window !== 'undefined') {
    localStorage.setItem('session_data', JSON.stringify(sessionData))
  }

  return sessionData
}

export const validateSession = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionData = localStorage.getItem('session_data')
    if (!sessionData) return null
    
    const session = JSON.parse(sessionData)
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('session_data')
      return null
    }
    
    // Validate with Supabase
    const { data: { session: supabaseSession }, error } = await supabase.auth.getSession()
    if (error || !supabaseSession) {
      localStorage.removeItem('session_data')
      return null
    }
    
    return session
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Error getting client IP:', error)
    return 'unknown'
  }
}

// Audit logging
export const logSecurityEvent = async (event, details = {}) => {
  try {
    const session = await getSession()
    const workshop = getStoredWorkshopData()
    
    await supabase.rpc('create_audit_log', {
      p_user_id: session?.user?.id || null,
      p_workshop_id: workshop?.workshop?.id || null,
      p_action: event,
      p_resource_type: 'security',
      p_details: {
        ...details,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : null
      }
    })
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

// Error handling
export const handleAuthError = (error) => {
  const translatedError = translateAuthError(error)
  
  // Log to console for debugging
  console.error('Auth Error:', error)
  
  // Log security event for suspicious activities
  if (error && typeof error === 'string') {
    if (error.includes('Too many requests') || error.includes('rate limit')) {
      logSecurityEvent('rate_limit_exceeded', { error })
    } else if (error.includes('Invalid login credentials')) {
      logSecurityEvent('failed_login_attempt', { error })
    }
  }
  
  return translatedError
}