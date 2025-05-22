<template>
  <template>
    <div class="flex items-center justify-center min-h-screen">
      <Loader2 class="animate-spin size-6">
        <span class="sr-only">Redirecting...</span>
      </Loader2>
    </div>
  </template></template>

<script setup lang="ts">
definePageMeta({
  middleware: ['project-handler'],
  layout: 'dashboard'
})
</script>
