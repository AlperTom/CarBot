-- CarBot Customer Landing Pages Database Schema
-- This file contains the SQL commands to set up the customer data structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table - main customer/workshop data
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Information
  slug VARCHAR(100) UNIQUE NOT NULL, -- URL identifier (e.g., 'mueller-kfz')
  name VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  
  -- Contact Information
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  
  -- Address Information
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  state VARCHAR(100) DEFAULT 'Deutschland',
  country VARCHAR(100) DEFAULT 'DE',
  
  -- Geographic Coordinates for Maps
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Information
  opening_hours JSONB, -- Store as JSON: {"monday": "08:00-18:00", "tuesday": "08:00-18:00", ...}
  price_range VARCHAR(20), -- e.g., "€€", "€€€"
  services TEXT[], -- Array of service keywords
  
  -- Google Integration
  google_place_id VARCHAR(255),
  google_rating DECIMAL(2,1),
  google_review_count INTEGER,
  
  -- Media
  logo TEXT, -- URL to logo image
  hero_image TEXT, -- URL to hero/banner image
  gallery_images TEXT[], -- Array of image URLs
  
  -- Branding Configuration
  branding JSONB -- Custom colors, fonts, styling as JSON
);

-- Customer Services table - detailed service offerings
CREATE TABLE IF NOT EXISTS customer_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_from DECIMAL(10,2),
  price_to DECIMAL(10,2),
  duration_minutes INTEGER,
  category VARCHAR(100), -- e.g., 'Reparatur', 'Wartung', 'Inspektion'
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true
);

-- Customer Partners table - for cross-linking between workshops
CREATE TABLE IF NOT EXISTS customer_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  relationship_type VARCHAR(50), -- e.g., 'partner', 'network', 'referral'
  description TEXT,
  active BOOLEAN DEFAULT true,
  
  UNIQUE(customer_id, partner_id)
);

-- Customer Reviews table - store additional reviews beyond Google
CREATE TABLE IF NOT EXISTS customer_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  reviewer_name VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date DATE,
  source VARCHAR(50), -- 'google', 'manual', 'facebook', etc.
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true
);

-- Chat Sessions table - track customer-specific chat interactions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  session_id VARCHAR(255) UNIQUE NOT NULL,
  visitor_id VARCHAR(255), -- Anonymous visitor identifier
  messages JSONB[], -- Array of message objects
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  
  -- Analytics
  page_views INTEGER DEFAULT 1,
  time_on_page INTEGER, -- seconds
  converted BOOLEAN DEFAULT false,
  conversion_type VARCHAR(100) -- 'contact_form', 'phone_call', 'booking', etc.
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_slug ON customers(slug);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(active);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
CREATE INDEX IF NOT EXISTS idx_customer_services_customer_id ON customer_services(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_services_category ON customer_services(category);
CREATE INDEX IF NOT EXISTS idx_customer_partners_customer_id ON customer_partners(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_customer_id ON customer_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_customer_id ON chat_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);

-- RLS (Row Level Security) policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active customers and their data
CREATE POLICY "Public customers are viewable by everyone" ON customers
  FOR SELECT USING (active = true);

CREATE POLICY "Public customer services are viewable by everyone" ON customer_services
  FOR SELECT USING (
    active = true AND 
    customer_id IN (SELECT id FROM customers WHERE active = true)
  );

CREATE POLICY "Public customer partners are viewable by everyone" ON customer_partners
  FOR SELECT USING (
    active = true AND 
    customer_id IN (SELECT id FROM customers WHERE active = true)
  );

CREATE POLICY "Public customer reviews are viewable by everyone" ON customer_reviews
  FOR SELECT USING (
    active = true AND 
    customer_id IN (SELECT id FROM customers WHERE active = true)
  );

-- Chat sessions need more restrictive access
CREATE POLICY "Chat sessions are viewable by service role" ON chat_sessions
  FOR SELECT USING (auth.role() = 'service_role');

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Sample data insertion (for testing)
INSERT INTO customers (
  slug, name, description, email, phone, address, city, postal_code,
  latitude, longitude, opening_hours, services, logo, branding
) VALUES (
  'mueller-kfz',
  'Müller KFZ-Werkstatt',
  'Ihre vertrauensvolle Autowerkstatt in München. Spezialisiert auf alle Marken mit über 25 Jahren Erfahrung.',
  'info@mueller-kfz.de',
  '+49 89 12345678',
  'Musterstraße 123',
  'München',
  '80331',
  48.1351,
  11.5820,
  '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-17:00", "saturday": "09:00-14:00", "sunday": "closed"}',
  ARRAY['Inspektion', 'Reparatur', 'Reifenwechsel', 'Ölwechsel', 'TÜV', 'Bremsen'],
  '/logos/mueller-kfz.png',
  '{"primary_color": "#1a365d", "secondary_color": "#2d3748", "accent_color": "#3182ce", "font_family": "Inter"}'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO customer_services (customer_id, name, description, price_from, price_to, category, featured) 
SELECT 
  id,
  'Hauptuntersuchung (TÜV)',
  'Komplette Fahrzeugprüfung nach StVZO mit allen erforderlichen Dokumenten',
  89.99,
  129.99,
  'Prüfung',
  true
FROM customers WHERE slug = 'mueller-kfz';

INSERT INTO customer_services (customer_id, name, description, price_from, price_to, category, featured)
SELECT 
  id,
  'Ölwechsel Service',
  'Professioneller Motorölwechsel inkl. Filteraustausch und Fahrzeugcheck',
  49.99,
  89.99,
  'Wartung',
  true
FROM customers WHERE slug = 'mueller-kfz';