export default defineNuxtRouteMiddleware(async (to) => {
  // grab the param
  const slug = to.params.projectSlug as string;
  const store = useProjectsStore();

  try {
    // Only fetch projects if we don't have any yet
    if (store.projects.length === 0) {
      await store.fetchProjects();
    }

    // 1) Skip if we're on the create project page
    if (to.path === "/dashboard/projects/create") {
      return;
    }

    // 2) no projects at all → create a new one
    if (store.projects.length === 0) {
      return navigateTo("/dashboard/projects/create");
    }

    // 3) invalid or missing slug → bounce to the first project
    const projectExists = store.projects.some((p) => p.slug === slug);
    if (!slug || !projectExists) {
      const defaultProjectSlug = store.projects[0].slug;
      return navigateTo(`/dashboard/projects/${defaultProjectSlug}`);
    }

    // 4) valid slug → stash it in the store and proceed
    const projectWithSlug = store.projects.find((p) => p.slug === slug);
    if (projectWithSlug) {
      store.setSelectedProjectId(projectWithSlug.id);
    }
  } catch (error) {
    console.error("Error in project-slug middleware:", error);
    // In case of error, redirect to create if no projects exist
    return navigateTo("/dashboard/projects/create");
  }

  // allow the page to render
  return;
});
