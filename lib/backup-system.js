/**
 * Automated Backup System for CarBot Workshop Data
 * Ensures data safety and provides disaster recovery capabilities
 */

import { createClient } from '@supabase/supabase-js'
import { logError, logDatabaseError, ErrorSeverity } from './error-logger.js'
import fs from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

// Initialize Supabase client for backups
let supabase = null
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (supabaseUrl && supabaseKey && !supabaseKey.includes('placeholder')) {
    supabase = createClient(supabaseUrl, supabaseKey)
  }
} catch (error) {
  console.warn('⚠️ [Backup System] Failed to initialize Supabase client:', error.message)
}

/**
 * Backup configuration
 */
const BackupConfig = {
  // Tables to backup
  tables: [
    'workshops',
    'user_sessions', 
    'client_keys',
    'leads',
    'error_logs',
    'workshop_packages'
  ],
  
  // Backup retention (days)
  retention: {
    daily: 30,   // Keep daily backups for 30 days
    weekly: 90,  // Keep weekly backups for 90 days
    monthly: 365 // Keep monthly backups for 1 year
  },
  
  // Backup location (in production, use cloud storage)
  location: process.env.BACKUP_LOCATION || './backups',
  
  // Compression enabled
  compression: true,
  
  // Encryption enabled
  encryption: true
}

/**
 * Create a backup of all workshop data
 */
export async function createFullBackup(type = 'manual') {
  const backupId = `backup_${Date.now()}_${randomBytes(8).toString('hex')}`
  const timestamp = new Date().toISOString()
  
  console.log(`📦 [Backup] Starting ${type} backup: ${backupId}`)
  
  try {
    if (!supabase) {
      throw new Error('Database connection not available for backup')
    }

    const backup = {
      id: backupId,
      timestamp,
      type,
      version: process.env.npm_package_version || '2.0.0',
      tables: {},
      metadata: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        creator: type === 'scheduled' ? 'system' : 'manual'
      }
    }

    // Backup each table
    for (const tableName of BackupConfig.tables) {
      try {
        console.log(`📦 [Backup] Backing up table: ${tableName}`)
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
        
        if (error) {
          console.warn(`⚠️ [Backup] Failed to backup table ${tableName}:`, error.message)
          backup.tables[tableName] = { error: error.message, records: 0 }
        } else {
          backup.tables[tableName] = {
            records: data?.length || 0,
            data: data || []
          }
          console.log(`✅ [Backup] Table ${tableName}: ${data?.length || 0} records`)
        }
      } catch (tableError) {
        console.error(`❌ [Backup] Error backing up ${tableName}:`, tableError.message)
        backup.tables[tableName] = { error: tableError.message, records: 0 }
      }
    }

    // Calculate backup statistics
    const totalRecords = Object.values(backup.tables).reduce((sum, table) => {
      return sum + (table.records || 0)
    }, 0)

    backup.statistics = {
      totalTables: BackupConfig.tables.length,
      successfulTables: Object.values(backup.tables).filter(table => !table.error).length,
      totalRecords,
      backupSize: JSON.stringify(backup).length
    }

    // Save backup to storage
    const backupPath = await saveBackupToStorage(backup)
    
    console.log(`✅ [Backup] Backup completed: ${backupId}`)
    console.log(`📊 [Backup] Statistics: ${totalRecords} records, ${backup.statistics.successfulTables}/${BackupConfig.tables.length} tables`)
    
    return {
      success: true,
      backupId,
      path: backupPath,
      statistics: backup.statistics,
      timestamp
    }
    
  } catch (error) {
    await logDatabaseError(`Backup failed: ${error.message}`, {
      backupId,
      type,
      timestamp
    })
    
    console.error(`❌ [Backup] Backup failed: ${error.message}`)
    
    return {
      success: false,
      error: error.message,
      backupId,
      timestamp
    }
  }
}

/**
 * Save backup data to storage
 */
