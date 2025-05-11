import { useUser } from "~/stores/user.store";

export default defineNuxtRouteMiddleware((to) => {
  const store = useUser();

  const isAuthenticated = !!store.user;
  const isProjectsRoute = to.path.startsWith("/projects");
  const isLandingPage = to.path === "/";

  // Si non-auth et tente d'accéder à une route protégée
  if (!isAuthenticated && isProjectsRoute) {
    return navigateTo("/login");
  }

  // Si auth et tente d'accéder à la landing page
  if (isAuthenticated && isLandingPage) {
    return navigateTo("/projects");
  }
});
