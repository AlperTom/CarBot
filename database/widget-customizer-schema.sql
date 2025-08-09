-- Widget Customizer Database Schema
-- Add tables for widget configurations and customization

-- Widget Configurations Table
CREATE TABLE IF NOT EXISTS widget_configurations (
    id BIGSERIAL PRIMARY KEY,
    workshop_id BIGINT REFERENCES workshops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Widget Themes Table (for future expansion)
CREATE TABLE IF NOT EXISTS widget_themes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    configuration JSONB NOT NULL DEFAULT '{}',
    preview_image VARCHAR(500),
    is_public BOOLEAN DEFAULT true,
    created_by BIGINT REFERENCES workshops(id) ON DELETE SET NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Widget Analytics Table (for customization insights)
CREATE TABLE IF NOT EXISTS widget_analytics (
    id BIGSERIAL PRIMARY KEY,
    workshop_id BIGINT REFERENCES workshops(id) ON DELETE CASCADE,
    configuration_id BIGINT REFERENCES widget_configurations(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'theme_applied', 'config_saved', 'widget_exported'
    event_data JSONB DEFAULT '{}',
    client_key VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add widget_config column to workshops table if it doesn't exist
ALTER TABLE workshops 
ADD COLUMN IF NOT EXISTS widget_config JSONB DEFAULT '{}';

-- Add domain restriction column for widget security
ALTER TABLE workshops 
ADD COLUMN IF NOT EXISTS authorized_domains TEXT[] DEFAULT '{}';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_widget_configurations_workshop_id ON widget_configurations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_widget_configurations_is_active ON widget_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_widget_themes_category ON widget_themes(category);
CREATE INDEX IF NOT EXISTS idx_widget_themes_is_public ON widget_themes(is_public);
CREATE INDEX IF NOT EXISTS idx_widget_analytics_workshop_id ON widget_analytics(workshop_id);
CREATE INDEX IF NOT EXISTS idx_widget_analytics_event_type ON widget_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_widget_analytics_created_at ON widget_analytics(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_widget_configurations_updated_at 
    BEFORE UPDATE ON widget_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_themes_updated_at 
    BEFORE UPDATE ON widget_themes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE widget_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Workshop owners can manage their own widget configurations
CREATE POLICY "Workshop owners can manage widget configs" ON widget_configurations
    FOR ALL USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_email = auth.jwt() ->> 'email'
        )
    );

-- Policy: Everyone can view public themes, owners can manage their own
CREATE POLICY "Public themes are viewable by all" ON widget_themes
    FOR SELECT USING (is_public = true);

CREATE POLICY "Theme creators can manage their themes" ON widget_themes
    FOR ALL USING (
        created_by IN (
            SELECT id FROM workshops 
            WHERE owner_email = auth.jwt() ->> 'email'
        )
    );

-- Policy: Workshop owners can view their own analytics
CREATE POLICY "Workshop owners can view their analytics" ON widget_analytics
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_email = auth.jwt() ->> 'email'
        )
    );

-- Insert some default professional themes
INSERT INTO widget_themes (name, category, description, configuration, is_public) VALUES
(
    'Professional Blue',
    'professional',
    'Classic blue theme for professional automotive workshops',
    '{
        "colors": {
            "primary": "#0070f3",
            "secondary": "#f8fafc",
            "text": "#1a202c",
            "background": "#ffffff"
        },
        "typography": {
            "fontFamily": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
            "fontSize": "14px",
            "fontWeight": "400"
        },
        "dimensions": {
            "triggerSize": 60,
            "chatWidth": 350,
            "chatHeight": 500,
            "borderRadius": 12
        }
    }',
    true
),
(
    'Modern Green',
    'modern',
    'Eco-friendly green theme for sustainable workshops',
    '{
        "colors": {
            "primary": "#10b981",
            "secondary": "#f0fdf4",
            "text": "#064e3b",
            "background": "#ffffff"
        },
        "typography": {
            "fontFamily": "\"Inter\", sans-serif",
            "fontSize": "14px",
            "fontWeight": "400"
        },
        "dimensions": {
            "triggerSize": 55,
            "chatWidth": 360,
            "chatHeight": 520,
            "borderRadius": 16
        }
    }',
    true
),
(
    'Premium Gold',
    'premium',
    'Luxury gold theme for high-end automotive services',
    '{
        "colors": {
            "primary": "#f59e0b",
            "secondary": "#fffbeb",
            "text": "#78350f",
            "background": "#ffffff"
        },
        "typography": {
            "fontFamily": "\"Montserrat\", sans-serif",
            "fontSize": "14px",
            "fontWeight": "500"
        },
        "dimensions": {
            "triggerSize": 65,
            "chatWidth": 380,
            "chatHeight": 550,
            "borderRadius": 20
        }
    }',
    true
);

-- Function to automatically set only one active configuration per workshop
CREATE OR REPLACE FUNCTION ensure_single_active_config()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = true THEN
        -- Deactivate all other configurations for this workshop
        UPDATE widget_configurations 
        SET is_active = false 
        WHERE workshop_id = NEW.workshop_id 
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to ensure only one active configuration per workshop
CREATE TRIGGER ensure_single_active_config_trigger
    BEFORE INSERT OR UPDATE ON widget_configurations
    FOR EACH ROW EXECUTE FUNCTION ensure_single_active_config();

-- Comments for documentation
COMMENT ON TABLE widget_configurations IS 'Stores custom widget configurations for workshops';
COMMENT ON TABLE widget_themes IS 'Predefined and custom widget themes';
COMMENT ON TABLE widget_analytics IS 'Analytics data for widget customization usage';

COMMENT ON COLUMN widget_configurations.configuration IS 'JSONB configuration containing colors, typography, positioning, behavior, animations, dimensions, and advanced settings';
COMMENT ON COLUMN widget_themes.configuration IS 'JSONB theme configuration that can be applied to widgets';
COMMENT ON COLUMN widget_analytics.event_data IS 'Additional event-specific data in JSON format';