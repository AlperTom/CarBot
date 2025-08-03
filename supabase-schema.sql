-- CarBot Database Schema for Supabase
-- This file contains all the tables needed for the CarBot system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table (Werkstätten)
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL slug for carbot.chat/[kunde]
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    logo TEXT, -- URL to logo image
    website TEXT,
    services TEXT[] DEFAULT '{}', -- Array of services offered
    opening_hours TEXT,
    google_reviews_link TEXT,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners table (for cross-linking between workshops)
CREATE TABLE partners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, partner_id)
);

-- Leads table (matching the JSON structure from requirements)
CREATE TABLE leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    kunde_id VARCHAR(255) NOT NULL, -- maps to customer slug
    name VARCHAR(255) NOT NULL,
    telefon VARCHAR(50) NOT NULL,
    anliegen TEXT NOT NULL,
    fahrzeug VARCHAR(255),
    chatverlauf JSONB, -- JSON-encoded chat history
    source_url TEXT,
    follow_up_status VARCHAR(50) DEFAULT 'pending',
    follow_up_notes TEXT,
    priority VARCHAR(20) DEFAULT 'normal',
    assigned_to VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'), -- GDPR compliance
    INDEX idx_kunde_id (kunde_id),
    INDEX idx_created_at (created_at),
    INDEX idx_expires_at (expires_at)
);

-- Chat messages table (for GDPR compliance and analytics)
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_key VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    session_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'), -- Auto-delete after 90 days
    INDEX idx_client_key (client_key),
    INDEX idx_session_id (session_id),
    INDEX idx_expires_at (expires_at)
);

-- GDPR consent records
CREATE TABLE consent_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_key VARCHAR(255) NOT NULL,
    consent_data JSONB NOT NULL, -- Full consent preferences and metadata
    ip_address INET,
    user_agent TEXT,
    consent_version VARCHAR(20) DEFAULT '1.0',
    withdrawn_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_client_key (client_key),
    INDEX idx_created_at (created_at)
);

-- FAQ table (global and customer-specific)
CREATE TABLE faq (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE, -- NULL for global FAQ
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    keywords TEXT[], -- For better matching
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_customer_id (customer_id),
    INDEX idx_category (category),
    INDEX idx_keywords USING GIN (keywords)
);

-- Customer services and pricing table
CREATE TABLE customer_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    price_from DECIMAL(10,2),
    price_to DECIMAL(10,2),
    price_unit VARCHAR(50), -- e.g., "pro Stunde", "pauschal"
    category VARCHAR(100),
    duration_minutes INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_customer_id (customer_id),
    INDEX idx_category (category)
);

-- Analytics table for tracking chat performance
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- 'chat_started', 'lead_captured', 'widget_loaded', etc.
    client_key VARCHAR(255),
    session_id UUID,
    event_data JSONB,
    source_url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 years'),
    INDEX idx_event_type (event_type),
    INDEX idx_client_key (client_key),
    INDEX idx_created_at (created_at)
);

-- Webhook logs for debugging
CREATE TABLE webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_type VARCHAR(100) NOT NULL,
    payload JSONB,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_webhook_type (webhook_type),
    INDEX idx_created_at (created_at),
    INDEX idx_response_status (response_status)
);

