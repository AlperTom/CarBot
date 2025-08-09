-- CarBot Phase 2 Database Schema Extensions
-- Analytics, Service Management, and Enhanced Features

-- ==========================================
-- ANALYTICS & KPI TRACKING TABLES
-- ==========================================

-- Contact Analytics - Track chat widget interactions
CREATE TABLE IF NOT EXISTS contact_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  client_key_id UUID REFERENCES client_keys(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  contact_date TIMESTAMP DEFAULT now(),
  message_count INTEGER DEFAULT 1,
  conversation_duration INTEGER, -- in seconds
  conversion_status VARCHAR(50) DEFAULT 'inquiry', -- inquiry, qualified, customer, lost
  lead_quality_score INTEGER DEFAULT 0, -- 0-100 scale
  source_url VARCHAR(500),
  user_agent TEXT,
  ip_address INET,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Daily KPI Aggregation for Performance
CREATE TABLE IF NOT EXISTS daily_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_contacts INTEGER DEFAULT 0,
  new_contacts INTEGER DEFAULT 0,
  qualified_leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  average_response_time DECIMAL(10,2), -- in seconds
  total_messages INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(workshop_id, date)
);

-- Widget Performance Metrics
CREATE TABLE IF NOT EXISTS widget_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  client_key_id UUID REFERENCES client_keys(id) ON DELETE CASCADE,
  metric_date DATE DEFAULT CURRENT_DATE,
  page_views INTEGER DEFAULT 0,
  widget_loads INTEGER DEFAULT 0,
  chat_initiations INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  ai_responses INTEGER DEFAULT 0,
  average_session_duration DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(workshop_id, client_key_id, metric_date)
);

-- ==========================================
-- SERVICE MANAGEMENT SYSTEM
-- ==========================================

-- Service Categories (Pre-populated automotive services)
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_de VARCHAR(255) NOT NULL, -- German translation
  description TEXT,
  description_de TEXT, -- German translation
  icon VARCHAR(100), -- emoji or icon identifier
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Master Service Database (All possible automotive services)
CREATE TABLE IF NOT EXISTS master_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id),
  service_name VARCHAR(255) NOT NULL,
  service_name_de VARCHAR(255) NOT NULL, -- German translation
  description TEXT,
  description_de TEXT, -- German translation
  typical_duration_minutes INTEGER, -- estimated service time
  complexity_level VARCHAR(20) DEFAULT 'medium', -- simple, medium, complex
  vehicle_types TEXT[] DEFAULT '{}', -- array of applicable vehicle types
  tags TEXT[] DEFAULT '{}', -- searchable tags
  is_popular BOOLEAN DEFAULT false, -- mark popular services
  created_at TIMESTAMP DEFAULT now()
);

-- Workshop-specific Services (Customized by each workshop)
CREATE TABLE IF NOT EXISTS workshop_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  master_service_id UUID REFERENCES master_services(id),
  custom_name VARCHAR(255), -- workshop can override service name
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  is_fixed_price BOOLEAN DEFAULT false, -- true if price_min = price_max
  custom_description TEXT,
  is_featured BOOLEAN DEFAULT false, -- highlight on website
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(workshop_id, master_service_id)
);

-- Service Search/Addition Log (Track what clients search for)
CREATE TABLE IF NOT EXISTS service_search_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  search_term VARCHAR(500),
  search_results_count INTEGER DEFAULT 0,
  was_service_added BOOLEAN DEFAULT false,
  added_service_id UUID REFERENCES workshop_services(id),
  user_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

-- ==========================================
-- SUBSCRIPTION & PAYMENT MANAGEMENT
-- ==========================================

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type VARCHAR(50) NOT NULL, -- basic, professional, enterprise
  plan_name VARCHAR(100) NOT NULL,
  plan_name_de VARCHAR(100) NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2), -- optional yearly pricing
  max_contacts INTEGER, -- -1 for unlimited
  max_client_keys INTEGER DEFAULT 1,
  features JSONB DEFAULT '{}', -- feature flags and limits
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Workshop Subscriptions
CREATE TABLE IF NOT EXISTS workshop_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- active, canceled, past_due, incomplete
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Payment History
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES workshop_subscriptions(id),
  stripe_payment_intent_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50), -- succeeded, failed, pending
  payment_date TIMESTAMP,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ==========================================
-- ENHANCED CLIENT & TEMPLATE MANAGEMENT
-- ==========================================

