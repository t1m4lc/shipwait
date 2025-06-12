-- Migration to create page_template table and update architecture
-- Drop custom_page_template and replace with admin-only page_template

-- Drop existing custom_page_template table
DROP TABLE IF EXISTS custom_page_template CASCADE;

-- Create page_template table (admin-only templates)
CREATE TABLE IF NOT EXISTS page_template (
  id              UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT      NOT NULL,
  description     TEXT,
  html            TEXT      NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE page_template ENABLE ROW LEVEL SECURITY;

-- Create policy for page_template - only admins can manage templates
-- Note: You'll need to define admin users by email or role
CREATE POLICY page_template_admin_only ON page_template
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@shipwait.com',
      'timothy@shipwait.com'
      -- Add more admin emails as needed
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'admin@shipwait.com', 
      'timothy@shipwait.com'
      -- Add more admin emails as needed
    )
  );

-- Allow all authenticated users to read page_template (for template selection)
CREATE POLICY page_template_read_all ON page_template
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Update existing pages table to ensure slug is unique
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_slug_unique;
ALTER TABLE pages ADD CONSTRAINT pages_slug_unique UNIQUE (slug);

-- Insert some default templates (you can add more)
INSERT INTO page_template (name, description, html) VALUES 
(
  'Simple Landing Page', 
  'A clean and minimal landing page template',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Landing Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 40px 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; text-align: center; margin-bottom: 30px; }
        form { text-align: center; }
        input[type="email"] { padding: 12px; font-size: 16px; border: 2px solid #ddd; border-radius: 4px; width: 250px; margin-right: 10px; }
        button { padding: 12px 24px; font-size: 16px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #005a87; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Coming Soon!</h1>
        <p>We are working on something amazing. Join our waitlist to be the first to know when we launch.</p>
        <form>
            <input data-shipwait type="email" placeholder="Enter your email" required>
            <button type="submit">Join Waitlist</button>
        </form>
    </div>
</body>
</html>'
),
(
  'Modern Gradient Landing', 
  'A modern landing page with gradient background',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Landing Page</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            max-width: 500px; 
            padding: 60px 40px; 
            background: rgba(255,255,255,0.95); 
            border-radius: 20px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            backdrop-filter: blur(10px);
        }
        h1 { 
            color: #333; 
            font-size: 2.5rem; 
            margin-bottom: 20px; 
            font-weight: 700;
        }
        p { 
            color: #666; 
            line-height: 1.6; 
            font-size: 1.1rem;
            margin-bottom: 40px; 
        }
        .form-group { margin-bottom: 20px; }
        input[type="email"] { 
            width: 100%; 
            padding: 16px; 
            font-size: 16px; 
            border: 2px solid #e1e5e9; 
            border-radius: 12px; 
            box-sizing: border-box;
            transition: border-color 0.3s ease;
        }
        input[type="email"]:focus {
            outline: none;
            border-color: #667eea;
        }
        button { 
            width: 100%; 
            padding: 16px; 
            font-size: 16px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            border: none; 
            border-radius: 12px; 
            cursor: pointer; 
            font-weight: 600;
            transition: transform 0.2s ease;
        }
        button:hover { 
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Something Big is Coming</h1>
        <p>Be the first to experience our revolutionary new product. Join thousands of others on our exclusive waitlist.</p>
        <form>
            <div class="form-group">
                <input data-shipwait type="email" placeholder="Enter your email address" required>
            </div>
            <button type="submit">Get Early Access</button>
        </form>
    </div>
</body>
</html>'
);
