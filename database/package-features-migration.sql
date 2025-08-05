-- Package Features Migration for CarBot
-- Adds necessary tables and columns for package-based feature system
-- Run this after the main enterprise schema

-- =============================================
-- API KEYS MANAGEMENT
-- =============================================

-- API keys table for Professional/Enterprise plans
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Key identification and security
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of the key
    key_prefix VARCHAR(20) NOT NULL, -- First part of key for display (cb_live_xxx...)
    
    -- Access control
    rate_limit_per_minute INTEGER DEFAULT 60,
    allowed_origins TEXT[], -- CORS origins
    is_active BOOLEAN DEFAULT true,
    
    -- Usage tracking
    last_used_at TIMESTAMPTZ,
    total_requests INTEGER DEFAULT 0,
    
    -- Key lifecycle
    expires_at TIMESTAMPTZ,
    deactivated_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_rate_limit CHECK (rate_limit_per_minute > 0 AND rate_limit_per_minute <= 10000),
    CONSTRAINT api_key_name_workshop_unique UNIQUE (workshop_id, name)
);

-- API key usage statistics
CREATE TABLE IF NOT EXISTS api_key_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    
    -- Usage tracking
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    requests INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    bytes_transferred BIGINT DEFAULT 0,
    
    -- Response times (in milliseconds)
    avg_response_time INTEGER,
    max_response_time INTEGER,
    
    -- Metadata
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(api_key_id, usage_date)
);

-- =============================================
-- BILLING EVENTS TABLE
-- =============================================

-- Billing events for usage warnings and notifications
CREATE TABLE IF NOT EXISTS billing_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Event details
    event_type VARCHAR(50) NOT NULL, -- usage_warning, limit_exceeded, payment_failed, etc.
    event_data JSONB DEFAULT '{}',
    
    -- Status tracking
    is_processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for efficient queries
    INDEX idx_billing_events_workshop_type (workshop_id, event_type),
    INDEX idx_billing_events_created (created_at),
    INDEX idx_billing_events_unprocessed (is_processed) WHERE is_processed = false
);

-- =============================================
-- UPDATE EXISTING TABLES
-- =============================================

-- Add subscription plan to workshops table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workshops' AND column_name = 'subscription_plan') THEN
        ALTER TABLE workshops ADD COLUMN subscription_plan VARCHAR(50) DEFAULT 'basic';
    END IF;
END $$;

-- Add package-specific limits to workshops
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workshops' AND column_name = 'monthly_leads_limit') THEN
        ALTER TABLE workshops ADD COLUMN monthly_leads_limit INTEGER DEFAULT 100;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workshops' AND column_name = 'api_calls_limit') THEN
        ALTER TABLE workshops ADD COLUMN api_calls_limit INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add workshop_id to leads table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'leads' AND column_name = 'workshop_id') THEN
        ALTER TABLE leads ADD COLUMN workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE;
        
        -- Populate workshop_id from kunde_id (client key)
        UPDATE leads SET workshop_id = (
            SELECT w.id FROM workshops w WHERE w.slug = leads.kunde_id
        ) WHERE workshop_id IS NULL;
    END IF;
END $$;

-- =============================================
-- PACKAGE-SPECIFIC SUBSCRIPTION PLANS
-- =============================================

-- Insert German package plans if they don't exist
INSERT INTO subscription_plans (id, name, description, monthly_price_cents, annual_price_cents, features, limits, trial_period_days) 
VALUES 
('basic', 'Basic', 'Perfekt für kleine Werkstätten - Bis zu 100 Leads/Monat', 2900, 29000, 
 '["Bis zu 100 Leads/Monat", "E-Mail Support", "Basis-Dashboard", "DSGVO-konforme Datenspeicherung", "Mobile App Zugang"]',
 '{"monthlyLeads": 100, "users": 1, "apiCalls": 0, "storageGB": 1, "integrations": 1}', 14),
 
('professional', 'Professional', 'Ideal für wachsende Betriebe - Unbegrenzte Leads', 7900, 79000,
 '["Unbegrenzte Leads", "Telefon Support", "Erweiterte Analysen", "API-Zugang", "Individuelle Anpassungen", "WhatsApp Integration", "Multi-Location Support"]',
 '{"monthlyLeads": -1, "users": 5, "apiCalls": 10000, "storageGB": 10, "integrations": 10}', 14),
 
