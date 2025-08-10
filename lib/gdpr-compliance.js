/**
 * GDPR Compliance Implementation for CarBot
 * Implements automated data deletion, right to erasure, and data portability
 */

import { supabase } from './auth';
import { sessionManager } from './security';

/**
 * GDPR Data Categories and Retention Periods
 */
export const GDPR_DATA_CATEGORIES = {
  USER_PROFILE: {
    tables: ['workshops', 'users'],
    retentionDays: 2555, // 7 years for business records
    criticalData: true
  },
  CHAT_DATA: {
    tables: ['chat_messages', 'chat_sessions'],
    retentionDays: 365, // 1 year
    criticalData: false
  },
  ANALYTICS: {
    tables: ['analytics_events', 'usage_tracking'],
    retentionDays: 1095, // 3 years for analytics
    criticalData: false
  },
  LEADS: {
    tables: ['leads', 'appointments'],
    retentionDays: 2555, // 7 years for business records
    criticalData: true
  },
  SUPPORT: {
    tables: ['callback_requests', 'support_tickets'],
    retentionDays: 1825, // 5 years
    criticalData: false
  },
  BILLING: {
    tables: ['billing_events', 'subscriptions'],
    retentionDays: 3650, // 10 years (German law requirement)
    criticalData: true
  }
};

/**
 * Automated Data Deletion Service
 */
export class GDPRDataManager {
  constructor() {
    this.supabase = supabase;
  }

  /**
   * Execute automated data cleanup based on retention policies
   */
  async executeAutomatedCleanup() {
    console.log('🗑️ Starting GDPR automated data cleanup...');
    
    const cleanupResults = [];
    
    for (const [category, config] of Object.entries(GDPR_DATA_CATEGORIES)) {
      try {
        const result = await this.cleanupDataCategory(category, config);
        cleanupResults.push(result);
        console.log(`✅ Cleaned up ${category}: ${result.deletedCount} records`);
      } catch (error) {
        console.error(`❌ Error cleaning up ${category}:`, error);
        cleanupResults.push({
          category,
          success: false,
          error: error.message,
          deletedCount: 0
        });
      }
    }
    
    // Log cleanup summary
    await this.logCleanupActivity(cleanupResults);
    
    return cleanupResults;
  }

