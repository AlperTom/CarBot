-- Create workshops table with correct schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS workshops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255),
  owner_email VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255), -- for workshop contact email
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  website VARCHAR(255),
  client_key VARCHAR(255) UNIQUE,
  
  -- Settings
  business_hours JSONB DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  response_style VARCHAR(50) DEFAULT 'professional',
  language VARCHAR(10) DEFAULT 'de',
  
  -- Notifications
  lead_notifications BOOLEAN DEFAULT true,
  appointment_reminders BOOLEAN DEFAULT true,
  auto_response BOOLEAN DEFAULT true,
  
  -- Widget settings
  widget_enabled BOOLEAN DEFAULT true,
  widget_color VARCHAR(20) DEFAULT '#3B82F6',
  
  -- Integrations
  whatsapp_enabled BOOLEAN DEFAULT false,
  whatsapp_number VARCHAR(50),
  gmt_integration BOOLEAN DEFAULT false,
  facebook_integration BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on owner_email for fast lookups
CREATE INDEX IF NOT EXISTS idx_workshops_owner_email ON workshops(owner_email);

-- Create index on client_key for API access
CREATE INDEX IF NOT EXISTS idx_workshops_client_key ON workshops(client_key);

-- Insert test workshop data
INSERT INTO workshops (name, owner_name, owner_email, email, phone, address, city, postal_code, website, client_key, business_hours, services, specializations)
VALUES (
  'Muster Autowerkstatt',
  'Max Mustermann', 
  'test@carbot.de',
  'max@muster-werkstatt.de',
  '+49 30 12345678',
  'Musterstraße 123',
  'Berlin',
  '10115',
  'https://muster-werkstatt.de',
  'ck_test_klassische_werkstatt_123',
  '{"monday": {"open": "08:00", "close": "18:00", "closed": false}, "tuesday": {"open": "08:00", "close": "18:00", "closed": false}, "wednesday": {"open": "08:00", "close": "18:00", "closed": false}, "thursday": {"open": "08:00", "close": "18:00", "closed": false}, "friday": {"open": "08:00", "close": "18:00", "closed": false}, "saturday": {"open": "09:00", "close": "16:00", "closed": false}, "sunday": {"open": "10:00", "close": "14:00", "closed": true}}',
  ARRAY['Inspektion', 'Ölwechsel', 'Reifenwechsel', 'Bremsenservice', 'Klimaanlagenservice'],
  ARRAY['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi']
)
ON CONFLICT (owner_email) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = CURRENT_TIMESTAMP;