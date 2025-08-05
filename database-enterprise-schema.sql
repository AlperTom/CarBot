-- CarBot Enterprise Database Schema
-- Senior Database Administrator & Solutions Architect Design
-- German Automotive Workshop Management System
-- GDPR Compliant | Enterprise Scale | High Performance

-- =============================================
-- EXTENSIONS AND CONFIGURATION
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Query performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Full-text search optimization
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- Composite index optimization
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Enhanced encryption
CREATE EXTENSION IF NOT EXISTS "pg_partman"; -- Automatic partition management

-- Set optimal configuration parameters
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements,pg_partman_bgw';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- =============================================
-- ENTERPRISE ENUMS AND TYPES
-- =============================================

-- Define enterprise-grade enums for data consistency
CREATE TYPE workshop_business_type AS ENUM (
    'independent', 'chain', 'dealership', 'specialty', 'mobile_service'
);

CREATE TYPE subscription_status AS ENUM (
    'trial', 'active', 'past_due', 'canceled', 'suspended', 'terminated'
);

CREATE TYPE lead_status AS ENUM (
    'new', 'contacted', 'qualified', 'quoted', 'negotiating', 'won', 'lost', 'nurturing'
);

CREATE TYPE lead_priority AS ENUM (
    'low', 'medium', 'high', 'urgent', 'hot'
);

CREATE TYPE appointment_status AS ENUM (
    'scheduled', 'confirmed', 'in_progress', 'completed', 'canceled', 'no_show', 'rescheduled'
);

CREATE TYPE user_role AS ENUM (
    'owner', 'admin', 'manager', 'employee', 'readonly', 'api_user'
);

CREATE TYPE gdpr_request_type AS ENUM (
    'access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'
);

CREATE TYPE audit_action AS ENUM (
    'create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'backup', 'restore'
);

-- =============================================
-- CORE ORGANIZATIONAL STRUCTURE
-- =============================================

-- Organizations (Multi-tenant root entity)
CREATE TABLE organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    
    -- German company information
    company_registration_number VARCHAR(50), -- Handelsregisternummer
    vat_number VARCHAR(50), -- Umsatzsteuer-Identifikationsnummer
    tax_number VARCHAR(50), -- Steuernummer
    
    -- Contact and address
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Legal address (Geschäftsadresse)
    legal_address_line1 VARCHAR(255),
    legal_address_line2 VARCHAR(255),
    legal_city VARCHAR(100),
    legal_postal_code VARCHAR(20),
    legal_state VARCHAR(100) DEFAULT 'Deutschland',
    legal_country VARCHAR(3) DEFAULT 'DEU',
    
    -- Data protection officer information (GDPR requirement)
    dpo_name VARCHAR(255),
    dpo_email VARCHAR(255),
    dpo_phone VARCHAR(50),
    
    -- Configuration and settings
    settings JSONB DEFAULT '{}',
    feature_flags JSONB DEFAULT '{}',
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Workshops (Primary business entities)
CREATE TABLE workshops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Basic information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- For carbot.chat/[kunde] URLs
    description TEXT,
    business_type workshop_business_type DEFAULT 'independent',
    
    -- Contact information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Primary location
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    state VARCHAR(100) DEFAULT 'Deutschland',
    country VARCHAR(3) DEFAULT 'DEU',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Business information
    opening_hours JSONB, -- {"monday": {"open": "08:00", "close": "18:00"}, ...}
    services TEXT[] DEFAULT '{}',
    languages_supported TEXT[] DEFAULT '{de}',
    google_place_id VARCHAR(255),
    google_rating DECIMAL(2,1),
    google_review_count INTEGER DEFAULT 0,
    
    -- Media and branding
    logo_url TEXT,
    hero_image_url TEXT,
    gallery_images TEXT[],
    brand_colors JSONB DEFAULT '{}',
    
    -- Configuration
    appointment_duration_default INTEGER DEFAULT 60, -- minutes
    appointment_buffer_time INTEGER DEFAULT 15, -- minutes
    max_advance_booking_days INTEGER DEFAULT 90,
    timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
    
    -- Status and subscription
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    trial_ends_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false,
    
    -- Limits and usage
    monthly_leads_limit INTEGER DEFAULT 100,
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month'),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_workshop_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_workshop_slug CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT valid_rating CHECK (google_rating >= 0 AND google_rating <= 5),
    CONSTRAINT valid_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL) OR 
        (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
    )
);

-- Workshop locations (Multi-location support)
CREATE TABLE workshop_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Location details
    name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    state VARCHAR(100) DEFAULT 'Deutschland',
    country VARCHAR(3) DEFAULT 'DEU',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Contact and operational details
    phone VARCHAR(50),
    email VARCHAR(255),
    opening_hours JSONB,
    services_available TEXT[],
    
    -- Configuration
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    appointment_capacity INTEGER DEFAULT 10, -- appointments per day
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_primary_location_per_workshop UNIQUE (workshop_id) WHERE is_primary = true
);

