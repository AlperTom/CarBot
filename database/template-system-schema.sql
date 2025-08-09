-- Template System Database Schema
-- Phase 2 Feature: Template customization and landing page system

-- Table: workshop_template_customizations
-- Stores customized template configurations for each workshop
CREATE TABLE IF NOT EXISTS workshop_template_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  template_type VARCHAR(100) NOT NULL, -- e.g., 'kfz_werkstatt_classic', 'modern_autoservice'
  custom_slug VARCHAR(100) UNIQUE NOT NULL, -- URL slug for the landing page
  
  -- Design Customization
  colors JSONB DEFAULT '{
    "primary": "#ea580c",
    "secondary": "#1e293b", 
    "accent": "#10b981",
    "background": "#ffffff",
    "text": "#1e293b"
  }'::jsonb,
  
  typography JSONB DEFAULT '{
    "font_family": "Inter, sans-serif"
  }'::jsonb,
  
  -- Branding
  branding JSONB DEFAULT '{
    "logo_url": null,
    "hero_title": null,
    "hero_subtitle": null,
    "hero_image": null
  }'::jsonb,
  
  -- Content Sections  
  content JSONB DEFAULT '{
    "about_title": "Über uns",
    "about_content": null,
    "services_title": "Unsere Services", 
    "contact_title": "Kontakt"
  }'::jsonb,
  
  -- Contact Information
  contact_details JSONB DEFAULT '{
    "address": null,
    "phone": null,
    "email": null,
    "opening_hours": {
      "monday": "08:00-17:00",
      "tuesday": "08:00-17:00",
      "wednesday": "08:00-17:00", 
      "thursday": "08:00-17:00",
      "friday": "08:00-17:00",
      "saturday": "09:00-14:00",
      "sunday": "Geschlossen"
    }
  }'::jsonb,
  
  -- Legal Pages
  legal JSONB DEFAULT '{
    "impressum_content": null,
    "privacy_policy_content": null
  }'::jsonb,
  
  -- Custom CSS
  custom_css TEXT,
  
  -- SEO Configuration
  seo JSONB DEFAULT '{
    "meta_title": null,
    "meta_description": null,
    "meta_keywords": null
  }'::jsonb,
  
  -- Publication Status
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(workshop_id), -- One customization per workshop
  CONSTRAINT valid_template_type CHECK (
    template_type IN (
      'kfz_werkstatt_classic',
      'modern_autoservice', 
      'premium_luxury_garage',
      'elektro_hybrid_spezialist',
      'nutzfahrzeug_service'
    )
  ),
  CONSTRAINT valid_slug_format CHECK (
    custom_slug ~ '^[a-z0-9-]+$' AND
    length(custom_slug) >= 3 AND
    length(custom_slug) <= 100
  )
);

-- Table: template_previews
-- Stores temporary preview sessions for template editing
CREATE TABLE IF NOT EXISTS template_previews (
  id VARCHAR(100) PRIMARY KEY, -- preview_${workshop_id}_${timestamp}
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  template_type VARCHAR(100) NOT NULL,
  customization_data JSONB NOT NULL,
  custom_css TEXT,
  preview_html JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_preview_expiry CHECK (expires_at > created_at)
);

-- Table: landing_page_analytics
-- Track analytics for published landing pages
CREATE TABLE IF NOT EXISTS landing_page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  custom_slug VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'page_view', 'widget_interaction', 'form_submission'
  visitor_id VARCHAR(100), -- Anonymous visitor tracking
  session_id VARCHAR(100),
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  country_code VARCHAR(2),
  
  -- Event-specific data
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_landing_analytics_workshop (workshop_id),
  INDEX idx_landing_analytics_slug (custom_slug),
  INDEX idx_landing_analytics_event (event_type),
  INDEX idx_landing_analytics_date (event_timestamp),
  
  CONSTRAINT valid_event_type CHECK (
    event_type IN (
      'page_view',
      'widget_interaction', 
      'form_submission',
      'phone_click',
      'email_click',
      'scroll_depth',
      'time_on_page'
    )
  )
);

