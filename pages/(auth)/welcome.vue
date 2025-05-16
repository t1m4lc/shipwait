<!-- Page used in the redirect url email -->
<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/dashboard', { replace: true })
  }
}, { immediate: true })
</script>

<template>
</template>
