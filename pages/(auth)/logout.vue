<!-- Page used to logout with route -->
<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
})

const client = useSupabaseClient()

const logout = async (): Promise<void> => {
  await client.auth.signOut()
  localStorage.clear()
  await navigateTo('/login')
}

onMounted(() => {
  logout()
})
</script>


<template>
  <div class="flex items-center justify-center min-h-screen">
    <Loader2 class="animate-spin size-6">
      <span class="sr-only">Logging out...</span>
    </Loader2>
  </div>
</template>
