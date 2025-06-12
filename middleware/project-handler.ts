// Unified middleware to handle project fetching, selection and navigation
export default defineNuxtRouteMiddleware(async (to) => {
  const store = useProjectsStore();
  const featureFlagsStore = useFeatureFlagsStore();

  try {
    // Only fetch projects if needed
    if (store.projects.length === 0) {
      await store.fetchProjects();
    }

    // For create project page, check project limits
    if (to.path === "/dashboard/projects/create") {
      const limitCheck = featureFlagsStore.checkProjectLimit(
        store.projects.length
      );

      if (!limitCheck.canCreate) {
        // Redirect to pricing page with limit info
        return navigateTo({
          path: "/pricing",
          query: {
            error: "project_limit_reached",
            current: store.projects.length.toString(),
            limit: limitCheck.limit.toString(),
          },
        });
      }

      return;
    }

    // If no projects exist, redirect to create page
    if (store.projects.length === 0) {
      return navigateTo("/dashboard/projects/create");
    }

    const firstProject = store.projects[0];

    // Handle index routes that need redirection to a project
    if (to.path === "/dashboard" || to.path === "/dashboard/projects") {
      return navigateTo(`/dashboard/projects/${firstProject.slug}`);
    }

    // Handle routes with a slug parameter
    if (to.params.projectSlug) {
      const slug = to.params.projectSlug as string;
      const projectExists = store.projects.some((p) => p.slug === slug);

      // If invalid slug, redirect to first project
      if (!projectExists) {
        return navigateTo(`/dashboard/projects/${firstProject.slug}`);
      }

      // Valid slug, set selected project
      const projectWithSlug = store.projects.find((p) => p.slug === slug);
      if (projectWithSlug) {
        store.setSelectedProjectId(projectWithSlug.id);
      }
    }
  } catch (error) {
    console.error("Error in project-handler middleware:", error);
    return navigateTo("/dashboard/projects/create");
  }

  // Allow the page to render
  return;
});
