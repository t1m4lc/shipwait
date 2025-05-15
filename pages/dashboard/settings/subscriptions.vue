<script setup lang="ts">
import { INSIGHTO } from '@/stores/links';
</script>

<template>
  <SettingsLayout>
    <p>🚧 "Subscriptions" is under construction</p>

    <p>
      Got feedback or ideas? <NuxtLink :to="INSIGHTO" external target="_blank"
        class="text-primary underline hover:underline">Let me know!
      </NuxtLink>
    </p>
  </SettingsLayout>
</template>