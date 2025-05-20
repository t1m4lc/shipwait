-- Add slug field to projects table
ALTER TABLE projects 
ADD COLUMN slug TEXT UNIQUE;

-- Create an index for faster slug lookup
CREATE INDEX projects_slug_idx ON projects(slug);

-- Update existing projects with default slugs based on their IDs
-- This ensures all existing projects get a valid slug
UPDATE projects 
SET slug = 'project-' || REPLACE(CAST(id AS TEXT), '-', '')
WHERE slug IS NULL;

-- Make slug field required for future entries
ALTER TABLE projects 
ALTER COLUMN slug SET NOT NULL;

-- Create a function to check slug availability and generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT) 
RETURNS TEXT AS $$
DECLARE
    new_slug TEXT := base_slug;
    counter INTEGER := 1;
BEGIN
    -- Try with the original slug first
    LOOP
        -- Exit if no duplicate found
        IF NOT EXISTS (SELECT 1 FROM projects WHERE slug = new_slug) THEN
            RETURN new_slug;
        END IF;
        
        -- Generate a new slug with counter
        new_slug := base_slug || '-' || counter;
        counter := counter + 1;
        
        -- Safety exit - avoid infinite loops
        IF counter > 100 THEN
            RETURN base_slug || '-' || floor(random() * 10000)::TEXT;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to generate a slug from project name
CREATE OR REPLACE FUNCTION generate_slug_from_name(name TEXT) 
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
BEGIN
    -- Convert to lowercase
    base_slug := LOWER(name);
    
    -- Replace spaces and special chars with hyphens
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9]+', '-', 'g');
    
    -- Remove leading and trailing hyphens
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- If empty after cleaning, use a default
    IF base_slug = '' THEN
        base_slug := 'project';
    END IF;
    
    -- Return unique slug
    RETURN generate_unique_slug(base_slug);
END;
$$ LANGUAGE plpgsql;
