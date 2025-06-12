-- Migration to add subscription-based access control to page templates
-- Simple approach: use is_free boolean column

-- Add is_free column to page_template table (defaults to true for backward compatibility)
ALTER TABLE page_template 
ADD COLUMN is_free BOOLEAN DEFAULT true;

-- Update the existing read policy to include subscription-based access control
DROP POLICY IF EXISTS page_template_read_all ON page_template;

-- Create new policy that respects subscription access
CREATE POLICY page_template_subscription_access ON page_template
FOR SELECT
TO authenticated
USING (
  -- Allow access to free templates
  is_free = true
  OR
  -- Allow access to premium templates based on user's active subscription
  (is_free = false AND EXISTS (
    SELECT 1 
    FROM public.subscriptions s
    WHERE s.user_id = auth.uid()
      AND s.status IN ('active', 'trialing')
  ))
);

-- Update existing templates to be free (default behavior)
UPDATE page_template 
SET is_free = true
WHERE name IN ('Simple Landing Page', 'Modern Gradient Landing');

-- Add some premium templates that require subscription
INSERT INTO page_template (name, description, html, is_free, "order") VALUES 
(
  'Premium Dark Theme', 
  'A sophisticated dark theme landing page (Pro only)',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Dark Landing</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            max-width: 600px; 
            padding: 80px 40px; 
            background: rgba(255,255,255,0.05); 
            border-radius: 24px; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            text-align: center;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        h1 { 
            color: #ffffff; 
            font-size: 3rem; 
            margin-bottom: 24px; 
            font-weight: 800;
            background: linear-gradient(135deg, #ffffff 0%, #a855f7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p { 
            color: #cccccc; 
            line-height: 1.7; 
            font-size: 1.2rem;
            margin-bottom: 40px; 
        }
        .form-group { margin-bottom: 24px; }
        input[type="email"] { 
            width: 100%; 
            padding: 18px 24px; 
            font-size: 16px; 
            border: 2px solid rgba(255,255,255,0.2); 
            border-radius: 16px; 
            box-sizing: border-box;
            background: rgba(255,255,255,0.1);
            color: #ffffff;
            transition: all 0.3s ease;
        }
        input[type="email"]:focus {
            outline: none;
            border-color: #a855f7;
            background: rgba(255,255,255,0.15);
        }
        input[type="email"]::placeholder {
            color: #999999;
        }
        button { 
            width: 100%; 
            padding: 18px 24px; 
            font-size: 18px; 
            background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
            color: white; 
            border: none; 
            border-radius: 16px; 
            cursor: pointer; 
            font-weight: 700;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(168, 85, 247, 0.4);
        }
        .badge {
            display: inline-block;
            background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">🚀 Premium Template</div>
        <h1>Revolutionary Launch</h1>
        <p>Experience the future of innovation. Join our exclusive community and be among the first to discover what''s next.</p>
        <form>
            <div class="form-group">
                <input data-shipwait type="email" placeholder="Enter your email for exclusive access" required>
            </div>
            <button type="submit">Join the Revolution</button>
        </form>
    </div>
</body>
</html>',
  false,
  3
),
(
  'Enterprise Glassmorphism', 
  'Modern glassmorphism design (Pro only)',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glassmorphism Landing</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .container { 
            max-width: 550px; 
            padding: 60px 50px; 
            background: rgba(255, 255, 255, 0.25);
            border-radius: 30px; 
            box-shadow: 
                0 8px 32px 0 rgba(31, 38, 135, 0.37),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            text-align: center;
            position: relative;
            z-index: 1;
        }
        h1 { 
            color: #ffffff; 
            font-size: 2.8rem; 
            margin-bottom: 20px; 
            font-weight: 800;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p { 
            color: rgba(255, 255, 255, 0.9); 
            line-height: 1.6; 
            font-size: 1.1rem;
            margin-bottom: 40px; 
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .form-group { margin-bottom: 20px; }
        input[type="email"] { 
            width: 100%; 
            padding: 16px 20px; 
            font-size: 16px; 
            border: 2px solid rgba(255, 255, 255, 0.3); 
            border-radius: 15px; 
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.2);
            color: #333;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        input[type="email"]:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.3);
        }
        input[type="email"]::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        button { 
            width: 100%; 
            padding: 16px 20px; 
            font-size: 18px; 
            background: rgba(255, 255, 255, 0.3);
            color: white; 
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px; 
            cursor: pointer; 
            font-weight: 700;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        button:hover { 
            background: rgba(255, 255, 255, 0.4);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
        }
        .premium-badge {
            position: absolute;
            top: -15px;
            right: -15px;
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="premium-badge">✨ PREMIUM</div>
        <h1>Glass Vision</h1>
        <p>Step into the future with our revolutionary glassmorphism design. Experience transparency like never before.</p>
        <form>
            <div class="form-group">
                <input data-shipwait type="email" placeholder="Your email address" required>
            </div>
            <button type="submit">Experience the Future</button>
        </form>
    </div>
</body>
</html>',
  false,
  4
);

-- Add order column for better template sorting if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_template' AND column_name = 'order') THEN
        ALTER TABLE page_template ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END $$;

-- Update order for existing templates
UPDATE page_template SET "order" = 1 WHERE name = 'Simple Landing Page';
UPDATE page_template SET "order" = 2 WHERE name = 'Modern Gradient Landing';
