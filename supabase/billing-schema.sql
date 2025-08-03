-- CarBot Billing and Subscription System Schema
-- This file extends the existing schema with Stripe integration and billing functionality

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscription plans table (for reference and validation)
CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'starter', 'professional', 'enterprise'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_price INTEGER NOT NULL, -- Price in cents (EUR)
    annual_price INTEGER NOT NULL, -- Price in cents (EUR)
    features JSONB DEFAULT '[]'::jsonb, -- Array of features
    limits JSONB DEFAULT '{}'::jsonb, -- Usage limits
    stripe_monthly_price_id VARCHAR(255), -- Stripe price ID for monthly billing
    stripe_annual_price_id VARCHAR(255), -- Stripe price ID for annual billing
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add Stripe-related fields to workshops table
ALTER TABLE workshops 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_method_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS billing_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS vat_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS billing_address JSONB DEFAULT '{}'::jsonb;

-- Subscriptions table for detailed tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(255) PRIMARY KEY, -- Stripe subscription ID
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) NOT NULL,
    plan_id VARCHAR(50) REFERENCES subscription_plans(id),
    status VARCHAR(50) NOT NULL, -- active, trialing, past_due, canceled, etc.
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    billing_cycle_anchor TIMESTAMPTZ,
    collection_method VARCHAR(50) DEFAULT 'charge_automatically',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Payments table for tracking all payments and invoices
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255),
    stripe_customer_id VARCHAR(255) NOT NULL,
    stripe_subscription_id VARCHAR(255) REFERENCES subscriptions(id),
    stripe_payment_intent_id VARCHAR(255),
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR(3) DEFAULT 'eur' NOT NULL,
    status VARCHAR(50) NOT NULL, -- succeeded, failed, pending, refunded
    payment_method VARCHAR(50), -- card, sepa_debit, etc.
    payment_date TIMESTAMPTZ,
    invoice_url TEXT,
    invoice_pdf TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Billing events table for audit trail and webhooks
CREATE TABLE IF NOT EXISTS billing_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- checkout_session_created, payment_succeeded, subscription_updated, etc.
    stripe_event_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    plan_id VARCHAR(50),
    billing_interval VARCHAR(20), -- month, year
    amount INTEGER, -- Amount in cents
    currency VARCHAR(3) DEFAULT 'eur',
    status VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Webhook events table for Stripe webhook tracking
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    livemode BOOLEAN NOT NULL,
    api_version VARCHAR(50),
    created TIMESTAMPTZ NOT NULL,
    data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    processing_errors TEXT[]
);

-- Usage tracking table for metered billing features
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    subscription_id VARCHAR(255) REFERENCES subscriptions(id),
    subscription_item_id VARCHAR(255),
    metric_name VARCHAR(100) NOT NULL, -- conversations, api_calls, users, etc.
    quantity INTEGER NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    reported_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    stripe_usage_record_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Coupons and discounts table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stripe_coupon_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    percent_off INTEGER, -- Percentage discount (0-100)
    amount_off INTEGER, -- Fixed amount off in cents
    currency VARCHAR(3),
    duration VARCHAR(50) NOT NULL, -- once, repeating, forever
    duration_in_months INTEGER,
    max_redemptions INTEGER,
    times_redeemed INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workshop coupons relationship table
CREATE TABLE IF NOT EXISTS workshop_coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    stripe_discount_id VARCHAR(255),
    applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    removed_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true NOT NULL,
    UNIQUE(workshop_id, coupon_id)
);

