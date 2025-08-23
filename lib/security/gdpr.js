import { createClient } from '@supabase/supabase-js';
import EncryptionManager from './encryption.js';

/**
 * GDPR Compliance Manager
 * Handles data protection, consent management, and privacy rights
 * Compliant with EU GDPR Article 7, 17, 20, and 21
 */
export class GDPRManager {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    this.encryption = EncryptionManager;
  }

  /**
   * Record user consent for data processing
   * @param {string} userId - User ID
   * @param {string} consentType - Type of consent (marketing, analytics, etc.)
   * @param {boolean} granted - Whether consent was granted
   * @param {Object} metadata - Additional consent metadata
   * @returns {Object} Consent record result
   */
  async recordConsent(userId, consentType, granted, metadata = {}) {
    try {
      const consentRecord = {
        user_id: userId,
        consent_type: consentType,
        granted: granted,
        granted_at: granted ? new Date().toISOString() : null,
        withdrawn_at: !granted ? new Date().toISOString() : null,
        ip_address: metadata.ipAddress,
        user_agent: metadata.userAgent,
        consent_version: metadata.consentVersion || '1.0',
        legal_basis: metadata.legalBasis || 'consent',
        purpose: metadata.purpose || consentType,
        metadata: metadata
      };

      const { data, error } = await this.supabase
        .from('gdpr_consents')
        .upsert(consentRecord, { 
          onConflict: 'user_id,consent_type',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      // Log consent action for audit trail
      await this.logGDPRAction(userId, 'consent_recorded', {
        consentType,
        granted,
        metadata
      });

      return { success: true, data };
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw new Error(`Consent recording failed: ${error.message}`);
    }
  }

  /**
   * Get user's current consent status
   * @param {string} userId - User ID
   * @param {string} consentType - Type of consent (optional)
   * @returns {Array|Object} Consent records
   */
  async getUserConsents(userId, consentType = null) {
    try {
      let query = this.supabase
        .from('gdpr_consents')
        .select('*')
        .eq('user_id', userId);

      if (consentType) {
        query = query.eq('consent_type', consentType);
      }

      const { data, error } = await query;
      if (error) throw error;

      return consentType ? data[0] : data;
    } catch (error) {
      console.error('Failed to get user consents:', error);
      return consentType ? null : [];
    }
  }

  /**
   * Process data subject access request (Article 15)
   * @param {string} userId - User ID
   * @param {string} email - User's email for verification
   * @returns {Object} Complete user data package
   */
  async processDataAccessRequest(userId, email) {
    try {
      // Verify user identity
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('User verification failed');
      }

      // Collect all personal data
      const personalData = {
        profile: userData,
        consents: await this.getUserConsents(userId),
        sessions: await this.getUserSessions(userId),
        workshop_data: await this.getWorkshopData(userId),
        audit_logs: await this.getAuditLogs(userId),
        communications: await this.getCommunicationHistory(userId)
      };

      // Decrypt sensitive data for export
      if (personalData.workshop_data) {
        personalData.workshop_data = this.encryption.decryptWorkshopData(
          personalData.workshop_data,
          process.env.MASTER_ENCRYPTION_KEY
        );
      }

      // Log data access request
      await this.logGDPRAction(userId, 'data_access_requested', {
        requestedBy: email,
        dataTypes: Object.keys(personalData)
      });

      // Generate data export package
      const exportPackage = {
        user_id: userId,
        email: email,
        export_date: new Date().toISOString(),
        data_retention_period: '7 years',
        legal_basis: 'Article 15 GDPR - Right of Access',
        data: personalData
      };

      return exportPackage;
    } catch (error) {
      console.error('Data access request failed:', error);
      throw new Error(`Data access request failed: ${error.message}`);
    }
  }

  /**
   * Process right to be forgotten request (Article 17)
   * @param {string} userId - User ID
   * @param {string} email - User's email for verification
   * @param {string} reason - Reason for deletion
   * @returns {Object} Deletion result
   */
  async processRightToBeForgotten(userId, email, reason) {
    try {
      // Verify user identity
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('User verification failed');
      }

      // Check if data can be deleted (legal obligations, etc.)
      const canDelete = await this.checkDeletionEligibility(userId);
      if (!canDelete.eligible) {
        throw new Error(`Deletion not allowed: ${canDelete.reason}`);
      }

      // Create deletion audit log before deletion
      await this.logGDPRAction(userId, 'data_deletion_requested', {
        requestedBy: email,
        reason: reason,
        deletionDate: new Date().toISOString()
      });

      // Perform data deletion
      const deletionResult = await this.performDataDeletion(userId);

      return {
        success: true,
        deletedData: deletionResult,
        deletionDate: new Date().toISOString(),
        auditId: deletionResult.auditId
      };
    } catch (error) {
      console.error('Right to be forgotten request failed:', error);
      throw new Error(`Data deletion failed: ${error.message}`);
    }
  }

  /**
   * Process data portability request (Article 20)
   * @param {string} userId - User ID
   * @param {string} format - Export format (json, csv, xml)
   * @returns {Object} Portable data package
   */
  async processDataPortabilityRequest(userId, format = 'json') {
    try {
      // Get structured user data
      const portableData = await this.getPortableUserData(userId);

      // Format data according to request
      let formattedData;
      switch (format.toLowerCase()) {
        case 'json':
          formattedData = JSON.stringify(portableData, null, 2);
          break;
        case 'csv':
          formattedData = this.convertToCSV(portableData);
          break;
        case 'xml':
          formattedData = this.convertToXML(portableData);
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Log portability request
      await this.logGDPRAction(userId, 'data_portability_requested', {
        format: format,
        dataSize: formattedData.length
      });

      return {
        data: formattedData,
        format: format,
        contentType: this.getContentType(format),
        filename: `user_data_${userId}_${Date.now()}.${format}`
      };
    } catch (error) {
      console.error('Data portability request failed:', error);
      throw new Error(`Data portability failed: ${error.message}`);
    }
  }

  /**
   * Process objection to processing request (Article 21)
   * @param {string} userId - User ID
   * @param {Array} processingTypes - Types of processing to object to
   * @param {string} reason - Reason for objection
   * @returns {Object} Objection result
   */
  async processObjectionToProcessing(userId, processingTypes, reason) {
    try {
      const objections = [];

      for (const processingType of processingTypes) {
        const objection = {
          user_id: userId,
          processing_type: processingType,
          objection_date: new Date().toISOString(),
          reason: reason,
          status: 'active',
          legal_basis: 'Article 21 GDPR'
        };

        const { data, error } = await this.supabase
          .from('gdpr_objections')
          .insert([objection])
          .select()
          .single();

        if (error) throw error;
        objections.push(data);

        // Update consent records to reflect objection
        await this.recordConsent(userId, processingType, false, {
          objectionBasis: 'Article 21',
          reason: reason
        });
      }

      // Log objection
      await this.logGDPRAction(userId, 'processing_objection', {
        processingTypes: processingTypes,
        reason: reason
      });

      return { success: true, objections };
    } catch (error) {
      console.error('Objection processing failed:', error);
      throw new Error(`Objection processing failed: ${error.message}`);
    }
  }

  /**
   * Anonymize user data (when deletion is not possible)
   * @param {string} userId - User ID
   * @returns {Object} Anonymization result
   */
  async anonymizeUserData(userId) {
    try {
      const anonymizedId = `anon_${crypto.randomUUID()}`;
      
      // Anonymize personal identifiers
      const anonymizationMap = {
        email: `${anonymizedId}@anonymized.local`,
        phone: '***-***-****',
        name: 'Anonymized User',
        address: 'Anonymized Address',
        ip_addresses: '0.0.0.0'
      };

      // Update user record
      await this.supabase
        .from('users')
        .update({
          ...anonymizationMap,
          anonymized: true,
          anonymization_date: new Date().toISOString(),
          original_id: userId
        })
        .eq('id', userId);

      // Log anonymization
      await this.logGDPRAction(userId, 'data_anonymized', {
        anonymizedId: anonymizedId,
        anonymizationDate: new Date().toISOString()
      });

      return { success: true, anonymizedId };
    } catch (error) {
      console.error('Data anonymization failed:', error);
      throw new Error(`Anonymization failed: ${error.message}`);
    }
  }

  /**
   * Log GDPR-related actions for audit trail
   * @param {string} userId - User ID
   * @param {string} action - Action performed
   * @param {Object} metadata - Action metadata
   */
  async logGDPRAction(userId, action, metadata = {}) {
    try {
      await this.supabase
        .from('gdpr_audit_log')
        .insert([{
          user_id: userId,
          action: action,
          timestamp: new Date().toISOString(),
          metadata: metadata,
          ip_address: metadata.ipAddress,
          user_agent: metadata.userAgent
        }]);
    } catch (error) {
      console.error('Failed to log GDPR action:', error);
    }
  }

  /**
   * Check if user data can be deleted (legal obligations check)
   * @param {string} userId - User ID
   * @returns {Object} Deletion eligibility result
   */
  async checkDeletionEligibility(userId) {
    try {
      // Check for legal obligations (tax records, etc.)
      const { data: obligations, error } = await this.supabase
        .from('legal_obligations')
        .select('*')
        .eq('user_id', userId)
        .gt('retention_until', new Date().toISOString());

      if (error) throw error;

      if (obligations && obligations.length > 0) {
        return {
          eligible: false,
          reason: 'Legal retention obligations exist',
          obligations: obligations
        };
      }

      return { eligible: true, reason: null };
    } catch (error) {
      console.error('Error checking deletion eligibility:', error);
      return { eligible: false, reason: 'Unable to verify legal obligations' };
    }
  }

  /**
   * Perform actual data deletion across all tables
   * @param {string} userId - User ID
   * @returns {Object} Deletion result
   */
  async performDataDeletion(userId) {
    const deletedTables = [];
    
    try {
      // Delete in reverse dependency order
      const tablesToDelete = [
        'user_sessions',
        'gdpr_consents',
        'audit_logs',
        'workshop_data',
        'user_mfa',
        'users'
      ];

      for (const table of tablesToDelete) {
        try {
          const { error } = await this.supabase
            .from(table)
            .delete()
            .eq('user_id', userId);

          if (!error) {
            deletedTables.push(table);
          }
        } catch (tableError) {
          console.warn(`Failed to delete from ${table}:`, tableError);
        }
      }

      return {
        success: true,
        deletedTables: deletedTables,
        auditId: crypto.randomUUID()
      };
    } catch (error) {
      console.error('Data deletion failed:', error);
      throw error;
    }
  }

  // Helper methods for data retrieval and formatting would go here
  async getUserSessions(userId) {
    const { data } = await this.supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId);
    return data || [];
  }

  async getWorkshopData(userId) {
    const { data } = await this.supabase
      .from('workshop_data')
      .select('*')
      .eq('user_id', userId);
    return data?.[0] || null;
  }

  async getAuditLogs(userId) {
    const { data } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);
    return data || [];
  }

  async getCommunicationHistory(userId) {
    const { data } = await this.supabase
      .from('communication_history')
      .select('*')
      .eq('user_id', userId);
    return data || [];
  }

  getContentType(format) {
    const types = {
      'json': 'application/json',
      'csv': 'text/csv',
      'xml': 'application/xml'
    };
    return types[format.toLowerCase()] || 'text/plain';
  }
}

export default new GDPRManager();