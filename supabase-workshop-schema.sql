-- CarBot Workshop System Database Schema
-- Complete schema for workshop management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workshops table (main business entities)
CREATE TABLE IF NOT EXISTS workshops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    owner_email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'DE',
    
    -- Business details
    tax_id VARCHAR(50),
    vat_number VARCHAR(50),
    opening_hours TEXT,
    services TEXT[], -- Array of service types
    specializations TEXT[], -- Car brands they specialize in
    
    -- Bot configuration
    widget_installed BOOLEAN DEFAULT FALSE,
    widget_color VARCHAR(7) DEFAULT '#0070f3',
    bot_personality TEXT DEFAULT 'professional',
    
    -- Integration status
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_connected BOOLEAN DEFAULT FALSE,
    whatsapp_connected BOOLEAN DEFAULT FALSE,
    google_connected BOOLEAN DEFAULT FALSE,
    
    -- Subscription details
    subscription_status VARCHAR(50) DEFAULT 'trial', -- trial, active, inactive, cancelled
    subscription_plan VARCHAR(50) DEFAULT 'starter', -- starter, professional, enterprise
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    
    -- GDPR compliance
    data_retention_days INTEGER DEFAULT 90,
    gdpr_compliant BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop users table (for multi-user access)
CREATE TABLE IF NOT EXISTS workshop_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee', -- owner, admin, employee
    permissions JSONB DEFAULT '{}',
    invited_by UUID,
    invited_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client keys table (for API access and website integration)
CREATE TABLE IF NOT EXISTS client_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    key_name VARCHAR(255) NOT NULL,
    client_key VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    allowed_domains TEXT[], -- Optional domain restrictions
    rate_limit_per_hour INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI usage logs table (for cost tracking)
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_key VARCHAR(255),
    workshop_id UUID REFERENCES workshops(id) ON DELETE SET NULL,
    model_name VARCHAR(100) NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost_cents INTEGER DEFAULT 0,
    response_time_ms INTEGER DEFAULT 0,
    language VARCHAR(10) DEFAULT 'de',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table (enhanced)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    client_key VARCHAR(255),
    workshop_id UUID REFERENCES workshops(id) ON DELETE SET NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead scores table (for AI lead scoring)
CREATE TABLE IF NOT EXISTS lead_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL,
    score_breakdown JSONB NOT NULL,
    classification VARCHAR(50) NOT NULL, -- Hot, Warm, Cold, Very Cold
    priority VARCHAR(50) NOT NULL, -- High, Medium, Low
    estimated_value INTEGER DEFAULT 0,
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table (enhanced)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    customer_slug VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    service_requested TEXT,
    vehicle_info TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, cancelled, completed, no_show
    language VARCHAR(10) DEFAULT 'de',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook logs table (for debugging)
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_type VARCHAR(100) NOT NULL,
    payload JSONB,
    response_status INTEGER,
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription history table (for billing)
CREATE TABLE IF NOT EXISTS subscription_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255),
    plan_name VARCHAR(100),
    status VARCHAR(50),
    amount_cents INTEGER,
    currency VARCHAR(3) DEFAULT 'EUR',
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing alerts table
CREATE TABLE IF NOT EXISTS billing_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL, -- usage_limit, payment_failed, trial_ending
    threshold_value INTEGER,
    current_value INTEGER,
    message TEXT,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing pages table (for custom workshop pages)
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}',
    is_published BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    custom_css TEXT,
    view_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workshop_id, slug)
);

-- Workshop clients table (for client management)
CREATE TABLE IF NOT EXISTS workshop_clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    workshop_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    owner_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100),
    registration_status VARCHAR(50) DEFAULT 'lead_only', -- lead_only, registered_no_confirmation, registered_no_order, registered_ordered, inactive
    subscription_plan VARCHAR(50), -- starter, professional, enterprise
    subscription_status VARCHAR(50), -- trial, active, inactive, cancelled
    last_activity_at TIMESTAMP WITH TIME ZONE,
    total_conversations INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    total_appointments INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UI customization table (for theme settings)
CREATE TABLE IF NOT EXISTS ui_customizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    client_key_id UUID REFERENCES client_keys(id) ON DELETE CASCADE,
    theme_name VARCHAR(100) DEFAULT 'default',
    primary_color VARCHAR(7) DEFAULT '#0070f3',
    secondary_color VARCHAR(7) DEFAULT '#6b7280',
    accent_color VARCHAR(7) DEFAULT '#10b981',
    font_family VARCHAR(100) DEFAULT 'Inter',
    border_radius VARCHAR(20) DEFAULT '8px',
    chat_position VARCHAR(20) DEFAULT 'bottom-right', -- bottom-right, bottom-left, top-right, top-left
    welcome_message TEXT,
    custom_css TEXT,
    logo_url VARCHAR(500),
    background_pattern VARCHAR(50) DEFAULT 'none',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_key_id)
);

