'use client'
import { useState, useEffect, useCallback } from 'react'
import { Wifi, WifiOff, Upload, Download, CheckCircle, XCircle, Clock } from 'lucide-react'

/**
 * Offline Synchronization Manager
 * Handles background sync, queue management, and conflict resolution
 * Business Impact: Ensures data integrity and seamless offline experience
 */
export default function OfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncQueue, setSyncQueue] = useState([])
  const [syncStatus, setSyncStatus] = useState('idle') // idle, syncing, error
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 })
  const [lastSyncTime, setLastSyncTime] = useState(null)

  useEffect(() => {
    // Initialize sync system
    initializeSync()
    
    // Listen for network changes
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Load existing sync queue
    loadSyncQueue()
    
    // Check sync status periodically
    const syncInterval = setInterval(checkAndSync, 30000) // Every 30 seconds
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(syncInterval)
    }
  }, [])

  const initializeSync = () => {
    setIsOnline(navigator.onLine)
    
    // Load last sync time
    const lastSync = localStorage.getItem('carbot_last_sync')
    if (lastSync) {
      setLastSyncTime(new Date(lastSync))
    }
  }

  const handleOnline = () => {
    setIsOnline(true)
    // Start sync process when coming back online
    setTimeout(startSync, 1000) // Small delay to ensure connection is stable
  }

  const handleOffline = () => {
    setIsOnline(false)
    setSyncStatus('idle')
  }

  const loadSyncQueue = () => {
    try {
      const queue = JSON.parse(localStorage.getItem('carbot_sync_queue') || '[]')
      setSyncQueue(queue)
    } catch (error) {
      console.error('Error loading sync queue:', error)
      setSyncQueue([])
    }
  }

  const saveSyncQueue = (queue) => {
    try {
      localStorage.setItem('carbot_sync_queue', JSON.stringify(queue))
      setSyncQueue(queue)
    } catch (error) {
      console.error('Error saving sync queue:', error)
    }
  }

  const addToSyncQueue = useCallback((operation) => {
    const queueItem = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      operation,
      status: 'pending',
      retries: 0,
      maxRetries: 3
    }
    
    const currentQueue = JSON.parse(localStorage.getItem('carbot_sync_queue') || '[]')
    const updatedQueue = [...currentQueue, queueItem]
    saveSyncQueue(updatedQueue)
    
    // If online, start sync immediately
    if (isOnline && syncStatus !== 'syncing') {
      startSync()
    }
  }, [isOnline, syncStatus])

  const startSync = async () => {
    if (!isOnline || syncStatus === 'syncing') return
    
    const currentQueue = JSON.parse(localStorage.getItem('carbot_sync_queue') || '[]')
    const pendingItems = currentQueue.filter(item => 
      item.status === 'pending' || (item.status === 'error' && item.retries < item.maxRetries)
    )
    
    if (pendingItems.length === 0) return
    
    setSyncStatus('syncing')
    setSyncProgress({ current: 0, total: pendingItems.length })
    
    let syncedCount = 0
    const updatedQueue = [...currentQueue]
    
    for (const item of pendingItems) {
      try {
        const result = await syncOperation(item.operation)
        
        if (result.success) {
          // Mark as completed
          const itemIndex = updatedQueue.findIndex(q => q.id === item.id)
          if (itemIndex !== -1) {
            updatedQueue[itemIndex].status = 'completed'
            updatedQueue[itemIndex].syncedAt = new Date().toISOString()
          }
          syncedCount++
        } else {
          throw new Error(result.error || 'Sync failed')
        }
      } catch (error) {
        console.error('Sync error:', error)
        
        // Update retry count
        const itemIndex = updatedQueue.findIndex(q => q.id === item.id)
        if (itemIndex !== -1) {
          updatedQueue[itemIndex].retries++
          updatedQueue[itemIndex].status = 'error'
          updatedQueue[itemIndex].lastError = error.message
        }
      }
      
      setSyncProgress(prev => ({ ...prev, current: prev.current + 1 }))
      
      // Small delay between operations
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Clean up completed items (keep only last 50 for reference)
    const completedItems = updatedQueue.filter(item => item.status === 'completed')
    const otherItems = updatedQueue.filter(item => item.status !== 'completed')
    const cleanedQueue = [
      ...otherItems,
      ...completedItems.slice(-50)
    ]
    
    saveSyncQueue(cleanedQueue)
    
    if (syncedCount > 0) {
      setLastSyncTime(new Date())
      localStorage.setItem('carbot_last_sync', new Date().toISOString())
    }
    
    setSyncStatus(syncedCount === pendingItems.length ? 'idle' : 'error')
    setSyncProgress({ current: 0, total: 0 })
  }

  const syncOperation = async (operation) => {
    try {
      switch (operation.type) {
        case 'lead_create':
          return await syncLeadCreate(operation.data)
        case 'lead_update':
          return await syncLeadUpdate(operation.data)
        case 'chat_message':
          return await syncChatMessage(operation.data)
        case 'settings_update':
          return await syncSettingsUpdate(operation.data)
        case 'workshop_update':
          return await syncWorkshopUpdate(operation.data)
        default:
          throw new Error(`Unknown operation type: ${operation.type}`)
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const syncLeadCreate = async (leadData) => {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...leadData,
        offline_created: true,
        sync_timestamp: new Date().toISOString()
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      return { success: true, data: result }
    } else {
      const error = await response.json()
      throw new Error(error.message || 'Failed to sync lead')
    }
  }

  const syncLeadUpdate = async (updateData) => {
    const response = await fetch(`/api/leads/${updateData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updateData,
        offline_updated: true,
        sync_timestamp: new Date().toISOString()
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      return { success: true, data: result }
    } else {
      const error = await response.json()
      throw new Error(error.message || 'Failed to sync lead update')
    }
  }

  const syncChatMessage = async (messageData) => {
    const response = await fetch('/api/chat/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...messageData,
        offline_created: true,
        sync_timestamp: new Date().toISOString()
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      return { success: true, data: result }
    } else {
      const error = await response.json()
      throw new Error(error.message || 'Failed to sync chat message')
    }
  }

  const syncSettingsUpdate = async (settingsData) => {
    const response = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...settingsData,
        offline_updated: true,
        sync_timestamp: new Date().toISOString()
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      return { success: true, data: result }
    } else {
      const error = await response.json()
      throw new Error(error.message || 'Failed to sync settings')
    }
  }

  const syncWorkshopUpdate = async (workshopData) => {
    const response = await fetch('/api/workshops', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...workshopData,
        offline_updated: true,
        sync_timestamp: new Date().toISOString()
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      return { success: true, data: result }
    } else {
      const error = await response.json()
      throw new Error(error.message || 'Failed to sync workshop data')
    }
  }

  const checkAndSync = () => {
    if (isOnline && syncStatus === 'idle') {
      const currentQueue = JSON.parse(localStorage.getItem('carbot_sync_queue') || '[]')
      const hasPendingItems = currentQueue.some(item => 
        item.status === 'pending' || (item.status === 'error' && item.retries < item.maxRetries)
      )
      
      if (hasPendingItems) {
        startSync()
      }
    }
  }

  const retrySyncManually = () => {
    if (isOnline) {
      startSync()
    }
  }

  const clearSyncQueue = () => {
    saveSyncQueue([])
    setSyncStatus('idle')
    setSyncProgress({ current: 0, total: 0 })
  }

  // Sync indicator component
  const SyncIndicator = () => {
    const pendingCount = syncQueue.filter(item => 
      item.status === 'pending' || (item.status === 'error' && item.retries < item.maxRetries)
    ).length

    if (!isOnline) {
      return (
        <div className="flex items-center space-x-2 text-red-600">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Offline - {pendingCount} wartend</span>
        </div>
      )
    }

    if (syncStatus === 'syncing') {
      return (
        <div className="flex items-center space-x-2 text-blue-600">
          <Upload className="w-4 h-4 animate-pulse" />
          <span className="text-sm">
            Synchronisiere... ({syncProgress.current}/{syncProgress.total})
          </span>
        </div>
      )
    }

    if (pendingCount > 0) {
      return (
        <div className="flex items-center space-x-2 text-orange-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{pendingCount} wartend</span>
          <button 
            onClick={retrySyncManually}
            className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
          >
            Jetzt sync.
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">
          Synchronisiert
          {lastSyncTime && (
            <span className="text-xs text-gray-500 ml-1">
              ({lastSyncTime.toLocaleTimeString('de-DE')})
            </span>
          )}
        </span>
      </div>
    )
  }

  // Detailed sync status component
  const SyncDetails = ({ show }) => {
    if (!show) return null

    const errorItems = syncQueue.filter(item => item.status === 'error')
    const pendingItems = syncQueue.filter(item => item.status === 'pending')
    const completedItems = syncQueue.filter(item => item.status === 'completed').slice(-10)

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Sync-Status</h3>
          {syncQueue.length > 0 && (
            <button
              onClick={clearSyncQueue}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Queue leeren
            </button>
          )}
        </div>

        {errorItems.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-800 mb-2">Fehler ({errorItems.length})</h4>
            <div className="space-y-1">
              {errorItems.slice(0, 3).map((item) => (
                <div key={item.id} className="text-xs text-red-600 flex items-center space-x-2">
                  <XCircle className="w-3 h-3" />
                  <span>{item.operation.type} - {item.lastError}</span>
                  <span>({item.retries}/{item.maxRetries})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingItems.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-orange-800 mb-2">Warteschlange ({pendingItems.length})</h4>
            <div className="space-y-1">
              {pendingItems.slice(0, 3).map((item) => (
                <div key={item.id} className="text-xs text-orange-600 flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{item.operation.type}</span>
                  <span className="text-gray-500">
                    {new Date(item.timestamp).toLocaleTimeString('de-DE')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedItems.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-800 mb-2">Kürzlich synchronisiert</h4>
            <div className="space-y-1">
              {completedItems.map((item) => (
                <div key={item.id} className="text-xs text-green-600 flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3" />
                  <span>{item.operation.type}</span>
                  <span className="text-gray-500">
                    {new Date(item.syncedAt).toLocaleTimeString('de-DE')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {syncQueue.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            Keine ausstehenden Synchronisierungen
          </div>
        )}
      </div>
    )
  }

  return {
    SyncIndicator,
    SyncDetails,
    addToSyncQueue,
    isOnline,
    syncStatus,
    pendingCount: syncQueue.filter(item => 
      item.status === 'pending' || (item.status === 'error' && item.retries < item.maxRetries)
    ).length
  }
}

// Hook for offline operations
export function useOfflineOperations() {
  const [offlineQueue, setOfflineQueue] = useState([])

  const addOfflineOperation = useCallback((operation) => {
    const queueItem = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      operation,
      status: 'pending'
    }
    
    // Add to localStorage queue
    const currentQueue = JSON.parse(localStorage.getItem('carbot_sync_queue') || '[]')
    const updatedQueue = [...currentQueue, queueItem]
    localStorage.setItem('carbot_sync_queue', JSON.stringify(updatedQueue))
    
    setOfflineQueue(updatedQueue)
    
    // If online, trigger sync
    if (navigator.onLine) {
      window.dispatchEvent(new CustomEvent('carbot-sync-request'))
    }
  }, [])

  const updateLead = useCallback((leadData) => {
    addOfflineOperation({
      type: 'lead_update',
      data: leadData
    })
    
    // Update local storage immediately for offline access
    const localLeads = JSON.parse(localStorage.getItem('carbot_leads') || '[]')
    const leadIndex = localLeads.findIndex(lead => lead.id === leadData.id)
    
    if (leadIndex !== -1) {
      localLeads[leadIndex] = { ...localLeads[leadIndex], ...leadData }
    } else {
      localLeads.push(leadData)
    }
    
    localStorage.setItem('carbot_leads', JSON.stringify(localLeads))
  }, [addOfflineOperation])

  const createLead = useCallback((leadData) => {
    const offlineId = `offline-${Date.now()}`
    const leadWithOfflineId = { ...leadData, id: offlineId, offline_created: true }
    
    addOfflineOperation({
      type: 'lead_create',
      data: leadWithOfflineId
    })
    
    // Store locally for offline access
    const localLeads = JSON.parse(localStorage.getItem('carbot_leads') || '[]')
    localLeads.push(leadWithOfflineId)
    localStorage.setItem('carbot_leads', JSON.stringify(localLeads))
    
    return leadWithOfflineId
  }, [addOfflineOperation])

  const updateSettings = useCallback((settingsData) => {
    addOfflineOperation({
      type: 'settings_update',
      data: settingsData
    })
    
    // Update local settings immediately
    const localSettings = JSON.parse(localStorage.getItem('carbot_settings') || '{}')
    const updatedSettings = { ...localSettings, ...settingsData }
    localStorage.setItem('carbot_settings', JSON.stringify(updatedSettings))
  }, [addOfflineOperation])

  return {
    updateLead,
    createLead,
    updateSettings,
    offlineQueue
  }
}