-- Template Customizations (Premium feature)
CREATE TABLE IF NOT EXISTS template_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  template_type VARCHAR(50) NOT NULL, -- klassische, moderne, etc.
  custom_slug VARCHAR(100) UNIQUE,
  logo_url VARCHAR(500),
  primary_color VARCHAR(7), -- hex color
  secondary_color VARCHAR(7), -- hex color
  custom_css TEXT,
  custom_impressum TEXT,
  custom_contact_details JSONB DEFAULT '{}',
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enhanced Client Data (CRM-like features)
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  contact_analytics_id UUID REFERENCES contact_analytics(id),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  vehicle_info JSONB DEFAULT '{}', -- make, model, year, etc.
  service_history JSONB DEFAULT '{}', -- past services
  preferences JSONB DEFAULT '{}', -- communication preferences, etc.
  lifetime_value DECIMAL(10,2) DEFAULT 0.00,
  last_contact TIMESTAMP,
  next_followup TIMESTAMP,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_contact_analytics_workshop_date ON contact_analytics(workshop_id, contact_date DESC);
CREATE INDEX IF NOT EXISTS idx_contact_analytics_client_key ON contact_analytics(client_key_id);
CREATE INDEX IF NOT EXISTS idx_daily_kpis_workshop_date ON daily_kpis(workshop_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_widget_metrics_workshop_date ON widget_metrics(workshop_id, metric_date DESC);

-- Service Management Indexes
CREATE INDEX IF NOT EXISTS idx_workshop_services_workshop ON workshop_services(workshop_id, is_active);
CREATE INDEX IF NOT EXISTS idx_workshop_services_featured ON workshop_services(workshop_id, is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_service_search_workshop ON service_search_log(workshop_id, created_at DESC);

-- Subscription Indexes
CREATE INDEX IF NOT EXISTS idx_workshop_subscriptions_workshop ON workshop_subscriptions(workshop_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_history_workshop ON payment_history(workshop_id, payment_date DESC);

-- Template & Client Indexes
CREATE INDEX IF NOT EXISTS idx_template_customizations_workshop ON template_customizations(workshop_id, is_active);
CREATE INDEX IF NOT EXISTS idx_client_profiles_workshop ON client_profiles(workshop_id, last_contact DESC);
CREATE INDEX IF NOT EXISTS idx_client_profiles_email ON client_profiles(customer_email);

-- ==========================================
-- INITIAL DATA POPULATION
-- ==========================================

-- Insert Service Categories
INSERT INTO service_categories (name, name_de, description_de, icon, sort_order) VALUES
('Engine Services', 'Motorservice', 'Alle Dienstleistungen rund um den Motor', '🔧', 1),
('Transmission', 'Getriebe', 'Getriebe und Antriebsstrang Services', '⚙️', 2),
('Brakes', 'Bremsen', 'Bremssystem Wartung und Reparatur', '🛑', 3),
('Electrical', 'Elektrik', 'Elektrische Systeme und Komponenten', '🔋', 4),
('Body & Paint', 'Karosserie & Lack', 'Karosserie und Lackierarbeiten', '🎨', 5),
('Tires & Wheels', 'Reifen & Räder', 'Reifen, Felgen und Achsvermessung', '🚗', 6),
('Air Conditioning', 'Klimaanlage', 'Klimaanlagen Service und Reparatur', '❄️', 7),
('Inspection & Maintenance', 'Inspektion & Wartung', 'TÜV, HU und regelmäßige Wartung', '🔍', 8)
ON CONFLICT DO NOTHING;

-- Insert Master Services (sample - more can be added)
INSERT INTO master_services (category_id, service_name, service_name_de, description_de, typical_duration_minutes, vehicle_types, tags, is_popular) 
SELECT 
  sc.id,
  'Oil Change',
  'Ölwechsel',
  'Motoröl und Filter wechseln',
  30,
  ARRAY['PKW', 'Transporter', 'SUV'],
  ARRAY['öl', 'filter', 'wartung', 'service'],
  true
FROM service_categories sc WHERE sc.name = 'Engine Services'
ON CONFLICT DO NOTHING;

-- Insert Default Subscription Plans
INSERT INTO subscription_plans (plan_type, plan_name, plan_name_de, price_monthly, price_yearly, max_contacts, max_client_keys, features) VALUES
('basic', 'Basic Plan', 'Basis Plan', 29.00, 290.00, 100, 1, '{"templates": 1, "support": "email", "analytics": "basic"}'),
('professional', 'Professional Plan', 'Professional Plan', 79.00, 790.00, -1, 5, '{"templates": 5, "support": "phone", "analytics": "advanced", "csv_export": true, "custom_domain": true}'),
('enterprise', 'Enterprise Plan', 'Enterprise Plan', 199.00, 1990.00, -1, -1, '{"templates": -1, "support": "priority", "analytics": "premium", "csv_export": true, "custom_domain": true, "api_access": true, "white_label": true}')
ON CONFLICT DO NOTHING;