<script setup lang="ts">
definePageMeta({
  middleware: [
    function(to) {
      const projectId = to.params.projectId;
      return { path: `/dashboard/projects/${projectId}/overview` };
    },
    'project-id'
  ]
});
</script>

<template>
</template>