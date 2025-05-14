<script setup lang="ts">
definePageMeta({
  middleware(to) {
    const projectId = to.params.projectId;
    return { path: `/dashboard/projects/${projectId}/overview` };
  }
});
</script>

<template>
</template>