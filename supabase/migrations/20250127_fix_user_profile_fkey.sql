-- Fix foreign key constraints and create profiles table
-- This addresses the "projects_user_id_fkey" constraint violation

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL,
    "full_name" text,
    "avatar_url" text,
    "stripe_customer_id" text,
    "created_at" timestamp without time zone DEFAULT now(),
    "updated_at" timestamp without time zone DEFAULT now(),
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- Enable RLS on profiles
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraint from profiles to auth.users (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fkey' 
        AND table_name = 'profiles' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "public"."profiles" 
        ADD CONSTRAINT "profiles_id_fkey" 
        FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
    END IF;
END $$;

-- Drop existing projects foreign key constraint and add new one
DO $$ 
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'projects_user_id_fkey' 
        AND table_name = 'projects' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "public"."projects" 
        DROP CONSTRAINT "projects_user_id_fkey";
    END IF;

    -- Add new foreign key constraint referencing profiles table
    ALTER TABLE "public"."projects" 
    ADD CONSTRAINT "projects_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
END $$;

-- Drop existing subscriptions foreign key constraint if it exists and table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions' AND table_schema = 'public') THEN
        ALTER TABLE "public"."subscriptions" 
        DROP CONSTRAINT IF EXISTS "subscriptions_user_id_fkey";

        -- Add new foreign key constraint for subscriptions referencing profiles table
        ALTER TABLE "public"."subscriptions" 
        ADD CONSTRAINT "subscriptions_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
    END IF;
END $$;

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for existing users (if any)
INSERT INTO public.profiles (id, full_name, avatar_url, created_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name') as full_name,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  created_at
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for profiles (only if they don't exist)
DO $$
BEGIN
    -- Users can view own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can view own profile' 
        AND tablename = 'profiles' 
        AND schemaname = 'public'
    ) THEN
        CREATE POLICY "Users can view own profile" 
        ON "public"."profiles" 
        FOR SELECT USING (auth.uid() = id);
    END IF;

    -- Users can update own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Users can update own profile' 
        AND tablename = 'profiles' 
        AND schemaname = 'public'
    ) THEN
        CREATE POLICY "Users can update own profile" 
        ON "public"."profiles" 
        FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- Service role can manage all profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Service role can manage all profiles' 
        AND tablename = 'profiles' 
        AND schemaname = 'public'
    ) THEN
        CREATE POLICY "Service role can manage all profiles" 
        ON "public"."profiles" 
        FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- Grant permissions
GRANT SELECT, UPDATE ON "public"."profiles" TO authenticated;
GRANT ALL ON "public"."profiles" TO service_role;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "profiles_stripe_customer_id_idx" 
ON "public"."profiles" ("stripe_customer_id") 
WHERE stripe_customer_id IS NOT NULL;

-- Update foreign key constraints for other tables that reference auth.users (if they exist)
DO $$ 
BEGIN
    -- Only update custom_page_template if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custom_page_template' AND table_schema = 'public') THEN
        ALTER TABLE "public"."custom_page_template" 
        DROP CONSTRAINT IF EXISTS "custom_page_template_user_id_fkey";

        ALTER TABLE "public"."custom_page_template" 
        ADD CONSTRAINT "custom_page_template_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
    END IF;
END $$;