-- Table: template_assets
-- Manage uploaded assets for templates (logos, images, etc.)
CREATE TABLE IF NOT EXISTS template_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL, -- 'logo', 'hero_image', 'gallery_image'
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER, -- Size in bytes
  mime_type VARCHAR(100),
  alt_text VARCHAR(255),
  
  -- Usage tracking
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  
  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  INDEX idx_template_assets_workshop (workshop_id),
  INDEX idx_template_assets_type (asset_type),
  
  CONSTRAINT valid_asset_type CHECK (
    asset_type IN ('logo', 'hero_image', 'gallery_image', 'icon', 'background')
  ),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760) -- Max 10MB
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_template_customizations_workshop ON workshop_template_customizations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_template_customizations_slug ON workshop_template_customizations(custom_slug);
CREATE INDEX IF NOT EXISTS idx_template_customizations_published ON workshop_template_customizations(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_template_customizations_updated ON workshop_template_customizations(updated_at);

CREATE INDEX IF NOT EXISTS idx_template_previews_workshop ON template_previews(workshop_id);
CREATE INDEX IF NOT EXISTS idx_template_previews_expires ON template_previews(expires_at);

-- RLS (Row Level Security) Policies
ALTER TABLE workshop_template_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_assets ENABLE ROW LEVEL SECURITY;

-- Policy: Workshop owners can manage their own template customizations
CREATE POLICY "workshop_template_customizations_policy" ON workshop_template_customizations
  FOR ALL USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE owner_email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Workshop owners can manage their own previews
CREATE POLICY "template_previews_policy" ON template_previews
  FOR ALL USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE owner_email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Workshop owners can view their own analytics
CREATE POLICY "landing_page_analytics_policy" ON landing_page_analytics
  FOR SELECT USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE owner_email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Workshop owners can manage their own assets
CREATE POLICY "template_assets_policy" ON template_assets
  FOR ALL USING (
    workshop_id IN (
      SELECT id FROM workshops WHERE owner_email = auth.jwt() ->> 'email'
    )
  );

-- Policy: Public can read published landing pages (for public access)
CREATE POLICY "public_published_templates_policy" ON workshop_template_customizations
  FOR SELECT USING (is_published = true);

-- Functions for Template Management

-- Function: Update template customization timestamp
CREATE OR REPLACE FUNCTION update_template_customization_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update timestamp on template customization changes
CREATE TRIGGER trigger_update_template_customization_timestamp
  BEFORE UPDATE ON workshop_template_customizations
  FOR EACH ROW
  EXECUTE FUNCTION update_template_customization_timestamp();

-- Function: Clean expired previews
CREATE OR REPLACE FUNCTION clean_expired_previews()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM template_previews 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Increment page views for landing pages
CREATE OR REPLACE FUNCTION increment_page_views(
  p_workshop_id UUID,
  p_page_type VARCHAR DEFAULT 'landing_page'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO landing_page_analytics (
    workshop_id,
    custom_slug,
    event_type,
    event_data
  )
  SELECT 
    p_workshop_id,
    custom_slug,
    'page_view',
    jsonb_build_object('page_type', p_page_type)
  FROM workshop_template_customizations 
  WHERE workshop_id = p_workshop_id AND is_published = true;
END;
$$ LANGUAGE plpgsql;

-- Function: Get landing page analytics summary
CREATE OR REPLACE FUNCTION get_landing_page_analytics(
  p_workshop_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_views BIGINT,
  unique_visitors BIGINT,
  widget_interactions BIGINT,
  form_submissions BIGINT,
  daily_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH daily_stats AS (
    SELECT 
      DATE(event_timestamp) as event_date,
      COUNT(*) FILTER (WHERE event_type = 'page_view') as views,
      COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'page_view') as visitors,
      COUNT(*) FILTER (WHERE event_type = 'widget_interaction') as interactions,
      COUNT(*) FILTER (WHERE event_type = 'form_submission') as submissions
    FROM landing_page_analytics 
    WHERE workshop_id = p_workshop_id 
      AND event_timestamp >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY DATE(event_timestamp)
    ORDER BY event_date DESC
  )
  SELECT 
    COALESCE(SUM(views), 0) as total_views,
    COALESCE(SUM(visitors), 0) as unique_visitors,
    COALESCE(SUM(interactions), 0) as widget_interactions,
    COALESCE(SUM(submissions), 0) as form_submissions,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'date', event_date,
          'views', views,
          'visitors', visitors,
          'interactions', interactions,
          'submissions', submissions
        )
      ), 
      '[]'::jsonb
    ) as daily_data
  FROM daily_stats;
