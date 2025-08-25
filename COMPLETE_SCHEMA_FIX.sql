-- COMPLETE WORKSHOPS TABLE SCHEMA FIX
-- Run this ENTIRE script in your Supabase SQL Editor

-- First, let's see what exists
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'workshops';

-- Drop and recreate the workshops table with complete schema
DROP TABLE IF EXISTS workshops CASCADE;

CREATE TABLE workshops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255),
  owner_email VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  website VARCHAR(255),
  
  -- JSON and array fields
  business_hours JSONB DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  
  -- Configuration fields
  response_style VARCHAR(50) DEFAULT 'professional',
  language VARCHAR(10) DEFAULT 'de',
  
  -- Notification settings
  lead_notifications BOOLEAN DEFAULT true,
  appointment_reminders BOOLEAN DEFAULT true,
  auto_response BOOLEAN DEFAULT true,
  
  -- Widget settings
  widget_enabled BOOLEAN DEFAULT true,
  widget_color VARCHAR(20) DEFAULT '#3B82F6',
  
  -- Integration settings
  whatsapp_enabled BOOLEAN DEFAULT false,
  whatsapp_number VARCHAR(50),
  gmt_integration BOOLEAN DEFAULT false,
  facebook_integration BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_workshops_owner_email ON workshops(owner_email);
CREATE INDEX idx_workshops_created_at ON workshops(created_at);

-- Insert test data
INSERT INTO workshops (
  name,
  owner_name,
  owner_email,
  email,
  phone,
  address,
  city,
  postal_code,
  website,
  business_hours,
  services,
  specializations
) VALUES (
  'Muster Autowerkstatt',
  'Max Mustermann', 
  'test@carbot.de',
  'max@muster-werkstatt.de',
  '+49 30 12345678',
  'Musterstraße 123',
  'Berlin',
  '10115',
  'https://muster-werkstatt.de',
  '{"monday": {"open": "08:00", "close": "18:00", "closed": false}, "tuesday": {"open": "08:00", "close": "18:00", "closed": false}, "wednesday": {"open": "08:00", "close": "18:00", "closed": false}, "thursday": {"open": "08:00", "close": "18:00", "closed": false}, "friday": {"open": "08:00", "close": "18:00", "closed": false}, "saturday": {"open": "09:00", "close": "16:00", "closed": false}, "sunday": {"open": "10:00", "close": "14:00", "closed": true}}',
  '{"Inspektion", "Ölwechsel", "Reifenwechsel", "Bremsenservice", "Klimaanlagenservice"}',
  '{"BMW", "Mercedes-Benz", "Volkswagen", "Audi"}'
);

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'workshops' 
ORDER BY ordinal_position;