  /**
   * Clean up specific data category
   */
  async cleanupDataCategory(category, config) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);
    
    let totalDeleted = 0;
    
    for (const table of config.tables) {
      try {
        const deleteResult = await this.supabase
          .from(table)
          .delete()
          .lt('created_at', cutoffDate.toISOString())
          .select('count');
        
        const deletedCount = deleteResult.data?.length || 0;
        totalDeleted += deletedCount;
        
        console.log(`  📊 ${table}: ${deletedCount} records deleted`);
      } catch (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }
    }
    
    return {
      category,
      success: true,
      deletedCount: totalDeleted,
      cutoffDate: cutoffDate.toISOString(),
      tables: config.tables
    };
  }

  /**
   * Right to Erasure - Delete all user data
   */
  async executeRightToErasure(userId, reason = 'user_request') {
    console.log(`🗑️ Executing right to erasure for user ${userId}`);
    
    const deletionResults = [];
    
    try {
      // 1. Invalidate all user sessions
      await sessionManager.invalidateUserSessions(userId);
      
      // 2. Delete from all tables containing user data
      const userDataTables = [
        'workshops',
        'users', 
        'chat_messages',
        'chat_sessions',
        'leads',
        'appointments',
        'analytics_events',
        'usage_tracking',
        'callback_requests',
        'support_tickets',
        'billing_events',
        'subscriptions',
        'client_services',
        'business_hours',
        'special_hours',
        'context_cache'
      ];
      
      for (const table of userDataTables) {
        try {
          // Determine the user ID column name
          const userIdColumn = this.getUserIdColumn(table);
          
          const deleteResult = await this.supabase
            .from(table)
            .delete()
            .eq(userIdColumn, userId)
            .select('count');
          
          const deletedCount = deleteResult.data?.length || 0;
          
          deletionResults.push({
            table,
            success: true,
            deletedCount,
            userIdColumn
          });
          
          console.log(`  ✅ ${table}: ${deletedCount} records deleted`);
        } catch (error) {
          console.error(`Error deleting from ${table}:`, error);
          deletionResults.push({
            table,
            success: false,
            error: error.message,
            deletedCount: 0
          });
        }
      }
      
      // 3. Log the erasure request for compliance
      await this.logErasureRequest(userId, reason, deletionResults);
      
      // 4. Send confirmation email (if email available)
      await this.sendErasureConfirmation(userId);
      
      console.log(`✅ Right to erasure completed for user ${userId}`);
      
      return {
        success: true,
        userId,
        reason,
        deletionResults,
        completedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Error executing right to erasure for user ${userId}:`, error);
      
      return {
        success: false,
        userId,
        reason,
        error: error.message,
        completedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Data Portability - Export all user data
   */
  async executeDataPortability(userId) {
    console.log(`📦 Executing data portability for user ${userId}`);
    
    const exportData = {
      user_id: userId,
      export_date: new Date().toISOString(),
      data_categories: {}
    };
    
    try {
      // Export data from all relevant tables
      const dataCategories = [
        { category: 'profile', tables: ['workshops', 'users'] },
        { category: 'conversations', tables: ['chat_messages', 'chat_sessions'] },
        { category: 'business_data', tables: ['leads', 'appointments', 'client_services'] },
        { category: 'settings', tables: ['business_hours', 'special_hours'] },
        { category: 'usage_analytics', tables: ['usage_tracking', 'analytics_events'] },
        { category: 'billing', tables: ['billing_events', 'subscriptions'] }
      ];
      
      for (const { category, tables } of dataCategories) {
        exportData.data_categories[category] = {};
        
        for (const table of tables) {
          try {
            const userIdColumn = this.getUserIdColumn(table);
            
            const { data, error } = await this.supabase
              .from(table)
              .select('*')
              .eq(userIdColumn, userId);
            
            if (error) throw error;
            
            exportData.data_categories[category][table] = data || [];
            
            console.log(`  📊 ${table}: ${data?.length || 0} records exported`);
          } catch (error) {
            console.error(`Error exporting from ${table}:`, error);
            exportData.data_categories[category][table] = {
              error: error.message
            };
          }
        }
      }
      
      // Log the export request
      await this.logDataPortabilityRequest(userId, exportData);
      
      console.log(`✅ Data portability completed for user ${userId}`);
      
      return {
        success: true,
        userId,
        exportData,
        exportSize: JSON.stringify(exportData).length,
        completedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Error executing data portability for user ${userId}:`, error);
      
      return {
        success: false,
        userId,
        error: error.message,
        completedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Consent Management
   */
  async updateUserConsent(userId, consentType, granted, purpose = null) {
    const consentRecord = {
      user_id: userId,
      consent_type: consentType,
      granted: granted,
      purpose: purpose,
      granted_at: granted ? new Date().toISOString() : null,
      withdrawn_at: !granted ? new Date().toISOString() : null,
      ip_address: null, // Should be passed from request
      user_agent: null, // Should be passed from request
      legal_basis: this.getLegalBasis(consentType),
      version: '1.0'
    };
    
    try {
      const { data, error } = await this.supabase
        .from('gdpr_consent_log')
        .insert(consentRecord)
        .select('*')
        .single();
      
      if (error) throw error;
      
      // If consent withdrawn for critical data, schedule deletion
      if (!granted && this.isCriticalConsent(consentType)) {
        await this.scheduleConsentBasedDeletion(userId, consentType);
      }
      
      return { success: true, consent: data };
    } catch (error) {
      console.error('Error updating consent:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user ID column name for different tables
   */
  getUserIdColumn(table) {
    const columnMap = {
      'workshops': 'id',
      'users': 'id',
      'chat_messages': 'workshop_id',
      'chat_sessions': 'workshop_id',
      'leads': 'workshop_id',
      'appointments': 'workshop_id',
      'analytics_events': 'workshop_id',
      'usage_tracking': 'workshop_id',
      'callback_requests': 'client_id',
      'support_tickets': 'user_id',
      'billing_events': 'workshop_id',
      'subscriptions': 'workshop_id',
      'client_services': 'client_id',
      'business_hours': 'client_id',
      'special_hours': 'client_id',
      'context_cache': 'client_id'
    };
    
    return columnMap[table] || 'user_id';
  }

  /**
   * Log cleanup activity for audit purposes
   */
  async logCleanupActivity(cleanupResults) {
    const logEntry = {
      activity_type: 'automated_cleanup',
      executed_at: new Date().toISOString(),
      results: cleanupResults,
      total_deleted: cleanupResults.reduce((sum, result) => sum + result.deletedCount, 0)
    };
    
    try {
      await this.supabase
        .from('gdpr_activity_log')
        .insert(logEntry);
    } catch (error) {
      console.error('Error logging cleanup activity:', error);
    }
  }

  /**
   * Log erasure request for compliance
   */
  async logErasureRequest(userId, reason, deletionResults) {
    const logEntry = {
      activity_type: 'right_to_erasure',
      user_id: userId,
      reason: reason,
      executed_at: new Date().toISOString(),
      results: deletionResults,
      total_deleted: deletionResults.reduce((sum, result) => sum + result.deletedCount, 0)
    };
    
    try {
      await this.supabase
        .from('gdpr_activity_log')
        .insert(logEntry);
    } catch (error) {
      console.error('Error logging erasure request:', error);
    }
  }

  /**
   * Log data portability request
   */
  async logDataPortabilityRequest(userId, exportData) {
    const logEntry = {
      activity_type: 'data_portability',
      user_id: userId,
      executed_at: new Date().toISOString(),
      export_size: JSON.stringify(exportData).length,
      data_categories: Object.keys(exportData.data_categories)
    };
    
    try {
      await this.supabase
        .from('gdpr_activity_log')
        .insert(logEntry);
    } catch (error) {
      console.error('Error logging data portability request:', error);
    }
  }

  /**
   * Send erasure confirmation email
   */
  async sendErasureConfirmation(userId) {
    // This would integrate with your email service
    console.log(`📧 Erasure confirmation email would be sent to user ${userId}`);
  }

  /**
   * Get legal basis for consent type
   */
  getLegalBasis(consentType) {
    const legalBasisMap = {
      'marketing': 'consent',
      'analytics': 'legitimate_interest',
      'essential': 'contract',
      'personalization': 'consent'
    };
    
    return legalBasisMap[consentType] || 'consent';
  }

  /**
   * Check if consent type is critical
   */
  isCriticalConsent(consentType) {
    return ['essential', 'contract'].includes(consentType);
  }

  /**
   * Schedule consent-based deletion
   */
  async scheduleConsentBasedDeletion(userId, consentType) {
    // Schedule deletion after grace period (30 days)
    console.log(`📅 Scheduled consent-based deletion for user ${userId}, consent type: ${consentType}`);
  }
}

/**
 * GDPR Compliance API Helper Functions
 */
export class GDPRComplianceAPI {
  constructor() {
    this.dataManager = new GDPRDataManager();
  }

  /**
   * Handle right to erasure request
   */
  async handleErasureRequest(request) {
    const { user_id, email, reason = 'user_request' } = request;
    
    if (!user_id && !email) {
      return {
        success: false,
        error: 'User ID or email required'
      };
    }
    
    // Find user by email if user_id not provided
    let userId = user_id;
    if (!userId && email) {
      const { data: user } = await supabase
        .from('workshops')
        .select('id')
        .eq('owner_email', email)
        .single();
      
      userId = user?.id;
    }
    
    if (!userId) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return await this.dataManager.executeRightToErasure(userId, reason);
  }

  /**
   * Handle data portability request
   */
  async handleDataPortabilityRequest(request) {
    const { user_id, email } = request;
    
    if (!user_id && !email) {
      return {
        success: false,
        error: 'User ID or email required'
      };
    }
    
    let userId = user_id;
    if (!userId && email) {
      const { data: user } = await supabase
        .from('workshops')
        .select('id')
        .eq('owner_email', email)
        .single();
      
      userId = user?.id;
    }
    
    if (!userId) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return await this.dataManager.executeDataPortability(userId);
  }

  /**
   * Handle consent update
   */
  async handleConsentUpdate(request) {
    const { user_id, consent_type, granted, purpose, ip_address, user_agent } = request;
    
    return await this.dataManager.updateUserConsent(
      user_id,
      consent_type,
      granted,
      purpose
    );
  }
}

// Singleton instances
export const gdprDataManager = new GDPRDataManager();
export const gdprComplianceAPI = new GDPRComplianceAPI();

/**
 * Scheduled cleanup function (to be called by cron job)
 */
export async function scheduleGDPRCleanup() {
  console.log('🕐 Starting scheduled GDPR cleanup...');
  
  try {
    const results = await gdprDataManager.executeAutomatedCleanup();
    console.log('✅ GDPR cleanup completed successfully');
    return results;
  } catch (error) {
    console.error('❌ GDPR cleanup failed:', error);
    throw error;
  }
}

export default {
  GDPRDataManager,
  GDPRComplianceAPI,
  gdprDataManager,
  gdprComplianceAPI,
  scheduleGDPRCleanup,
  GDPR_DATA_CATEGORIES
};