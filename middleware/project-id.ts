export default defineNuxtRouteMiddleware(async (to) => {
  // grab the param
  const id = to.params.projectId as string;
  const store = useProjectsStore();

  const shouldFetchProjects = store.projects.length === 0;

  if (shouldFetchProjects) {
    await store.fetchProjects();
  }

  // 1) no projects at all → create a new one
  if (store.projects.length === 0) {
    return navigateTo("/dashboard/projects/create");
  }

  // 2) invalid or missing ID → bounce to the first project
  const projectExists = store.projects.some((p) => p.id === id);
  if (!id || !projectExists) {
    const defaultProjectId = store.projects[0].id;
    return navigateTo(`/dashboard/projects/${defaultProjectId}`);
  }

  // 3) valid ID → stash it in the store and proceed
  store.setSelectedProjectId(id);

  // allow the page to render
  return true;
});
