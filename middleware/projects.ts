export default defineNuxtRouteMiddleware(async (to) => {
  const id = to.params.projectId as string;
  const store = useProjectsStore();

  const shouldFetchProjects = store.projects.length === 0

  if (shouldFetchProjects) {
    await store.fetchProjects();
  }

  // If no projects exist, redirect to create page
  if (store.projects.length === 0) {
    return navigateTo("/dashboard/projects/create");
  }

  const projectExists = store.projects.some((project) => project.id === id);

  if (!id || !projectExists) {
    const defaultProjectId = store.projects[0].id;
    return navigateTo(`/dashboard/projects/${defaultProjectId}`);
  }

  store.setSelectedProjectId(id);

  return true;
});