-- Audit logs table (for security)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshops_owner_email ON workshops(owner_email);
CREATE INDEX IF NOT EXISTS idx_workshops_slug ON workshops(slug);
CREATE INDEX IF NOT EXISTS idx_workshops_subscription_status ON workshops(subscription_status);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_client_key ON ai_usage_logs(client_key);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_client_key ON analytics_events(client_key);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_workshop_id ON appointments(workshop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_lead_scores_lead_id ON lead_scores(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_classification ON lead_scores(classification);

-- Row Level Security (RLS) policies
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_alerts ENABLE ROW LEVEL SECURITY;

-- Workshops RLS policies
CREATE POLICY "Workshops are viewable by owner" ON workshops
    FOR SELECT USING (owner_email = auth.jwt() ->> 'email');

CREATE POLICY "Workshops are updatable by owner" ON workshops
    FOR UPDATE USING (owner_email = auth.jwt() ->> 'email');

-- Workshop users RLS policies
CREATE POLICY "Workshop users viewable by workshop members" ON workshop_users
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops WHERE owner_email = auth.jwt() ->> 'email'
        ) OR user_email = auth.jwt() ->> 'email'
    );

-- Analytics RLS policies
CREATE POLICY "Analytics viewable by workshop owner" ON analytics_events
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops WHERE owner_email = auth.jwt() ->> 'email'
        )
    );

-- Appointments RLS policies
CREATE POLICY "Appointments viewable by workshop owner" ON appointments
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops WHERE owner_email = auth.jwt() ->> 'email'
        )
    );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for automatic data cleanup (GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
    -- Clean up expired chat messages
    DELETE FROM chat_messages 
    WHERE expires_at < NOW();
    
    -- Clean up old analytics events (keep 1 year)
    DELETE FROM analytics_events 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Clean up old AI usage logs (keep 2 years for billing)
    DELETE FROM ai_usage_logs 
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    -- Clean up old webhook logs (keep 3 months)
    DELETE FROM webhook_logs 
    WHERE created_at < NOW() - INTERVAL '3 months';
END;
$$ LANGUAGE plpgsql;

-- Insert sample workshop for demo
INSERT INTO workshops (
    slug, name, owner_name, owner_email, phone, city, 
    opening_hours, services, specializations,
    subscription_status, subscription_plan
) VALUES (
    'demo-werkstatt',
    'Demo Autowerkstatt',
    'Max Mustermann',
    'demo@werkstatt.de',
    '+49 30 12345678',
    'Berlin',
    E'Mo-Fr: 8:00-18:00\nSa: 9:00-14:00',
    ARRAY['Reparatur', 'Wartung', 'TÜV', 'Inspektion'],
    ARRAY['BMW', 'Mercedes', 'Audi', 'VW'],
    'active',
    'professional'
) ON CONFLICT (owner_email) DO NOTHING;

-- Create sample data for demo
DO $$
DECLARE
    demo_workshop_id UUID;
BEGIN
    -- Get the demo workshop ID
    SELECT id INTO demo_workshop_id FROM workshops WHERE slug = 'demo-werkstatt';
    
    IF demo_workshop_id IS NOT NULL THEN
        -- Insert sample analytics events
        INSERT INTO analytics_events (event_type, client_key, workshop_id, event_data) VALUES
        ('chat_response_generated', 'demo-werkstatt', demo_workshop_id, '{"message_count": 3, "language": "de"}'),
        ('lead_captured', 'demo-werkstatt', demo_workshop_id, '{"source": "website", "service": "TÜV"}'),
        ('appointment_booked', 'demo-werkstatt', demo_workshop_id, '{"service": "Inspektion", "date": "2024-01-15"}');
        
        -- Insert sample AI usage
        INSERT INTO ai_usage_logs (client_key, workshop_id, model_name, total_tokens, cost_cents) VALUES
        ('demo-werkstatt', demo_workshop_id, 'gpt-3.5-turbo', 150, 25),
        ('demo-werkstatt', demo_workshop_id, 'gpt-3.5-turbo', 200, 35),
        ('demo-werkstatt', demo_workshop_id, 'gpt-3.5-turbo', 180, 30);
    END IF;
END $$;

-- Grant necessary permissions (adjust based on your setup)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;