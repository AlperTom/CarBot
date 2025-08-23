/**
 * Offline Storage Manager for CarBot PWA
 * Handles local data persistence, caching, and offline operations
 * Business Impact: Maintains app functionality during network outages
 */

class OfflineStorageManager {
  constructor() {
    this.storagePrefix = 'carbot_'
    this.version = '2.0.0'
    this.initializeStorage()
  }

  initializeStorage() {
    // Initialize default storage structure
    const defaultData = {
      user: null,
      workshop: null,
      leads: [],
      chats: [],
      settings: {},
      analytics: {},
      syncQueue: [],
      lastSync: null,
      cacheTimestamp: Date.now()
    }

    // Check if storage needs initialization
    Object.keys(defaultData).forEach(key => {
      if (!this.getItem(key)) {
        this.setItem(key, defaultData[key])
      }
    })

    // Version check for migrations
    const currentVersion = this.getItem('version')
    if (currentVersion !== this.version) {
      this.migrateStorage(currentVersion, this.version)
      this.setItem('version', this.version)
    }
  }

  migrateStorage(fromVersion, toVersion) {
    console.log(`Migrating storage from ${fromVersion} to ${toVersion}`)
    
    // Handle version-specific migrations
    if (!fromVersion || fromVersion < '2.0.0') {
      // Migrate from v1 to v2
      this.migrateFromV1()
    }
  }

  migrateFromV1() {
    // Convert old data structure to new format
    const oldData = this.getAllLegacyData()
    if (oldData) {
      // Transform and migrate data
      console.log('Migrating legacy data to v2 structure')
    }
  }

