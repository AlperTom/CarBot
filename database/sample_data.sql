-- Sample data for CarBot FAQ and Pricing System
-- This provides realistic test data for development and demonstration

-- Insert categories
INSERT INTO categories (name, description, sort_order) VALUES
('Allgemein', 'Allgemeine Fragen zum Service', 1),
('Preise', 'Fragen zu Preisen und Kosten', 2),
('Termine', 'Terminvereinbarung und Verfügbarkeit', 3),
('Reparaturen', 'Fahrzeugreparaturen und Wartung', 4),
('Verkauf', 'Fahrzeugverkauf und -kauf', 5),
('Versicherung', 'Versicherungsfragen', 6),
('Notfall', 'Notfallservice und Pannenhilfe', 7);

-- Insert subcategories
INSERT INTO categories (name, description, parent_id, sort_order) VALUES
('Ölwechsel', 'Motorölwechsel und -service', (SELECT id FROM categories WHERE name = 'Reparaturen'), 1),
('Bremsen', 'Bremsservice und -reparaturen', (SELECT id FROM categories WHERE name = 'Reparaturen'), 2),
('Motor', 'Motordiagnose und -reparatur', (SELECT id FROM categories WHERE name = 'Reparaturen'), 3),
('Gebrauchtwagen', 'Gebrauchtwagenkauf und -verkauf', (SELECT id FROM categories WHERE name = 'Verkauf'), 1),
('Neuwagen', 'Neuwagenbestellung und -verkauf', (SELECT id FROM categories WHERE name = 'Verkauf'), 2);

-- Insert test clients
INSERT INTO clients (client_key, company_name, contact_email, contact_phone, region, language) VALUES
('autowerkstatt_mueller', 'Autowerkstatt Müller GmbH', 'info@mueller-auto.de', '+49 30 12345678', 'Berlin', 'de'),
('garage_schmidt', 'Garage Schmidt', 'kontakt@garage-schmidt.de', '+49 89 87654321', 'München', 'de'),
('testClient', 'Test CarBot Client', 'test@carbot.de', '+49 40 11111111', 'Hamburg', 'de');

-- Insert global FAQ entries
INSERT INTO faq_global (question, answer, category_id, tags, priority) VALUES
-- Allgemeine Fragen
('Wie kann ich einen Termin vereinbaren?', 'Sie können einen Termin telefonisch, per E-Mail oder über unser Online-Buchungssystem vereinbaren. Unsere Öffnungszeiten finden Sie auf unserer Website.', 
 (SELECT id FROM categories WHERE name = 'Termine'), ARRAY['termin', 'buchung', 'vereinbaren'], 5),

('Welche Zahlungsmethoden akzeptieren Sie?', 'Wir akzeptieren Barzahlung, EC-Karte, Kreditkarte (Visa, Mastercard) und Überweisung. Bei größeren Reparaturen bieten wir auch Ratenzahlung an.',
 (SELECT id FROM categories WHERE name = 'Preise'), ARRAY['zahlung', 'bezahlen', 'karte', 'bar'], 4),

('Gibt es eine Garantie auf Reparaturen?', 'Ja, wir gewähren 12 Monate Garantie auf alle Reparaturen und 24 Monate auf Originalersatzteile. Die Garantie deckt Material- und Verarbeitungsfehler ab.',
 (SELECT id FROM categories WHERE name = 'Reparaturen'), ARRAY['garantie', 'gewährleistung', 'reparatur'], 5),

-- Preisfragen
('Was kostet ein Ölwechsel?', 'Die Kosten für einen Ölwechsel variieren je nach Fahrzeugtyp und Ölqualität. Ein Standard-Ölwechsel kostet zwischen 80-150 EUR inklusive Öl und Filter.',
 (SELECT id FROM categories WHERE name = 'Ölwechsel'), ARRAY['ölwechsel', 'preis', 'kosten', 'öl'], 4),

('Wie viel kostet eine Hauptuntersuchung?', 'Die Hauptuntersuchung (HU) kostet 89 EUR. Bei gleichzeitiger Abgasuntersuchung (AU) kommen weitere 35 EUR hinzu.',
 (SELECT id FROM categories WHERE name = 'Allgemein'), ARRAY['HU', 'hauptuntersuchung', 'TÜV', 'preis'], 3),

