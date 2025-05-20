-- Ensure all existing projects have valid slugs
UPDATE projects 
SET slug = 'project-' || REPLACE(CAST(id AS TEXT), '-', '')
WHERE slug IS NULL OR slug = '';

-- Create a trigger to automatically generate slugs from project names for new projects
CREATE OR REPLACE FUNCTION set_project_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate slug if not provided
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_slug_from_name(NEW.name);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the projects table
DROP TRIGGER IF EXISTS before_insert_project ON projects;
CREATE TRIGGER before_insert_project
    BEFORE INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION set_project_slug();
