-- CarBot Lead Management System Database Schema
-- This file contains the complete database schema for lead capture and management

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table matching the JSON specification
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    kunde_id VARCHAR(50) UNIQUE NOT NULL, -- Unique customer identifier
    name VARCHAR(255) NOT NULL,
    telefon VARCHAR(50) NOT NULL,
    anliegen TEXT NOT NULL, -- Customer inquiry/request
    fahrzeug JSONB, -- Vehicle information stored as JSON
    chatverlauf JSONB NOT NULL DEFAULT '[]'::jsonb, -- Chat history as JSON array
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Additional fields for lead management
    status VARCHAR(50) DEFAULT 'new' NOT NULL, -- new, contacted, qualified, converted, closed
    priority VARCHAR(20) DEFAULT 'medium' NOT NULL, -- high, medium, low
    assigned_to VARCHAR(255), -- Workshop or agent assignment
    source VARCHAR(100) DEFAULT 'chatbot' NOT NULL, -- chatbot, website, phone, etc.
    
    -- GDPR and data retention fields
    consent_given BOOLEAN DEFAULT false NOT NULL,
    consent_timestamp TIMESTAMPTZ,
    data_retention_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days') NOT NULL,
    
    -- Follow-up tracking
    last_contact TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    follow_up_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create webhook_configs table for n8n integration
CREATE TABLE IF NOT EXISTS webhook_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL, -- Array of events to trigger webhook
    active BOOLEAN DEFAULT true NOT NULL,
    secret_key VARCHAR(255), -- For webhook signature verification
    headers JSONB DEFAULT '{}'::jsonb, -- Custom headers
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create webhook_logs table for tracking webhook deliveries
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_config_id UUID REFERENCES webhook_configs(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    attempted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    succeeded BOOLEAN DEFAULT false NOT NULL
);

