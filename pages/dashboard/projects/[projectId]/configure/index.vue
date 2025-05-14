<script setup lang="ts">

definePageMeta({
  middleware: ['project-id']
})
</script>

<template>
  <ConfigureLayout>
    <ConfigureGeneralForm />
  </ConfigureLayout>
</template>
