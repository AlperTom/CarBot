-- Supabase Production Database Setup for CarBot
-- Complete database schema for automotive workshop management platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE user_role_type AS ENUM ('customer', 'employee', 'manager', 'owner', 'admin');
CREATE TYPE subscription_status_type AS ENUM ('trial', 'active', 'past_due', 'canceled', 'paused');
CREATE TYPE plan_type AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE template_type AS ENUM ('klassische', 'moderne', 'premium', 'family', 'electric');
CREATE TYPE message_type AS ENUM ('user', 'assistant', 'system');
CREATE TYPE conversation_status AS ENUM ('active', 'closed', 'transferred');

-- Workshops table (Core entity)
CREATE TABLE workshops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type template_type DEFAULT 'klassische',
  
  -- Contact information
  owner_email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  website VARCHAR(255),
  email VARCHAR(255),
  
  -- Address
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2) DEFAULT 'DE',
  
  -- Business details
  services JSONB DEFAULT '[]',
  specializations JSONB DEFAULT '[]',
  opening_hours JSONB DEFAULT '{}',
  theme_config JSONB DEFAULT '{}',
  
  -- Subscription and billing
  subscription_id UUID,
  monthly_leads_limit INTEGER DEFAULT 100,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  
  -- Status and metadata
  active BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('german', coalesce(name, '') || ' ' || coalesce(business_name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, ''))
  ) STORED
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  plan_id plan_type NOT NULL,
  status subscription_status_type NOT NULL DEFAULT 'trial',
  
  -- Stripe integration
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  
  -- Billing
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Pricing
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client Keys table (API access)
CREATE TABLE client_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  
  -- Key details
  name VARCHAR(255) NOT NULL,
  client_key_hash VARCHAR(255) NOT NULL UNIQUE,
  prefix VARCHAR(20) NOT NULL, -- e.g., 'ck_live_', 'ck_test_'
  
  -- Permissions and restrictions
  authorized_domains JSONB DEFAULT '[]',
  rate_limit_per_minute INTEGER DEFAULT 100,
  allowed_endpoints JSONB DEFAULT '[]', -- Empty array means all endpoints
  
  -- Usage tracking
  last_used_at TIMESTAMP WITH TIME ZONE,
  total_requests BIGINT DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop Users (Employees/Staff)
CREATE TABLE workshop_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- References auth.users
  
  -- User details
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role user_role_type DEFAULT 'employee',
  
  -- Permissions
  permissions JSONB DEFAULT '{}',
  
  -- Status
  active BOOLEAN DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(workshop_id, user_id)
);

-- Chat Sessions table
CREATE TABLE chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  
  -- Session identification
  session_token VARCHAR(255) NOT NULL,
  client_key VARCHAR(255),
  visitor_id VARCHAR(255),
  
  -- Session metadata
  ip_address INET,
  user_agent TEXT,
  browser_language VARCHAR(10) DEFAULT 'de',
  country_code VARCHAR(2) DEFAULT 'DE',
  
  -- Page context
  landing_page_url TEXT,
  referrer_url TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  
  -- Session stats
  message_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Lead information
  status conversation_status DEFAULT 'active',
  lead_score INTEGER DEFAULT 0,
  converted_to_lead BOOLEAN DEFAULT false,
  lead_converted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(workshop_id, session_token)
);

-- Chat Messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  
  -- Message content
  content TEXT NOT NULL,
  message_type message_type NOT NULL,
  
  -- AI metadata
  model VARCHAR(100),
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  confidence_score DECIMAL(3,2),
  detected_intent VARCHAR(100),
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  client_key VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing Pages Templates table
CREATE TABLE landing_page_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  
  -- Template details
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  template_type template_type NOT NULL,
  
  -- Content
  content JSONB NOT NULL DEFAULT '{}',
  config JSONB NOT NULL DEFAULT '{}',
  custom_css TEXT,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords VARCHAR(500),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(workshop_id, slug)
);

-- Usage Tracking table
CREATE TABLE usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  
  -- Metric details
  metric_name VARCHAR(100) NOT NULL, -- 'conversations', 'api_calls', 'storage_mb'
  quantity INTEGER NOT NULL DEFAULT 0,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Context
  source VARCHAR(100), -- 'chat_widget', 'api', 'dashboard'
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(workshop_id, metric_name, usage_date, source)
);

