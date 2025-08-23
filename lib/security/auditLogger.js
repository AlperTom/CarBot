import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Comprehensive Audit Logging System
 * Tracks all security-relevant events with tamper-proof logging
 */
export class AuditLogger {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Event severity levels
    this.SEVERITY = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical'
    };

    // Event categories
    this.CATEGORIES = {
      AUTH: 'authentication',
      AUTHZ: 'authorization',
      DATA: 'data_access',
      SECURITY: 'security_event',
      SYSTEM: 'system_event',
      PRIVACY: 'privacy_event',
      COMPLIANCE: 'compliance_event'
    };
  }

  /**
   * Log a security event with comprehensive details
   * @param {Object} eventData - Event data object
   * @returns {Object} Log result with event ID
   */
  async logEvent(eventData) {
    try {
      const eventId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      // Create comprehensive audit record
      const auditRecord = {
        event_id: eventId,
        timestamp: timestamp,
        event_type: eventData.eventType,
        category: eventData.category || this.CATEGORIES.SECURITY,
        severity: eventData.severity || this.SEVERITY.MEDIUM,
        user_id: eventData.userId || null,
        session_id: eventData.sessionId || null,
        ip_address: eventData.ipAddress || null,
        user_agent: eventData.userAgent || null,
        resource_type: eventData.resourceType || null,
        resource_id: eventData.resourceId || null,
        action: eventData.action,
        outcome: eventData.outcome || 'unknown',
        details: eventData.details || {},
        risk_score: this.calculateRiskScore(eventData),
        geolocation: eventData.geolocation || null,
        correlation_id: eventData.correlationId || null,
        checksum: null // Will be calculated below
      };

      // Calculate tamper-proof checksum
      auditRecord.checksum = this.calculateChecksum(auditRecord);

      // Store in primary audit log
      const { data, error } = await this.supabase
        .from('audit_logs')
        .insert([auditRecord])
        .select()
        .single();

      if (error) throw error;

      // Store critical events in immutable log
      if ([this.SEVERITY.HIGH, this.SEVERITY.CRITICAL].includes(auditRecord.severity)) {
        await this.storeInImmutableLog(auditRecord);
      }

      // Send real-time alerts for critical events
      if (auditRecord.severity === this.SEVERITY.CRITICAL) {
        await this.sendSecurityAlert(auditRecord);
      }

      return {
        success: true,
        eventId: eventId,
        severity: auditRecord.severity,
        riskScore: auditRecord.risk_score
      };
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Critical: never fail silently for audit logs
      await this.logSystemError('audit_log_failure', error);
      throw new Error(`Audit logging failed: ${error.message}`);
    }
  }

  /**
   * Log authentication events
   * @param {Object} authEvent - Authentication event data
   */
  async logAuthEvent(authEvent) {
    const eventData = {
      ...authEvent,
      category: this.CATEGORIES.AUTH,
      eventType: `auth_${authEvent.action}`,
      severity: authEvent.outcome === 'success' ? this.SEVERITY.LOW : this.SEVERITY.MEDIUM
    };

    // Increase severity for multiple failed attempts
    if (authEvent.action === 'login' && authEvent.outcome === 'failed') {
      const recentFailures = await this.getRecentFailedLogins(authEvent.identifier);
      if (recentFailures >= 3) {
        eventData.severity = this.SEVERITY.HIGH;
        eventData.details.suspicious_activity = true;
        eventData.details.recent_failures = recentFailures;
      }
    }

    return await this.logEvent(eventData);
  }

  /**
   * Log data access events
   * @param {Object} accessEvent - Data access event
   */
  async logDataAccess(accessEvent) {
    const eventData = {
      ...accessEvent,
      category: this.CATEGORIES.DATA,
      eventType: `data_${accessEvent.action}`,
      severity: this.determineSeverityByDataSensitivity(accessEvent.resourceType)
    };

    // Flag bulk data access as suspicious
    if (accessEvent.details?.recordCount > 100) {
      eventData.severity = this.SEVERITY.HIGH;
      eventData.details.bulk_access = true;
    }

    return await this.logEvent(eventData);
  }

  /**
   * Log GDPR compliance events
   * @param {Object} complianceEvent - GDPR compliance event
   */
  async logComplianceEvent(complianceEvent) {
    const eventData = {
      ...complianceEvent,
      category: this.CATEGORIES.COMPLIANCE,
      eventType: `gdpr_${complianceEvent.action}`,
      severity: this.SEVERITY.MEDIUM
    };

    // Data deletion requests are critical
    if (complianceEvent.action === 'data_deletion') {
      eventData.severity = this.SEVERITY.HIGH;
    }

    return await this.logEvent(eventData);
  }

  /**
   * Log security events (rate limiting, suspicious activity, etc.)
   * @param {Object} securityEvent - Security event data
   */
  async logSecurityEvent(securityEvent) {
    const eventData = {
      ...securityEvent,
      category: this.CATEGORIES.SECURITY,
      severity: securityEvent.severity || this.SEVERITY.MEDIUM
    };

    return await this.logEvent(eventData);
  }

  /**
   * Log system events (startup, shutdown, errors)
   * @param {Object} systemEvent - System event data
   */
  async logSystemEvent(systemEvent) {
    const eventData = {
      ...systemEvent,
      category: this.CATEGORIES.SYSTEM,
      severity: systemEvent.severity || this.SEVERITY.LOW
    };

    return await this.logEvent(eventData);
  }

  /**
   * Generate audit trail for a specific user
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date for audit trail
   * @param {Date} endDate - End date for audit trail
   * @returns {Array} Audit trail events
   */
  async generateAuditTrail(userId, startDate, endDate) {
    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Verify checksums for tamper detection
      const verifiedEvents = data.map(event => ({
        ...event,
        tamper_detected: !this.verifyChecksum(event)
      }));

      return {
        userId: userId,
        period: { start: startDate, end: endDate },
        eventCount: verifiedEvents.length,
        events: verifiedEvents,
        tamperedEvents: verifiedEvents.filter(e => e.tamper_detected).length
      };
    } catch (error) {
      console.error('Failed to generate audit trail:', error);
      throw new Error(`Audit trail generation failed: ${error.message}`);
    }
  }

  /**
   * Search audit logs with advanced filtering
   * @param {Object} filters - Search filters
   * @returns {Array} Matching audit events
   */
  async searchAuditLogs(filters) {
    try {
      let query = this.supabase
        .from('audit_logs')
        .select('*');

      // Apply filters
      if (filters.userId) query = query.eq('user_id', filters.userId);
      if (filters.eventType) query = query.eq('event_type', filters.eventType);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.severity) query = query.eq('severity', filters.severity);
      if (filters.startDate) query = query.gte('timestamp', filters.startDate);
      if (filters.endDate) query = query.lte('timestamp', filters.endDate);
      if (filters.ipAddress) query = query.eq('ip_address', filters.ipAddress);
      if (filters.outcome) query = query.eq('outcome', filters.outcome);

      // Risk score filtering
      if (filters.minRiskScore) query = query.gte('risk_score', filters.minRiskScore);
      if (filters.maxRiskScore) query = query.lte('risk_score', filters.maxRiskScore);

      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .limit(filters.limit || 1000);

      if (error) throw error;

      return {
        filters: filters,
        resultCount: data.length,
        events: data
      };
    } catch (error) {
      console.error('Audit log search failed:', error);
      throw new Error(`Audit log search failed: ${error.message}`);
    }
  }

  /**
   * Generate security dashboard metrics
   * @param {number} days - Number of days to analyze
   * @returns {Object} Security metrics
   */
  async generateSecurityMetrics(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString());

      if (error) throw error;

      const metrics = {
        totalEvents: data.length,
        eventsByCategory: {},
        eventsBySeverity: {},
        eventsByOutcome: {},
        topUsers: {},
        topIPs: {},
        riskTrends: [],
        suspiciousActivity: []
      };

      // Calculate metrics
      data.forEach(event => {
        // By category
        metrics.eventsByCategory[event.category] = 
          (metrics.eventsByCategory[event.category] || 0) + 1;

        // By severity
        metrics.eventsBySeverity[event.severity] = 
          (metrics.eventsBySeverity[event.severity] || 0) + 1;

        // By outcome
        metrics.eventsByOutcome[event.outcome] = 
          (metrics.eventsByOutcome[event.outcome] || 0) + 1;

        // Top users
        if (event.user_id) {
          metrics.topUsers[event.user_id] = 
            (metrics.topUsers[event.user_id] || 0) + 1;
        }

        // Top IPs
        if (event.ip_address) {
          metrics.topIPs[event.ip_address] = 
            (metrics.topIPs[event.ip_address] || 0) + 1;
        }

        // Suspicious activity
        if (event.risk_score >= 7 || event.severity === this.SEVERITY.CRITICAL) {
          metrics.suspiciousActivity.push(event);
        }
      });

      return metrics;
    } catch (error) {
      console.error('Security metrics generation failed:', error);
      throw new Error(`Security metrics generation failed: ${error.message}`);
    }
  }

  /**
   * Calculate risk score for an event
   * @param {Object} eventData - Event data
   * @returns {number} Risk score (1-10)
   */
  calculateRiskScore(eventData) {
    let score = 1;

    // Base score by severity
    const severityScores = {
      [this.SEVERITY.LOW]: 2,
      [this.SEVERITY.MEDIUM]: 5,
      [this.SEVERITY.HIGH]: 8,
      [this.SEVERITY.CRITICAL]: 10
    };
    score = severityScores[eventData.severity] || 1;

    // Adjust for failed outcomes
    if (eventData.outcome === 'failed' || eventData.outcome === 'denied') {
      score += 2;
    }

    // Adjust for sensitive data access
    const sensitiveResources = ['user_data', 'workshop_data', 'financial_data'];
    if (sensitiveResources.includes(eventData.resourceType)) {
      score += 2;
    }

    // Adjust for suspicious patterns
    if (eventData.details?.suspicious_activity) {
      score += 3;
    }

    return Math.min(10, Math.max(1, score));
  }

  /**
   * Calculate tamper-proof checksum for audit record
   * @param {Object} record - Audit record
   * @returns {string} SHA-256 checksum
   */
  calculateChecksum(record) {
    // Create a copy without the checksum field
    const recordCopy = { ...record };
    delete recordCopy.checksum;
    
    // Sort keys for consistent hashing
    const sortedKeys = Object.keys(recordCopy).sort();
    const dataString = sortedKeys.map(key => `${key}:${JSON.stringify(recordCopy[key])}`).join('|');
    
    return crypto.createHash('sha256')
      .update(dataString + process.env.AUDIT_SALT)
      .digest('hex');
  }

  /**
   * Verify checksum to detect tampering
   * @param {Object} record - Audit record to verify
   * @returns {boolean} True if checksum is valid
   */
  verifyChecksum(record) {
    const storedChecksum = record.checksum;
    const calculatedChecksum = this.calculateChecksum(record);
    return storedChecksum === calculatedChecksum;
  }

  /**
   * Store critical events in immutable log
   * @param {Object} auditRecord - Audit record
   */
  async storeInImmutableLog(auditRecord) {
    try {
      // In production, this would write to an immutable storage system
      // For now, we'll store in a separate table with additional protection
      await this.supabase
        .from('immutable_audit_logs')
        .insert([{
          ...auditRecord,
          stored_at: new Date().toISOString(),
          immutable_hash: crypto.createHash('sha256').update(JSON.stringify(auditRecord)).digest('hex')
        }]);
    } catch (error) {
      console.error('Failed to store in immutable log:', error);
    }
  }

  /**
   * Send security alert for critical events
   * @param {Object} auditRecord - Critical audit record
   */
  async sendSecurityAlert(auditRecord) {
    try {
      // In production, this would send alerts via email, SMS, or incident management system
      console.warn('CRITICAL SECURITY EVENT:', {
        eventId: auditRecord.event_id,
        eventType: auditRecord.event_type,
        userId: auditRecord.user_id,
        ipAddress: auditRecord.ip_address,
        riskScore: auditRecord.risk_score,
        timestamp: auditRecord.timestamp
      });

      // Store alert in alerts table
      await this.supabase
        .from('security_alerts')
        .insert([{
          alert_id: crypto.randomUUID(),
          event_id: auditRecord.event_id,
          severity: auditRecord.severity,
          alert_type: 'security_event',
          message: `Critical security event: ${auditRecord.event_type}`,
          created_at: new Date().toISOString(),
          acknowledged: false
        }]);
    } catch (error) {
      console.error('Failed to send security alert:', error);
    }
  }

  // Helper methods
  async getRecentFailedLogins(identifier) {
    const since = new Date();
    since.setMinutes(since.getMinutes() - 15); // Last 15 minutes

    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('event_id')
      .eq('event_type', 'auth_login')
      .eq('outcome', 'failed')
      .or(`user_id.eq.${identifier},ip_address.eq.${identifier}`)
      .gte('timestamp', since.toISOString());

    return error ? 0 : data.length;
  }

  determineSeverityByDataSensitivity(resourceType) {
    const highSensitivity = ['user_data', 'workshop_data', 'financial_data', 'personal_data'];
    const mediumSensitivity = ['session_data', 'activity_logs', 'preferences'];
    
    if (highSensitivity.includes(resourceType)) return this.SEVERITY.MEDIUM;
    if (mediumSensitivity.includes(resourceType)) return this.SEVERITY.LOW;
    return this.SEVERITY.LOW;
  }

  async logSystemError(eventType, error) {
    try {
      await this.supabase
        .from('system_error_logs')
        .insert([{
          error_id: crypto.randomUUID(),
          event_type: eventType,
          error_message: error.message,
          error_stack: error.stack,
          timestamp: new Date().toISOString()
        }]);
    } catch (logError) {
      console.error('Failed to log system error:', logError);
    }
  }
}

export default new AuditLogger();