  /**
   * Basic storage operations
   */
  setItem(key, value) {
    try {
      const storageKey = `${this.storagePrefix}${key}`
      const data = {
        value,
        timestamp: Date.now(),
        version: this.version
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }

  getItem(key) {
    try {
      const storageKey = `${this.storagePrefix}${key}`
      const data = localStorage.getItem(storageKey)
      
      if (!data) return null
      
      const parsed = JSON.parse(data)
      return parsed.value
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  removeItem(key) {
    try {
      const storageKey = `${this.storagePrefix}${key}`
      localStorage.removeItem(storageKey)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  /**
   * User and authentication data
   */
  setUser(userData) {
    return this.setItem('user', userData)
  }

  getUser() {
    return this.getItem('user')
  }

  clearUser() {
    return this.removeItem('user')
  }

  /**
   * Workshop data management
   */
  setWorkshop(workshopData) {
    return this.setItem('workshop', workshopData)
  }

  getWorkshop() {
    return this.getItem('workshop')
  }

  updateWorkshop(updates) {
    const current = this.getWorkshop() || {}
    const updated = { ...current, ...updates }
    return this.setWorkshop(updated)
  }

  /**
   * Leads management
   */
  setLeads(leads) {
    return this.setItem('leads', leads)
  }

  getLeads() {
    return this.getItem('leads') || []
  }

  addLead(leadData) {
    const leads = this.getLeads()
    const newLead = {
      ...leadData,
      id: leadData.id || `offline-${Date.now()}`,
      createdAt: leadData.createdAt || new Date().toISOString(),
      offline_created: !leadData.id || leadData.id.startsWith('offline-')
    }
    
    leads.push(newLead)
    this.setLeads(leads)
    
    // Add to sync queue if created offline
    if (newLead.offline_created) {
      this.addToSyncQueue({
        type: 'lead_create',
        data: newLead
      })
    }
    
    return newLead
  }

  updateLead(leadId, updates) {
    const leads = this.getLeads()
    const leadIndex = leads.findIndex(lead => lead.id === leadId)
    
    if (leadIndex === -1) return false
    
    leads[leadIndex] = {
      ...leads[leadIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      offline_updated: true
    }
    
    this.setLeads(leads)
    
    // Add to sync queue
    this.addToSyncQueue({
      type: 'lead_update',
      data: { id: leadId, ...updates }
    })
    
    return leads[leadIndex]
  }

  deleteLead(leadId) {
    const leads = this.getLeads()
    const filteredLeads = leads.filter(lead => lead.id !== leadId)
    
    this.setLeads(filteredLeads)
    
    // Add to sync queue if it's not an offline-only lead
    if (!leadId.startsWith('offline-')) {
      this.addToSyncQueue({
        type: 'lead_delete',
        data: { id: leadId }
      })
    }
    
    return true
  }

  /**
   * Chat data management
   */
  setChats(chats) {
    return this.setItem('chats', chats)
  }

  getChats() {
    return this.getItem('chats') || []
  }

  addChatMessage(chatData) {
    const chats = this.getChats()
    const newMessage = {
      ...chatData,
      id: chatData.id || `msg-${Date.now()}`,
      timestamp: chatData.timestamp || new Date().toISOString(),
      offline_created: true
    }
    
    chats.push(newMessage)
    
    // Keep only last 1000 messages to prevent storage overflow
    if (chats.length > 1000) {
      chats.splice(0, chats.length - 1000)
    }
    
    this.setChats(chats)
    
    // Add to sync queue
    this.addToSyncQueue({
      type: 'chat_message',
      data: newMessage
    })
    
    return newMessage
  }

  /**
   * Settings management
   */
  setSettings(settings) {
    return this.setItem('settings', settings)
  }

  getSettings() {
    return this.getItem('settings') || {}
  }

  updateSettings(updates) {
    const current = this.getSettings()
    const updated = { ...current, ...updates }
    
    this.setSettings(updated)
    
    // Add to sync queue
    this.addToSyncQueue({
      type: 'settings_update',
      data: updates
    })
    
    return updated
  }

  /**
   * Analytics data
   */
  setAnalytics(analytics) {
    return this.setItem('analytics', analytics)
  }

  getAnalytics() {
    return this.getItem('analytics') || {}
  }

  updateAnalytics(updates) {
    const current = this.getAnalytics()
    const updated = { ...current, ...updates, lastUpdated: Date.now() }
    return this.setAnalytics(updated)
  }

  /**
   * Sync queue management
   */
  getSyncQueue() {
    return this.getItem('syncQueue') || []
  }

  setSyncQueue(queue) {
    return this.setItem('syncQueue', queue)
  }

  addToSyncQueue(operation) {
    const queue = this.getSyncQueue()
    const queueItem = {
      id: `sync-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      operation,
      status: 'pending',
      retries: 0,
      maxRetries: 3
    }
    
    queue.push(queueItem)
    this.setSyncQueue(queue)
    
    return queueItem
  }

  updateSyncItem(id, updates) {
    const queue = this.getSyncQueue()
    const itemIndex = queue.findIndex(item => item.id === id)
    
    if (itemIndex !== -1) {
      queue[itemIndex] = { ...queue[itemIndex], ...updates }
      this.setSyncQueue(queue)
      return queue[itemIndex]
    }
    
    return null
  }

  removeSyncItem(id) {
    const queue = this.getSyncQueue()
    const filteredQueue = queue.filter(item => item.id !== id)
    this.setSyncQueue(filteredQueue)
  }

  clearCompletedSyncItems() {
    const queue = this.getSyncQueue()
    const completedItems = queue.filter(item => item.status === 'completed')
    
    // Keep last 50 completed items for reference
    const filteredQueue = queue.filter(item => item.status !== 'completed')
      .concat(completedItems.slice(-50))
    
    this.setSyncQueue(filteredQueue)
  }

  /**
   * Cache management
   */
  setCacheData(key, data, ttl = 3600000) { // 1 hour default TTL
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
      expires: Date.now() + ttl
    }
    
    return this.setItem(`cache_${key}`, cacheItem)
  }

  getCacheData(key) {
    const cacheItem = this.getItem(`cache_${key}`)
    
    if (!cacheItem) return null
    
    // Check if cache has expired
    if (Date.now() > cacheItem.expires) {
      this.removeItem(`cache_${key}`)
      return null
    }
    
    return cacheItem.data
  }

  clearExpiredCache() {
    try {
      const keys = Object.keys(localStorage)
      const cacheKeys = keys.filter(key => key.startsWith(`${this.storagePrefix}cache_`))
      
      cacheKeys.forEach(key => {
        const data = localStorage.getItem(key)
        if (data) {
          try {
            const parsed = JSON.parse(data)
            if (parsed.value && Date.now() > parsed.value.expires) {
              localStorage.removeItem(key)
            }
          } catch (error) {
            // Invalid cache data, remove it
            localStorage.removeItem(key)
          }
        }
      })
    } catch (error) {
      console.error('Error clearing expired cache:', error)
    }
  }

  /**
   * Storage statistics and cleanup
   */
  getStorageStats() {
    let totalSize = 0
    let itemCount = 0
    const itemSizes = {}
    
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          const size = localStorage.getItem(key).length
          totalSize += size
          itemCount++
          
          const shortKey = key.replace(this.storagePrefix, '')
          itemSizes[shortKey] = size
        }
      })
    } catch (error) {
      console.error('Error calculating storage stats:', error)
    }
    
    return {
      totalSize,
      itemCount,
      itemSizes,
      quota: this.getStorageQuota()
    }
  }

  getStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return navigator.storage.estimate()
    }
    return Promise.resolve({ quota: null, usage: null })
  }

  cleanup() {
    try {
      // Clear expired cache
      this.clearExpiredCache()
      
      // Clear old sync items
      this.clearCompletedSyncItems()
      
      // Trim chat history if too large
      const chats = this.getChats()
      if (chats.length > 1000) {
        const trimmedChats = chats.slice(-1000)
        this.setChats(trimmedChats)
      }
      
      // Update cleanup timestamp
      this.setItem('lastCleanup', Date.now())
      
      return true
    } catch (error) {
      console.error('Storage cleanup error:', error)
      return false
    }
  }

  /**
   * Data export/import for backup/restore
   */
  exportData() {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      user: this.getUser(),
      workshop: this.getWorkshop(),
      leads: this.getLeads(),
      settings: this.getSettings(),
      analytics: this.getAnalytics()
    }
    
    return JSON.stringify(data)
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      
      // Validate data structure
      if (!data.version || !data.timestamp) {
        throw new Error('Invalid data format')
      }
      
      // Import data
      if (data.user) this.setUser(data.user)
      if (data.workshop) this.setWorkshop(data.workshop)
      if (data.leads) this.setLeads(data.leads)
      if (data.settings) this.setSettings(data.settings)
      if (data.analytics) this.setAnalytics(data.analytics)
      
      return true
    } catch (error) {
      console.error('Data import error:', error)
      return false
    }
  }

  /**
   * Complete storage reset
   */
  clearAllData() {
    try {
      const keys = Object.keys(localStorage)
      const carbotKeys = keys.filter(key => key.startsWith(this.storagePrefix))
      
      carbotKeys.forEach(key => {
        localStorage.removeItem(key)
      })
      
      // Reinitialize
      this.initializeStorage()
      
      return true
    } catch (error) {
      console.error('Clear all data error:', error)
      return false
    }
  }

  // Legacy support
  getAllLegacyData() {
    // Check for old data structure and return if found
    const legacyKeys = ['user', 'workshop', 'leads', 'settings']
    const legacyData = {}
    
    legacyKeys.forEach(key => {
      const oldData = localStorage.getItem(key)
      if (oldData) {
        try {
          legacyData[key] = JSON.parse(oldData)
        } catch (error) {
          // Ignore parsing errors for legacy data
        }
      }
    })
    
    return Object.keys(legacyData).length > 0 ? legacyData : null
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageManager()
export default offlineStorage

/**
 * React Hook for offline storage
 */
export function useOfflineStorage() {
  const [storageStats, setStorageStats] = useState(null)
  
  useEffect(() => {
    // Update storage stats periodically
    const updateStats = () => {
      setStorageStats(offlineStorage.getStorageStats())
    }
    
    updateStats()
    const interval = setInterval(updateStats, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  const exportData = useCallback(() => {
    return offlineStorage.exportData()
  }, [])
  
  const importData = useCallback((jsonData) => {
    return offlineStorage.importData(jsonData)
  }, [])
  
  const cleanup = useCallback(() => {
    return offlineStorage.cleanup()
  }, [])
  
  const clearAll = useCallback(() => {
    return offlineStorage.clearAllData()
  }, [])
  
  return {
    storage: offlineStorage,
    storageStats,
    exportData,
    importData,
    cleanup,
    clearAll
  }
}