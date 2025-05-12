Voici les choix fait pour la page configuration

```ts
interface ProjectConfig {
  // === General ===
  name: string;
  domain: string;
  landingPageUrl: string;

  // === Collection Rules ===
  emailLimit?: number;
  endDate?: string; // ISO 8601
  duplicatePolicy: 'allow' | 'block' | 'warn';

  // === Messages ===
  messages: {
    success: string;
    duplicate: string;
    error: string;
  };

  // === Post-Submit Behavior ===
  onSubmit: {
    action: 'none' | 'show_modal' | 'show_toast' | 'redirect';
    redirectUrl?: string;
    showSonar?: boolean;
    socialCtaUrl?: string; // e.g. https://twitter.com/yourhandle
  };

  // === Integration ===
  integration: {
    inputSelector: string; // e.g. '#email'
    autoFocus?: boolean;
  };
}
```

---

## 📁 **UI Configuration Sections (Sidebar Navigation)**

1. **General**

   * Project name
   * Website domain
   * Landing page URL

2. **Collection Rules**

   * Max email limit
   * Collection end date
   * Duplicate email policy

3. **Messages**

   * Success message
   * Duplicate message
   * Error message

4. **Submit Behavior**

   * What to do after submission (modal, toast, redirect, none)
   * Redirect URL (if applicable)
   * Enable sonar effect?
   * Social CTA URL (e.g. Twitter)

5. **Integration**

   * Input selector (e.g. `#email`)
   * Autofocus toggle


<script setup lang="ts">

</script>

<template>
  <div class="pb-16 space-y-6">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">
        Settings
      </h2>
      <p class="text-muted-foreground">
        Manage your account settings and set e-mail preferences.
      </p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col lg:flex-row space-y-6 lg:space-x-12 lg:space-y-0">
      <div class="w-full overflow-x-auto pb-2 lg:w-1/6 lg:pb-0">
        <ConfigureSidebarNav />
      </div>
      <div class="flex-1 lg:max-w-2xl">
        <div class="space-y-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Item {
  title: string
  href: string
}

const route = useRoute()

const sidebarNavItems: Item[] = [
  {
    title: 'Profile',
    href: '/settings/profile',
  },
  {
    title: 'Account',
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
  },
  {
    title: 'Display',
    href: '/settings/display',
  },
]
</script>

<template>
  <nav class="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
    <Button
      v-for="item in sidebarNavItems"
      :key="item.title"
      variant="ghost"
      :class="cn(
        'w-full text-left justify-start items-start',
        route.path === item.href && 'bg-muted hover:bg-muted',
      )"
      as-child
    >
      <NuxtLink
        :to="item.href"
      >
        {{ item.title }}
      </NuxtLink>
    </Button>
  </nav>
</template>