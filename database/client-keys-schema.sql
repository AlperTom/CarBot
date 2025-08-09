-- CarBot Client Keys Database Schema
-- Optimized for German Automotive Workshops
-- Enterprise-grade security and GDPR compliance

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Client Keys Management Table
CREATE TABLE IF NOT EXISTS client_keys (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL, -- References workshops table
  
  -- Key information
  key_value VARCHAR(64) UNIQUE NOT NULL, -- cb_prod_32-char-hash format
  key_hash VARCHAR(255) NOT NULL, -- bcrypt hash for additional security
  
  -- Domain and naming
  domain VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL DEFAULT 'CarBot Widget',
  description TEXT,
  
  -- Status and limits
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER NOT NULL DEFAULT 10000,
  current_usage INTEGER DEFAULT 0,
  monthly_usage INTEGER DEFAULT 0,
  
  -- German automotive market specific
  automotive_workshop BOOLEAN DEFAULT true,
  german_market BOOLEAN DEFAULT true,
  gdpr_compliant BOOLEAN DEFAULT true,
  
  -- Usage tracking
  total_conversations INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Audit trail for German compliance
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID, -- Workshop admin who created the key
  
  -- JSON metadata for future features
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Domain verification
  domain_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  verified_at TIMESTAMPTZ,
  
  -- Rate limiting
  rate_limit_per_hour INTEGER DEFAULT 1000,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Security settings
  allowed_origins TEXT[], -- Array of allowed origins for CORS
  ip_whitelist INET[], -- Array of allowed IP addresses
  
  -- Package tier restrictions
  package_tier VARCHAR(20) DEFAULT 'basic', -- basic, premium, enterprise
  features_enabled JSONB DEFAULT '{"chat": true, "analytics": true}'::jsonb,
  
  -- Expiration
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
  auto_renewal BOOLEAN DEFAULT true
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_client_keys_workshop_id ON client_keys(workshop_id);
CREATE INDEX IF NOT EXISTS idx_client_keys_domain ON client_keys(domain);
CREATE INDEX IF NOT EXISTS idx_client_keys_active ON client_keys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_client_keys_key_value ON client_keys(key_value);
CREATE INDEX IF NOT EXISTS idx_client_keys_created_at ON client_keys(created_at);
CREATE INDEX IF NOT EXISTS idx_client_keys_last_used ON client_keys(last_used_at);
CREATE INDEX IF NOT EXISTS idx_client_keys_automotive ON client_keys(automotive_workshop) WHERE automotive_workshop = true;
CREATE INDEX IF NOT EXISTS idx_client_keys_german ON client_keys(german_market) WHERE german_market = true;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_client_keys_workshop_active ON client_keys(workshop_id, is_active);
CREATE INDEX IF NOT EXISTS idx_client_keys_workshop_domain ON client_keys(workshop_id, domain);
CREATE INDEX IF NOT EXISTS idx_client_keys_usage_tracking ON client_keys(workshop_id, current_usage, usage_limit);

-- Full-text search index for client key names and descriptions
CREATE INDEX IF NOT EXISTS idx_client_keys_search ON client_keys 
  USING gin(to_tsvector('german', name || ' ' || COALESCE(description, '')));

-- Constraints
ALTER TABLE client_keys ADD CONSTRAINT chk_client_keys_usage_positive 
  CHECK (current_usage >= 0 AND usage_limit > 0);

ALTER TABLE client_keys ADD CONSTRAINT chk_client_keys_domain_format 
  CHECK (domain ~ '^[a-zA-Z0-9][a-zA-Z0-9\-\.]*[a-zA-Z0-9]$');

ALTER TABLE client_keys ADD CONSTRAINT chk_client_keys_package_tier 
  CHECK (package_tier IN ('basic', 'premium', 'enterprise'));

-- Unique constraint to prevent duplicate domains per workshop (can be relaxed if needed)
-- ALTER TABLE client_keys ADD CONSTRAINT uq_client_keys_workshop_domain 
--   UNIQUE (workshop_id, domain);

-- Client Key Usage Analytics Table
CREATE TABLE IF NOT EXISTS client_key_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_key_id UUID NOT NULL REFERENCES client_keys(id) ON DELETE CASCADE,
  
  -- Analytics data
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  hour_of_day INTEGER CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  
  -- Usage metrics
  requests_count INTEGER DEFAULT 0,
  conversations_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  
  -- Performance metrics
  avg_response_time_ms INTEGER,
  error_rate_percent DECIMAL(5,2) DEFAULT 0.00,
  
  -- Automotive specific metrics
  service_inquiries INTEGER DEFAULT 0,
  appointment_requests INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  
  -- German market metrics
  german_language_usage INTEGER DEFAULT 0,
  gdpr_consents INTEGER DEFAULT 0,
  
  -- Metadata
  user_agents JSONB DEFAULT '[]'::jsonb,
  referrers JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate analytics per key per hour
  CONSTRAINT uq_analytics_key_date_hour UNIQUE (client_key_id, date, hour_of_day)
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_client_key ON client_key_analytics(client_key_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON client_key_analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_key_date ON client_key_analytics(client_key_id, date);

-- Client Key Rate Limiting Table
CREATE TABLE IF NOT EXISTS client_key_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_key_id UUID NOT NULL REFERENCES client_keys(id) ON DELETE CASCADE,
  
  -- Rate limiting windows
  window_start TIMESTAMPTZ NOT NULL,
  window_size_minutes INTEGER NOT NULL DEFAULT 60, -- 1 hour window
  
  -- Current counts
  request_count INTEGER DEFAULT 0,
  conversation_count INTEGER DEFAULT 0,
  
  -- Limits
  max_requests INTEGER NOT NULL,
  max_conversations INTEGER NOT NULL,
  
  -- Status
  is_blocked BOOLEAN DEFAULT false,
  blocked_until TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint per key per window
  CONSTRAINT uq_rate_limit_key_window UNIQUE (client_key_id, window_start, window_size_minutes)
);

-- Index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_window ON client_key_rate_limits(client_key_id, window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limits_active ON client_key_rate_limits(is_blocked, blocked_until);

-- Functions and Triggers

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on client_keys
DROP TRIGGER IF EXISTS trigger_update_client_keys_updated_at ON client_keys;
CREATE TRIGGER trigger_update_client_keys_updated_at
    BEFORE UPDATE ON client_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment usage counters
CREATE OR REPLACE FUNCTION increment_client_key_usage(
    p_client_key_id UUID,
    p_increment_amount INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
    current_usage_count INTEGER;
    usage_limit_count INTEGER;
BEGIN
    -- Get current usage and limit
    SELECT current_usage, usage_limit 
    INTO current_usage_count, usage_limit_count
    FROM client_keys 
    WHERE id = p_client_key_id AND is_active = true;
    
    -- Check if key exists and is active
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if incrementing would exceed limit
    IF (current_usage_count + p_increment_amount) > usage_limit_count THEN
        RETURN FALSE;
    END IF;
    
    -- Increment usage and update last_used_at
    UPDATE client_keys 
    SET 
        current_usage = current_usage + p_increment_amount,
        last_used_at = NOW()
    WHERE id = p_client_key_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly usage (to be called by cron job)
CREATE OR REPLACE FUNCTION reset_monthly_usage() 
RETURNS INTEGER AS $$
DECLARE
    reset_count INTEGER;
BEGIN
    UPDATE client_keys 
    SET 
        monthly_usage = 0,
        updated_at = NOW()
    WHERE monthly_usage > 0;
    
    GET DIAGNOSTICS reset_count = ROW_COUNT;
    RETURN reset_count;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (German automotive workshops)
INSERT INTO client_keys (
    workshop_id, 
    key_value, 
    key_hash, 
    domain, 
    name, 
    description,
    automotive_workshop,
    german_market,
    package_tier
) VALUES 
(
    uuid_generate_v4(),
    'cb_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    '$2b$12$encrypted_hash_here',
    'musterwerkstatt-berlin.de',
    'Musterwerkstatt Berlin - Hauptseite',
    'CarBot Widget für die Hauptwebsite der Musterwerkstatt in Berlin',
    true,
    true,
    'premium'
),
(
    uuid_generate_v4(),
    'cb_prod_b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
    '$2b$12$another_encrypted_hash',
    'auto-service-münchen.de',
    'Auto Service München',
    'Premium CarBot für Münchener Autowerkstatt',
    true,
    true,
    'enterprise'
);

-- Comments for documentation
COMMENT ON TABLE client_keys IS 'CarBot client key management for German automotive workshops';
COMMENT ON COLUMN client_keys.key_value IS 'Unique client key in format: cb_prod_32-char-hash';
COMMENT ON COLUMN client_keys.automotive_workshop IS 'Flag indicating this is for an automotive workshop';
COMMENT ON COLUMN client_keys.german_market IS 'Flag indicating German market compliance';
COMMENT ON COLUMN client_keys.gdpr_compliant IS 'GDPR compliance status for German data protection';

-- Grant permissions (adjust as needed for your user roles)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON client_keys TO carbot_api_user;
-- GRANT SELECT, INSERT ON client_key_analytics TO carbot_api_user;
-- GRANT EXECUTE ON FUNCTION increment_client_key_usage TO carbot_api_user;