('enterprise', 'Enterprise Individual', 'Maßgeschneiderte Lösungen für große Werkstattketten', NULL, NULL,
 '["Unbegrenzte Leads", "Persönlicher Support", "Custom Integrationen", "White-Label Lösung", "API-Zugang", "Erweiterte Sicherheitsfeatures", "Compliance-Reporting", "Schulungen & Onboarding"]',
 '{"monthlyLeads": -1, "users": -1, "apiCalls": -1, "storageGB": -1, "integrations": -1}', 30)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    monthly_price_cents = EXCLUDED.monthly_price_cents,
    annual_price_cents = EXCLUDED.annual_price_cents,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits,
    updated_at = NOW();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- API keys indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_workshop_id ON api_keys(workshop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_active ON api_keys(workshop_id, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- API key usage indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_key_usage_key_date ON api_key_usage(api_key_id, usage_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_key_usage_date ON api_key_usage(usage_date);

-- Usage tracking indexes (if not exists from main schema)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_tracking_workshop_metric ON usage_tracking(workshop_id, metric_name, usage_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_tracking_billing_period ON usage_tracking(workshop_id, billing_period_start, billing_period_end);

-- =============================================
-- TRIGGERS FOR AUTOMATION
-- =============================================

-- Update API key updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_key_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW EXECUTE FUNCTION update_api_key_updated_at();

-- Automatically update total_requests on API key usage
CREATE OR REPLACE FUNCTION update_api_key_total_requests()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total requests counter
    UPDATE api_keys 
    SET 
        total_requests = total_requests + NEW.requests,
        last_used_at = CASE 
            WHEN NEW.requests > 0 THEN NOW() 
            ELSE last_used_at 
        END
    WHERE id = NEW.api_key_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_key_totals 
    AFTER INSERT OR UPDATE ON api_key_usage 
    FOR EACH ROW EXECUTE FUNCTION update_api_key_total_requests();

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to get current usage for a workshop
CREATE OR REPLACE FUNCTION get_workshop_current_usage(
    p_workshop_id UUID,
    p_metric_name VARCHAR DEFAULT 'leads'
)
RETURNS INTEGER AS $$
DECLARE
    current_usage INTEGER;
    period_start DATE;
    period_end DATE;
BEGIN
    -- Get current billing period
    SELECT 
        COALESCE(current_period_start::DATE, DATE_TRUNC('month', CURRENT_DATE)::DATE),
        COALESCE(current_period_end::DATE, (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE)
    INTO period_start, period_end
    FROM workshops 
    WHERE id = p_workshop_id;
    
    -- Calculate current usage
    SELECT COALESCE(SUM(quantity), 0)
    INTO current_usage
    FROM usage_tracking
    WHERE workshop_id = p_workshop_id
      AND metric_name = p_metric_name
      AND usage_date >= period_start
      AND usage_date <= period_end;
    
    RETURN current_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to check if workshop can perform action based on limits
CREATE OR REPLACE FUNCTION check_workshop_limit(
    p_workshop_id UUID,
    p_metric_name VARCHAR,
    p_requested_quantity INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
    current_usage INTEGER;
    limit_value INTEGER;
    package_name VARCHAR;
    result JSONB;
BEGIN
    -- Get workshop package and limits
    SELECT 
        CASE 
            WHEN s.plan_id IS NOT NULL THEN s.plan_id
            ELSE COALESCE(w.subscription_plan, 'basic')
        END,
        CASE 
            WHEN p_metric_name = 'leads' THEN COALESCE(w.monthly_leads_limit, 100)
            WHEN p_metric_name = 'api_calls' THEN COALESCE(w.api_calls_limit, 0)
            ELSE 100
        END
    INTO package_name, limit_value
    FROM workshops w
    LEFT JOIN subscriptions s ON s.workshop_id = w.id AND s.status = 'active'
    WHERE w.id = p_workshop_id;
    
    -- Get current usage
    current_usage := get_workshop_current_usage(p_workshop_id, p_metric_name);
    
    -- Build result
    result := jsonb_build_object(
        'allowed', CASE 
            WHEN limit_value = -1 THEN true  -- Unlimited
            WHEN (current_usage + p_requested_quantity) <= limit_value THEN true
            ELSE false
        END,
        'current_usage', current_usage,
        'limit', limit_value,
        'remaining', CASE 
            WHEN limit_value = -1 THEN -1
            ELSE GREATEST(0, limit_value - current_usage)
        END,
        'package', package_name,
        'unlimited', limit_value = -1
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample workshop with basic plan for testing
INSERT INTO workshops (
    id,
    name,
    slug,
    email,
    subscription_plan,
    monthly_leads_limit,
    api_calls_limit,
    current_period_start,
    current_period_end
) VALUES (
    gen_random_uuid(),
    'Test Werkstatt Basic',
    'test-basic',
    'test@example.com',
    'basic',
    100,
    0,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 month'
) ON CONFLICT (slug) DO NOTHING;

-- Success message
SELECT 'Package Features Migration completed successfully! 🚀' as message,
       'API keys, billing events, and usage tracking are now ready' as status,
       'German pricing tiers: Basic (29€), Professional (79€), Enterprise (Individual)' as packages;