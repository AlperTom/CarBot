-- CarBot Database Schema
-- Essential tables for CarBot production system

-- 1. Workshops table (main business entities)
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  template_type VARCHAR(50) DEFAULT 'klassische',
  website_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  subscription_plan VARCHAR(50) DEFAULT 'basic',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users table (authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'owner',
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Client keys table (API authentication)
CREATE TABLE IF NOT EXISTS client_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  key_value VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  authorized_domains TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  monthly_conversations INTEGER DEFAULT 0,
  monthly_leads INTEGER DEFAULT 0
);

-- 4. User sessions table (session management)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- 5. Chat conversations table (widget interactions)
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  client_key_id UUID REFERENCES client_keys(id),
  visitor_id VARCHAR(255),
  messages JSONB DEFAULT '[]',
  lead_captured BOOLEAN DEFAULT false,
  lead_data JSONB,
  session_duration INTEGER, -- seconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Landing page templates table
CREATE TABLE IF NOT EXISTS landing_page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  preview_image VARCHAR(255),
  html_template TEXT NOT NULL,
  css_template TEXT NOT NULL,
  customization_schema JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Workshop landing pages table
CREATE TABLE IF NOT EXISTS workshop_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES landing_page_templates(id),
  slug VARCHAR(100) UNIQUE NOT NULL,
  customizations JSONB NOT NULL DEFAULT '{}',
  seo_settings JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshops_email ON workshops(email);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_workshop ON users(workshop_id);
CREATE INDEX IF NOT EXISTS idx_client_keys_workshop ON client_keys(workshop_id);
CREATE INDEX IF NOT EXISTS idx_client_keys_value ON client_keys(key_value);
CREATE INDEX IF NOT EXISTS idx_client_keys_active ON client_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_workshop ON chat_conversations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_workshop ON workshop_landing_pages(workshop_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON workshop_landing_pages(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_landing_pages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be refined later)
CREATE POLICY "Users can view own workshop" ON workshops
  FOR SELECT USING (id IN (SELECT workshop_id FROM users WHERE users.id = auth.uid()));

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can manage own client keys" ON client_keys
  FOR ALL USING (workshop_id IN (SELECT workshop_id FROM users WHERE users.id = auth.uid()));

-- Insert default landing page templates
INSERT INTO landing_page_templates (id, name, description, html_template, css_template, customization_schema, is_active)
VALUES 
  (
    gen_random_uuid(),
    'Klassische Werkstatt',
    'Traditional German workshop design with blue and white color scheme',
    '<html><body><h1>{{workshop_name}}</h1><p>{{description}}</p></body></html>',
    'body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; }',
    '{"colors": {"primary": "#1e40af", "secondary": "#ffffff"}, "sections": ["hero", "services", "contact"]}',
    true
  ),
  (
    gen_random_uuid(),
    'Moderne Autowerkstatt',
    'Clean, contemporary design with orange and gray color scheme',
    '<html><body><h1>{{workshop_name}}</h1><p>{{description}}</p></body></html>',
    'body { font-family: "Helvetica Neue", sans-serif; color: #374151; background: #f9fafb; }',
    '{"colors": {"primary": "#ea580c", "secondary": "#6b7280"}, "sections": ["hero", "services", "about", "contact"]}',
    true
  ),
  (
    gen_random_uuid(),
    'Premium Service',
    'Luxury automotive service design with black and gold color scheme',
    '<html><body><h1>{{workshop_name}}</h1><p>{{description}}</p></body></html>',
    'body { font-family: Georgia, serif; color: #111827; background: #000000; }',
    '{"colors": {"primary": "#000000", "secondary": "#fbbf24"}, "sections": ["hero", "premium-services", "testimonials", "contact"]}',
    true
  ),
  (
    gen_random_uuid(),
    'Elektro & Hybrid Spezialist',
    'Modern eco-friendly design for electric vehicle specialists',
    '<html><body><h1>{{workshop_name}}</h1><p>{{description}}</p></body></html>',
    'body { font-family: "Inter", sans-serif; color: #065f46; background: #ecfdf5; }',
    '{"colors": {"primary": "#059669", "secondary": "#3b82f6"}, "sections": ["hero", "ev-services", "technology", "contact"]}',
    true
  ),
  (
    gen_random_uuid(),
    'Oldtimer Spezialwerkstatt',
    'Classic car specialist design with vintage styling',
    '<html><body><h1>{{workshop_name}}</h1><p>{{description}}</p></body></html>',
    'body { font-family: "Times New Roman", serif; color: #7c2d12; background: #fef7ed; }',
    '{"colors": {"primary": "#c2410c", "secondary": "#78716c"}, "sections": ["hero", "classic-services", "gallery", "contact"]}',
    true
  )
ON CONFLICT DO NOTHING;