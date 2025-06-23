-- Add pricing and subscription tables for Stripe integration

-- Create plans table
CREATE TABLE IF NOT EXISTS "public"."plans" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);

-- Create prices table  
CREATE TABLE IF NOT EXISTS "public"."prices" (
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

-- Create subscriptions table (should already exist but let's ensure it's complete)
CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "plan_id" uuid,
    "price_id" uuid,
    "stripe_subscription_id" text not null unique,
    "stripe_customer_id" text not null,
    "status" text not null,
    "current_period_start" timestamp without time zone,
    "current_period_end" timestamp without time zone,
    "cancel_at_period_end" boolean default false,
    "canceled_at" timestamp without time zone,
    "ended_at" timestamp without time zone,
    "trial_start" timestamp without time zone,
    "trial_end" timestamp without time zone,
    "metadata" jsonb,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);

-- Add primary keys
ALTER TABLE "public"."plans" ADD CONSTRAINT "plans_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");

-- Add foreign key constraints
ALTER TABLE "public"."prices" 
ADD CONSTRAINT "prices_plan_id_fkey" 
FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE CASCADE;

-- Add foreign key for subscriptions (if not already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'subscriptions_plan_id_fkey'
    ) THEN
        ALTER TABLE "public"."subscriptions" 
        ADD CONSTRAINT "subscriptions_plan_id_fkey" 
        FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE SET NULL;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'subscriptions_price_id_fkey'
    ) THEN
        ALTER TABLE "public"."subscriptions" 
        ADD CONSTRAINT "subscriptions_price_id_fkey" 
        FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id") ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE "public"."plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "prices_stripe_price_id_idx" ON "public"."prices" ("stripe_price_id");
CREATE INDEX IF NOT EXISTS "prices_plan_id_idx" ON "public"."prices" ("plan_id");
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "public"."subscriptions" ("user_id");
CREATE INDEX IF NOT EXISTS "subscriptions_stripe_subscription_id_idx" ON "public"."subscriptions" ("stripe_subscription_id");

-- RLS Policies for plans (public read access)
CREATE POLICY "Plans are public" ON "public"."plans" FOR SELECT USING (true);

-- RLS Policies for prices (public read access for active prices)
CREATE POLICY "Active prices are public" ON "public"."prices" 
FOR SELECT USING (active = true);

-- RLS Policies for subscriptions (users can view their own, service role can manage all)
CREATE POLICY "Users can view own subscriptions" ON "public"."subscriptions"
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON "public"."subscriptions"
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT SELECT ON "public"."plans" TO anon, authenticated;
GRANT SELECT ON "public"."prices" TO anon, authenticated;
GRANT ALL ON "public"."plans" TO service_role;
GRANT ALL ON "public"."prices" TO service_role;
GRANT ALL ON "public"."subscriptions" TO service_role;
GRANT SELECT ON "public"."subscriptions" TO authenticated;
