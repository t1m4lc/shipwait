<script setup>
definePageMeta({
  middleware(to) {
    const projectId = to.params.projectId;
    return { path: `/projects/${projectId}/overview` };
  }
});
</script>

<template>
</template>