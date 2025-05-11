import { useUser } from "~/stores/user.store";

export default defineNuxtRouteMiddleware(() => {
  const store = useUser();

  if (!!store.user?.projects?.length) {
    // Redirect to the first project
    return navigateTo(`/projects/${store.user.projects[0].id}`);
  } else {
    // Redirect to the create project page
    return navigateTo("/projects/create");
  }
});
