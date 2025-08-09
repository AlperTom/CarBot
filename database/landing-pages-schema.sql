-- Landing Page Templates System Schema
-- CarBot MVP - Professional Landing Pages for German Automotive Workshops
-- Premium Package Feature (€79/month)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- Landing Page Templates (5 professional templates)
CREATE TABLE IF NOT EXISTS landing_page_templates (
    id VARCHAR(50) PRIMARY KEY, -- 'classic-workshop', 'modern-auto', etc.
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'traditional', 'modern', 'premium', 'family', 'eco'
    
    -- Template metadata
    preview_image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    color_scheme VARCHAR(50), -- 'blue-white', 'orange-gray', 'black-gold', etc.
    target_audience TEXT, -- 'Kleine Werkstätten', 'Moderne Betriebe', etc.
    
    -- Template structure and content
    template_html TEXT NOT NULL, -- Base HTML template with placeholders
    template_css TEXT NOT NULL, -- Base CSS styles
    template_js TEXT, -- Optional JavaScript
    
    -- Customization schema (defines what can be customized)
    customization_schema JSONB NOT NULL DEFAULT '{}',
    default_config JSONB NOT NULL DEFAULT '{}',
    
    -- SEO and performance
    seo_optimized BOOLEAN DEFAULT true,
    mobile_optimized BOOLEAN DEFAULT true,
    performance_score INTEGER DEFAULT 90, -- Lighthouse score
    
    -- Status and ordering
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_performance_score CHECK (performance_score >= 0 AND performance_score <= 100)
);

-- Workshop Landing Pages (User-created pages from templates)
CREATE TABLE IF NOT EXISTS workshop_landing_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    template_id VARCHAR(50) NOT NULL REFERENCES landing_page_templates(id),
    
    -- URL and domain configuration
    slug VARCHAR(100) UNIQUE NOT NULL, -- For carbot.de/workshop/[slug]
    custom_domain VARCHAR(255) UNIQUE,
    ssl_enabled BOOLEAN DEFAULT false,
    
    -- Content customization
    page_title VARCHAR(255) NOT NULL,
    meta_description TEXT,
    customizations JSONB NOT NULL DEFAULT '{}', -- User customizations
    
    -- Business information (extracted from customizations for indexing)
    business_name VARCHAR(255) GENERATED ALWAYS AS (customizations->>'business_name') STORED,
    business_description TEXT GENERATED ALWAYS AS (customizations->>'business_description') STORED,
    contact_email VARCHAR(255) GENERATED ALWAYS AS (customizations->'contact'->>'email') STORED,
    contact_phone VARCHAR(50) GENERATED ALWAYS AS (customizations->'contact'->>'phone') STORED,
    
    -- SEO configuration
    seo_settings JSONB DEFAULT '{}',
    social_media_config JSONB DEFAULT '{}',
    
    -- Analytics integration
    google_analytics_id VARCHAR(50),
    facebook_pixel_id VARCHAR(50),
    
    -- Publishing and status
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    last_published_at TIMESTAMPTZ,
    
    -- Performance tracking
    last_build_at TIMESTAMPTZ,
    build_duration_ms INTEGER,
    lighthouse_score INTEGER,
    
    -- Content management
    revision_number INTEGER DEFAULT 1,
    auto_save_data JSONB, -- For draft saving
    
    -- GDPR compliance
    cookie_consent_enabled BOOLEAN DEFAULT true,
    privacy_policy_url TEXT,
    imprint_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT valid_custom_domain CHECK (custom_domain IS NULL OR custom_domain ~ '^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'),
    CONSTRAINT valid_lighthouse_score CHECK (lighthouse_score IS NULL OR (lighthouse_score >= 0 AND lighthouse_score <= 100))
);

-- Landing Page Components (Reusable content blocks)
CREATE TABLE IF NOT EXISTS landing_page_components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id VARCHAR(50) REFERENCES landing_page_templates(id) ON DELETE CASCADE,
    
    -- Component identification
    component_type VARCHAR(100) NOT NULL, -- 'hero', 'services', 'testimonials', 'contact', etc.
    component_name VARCHAR(255) NOT NULL,
    
    -- Component content
    html_template TEXT NOT NULL,
    css_styles TEXT,
    js_functionality TEXT,
    
    -- Configuration schema
    config_schema JSONB DEFAULT '{}',
    default_values JSONB DEFAULT '{}',
    
    -- Component metadata
    description TEXT,
    preview_image_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Landing Page Revisions (Version control)
