<script setup lang="ts">
import { INSIGHTO } from '@/stores/links'

import { ChartNoAxesCombined } from 'lucide-vue-next'

const title = ref('Analytics')
const subtitle = ref("Data that actually matters")

useHead({
  title
})
definePageMeta({
  middleware: ['project-id']
})
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold tracking-tight">
      {{ title }}
    </h1>
    <p class="text-muted-foreground">
      {{ subtitle }}
    </p>
  </div>


  <div class="h-[70vh]">
    <Empty title="No analytics data available" :icon="ChartNoAxesCombined">
      This feature is coming soon! Got feedback or ideas? </br>
      <NuxtLink :to="INSIGHTO" external target="_blank" class="text-primary hover:underline">Let me know!
      </NuxtLink>
    </Empty>
  </div>
</template>