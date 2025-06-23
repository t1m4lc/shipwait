-- Enhanced Production Migration: Handle existing tables and add missing columns
-- This migration safely handles cases where tables might already exist

-- 1. Créer la table plans (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS "public"."plans" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);

-- 2. Vérifier et créer/modifier la table prices
DO $$ 
BEGIN
    -- Créer la table prices si elle n'existe pas
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prices') THEN
        CREATE TABLE "public"."prices" (
            "id" uuid not null default gen_random_uuid(),
            "plan_id" uuid not null,
            "stripe_price_id" text not null unique,
            "currency" text not null default 'eur',
            "unit_amount" integer,
            "interval" text,
            "interval_count" integer default 1,
            "description" text,
            "active" boolean default true,
            "created_at" timestamp without time zone not null default now(),
            "updated_at" timestamp without time zone not null default now()
        );
    ELSE
        -- Si la table existe, ajouter les colonnes manquantes
        
        -- Ajouter plan_id si elle n'existe pas
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'plan_id') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "plan_id" uuid;
        END IF;
        
        -- Ajouter les autres colonnes si elles n'existent pas
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'currency') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "currency" text not null default 'eur';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'unit_amount') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "unit_amount" integer;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'interval') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "interval" text;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'interval_count') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "interval_count" integer default 1;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'description') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "description" text;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'active') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "active" boolean default true;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'created_at') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "created_at" timestamp without time zone not null default now();
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prices' AND column_name = 'updated_at') THEN
            ALTER TABLE "public"."prices" ADD COLUMN "updated_at" timestamp without time zone not null default now();
        END IF;
    END IF;
END $$;

-- 3. Vérifier et modifier la table subscriptions
DO $$ 
BEGIN
    -- Ajouter plan_id dans subscriptions si elle n'existe pas
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'plan_id') THEN
        ALTER TABLE "public"."subscriptions" ADD COLUMN "plan_id" uuid;
    END IF;
    
    -- Ajouter price_id dans subscriptions si elle n'existe pas
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'price_id') THEN
        ALTER TABLE "public"."subscriptions" ADD COLUMN "price_id" uuid;
    END IF;
END $$;

-- 4. Ajouter les contraintes (maintenant que les colonnes existent)
DO $$ 
BEGIN
    -- Ajouter primary keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'plans_pkey') THEN
        ALTER TABLE "public"."plans" ADD CONSTRAINT "plans_pkey" PRIMARY KEY ("id");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'prices_pkey') THEN
        ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");
    END IF;
    
    -- Ajouter foreign key constraints (maintenant que plan_id existe)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'prices_plan_id_fkey') THEN
        ALTER TABLE "public"."prices" 
        ADD CONSTRAINT "prices_plan_id_fkey" 
        FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE CASCADE;
    END IF;
    
    -- Mettre à jour la table subscriptions
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'subscriptions_plan_id_fkey') THEN
        ALTER TABLE "public"."subscriptions" 
        ADD CONSTRAINT "subscriptions_plan_id_fkey" 
        FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'subscriptions_price_id_fkey') THEN
        ALTER TABLE "public"."subscriptions" 
        ADD CONSTRAINT "subscriptions_price_id_fkey" 
        FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id") ON DELETE SET NULL;
    END IF;
END $$;

-- 5. Activer RLS
ALTER TABLE "public"."plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

-- 6. Créer les index
CREATE INDEX IF NOT EXISTS "prices_stripe_price_id_idx" ON "public"."prices" ("stripe_price_id");
CREATE INDEX IF NOT EXISTS "prices_plan_id_idx" ON "public"."prices" ("plan_id");
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "public"."subscriptions" ("user_id");
CREATE INDEX IF NOT EXISTS "subscriptions_stripe_subscription_id_idx" ON "public"."subscriptions" ("stripe_subscription_id");

