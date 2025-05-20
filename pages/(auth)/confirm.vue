<script setup lang="ts">
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, () => {
  if (user.value) {
    // Get the saved path and clear it from the cookie
    console.log("redirectInfo", redirectInfo);

    const path = redirectInfo.pluck()
    // Redirect to the saved path, or fallback to home
    return navigateTo(path || '/dashboard')
  }
}, { immediate: true })
</script>


<template>
  <p>Authenticating...</p>
</template>
