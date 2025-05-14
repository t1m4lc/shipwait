INSERT INTO projects (id, user_id, name, domain, api_token, created_at)
VALUES
  ('1e8904f2-3b4a-4c37-a2f9-6b5c8f9d0e1a', 'b567ba6b-a4c5-4846-9158-154f455a3f32', 'Acme Marketing Campaign', 'acme.example.com', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW());

-- Sample Submission Behaviors linked to the above project
INSERT INTO submission_behaviors (id, project_id, behavior_type, message, redirect_url, created_at)
VALUES
  ('2c1d5e6f-7a8b-4c9d-b0e1-2f3a4b5c6d7e', '1e8904f2-3b4a-4c37-a2f9-6b5c8f9d0e1a', 'do_nothing', NULL, NULL, NOW()),
  ('3d2e6f7a-8b9c-4d0e-c1f2-3a4b5c6d7e8f', '1e8904f2-3b4a-4c37-a2f9-6b5c8f9d0e1a', 'show_message', 'Thank you for your submission!', NULL, NOW()),
  ('4e3f7a8b-9c0d-4e1f-d2a3-4b5c6d7e8f9a', '1e8904f2-3b4a-4c37-a2f9-6b5c8f9d0e1a', 'redirect', NULL, 'https://acme.example.com/thank-you', NOW());

-- Sample Leads for the project
INSERT INTO leads (id, project_id, email, submission_behavior_id, source, created_at, device_type, browser, os, country)
VALUES
  ('5f4a3b2c-1d0e-4f6a-b7c8-9d0e1f2a3b4c', '1e8904f2-3b4a-4c37-a2f9-6b5c8f9d0e1a', 'alice@example.com', '3d2e6f7a-8b9c-4d0e-c1f2-3a4b5c6d7e8f', 'landing_page', NOW(), 'desktop', 'Firefox', 'Windows', 'US'),
  ('6a5b4c3d-2e1f-4a7b-c8d9-0e1f2a3b4c5d', '1e8904f2-3b4a-4c37-a2f9-6b5c8f9d0e1a', 'bob@example.com', '4e3f7a8b-9c0d-4e1f-d2a3-4b5c6d7e8f9a', 'email_campaign', NOW(), 'mobile', 'Safari', 'iOS', 'CA'),
  ('7b6c5d4e-3f2a-4b8c-d9e0-1f2a3b4c5d6e', '1e8904f2-3b4a-4c37-a2f9-6b5c8f9d0e1a', 'carol@example.com', '2c1d5e6f-7a8b-4c9d-b0e1-2f3a4b5c6d7e', 'social_media', NOW(), 'tablet', 'Chrome', 'Android', 'UK');
