<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, () => {
  if (user.value) {
    const path = redirectInfo.pluck()
    return navigateTo(path || '/dashboard')
  }
}, { immediate: true })
</script>


<template>
  <p>Authenticating...</p>
</template>
