import type { RouteLocationNormalized } from "vue-router";

interface FeatureGuardOptions {
  requiredFeature: string;
  redirectTo?: string;
  errorMessage?: string;
}

/**
 * Middleware to guard routes based on feature flag access
 * Usage in pages:
 *
 * definePageMeta({
 *   middleware: (to) => featureGuard(to, {
 *     requiredFeature: 'remove_branding_on_page',
 *     redirectTo: '/pricing',
 *     errorMessage: 'This feature requires a Pro subscription'
 *   })
 * })
 */
export default function featureGuard(
  to: RouteLocationNormalized,
  options: FeatureGuardOptions
) {
  return navigateTo({
    path: "/middleware-feature-guard",
    query: {
      requiredFeature: options.requiredFeature,
      redirectTo: options.redirectTo || "/pricing",
      errorMessage:
        options.errorMessage ||
        `Access to "${options.requiredFeature}" requires a higher subscription tier.`,
      returnTo: to.fullPath,
    },
  });
}
