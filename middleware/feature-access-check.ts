export default defineNuxtRouteMiddleware((to) => {
  const featureFlagsStore = useFeatureFlagsStore();
  const user = useSupabaseUser();

  // Extract parameters from query
  const requiredFeature = to.query.requiredFeature as string;
  const redirectTo = (to.query.redirectTo as string) || "/pricing";
  const errorMessage =
    (to.query.errorMessage as string) ||
    `Access denied: feature "${requiredFeature}" not available.`;
  const returnTo = to.query.returnTo as string;

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo({
      path: "/login",
      query: { redirect: returnTo || to.path },
    });
  }

  // Wait for feature flags to load if they haven't yet
  if (featureFlagsStore.loading) {
    // You might want to show a loading state here
    // For now, we'll wait for the store to finish loading
  }

  // Check if user has the required feature
  if (!featureFlagsStore.hasFeature(requiredFeature)) {
    // Store the error message for display
    const nuxtApp = useNuxtApp();
    nuxtApp.runWithContext(() => {
      // You can use a composable or store to show the error message
      console.error(errorMessage);
    });

    // Redirect to the specified page (usually pricing)
    return navigateTo({
      path: redirectTo,
      query: {
        error: "feature_access_denied",
        feature: requiredFeature,
        returnTo: returnTo,
      },
    });
  }

  // If user has access, continue to the original destination
  if (returnTo) {
    return navigateTo(returnTo);
  }
});