-- Billing alerts table for proactive notifications
CREATE TABLE IF NOT EXISTS billing_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL, -- payment_failed, trial_ending, subscription_canceled, etc.
    severity VARCHAR(20) DEFAULT 'medium' NOT NULL, -- low, medium, high, critical
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    action_label VARCHAR(100),
    is_read BOOLEAN DEFAULT false NOT NULL,
    is_resolved BOOLEAN DEFAULT false NOT NULL,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshops_stripe_customer_id ON workshops(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_workshops_stripe_subscription_id ON workshops(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_workshops_subscription_status ON workshops(subscription_status);
CREATE INDEX IF NOT EXISTS idx_workshops_trial_end ON workshops(trial_end);

CREATE INDEX IF NOT EXISTS idx_subscriptions_workshop_id ON subscriptions(workshop_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

CREATE INDEX IF NOT EXISTS idx_payments_workshop_id ON payments(workshop_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_customer_id ON payments(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_subscription_id ON payments(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_billing_events_workshop_id ON billing_events(workshop_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_event_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_stripe_customer_id ON billing_events(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_created_at ON billing_events(created_at);

CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON webhook_events(created);

CREATE INDEX IF NOT EXISTS idx_usage_records_workshop_id ON usage_records(workshop_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_subscription_id ON usage_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_metric_name ON usage_records(metric_name);
CREATE INDEX IF NOT EXISTS idx_usage_records_period ON usage_records(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_billing_alerts_workshop_id ON billing_alerts(workshop_id);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_alert_type ON billing_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_is_read ON billing_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_created_at ON billing_alerts(created_at);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_alerts_updated_at BEFORE UPDATE ON billing_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view subscription plans" ON subscription_plans
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Service role has full access to subscription plans" ON subscription_plans
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for subscriptions (workshop-specific access)
CREATE POLICY "Users can view their workshop's subscription" ON subscriptions
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT workshop_id FROM workshop_users WHERE user_id = auth.uid() AND active = true)
        )
    );

CREATE POLICY "Service role has full access to subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for payments (workshop-specific access)
CREATE POLICY "Users can view their workshop's payments" ON payments
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT workshop_id FROM workshop_users WHERE user_id = auth.uid() AND active = true)
        )
    );

CREATE POLICY "Service role has full access to payments" ON payments
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for billing_events (workshop-specific access)
CREATE POLICY "Users can view their workshop's billing events" ON billing_events
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT workshop_id FROM workshop_users WHERE user_id = auth.uid() AND active = true)
        )
    );

CREATE POLICY "Service role has full access to billing events" ON billing_events
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for webhook_events (service role only)
CREATE POLICY "Service role has full access to webhook events" ON webhook_events
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for usage_records (workshop-specific access)
CREATE POLICY "Users can view their workshop's usage records" ON usage_records
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT workshop_id FROM workshop_users WHERE user_id = auth.uid() AND active = true)
        )
    );

CREATE POLICY "Service role has full access to usage records" ON usage_records
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for coupons (read-only for authenticated users)
CREATE POLICY "Authenticated users can view active coupons" ON coupons
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Service role has full access to coupons" ON coupons
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for workshop_coupons (workshop-specific access)
CREATE POLICY "Users can view their workshop's coupons" ON workshop_coupons
    FOR SELECT USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT workshop_id FROM workshop_users WHERE user_id = auth.uid() AND active = true)
        )
    );

CREATE POLICY "Service role has full access to workshop coupons" ON workshop_coupons
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for billing_alerts (workshop-specific access)
CREATE POLICY "Users can view and update their workshop's billing alerts" ON billing_alerts
    FOR ALL USING (
        workshop_id IN (
            SELECT id FROM workshops 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT workshop_id FROM workshop_users WHERE user_id = auth.uid() AND active = true)
        )
    );

CREATE POLICY "Service role has full access to billing alerts" ON billing_alerts
    FOR ALL USING (auth.role() = 'service_role');

-- Functions for billing management

-- Function to calculate usage for a workshop in a given period
CREATE OR REPLACE FUNCTION calculate_workshop_usage(
    p_workshop_id UUID,
    p_metric_name VARCHAR(100),
    p_period_start TIMESTAMPTZ,
    p_period_end TIMESTAMPTZ
)
RETURNS INTEGER AS $$
DECLARE
    total_usage INTEGER;
BEGIN
    SELECT COALESCE(SUM(quantity), 0)
    INTO total_usage
    FROM usage_records
    WHERE workshop_id = p_workshop_id
    AND metric_name = p_metric_name
    AND period_start >= p_period_start
    AND period_end <= p_period_end;
    
    RETURN total_usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if workshop has exceeded plan limits
CREATE OR REPLACE FUNCTION check_plan_limits(p_workshop_id UUID)
RETURNS JSONB AS $$
DECLARE
    workshop_record RECORD;
    plan_record RECORD;
    current_usage RECORD;
    result JSONB := '{}';
    limit_key TEXT;
    limit_value INTEGER;
    usage_value INTEGER;
