<script setup lang="ts">
definePageMeta({
  middleware: ['project-handler'],
  layout: 'dashboard'
})
</script>

<template>
  <ConfigureLayout>
    <ConfigureGeneralForm />
  </ConfigureLayout>
</template>
