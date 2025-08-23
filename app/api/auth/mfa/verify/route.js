/**
 * Enhanced MFA Verification API  
 * Multi-Factor Authentication token verification
 * Phase 1 Security Enhancement Implementation
 */

import { NextResponse } from 'next/server'
import { securityManager } from '../../../../../lib/security-manager.js'
import { supabaseConnectionManager } from '../../../../../lib/supabase-connection-manager.js'
import { performanceMonitor } from '../../../../../lib/performance-monitor.js'

export async function POST(request) {
  const timerId = performanceMonitor.startApiTimer('/api/auth/mfa/verify')
  
  try {
    const { userId, token, setupMode = false } = await request.json()
    
    // Validate required fields
    if (!userId || !token) {
      const metric = performanceMonitor.endApiTimer(timerId, 400)
      return NextResponse.json({
        error: 'User ID and verification token are required'
      }, { status: 400 })
    }

    // Rate limiting for MFA attempts
    const rateLimit = await securityManager.checkRateLimit(`mfa:${userId}`, 3, 5)
    if (!rateLimit.allowed) {
      const metric = performanceMonitor.endApiTimer(timerId, 429)
      return NextResponse.json({
        error: 'Too many verification attempts',
        retry_after: rateLimit.retryAfter
      }, { 
        status: 429,
        headers: {
          'Retry-After': rateLimit.retryAfter.toString(),
          'X-Response-Time': `${metric.duration.toFixed(2)}ms`
        }
      })
    }

    // Get encrypted MFA secret
    const mfaData = await performanceMonitor.trackDatabaseQuery('mfa_secret_retrieve', async () => {
      return await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        const result = await adminClient.from('user_mfa_settings')
          .select('encrypted_secret, setup_completed, backup_codes')
          .eq('user_id', userId)
          .single()
        
        return result.data
      })
    })

    if (!mfaData?.encrypted_secret) {
      await securityManager.recordAuthAttempt(`mfa:${userId}`, false)
      const metric = performanceMonitor.endApiTimer(timerId, 404)
      
      return NextResponse.json({
        error: 'MFA not configured for this user'
      }, { 
        status: 404,
        headers: {
          'X-Response-Time': `${metric.duration.toFixed(2)}ms`
        }
      })
    }

    // Decrypt the secret
    let secret
    try {
      secret = securityManager.decrypt(mfaData.encrypted_secret, userId)
    } catch (decryptionError) {
      await securityManager.recordAuthAttempt(`mfa:${userId}`, false)
      const metric = performanceMonitor.endApiTimer(timerId, 500)
      
      return NextResponse.json({
        error: 'Unable to decrypt MFA secret'
      }, { 
        status: 500,
        headers: {
          'X-Response-Time': `${metric.duration.toFixed(2)}ms`
        }
      })
    }

    // Verify the token
    const isValid = securityManager.verifyMFAToken(secret, token)
    
    if (!isValid) {
      await securityManager.recordAuthAttempt(`mfa:${userId}`, false)
      
      // Log failed MFA attempt
      await securityManager.logSecurityEvent({
        event_type: 'mfa_verification_failed',
        user_id: userId,
        timestamp: new Date().toISOString(),
        attempt_token: token.substring(0, 2) + '****' // Partial token for logging
      })
      
      const metric = performanceMonitor.endApiTimer(timerId, 401)
      
      return NextResponse.json({
        error: 'Invalid verification token',
        valid: false
      }, { 
        status: 401,
        headers: {
          'X-Response-Time': `${metric.duration.toFixed(2)}ms`
        }
      })
    }

    // Record successful attempt
    await securityManager.recordAuthAttempt(`mfa:${userId}`, true)

    // If this is setup mode, complete the setup
    if (setupMode && !mfaData.setup_completed) {
      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        securityManager.generateSecureRandom(8).toUpperCase()
      )
      
      // Encrypt backup codes
      const encryptedBackupCodes = backupCodes.map(code => 
        securityManager.encrypt(code, userId)
      )
      
      // Update MFA settings
      await performanceMonitor.trackDatabaseQuery('mfa_setup_complete', async () => {
        return await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
          return await adminClient.from('user_mfa_settings')
            .update({
              setup_completed: true,
              backup_codes: encryptedBackupCodes,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
        })
      })

      // Log successful setup
      await securityManager.logSecurityEvent({
        event_type: 'mfa_setup_completed',
        user_id: userId,
        timestamp: new Date().toISOString()
      })

      const metric = performanceMonitor.endApiTimer(timerId, 200)
      
      return NextResponse.json({
        success: true,
        valid: true,
        setup_completed: true,
        backup_codes: backupCodes,
        message: 'MFA setup completed successfully'
      }, {
        headers: {
          'X-Response-Time': `${metric.duration.toFixed(2)}ms`
        }
      })
    }

    // Log successful verification
    await securityManager.logSecurityEvent({
      event_type: 'mfa_verification_success',
      user_id: userId,
      timestamp: new Date().toISOString()
    })

    const metric = performanceMonitor.endApiTimer(timerId, 200)
    
    return NextResponse.json({
      success: true,
      valid: true,
      message: 'MFA verification successful'
    }, {
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    console.error('MFA verification error:', error.message)
    
    return NextResponse.json({
      error: 'MFA verification failed',
      valid: false,
      message: 'Unable to verify authentication token'
    }, { 
      status: 500,
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
  }
}

// Backup code verification endpoint
export async function PUT(request) {
  const timerId = performanceMonitor.startApiTimer('/api/auth/mfa/verify-backup')
  
  try {
    const { userId, backupCode } = await request.json()
    
    if (!userId || !backupCode) {
      const metric = performanceMonitor.endApiTimer(timerId, 400)
      return NextResponse.json({
        error: 'User ID and backup code are required'
      }, { status: 400 })
    }

    // Rate limiting for backup code attempts  
    const rateLimit = await securityManager.checkRateLimit(`backup:${userId}`, 2, 10)
    if (!rateLimit.allowed) {
      const metric = performanceMonitor.endApiTimer(timerId, 429)
      return NextResponse.json({
        error: 'Too many backup code attempts',
        retry_after: rateLimit.retryAfter
      }, { status: 429 })
    }

    // Get encrypted backup codes
    const mfaData = await performanceMonitor.trackDatabaseQuery('backup_codes_retrieve', async () => {
      return await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        const result = await adminClient.from('user_mfa_settings')
          .select('backup_codes, setup_completed')
          .eq('user_id', userId)
          .single()
        
        return result.data
      })
    })

    if (!mfaData?.backup_codes || !mfaData.setup_completed) {
      await securityManager.recordAuthAttempt(`backup:${userId}`, false)
      const metric = performanceMonitor.endApiTimer(timerId, 404)
      
      return NextResponse.json({
        error: 'No backup codes found for this user'
      }, { status: 404 })
    }

    // Check if backup code is valid
    let codeFound = false
    let remainingCodes = []
    
    for (const encryptedCode of mfaData.backup_codes) {
      try {
        const decryptedCode = securityManager.decrypt(encryptedCode, userId)
        
        if (decryptedCode.toUpperCase() === backupCode.toUpperCase()) {
          codeFound = true
          // Don't add used code to remaining codes
        } else {
          remainingCodes.push(encryptedCode)
        }
      } catch (error) {
        // Skip invalid encrypted codes
        console.warn('Failed to decrypt backup code:', error.message)
      }
    }

    if (!codeFound) {
      await securityManager.recordAuthAttempt(`backup:${userId}`, false)
      
      await securityManager.logSecurityEvent({
        event_type: 'backup_code_verification_failed',
        user_id: userId,
        timestamp: new Date().toISOString()
      })
      
      const metric = performanceMonitor.endApiTimer(timerId, 401)
      
      return NextResponse.json({
        error: 'Invalid backup code',
        valid: false
      }, { status: 401 })
    }

    // Update remaining backup codes
    await performanceMonitor.trackDatabaseQuery('backup_codes_update', async () => {
      return await supabaseConnectionManager.executeQuery(async (client, adminClient) => {
        return await adminClient.from('user_mfa_settings')
          .update({
            backup_codes: remainingCodes,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
      })
    })

    await securityManager.recordAuthAttempt(`backup:${userId}`, true)
    
    // Log successful backup code usage
    await securityManager.logSecurityEvent({
      event_type: 'backup_code_used',
      user_id: userId,
      remaining_codes: remainingCodes.length,
      timestamp: new Date().toISOString()
    })

    const metric = performanceMonitor.endApiTimer(timerId, 200)
    
    return NextResponse.json({
      success: true,
      valid: true,
      remaining_backup_codes: remainingCodes.length,
      message: remainingCodes.length === 0 ? 
        'Last backup code used. Please generate new backup codes.' : 
        `Backup code verified. ${remainingCodes.length} codes remaining.`
    }, {
      headers: {
        'X-Response-Time': `${metric.duration.toFixed(2)}ms`
      }
    })
    
  } catch (error) {
    const metric = performanceMonitor.endApiTimer(timerId, 500, error)
    console.error('Backup code verification error:', error.message)
    
    return NextResponse.json({
      error: 'Backup code verification failed',
      valid: false
    }, { status: 500 })
  }
}