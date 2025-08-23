/**
 * Enhanced MFA Setup API
 * Multi-Factor Authentication with TOTP support
 * Phase 1 Security Enhancement Implementation
 */

import { NextResponse } from 'next/server'
import { securityManager } from '../../../../../lib/security-manager.js'
import { supabaseConnectionManager } from '../../../../../lib/supabase-connection-manager.js'
import { performanceMonitor } from '../../../../../lib/performance-monitor.js'

export async function POST(request) {
  const timerId = performanceMonitor.startApiTimer('/api/auth/mfa/setup')
  
  try {
    const { userEmail, workshopName, userId } = await request.json()
    
    // Validate required fields
    if (!userEmail || !userId) {
      const metric = performanceMonitor.endApiTimer(timerId, 400)
      return NextResponse.json({
        error: 'User email and ID are required'
      }, { status: 400 })
    }

    // Generate MFA secret
    const mfaSecret = securityManager.generateMFASecret(userEmail, workshopName)
    
    // Generate QR code
    const qrCodeDataURL = await securityManager.generateMFAQRCode(mfaSecret.otpauth_url)
    
    // Encrypt and store the secret
    const encryptedSecret = securityManager.encrypt(mfaSecret.secret, userId)
    
    // Store MFA setup in database
    await performanceMonitor.trackDatabaseQuery('mfa_setup_store', async () => {
      return await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        return await adminClient.from('user_mfa_settings').upsert({
          user_id: userId,
          encrypted_secret: encryptedSecret,
          setup_completed: false,
          backup_codes: [], // Will be generated on verification
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      })
    })

    // Log security event
    await securityManager.logSecurityEvent({
      event_type: 'mfa_setup_initiated',
      user_id: userId,
      user_email: userEmail,
      timestamp: new Date().toISOString()
    })

    const metric = performanceMonitor.endApiTimer(timerId, 200)
    
    return NextResponse.json({
      success: true,
      setup: {
        secret: mfaSecret.secret,
        qr_code: qrCodeDataURL,
        manual_entry_key: mfaSecret.manual_entry_key,
        backup_codes: [] // Generated on verification
      },
      message: 'MFA setup initiated. Please verify with your authenticator app.'
    }, {
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    console.error('MFA setup error:', error.message)
    
    return NextResponse.json({
      error: 'MFA setup failed',
      message: 'Unable to initialize multi-factor authentication'
    }, { 
      status: 500,
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
  }
}

export async function GET(request) {
  const timerId = performanceMonitor.startApiTimer('/api/auth/mfa/setup')
  
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      const metric = performanceMonitor.endApiTimer(timerId, 400)
      return NextResponse.json({
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get MFA status
    const mfaStatus = await performanceMonitor.trackDatabaseQuery('mfa_status_check', async () => {
      return await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        const result = await adminClient.from('user_mfa_settings')
          .select('setup_completed, created_at, updated_at')
          .eq('user_id', userId)
          .single()
        
        return result.data
      })
    })

    const metric = performanceMonitor.endApiTimer(timerId, 200)
    
    return NextResponse.json({
      mfa_enabled: mfaStatus?.setup_completed || false,
      setup_date: mfaStatus?.created_at || null,
      last_updated: mfaStatus?.updated_at || null
    }, {
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    console.error('MFA status check error:', error.message)
    
    return NextResponse.json({
      mfa_enabled: false,
      error: 'Unable to check MFA status'
    }, { 
      status: 500,
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
  }
}