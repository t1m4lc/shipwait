<script setup>
definePageMeta({
  middleware(to) {
    const projectId = to.params.projectId;
    return { path: `/projects/${projectId}/` };
  }
});
</script>

<template>
</template>