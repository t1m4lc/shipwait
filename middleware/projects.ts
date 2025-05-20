export default defineNuxtRouteMiddleware(async (to) => {
  const slug = to.params.projectSlug as string;
  const store = useProjectsStore();

  try {
    const shouldFetchProjects = store.projects.length === 0;

    if (shouldFetchProjects) {
      await store.fetchProjects();
    }

    // If no projects exist, redirect to create page
    if (store.projects.length === 0) {
      return navigateTo("/dashboard/projects/create");
    }

    const firstProject = store.projects[0];

    // If on projects index page without a slug, redirect to the first project
    if (to.path === "/dashboard/projects" || to.path === "/dashboard") {
      return navigateTo(`/dashboard/projects/${firstProject.slug}`);
    }

    // If we're already on the create page, let it render normally
    if (to.path === "/dashboard/projects/create") {
      return;
    }

    // If no slug provided but we're not on the index page, do nothing
    if (!slug) {
      return;
    }

    // Find project by slug and set the selected project ID
    const project = store.projects.find((p) => p.slug === slug);
    if (project) {
      store.setSelectedProjectId(project.id);
    } else {
      // If slug doesn't exist, redirect to first project
      return navigateTo(`/dashboard/projects/${firstProject.slug}`);
    }
  } catch (error) {
    console.error("Error in projects middleware:", error);
    // In case of error, redirect to create
    return navigateTo("/dashboard/projects/create");
  }

  return;
});
