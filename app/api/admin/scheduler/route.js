/**
 * Admin Task Scheduler API
 * Manages scheduled tasks like backups, cleanup, and monitoring
 */

import { NextResponse } from 'next/server'
import { scheduleBackup } from '../../../../lib/backup-system.js'
import { logError } from '../../../../lib/error-logger.js'

// Simple in-memory scheduler storage
// In production, this should use a proper job queue like Bull or Agenda
const scheduledTasks = new Map()

/**
 * GET - Check scheduler status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'
    
    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: {
            activeTasks: scheduledTasks.size,
            tasks: Array.from(scheduledTasks.entries()).map(([id, task]) => ({
              id,
              type: task.type,
              nextRun: task.nextRun,
              lastRun: task.lastRun,
              enabled: task.enabled
            })),
            environment: process.env.NODE_ENV,
            uptime: process.uptime()
          }
        })
        
      case 'trigger_backup':
        const backupType = searchParams.get('type') || 'manual'
        console.log(`⏰ [Scheduler] Triggering ${backupType} backup manually`)
        
        const result = await scheduleBackup(backupType)
        return NextResponse.json({
          success: result.success,
          data: result,
          message: result.success ? 
            `${backupType} backup completed` :
            `Backup failed: ${result.error}`
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    await logError('Scheduler API GET error', { error: error.message })
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process scheduler request'
    }, { status: 500 })
  }
}

/**
 * POST - Create or update scheduled tasks
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, taskType, schedule, enabled = true } = body
    
    switch (action) {
      case 'create_schedule':
        const taskId = `${taskType}_${Date.now()}`
        
        const task = {
          id: taskId,
          type: taskType,
          schedule: schedule,
          enabled: enabled,
          created: new Date().toISOString(),
          nextRun: calculateNextRun(schedule),
          lastRun: null,
          runCount: 0
        }
        
        scheduledTasks.set(taskId, task)
        
        // Start the task if it's a backup scheduler
        if (taskType === 'backup' && enabled) {
          startBackupScheduler(task)
        }
        
        console.log(`⏰ [Scheduler] Created ${taskType} schedule: ${taskId}`)
        
        return NextResponse.json({
          success: true,
          data: task,
          message: `Scheduled task created: ${taskId}`
        }, { status: 201 })
        
      case 'enable_default_schedules':
        // Create default backup schedules
        const defaultSchedules = [
          { type: 'backup', schedule: 'daily', interval: 24 * 60 * 60 * 1000 }, // Daily
          { type: 'cleanup', schedule: 'weekly', interval: 7 * 24 * 60 * 60 * 1000 } // Weekly
        ]
        
        const createdTasks = []
        for (const schedule of defaultSchedules) {
          const taskId = `${schedule.type}_${schedule.schedule}`
          
          if (!scheduledTasks.has(taskId)) {
            const task = {
              id: taskId,
              type: schedule.type,
              schedule: schedule.schedule,
              interval: schedule.interval,
              enabled: true,
              created: new Date().toISOString(),
              nextRun: new Date(Date.now() + schedule.interval),
              lastRun: null,
              runCount: 0
            }
            
            scheduledTasks.set(taskId, task)
            createdTasks.push(task)
            
            if (schedule.type === 'backup') {
              startBackupScheduler(task)
            }
          }
        }
        
        return NextResponse.json({
          success: true,
          data: createdTasks,
          message: `Created ${createdTasks.length} default schedules`
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    await logError('Scheduler API POST error', { 
      error: error.message,
      body: body || {}
    })
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process scheduler request'
    }, { status: 500 })
  }
}

/**
 * Calculate next run time based on schedule
 */
function calculateNextRun(schedule) {
  const now = new Date()
  
  switch (schedule) {
    case 'hourly':
      return new Date(now.getTime() + 60 * 60 * 1000)
    case 'daily':
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(2, 0, 0, 0) // 2 AM
      return tomorrow
    case 'weekly':
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)
      nextWeek.setHours(3, 0, 0, 0) // 3 AM on same day next week
      return nextWeek
    case 'monthly':
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      nextMonth.setDate(1)
      nextMonth.setHours(4, 0, 0, 0) // 4 AM on 1st of next month
      return nextMonth
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000) // Default to daily
  }
}

/**
 * Start backup scheduler for a task
 */
function startBackupScheduler(task) {
  const runTask = async () => {
    try {
      console.log(`⏰ [Scheduler] Running scheduled ${task.type}: ${task.id}`)
      
      const result = await scheduleBackup(task.schedule)
      
      // Update task status
      task.lastRun = new Date().toISOString()
      task.runCount += 1
      task.nextRun = calculateNextRun(task.schedule)
      
      if (result.success) {
        console.log(`✅ [Scheduler] Scheduled ${task.type} completed: ${task.id}`)
      } else {
        console.error(`❌ [Scheduler] Scheduled ${task.type} failed: ${task.id}`, result.error)
        await logError(`Scheduled ${task.type} failed`, {
          taskId: task.id,
          error: result.error
        })
      }
    } catch (error) {
      console.error(`❌ [Scheduler] Task execution error: ${task.id}`, error.message)
      await logError('Scheduled task execution error', {
        taskId: task.id,
        error: error.message
      })
    }
    
    // Schedule next run if task is still enabled
    if (task.enabled && scheduledTasks.has(task.id)) {
      const timeUntilNext = new Date(task.nextRun).getTime() - Date.now()
      if (timeUntilNext > 0) {
        setTimeout(runTask, timeUntilNext)
      }
    }
  }
  
  // Calculate initial delay
  const timeUntilNext = new Date(task.nextRun).getTime() - Date.now()
  if (timeUntilNext > 0) {
    setTimeout(runTask, timeUntilNext)
    console.log(`⏰ [Scheduler] Scheduled ${task.type} will run in ${Math.round(timeUntilNext / 1000 / 60)} minutes`)
  } else {
    // Run immediately if next run time has passed
    setTimeout(runTask, 1000)
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}