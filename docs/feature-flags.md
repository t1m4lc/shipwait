# Feature Flags System Documentation

This documentation covers the complete feature flags system implementation including RLS policies, Pinia store, and middleware.

## Overview

The feature flags system allows you to control access to features based on user subscriptions. It consists of:

1. **Database-level security** via Row-Level Security (RLS)
2. **Client-side access control** via Pinia store
3. **Route protection** via Nuxt middleware
4. **Component-level checks** via composables

## Database Setup

The RLS policy ensures users can only see feature flags available to their subscription tier:

```sql
-- Run this migration to enable RLS
-- File: supabase/migrations/add_feature_flags_rls.sql
```

## Usage Examples

### 1. Using the Store Directly

```typescript
// In a component or composable
const featureFlagsStore = useFeatureFlagsStore();

// Check if user has a feature
if (featureFlagsStore.hasFeature("remove_branding_on_page")) {
  // Show remove branding option
}

// Check project limits
const limit = featureFlagsStore.getFeatureLimit("project_limit");
if (
  limit === "unlimited" ||
  (typeof limit === "string" && projects.length < Number(limit))
) {
  // Allow creating new project
}
```

### 2. Using the Store (Recommended)

```typescript
// In a component
const featureFlagsStore = useFeatureFlagsStore();

// Check branding removal
if (featureFlagsStore.canRemoveBranding()) {
  // Show branding removal options
}

// Check project limits with detailed info
const projectCheck = featureFlagsStore.checkProjectLimit(
  currentProjects.length
);
if (!projectCheck.canCreate) {
  // Show upgrade prompt
  console.log(`You've reached your limit of ${projectCheck.limit} projects`);
}
```

### 3. Route Protection with Middleware

```typescript
// for custom features
definePageMeta({
  middleware: (to) => {
    const featureFlagsStore = useFeatureFlagsStore();
    const featureNames = featureFlagsStore.featureNames;

    if (!featureNames.includes("advanced_analytics")) {
      throw createError({
        statusCode: 402,
        statusMessage: "Advanced analytics requires a Pro subscription",
      });
    }
  },
});
```

### 4. Component-Level Feature Gating

```vue
<template>
  <div>
    <!-- Show feature only if user has access -->
    <div v-if="canRemoveBranding()">
      <button @click="removeBranding">Remove Branding</button>
    </div>

    <!-- Show upgrade prompt if they don't have access -->
    <div v-else>
      <p>Remove branding is available in Pro plans</p>
      <NuxtLink to="/pricing">Upgrade Now</NuxtLink>
    </div>

    <!-- Project limit example -->
    <div v-if="!projectLimitCheck.canCreate">
      <p>
        You've created {{ projectLimitCheck.current }}/{{
          projectLimitCheck.limit
        }}
        projects
      </p>
      <NuxtLink to="/pricing">Upgrade for unlimited projects</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const featureFlagsStore = useFeatureFlagsStore();
const projectsStore = useProjectsStore();

const projectLimitCheck = computed(() =>
  featureFlagsStore.checkProjectLimit(projectsStore.projects.length)
);

const canRemoveBranding = computed(() => featureFlagsStore.canRemoveBranding());
</script>
```

### 5. API Route Protection

```typescript
// server/api/remove-branding.post.ts
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  const client = serverSupabaseServiceRole(event);

  // Check if user has access to remove branding feature
  const { data: featureFlags } = await client
    .from("feature_flags")
    .select("name")
    .eq("name", "remove_branding_on_page");

  if (!featureFlags || featureFlags.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "This feature requires a Pro subscription",
    });
  }

  // Proceed with branding removal logic
});
```

## Feature Flag Configuration

### Example Features

1. **remove_branding_on_page**

   - Type: Boolean feature
   - Controls whether users can remove ShipWait branding
   - Free: false, Pro: true, Enterprise: true

2. **project_limit**
   - Type: Numeric limit
   - Controls maximum number of projects
   - Free: 1, Pro: unlimited, Enterprise: unlimited

### Adding New Features

1. Insert into `feature_flags` table:

```sql
INSERT INTO public.feature_flags (name, description, price_configs) VALUES
(
  'new_feature_name',
  'Description of the new feature',
  '[
    { "limit": "false", "price_id": "price_free" },
    { "limit": "true",  "price_id": "price_pro" },
    { "limit": "true",  "price_id": "price_enterprise" }
  ]'
);
```

2. Use in your app:

```typescript
const featureFlagsStore = useFeatureFlagsStore();
if (featureFlagsStore.featureNames.includes("new_feature_name")) {
  // Feature logic
}
```

## Best Practices

1. **Always check features on both client and server side**
2. **Use the composable for consistent feature checking**
3. **Provide clear upgrade paths when features are unavailable**
4. **Cache feature flags appropriately to avoid unnecessary requests**
5. **Handle loading states gracefully**
6. **Use descriptive feature names and error messages**

## Troubleshooting

### Common Issues

1. **Features not loading**: Ensure user is authenticated and has an active subscription
2. **RLS denying access**: Verify the user's subscription status and price_id matching
3. **Middleware redirects**: Check that feature names match exactly between database and code
4. **Type errors**: Ensure Supabase types are up to date with your database schema

### Debugging

```typescript
// Enable debug logging
const featureFlagsStore = useFeatureFlagsStore();
console.log("Available features:", featureFlagsStore.featureFlags);
console.log("Current subscription:", subscriptionStore.activeSubscription);
```
