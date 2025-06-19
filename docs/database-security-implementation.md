# Database Security & User Management Implementation

## Overview

This implementation provides a secure, simple database structure with CASCADE deletion and proper Row Level Security (RLS) policies for user and subscription management.

## 1. Database CASCADE Constraints

### Apply this SQL migration to set up CASCADE deletion:

```sql
-- Simple cascade deletion constraints and performance indexes

-- Drop existing foreign key constraints
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_project_id_fkey;
ALTER TABLE submission_behaviors DROP CONSTRAINT IF EXISTS submission_behaviors_project_id_fkey;
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_project_id_fkey;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

-- Add foreign key constraints with CASCADE deletion
-- When a user is deleted, everything is deleted
ALTER TABLE projects
ADD CONSTRAINT projects_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- When a project is deleted, all related data is deleted
ALTER TABLE leads
ADD CONSTRAINT leads_project_id_fkey
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE submission_behaviors
ADD CONSTRAINT submission_behaviors_project_id_fkey
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE pages
ADD CONSTRAINT pages_project_id_fkey
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Performance indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_projects_user_id_created_at
ON projects(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_slug
ON projects(slug) WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_project_id_created_at
ON leads(project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_project_email
ON leads(project_id, email);

CREATE INDEX IF NOT EXISTS idx_pages_project_id
ON pages(project_id);

CREATE INDEX IF NOT EXISTS idx_pages_active_project
ON pages(project_id, active) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_submission_behaviors_project_id
ON submission_behaviors(project_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status
ON subscriptions(user_id, status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
ON subscriptions(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_template_type_order
ON page_template(type, "order") WHERE type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_template_is_free
ON page_template(is_free) WHERE is_free = true;
```

## 2. Updated RLS Policies for Subscriptions

### Apply this SQL migration for proper subscription security:

```sql
-- Updated RLS policies for subscriptions (read-only for users, service role can manage)

-- Drop existing subscription policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own active subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own active subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can view orphaned subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users manage own subscriptions" ON subscriptions;

-- Users can only VIEW their subscriptions (read-only)
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for Stripe webhooks)
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow INSERT for service role (webhook creates subscriptions)
CREATE POLICY "Service role can insert subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Allow UPDATE for service role (webhook updates subscription status)
CREATE POLICY "Service role can update subscriptions" ON subscriptions
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow DELETE for CASCADE when user is deleted (handled by foreign key constraint)
-- No explicit DELETE policy needed as CASCADE deletion is handled by constraint
```

## 3. Store Implementation

### User Store (`/stores/user.store.ts`)

- **Simple deletion**: Just deletes from `profiles` table
- **Automatic CASCADE**: Database handles all related data deletion
- **Store cleanup**: Clears Pinia stores after deletion
- **Auto sign-out**: Signs user out after successful deletion

### Projects Store (updated)

- **Enhanced deleteProject()**: Async method with error handling
- **Security check**: Ensures user owns the project before deletion
- **Local state cleanup**: Removes from store and clears page data
- **CASCADE handled**: Database automatically deletes leads, pages, behaviors

### Page Store (updated)

- **deletePage() method**: For completeness (usually handled by CASCADE)
- **Store returns**: Includes the new delete method

## 4. Profile Settings UI

### Features:

- **Profile Information**: Shows email and user ID
- **Account Activity**: Project count, subscription status, member since
- **Danger Zone**: Clear warning section for account deletion
- **Confirmation Dialog**: Requires typing "DELETE" to confirm
- **Loading States**: Shows loading spinners during deletion
- **Error Handling**: Proper error messages and success notifications

### Security Features:

- **Double confirmation**: Button + dialog + typing confirmation
- **Clear warnings**: Lists exactly what will be deleted
- **Non-reversible warning**: Clear indication this cannot be undone

## 5. How CASCADE Deletion Works

### Delete User Account:

```
User deletes account
    ↓
DELETE FROM profiles WHERE id = user_id
    ↓
CASCADE triggers automatically:
    ├── DELETE projects WHERE user_id = user_id
    │   ├── CASCADE: DELETE leads WHERE project_id IN (...)
    │   ├── CASCADE: DELETE pages WHERE project_id IN (...)
    │   └── CASCADE: DELETE submission_behaviors WHERE project_id IN (...)
    └── DELETE subscriptions WHERE user_id = user_id
```

### Delete Project:

```
User deletes project
    ↓
DELETE FROM projects WHERE id = project_id
    ↓
CASCADE triggers automatically:
    ├── DELETE leads WHERE project_id = project_id
    ├── DELETE pages WHERE project_id = project_id
    └── DELETE submission_behaviors WHERE project_id = project_id
```

## 6. Security Benefits

1. **Subscription Security**: Users can only VIEW their subscriptions, not modify them
2. **Service Role Control**: Only Stripe webhooks (service role) can manage subscriptions
3. **Data Consistency**: CASCADE ensures no orphaned data
4. **Performance**: Optimized indexes for common queries
5. **User Ownership**: RLS ensures users only access their own data

## 7. Usage Examples

### Delete User Account:

```typescript
const userStore = useUserStore();
const result = await userStore.deleteAccount();

if (result.success) {
  // User redirected automatically
} else {
  console.error(result.error);
}
```

### Delete Project:

```typescript
const projectsStore = useProjectsStore();
const result = await projectsStore.deleteProject(projectId);

if (result.success) {
  // Project and all related data deleted
} else {
  console.error(result.error);
}
```

## 8. Benefits of This Approach

1. **Simplicity**: No complex deletion functions
2. **Reliability**: Database handles consistency automatically
3. **Performance**: Single DELETE triggers cascade
4. **Security**: Proper RLS ensures data isolation
5. **Maintainability**: Easy to understand and modify
6. **Audit Trail**: Database logs all deletion operations

This implementation provides a robust, secure, and maintainable solution for user and data management with proper cascade deletion and security policies.