-- 7. Politiques RLS
DROP POLICY IF EXISTS "Plans are public" ON "public"."plans";
CREATE POLICY "Plans are public" ON "public"."plans" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Active prices are public" ON "public"."prices";
CREATE POLICY "Active prices are public" ON "public"."prices" FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Users can view own subscriptions" ON "public"."subscriptions";
CREATE POLICY "Users can view own subscriptions" ON "public"."subscriptions" FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON "public"."subscriptions";
CREATE POLICY "Service role can manage all subscriptions" ON "public"."subscriptions" FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 8. Permissions
GRANT SELECT ON "public"."plans" TO anon, authenticated;
GRANT SELECT ON "public"."prices" TO anon, authenticated;
GRANT ALL ON "public"."plans" TO service_role;
GRANT ALL ON "public"."prices" TO service_role;
GRANT ALL ON "public"."subscriptions" TO service_role;
GRANT SELECT ON "public"."subscriptions" TO authenticated;

-- 9. Insérer les données
INSERT INTO "public"."plans" ("id", "name", "description") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Free', 'Free plan with basic features'),
('550e8400-e29b-41d4-a716-446655440002', 'Pro', 'Pro plan with advanced features'),
('550e8400-e29b-41d4-a716-446655440003', 'Lifetime', 'One-time payment for lifetime access')
ON CONFLICT (id) DO NOTHING;

-- 10. Insérer les prix APRÈS avoir inséré les plans
INSERT INTO "public"."prices" ("id", "plan_id", "stripe_price_id", "currency", "unit_amount", "interval", "interval_count", "description", "active") VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'price_1Rbd4ZAO7Z9aERoyb0Y4iEGx', 'eur', 700, 'month', 1, 'Pro Monthly Plan', true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'price_1Rbd8qAO7Z9aERoyJzV2JUfx', 'eur', 4200, 'year', 1, 'Pro Yearly Plan (billed yearly)', true),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'price_1RbdSDAO7Z9aERoyLc8ZklJk', 'eur', 7900, null, null, 'Lifetime Access', true)
ON CONFLICT (stripe_price_id) DO NOTHING;

-- 11. Mise à jour des prix existants (si il y en a) pour associer au bon plan
UPDATE "public"."prices" SET 
    plan_id = '550e8400-e29b-41d4-a716-446655440002',
    unit_amount = CASE 
        WHEN stripe_price_id = 'price_1Rbd4ZAO7Z9aERoyb0Y4iEGx' THEN 700
        WHEN stripe_price_id = 'price_1Rbd8qAO7Z9aERoyJzV2JUfx' THEN 4200
        ELSE unit_amount
    END,
    interval = CASE 
        WHEN stripe_price_id = 'price_1Rbd4ZAO7Z9aERoyb0Y4iEGx' THEN 'month'
        WHEN stripe_price_id = 'price_1Rbd8qAO7Z9aERoyJzV2JUfx' THEN 'year'
        ELSE interval
    END,
    interval_count = CASE 
        WHEN stripe_price_id IN ('price_1Rbd4ZAO7Z9aERoyb0Y4iEGx', 'price_1Rbd8qAO7Z9aERoyJzV2JUfx') THEN 1
        ELSE interval_count
    END,
    active = true
WHERE stripe_price_id IN ('price_1Rbd4ZAO7Z9aERoyb0Y4iEGx', 'price_1Rbd8qAO7Z9aERoyJzV2JUfx');

UPDATE "public"."prices" SET 
    plan_id = '550e8400-e29b-41d4-a716-446655440003',
    unit_amount = 7900,
    interval = null,
    interval_count = null,
    active = true
WHERE stripe_price_id = 'price_1RbdSDAO7Z9aERoyLc8ZklJk';

-- 12. Vérification finale
SELECT 
  p.name as plan_name,
  pr.stripe_price_id,
  pr.unit_amount / 100.0 as price_eur,
  pr.interval,
  pr.active
FROM plans p 
JOIN prices pr ON p.id = pr.plan_id 
ORDER BY pr.unit_amount;
