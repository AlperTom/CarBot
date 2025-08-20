/**
 * Admin Backup Management API
 * Manual backup creation and scheduling for production
 */

import { NextResponse } from 'next/server'
import { createFullBackup, listBackups, cleanupOldBackups, restoreFromBackup } from '../../../../lib/backup-system.js'
import { logError } from '../../../../lib/error-logger.js'

/**
 * GET - List available backups
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    
    switch (action) {
      case 'list':
        const backups = await listBackups()
        return NextResponse.json({
          success: true,
          data: backups,
          count: backups.length
        })
        
      case 'cleanup':
        const cleanupResult = await cleanupOldBackups()
        return NextResponse.json({
          success: cleanupResult.success,
          data: cleanupResult,
          message: cleanupResult.success ? 
            `Cleanup completed: ${cleanupResult.deletedCount} backups deleted` :
            `Cleanup failed: ${cleanupResult.error}`
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    await logError('Backup API GET error', { error: error.message })
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process backup request'
    }, { status: 500 })
  }
}

/**
 * POST - Create new backup or restore from backup
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, backupId, type = 'manual', options = {} } = body
    
    switch (action) {
      case 'create':
        console.log(`📦 [Admin Backup] Creating ${type} backup...`)
        const backupResult = await createFullBackup(type)
        
        return NextResponse.json({
          success: backupResult.success,
          data: backupResult,
          message: backupResult.success ? 
            `Backup created successfully: ${backupResult.backupId}` :
            `Backup failed: ${backupResult.error}`
        }, { status: backupResult.success ? 201 : 500 })
        
      case 'restore':
        if (!backupId) {
          return NextResponse.json({
            success: false,
            error: 'Backup ID is required for restore'
          }, { status: 400 })
        }
        
        console.log(`🔄 [Admin Backup] Restoring from backup: ${backupId}`)
        const restoreResult = await restoreFromBackup(backupId, options)
        
        return NextResponse.json({
          success: restoreResult.success,
          data: restoreResult,
          message: restoreResult.success ? 
            `Restore ${options.dryRun ? 'simulation' : 'operation'} completed` :
            `Restore failed: ${restoreResult.error}`
        }, { status: restoreResult.success ? 200 : 500 })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    await logError('Backup API POST error', { 
      error: error.message,
      body: body || {}
    })
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process backup request'
    }, { status: 500 })
  }
}

/**
 * DELETE - Delete specific backup
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const backupId = searchParams.get('backupId')
    
    if (!backupId) {
      return NextResponse.json({
        success: false,
        error: 'Backup ID is required'
      }, { status: 400 })
    }
    
    // Import fs for file deletion
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const backupLocation = process.env.BACKUP_LOCATION || './backups'
    const backupPath = path.join(backupLocation, `${backupId}.json`)
    
    try {
      await fs.unlink(backupPath)
      console.log(`🗑️ [Admin Backup] Deleted backup: ${backupId}`)
      
      return NextResponse.json({
        success: true,
        message: `Backup ${backupId} deleted successfully`
      })
    } catch (deleteError) {
      if (deleteError.code === 'ENOENT') {
        return NextResponse.json({
          success: false,
          error: 'Backup not found'
        }, { status: 404 })
      }
      throw deleteError
    }
  } catch (error) {
    await logError('Backup API DELETE error', { 
      error: error.message,
      backupId: searchParams?.get('backupId')
    })
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete backup'
    }, { status: 500 })
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}