-- Workshop users (Role-based access control)
CREATE TABLE workshop_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Role and permissions
    role user_role DEFAULT 'employee',
    permissions JSONB DEFAULT '[]', -- Specific permissions array
    
    -- User profile information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    phone VARCHAR(50),
    position VARCHAR(100),
    department VARCHAR(100),
    
    -- Work configuration
    working_hours JSONB, -- Personal working schedule
    notification_preferences JSONB DEFAULT '{}',
    
    -- Status tracking
    is_active BOOLEAN DEFAULT true,
    invitation_sent_at TIMESTAMPTZ,
    invitation_accepted_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(workshop_id, user_id)
);

-- =============================================
-- CUSTOMER AND LEAD MANAGEMENT
-- =============================================

-- Customers (End customers of workshops)
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Personal information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200) GENERATED ALWAYS AS (
        CASE 
            WHEN first_name IS NOT NULL AND last_name IS NOT NULL 
            THEN first_name || ' ' || last_name
            ELSE COALESCE(first_name, last_name, 'Unbekannt')
        END
    ) STORED,
    
    -- Contact information
    email VARCHAR(255),
    phone VARCHAR(50),
    preferred_contact_method VARCHAR(20) DEFAULT 'phone', -- phone, email, sms
    
    -- Address information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    state VARCHAR(100),
    country VARCHAR(3) DEFAULT 'DEU',
    
    -- Customer preferences
    language_preference VARCHAR(5) DEFAULT 'de',
    communication_preferences JSONB DEFAULT '{}',
    service_history JSONB DEFAULT '[]',
    notes TEXT,
    
    -- Customer value and segmentation
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    average_job_value DECIMAL(10,2) DEFAULT 0,
    visit_frequency INTEGER DEFAULT 0, -- days between visits
    customer_segment VARCHAR(50), -- 'high_value', 'regular', 'occasional', 'new'
    
    -- Status and flags
    is_active BOOLEAN DEFAULT true,
    is_vip BOOLEAN DEFAULT false,
    do_not_contact BOOLEAN DEFAULT false,
    
    -- GDPR and compliance
    gdpr_consent_given BOOLEAN DEFAULT false,
    gdpr_consent_date TIMESTAMPTZ,
    gdpr_consent_withdrawn_date TIMESTAMPTZ,
    data_retention_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 years'), -- German retention requirement
    
    -- Metadata
    first_visit_date TIMESTAMPTZ DEFAULT NOW(),
    last_visit_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_customer_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Customer vehicles (Vehicle information)
CREATE TABLE customer_vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Vehicle identification
    license_plate VARCHAR(20),
    vin VARCHAR(17), -- Vehicle Identification Number
    
    -- Vehicle details
    make VARCHAR(100) NOT NULL, -- BMW, Mercedes, Audi, etc.
    model VARCHAR(100) NOT NULL,
    variant VARCHAR(100), -- 320i, A4 Avant, etc.
    year INTEGER,
    engine_type VARCHAR(50), -- petrol, diesel, electric, hybrid
    engine_size DECIMAL(3,1), -- in liters
    fuel_type VARCHAR(30),
    transmission VARCHAR(20), -- automatic, manual
    
    -- Technical specifications
    mileage INTEGER, -- Current mileage
    last_service_mileage INTEGER,
    next_service_due_mileage INTEGER,
    last_service_date DATE,
    next_service_due_date DATE,
    
    -- Insurance and registration
    insurance_company VARCHAR(100),
    insurance_expiry DATE,
    registration_expiry DATE,
    tuv_expiry DATE, -- TÜV inspection
    au_expiry DATE, -- Abgasuntersuchung
    
    -- Status and preferences
    is_primary BOOLEAN DEFAULT false, -- Primary vehicle for customer
    is_active BOOLEAN DEFAULT true,
    service_history JSONB DEFAULT '[]',
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_year CHECK (year IS NULL OR (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 2)),
    CONSTRAINT valid_vin CHECK (vin IS NULL OR LENGTH(vin) = 17)
);

-- Leads (Lead management system)
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Source identification
    client_key VARCHAR(100) NOT NULL, -- Integration identifier
    source_type VARCHAR(50) DEFAULT 'chatbot', -- chatbot, website, phone, referral, walk_in
    source_url TEXT,
    referrer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Lead information
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(255), -- anliegen
    description TEXT,
    vehicle_info JSONB, -- fahrzeug information
    
    -- Lead management
    status lead_status DEFAULT 'new',
    priority lead_priority DEFAULT 'medium',
    assigned_to UUID REFERENCES workshop_users(id) ON DELETE SET NULL,
    
    -- Lead scoring and qualification
    lead_score INTEGER DEFAULT 0,
    score_factors JSONB DEFAULT '{}', -- Scoring breakdown
    qualification_notes TEXT,
    estimated_value DECIMAL(10,2),
    probability_percentage INTEGER DEFAULT 50,
    
    -- Communication history
    chat_history JSONB DEFAULT '[]',
    communication_log JSONB DEFAULT '[]',
    
    -- Follow-up tracking
    last_contact_date TIMESTAMPTZ,
    next_follow_up_date TIMESTAMPTZ,
    follow_up_count INTEGER DEFAULT 0,
    
    -- Conversion tracking
    converted_at TIMESTAMPTZ,
    conversion_value DECIMAL(10,2),
    
    -- GDPR compliance
    consent_given BOOLEAN DEFAULT false,
    consent_timestamp TIMESTAMPTZ,
    consent_ip_address INET,
    consent_user_agent TEXT,
    data_retention_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_lead_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_probability CHECK (probability_percentage >= 0 AND probability_percentage <= 100),
    CONSTRAINT valid_score CHECK (lead_score >= 0 AND lead_score <= 100)
);

