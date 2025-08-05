# CarBot Database Migration Strategy
## Enterprise-Grade Database Migration and Deployment Plan

### Executive Summary

This document outlines a comprehensive migration strategy to upgrade the existing CarBot database schema to the new enterprise-grade architecture. The migration is designed to ensure zero-downtime deployment, data integrity, and compliance with German data protection regulations.

---

## 1. Pre-Migration Assessment

### 1.1 Current State Analysis

**Existing Database Structure:**
- **Primary Tables**: 25 tables with basic multi-tenancy
- **Data Volume Estimate**: 
  - Workshops: ~100-500 records
  - Leads: ~10,000-50,000 records
  - Chat Messages: ~100,000-500,000 records
  - Analytics Events: ~1M+ records

**Performance Baseline:**
```sql
-- Run these queries to establish current performance baseline
SELECT 
    schemaname,
    tablename,
    n_tup_ins + n_tup_upd + n_tup_del as total_operations,
    seq_scan,
    idx_scan,
    CASE WHEN seq_scan + idx_scan > 0 
         THEN ROUND(100.0 * idx_scan / (seq_scan + idx_scan), 2) 
         ELSE 0 END as index_usage_percent
FROM pg_stat_user_tables 
ORDER BY total_operations DESC;
```

### 1.2 Risk Assessment

**High Risk Areas:**
- Lead data migration (business critical)
- Chat message volume (performance impact)
- Subscription billing continuity
- GDPR compliance during transition

**Mitigation Strategies:**
- Blue-green deployment approach
- Comprehensive data validation
- Rollback procedures
- Real-time monitoring

---

## 2. Migration Architecture

### 2.1 Blue-Green Deployment Strategy

```
Current Production (Blue)     →     New Production (Green)
├── workshops                 →     ├── organizations
├── customers                 →     ├── workshops
├── leads                     →     ├── customers + customer_vehicles
├── chat_messages             →     ├── leads
└── ...                       →     ├── chat_sessions + chat_messages
                                    └── enhanced tables...
```

### 2.2 Migration Phases

#### Phase 1: Foundation Setup (Week 1)
- Deploy new schema to staging environment
- Set up monitoring and alerting
- Create migration scripts and validation procedures
- Establish data pipeline for real-time sync

#### Phase 2: Data Migration (Week 2)
- Historical data migration (offline)
- Real-time sync implementation
- Data validation and integrity checks
- Performance testing

#### Phase 3: Application Updates (Week 3)
- Update application code for new schema
- API endpoint modifications
- Frontend compatibility updates
- Integration testing

#### Phase 4: Cutover and Validation (Week 4)
- Production cutover
- Live traffic validation
- Performance monitoring
- Rollback readiness

---

## 3. Detailed Migration Scripts

### 3.1 Schema Migration Script

```sql
-- migration_001_foundation.sql
-- Creates new enterprise schema alongside existing schema

BEGIN;

-- Create new schema for migration
CREATE SCHEMA IF NOT EXISTS carbot_v2;

-- Set search path to new schema
SET search_path TO carbot_v2, public;

-- Execute enterprise schema (from database-enterprise-schema.sql)
\i database-enterprise-schema.sql

-- Create migration tracking table
CREATE TABLE migration_status (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'running',
    rows_migrated INTEGER DEFAULT 0,
    errors TEXT[]
);

COMMIT;
```

### 3.2 Data Migration Scripts

#### Organizations and Workshops Migration
```sql
-- migration_002_workshops.sql
BEGIN;

INSERT INTO migration_status (migration_name) VALUES ('workshops_migration');

-- Create organizations from unique workshop owners
INSERT INTO carbot_v2.organizations (
    id, name, slug, email, legal_city, legal_country, created_at
)
SELECT 
    gen_random_uuid(),
    'CarBot Organization ' || ROW_NUMBER() OVER (ORDER BY owner_email),
    'org-' || LOWER(REPLACE(owner_email, '@', '-')),
    owner_email,
    city,
    'DEU',
    MIN(created_at)
FROM public.workshops
GROUP BY owner_email, city;

-- Migrate workshops with proper organization linking
INSERT INTO carbot_v2.workshops (
    id, organization_id, owner_id, name, slug, email, phone,
    address_line1, city, postal_code, business_type,
    opening_hours, services, is_active, created_at, updated_at
)
SELECT 
    w.id,
    o.id as organization_id,
    w.owner_id,
    w.name,
    w.slug || '-v2', -- Temporary suffix during migration
    w.owner_email,
    w.phone,
    w.address,
    w.city,
    w.postal_code,
    COALESCE(w.business_type, 'independent')::workshop_business_type,
    w.opening_hours,
    w.services,
    w.is_active,
    w.created_at,
    w.updated_at
FROM public.workshops w
JOIN carbot_v2.organizations o ON o.email = w.owner_email;

UPDATE migration_status 
SET completed_at = NOW(), status = 'completed', 
    rows_migrated = (SELECT COUNT(*) FROM carbot_v2.workshops)
WHERE migration_name = 'workshops_migration';

COMMIT;
```

