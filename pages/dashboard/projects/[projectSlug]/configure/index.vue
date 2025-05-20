<script setup lang="ts">

definePageMeta({
  middleware: ['project-handler']
})
</script>

<template>
  <ConfigureLayout>
    <ConfigureGeneralForm />
  </ConfigureLayout>
</template>