END;
$$ LANGUAGE plpgsql;

-- Function: Validate template customization data
CREATE OR REPLACE FUNCTION validate_template_customization()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate colors are valid hex codes
  IF NOT (
    NEW.colors->>'primary' ~ '^#[0-9a-fA-F]{6}$' AND
    NEW.colors->>'secondary' ~ '^#[0-9a-fA-F]{6}$' AND
    NEW.colors->>'accent' ~ '^#[0-9a-fA-F]{6}$'
  ) THEN
    RAISE EXCEPTION 'Invalid color format. Colors must be valid hex codes.';
  END IF;
  
  -- Validate hero title is not empty if publishing
  IF NEW.is_published AND (
    NEW.branding->>'hero_title' IS NULL OR 
    trim(NEW.branding->>'hero_title') = ''
  ) THEN
    RAISE EXCEPTION 'Hero title is required for published templates.';
  END IF;
  
  -- Set published_at timestamp when publishing
  IF NEW.is_published AND OLD.is_published IS FALSE THEN
    NEW.published_at = NOW();
  ELSIF NOT NEW.is_published THEN
    NEW.published_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Validate template customization before insert/update
CREATE TRIGGER trigger_validate_template_customization
  BEFORE INSERT OR UPDATE ON workshop_template_customizations
  FOR EACH ROW
  EXECUTE FUNCTION validate_template_customization();

-- Initial Data: Sample template configurations (optional)
-- This can be used to populate default templates

-- Grant necessary permissions
GRANT ALL ON workshop_template_customizations TO postgres, service_role;
GRANT ALL ON template_previews TO postgres, service_role;
GRANT ALL ON landing_page_analytics TO postgres, service_role;
GRANT ALL ON template_assets TO postgres, service_role;

GRANT SELECT ON workshop_template_customizations TO anon, authenticated;
GRANT SELECT ON landing_page_analytics TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE workshop_template_customizations IS 'Stores customized template configurations for workshop landing pages';
COMMENT ON TABLE template_previews IS 'Temporary preview sessions for template editing (expires after 1 hour)';
COMMENT ON TABLE landing_page_analytics IS 'Analytics tracking for published landing pages';
COMMENT ON TABLE template_assets IS 'Uploaded assets (images, logos) used in template customizations';

COMMENT ON COLUMN workshop_template_customizations.custom_slug IS 'Unique URL slug for the published landing page';
COMMENT ON COLUMN workshop_template_customizations.colors IS 'JSON object containing primary, secondary, accent, background, and text colors';
COMMENT ON COLUMN workshop_template_customizations.branding IS 'JSON object containing logo, hero title/subtitle, and hero image';
COMMENT ON COLUMN workshop_template_customizations.is_published IS 'Whether the landing page is publicly accessible';

-- Performance monitoring query for template system
-- SELECT 
--   COUNT(*) as total_customizations,
--   COUNT(*) FILTER (WHERE is_published) as published_pages,
--   COUNT(DISTINCT workshop_id) as active_workshops,
--   AVG(EXTRACT(epoch FROM (updated_at - created_at))) as avg_customization_time
-- FROM workshop_template_customizations
-- WHERE created_at >= NOW() - INTERVAL '30 days';