async function saveBackupToStorage(backup) {
  try {
    // Ensure backup directory exists
    await fs.mkdir(BackupConfig.location, { recursive: true })
    
    const filename = `${backup.id}.json`
    const backupPath = path.join(BackupConfig.location, filename)
    
    // Convert to JSON string
    let backupData = JSON.stringify(backup, null, 2)
    
    // Compress if enabled
    if (BackupConfig.compression) {
      // In production, implement compression (gzip, etc.)
      backupData = backupData // Placeholder for compression
    }
    
    // Encrypt if enabled
    if (BackupConfig.encryption) {
      backupData = encryptBackupData(backupData)
    }
    
    // Save to file
    await fs.writeFile(backupPath, backupData, 'utf8')
    
    console.log(`💾 [Backup] Saved to: ${backupPath}`)
    
    return backupPath
  } catch (error) {
    console.error(`❌ [Backup] Failed to save backup:`, error.message)
    throw error
  }
}

/**
 * Encrypt backup data (basic implementation)
 */
function encryptBackupData(data) {
  // In production, use proper encryption (AES-256, etc.)
  // For now, just base64 encode as placeholder
  return Buffer.from(data).toString('base64')
}

/**
 * Decrypt backup data
 */
function decryptBackupData(encryptedData) {
  // In production, use proper decryption
  // For now, just base64 decode
  return Buffer.from(encryptedData, 'base64').toString('utf8')
}

/**
 * Restore data from backup
 */
