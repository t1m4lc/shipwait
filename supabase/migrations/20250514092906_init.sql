-- 0) Nettoyage de la base (drop dans le bon ordre pour éviter les conflits de dépendances)

-- Supprimer les tables (ce qui supprime aussi automatiquement leurs politiques)
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS submission_behaviors CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Supprimer les policies résiduelles avec vérification d'existence de la table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'leads') THEN
    EXECUTE 'DROP POLICY IF EXISTS leads_owner_only ON leads';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'submission_behaviors') THEN
    EXECUTE 'DROP POLICY IF EXISTS behaviors_owner_only ON submission_behaviors';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'projects') THEN
    EXECUTE 'DROP POLICY IF EXISTS projects_owner_only ON projects';
  END IF;
END$$;

-- Supprimer les types ENUM
DROP TYPE IF EXISTS submission_behavior_type;

-- 1) Extension pour générer des UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) ENUM pour les types de comportement de soumission
CREATE TYPE submission_behavior_type AS ENUM (
  'do_nothing',
  'show_message',
  'redirect'
);

-- 3) Table "projects"
CREATE TABLE IF NOT EXISTS projects (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID      NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT      NOT NULL,
  domain     TEXT      NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4) Table "submission_behaviors" associée à un projet
CREATE TABLE IF NOT EXISTS submission_behaviors (
  id             UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID                     NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  behavior_type  submission_behavior_type NOT NULL,
  message        VARCHAR(120),
  redirect_url   TEXT,
  created_at     TIMESTAMP                NOT NULL DEFAULT NOW()
);

-- 5) Table "leads" avec champ "source"
CREATE TABLE IF NOT EXISTS leads (
  id                     UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id             UUID      NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email                  TEXT      NOT NULL,
  submission_behavior_id UUID      NOT NULL REFERENCES submission_behaviors(id) ON DELETE SET NULL,
  source                 TEXT,  -- nouveau champ indiquant la provenance du lead
  created_at             TIMESTAMP NOT NULL DEFAULT NOW(),
  device_type            TEXT,
  browser                TEXT,
  os                     TEXT,
  country                TEXT
);

-- 6) Activer la sécurité au niveau de la ligne (RLS)
ALTER TABLE projects               ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_behaviors   ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads                  ENABLE ROW LEVEL SECURITY;

-- 7) Politiques RLS

-- Seul le propriétaire peut voir et modifier ses projets
CREATE POLICY projects_owner_only ON projects
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Seul le propriétaire du projet peut lire/écrire ses comportements de soumission
CREATE POLICY behaviors_owner_only ON submission_behaviors
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- Politiques pour les leads : l'utilisateur ne voit que ses leads et ne peut en créer que pour ses projets
CREATE POLICY leads_owner_only ON leads
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );
