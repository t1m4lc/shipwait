-- Seed pricing data for Stripe integration

-- Insert plans
INSERT INTO "public"."plans" ("id", "name", "description") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Free', 'Free plan with basic features'),
('550e8400-e29b-41d4-a716-446655440002', 'Pro', 'Pro plan with advanced features'),
('550e8400-e29b-41d4-a716-446655440003', 'Lifetime', 'One-time payment for lifetime access')
ON CONFLICT (id) DO NOTHING;

-- Insert prices with your actual Stripe price IDs
INSERT INTO "public"."prices" ("id", "plan_id", "stripe_price_id", "currency", "unit_amount", "interval", "interval_count", "description", "active") VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'price_1Rbd4ZAO7Z9aERoyb0Y4iEGx', 'eur', 700, 'month', 1, 'Pro Monthly Plan', true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'price_1Rbd8qAO7Z9aERoyJzV2JUfx', 'eur', 4200, 'year', 1, 'Pro Yearly Plan (billed yearly)', true),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'price_1RbdSDAO7Z9aERoyLc8ZklJk', 'eur', 7900, null, null, 'Lifetime Access', true)
ON CONFLICT (stripe_price_id) DO NOTHING;