export async function restoreFromBackup(backupId, options = {}) {
  const { tables = [], dryRun = false } = options
  
  console.log(`🔄 [Restore] Starting restore from backup: ${backupId}`)
  
  try {
    if (!supabase) {
      throw new Error('Database connection not available for restore')
    }
    
    // Load backup data
    const backup = await loadBackupFromStorage(backupId)
    
    if (!backup) {
      throw new Error(`Backup ${backupId} not found`)
    }
    
    console.log(`📦 [Restore] Loaded backup: ${backup.id} from ${backup.timestamp}`)
    
    const restoreResults = {}
    const tablesToRestore = tables.length > 0 ? tables : BackupConfig.tables
    
    for (const tableName of tablesToRestore) {
      if (!backup.tables[tableName]) {
        console.warn(`⚠️ [Restore] Table ${tableName} not found in backup`)
        restoreResults[tableName] = { error: 'Table not found in backup' }
        continue
      }
      
      const tableData = backup.tables[tableName]
      
      if (tableData.error) {
        console.warn(`⚠️ [Restore] Skipping ${tableName}: ${tableData.error}`)
        restoreResults[tableName] = { error: tableData.error }
        continue
      }
      
      try {
        if (dryRun) {
          console.log(`🔍 [Restore] DRY RUN - Would restore ${tableData.records} records to ${tableName}`)
          restoreResults[tableName] = { 
            dryRun: true, 
            records: tableData.records,
            wouldRestore: tableData.data?.length || 0
          }
        } else {
          // Clear existing data (be very careful!)
          if (options.clearExisting) {
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
              
            if (deleteError) {
              throw new Error(`Failed to clear ${tableName}: ${deleteError.message}`)
            }
          }
          
          // Insert backup data
          if (tableData.data && tableData.data.length > 0) {
            const { data, error } = await supabase
              .from(tableName)
              .insert(tableData.data)
              
            if (error) {
              throw new Error(`Failed to restore ${tableName}: ${error.message}`)
            }
            
            console.log(`✅ [Restore] Restored ${tableData.data.length} records to ${tableName}`)
            restoreResults[tableName] = { 
              success: true, 
              restored: tableData.data.length 
            }
          } else {
            console.log(`ℹ️ [Restore] No data to restore for ${tableName}`)
            restoreResults[tableName] = { success: true, restored: 0 }
          }
        }
      } catch (tableError) {
        console.error(`❌ [Restore] Error restoring ${tableName}:`, tableError.message)
        restoreResults[tableName] = { error: tableError.message }
      }
    }
    
    console.log(`✅ [Restore] Restore ${dryRun ? 'simulation' : 'operation'} completed`)
    
    return {
      success: true,
      backupId,
      dryRun,
      results: restoreResults,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    await logError(`Restore failed: ${error.message}`, {
      backupId,
      tables,
      dryRun
    })
    
    console.error(`❌ [Restore] Restore failed: ${error.message}`)
    
    return {
      success: false,
      error: error.message,
      backupId,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Load backup from storage
 */
async function loadBackupFromStorage(backupId) {
  try {
    const filename = `${backupId}.json`
    const backupPath = path.join(BackupConfig.location, filename)
    
    let backupData = await fs.readFile(backupPath, 'utf8')
    
    // Decrypt if needed
    if (BackupConfig.encryption) {
      backupData = decryptBackupData(backupData)
    }
    
    return JSON.parse(backupData)
  } catch (error) {
    console.error(`❌ [Backup] Failed to load backup ${backupId}:`, error.message)
    return null
  }
}

/**
 * List available backups
 */
export async function listBackups() {
  try {
    const files = await fs.readdir(BackupConfig.location)
    const backups = []
    
    for (const file of files) {
      if (file.endsWith('.json') && file.startsWith('backup_')) {
        try {
          const backupPath = path.join(BackupConfig.location, file)
          const stats = await fs.stat(backupPath)
          
          backups.push({
            id: file.replace('.json', ''),
            filename: file,
            size: stats.size,
            created: stats.mtime.toISOString(),
            path: backupPath
          })
        } catch (fileError) {
          console.warn(`⚠️ [Backup] Error reading backup file ${file}:`, fileError.message)
        }
      }
    }
    
    // Sort by creation date (newest first)
    backups.sort((a, b) => new Date(b.created) - new Date(a.created))
    
    return backups
  } catch (error) {
    console.error(`❌ [Backup] Failed to list backups:`, error.message)
    return []
  }
}

/**
 * Cleanup old backups based on retention policy
 */
export async function cleanupOldBackups() {
  console.log(`🧹 [Backup] Starting backup cleanup...`)
  
  try {
    const backups = await listBackups()
    const now = new Date()
    let deletedCount = 0
    
    for (const backup of backups) {
      const backupAge = now - new Date(backup.created)
      const daysSinceCreation = backupAge / (1000 * 60 * 60 * 24)
      
      let shouldDelete = false
      
      // Determine if backup should be deleted based on retention policy
      if (backup.id.includes('daily') && daysSinceCreation > BackupConfig.retention.daily) {
        shouldDelete = true
      } else if (backup.id.includes('weekly') && daysSinceCreation > BackupConfig.retention.weekly) {
        shouldDelete = true
      } else if (backup.id.includes('monthly') && daysSinceCreation > BackupConfig.retention.monthly) {
        shouldDelete = true
      } else if (!backup.id.includes('daily') && !backup.id.includes('weekly') && !backup.id.includes('monthly') && daysSinceCreation > BackupConfig.retention.daily) {
        // Delete manual backups after daily retention period
        shouldDelete = true
      }
      
      if (shouldDelete) {
        try {
          await fs.unlink(backup.path)
          console.log(`🗑️ [Backup] Deleted old backup: ${backup.id}`)
          deletedCount++
        } catch (deleteError) {
          console.error(`❌ [Backup] Failed to delete ${backup.id}:`, deleteError.message)
        }
      }
    }
    
    console.log(`✅ [Backup] Cleanup completed: ${deletedCount} backups deleted`)
    
    return { success: true, deletedCount }
  } catch (error) {
    console.error(`❌ [Backup] Cleanup failed:`, error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Scheduled backup function (to be called by cron job)
 */
export async function scheduleBackup(type = 'daily') {
  console.log(`⏰ [Backup] Running scheduled ${type} backup`)
  
  const result = await createFullBackup(type)
  
  if (result.success) {
    // Also cleanup old backups
    await cleanupOldBackups()
  }
  
  return result
}

export default {
  createFullBackup,
  restoreFromBackup,
  listBackups,
  cleanupOldBackups,
  scheduleBackup,
  BackupConfig
}