-- Analytics Events table
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  
  -- Event details
  event_type VARCHAR(100) NOT NULL,
  event_category VARCHAR(100) DEFAULT 'general',
  event_data JSONB DEFAULT '{}',
  
  -- Context
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate Limiting table
CREATE TABLE client_key_rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_key_id VARCHAR(255) NOT NULL,
  
  -- Rate limiting
  requests_per_minute INTEGER DEFAULT 100,
  current_requests INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Blocking
  is_blocked BOOLEAN DEFAULT false,
  blocked_until TIMESTAMP WITH TIME ZONE,
  block_reason VARCHAR(255),
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(client_key_id)
);

-- User Sessions table (JWT session tracking)
CREATE TABLE user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  
  -- Session details
  session_token VARCHAR(500) NOT NULL,
  refresh_token_hash VARCHAR(255),
  
  -- Client information
  ip_address INET,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  
  -- Session management
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logged_out_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log table
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  user_id UUID,
  
  -- Event details
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  
  -- Change details
  old_values JSONB,
  new_values JSONB,
  details JSONB DEFAULT '{}',
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error Logs table
CREATE TABLE error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workshop_id UUID REFERENCES workshops(id) ON DELETE SET NULL,
  
  -- Error details
  error_type VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  
  -- Context
  context JSONB DEFAULT '{}',
  user_id UUID,
  session_id UUID,
  request_id UUID,
  
  -- Environment
  environment VARCHAR(20) DEFAULT 'production',
  version VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_workshops_owner_email ON workshops(owner_email);
CREATE INDEX idx_workshops_active ON workshops(active) WHERE active = true;
CREATE INDEX idx_workshops_search ON workshops USING GIN(search_vector);
CREATE INDEX idx_workshops_template_type ON workshops(template_type);

