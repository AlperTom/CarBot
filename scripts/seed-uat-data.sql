-- CarBot UAT Environment Demo Data Seeding Script
-- Run this in your UAT Supabase instance

-- Clear existing UAT data (be careful in production!)
TRUNCATE TABLE workshop_clients CASCADE;
TRUNCATE TABLE client_keys CASCADE;
TRUNCATE TABLE landing_pages CASCADE;
TRUNCATE TABLE ui_customizations CASCADE;
TRUNCATE TABLE ai_usage_logs CASCADE;
TRUNCATE TABLE analytics_events CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE lead_scores CASCADE;
TRUNCATE TABLE workshops CASCADE;

-- Insert demo workshops
INSERT INTO workshops (
    slug, name, owner_name, owner_email, phone, email, website, 
    address, city, postal_code, country, opening_hours, services, specializations,
    subscription_status, subscription_plan, trial_ends_at
) VALUES 
(
    'mueller-autowerkstatt-uat',
    'Müller Autowerkstatt UAT',
    'Hans Müller',
    'hans.mueller@uat-demo.de',
    '+49 30 12345678',
    'info@mueller-autowerkstatt-uat.de',
    'https://mueller-autowerkstatt-uat.de',
    'Musterstraße 123',
    'Berlin',
    '10115',
    'DE',
    E'Mo-Fr: 8:00-18:00\nSa: 9:00-14:00\nSo: Geschlossen',
    ARRAY['Reparatur', 'Wartung', 'TÜV', 'Inspektion', 'Reifenwechsel'],
    ARRAY['BMW', 'Mercedes', 'Audi', 'VW'],
    'active',
    'professional',
    NOW() + INTERVAL '14 days'
),
(
    'schmidt-garage-uat',
    'Schmidt Garage UAT',
    'Maria Schmidt',
    'maria.schmidt@uat-demo.de',
    '+49 40 98765432',
    'info@schmidt-garage-uat.de',
    NULL,
    'Testweg 456',
    'Hamburg',
    '20095',
    'DE',
    E'Mo-Fr: 7:30-17:30\nSa: 8:00-12:00',
    ARRAY['Reparatur', 'Wartung', 'Ölwechsel', 'Bremsen'],
    ARRAY['Opel', 'Ford', 'Renault'],
    'trial',
    'starter',
    NOW() + INTERVAL '7 days'
),
(
    'premium-motors-uat',
    'Premium Motors UAT',
    'Thomas Wagner',
    'thomas.wagner@uat-demo.de',
    '+49 89 11223344',
    'service@premium-motors-uat.de',
    'https://premium-motors-uat.de',
    'Luxusallee 789',
    'München',
    '80331',
    'DE',
    E'Mo-Fr: 8:00-19:00\nSa: 9:00-15:00',
    ARRAY['Premium Service', 'Sportwagen Reparatur', 'Wartung', 'Tuning'],
    ARRAY['Porsche', 'Ferrari', 'Lamborghini', 'BMW'],
    'active',
    'enterprise',
    NOW() + INTERVAL '30 days'
),
(
    'city-garage-uat',
    'City Garage Köln UAT',
    'Ahmed Yilmaz',
    'ahmed.yilmaz@uat-demo.de',
    '+49 221 55667788',
    'info@city-garage-uat.de',
    NULL,
    'Kölner Straße 321',
    'Köln',
    '50667',
    'DE',
    E'Mo-Fr: 8:00-18:00\nSa: 9:00-13:00',
    ARRAY['Reparatur', 'Wartung', 'TÜV', 'Klimaanlagen'],
    ARRAY['Alle Marken'],
    'trial',
    'professional',
    NOW() + INTERVAL '3 days'
),
(
    'eco-werkstatt-uat',
    'Eco Werkstatt UAT',
    'Lisa Grün',
    'lisa.gruen@uat-demo.de',
    '+49 30 99887766',
    'kontakt@eco-werkstatt-uat.de',
    'https://eco-werkstatt-uat.de',
    'Umweltweg 654',
    'Berlin',
    '10178',
    'DE',
    E'Mo-Fr: 9:00-17:00\nSa: 10:00-14:00',
    ARRAY['Elektroauto Service', 'Hybrid Wartung', 'Batterie Check'],
    ARRAY['Tesla', 'BMW i-Series', 'VW ID', 'Nissan'],
    'active',
    'professional',
    NOW() + INTERVAL '21 days'
);

