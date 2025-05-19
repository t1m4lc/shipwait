-- Migration for custom_page_template table
-- This table stores user-defined page templates

-- Create custom_page_template table
CREATE TABLE IF NOT EXISTS custom_page_template (
  id              UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID      NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id      UUID      NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name            TEXT      NOT NULL,
  html            TEXT      NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE custom_page_template ENABLE ROW LEVEL SECURITY;

-- Create policy for custom_page_template - users can only access their own templates
CREATE POLICY custom_page_template_owner_only ON custom_page_template
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS pages (
  id              UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID      NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title           TEXT,
  html            TEXT      NOT NULL,
  active          BOOLEAN   DEFAULT true,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create policy for pages
-- CREATE POLICY  pages_owner_only ON pages
--   USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
--   WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));