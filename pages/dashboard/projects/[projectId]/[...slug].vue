<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to) {
      const projectId = to.params.projectId;
      // return { path: `/dashboard/projects/${projectId}/overview` };
      return { path: `/dashboard/projects/${projectId}/leads` };
    },
    'project-id'
  ]
});
</script>

<template>
</template>