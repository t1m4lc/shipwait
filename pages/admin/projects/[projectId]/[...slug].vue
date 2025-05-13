<script setup lang="ts">
definePageMeta({
  middleware(to) {
    const projectId = to.params.projectId;
    return { path: `/admin/projects/${projectId}/overview` };
  }
});
</script>

<template>
</template>