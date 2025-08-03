import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { user: data.user, session: data.session }
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

export async function signUp(email, password, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return { user: data.user, session: data.session }
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}

export async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating password:', error)
    throw error
  }
}

// Validation functions
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password) {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function validatePhoneNumber(phone) {
  // German phone number format
  const phoneRegex = /^(\+49|0)[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validatePostalCode(postalCode, country = 'DE') {
  const patterns = {
    DE: /^\d{5}$/,
    AT: /^\d{4}$/,
    CH: /^\d{4}$/
  }
  return patterns[country]?.test(postalCode) || false
}

// Security functions
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input.replace(/[<>\"']/g, '')
}

export async function logSecurityEvent(event, details = {}) {
  try {
    console.log('Security Event:', event, details)
    // In production, send to security monitoring service
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

// Rate limiting (simple in-memory implementation)
const rateLimitStore = new Map()

export function rateLimit(identifier, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, [])
  }
  
  const requests = rateLimitStore.get(identifier)
  const validRequests = requests.filter(time => time > windowStart)
  
  if (validRequests.length >= maxRequests) {
    return false // Rate limited
  }
  
  validRequests.push(now)
  rateLimitStore.set(identifier, validRequests)
  return true // Allowed
}

// Workshop data storage
export async function storeWorkshopData(workshopData) {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .insert([workshopData])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error storing workshop data:', error)
    throw error
  }
}

export async function getStoredWorkshopData(userId) {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('owner_email', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error getting workshop data:', error)
    return null
  }
}

// Export supabase instance
export { supabase }

export default supabase