<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to) {
      const projectSlug = to.params.projectSlug;
      // return { path: `/dashboard/projects/${projectSlug}/overview` };
      return { path: `/dashboard/projects/${projectSlug}/leads` };
    },
    'project-slug'
  ]
});
</script>

<template>
</template>