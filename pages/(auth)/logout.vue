<!-- Page used to logout with route -->
<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

const client = useSupabaseClient()

const logout = async () => {
  await client.auth.signOut()
  await navigateTo('/login')
}

onMounted(() => {
  logout()
})
</script>


<template>
  <p>Logging out...</p>
</template>
