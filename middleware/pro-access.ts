import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useSubscriptionStore } from "~/stores/subscription.store";

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

  // Initialize the store or ensure it's initialized.
  // The store itself handles fetching logic based on user state and caching.
  const subscriptionStore = useSubscriptionStore();

  // Ensure the subscription status is known before proceeding.
  // The store's fetchSubscriptionStatus handles caching and avoids redundant calls.
  // We might want to force a refresh if navigating to a pro page directly
  // to ensure the very latest status, but often the cached version is fine.
  if (subscriptionStore.isLoading) {
    // If already loading, await its completion. This might need a more robust solution
    // like a watcher or an event if direct awaiting isn't feasible in middleware.
    // For simplicity, we'll assume the store handles this gracefully or we accept
    // a slight delay if already loading.
  } else if (
    subscriptionStore.activeSubscription === null &&
    useSupabaseUser().value
  ) {
    // If status is unknown (null) and there's a user, try to fetch it.
    // Pass forceRefresh: false to respect cache, or true if you always want fresh data for pro routes.
    await subscriptionStore.fetchSubscriptionStatus({ forceRefresh: false });
  }

  // After attempting to fetch/load, check the status.
  if (!subscriptionStore.isActive) {
    // User does not have an active subscription.
    // Redirect them to the pricing page or a generic access-denied page.
    // You can also add a query parameter to show a message on the pricing page.
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
