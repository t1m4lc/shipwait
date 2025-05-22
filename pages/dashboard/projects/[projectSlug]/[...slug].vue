<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: [
    function (to) {
      const projectSlug = to.params.projectSlug;
      // return { path: `/dashboard/projects/${projectSlug}/overview` };
      return { path: `/dashboard/projects/${projectSlug}/leads` };
    },
    'project-handler'
  ]
});
</script>

<template>
</template>