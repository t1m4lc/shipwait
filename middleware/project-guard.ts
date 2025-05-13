import { useProjects } from "~/stores/projects.store";

export default defineNuxtRouteMiddleware(async (to) => {
  const id = to.params.projectId as string;
  const storeProject = useProjects();

  // TODO check projectIdlist api
  const projectIdList: string[] = ["1"];

  if (projectIdList.length === 0) {
    return navigateTo("/admin/projects/create");
  }

  if (!id) {
    return navigateTo(`/admin/projects/${projectIdList[0]}`);
  }

  return true;
});