#### Customer Data Migration
```sql
-- migration_003_customers.sql
BEGIN;

INSERT INTO migration_status (migration_name) VALUES ('customers_migration');

-- Migrate customers with data normalization
WITH customer_names AS (
    SELECT 
        id,
        CASE 
            WHEN name ~ '^[^[:space:]]+ [^[:space:]]+' THEN
                SPLIT_PART(name, ' ', 1)
            ELSE name
        END as first_name,
        CASE 
            WHEN name ~ '^[^[:space:]]+ [^[:space:]]+' THEN
                SUBSTRING(name FROM POSITION(' ' IN name) + 1)
            ELSE NULL
        END as last_name,
        workshop_id,
        email, phone, address, city, postal_code,
        active, created_at, updated_at
    FROM public.customers
)
INSERT INTO carbot_v2.customers (
    id, workshop_id, first_name, last_name, email, phone,
    address_line1, city, postal_code, is_active,
    gdpr_consent_given, created_at, updated_at
)
SELECT 
    cn.id,
    cn.workshop_id,
    cn.first_name,
    cn.last_name,
    cn.email,
    cn.phone,
    cn.address,
    cn.city,
    cn.postal_code,
    cn.active,
    true, -- Assume existing customers have consent
    cn.created_at,
    cn.updated_at
FROM customer_names cn
WHERE EXISTS (SELECT 1 FROM carbot_v2.workshops w WHERE w.id = cn.workshop_id);

UPDATE migration_status 
SET completed_at = NOW(), status = 'completed', 
    rows_migrated = (SELECT COUNT(*) FROM carbot_v2.customers)
WHERE migration_name = 'customers_migration';

COMMIT;
```

#### Leads Migration with Enhanced Structure
```sql
-- migration_004_leads.sql
BEGIN;

INSERT INTO migration_status (migration_name) VALUES ('leads_migration');

-- Migrate leads with enhanced fields
INSERT INTO carbot_v2.leads (
    id, workshop_id, client_key, name, email, phone,
    subject, description, vehicle_info, status, priority,
    lead_score, chat_history, consent_given, consent_timestamp,
    created_at, updated_at
)
SELECT 
    l.id,
    l.workshop_id,
    l.kunde_id,
    l.name,
    l.email,
    l.telefon,
    COALESCE(l.anliegen, 'Imported from legacy system'),
    l.anliegen,
    CASE 
        WHEN l.fahrzeug IS NOT NULL AND l.fahrzeug != '' 
        THEN jsonb_build_object('description', l.fahrzeug)
        ELSE '{}'::jsonb
    END,
    CASE l.status
        WHEN 'new' THEN 'new'::lead_status
        WHEN 'contacted' THEN 'contacted'::lead_status
        WHEN 'qualified' THEN 'qualified'::lead_status
        WHEN 'converted' THEN 'won'::lead_status
        ELSE 'new'::lead_status
    END,
    CASE l.priority
        WHEN 'high' THEN 'high'::lead_priority
        WHEN 'medium' THEN 'medium'::lead_priority
        WHEN 'low' THEN 'low'::lead_priority
        ELSE 'medium'::lead_priority
    END,
    COALESCE(l.lead_score, 50),
    COALESCE(l.chatverlauf, '[]'::jsonb),
    true, -- Assume consent for existing leads
    l.timestamp,
    l.created_at,
    l.updated_at
FROM public.leads l
WHERE EXISTS (SELECT 1 FROM carbot_v2.workshops w WHERE w.id = l.workshop_id);

UPDATE migration_status 
SET completed_at = NOW(), status = 'completed', 
    rows_migrated = (SELECT COUNT(*) FROM carbot_v2.leads)
WHERE migration_name = 'leads_migration';

COMMIT;
```

