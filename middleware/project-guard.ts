import { useProjects } from "~/stores/projects.store";

export default defineNuxtRouteMiddleware(async (to) => {
  const id = to.params.projectId as string;
  const storeProject = useProjects();

  try {
    await $fetch(`/api/projects/${id}`);
    return;
  } catch (error) {
    const fallbackProject = storeProject.projects?.[0];

    // Prevent infinite redirect loop by not redirecting to the same project ID
    if (fallbackProject?.id) {
      return navigateTo(`/projects/${fallbackProject.id}`);
    } else {
      return navigateTo("/projects/create");
    }
  }
});
