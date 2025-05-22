<script setup lang="ts">
const title = ref('Collection Rules')

useHead({
  title
})

definePageMeta({
  middleware: ['project-handler'],
  layout: 'dashboard'
})
</script>

<template>
  <ConfigureLayout>
    <!-- Submit Behavior
What to do after submission (modal, toast, redirect, none)
Redirect URL (if applicable)
Enable sonar effect?
Social CTA URL (e.g. Twitter) -->

    <p>🚧 "Submission feedback" is under construction</p>

    <p>
      Got feedback or ideas? <NuxtLink :to="INSIGHTO" external target="_blank" class="text-primary underline hover:underline">Let me know!
      </NuxtLink>
    </p>
  </ConfigureLayout>
</template>