-- Insert demo client keys for each workshop
DO $$
DECLARE
    workshop_record RECORD;
BEGIN
    FOR workshop_record IN SELECT id, slug, name FROM workshops LOOP
        -- Insert 2-3 client keys per workshop
        INSERT INTO client_keys (
            workshop_id, key_name, client_key, is_active, usage_count, 
            last_used_at, created_at
        ) VALUES 
        (
            workshop_record.id,
            'Haupt-Website',
            workshop_record.slug || '-main-' || substr(md5(random()::text), 1, 8),
            true,
            floor(random() * 100 + 50)::int,
            NOW() - INTERVAL '1 hour' * floor(random() * 24),
            NOW() - INTERVAL '7 days'
        ),
        (
            workshop_record.id,
            'Landing Page',
            workshop_record.slug || '-landing-' || substr(md5(random()::text), 1, 8),
            true,
            floor(random() * 50 + 10)::int,
            NOW() - INTERVAL '1 hour' * floor(random() * 48),
            NOW() - INTERVAL '5 days'
        ),
        (
            workshop_record.id,
            'Test Integration',
            workshop_record.slug || '-test-' || substr(md5(random()::text), 1, 8),
            false,
            floor(random() * 20 + 1)::int,
            NOW() - INTERVAL '1 day' * floor(random() * 7),
            NOW() - INTERVAL '3 days'
        );
    END LOOP;
END $$;

-- Insert demo workshop clients
INSERT INTO workshop_clients (
    workshop_id, workshop_name, owner_name, owner_email, phone, city,
    registration_status, subscription_plan, subscription_status,
    last_activity_at, total_conversations, total_leads, total_appointments, notes
) 
SELECT 
    w.id,
    'Demo Client ' || i,
    'Demo Owner ' || i,
    'demo.client' || i || '@uat-test.de',
    '+49 ' || (floor(random() * 900 + 100)) || ' ' || (floor(random() * 9000000 + 1000000)),
    (ARRAY['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf'])[floor(random() * 7 + 1)],
    (ARRAY['registered_ordered', 'registered_no_order', 'registered_no_confirmation', 'lead_only', 'inactive'])[floor(random() * 5 + 1)],
    (ARRAY['starter', 'professional', 'enterprise'])[floor(random() * 3 + 1)],
    (ARRAY['trial', 'active', 'inactive', 'cancelled'])[floor(random() * 4 + 1)],
    NOW() - INTERVAL '1 hour' * floor(random() * 168), -- Last week
    floor(random() * 50 + 1)::int,
    floor(random() * 20 + 1)::int,
    floor(random() * 10 + 0)::int,
    CASE 
        WHEN random() > 0.7 THEN 'Sehr interessiert in Premium Services'
        WHEN random() > 0.5 THEN 'Benötigt Follow-up Anruf'
        WHEN random() > 0.3 THEN 'Wartet auf Kostenvoranschlag'
        ELSE NULL
    END
FROM workshops w
CROSS JOIN generate_series(1, 4) i;

-- Insert demo landing pages
DO $$
DECLARE
    workshop_record RECORD;
    template_names TEXT[] := ARRAY['modern-auto', 'classic-garage', 'premium-service'];
    template_name TEXT;
