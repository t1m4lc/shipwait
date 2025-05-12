<script setup>
import { BarChart3, Construction } from 'lucide-vue-next'

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

  <div
    class="flex flex-col items-center justify-center h-[70vh] border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
    <Construction class="size-16 mb-4 text-muted-foreground/70" />
    <h3 class="text-xl font-medium mb-2">No analytics data available</h3>
    <p class="text-muted-foreground text-center max-w-md">
      This feature is coming soon! Got feedback or ideas?
      <NuxtLink to="https://x.com/t1m4lc" external target="_blank" class="text-primary hover:underline">Let me know!
      </NuxtLink>
    </p>
  </div>
</template>