-- ─── Enable the UUID extension (if not already enabled) ───────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── 1) Epsilon Growth (7 leads) ────────────────────────────────────────────
WITH proj AS (
  INSERT INTO projects (id, user_id, name, created_at)
  VALUES (
    gen_random_uuid(),
    'b567ba6b-a4c5-4846-9158-154f455a3f32',
    'Epsilon Growth',
    NOW()
  )
  RETURNING id
)
INSERT INTO leads (
  id, project_id, email, submission_behavior_id, source,
  created_at, device_type, browser, os, country
)
SELECT
  gen_random_uuid(),
  proj.id,
  format('lead%1$s@epsilon.com', gs),
  (ARRAY[
    '2c1d5e6f-7a8b-4c9d-b0e1-2f3a4b5c6d7e'::uuid,
    '3d2e6f7a-8b9c-4d0e-c1f2-3a4b5c6d7e8f'::uuid,
    '4e3f7a8b-9c0d-4e1f-d2a3-4b5c6d7e8f9a'::uuid
  ])[(gs % 3) + 1],
  (ARRAY['webinar','ads','referral','social_media','organic','email_campaign','landing_page'])[gs],
  NOW(),
  (ARRAY['desktop','mobile','tablet'])[(gs % 3) + 1],
  (ARRAY['Chrome','Firefox','Safari','Edge'])[(gs % 4) + 1],
  (ARRAY['Windows','macOS','iOS','Android','Linux'])[(gs % 5) + 1],
  (ARRAY['US','CA','UK','DE','FR','IN','BR'])[gs]
FROM generate_series(1,7) AS gs, proj;


-- ─── 2) Zeta Feedback Loop (10 leads) ───────────────────────────────────────
WITH proj AS (
  INSERT INTO projects (id, user_id, name, created_at)
  VALUES (
    gen_random_uuid(),
    'b567ba6b-a4c5-4846-9158-154f455a3f32',
    'Zeta Feedback Loop',
    NOW()
  )
  RETURNING id
)
INSERT INTO leads (
  id, project_id, email, submission_behavior_id, source,
  created_at, device_type, browser, os, country
)
SELECT
  gen_random_uuid(),
  proj.id,
  format('user%1$s@zeta.io', gs + 100),
  (ARRAY[
    '2c1d5e6f-7a8b-4c9d-b0e1-2f3a4b5c6d7e'::uuid,
    '3d2e6f7a-8b9c-4d0e-c1f2-3a4b5c6d7e8f'::uuid,
    '4e3f7a8b-9c0d-4e1f-d2a3-4b5c6d7e8f9a'::uuid
  ])[(gs % 3) + 1],
  (ARRAY['survey','ads','referral','organic','email_campaign','social_media','webinar','landing_page','paid_search','affiliate'])[gs],
  NOW(),
  (ARRAY['desktop','mobile','tablet'])[(gs % 3) + 1],
  (ARRAY['Chrome','Firefox','Safari','Edge'])[(gs % 4) + 1],
  (ARRAY['Windows','macOS','iOS','Android','Linux'])[(gs % 5) + 1],
  (ARRAY['US','CA','UK','DE','FR','IN','BR','AU','NL','SE'])[gs]
FROM generate_series(1,10) AS gs, proj;


-- ─── 3) Theta Beta Test (8 leads) ───────────────────────────────────────────
WITH proj AS (
  INSERT INTO projects (id, user_id, name, created_at)
  VALUES (
    gen_random_uuid(),
    'b567ba6b-a4c5-4846-9158-154f455a3f32',
    'Theta Beta Test',
    NOW()
  )
  RETURNING id
)
INSERT INTO leads (
  id, project_id, email, submission_behavior_id, source,
  created_at, device_type, browser, os, country
)
SELECT
  gen_random_uuid(),
  proj.id,
  format('tester%1$s@theta.dev', gs + 200),
  (ARRAY[
    '2c1d5e6f-7a8b-4c9d-b0e1-2f3a4b5c6d7e'::uuid,
    '3d2e6f7a-8b9c-4d0e-c1f2-3a4b5c6d7e8f'::uuid,
    '4e3f7a8b-9c0d-4e1f-d2a3-4b5c6d7e8f9a'::uuid
  ])[(gs % 3) + 1],
  (ARRAY['beta_invite','ads','referral','organic','email_campaign','social_media','api','landing_page','webinar'])[gs],
  NOW(),
  (ARRAY['desktop','mobile','tablet'])[(gs % 3) + 1],
  (ARRAY['Chrome','Firefox','Safari','Edge'])[(gs % 4) + 1],
  (ARRAY['Windows','macOS','iOS','Android','Linux'])[(gs % 5) + 1],
  (ARRAY['US','CA','UK','DE','FR','IN','BR','AU','NL','SE'])[gs]
FROM generate_series(1,8) AS gs, proj;


-- ─── 4) Lambda UI Test (0 leads) ────────────────────────────────────────────
INSERT INTO projects (id, user_id, name, created_at)
VALUES (
  gen_random_uuid(),
  'b567ba6b-a4c5-4846-9158-154f455a3f32',
  'Lambda UI Test',
  NOW()
);
