<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

import { useSeo } from "~/composables/useSeo";

// Apply SEO optimization for privacy policy page
useSeo({
  title: 'Privacy Policy - ShipWait',
  description: 'Learn about ShipWait\'s privacy practices and how we protect your data.',
  type: 'website'
});
</script>

<template>
  <main class="p-4">
    <h1 class="text-2xl font-bold tracking-tight">
      Privacy policy
    </h1>
    <p>
      <NuxtLink to="dashboard" class="text-muted-foreground hover:underline">
        Go to dashboard
      </NuxtLink>
    </p>
  </main>
</template>