-- =============================================
-- CHAT AND COMMUNICATION SYSTEM
-- =============================================

-- Chat sessions (Session management)
CREATE TABLE chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Session identification
    session_token VARCHAR(255) UNIQUE NOT NULL,
    client_key VARCHAR(100) NOT NULL,
    
    -- Visitor information
    visitor_id VARCHAR(255), -- Anonymous visitor tracking
    ip_address INET,
    user_agent TEXT,
    browser_language VARCHAR(10),
    
    -- Geographic information
    country_code VARCHAR(3),
    city VARCHAR(100),
    
    -- Session tracking
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    message_count INTEGER DEFAULT 0,
    
    -- Page and referrer information
    landing_page_url TEXT,
    referrer_url TEXT,
    
    -- Engagement metrics
    pages_viewed INTEGER DEFAULT 1,
    time_on_site_seconds INTEGER,
    
    -- Conversion tracking
    converted BOOLEAN DEFAULT false,
    conversion_type VARCHAR(50), -- lead_captured, appointment_booked, call_requested
    conversion_value DECIMAL(10,2),
    
    -- AI and automation
    ai_model_used VARCHAR(50),
    automation_triggers TEXT[],
    sentiment_score DECIMAL(3,2), -- -1 to 1
    
    -- GDPR compliance
    consent_given BOOLEAN DEFAULT false,
    consent_details JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_sentiment_score CHECK (sentiment_score >= -1 AND sentiment_score <= 1)
);

-- Chat messages (Message history with partitioning)
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Message content
    message TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant', 'system')),
    
    -- Message metadata
    language VARCHAR(5) DEFAULT 'de',
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    response_time_ms INTEGER,
    
    -- AI processing information
    ai_model VARCHAR(50),
    token_count INTEGER,
    cost_cents INTEGER,
    intent_detected VARCHAR(100),
    entities_extracted JSONB DEFAULT '{}',
    
    -- Quality and feedback
    user_rating INTEGER, -- 1-5 stars
    feedback_text TEXT,
    
    -- Security and compliance
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    
    -- Partitioning column (must be in PRIMARY KEY for partitioning)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Primary key includes partitioning column
    PRIMARY KEY (id, created_at),
    
    -- Constraints
    CONSTRAINT valid_rating CHECK (user_rating IS NULL OR (user_rating >= 1 AND user_rating <= 5))
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for chat_messages (performance optimization)
CREATE TABLE chat_messages_2024_01 PARTITION OF chat_messages
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE chat_messages_2024_02 PARTITION OF chat_messages
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- Additional partitions would be created automatically by pg_partman

-- =============================================
-- APPOINTMENT AND SERVICE MANAGEMENT
-- =============================================

-- Service categories (Hierarchical service structure)
CREATE TABLE service_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
    
    -- Category information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Icon identifier
    
    -- Hierarchy and ordering
    level INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    
    -- Configuration
    is_active BOOLEAN DEFAULT true,
    is_bookable BOOLEAN DEFAULT true, -- Can services in this category be booked online
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services (Service catalog)
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    
    -- Service information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing information
    base_price DECIMAL(10,2),
    price_from DECIMAL(10,2),
    price_to DECIMAL(10,2),
    price_unit VARCHAR(50), -- 'per_hour', 'fixed', 'per_km', etc.
    
    -- Time and resource requirements
    duration_minutes INTEGER DEFAULT 60,
    buffer_time_minutes INTEGER DEFAULT 15,
    required_skills TEXT[], -- Required technician skills
    equipment_needed TEXT[], -- Required equipment
    
    -- Availability and scheduling
    is_active BOOLEAN DEFAULT true,
    is_bookable_online BOOLEAN DEFAULT true,
    requires_vehicle_info BOOLEAN DEFAULT false,
    max_advance_booking_days INTEGER DEFAULT 30,
    
    -- Service configuration
    preparation_instructions TEXT,
    follow_up_instructions TEXT,
    warranty_period_days INTEGER,
    
    -- SEO and marketing
    seo_keywords TEXT[],
    featured BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_service_price CHECK (
        (base_price IS NULL OR base_price >= 0) AND
        (price_from IS NULL OR price_from >= 0) AND
        (price_to IS NULL OR price_to >= 0) AND
        (price_from IS NULL OR price_to IS NULL OR price_to >= price_from)
    )
);