-- Terminbezogene FAQ
('Wie lange dauert ein Ölwechsel?', 'Ein Standard-Ölwechsel dauert in der Regel 30-45 Minuten. Bei komplizierteren Fahrzeugen kann es bis zu 60 Minuten dauern.',
 (SELECT id FROM categories WHERE name = 'Ölwechsel'), ARRAY['ölwechsel', 'dauer', 'zeit', 'minuten'], 3),

('Kann ich ohne Termin vorbeikommen?', 'Für kleinere Arbeiten wie Glühbirnen-Wechsel nehmen wir Sie gerne ohne Termin. Für größere Reparaturen empfehlen wir eine Terminvereinbarung.',
 (SELECT id FROM categories WHERE name = 'Termine'), ARRAY['termin', 'spontan', 'ohne', 'anmeldung'], 2),

-- Verkaufsbezogene FAQ
('Nehmen Sie Fahrzeuge in Zahlung?', 'Ja, wir bewerten Ihr Fahrzeug kostenlos und rechnen den Wert beim Kauf eines anderen Fahrzeugs an. Die Bewertung erfolgt nach aktuellen Marktpreisen.',
 (SELECT id FROM categories WHERE name = 'Verkauf'), ARRAY['inzahlungnahme', 'bewertung', 'verkauf', 'tausch'], 3),

('Bieten Sie Finanzierung an?', 'Wir arbeiten mit verschiedenen Banken zusammen und können Ihnen attraktive Finanzierungsangebote unterbreiten. Sprechen Sie uns einfach an.',
 (SELECT id FROM categories WHERE name = 'Verkauf'), ARRAY['finanzierung', 'kredit', 'leasing', 'ratenkauf'], 2),

-- Notfall-FAQ
('Haben Sie einen 24h-Notdienst?', 'Unser Abschleppdienst ist 24/7 verfügbar. Für Notfälle außerhalb der Geschäftszeiten rufen Sie bitte unsere Notfall-Hotline an.',
 (SELECT id FROM categories WHERE name = 'Notfall'), ARRAY['notfall', '24h', 'abschlepp', 'panne'], 5);

-- Insert business hours for test client
INSERT INTO business_hours (client_id, day_of_week, open_time, close_time) VALUES
((SELECT id FROM clients WHERE client_key = 'testClient'), 1, '08:00', '18:00'), -- Monday
((SELECT id FROM clients WHERE client_key = 'testClient'), 2, '08:00', '18:00'), -- Tuesday
((SELECT id FROM clients WHERE client_key = 'testClient'), 3, '08:00', '18:00'), -- Wednesday
((SELECT id FROM clients WHERE client_key = 'testClient'), 4, '08:00', '18:00'), -- Thursday
((SELECT id FROM clients WHERE client_key = 'testClient'), 5, '08:00', '17:00'), -- Friday
((SELECT id FROM clients WHERE client_key = 'testClient'), 6, '09:00', '14:00'), -- Saturday
((SELECT id FROM clients WHERE client_key = 'testClient'), 0, NULL, NULL, TRUE); -- Sunday (closed)

-- Insert client-specific services for test client
INSERT INTO client_services (client_id, category_id, service_name, service_description, base_price, pricing_model, duration_minutes, tags) VALUES
((SELECT id FROM clients WHERE client_key = 'testClient'), 
 (SELECT id FROM categories WHERE name = 'Ölwechsel'), 
 'Standard Ölwechsel', 
 'Motorölwechsel mit Qualitätsöl und neuem Ölfilter. Inklusive Sichtkontrolle aller Flüssigkeiten.', 
 89.00, 'fixed', 45, 
 ARRAY['ölwechsel', 'wartung', 'filter', 'standard']),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 (SELECT id FROM categories WHERE name = 'Ölwechsel'), 
 'Premium Ölwechsel', 
 'Motorölwechsel mit Premiun-Synthetik-Öl und neuem Ölfilter. Inklusive 15-Punkte Fahrzeugcheck.', 
 135.00, 'fixed', 60, 
 ARRAY['ölwechsel', 'premium', 'synthetik', 'check']),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 (SELECT id FROM categories WHERE name = 'Bremsen'), 
 'Bremsbeläge vorne', 
 'Wechsel der vorderen Bremsbeläge inklusive Sichtkontrolle der Bremsscheiben.', 
 180.00, 'fixed', 120, 
 ARRAY['bremsen', 'beläge', 'vorne', 'sicherheit']),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 (SELECT id FROM categories WHERE name = 'Allgemein'), 
 'Fahrzeugdiagnose', 
 'Computerdiagnose zur Fehlerauslese und Fahrzeuganalyse. Inklusive Beratung und Kostenvoranschlag.', 
 65.00, 'fixed', 90, 
 ARRAY['diagnose', 'computer', 'fehler', 'analyse']),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 (SELECT id FROM categories WHERE name = 'Reparaturen'), 
 'Reparatur nach Aufwand', 
 'Individuelle Reparaturen werden nach Zeitaufwand berechnet. Stundenssatz inkl. Ersatzteile nach Originalpreisen.', 
 95.00, 'hourly', NULL, 
 ARRAY['reparatur', 'aufwand', 'individual', 'stundensatz']),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 (SELECT id FROM categories WHERE name = 'Verkauf'), 
 'Fahrzeugbewertung', 
 'Kostenlose Bewertung Ihres Fahrzeugs nach aktuellen Marktpreisen. Inklusive schriftlichem Gutachten.', 
 0.00, 'fixed', 30, 
 ARRAY['bewertung', 'kostenlos', 'marktpreis', 'gutachten']);

