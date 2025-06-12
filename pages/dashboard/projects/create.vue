<script setup lang="ts">
const featureFlagsStore = useFeatureFlagsStore();
const projectsStore = useProjectsStore();

// Check project limits on page load
onMounted(async () => {
  // Ensure projects are loaded
  if (projectsStore.projects.length === 0) {
    await projectsStore.fetchProjects();
  }

  // Double-check project limits as a safeguard
  const limitCheck = featureFlagsStore.checkProjectLimit(projectsStore.projects.length);

  if (!limitCheck.canCreate) {
    // This should not happen due to middleware, but as a safeguard
    await navigateTo({
      path: '/pricing',
      query: {
        error: 'project_limit_reached',
        current: projectsStore.projects.length.toString(),
        limit: limitCheck.limit.toString()
      }
    });
  }
});

</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    <div class="w-full max-w-3xl">

      <div class="flex flex-col gap-6">
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-2xl">
              Create a new project
            </CardTitle>
            <CardDescription class="text-base">
              Enter your project details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateProjectForm />
          </CardContent>
        </Card>
        <div class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          A new project is the first step towards making your ideas a reality.
        </div>
      </div>
    </div>
  </div>
</template>
