<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, () => {
  if (user.value) {
    // Check for redirect parameter from query first
    const redirectTo = route.query.redirect as string;

    if (redirectTo && redirectTo.startsWith('/')) {
      return navigateTo(redirectTo);
    }

    // Fall back to cookie redirect or default dashboard
    const path = redirectInfo.pluck()
    return navigateTo(path || '/dashboard')
  }
}, { immediate: true })
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Loader2 class="animate-spin size-6">
      <span class="sr-only">Authenticating...</span>
    </Loader2>
  </div>
</template>
