<script setup lang="ts">

definePageMeta({
  middleware: ['project-slug']
})
</script>

<template>
  <ConfigureLayout>
    <ConfigureGeneralForm />
  </ConfigureLayout>
</template>