### 3.3 Real-time Sync Setup

```sql
-- Create triggers for real-time data sync during migration
CREATE OR REPLACE FUNCTION sync_to_v2_schema()
RETURNS TRIGGER AS $$
BEGIN
    -- Sync workshops
    IF TG_TABLE_NAME = 'workshops' THEN
        IF TG_OP = 'INSERT' THEN
            -- Insert logic for new workshops
            PERFORM sync_workshop_insert(NEW);
        ELSIF TG_OP = 'UPDATE' THEN
            -- Update logic for modified workshops
            PERFORM sync_workshop_update(NEW);
        END IF;
    END IF;
    
    -- Sync leads
    IF TG_TABLE_NAME = 'leads' THEN
        IF TG_OP = 'INSERT' THEN
            PERFORM sync_lead_insert(NEW);
        ELSIF TG_OP = 'UPDATE' THEN
            PERFORM sync_lead_update(NEW);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply sync triggers
CREATE TRIGGER sync_workshops_to_v2
    AFTER INSERT OR UPDATE ON public.workshops
    FOR EACH ROW EXECUTE FUNCTION sync_to_v2_schema();

CREATE TRIGGER sync_leads_to_v2
    AFTER INSERT OR UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION sync_to_v2_schema();
```

---

## 4. Data Validation and Testing

### 4.1 Data Integrity Validation

```sql
-- validation_suite.sql
-- Comprehensive data validation queries

-- Check record counts match
WITH validation_counts AS (
    SELECT 
        'workshops' as table_name,
        (SELECT COUNT(*) FROM public.workshops) as old_count,
        (SELECT COUNT(*) FROM carbot_v2.workshops) as new_count
    UNION ALL
    SELECT 
        'customers',
        (SELECT COUNT(*) FROM public.customers),
        (SELECT COUNT(*) FROM carbot_v2.customers)
    UNION ALL
    SELECT 
        'leads',
        (SELECT COUNT(*) FROM public.leads),
        (SELECT COUNT(*) FROM carbot_v2.leads)
)
SELECT 
    table_name,
    old_count,
    new_count,
    CASE 
        WHEN old_count = new_count THEN '✅ Match'
        ELSE '❌ Mismatch'
    END as status
FROM validation_counts;

-- Check data quality
SELECT 
    'Email validation' as check_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE email IS NOT NULL AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') as valid_emails,
    ROUND(100.0 * COUNT(*) FILTER (WHERE email IS NOT NULL AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') / COUNT(*), 2) as quality_percentage
FROM carbot_v2.customers
WHERE email IS NOT NULL;
```

### 4.2 Performance Testing

```sql
-- performance_test.sql
-- Test query performance on new schema

-- Test lead dashboard query performance
EXPLAIN (ANALYZE, BUFFERS) 
WITH lead_metrics AS (
    SELECT 
        workshop_id,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_leads,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_leads,
        AVG(lead_score) FILTER (WHERE status = 'qualified') as avg_qualified_score
    FROM carbot_v2.leads 
    WHERE workshop_id = 'test-workshop-id'
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY workshop_id
)
SELECT * FROM lead_metrics;

-- Test appointment scheduling query
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
    a.id,
    a.scheduled_datetime,
    c.full_name,
    s.name as service_name
FROM carbot_v2.appointments a
JOIN carbot_v2.customers c ON a.customer_id = c.id
JOIN carbot_v2.appointment_services aps ON a.id = aps.appointment_id
JOIN carbot_v2.services s ON aps.service_id = s.id
WHERE a.workshop_id = 'test-workshop-id'
AND a.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY a.scheduled_datetime;
```

---

## 5. Deployment Plan

### 5.1 Pre-Deployment Checklist

