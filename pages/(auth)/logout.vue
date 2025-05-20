<!-- Page used to logout with route -->
<script setup lang="ts">
import { onMounted } from 'vue'

const client = useSupabaseClient()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/login')
}

onMounted(() => {
  logout()
})
</script>

<template>
</template>
