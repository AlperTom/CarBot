-- CarBot FAQ and Pricing Database Schema
-- Designed for intelligent context injection and customer-specific services

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Categories for organizing FAQ and services
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Global FAQ table for common questions
CREATE TABLE faq_global (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[], -- Array of searchable tags
    language VARCHAR(5) DEFAULT 'de', -- Language code (de, en, etc.)
    priority INTEGER DEFAULT 0, -- Higher priority shown first
    is_active BOOLEAN DEFAULT TRUE,
    search_vector TSVECTOR, -- Full-text search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer/Client configuration
CREATE TABLE clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_key VARCHAR(50) NOT NULL UNIQUE,
    company_name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    region VARCHAR(50), -- Geographic region for pricing
    language VARCHAR(5) DEFAULT 'de',
    settings JSONB DEFAULT '{}', -- Custom client settings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer-specific services and pricing
CREATE TABLE client_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    service_name VARCHAR(200) NOT NULL,
    service_description TEXT,
    base_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    pricing_model VARCHAR(20) DEFAULT 'fixed', -- fixed, hourly, quote
    duration_minutes INTEGER, -- Estimated service duration
    availability JSONB DEFAULT '{}', -- Available times/days
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer-specific FAQ overrides
CREATE TABLE faq_client_specific (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[],
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    search_vector TSVECTOR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business hours and availability (ZEITEN)
CREATE TABLE business_hours (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    special_note TEXT, -- e.g., "Appointment only", "Emergency service"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Special hours (holidays, special events)
CREATE TABLE special_hours (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat context cache for performance
CREATE TABLE context_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    cache_key VARCHAR(255) NOT NULL,
    context_type VARCHAR(50) NOT NULL, -- 'faq', 'services', 'hours'
    context_data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Callback requests when AI needs human intervention
CREATE TABLE callback_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    ai_confidence DECIMAL(3,2), -- 0.00 to 1.00
    user_contact_info JSONB, -- phone, email, preferred time
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'pending', -- pending, assigned, completed, cancelled
    assigned_to VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_faq_global_search ON faq_global USING GIN(search_vector);
CREATE INDEX idx_faq_global_category ON faq_global(category_id);
CREATE INDEX idx_faq_global_active ON faq_global(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_faq_global_priority ON faq_global(priority DESC);

CREATE INDEX idx_faq_client_search ON faq_client_specific USING GIN(search_vector);
CREATE INDEX idx_faq_client_category ON faq_client_specific(category_id);
CREATE INDEX idx_faq_client_active ON faq_client_specific(is_active) WHERE is_active = TRUE;

CREATE INDEX idx_client_services_client ON client_services(client_id);
CREATE INDEX idx_client_services_category ON client_services(category_id);
CREATE INDEX idx_client_services_active ON client_services(is_active) WHERE is_active = TRUE;

CREATE INDEX idx_business_hours_client ON business_hours(client_id);
CREATE INDEX idx_special_hours_client_date ON special_hours(client_id, date);

CREATE INDEX idx_context_cache_client_key ON context_cache(client_id, cache_key);
CREATE INDEX idx_context_cache_expires ON context_cache(expires_at);

CREATE INDEX idx_callback_requests_client ON callback_requests(client_id);
CREATE INDEX idx_callback_requests_status ON callback_requests(status);
CREATE INDEX idx_callback_requests_priority ON callback_requests(priority);

-- Triggers for updating search vectors
CREATE OR REPLACE FUNCTION update_faq_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('german', COALESCE(NEW.question, '') || ' ' || COALESCE(NEW.answer, '') || ' ' || array_to_string(COALESCE(NEW.tags, '{}'), ' '));
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_faq_global_search_vector
    BEFORE INSERT OR UPDATE ON faq_global
    FOR EACH ROW EXECUTE FUNCTION update_faq_search_vector();

CREATE TRIGGER trigger_faq_client_search_vector
    BEFORE INSERT OR UPDATE ON faq_client_specific
    FOR EACH ROW EXECUTE FUNCTION update_faq_search_vector();

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_client_services_updated_at BEFORE UPDATE ON client_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_business_hours_updated_at BEFORE UPDATE ON business_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_special_hours_updated_at BEFORE UPDATE ON special_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_callback_requests_updated_at BEFORE UPDATE ON callback_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) for multi-tenant data
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_client_specific ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies (these would be customized based on authentication system)
-- For now, allowing all operations (to be restricted later)
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on client_services" ON client_services FOR ALL USING (true);
CREATE POLICY "Allow all operations on faq_client_specific" ON faq_client_specific FOR ALL USING (true);
CREATE POLICY "Allow all operations on business_hours" ON business_hours FOR ALL USING (true);
CREATE POLICY "Allow all operations on special_hours" ON special_hours FOR ALL USING (true);
CREATE POLICY "Allow all operations on context_cache" ON context_cache FOR ALL USING (true);
CREATE POLICY "Allow all operations on callback_requests" ON callback_requests FOR ALL USING (true);