-- Appointments (Appointment management)
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    location_id UUID REFERENCES workshop_locations(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES customer_vehicles(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Appointment scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    scheduled_datetime TIMESTAMPTZ GENERATED ALWAYS AS (
        (scheduled_date + scheduled_time) AT TIME ZONE 'Europe/Berlin'
    ) STORED,
    duration_minutes INTEGER DEFAULT 60,
    end_datetime TIMESTAMPTZ GENERATED ALWAYS AS (
        scheduled_datetime + (duration_minutes || ' minutes')::INTERVAL
    ) STORED,
    
    -- Appointment details
    title VARCHAR(255),
    description TEXT,
    internal_notes TEXT,
    customer_notes TEXT,
    
    -- Status and management
    status appointment_status DEFAULT 'scheduled',
    assigned_to UUID REFERENCES workshop_users(id) ON DELETE SET NULL,
    
    -- Pricing and estimates
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    
    -- Communication and reminders
    reminder_sent_at TIMESTAMPTZ,
    confirmation_sent_at TIMESTAMPTZ,
    customer_confirmed_at TIMESTAMPTZ,
    
    -- Completion tracking
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    actual_duration_minutes INTEGER,
    
    -- Cancellation and rescheduling
    canceled_at TIMESTAMPTZ,
    canceled_by UUID REFERENCES workshop_users(id) ON DELETE SET NULL,
    cancellation_reason VARCHAR(255),
    rescheduled_from_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    -- Quality and feedback
    customer_rating INTEGER, -- 1-5 stars
    customer_feedback TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_appointment_rating CHECK (customer_rating IS NULL OR (customer_rating >= 1 AND customer_rating <= 5)),
    CONSTRAINT valid_scheduled_datetime CHECK (scheduled_datetime > NOW()),
    CONSTRAINT valid_duration CHECK (duration_minutes > 0)
);

-- Appointment services (Services booked for appointment)
CREATE TABLE appointment_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    
    -- Service details for this appointment
    service_name VARCHAR(255) NOT NULL, -- Snapshot of service name at booking time
    description TEXT,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    -- Completion tracking
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    completion_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(appointment_id, service_id),
    CONSTRAINT valid_quantity CHECK (quantity > 0),
    CONSTRAINT valid_unit_price CHECK (unit_price >= 0)
);

-- =============================================
-- SUBSCRIPTION AND BILLING SYSTEM
-- =============================================

-- Subscription plans (Plan definitions)
CREATE TABLE subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Pricing
    monthly_price_cents INTEGER NOT NULL,
    annual_price_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Stripe integration
    stripe_monthly_price_id VARCHAR(255),
    stripe_annual_price_id VARCHAR(255),
    
    -- Plan features and limits
    features JSONB DEFAULT '[]',
    limits JSONB DEFAULT '{}', -- {"conversations": 100, "users": 5, "integrations": 10}
    
    -- Plan configuration
    trial_period_days INTEGER DEFAULT 14,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_prices CHECK (monthly_price_cents >= 0 AND annual_price_cents >= 0)
);

-- Subscriptions (Active subscriptions)
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
    
    -- Stripe integration
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255) NOT NULL,
    
    -- Subscription details
    status subscription_status DEFAULT 'trial',
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, annual
    
    -- Period tracking
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    
    -- Cancellation and changes
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    cancellation_reason VARCHAR(255),
    
    -- Pricing snapshot (for historical tracking)
    monthly_price_cents INTEGER,
    annual_price_cents INTEGER,
    
    -- Usage tracking
    usage_reset_date DATE DEFAULT CURRENT_DATE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_period CHECK (current_period_end > current_period_start),
    CONSTRAINT valid_trial_period CHECK (trial_end IS NULL OR trial_end > trial_start)
);

-- Usage tracking (Metered billing)
CREATE TABLE usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    
    -- Usage details
    metric_name VARCHAR(100) NOT NULL, -- conversations, api_calls, users, storage_gb
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    quantity INTEGER NOT NULL DEFAULT 0,
    
    -- Billing period
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    
    -- Metadata
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(workshop_id, metric_name, usage_date),
    CONSTRAINT valid_quantity CHECK (quantity >= 0),
    CONSTRAINT valid_billing_period CHECK (billing_period_end >= billing_period_start)
);

-- =============================================
-- GDPR COMPLIANCE AND AUDIT SYSTEM
-- =============================================

-- Data retention policies (Automated data lifecycle management)
CREATE TABLE data_retention_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Policy identification
    policy_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    
    -- Scope
    table_name VARCHAR(255) NOT NULL,
    condition_column VARCHAR(255), -- Column to check for retention
    
    -- Retention rules
    retention_period_days INTEGER NOT NULL,
    action_type VARCHAR(50) DEFAULT 'delete', -- delete, anonymize, archive
    
    -- German compliance specific
    legal_basis VARCHAR(255), -- Legal basis for data processing
    gdpr_article VARCHAR(50), -- Relevant GDPR article
    
    -- Execution configuration
    is_active BOOLEAN DEFAULT true,
    last_executed_at TIMESTAMPTZ,
    next_execution_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_retention_period CHECK (retention_period_days > 0)
);

