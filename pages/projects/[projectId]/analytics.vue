<script setup>
import { ChartNoAxesCombined } from 'lucide-vue-next'

const title = ref('Analytics')
const subtitle = ref("Data that actually matters")

useHead({
  title
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
      <NuxtLink to="https://x.com/t1m4lc" external target="_blank" class="text-primary hover:underline">Let me know!
      </NuxtLink>
    </Empty>
  </div>
</template>