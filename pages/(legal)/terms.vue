<script setup lang="ts">
definePageMeta({
    layout: 'blank'
})

import { useSeo } from "~/composables/useSeo";

// Apply SEO optimization for terms of service page
useSeo({
  title: 'Terms of Service - ShipWait',
  description: 'Review ShipWait\'s terms of service and user agreement.',
  type: 'website'
});
</script>

<template>
    <main class="p-4">
        <h1 class="text-2xl font-bold tracking-tight">
            Terms of service
        </h1>
        <p>
            <NuxtLink to="dashboard" class="text-muted-foreground hover:underline">
                Go to dashboard
            </NuxtLink>
        </p>
    </main>
</template>