-- AI model usage tracking (for cost optimization)
CREATE TABLE ai_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_key VARCHAR(255),
    model_name VARCHAR(100) NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    cost_cents INTEGER, -- Cost in cents
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_client_key (client_key),
    INDEX idx_model_name (model_name),
    INDEX idx_created_at (created_at)
);

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON faq FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_services_updated_at BEFORE UPDATE ON customer_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for automatic data cleanup (GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
    -- Delete expired chat messages
    DELETE FROM chat_messages WHERE expires_at < NOW();
    
    -- Delete expired leads
    DELETE FROM leads WHERE expires_at < NOW();
    
    -- Delete old analytics events
    DELETE FROM analytics_events WHERE expires_at < NOW();
    
    -- Log cleanup activity
    INSERT INTO webhook_logs (webhook_type, payload, response_status, created_at)
    VALUES ('gdpr_cleanup', jsonb_build_object('timestamp', NOW()), 200, NOW());
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security (RLS) policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- RLS policies (basic examples - adjust based on your auth setup)
CREATE POLICY "Customers can view their own data" ON customers
    FOR SELECT USING (true); -- Adjust based on your auth

CREATE POLICY "Leads are viewable by customer" ON leads
    FOR SELECT USING (true); -- Adjust based on your auth

-- Insert sample data for testing
INSERT INTO customers (slug, name, email, phone, address, city, postal_code, services, opening_hours, rating, review_count) VALUES
('mustermann-auto', 'Mustermann Auto GmbH', 'info@mustermann-auto.de', '+49 123 456789', 'Hauptstraße 123', 'Berlin', '10115', 
 ARRAY['TÜV & AU', 'Ölwechsel', 'Inspektion', 'Reparaturen', 'Reifenwechsel'], 
 E'Mo-Fr: 8:00-18:00\nSa: 9:00-14:00\nSo: geschlossen', 4.8, 127),

('schmidt-werkstatt', 'Schmidt KFZ-Werkstatt', 'kontakt@schmidt-kfz.de', '+49 987 654321', 'Industriestraße 45', 'Hamburg', '20095',
 ARRAY['Bremsenservice', 'Klimaanlage', 'Elektrik', 'Motor', 'Getriebe'],
 E'Mo-Do: 7:30-17:30\nFr: 7:30-16:00\nWochenende: geschlossen', 4.6, 89);

-- Insert partner relationship
INSERT INTO partners (customer_id, partner_id, specialization) 
SELECT c1.id, c2.id, 'Spezialist für Elektrik'
FROM customers c1, customers c2 
WHERE c1.slug = 'mustermann-auto' AND c2.slug = 'schmidt-werkstatt';

-- Insert sample FAQ entries
INSERT INTO faq (customer_id, question, answer, category, keywords) VALUES
(NULL, 'Was kostet ein TÜV?', 'Die TÜV-Kosten variieren je nach Fahrzeugtyp. Für PKW liegt der Preis zwischen 89€ und 120€.', 'TÜV', ARRAY['tüv', 'kosten', 'preis', 'pkw']),
(NULL, 'Wie oft muss ich zur Inspektion?', 'Die Inspektion sollte alle 12 Monate oder 15.000-30.000 km durchgeführt werden, je nach Fahrzeughersteller.', 'Wartung', ARRAY['inspektion', 'wartung', 'intervall']);

-- Insert sample services for Mustermann Auto
INSERT INTO customer_services (customer_id, service_name, description, price_from, price_to, price_unit, category) 
SELECT id, 'TÜV Hauptuntersuchung', 'Gesetzlich vorgeschriebene Hauptuntersuchung für PKW', 89.00, 120.00, 'pauschal', 'TÜV'
FROM customers WHERE slug = 'mustermann-auto';

INSERT INTO customer_services (customer_id, service_name, description, price_from, price_to, price_unit, category)
SELECT id, 'Ölwechsel inkl. Filter', 'Motorölwechsel mit neuem Ölfilter', 45.00, 85.00, 'je nach Ölmenge', 'Wartung'
FROM customers WHERE slug = 'mustermann-auto';

-- Create indexes for better performance
CREATE INDEX idx_customers_slug ON customers(slug);
CREATE INDEX idx_customers_active ON customers(active);
CREATE INDEX idx_leads_kunde_created ON leads(kunde_id, created_at);
CREATE INDEX idx_chat_messages_client_created ON chat_messages(client_key, created_at);
CREATE INDEX idx_faq_customer_active ON faq(customer_id, active);

-- Comment the tables
COMMENT ON TABLE customers IS 'Workshop/customer data for carbot.chat/[kunde] pages';
COMMENT ON TABLE leads IS 'Lead captures from chat interactions - matches JSON structure from requirements';
COMMENT ON TABLE chat_messages IS 'All chat messages with 90-day auto-deletion for GDPR compliance';
COMMENT ON TABLE consent_records IS 'GDPR consent tracking with full audit trail';
COMMENT ON TABLE faq IS 'FAQ entries (global and customer-specific) for AI context injection';
COMMENT ON TABLE customer_services IS 'Services and pricing for each customer/workshop';
COMMENT ON TABLE analytics_events IS 'Event tracking for performance analytics';
COMMENT ON TABLE webhook_logs IS 'Webhook delivery logs for debugging';
COMMENT ON TABLE ai_usage IS 'AI model usage tracking for cost optimization';