-- Create follow_up_tasks table for automated follow-ups
CREATE TABLE IF NOT EXISTS follow_up_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    task_type VARCHAR(100) NOT NULL, -- email, call, sms, etc.
    scheduled_for TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ,
    template_name VARCHAR(255),
    custom_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create email_notifications table for workshop notifications
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, sent, failed
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_kunde_id ON leads(kunde_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_timestamp ON leads(timestamp);
CREATE INDEX IF NOT EXISTS idx_leads_data_retention ON leads(data_retention_until);
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up ON leads(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_lead_id ON webhook_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_lead_id ON follow_up_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_scheduled ON follow_up_tasks(scheduled_for);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhook_configs_updated_at BEFORE UPDATE ON webhook_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically clean up old data (90-day retention)
CREATE OR REPLACE FUNCTION cleanup_old_leads()
RETURNS void AS $$
BEGIN
    -- Delete leads that have exceeded their retention period
    DELETE FROM leads 
    WHERE data_retention_until < NOW()
    AND consent_given = false; -- Only delete if no explicit consent given
    
    -- Clean up orphaned webhook logs older than 30 days
    DELETE FROM webhook_logs 
    WHERE attempted_at < NOW() - INTERVAL '30 days';
    
    -- Clean up completed follow-up tasks older than 30 days
    DELETE FROM follow_up_tasks 
    WHERE completed = true 
    AND completed_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old email notifications (sent or failed) older than 30 days
    DELETE FROM email_notifications 
    WHERE status IN ('sent', 'failed') 
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup daily (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-leads', '0 2 * * *', 'SELECT cleanup_old_leads();');

-- Insert default webhook config for n8n
INSERT INTO webhook_configs (name, url, events, active) 
VALUES (
    'n8n Default Webhook',
    'https://your-n8n-instance.com/webhook/carbot-leads',
    ARRAY['lead_created', 'lead_updated', 'lead_converted'],
    true
) ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) policies for GDPR compliance
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role full access
CREATE POLICY "Allow service role full access" ON leads
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access" ON webhook_configs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access" ON webhook_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access" ON follow_up_tasks
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access" ON email_notifications
    FOR ALL USING (auth.role() = 'service_role');

-- Workshop Authentication System Tables
-- Workshops table for managing registered workshops
CREATE TABLE IF NOT EXISTS workshops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    owner_email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Contact Information
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Address Information
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    state VARCHAR(100) DEFAULT 'Deutschland',
    country VARCHAR(100) DEFAULT 'DE',
    
    -- Business Information
    business_type VARCHAR(100), -- 'independent', 'chain', 'dealership', 'specialty'
    opening_hours JSONB,
    services TEXT[], -- Array of service offerings
    
    -- Subscription and Status
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- 'basic', 'professional', 'enterprise'
    subscription_status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
    trial_ends_at TIMESTAMPTZ,
    
    -- Configuration
    logo_url TEXT,
    branding JSONB DEFAULT '{}'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    active BOOLEAN DEFAULT true NOT NULL,
    verified BOOLEAN DEFAULT false NOT NULL,
    onboarding_completed BOOLEAN DEFAULT false NOT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workshop Users table for role-based access
CREATE TABLE IF NOT EXISTS workshop_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'employee' NOT NULL, -- 'owner', 'admin', 'employee'
    permissions JSONB DEFAULT '[]'::jsonb, -- Array of specific permissions
    
    -- Profile Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    position VARCHAR(100),
    
    -- Status
    active BOOLEAN DEFAULT true NOT NULL,
    invited_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    UNIQUE(workshop_id, user_id)
);

-- Password Reset Tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User Sessions table for enhanced session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Audit Log table for security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    workshop_id UUID REFERENCES workshops(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'password_change', 'profile_update', etc.
    resource_type VARCHAR(100), -- 'user', 'workshop', 'lead', etc.
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshops_owner_email ON workshops(owner_email);
CREATE INDEX IF NOT EXISTS idx_workshops_owner_id ON workshops(owner_id);
CREATE INDEX IF NOT EXISTS idx_workshops_active ON workshops(active);
CREATE INDEX IF NOT EXISTS idx_workshops_subscription_plan ON workshops(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_workshop_users_workshop_id ON workshop_users(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_users_user_id ON workshop_users(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_users_role ON workshop_users(role);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(active);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_workshop_id ON audit_logs(workshop_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Update triggers for workshops and workshop_users
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_users_updated_at BEFORE UPDATE ON workshop_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for workshop tables
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Workshop policies - users can only see their own workshop
CREATE POLICY "Users can view their own workshop" ON workshops
    FOR SELECT USING (
        auth.uid() = owner_id OR 
        auth.uid() IN (
            SELECT user_id FROM workshop_users 
            WHERE workshop_id = workshops.id AND active = true
        )
    );

CREATE POLICY "Workshop owners can update their workshop" ON workshops
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Service role has full access to workshops" ON workshops
    FOR ALL USING (auth.role() = 'service_role');

-- Workshop users policies
CREATE POLICY "Users can view workshop users in their workshop" ON workshop_users
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT workshop_id FROM workshop_users WHERE user_id = auth.uid() AND active = true)
        )
    );

CREATE POLICY "Workshop owners and admins can manage users" ON workshop_users
    FOR ALL USING (
        workshop_id IN (
            SELECT id FROM workshops WHERE owner_id = auth.uid()
        ) OR
        workshop_id IN (
            SELECT workshop_id FROM workshop_users 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND active = true
        )
    );

CREATE POLICY "Service role has full access to workshop users" ON workshop_users
    FOR ALL USING (auth.role() = 'service_role');

-- Password reset tokens policies
CREATE POLICY "Users can view their own password reset tokens" ON password_reset_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to password reset tokens" ON password_reset_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- User sessions policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to user sessions" ON user_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Audit logs policies (read-only for users)
CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT USING (
        auth.uid() = user_id OR
        workshop_id IN (
            SELECT id FROM workshops WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Service role has full access to audit logs" ON audit_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
    p_user_id UUID,
    p_workshop_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(100) DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id, workshop_id, action, resource_type, resource_id, 
        details, ip_address, user_agent
    ) VALUES (
        p_user_id, p_workshop_id, p_action, p_resource_type, p_resource_id,
        p_details, p_ip_address, p_user_agent
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions and tokens
CREATE OR REPLACE FUNCTION cleanup_auth_data()
RETURNS void AS $$
BEGIN
    -- Clean up expired password reset tokens
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() OR used = true;
    
    -- Clean up expired user sessions
    DELETE FROM user_sessions 
    WHERE expires_at < NOW();
    
    -- Clean up old audit logs (keep 1 year)
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;