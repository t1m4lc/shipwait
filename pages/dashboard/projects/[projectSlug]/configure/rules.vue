<script setup lang="ts">
definePageMeta({
  middleware: ['project-slug']
})
</script>

<template>

  <!-- <ConfigureRulesForm /> -->
  <!-- Collection Rules
- Max email limit
-Collection end date

Messages
-Success message
-Duplicate message
-Error message -->
  <ConfigureLayout>

    <p>🚧 "Collection rules" is under construction</p>

    <p>
      Got feedback or ideas? <NuxtLink :to="INSIGHTO" external target="_blank" class="text-primary underline hover:underline">Let me know!
      </NuxtLink>
    </p>
  </ConfigureLayout>
</template>