BEGIN
    -- Get workshop and plan information
    SELECT w.*, sp.limits 
    INTO workshop_record, plan_record
    FROM workshops w
    LEFT JOIN subscription_plans sp ON w.subscription_plan = sp.id
    WHERE w.id = p_workshop_id;
    
    IF NOT FOUND THEN
        RETURN '{"error": "Workshop not found"}';
    END IF;
    
    -- Check each limit defined in the plan
    FOR limit_key, limit_value IN SELECT * FROM jsonb_each_text(plan_record.limits)
    LOOP
        -- Calculate current usage for this metric
        SELECT calculate_workshop_usage(
            p_workshop_id,
            limit_key,
            workshop_record.current_period_start,
            workshop_record.current_period_end
        ) INTO usage_value;
        
        -- Add to result
        result := result || jsonb_build_object(
            limit_key,
            jsonb_build_object(
                'limit', limit_value,
                'usage', usage_value,
                'percentage', CASE 
                    WHEN limit_value = -1 THEN 0 -- Unlimited
                    WHEN limit_value = 0 THEN 100 -- No limit means 100% if any usage
                    ELSE ROUND((usage_value::DECIMAL / limit_value) * 100, 2)
                END,
                'exceeded', CASE
                    WHEN limit_value = -1 THEN false -- Unlimited
                    ELSE usage_value > limit_value
                END
            )
        );
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create billing alert
CREATE OR REPLACE FUNCTION create_billing_alert(
    p_workshop_id UUID,
    p_alert_type VARCHAR(100),
    p_severity VARCHAR(20),
    p_title VARCHAR(255),
    p_message TEXT,
    p_action_url TEXT DEFAULT NULL,
    p_action_label VARCHAR(100) DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    alert_id UUID;
BEGIN
    INSERT INTO billing_alerts (
        workshop_id, alert_type, severity, title, message,
        action_url, action_label, metadata
    ) VALUES (
        p_workshop_id, p_alert_type, p_severity, p_title, p_message,
        p_action_url, p_action_label, p_metadata
    ) RETURNING id INTO alert_id;
    
    RETURN alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old billing data
CREATE OR REPLACE FUNCTION cleanup_billing_data()
RETURNS void AS $$
BEGIN
    -- Clean up old webhook events (keep 90 days)
    DELETE FROM webhook_events 
    WHERE created < NOW() - INTERVAL '90 days';
    
    -- Clean up old billing events (keep 1 year)
    DELETE FROM billing_events 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Clean up resolved billing alerts (keep 30 days after resolution)
    DELETE FROM billing_alerts 
    WHERE is_resolved = true 
    AND resolved_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old usage records (keep 2 years)
    DELETE FROM usage_records 
    WHERE created_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, monthly_price, annual_price, features, limits) VALUES
(
    'starter',
    'Starter',
    'Perfekt für kleine Werkstätten',
    4900, -- €49.00
    49000, -- €490.00 (2 months free)
    '["Bis zu 100 Kundengespräche/Monat", "Grundlegende KI-Serviceberatung", "E-Mail-Support", "DSGVO-konforme Datenspeicherung", "Basis-Analytics Dashboard", "Mobile App Zugang"]',
    '{"conversations": 100, "users": 1, "integrations": 1}'
),
(
    'professional',
    'Professional',
    'Ideal für wachsende Betriebe',
    9900, -- €99.00
    99000, -- €990.00 (2 months free)
    '["Bis zu 500 Kundengespräche/Monat", "Erweiterte KI-Serviceberatung", "Intelligente Terminbuchung", "Prioritäts-Support", "Erweiterte Analytics", "Individuelle Anpassungen", "WhatsApp Integration", "Kostenvoranschlag-Generator", "Multi-Standort Verwaltung"]',
    '{"conversations": 500, "users": 5, "integrations": 10}'
),
(
    'enterprise',
    'Enterprise',
    'Für große Werkstattketten',
    19900, -- €199.00
    199000, -- €1990.00 (2 months free)
    '["Unbegrenzte Kundengespräche", "KI-Training auf Ihre Daten", "Dedizierter Account Manager", "24/7 Premium Support", "Custom Integrationen", "White-Label Lösung", "API-Zugang", "Erweiterte Sicherheitsfeatures", "Compliance-Reporting", "Schulungen & Onboarding"]',
    '{"conversations": -1, "users": -1, "integrations": -1}'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    monthly_price = EXCLUDED.monthly_price,
    annual_price = EXCLUDED.annual_price,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits,
    updated_at = NOW();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;