CREATE INDEX idx_subscriptions_workshop_id ON subscriptions(workshop_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

CREATE INDEX idx_client_keys_workshop_id ON client_keys(workshop_id);
CREATE INDEX idx_client_keys_hash ON client_keys(client_key_hash);
CREATE INDEX idx_client_keys_active ON client_keys(is_active) WHERE is_active = true;

CREATE INDEX idx_chat_sessions_workshop_id ON chat_sessions(workshop_id);
CREATE INDEX idx_chat_sessions_token ON chat_sessions(session_token);
CREATE INDEX idx_chat_sessions_visitor ON chat_sessions(visitor_id);
CREATE INDEX idx_chat_sessions_active ON chat_sessions(workshop_id, status) WHERE status = 'active';
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_type ON chat_messages(message_type);

CREATE INDEX idx_usage_tracking_workshop_date ON usage_tracking(workshop_id, usage_date);
CREATE INDEX idx_usage_tracking_metric ON usage_tracking(workshop_id, metric_name, usage_date);

CREATE INDEX idx_analytics_events_workshop_id ON analytics_events(workshop_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(user_id, active) WHERE active = true;
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);

CREATE INDEX idx_audit_logs_workshop_id ON audit_logs(workshop_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_keys_updated_at BEFORE UPDATE ON client_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workshop_users_updated_at BEFORE UPDATE ON workshop_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_page_templates_updated_at BEFORE UPDATE ON landing_page_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RPC functions for common operations

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id UUID,
  p_workshop_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id UUID,
  p_details JSONB DEFAULT '{}',
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO audit_logs (
    user_id,
    workshop_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_workshop_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address::INET,
    p_user_agent
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record usage
CREATE OR REPLACE FUNCTION record_usage(
  p_workshop_id UUID,
  p_metric_name VARCHAR,
  p_quantity INTEGER DEFAULT 1,
  p_source VARCHAR DEFAULT 'api'
) RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO usage_tracking (
    workshop_id,
    metric_name,
    quantity,
    usage_date,
    source
  ) VALUES (
    p_workshop_id,
    p_metric_name,
    p_quantity,
    CURRENT_DATE,
    p_source
  )
  ON CONFLICT (workshop_id, metric_name, usage_date, source)
  DO UPDATE SET 
    quantity = usage_tracking.quantity + p_quantity,
    created_at = NOW();
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get workshop usage stats
CREATE OR REPLACE FUNCTION get_workshop_usage_stats(
  p_workshop_id UUID,
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE(
  metric_name VARCHAR,
  total_quantity BIGINT,
  daily_average DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ut.metric_name,
    SUM(ut.quantity) as total_quantity,
    ROUND(SUM(ut.quantity)::DECIMAL / (p_end_date - p_start_date + 1), 2) as daily_average
  FROM usage_tracking ut
  WHERE ut.workshop_id = p_workshop_id
    AND ut.usage_date BETWEEN p_start_date AND p_end_date
  GROUP BY ut.metric_name
  ORDER BY total_quantity DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old data
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS VOID AS $$
BEGIN
  -- Delete old analytics events (keep 90 days)
  DELETE FROM analytics_events 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Delete old error logs (keep 30 days)
  DELETE FROM error_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Delete old inactive sessions (keep 7 days)
  DELETE FROM user_sessions 
  WHERE active = false 
    AND updated_at < NOW() - INTERVAL '7 days';
  
  -- Delete old ended chat sessions and messages (keep 180 days)
  DELETE FROM chat_messages 
  WHERE session_id IN (
    SELECT id FROM chat_sessions 
    WHERE status = 'closed' 
      AND ended_at < NOW() - INTERVAL '180 days'
  );
  
  DELETE FROM chat_sessions 
  WHERE status = 'closed' 
    AND ended_at < NOW() - INTERVAL '180 days';
    
  RAISE NOTICE 'Cleanup completed successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS)
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Workshop-based access control)

-- Workshops: Users can only see their own workshop
CREATE POLICY "Users can view own workshop" ON workshops
  FOR SELECT USING (
    owner_email = auth.email() OR
    id IN (
      SELECT workshop_id FROM workshop_users 
      WHERE user_id = auth.uid() AND active = true
    )
  );

CREATE POLICY "Workshop owners can update their workshop" ON workshops
  FOR UPDATE USING (owner_email = auth.email());

-- Subscriptions: Workshop-based access
CREATE POLICY "Workshop access to subscriptions" ON subscriptions
  FOR ALL USING (
    workshop_id IN (
      SELECT id FROM workshops 
      WHERE owner_email = auth.email() OR
      id IN (
        SELECT workshop_id FROM workshop_users 
        WHERE user_id = auth.uid() AND active = true
      )
    )
  );

-- Similar policies for other tables...
-- (Additional RLS policies would be implemented based on specific security requirements)

-- Insert sample data for development
INSERT INTO workshops (
  id,
  name,
  business_name,
  owner_email,
  template_type,
  phone,
  email,
  address_line1,
  city,
  postal_code,
  country,
  specializations,
  active,
  verified
) VALUES 
(
  'ws_klassische_001',
  'Klassische Autowerkstatt Müller',
  'Klassische Autowerkstatt Müller',
  'info@klassische-werkstatt.de',
  'klassische',
  '+49 30 12345678',
  'info@klassische-werkstatt.de',
  'Hauptstraße 123',
  'Berlin',
  '10115',
  'DE',
  '["general", "classic"]',
  true,
  true
),
(
  'ws_moderne_002',
  'ModernTech Autowerkstatt',
  'ModernTech Autowerkstatt',
  'info@moderntech-auto.de',
  'moderne',
  '+49 30 87654321',
  'info@moderntech-auto.de',
  'Technologiestraße 456',
  'Berlin',
  '10587',
  'DE',
  '["modern", "diagnostic"]',
  true,
  true
);

-- Insert sample client keys
INSERT INTO client_keys (
  id,
  workshop_id,
  name,
  client_key_hash,
  prefix,
  authorized_domains,
  is_active
) VALUES 
(
  uuid_generate_v4(),
  'ws_klassische_001',
  'Production Key',
  'ck_test_klassische_werkstatt_123',
  'ck_test_',
  '["localhost:3000", "klassische-werkstatt.de"]',
  true
),
(
  uuid_generate_v4(),
  'ws_moderne_002',
  'Production Key',
  'ck_test_moderne_werkstatt_456',
  'ck_test_',
  '["localhost:3000", "moderntech-auto.de"]',
  true
);

COMMIT;