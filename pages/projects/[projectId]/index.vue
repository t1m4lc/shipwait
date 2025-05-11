<script setup>
const route = useRoute();
const projectId = route.params.projectId;

const title = ref('Overview')

useHead({
  title
})

</script>

<template>
  <h1 class="text-2xl font-bold tracking-tight">
    {{ title }}
  </h1>

  <p>project ID: {{ projectId }}</p>
</template>