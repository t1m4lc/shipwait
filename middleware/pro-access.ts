export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server, or for auth pages, or for the pricing page itself.
  if (
    process.server ||
    to.path === "/login" ||
    to.path === "/auth/callback" ||
    to.path === "/pricing"
  ) {
    return;
  }

  const { isActive, isLoading, fetchSubscriptionStatus, subscription } =
    useSubscriptionStatus();

  // Initial fetch or re-fetch if subscription is null and not loading.
  // This helps if the composable was initialized but the user wasn't available yet.
  if (subscription.value === null && !isLoading.value) {
    await fetchSubscriptionStatus();
  }

  // If subscription status is still loading, wait for it.
  // This can happen if middleware runs before onMounted in useSubscriptionStatus completes fully.
  if (isLoading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(isLoading, (newIsLoading) => {
        if (!newIsLoading) {
          unwatch();
          resolve();
        }
      });
    });
  }

  // After loading, if not active, redirect.
  if (!isActive.value) {
    console.log(
      "[Pro Access Middleware] User does not have an active subscription. Redirecting to /pricing."
    );
    // Store the intended destination to redirect back after successful subscription/login.
    // Using a query parameter is a common approach.
    if (to.fullPath && to.fullPath !== "/") {
      return navigateTo(`/pricing?redirect=${encodeURIComponent(to.fullPath)}`);
    }
    return navigateTo("/pricing");
  }

  // console.log('[Pro Access Middleware] User has active subscription. Access granted to:', to.fullPath);
});