-- Insert client-specific FAQ for test client
INSERT INTO faq_client_specific (client_id, question, answer, category_id, tags, priority) VALUES
((SELECT id FROM clients WHERE client_key = 'testClient'), 
 'Welche Öle verwenden Sie?', 
 'Wir verwenden ausschließlich Qualitätsöle von Castrol, Mobil und Shell. Für Ihren Fahrzeugtyp empfehlen wir das passende Öl nach Herstellervorgaben.',
 (SELECT id FROM categories WHERE name = 'Ölwechsel'), 
 ARRAY['öl', 'qualität', 'castrol', 'mobil', 'shell'], 4),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 'Führen Sie auch Arbeiten an Elektrofahrzeugen durch?', 
 'Ja, unser Team ist für die Wartung von Elektro- und Hybridfahrzeugen zertifiziert. Wir führen alle Servicearbeiten außer Hochvolt-Reparaturen durch.',
 (SELECT id FROM categories WHERE name = 'Reparaturen'), 
 ARRAY['elektro', 'hybrid', 'zertifiziert', 'hochvolt'], 3),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 'Gibt es einen Hol- und Bringservice?', 
 'Ja, für Kunden im Umkreis von 15 km bieten wir einen kostenlosen Hol- und Bringservice an. Termine nach Vereinbarung.',
 (SELECT id FROM categories WHERE name = 'Allgemein'), 
 ARRAY['hol', 'bring', 'service', 'kostenlos', '15km'], 2);

-- Insert special hours (example holiday)
INSERT INTO special_hours (client_id, date, is_closed, note) VALUES
((SELECT id FROM clients WHERE client_key = 'testClient'), '2024-12-24', TRUE, 'Heiligabend - Geschlossen'),
((SELECT id FROM clients WHERE client_key = 'testClient'), '2024-12-25', TRUE, '1. Weihnachtsfeiertag - Geschlossen'),
((SELECT id FROM clients WHERE client_key = 'testClient'), '2024-12-26', TRUE, '2. Weihnachtsfeiertag - Geschlossen'),
((SELECT id FROM clients WHERE client_key = 'testClient'), '2024-12-31', '09:00', '14:00', FALSE, 'Silvester - Verkürzte Öffnungszeiten'),
((SELECT id FROM clients WHERE client_key = 'testClient'), '2025-01-01', TRUE, 'Neujahr - Geschlossen');

-- Create some example callback requests
INSERT INTO callback_requests (client_id, user_message, ai_confidence, user_contact_info, priority, status) VALUES
((SELECT id FROM clients WHERE client_key = 'testClient'), 
 'Mein Auto macht komische Geräusche beim Bremsen. Können Sie mir helfen?', 
 0.75, 
 '{"phone": "+49 30 12345678", "email": "kunde@example.com", "preferred_time": "vormittags"}', 
 'high', 'pending'),

((SELECT id FROM clients WHERE client_key = 'testClient'), 
 'Ich benötige ein Angebot für eine Komplettlackierung meines BMW 3er.', 
 0.45, 
 '{"phone": "+49 30 98765432", "email": "bmw.kunde@example.com", "preferred_time": "nachmittags"}', 
 'medium', 'pending');