CREATE TABLE IF NOT EXISTS landing_page_revisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landing_page_id UUID NOT NULL REFERENCES workshop_landing_pages(id) ON DELETE CASCADE,
    
    -- Revision metadata
    revision_number INTEGER NOT NULL,
    revision_message TEXT,
    
    -- Snapshot of customizations at this revision
    customizations_snapshot JSONB NOT NULL,
    seo_settings_snapshot JSONB,
    
    -- Publishing information
    was_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    
    -- User who made the revision
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(landing_page_id, revision_number)
);

-- Landing Page Analytics (Performance tracking)
CREATE TABLE IF NOT EXISTS landing_page_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landing_page_id UUID NOT NULL REFERENCES workshop_landing_pages(id) ON DELETE CASCADE,
    
    -- Analytics period
    analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Traffic metrics
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0, -- in seconds
    
    -- Conversion metrics
    contact_form_submissions INTEGER DEFAULT 0,
    phone_calls_initiated INTEGER DEFAULT 0,
    chat_conversations_started INTEGER DEFAULT 0,
    appointment_bookings INTEGER DEFAULT 0,
    
    -- Technical metrics
    avg_page_load_time INTEGER DEFAULT 0, -- in milliseconds
    mobile_traffic_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Top referrers and search terms
    top_referrers JSONB DEFAULT '[]',
    top_search_keywords JSONB DEFAULT '[]',
    
    -- Geographic data
    top_cities JSONB DEFAULT '[]',
    top_regions JSONB DEFAULT '[]',
    
    -- Metadata
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(landing_page_id, analytics_date),
    CONSTRAINT valid_percentages CHECK (
        bounce_rate >= 0 AND bounce_rate <= 100 AND
        mobile_traffic_percentage >= 0 AND mobile_traffic_percentage <= 100
    )
);

-- Landing Page Media (Images, videos, assets)
CREATE TABLE IF NOT EXISTS landing_page_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landing_page_id UUID NOT NULL REFERENCES workshop_landing_pages(id) ON DELETE CASCADE,
    
    -- Media information
    media_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'document', 'icon'
    media_category VARCHAR(100), -- 'logo', 'hero', 'gallery', 'service', 'team'
    
    -- File information
    original_filename VARCHAR(255) NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Storage information
    storage_url TEXT NOT NULL,
    cdn_url TEXT,
    thumbnail_url TEXT,
    
    -- Image-specific metadata
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    
    -- Optimization
    is_optimized BOOLEAN DEFAULT false,
    compression_quality INTEGER DEFAULT 85,
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_file_size CHECK (file_size_bytes > 0 AND file_size_bytes <= 10485760), -- 10MB limit
    CONSTRAINT valid_image_dimensions CHECK (
        (media_type != 'image') OR (width > 0 AND height > 0)
    )
);

-- Performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_templates_active ON landing_page_templates(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_templates_category ON landing_page_templates(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_templates_featured ON landing_page_templates(is_featured, sort_order) WHERE is_featured = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workshop_landing_pages_workshop_id ON workshop_landing_pages(workshop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workshop_landing_pages_slug ON workshop_landing_pages(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workshop_landing_pages_custom_domain ON workshop_landing_pages(custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workshop_landing_pages_published ON workshop_landing_pages(is_published, published_at) WHERE is_published = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workshop_landing_pages_template ON workshop_landing_pages(template_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_components_template ON landing_page_components(template_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_components_type ON landing_page_components(component_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_revisions_page_id ON landing_page_revisions(landing_page_id, revision_number DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_analytics_page_date ON landing_page_analytics(landing_page_id, analytics_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_media_page_id ON landing_page_media(landing_page_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_media_type_category ON landing_page_media(media_type, media_category);

-- Full-text search index for templates
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_landing_page_templates_fts 
    ON landing_page_templates USING gin(to_tsvector('german', name || ' ' || description));

-- Auto-update timestamps
CREATE TRIGGER trigger_landing_page_templates_updated_at 
    BEFORE UPDATE ON landing_page_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_workshop_landing_pages_updated_at 
    BEFORE UPDATE ON workshop_landing_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_landing_page_components_updated_at 
    BEFORE UPDATE ON landing_page_components 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Landing page template rendering function
CREATE OR REPLACE FUNCTION render_landing_page(
    p_landing_page_id UUID,
    p_include_analytics BOOLEAN DEFAULT true
) RETURNS JSONB AS $$
DECLARE
    page_data RECORD;
    template_data RECORD;
    rendered_html TEXT;
    customizations JSONB;
    result JSONB;
BEGIN
    -- Get landing page data with template
    SELECT lp.*, lt.template_html, lt.template_css, lt.template_js, lt.name as template_name
    INTO page_data
    FROM workshop_landing_pages lp
    JOIN landing_page_templates lt ON lp.template_id = lt.id
    WHERE lp.id = p_landing_page_id AND lp.is_published = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Landing page not found or not published');
    END IF;
    
    -- Apply customizations to template
    customizations := page_data.customizations;
    rendered_html := page_data.template_html;
    
    -- Replace placeholders in HTML
    rendered_html := replace(rendered_html, '{{business_name}}', COALESCE(customizations->>'business_name', ''));
    rendered_html := replace(rendered_html, '{{business_description}}', COALESCE(customizations->>'business_description', ''));
    rendered_html := replace(rendered_html, '{{contact_email}}', COALESCE(customizations->'contact'->>'email', ''));
    rendered_html := replace(rendered_html, '{{contact_phone}}', COALESCE(customizations->'contact'->>'phone', ''));
    
    -- Build result object
    result := jsonb_build_object(
        'page_id', page_data.id,
        'workshop_id', page_data.workshop_id,
        'template_name', page_data.template_name,
        'slug', page_data.slug,
        'title', page_data.page_title,
        'meta_description', page_data.meta_description,
        'html', rendered_html,
        'css', page_data.template_css,
        'js', page_data.template_js,
        'seo_settings', page_data.seo_settings,
        'customizations', customizations,
        'published_at', page_data.published_at
    );
    
    -- Include analytics if requested
    IF p_include_analytics THEN
        SELECT jsonb_build_object(
            'page_views', COALESCE(SUM(page_views), 0),
            'unique_visitors', COALESCE(SUM(unique_visitors), 0),
            'contact_submissions', COALESCE(SUM(contact_form_submissions), 0),
            'avg_bounce_rate', COALESCE(AVG(bounce_rate), 0)
        )
        INTO template_data
        FROM landing_page_analytics
        WHERE landing_page_id = p_landing_page_id
        AND analytics_date >= CURRENT_DATE - INTERVAL '30 days';
        
        result := result || jsonb_build_object('analytics', template_data);
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Landing page publishing function
CREATE OR REPLACE FUNCTION publish_landing_page(
    p_landing_page_id UUID,
    p_user_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    page_data RECORD;
    build_start TIMESTAMPTZ := NOW();
    build_duration INTEGER;
    revision_num INTEGER;
BEGIN
    -- Get landing page data
    SELECT * INTO page_data
    FROM workshop_landing_pages
    WHERE id = p_landing_page_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Landing page not found');
    END IF;
    
    -- Validate required customizations
    IF NOT (page_data.customizations ? 'business_name') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Business name is required');
    END IF;
    
    -- Create revision
    SELECT COALESCE(MAX(revision_number), 0) + 1
    INTO revision_num
    FROM landing_page_revisions
    WHERE landing_page_id = p_landing_page_id;
    
    INSERT INTO landing_page_revisions (
        landing_page_id,
        revision_number,
        revision_message,
        customizations_snapshot,
        seo_settings_snapshot,
        was_published,
        published_at,
        created_by
    ) VALUES (
        p_landing_page_id,
        revision_num,
        'Published version',
        page_data.customizations,
        page_data.seo_settings,
        true,
        NOW(),
        p_user_id
    );
    
    -- Update landing page publishing status
    build_duration := EXTRACT(epoch FROM (NOW() - build_start)) * 1000; -- milliseconds
    
    UPDATE workshop_landing_pages
    SET 
        is_published = true,
        published_at = NOW(),
        last_published_at = NOW(),
        last_build_at = NOW(),
        build_duration_ms = build_duration,
        revision_number = revision_num
    WHERE id = p_landing_page_id;
    
    -- Record analytics event
    INSERT INTO analytics_events (
        workshop_id,
        event_type,
        event_category,
        event_data
    ) VALUES (
        page_data.workshop_id,
        'landing_page_published',
        'content_management',
        jsonb_build_object(
            'landing_page_id', p_landing_page_id,
            'slug', page_data.slug,
            'template_id', page_data.template_id,
            'build_duration_ms', build_duration
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Landing page published successfully',
        'published_at', NOW(),
        'build_duration_ms', build_duration,
        'revision_number', revision_num,
        'url', 'https://carbot.de/workshop/' || page_data.slug
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE landing_page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_media ENABLE ROW LEVEL SECURITY;

-- Public read access to templates
CREATE POLICY "public_template_access" ON landing_page_templates
    FOR SELECT USING (is_active = true);

-- Workshop-scoped access to landing pages
CREATE POLICY "workshop_landing_pages_access" ON workshop_landing_pages
    FOR ALL USING (
        workshop_id IN (
            SELECT id FROM workshops w
            WHERE w.id IN (
                SELECT workshop_id FROM workshop_users 
                WHERE user_id = auth.uid() AND is_active = true
            ) OR w.owner_id = auth.uid()
        )
    );

-- Service role bypass
CREATE POLICY "service_role_templates" ON landing_page_templates
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_landing_pages" ON workshop_landing_pages
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access to published landing pages
CREATE POLICY "public_published_pages" ON workshop_landing_pages
    FOR SELECT USING (is_published = true);

-- Cascade policies for related tables
CREATE POLICY "workshop_components_access" ON landing_page_components
    FOR ALL USING (auth.role() = 'service_role' OR template_id IN (
        SELECT template_id FROM workshop_landing_pages lp
        WHERE lp.workshop_id IN (
            SELECT id FROM workshops w
            WHERE w.id IN (
                SELECT workshop_id FROM workshop_users 
                WHERE user_id = auth.uid() AND is_active = true
            ) OR w.owner_id = auth.uid()
        )
    ));

CREATE POLICY "workshop_revisions_access" ON landing_page_revisions
    FOR ALL USING (
        landing_page_id IN (
            SELECT id FROM workshop_landing_pages lp
            WHERE lp.workshop_id IN (
                SELECT id FROM workshops w
                WHERE w.id IN (
                    SELECT workshop_id FROM workshop_users 
                    WHERE user_id = auth.uid() AND is_active = true
                ) OR w.owner_id = auth.uid()
            )
        )
    );

CREATE POLICY "workshop_analytics_access" ON landing_page_analytics
    FOR ALL USING (
        landing_page_id IN (
            SELECT id FROM workshop_landing_pages lp
            WHERE lp.workshop_id IN (
                SELECT id FROM workshops w
                WHERE w.id IN (
                    SELECT workshop_id FROM workshop_users 
                    WHERE user_id = auth.uid() AND is_active = true
                ) OR w.owner_id = auth.uid()
            )
        )
    );

CREATE POLICY "workshop_media_access" ON landing_page_media
    FOR ALL USING (
        landing_page_id IN (
            SELECT id FROM workshop_landing_pages lp
            WHERE lp.workshop_id IN (
                SELECT id FROM workshops w
                WHERE w.id IN (
                    SELECT workshop_id FROM workshop_users 
                    WHERE user_id = auth.uid() AND is_active = true
                ) OR w.owner_id = auth.uid()
            )
        )
    );

-- Insert the 5 professional templates for German automotive workshops
INSERT INTO landing_page_templates (id, name, description, category, preview_image_url, color_scheme, target_audience, template_html, template_css, customization_schema, default_config, is_featured) VALUES

-- Template 1: Klassische Werkstatt (Classic Workshop)
('classic-workshop', 'Klassische Werkstatt', 'Traditionelles Design für etablierte Autowerkstätten mit Fokus auf Vertrauen und Erfahrung', 'traditional', '/templates/classic-workshop-preview.jpg', 'blue-white', 'Etablierte Werkstätten mit langjähriger Erfahrung',
'<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{business_name}} - Ihre vertrauensvolle Autowerkstatt</title>
    <meta name="description" content="{{business_description}}">
</head>
<body>
    <header class="classic-header">
        <div class="container">
            <div class="logo">
                <img src="{{logo_url}}" alt="{{business_name}}" class="logo-image">
                <h1>{{business_name}}</h1>
            </div>
            <nav class="main-nav">
                <a href="#services">Leistungen</a>
                <a href="#about">Über uns</a>
                <a href="#contact">Kontakt</a>
            </nav>
        </div>
    </header>
    <main>
        <section class="hero-section">
            <div class="container">
                <h2>{{hero_title}}</h2>
                <p>{{hero_subtitle}}</p>
                <div class="cta-buttons">
                    <a href="tel:{{contact_phone}}" class="btn btn-primary">{{contact_phone}}</a>
                    <a href="#contact" class="btn btn-secondary">Termin vereinbaren</a>
                </div>
            </div>
        </section>
        <section id="services" class="services-section">
            <div class="container">
                <h3>Unsere Leistungen</h3>
                <div class="services-grid">{{services_content}}</div>
            </div>
        </section>
    </main>
</body>
</html>',
'.classic-header { background: #1a365d; color: white; padding: 1rem 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.hero-section { background: linear-gradient(135deg, #2d3748 0%, #1a365d 100%); color: white; padding: 4rem 0; }
.btn { padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; }
.btn-primary { background: #3182ce; color: white; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }',
'{"hero_title": {"type": "text", "label": "Hauptüberschrift"}, "hero_subtitle": {"type": "textarea", "label": "Untertitel"}, "services_content": {"type": "services", "label": "Leistungen"}}',
'{"hero_title": "Zuverlässige Autowerkstatt seit über 25 Jahren", "hero_subtitle": "Professionelle KFZ-Reparaturen und Wartung für alle Marken"}',
true),

-- Template 2: Moderne Autowerkstatt (Modern Auto Workshop)
('modern-auto', 'Moderne Autowerkstatt', 'Zeitgemäßes Design für moderne Betriebe mit Fokus auf Technologie und Effizienz', 'modern', '/templates/modern-auto-preview.jpg', 'orange-gray', 'Moderne Werkstätten mit Fokus auf Technologie',
'<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{business_name}} - Moderne Kfz-Werkstatt</title>
    <meta name="description" content="{{business_description}}">
</head>
<body class="modern-body">
    <header class="modern-header">
        <div class="container">
            <div class="header-content">
                <div class="brand">
                    <img src="{{logo_url}}" alt="{{business_name}}" class="brand-logo">
                    <span class="brand-name">{{business_name}}</span>
                </div>
                <nav class="nav-menu">
                    <a href="#services">Services</a>
                    <a href="#technology">Technologie</a>
                    <a href="#contact">Kontakt</a>
                </nav>
            </div>
        </div>
    </header>
    <section class="hero-modern">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">{{hero_title}}</h1>
                <p class="hero-description">{{hero_subtitle}}</p>
                <div class="hero-actions">
                    <button class="btn-modern primary" onclick="startChat()">Online-Beratung starten</button>
                    <a href="tel:{{contact_phone}}" class="btn-modern secondary">{{contact_phone}}</a>
                </div>
            </div>
        </div>
    </section>
</body>
</html>',
'.modern-body { font-family: "Inter", sans-serif; margin: 0; }
.modern-header { background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%); box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
.hero-modern { background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); padding: 5rem 0; color: white; }
.btn-modern { padding: 1rem 2rem; border-radius: 0.5rem; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.btn-modern.primary { background: #ff6b35; color: white; }',
'{"hero_title": {"type": "text", "label": "Hauptüberschrift"}, "hero_subtitle": {"type": "textarea", "label": "Beschreibung"}, "technology_focus": {"type": "text", "label": "Technologie-Schwerpunkt"}}',
'{"hero_title": "Ihre Hightech-Werkstatt für das 21. Jahrhundert", "hero_subtitle": "Modernste Diagnosetechnik und digitale Services für Ihr Fahrzeug"}',
true),

-- Template 3: Premium Service (Premium Service)
('premium-service', 'Premium Service', 'Luxuriöses Design für hochwertige Kfz-Betriebe mit Premium-Fokus', 'premium', '/templates/premium-service-preview.jpg', 'black-gold', 'Premium-Werkstätten und Luxus-Fahrzeugservice',
'<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{business_name}} - Exklusiver Premium-Service</title>
    <meta name="description" content="{{business_description}}">
</head>
<body class="premium-body">
    <header class="premium-header">
        <div class="container">
            <div class="premium-brand">
                <img src="{{logo_url}}" alt="{{business_name}}" class="premium-logo">
                <h1 class="premium-title">{{business_name}}</h1>
            </div>
            <nav class="premium-nav">
                <a href="#services">Premium Services</a>
                <a href="#excellence">Exzellenz</a>
                <a href="#contact">VIP Kontakt</a>
            </nav>
        </div>
    </header>
    <section class="premium-hero">
        <div class="container">
            <div class="premium-hero-content">
                <h2 class="premium-hero-title">{{hero_title}}</h2>
                <p class="premium-hero-subtitle">{{hero_subtitle}}</p>
                <div class="premium-cta">
                    <a href="#contact" class="btn-premium gold">VIP-Termin vereinbaren</a>
                    <a href="tel:{{contact_phone}}" class="btn-premium outline">{{contact_phone}}</a>
                </div>
            </div>
        </div>
    </section>
</body>
</html>',
'.premium-body { font-family: "Playfair Display", serif; background: #0a0a0a; color: #ffffff; margin: 0; }
.premium-header { background: linear-gradient(90deg, #000000 0%, #1a1a1a 100%); border-bottom: 2px solid #d4af37; }
.premium-hero { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 6rem 0; }
.btn-premium.gold { background: linear-gradient(45deg, #d4af37, #ffd700); color: #000; padding: 1rem 2.5rem; border-radius: 0.25rem; }
.premium-title { font-size: 2rem; color: #d4af37; margin: 0; }',
'{"hero_title": {"type": "text", "label": "Premium-Titel"}, "hero_subtitle": {"type": "textarea", "label": "Exklusivitäts-Botschaft"}, "vip_services": {"type": "services", "label": "VIP-Services"}}',
'{"hero_title": "Exklusiver Premium-Service für anspruchsvolle Fahrzeuge", "hero_subtitle": "Höchste Qualität und persönlicher Service für Luxus- und Premiumfahrzeuge"}',
false),

-- Template 4: Familienbetrieb (Family Business)
('family-business', 'Familienbetrieb', 'Warmes, familienorientiertes Design mit Fokus auf Vertrauen und persönlichen Service', 'family', '/templates/family-business-preview.jpg', 'green-brown', 'Familiengeführte Werkstätten mit persönlichem Touch',
'<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{business_name}} - Ihr Familienbetrieb</title>
    <meta name="description" content="{{business_description}}">
</head>
<body class="family-body">
    <header class="family-header">
        <div class="container">
            <div class="family-brand">
                <img src="{{logo_url}}" alt="{{business_name}}" class="family-logo">
                <div class="brand-text">
                    <h1>{{business_name}}</h1>
                    <span class="family-tagline">{{family_tagline}}</span>
                </div>
            </div>
        </div>
    </header>
    <section class="family-hero">
        <div class="container">
            <div class="hero-grid">
                <div class="hero-text">
                    <h2>{{hero_title}}</h2>
                    <p>{{hero_subtitle}}</p>
                    <div class="family-values">
                        <div class="value-item">
                            <span class="value-icon">🔧</span>
                            <span>Handwerksqualität</span>
                        </div>
                        <div class="value-item">
                            <span class="value-icon">👨‍👩‍👧‍👦</span>
                            <span>Familiäre Betreuung</span>
                        </div>
                        <div class="value-item">
                            <span class="value-icon">⭐</span>
                            <span>Über {{years_experience}} Jahre Erfahrung</span>
                        </div>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="{{hero_image}}" alt="Unser Team">
                </div>
            </div>
        </div>
    </section>
</body>
</html>',
'.family-body { font-family: "Source Sans Pro", sans-serif; background: #faf8f5; color: #2d3748; margin: 0; }
.family-header { background: linear-gradient(90deg, #68d391 0%, #4fd1c7 100%); padding: 1rem 0; }
.family-hero { padding: 4rem 0; }
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.family-values { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
.value-item { display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; }',
'{"family_tagline": {"type": "text", "label": "Familien-Slogan"}, "years_experience": {"type": "number", "label": "Jahre Erfahrung"}, "hero_image": {"type": "image", "label": "Team-Foto"}}',
'{"family_tagline": "Seit 1987 in Familienhand", "years_experience": 37, "hero_title": "Vertrauen Sie auf drei Generationen Handwerkskunst"}',
false),

-- Template 5: Elektro & Hybrid Spezialist (Electric & Hybrid Specialist)
('eco-specialist', 'Elektro & Hybrid Spezialist', 'Modernes, umweltbewusstes Design für E-Mobilität und Hybrid-Fahrzeuge', 'eco', '/templates/eco-specialist-preview.jpg', 'green-blue', 'Werkstätten mit Fokus auf Elektro- und Hybrid-Fahrzeuge',
'<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{business_name}} - Elektro & Hybrid Spezialist</title>
    <meta name="description" content="{{business_description}}">
</head>
<body class="eco-body">
    <header class="eco-header">
        <div class="container">
            <div class="eco-brand">
                <img src="{{logo_url}}" alt="{{business_name}}" class="eco-logo">
                <h1>{{business_name}}</h1>
                <span class="eco-badge">E-Mobilität Experte</span>
            </div>
            <nav class="eco-nav">
                <a href="#services">E-Services</a>
                <a href="#technology">Technologie</a>
                <a href="#sustainability">Nachhaltigkeit</a>
                <a href="#contact">Kontakt</a>
            </nav>
        </div>
    </header>
    <section class="eco-hero">
        <div class="container">
            <div class="eco-hero-content">
                <h2>{{hero_title}}</h2>
                <p>{{hero_subtitle}}</p>
                <div class="sustainability-badges">
                    <div class="badge">🔋 Elektro-Zertifiziert</div>
                    <div class="badge">🌱 CO₂-Neutral</div>
                    <div class="badge">⚡ Schnellladung</div>
                </div>
                <div class="eco-cta">
                    <a href="#contact" class="btn-eco primary">E-Check vereinbaren</a>
                    <a href="#charging" class="btn-eco secondary">Ladestation finden</a>
                </div>
            </div>
        </div>
    </section>
</body>
</html>',
'.eco-body { font-family: "Nunito", sans-serif; background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%); margin: 0; }
.eco-header { background: linear-gradient(90deg, #38b2ac 0%, #48bb78 100%); color: white; }
.eco-hero { padding: 5rem 0; color: #1a365d; }
.sustainability-badges { display: flex; gap: 1rem; margin: 2rem 0; }
.badge { background: rgba(56, 178, 172, 0.1); padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 600; color: #38b2ac; }
.btn-eco.primary { background: linear-gradient(45deg, #38b2ac, #48bb78); color: white; padding: 1rem 2rem; border-radius: 0.5rem; }',
'{"hero_title": {"type": "text", "label": "Umwelt-Titel"}, "hero_subtitle": {"type": "textarea", "label": "Nachhaltigkeits-Botschaft"}, "certifications": {"type": "text", "label": "Zertifizierungen"}}',
'{"hero_title": "Die Zukunft der Mobilität – heute bei uns", "hero_subtitle": "Spezialisiert auf Elektro- und Hybrid-Fahrzeuge. Nachhaltig, innovativ, zuverlässig."}',
true)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    preview_image_url = EXCLUDED.preview_image_url,
    template_html = EXCLUDED.template_html,
    template_css = EXCLUDED.template_css,
    customization_schema = EXCLUDED.customization_schema,
    default_config = EXCLUDED.default_config,
    updated_at = NOW();

-- Success notification
SELECT 'Landing Page Templates System created successfully! 🎨' as message,
       'Features: 5 professional templates, customization engine, publishing system, analytics' as features,
       'German market: Automotive-focused templates for workshops' as market_focus;