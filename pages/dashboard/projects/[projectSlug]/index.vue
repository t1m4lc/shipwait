<script setup lang="ts">
definePageMeta({
  middleware: ['project-handler'],
  redirect: to => {
    return `/dashboard/projects/${to.params.projectSlug}/page`;
  }
});
</script>