- [ ] **Database Backup**: Full backup of production database
- [ ] **Schema Validation**: All new tables and indexes created successfully
- [ ] **Data Migration**: All historical data migrated and validated
- [ ] **Performance Testing**: Queries perform within acceptable limits
- [ ] **Application Testing**: All API endpoints work with new schema
- [ ] **Monitoring Setup**: Database monitoring and alerting configured
- [ ] **Rollback Plan**: Documented rollback procedures ready

### 5.2 Deployment Steps

#### Step 1: Maintenance Window Setup
```bash
# Set application to maintenance mode
curl -X POST https://api.carbot.de/admin/maintenance \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"enabled": true, "message": "System upgrade in progress"}'
```

#### Step 2: Final Data Sync
```sql
-- Perform final incremental sync
SELECT sync_final_data_migration();

-- Validate all data is current
SELECT validate_migration_completeness();
```

#### Step 3: Switch Database Schema
```sql
-- Update search path to new schema
ALTER DATABASE carbot SET search_path TO carbot_v2, public;

-- Update application database connections
-- (Handled by infrastructure automation)
```

#### Step 4: Application Deployment
```bash
# Deploy new application version
kubectl apply -f k8s/carbot-v2-deployment.yaml

# Wait for pods to be ready
kubectl rollout status deployment/carbot-api
```

#### Step 5: Validation and Monitoring
```bash
# Run post-deployment validation
curl -X GET https://api.carbot.de/health/database
curl -X GET https://api.carbot.de/health/migrations

# Monitor application metrics
# Check error rates, response times, database connections
```

### 5.3 Rollback Procedures

#### Emergency Rollback Plan
```sql
-- If issues detected, quick rollback to old schema
ALTER DATABASE carbot SET search_path TO public, carbot_v2;

-- Revert application deployment
kubectl rollout undo deployment/carbot-api

-- Restore from backup if data corruption detected
-- pg_restore --clean --no-acl --no-owner -d carbot backup_pre_migration.dump
```

---

## 6. Post-Migration Optimization

### 6.1 Performance Monitoring

```sql
-- Monitor query performance after migration
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
WHERE query LIKE '%carbot_v2%'
ORDER BY mean_time DESC
LIMIT 10;
```

### 6.2 Index Optimization

```sql
-- Identify missing indexes after migration
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'carbot_v2'
AND n_distinct > 100
AND correlation < 0.1
ORDER BY n_distinct DESC;
```

### 6.3 Cleanup Tasks

```sql
-- After successful migration (after 30 days), cleanup old schema
-- DROP SCHEMA public CASCADE; -- Only after complete validation

-- Remove migration triggers
DROP TRIGGER IF EXISTS sync_workshops_to_v2 ON public.workshops;
DROP TRIGGER IF EXISTS sync_leads_to_v2 ON public.leads;

-- Archive migration logs
CREATE TABLE migration_archive AS 
SELECT * FROM migration_status;
```

---

## 7. Compliance and Documentation

### 7.1 GDPR Compliance Verification

- [ ] **Data Retention**: Automatic cleanup procedures implemented
- [ ] **Consent Tracking**: All consent records migrated properly
- [ ] **Audit Trail**: Complete audit logging functional
- [ ] **Data Subject Rights**: GDPR request handling operational

### 7.2 Documentation Updates

- [ ] **API Documentation**: Updated for new schema
- [ ] **Database Schema**: Entity relationship diagrams updated
- [ ] **Deployment Guide**: Updated deployment procedures
- [ ] **Monitoring Playbooks**: Updated alerting and response procedures

---

## 8. Success Criteria

### 8.1 Performance Metrics
- Query response times improved by 50%
- Database size reduced by 20% through normalization
- Index usage above 90% for all critical queries

### 8.2 Reliability Metrics
- Zero data loss during migration
- Downtime less than 2 hours
- All business processes functional post-migration

### 8.3 Compliance Metrics
- 100% GDPR compliance maintained
- All audit trails preserved
- Data retention policies active

---

## Contact Information

**Database Team Lead**: Senior Database Administrator  
**Migration Manager**: Solutions Architect  
**On-Call Support**: DevOps Team  

**Emergency Contacts**:
- Database Issues: db-emergency@carbot.de
- Application Issues: app-emergency@carbot.de
- Infrastructure Issues: infra-emergency@carbot.de

---

*This migration strategy document should be reviewed and approved by all stakeholders before execution. Regular updates and communication are essential for successful migration.*