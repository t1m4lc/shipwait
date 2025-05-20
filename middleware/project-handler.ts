// Unified middleware to handle project fetching, selection and navigation
export default defineNuxtRouteMiddleware(async (to) => {
  const store = useProjectsStore();
  const slug = to.params.projectSlug as string;

  try {
    // Only fetch projects if needed
    if (store.projects.length === 0) {
      await store.fetchProjects();
    }

    // Skip handling for create project page
    if (to.path === "/dashboard/projects/create") {
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
    if (slug) {
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