BEGIN
    FOR workshop_record IN SELECT id, slug, name, city FROM workshops LOOP
        template_name := template_names[floor(random() * 3 + 1)];
        
        INSERT INTO landing_pages (
            workshop_id, title, slug, template_id, description, 
            content, is_published, seo_title, seo_description,
            view_count, conversion_count, created_at
        ) VALUES (
            workshop_record.id,
            workshop_record.name || ' - Professionelle Autowerkstatt',
            'hauptseite-' || substr(md5(random()::text), 1, 6),
            template_name,
            'Professionelle Autowerkstatt in ' || workshop_record.city,
            json_build_object(
                'hero', json_build_object(
                    'title', workshop_record.name,
                    'subtitle', 'Ihre zuverlässige Autowerkstatt in ' || workshop_record.city,
                    'cta', 'Termin vereinbaren'
                ),
                'services', ARRAY['Reparatur', 'Wartung', 'TÜV', 'Inspektion'],
                'specializations', ARRAY['Alle Marken', 'Moderne Diagnosetechnik']
            ),
            true,
            workshop_record.name || ' - Autowerkstatt ' || workshop_record.city,
            'Professionelle Autoreparatur und Service in ' || workshop_record.city || '. Faire Preise, schneller Service.',
            floor(random() * 500 + 100)::int,
            floor(random() * 50 + 10)::int,
            NOW() - INTERVAL '1 day' * floor(random() * 30)
        );
    END LOOP;
END $$;

-- Insert demo UI customizations
DO $$
DECLARE
    key_record RECORD;
    colors TEXT[][] := ARRAY[
        ARRAY['#0070f3', '#10b981', '#6b7280'],
        ARRAY['#1f2937', '#f59e0b', '#9ca3af'],
        ARRAY['#7c2d12', '#d97706', '#6b7280'],
        ARRAY['#1e40af', '#0ea5e9', '#64748b']
    ];
    fonts TEXT[] := ARRAY['Inter', 'Roboto', 'Open Sans', 'Lato'];
    positions TEXT[] := ARRAY['bottom-right', 'bottom-left', 'top-right', 'top-left'];
    color_set TEXT[];
BEGIN
    FOR key_record IN SELECT id, workshop_id FROM client_keys WHERE is_active = true LIMIT 10 LOOP
        color_set := colors[floor(random() * 4 + 1)];
        
        INSERT INTO ui_customizations (
            workshop_id, client_key_id, theme_name, primary_color, 
            secondary_color, accent_color, font_family, border_radius,
            chat_position, welcome_message, created_at
        ) VALUES (
            key_record.workshop_id,
            key_record.id,
            'Demo Theme ' || substr(md5(random()::text), 1, 6),
            color_set[1],
            color_set[3],
            color_set[2],
            fonts[floor(random() * 4 + 1)],
            (ARRAY['4px', '8px', '12px', '20px'])[floor(random() * 4 + 1)],
            positions[floor(random() * 4 + 1)],
            'Hallo! Wie kann ich Ihnen bei Ihrer Autowerkstatt helfen?',
            NOW() - INTERVAL '1 day' * floor(random() * 14)
        );
    END LOOP;
END $$;

-- Insert demo AI usage logs
INSERT INTO ai_usage_logs (
    client_key, workshop_id, model_name, prompt_tokens, completion_tokens, 
    total_tokens, cost_cents, response_time_ms, language, created_at
)
SELECT 
    ck.client_key,
    ck.workshop_id,
    (ARRAY['gpt-3.5-turbo', 'gpt-4'])[floor(random() * 2 + 1)],
    floor(random() * 200 + 50)::int,
    floor(random() * 150 + 30)::int,
    floor(random() * 350 + 80)::int,
    floor(random() * 50 + 10)::int,
    floor(random() * 2000 + 500)::int,
    (ARRAY['de', 'en', 'tr', 'pl'])[floor(random() * 4 + 1)],
    NOW() - INTERVAL '1 minute' * floor(random() * 10080) -- Last week
FROM client_keys ck
CROSS JOIN generate_series(1, 20);

