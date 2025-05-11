<script setup>
onMounted(() => {
  const route = useRoute()
  navigateTo(`/projects/${route.params.projectId}/overview`)
})
</script>

<template>
<div></div>
</template>
  