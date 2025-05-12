<template>
</template>

<script setup lang="ts">
definePageMeta({
  middleware(to) {
    const projectId = to.params.projectId;
    return { path: `/projects/${projectId}/overview` };
  }
});
</script>