-- Insert demo analytics events
INSERT INTO analytics_events (
    event_type, client_key, workshop_id, event_data, session_id, created_at
)
SELECT 
    (ARRAY[
        'chat_response_generated', 
        'lead_captured', 
        'appointment_booked', 
        'conversation_started',
        'user_feedback_positive',
        'conversion_completed'
    ])[floor(random() * 6 + 1)],
    ck.client_key,
    ck.workshop_id,
    json_build_object(
        'user_agent', 'Mozilla/5.0 (Demo Browser)',
        'language', (ARRAY['de', 'en', 'tr', 'pl'])[floor(random() * 4 + 1)],
        'session_duration', floor(random() * 600 + 60)
    ),
    'session_' || substr(md5(random()::text), 1, 12),
    NOW() - INTERVAL '1 hour' * floor(random() * 168)
FROM client_keys ck
CROSS JOIN generate_series(1, 10);

-- Insert demo appointments
INSERT INTO appointments (
    workshop_id, customer_slug, start_time, end_time, customer_name,
    customer_phone, customer_email, service_requested, vehicle_info,
    status, language, created_at
)
SELECT 
    w.id,
    'customer-' || i || '-' || substr(md5(random()::text), 1, 6),
    NOW() + INTERVAL '1 day' * floor(random() * 30) + INTERVAL '1 hour' * floor(random() * 8 + 8),
    NOW() + INTERVAL '1 day' * floor(random() * 30) + INTERVAL '1 hour' * floor(random() * 8 + 9),
    (ARRAY['Max Mustermann', 'Anna Schmidt', 'Peter Wagner', 'Lisa Müller', 'Tom Fischer'])[floor(random() * 5 + 1)],
    '+49 ' || (floor(random() * 900 + 100)) || ' ' || (floor(random() * 9000000 + 1000000)),
    'kunde' || i || '@demo-email.de',
    (ARRAY['Inspektion', 'Ölwechsel', 'Reparatur', 'TÜV', 'Wartung'])[floor(random() * 5 + 1)],
    (ARRAY['BMW 3er', 'Mercedes C-Klasse', 'VW Golf', 'Audi A4', 'Opel Astra'])[floor(random() * 5 + 1)] || ', Baujahr ' || (2015 + floor(random() * 8)),
    (ARRAY['confirmed', 'completed', 'cancelled'])[floor(random() * 3 + 1)],
    'de',
    NOW() - INTERVAL '1 day' * floor(random() * 14)
FROM workshops w
CROSS JOIN generate_series(1, 3) i;

-- Insert demo lead scores
INSERT INTO lead_scores (
    lead_id, workshop_id, total_score, score_breakdown, classification, 
    priority, estimated_value, recommendations, created_at
)
SELECT 
    gen_random_uuid(),
    w.id,
    floor(random() * 100 + 1)::int,
    json_build_object(
        'engagement', floor(random() * 30 + 10),
        'urgency', floor(random() * 25 + 5),
        'budget_indicators', floor(random() * 20 + 5),
        'service_match', floor(random() * 25 + 10)
    ),
    (ARRAY['Hot', 'Warm', 'Cold', 'Very Cold'])[floor(random() * 4 + 1)],
    (ARRAY['High', 'Medium', 'Low'])[floor(random() * 3 + 1)],
    floor(random() * 2000 + 200)::int,
    json_build_array(
        'Follow up within 24 hours',
        'Offer discount for immediate booking',
        'Send service information'
    ),
    NOW() - INTERVAL '1 hour' * floor(random() * 72)
FROM workshops w
CROSS JOIN generate_series(1, 5);

-- Create indexes for better performance in UAT
CREATE INDEX IF NOT EXISTS idx_uat_workshops_slug ON workshops(slug) WHERE slug LIKE '%-uat';
CREATE INDEX IF NOT EXISTS idx_uat_client_keys_workshop ON client_keys(workshop_id) WHERE client_key LIKE '%-uat-%';
CREATE INDEX IF NOT EXISTS idx_uat_analytics_created_at ON analytics_events(created_at) WHERE created_at > NOW() - INTERVAL '30 days';

-- Grant permissions for UAT environment
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
SELECT 
    'UAT Demo Data Seeded Successfully!' as message,
    COUNT(*) as total_workshops 
FROM workshops 
WHERE slug LIKE '%-uat';