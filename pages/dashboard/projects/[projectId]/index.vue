<script setup lang="ts">
definePageMeta({
  middleware: ['project-id'],
  redirect: to => {
    return `/dashboard/projects/${to.params.projectId}/leads`;
  }
});
</script>


<!-- OTHERVIEW WIP -->
<!-- <script setup lang="ts">

import { LayoutDashboard } from 'lucide-vue-next'

const title = ref('Overview')
const subtitle = ref("Your empire at a glance")

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
    <Empty title="No overview for now" :icon="LayoutDashboard">
      This feature is coming soon! Got feedback or ideas? <br />
      <NuxtLink :to="INSIGHTO" external target="_blank" class="text-primary hover:underline">Let me know!
      </NuxtLink>
    </Empty>
  </div>
</template> -->