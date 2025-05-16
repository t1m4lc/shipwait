<script setup>
    import { Toaster } from 'vue-sonner'
</script>

<template>
  <NuxtLoadingIndicator />
  <Toaster position="top-right" class="pointer-events-auto" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