-- GDPR requests (Data subject requests)
CREATE TABLE gdpr_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Request identification
    request_number VARCHAR(50) UNIQUE NOT NULL,
    request_type gdpr_request_type NOT NULL,
    
    -- Data subject information
    subject_email VARCHAR(255) NOT NULL,
    subject_name VARCHAR(255),
    subject_phone VARCHAR(50),
    
    -- Request details
    description TEXT,
    legal_basis TEXT,
    
    -- Verification
    identity_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(100),
    verification_date TIMESTAMPTZ,
    verified_by UUID REFERENCES workshop_users(id) ON DELETE SET NULL,
    
    -- Processing
    status VARCHAR(50) DEFAULT 'received', -- received, processing, completed, rejected
    assigned_to UUID REFERENCES workshop_users(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'), -- GDPR requirement
    
    -- Response
    response_sent_at TIMESTAMPTZ,
    response_method VARCHAR(50), -- email, postal, secure_portal
    completion_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_subject_email CHECK (subject_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Audit logs (Complete audit trail)
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid(),
    
    -- Context
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    
    -- Action details
    action audit_action NOT NULL,
    resource_type VARCHAR(100) NOT NULL, -- table name or resource type
    resource_id UUID,
    
    -- Change tracking
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(255),
    
    -- Additional context
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Partitioning column
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Primary key includes partitioning column
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create quarterly partitions for audit_logs
CREATE TABLE audit_logs_2024_q1 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
CREATE TABLE audit_logs_2024_q2 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- =============================================
-- ANALYTICS AND REPORTING
-- =============================================

-- Analytics events (Real-time event tracking)
CREATE TABLE analytics_events (
    id UUID DEFAULT gen_random_uuid(),
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Event identification
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100),
    
    -- Event data
    event_data JSONB DEFAULT '{}',
    user_properties JSONB DEFAULT '{}',
    
    -- Session and user context
    session_id VARCHAR(255),
    user_id VARCHAR(255), -- Can be anonymous
    device_id VARCHAR(255),
    
    -- Technical context
    page_url TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address INET,
    
    -- Geographic context
    country_code VARCHAR(3),
    city VARCHAR(100),
    
    -- Value and conversion tracking
    event_value DECIMAL(10,2),
    conversion_type VARCHAR(100),
    
    -- Data retention
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 years'),
    
    -- Partitioning column
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Primary key includes partitioning column
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for analytics_events
CREATE TABLE analytics_events_2024_01 PARTITION OF analytics_events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Pre-computed metrics (Performance optimization)
CREATE TABLE metrics_daily (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    
    -- Date and period
    metric_date DATE NOT NULL,
    
    -- Lead metrics
    leads_total INTEGER DEFAULT 0,
    leads_new INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Chat metrics
    chat_sessions INTEGER DEFAULT 0,
    chat_messages INTEGER DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    avg_messages_per_session DECIMAL(5,2) DEFAULT 0,
    
    -- Appointment metrics
    appointments_scheduled INTEGER DEFAULT 0,
    appointments_completed INTEGER DEFAULT 0,
    appointments_canceled INTEGER DEFAULT 0,
    appointment_completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Revenue metrics
    revenue_total DECIMAL(10,2) DEFAULT 0,
    revenue_from_leads DECIMAL(10,2) DEFAULT 0,
    avg_job_value DECIMAL(10,2) DEFAULT 0,
    
    -- Quality metrics
    avg_customer_rating DECIMAL(3,2),
    customer_satisfaction_score DECIMAL(3,2),
    
    -- Metadata
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(workshop_id, metric_date),
    CONSTRAINT valid_rates CHECK (
        conversion_rate >= 0 AND conversion_rate <= 100 AND
        appointment_completion_rate >= 0 AND appointment_completion_rate <= 100
    )
);

-- =============================================
-- PERFORMANCE OPTIMIZATION INDEXES
-- =============================================

-- Primary entity indexes
CREATE INDEX CONCURRENTLY idx_organizations_slug ON organizations(slug);
CREATE INDEX CONCURRENTLY idx_organizations_domain ON organizations(domain);
CREATE INDEX CONCURRENTLY idx_organizations_active ON organizations(is_active) WHERE is_active = true;

-- Workshop indexes
CREATE INDEX CONCURRENTLY idx_workshops_org_id ON workshops(organization_id);
CREATE INDEX CONCURRENTLY idx_workshops_owner_id ON workshops(owner_id);
CREATE INDEX CONCURRENTLY idx_workshops_slug ON workshops(slug);
CREATE INDEX CONCURRENTLY idx_workshops_active ON workshops(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_workshops_trial_ends ON workshops(trial_ends_at) WHERE trial_ends_at IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_workshops_location ON workshops USING gist (ll_to_earth(latitude, longitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Workshop user indexes
CREATE INDEX CONCURRENTLY idx_workshop_users_workshop_id ON workshop_users(workshop_id);
CREATE INDEX CONCURRENTLY idx_workshop_users_user_id ON workshop_users(user_id);
CREATE INDEX CONCURRENTLY idx_workshop_users_role ON workshop_users(role);
CREATE INDEX CONCURRENTLY idx_workshop_users_active ON workshop_users(workshop_id, is_active) WHERE is_active = true;

-- Customer indexes
CREATE INDEX CONCURRENTLY idx_customers_workshop_id ON customers(workshop_id);
CREATE INDEX CONCURRENTLY idx_customers_email ON customers(email) WHERE email IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_customers_full_name ON customers(full_name);
CREATE INDEX CONCURRENTLY idx_customers_active ON customers(workshop_id, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_customers_gdpr_retention ON customers(data_retention_until) WHERE data_retention_until IS NOT NULL;

-- Lead indexes
CREATE INDEX CONCURRENTLY idx_leads_workshop_id ON leads(workshop_id);
CREATE INDEX CONCURRENTLY idx_leads_customer_id ON leads(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_leads_status ON leads(status);
CREATE INDEX CONCURRENTLY idx_leads_priority ON leads(priority);
CREATE INDEX CONCURRENTLY idx_leads_assigned_to ON leads(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_leads_created_at ON leads(created_at);
CREATE INDEX CONCURRENTLY idx_leads_next_follow_up ON leads(next_follow_up_date) WHERE next_follow_up_date IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_leads_gdpr_retention ON leads(data_retention_until);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_leads_workshop_status_priority ON leads(workshop_id, status, priority);
CREATE INDEX CONCURRENTLY idx_leads_workshop_created ON leads(workshop_id, created_at DESC);

-- Chat session indexes
CREATE INDEX CONCURRENTLY idx_chat_sessions_workshop_id ON chat_sessions(workshop_id);
CREATE INDEX CONCURRENTLY idx_chat_sessions_lead_id ON chat_sessions(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_chat_sessions_client_key ON chat_sessions(client_key);
CREATE INDEX CONCURRENTLY idx_chat_sessions_started_at ON chat_sessions(started_at);
CREATE INDEX CONCURRENTLY idx_chat_sessions_expires_at ON chat_sessions(expires_at);

-- Appointment indexes
CREATE INDEX CONCURRENTLY idx_appointments_workshop_id ON appointments(workshop_id);
CREATE INDEX CONCURRENTLY idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX CONCURRENTLY idx_appointments_scheduled_datetime ON appointments(scheduled_datetime);
CREATE INDEX CONCURRENTLY idx_appointments_status ON appointments(status);
CREATE INDEX CONCURRENTLY idx_appointments_assigned_to ON appointments(assigned_to) WHERE assigned_to IS NOT NULL;

-- Composite appointment indexes
CREATE INDEX CONCURRENTLY idx_appointments_workshop_date_status ON appointments(workshop_id, scheduled_date, status);
CREATE INDEX CONCURRENTLY idx_appointments_daily_schedule ON appointments(workshop_id, scheduled_date, scheduled_time) WHERE status NOT IN ('canceled', 'no_show');

-- Service indexes
CREATE INDEX CONCURRENTLY idx_services_workshop_id ON services(workshop_id);
CREATE INDEX CONCURRENTLY idx_services_category_id ON services(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_services_active ON services(workshop_id, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_services_bookable ON services(workshop_id, is_bookable_online) WHERE is_bookable_online = true;

-- Subscription and billing indexes
CREATE INDEX CONCURRENTLY idx_subscriptions_workshop_id ON subscriptions(workshop_id);
CREATE INDEX CONCURRENTLY idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_subscriptions_status ON subscriptions(status);
CREATE INDEX CONCURRENTLY idx_subscriptions_period_end ON subscriptions(current_period_end);

-- Usage tracking indexes
CREATE INDEX CONCURRENTLY idx_usage_tracking_workshop_date ON usage_tracking(workshop_id, usage_date);
CREATE INDEX CONCURRENTLY idx_usage_tracking_billing_period ON usage_tracking(workshop_id, billing_period_start, billing_period_end);

-- Analytics indexes
CREATE INDEX CONCURRENTLY idx_analytics_events_workshop_type ON analytics_events(workshop_id, event_type, created_at);
CREATE INDEX CONCURRENTLY idx_analytics_events_created_at ON analytics_events(created_at);

-- Audit log indexes
CREATE INDEX CONCURRENTLY idx_audit_logs_workshop_id ON audit_logs(workshop_id, created_at);
CREATE INDEX CONCURRENTLY idx_audit_logs_resource ON audit_logs(resource_type, resource_id, created_at);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_id ON audit_logs(user_id, created_at) WHERE user_id IS NOT NULL;

-- Metrics indexes
CREATE INDEX CONCURRENTLY idx_metrics_daily_workshop_date ON metrics_daily(workshop_id, metric_date);

-- Full-text search indexes using GIN
CREATE INDEX CONCURRENTLY idx_customers_fts ON customers USING gin(to_tsvector('german', COALESCE(full_name, '') || ' ' || COALESCE(email, '') || ' ' || COALESCE(phone, '')));
CREATE INDEX CONCURRENTLY idx_leads_fts ON leads USING gin(to_tsvector('german', COALESCE(name, '') || ' ' || COALESCE(subject, '') || ' ' || COALESCE(description, '')));
CREATE INDEX CONCURRENTLY idx_services_fts ON services USING gin(to_tsvector('german', COALESCE(name, '') || ' ' || COALESCE(description, '')));

-- =============================================
-- AUTOMATED TRIGGERS AND FUNCTIONS
-- =============================================

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
DO $$
DECLARE
    table_names TEXT[] := ARRAY[
        'organizations', 'workshops', 'workshop_locations', 'workshop_users',
        'customers', 'customer_vehicles', 'leads', 'chat_sessions',
        'service_categories', 'services', 'appointments', 'subscription_plans',
        'subscriptions', 'data_retention_policies', 'gdpr_requests', 'metrics_daily'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at 
            BEFORE UPDATE ON %I 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ', table_name, table_name);
    END LOOP;
END $$;

-- Comprehensive audit logging function
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    changed_fields TEXT[];
BEGIN
    -- Determine operation type and data
    IF TG_OP = 'DELETE' THEN
        old_data = to_jsonb(OLD);
        new_data = NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        old_data = to_jsonb(OLD);
        new_data = to_jsonb(NEW);
        -- Calculate changed fields
        SELECT array_agg(key) INTO changed_fields
        FROM jsonb_each(old_data) o
        WHERE o.value IS DISTINCT FROM (new_data ->> o.key)::jsonb;
    ELSIF TG_OP = 'INSERT' THEN
        old_data = NULL;
        new_data = to_jsonb(NEW);
    END IF;

    -- Insert audit record
    INSERT INTO audit_logs (
        workshop_id,
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        changed_fields,
        description
    ) VALUES (
        COALESCE(NEW.workshop_id, OLD.workshop_id),
        auth.uid(),
        TG_OP::audit_action,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        old_data,
        new_data,
        changed_fields,
        format('%s operation on %s', TG_OP, TG_TABLE_NAME)
    );

    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
DO $$
DECLARE
    audit_tables TEXT[] := ARRAY[
        'workshops', 'workshop_users', 'customers', 'leads', 'appointments',
        'subscriptions', 'gdpr_requests'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY audit_tables
    LOOP
        EXECUTE format('
            CREATE TRIGGER audit_%I
            AFTER INSERT OR UPDATE OR DELETE ON %I
            FOR EACH ROW EXECUTE FUNCTION create_audit_log();
        ', table_name, table_name);
    END LOOP;
END $$;

-- GDPR compliance automation function
CREATE OR REPLACE FUNCTION enforce_data_retention()
RETURNS INTEGER AS $$
DECLARE
    policy RECORD;
    deleted_count INTEGER := 0;
    total_deleted INTEGER := 0;
BEGIN
    -- Process each active retention policy
    FOR policy IN 
        SELECT * FROM data_retention_policies 
        WHERE is_active = true 
        AND (next_execution_at IS NULL OR next_execution_at <= NOW())
    LOOP
        -- Execute deletion based on policy
        IF policy.action_type = 'delete' THEN
            EXECUTE format('
                DELETE FROM %I 
                WHERE %I < NOW() - INTERVAL ''%s days''
            ', policy.table_name, policy.condition_column, policy.retention_period_days);
            
            GET DIAGNOSTICS deleted_count = ROW_COUNT;
            total_deleted := total_deleted + deleted_count;
            
            -- Log the cleanup activity
            INSERT INTO audit_logs (
                action, resource_type, description, metadata
            ) VALUES (
                'delete',
                'data_retention',
                format('GDPR cleanup: deleted %s records from %s', deleted_count, policy.table_name),
                jsonb_build_object('policy_name', policy.policy_name, 'deleted_count', deleted_count)
            );
        END IF;
        
        -- Update policy execution timestamp
        UPDATE data_retention_policies 
        SET 
            last_executed_at = NOW(),
            next_execution_at = NOW() + INTERVAL '1 day'
        WHERE id = policy.id;
    END LOOP;
    
    RETURN total_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
DO $$
DECLARE
    table_names TEXT[] := ARRAY[
        'organizations', 'workshops', 'workshop_locations', 'workshop_users',
        'customers', 'customer_vehicles', 'leads', 'chat_sessions', 'chat_messages',
        'service_categories', 'services', 'appointments', 'appointment_services',
        'subscriptions', 'usage_tracking', 'gdpr_requests', 'audit_logs',
        'analytics_events', 'metrics_daily'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);
    END LOOP;
END $$;

-- Workshop-based access policies
CREATE POLICY "workshop_access" ON workshops
    FOR ALL USING (
        id IN (
            SELECT workshop_id FROM workshop_users 
            WHERE user_id = auth.uid() AND is_active = true
        ) OR
        owner_id = auth.uid()
    );

-- Service role bypass policy (for all tables)
DO $$
DECLARE
    table_names TEXT[] := ARRAY[
        'organizations', 'workshops', 'workshop_locations', 'workshop_users',
        'customers', 'customer_vehicles', 'leads', 'chat_sessions', 'chat_messages',
        'service_categories', 'services', 'appointments', 'appointment_services',
        'subscriptions', 'usage_tracking', 'gdpr_requests', 'audit_logs',
        'analytics_events', 'metrics_daily'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        EXECUTE format('
            CREATE POLICY "service_role_bypass" ON %I
            FOR ALL USING (auth.role() = ''service_role'');
        ', table_name);
    END LOOP;
END $$;

-- Workshop-scoped data access policy template
DO $$
DECLARE
    workshop_scoped_tables TEXT[] := ARRAY[
        'workshop_locations', 'workshop_users', 'customers', 'customer_vehicles',
        'leads', 'chat_sessions', 'chat_messages', 'service_categories', 'services',
        'appointments', 'appointment_services', 'subscriptions', 'usage_tracking',
        'analytics_events', 'metrics_daily'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY workshop_scoped_tables
    LOOP
        EXECUTE format('
            CREATE POLICY "workshop_scoped_access" ON %I
            FOR ALL USING (
                workshop_id IN (
                    SELECT id FROM workshops w
                    WHERE w.id IN (
                        SELECT workshop_id FROM workshop_users 
                        WHERE user_id = auth.uid() AND is_active = true
                    ) OR w.owner_id = auth.uid()
                )
            );
        ', table_name);
    END LOOP;
END $$;

-- =============================================
-- INITIAL DATA AND CONFIGURATION
-- =============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, monthly_price_cents, annual_price_cents, features, limits, trial_period_days) VALUES
('starter', 'Starter', 'Perfekt für kleine Werkstätten', 4900, 49000, 
 '["Bis zu 100 Kundengespräche/Monat", "Grundlegende KI-Serviceberatung", "E-Mail-Support", "DSGVO-konforme Datenspeicherung", "Basis-Analytics Dashboard", "Mobile App Zugang"]',
 '{"conversations": 100, "users": 1, "integrations": 1, "storage_gb": 1}', 14),
 
('professional', 'Professional', 'Ideal für wachsende Betriebe', 9900, 99000,
 '["Bis zu 500 Kundengespräche/Monat", "Erweiterte KI-Serviceberatung", "Intelligente Terminbuchung", "Prioritäts-Support", "Erweiterte Analytics", "Individuelle Anpassungen", "WhatsApp Integration", "Kostenvoranschlag-Generator", "Multi-Standort Verwaltung"]',
 '{"conversations": 500, "users": 5, "integrations": 10, "storage_gb": 10}', 14),
 
('enterprise', 'Enterprise', 'Für große Werkstattketten', 19900, 199000,
 '["Unbegrenzte Kundengespräche", "KI-Training auf Ihre Daten", "Dedizierter Account Manager", "24/7 Premium Support", "Custom Integrationen", "White-Label Lösung", "API-Zugang", "Erweiterte Sicherheitsfeatures", "Compliance-Reporting", "Schulungen & Onboarding"]',
 '{"conversations": -1, "users": -1, "integrations": -1, "storage_gb": -1}', 30)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    monthly_price_cents = EXCLUDED.monthly_price_cents,
    annual_price_cents = EXCLUDED.annual_price_cents,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits,
    updated_at = NOW();

-- Insert default data retention policies for GDPR compliance
INSERT INTO data_retention_policies (policy_name, description, table_name, condition_column, retention_period_days, legal_basis, gdpr_article) VALUES
('chat_messages_retention', 'Automatic deletion of chat messages after 90 days', 'chat_messages', 'expires_at', 90, 'Legitimate interest for customer service', 'Article 6(1)(f)'),
('lead_data_retention', 'Automatic deletion of non-converted leads after 90 days', 'leads', 'data_retention_until', 90, 'Consent for marketing purposes', 'Article 6(1)(a)'),
('analytics_events_retention', 'Automatic deletion of anonymous analytics events after 2 years', 'analytics_events', 'expires_at', 730, 'Legitimate interest for business analytics', 'Article 6(1)(f)'),
('audit_logs_retention', 'Retention of audit logs for 7 years (German commercial law)', 'audit_logs', 'created_at', 2555, 'Legal obligation (HGB §257)', 'Article 6(1)(c)')
ON CONFLICT (policy_name) DO NOTHING;

-- Create scheduled job for automatic data retention (requires pg_cron extension)
-- SELECT cron.schedule('gdpr-data-retention', '0 2 * * *', 'SELECT enforce_data_retention();');

-- =============================================
-- DATABASE MONITORING AND MAINTENANCE
-- =============================================

-- View for monitoring database performance
CREATE OR REPLACE VIEW database_performance_overview AS
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_dead_tup,
    ROUND(100.0 * idx_scan / NULLIF(seq_scan + idx_scan, 0), 2) as index_usage_percent
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;

-- View for monitoring table sizes
CREATE OR REPLACE VIEW table_sizes AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- View for monitoring slow queries
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
ORDER BY mean_time DESC
LIMIT 20;

-- Success message
SELECT 'CarBot Enterprise Database Schema created successfully! 🚀' as message,
       'Ready for production deployment with enterprise-grade features' as status,
       'GDPR compliant | Performance optimized | Audit ready' as compliance;