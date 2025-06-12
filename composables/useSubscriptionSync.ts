/**
 * Composable for synchronizing subscription and feature flag stores
 * Use this to ensure both stores are properly updated when subscription changes occur
 */
export function useSubscriptionSync() {
  const subscriptionStore = useSubscriptionStore();
  const featureFlagsStore = useFeatureFlagsStore();

  /**
   * Force refresh both subscription and feature flags stores
   * This ensures complete synchronization between subscription status and feature access
   */
  const syncSubscriptionAndFeatures = async (
    options: { forceRefresh?: boolean } = {}
  ) => {
    const { forceRefresh = true } = options;

    try {
      // First refresh subscription status
      await subscriptionStore.fetchSubscriptionStatus({ forceRefresh });

      // Then refresh feature flags to ensure they're in sync with the new subscription
      await featureFlagsStore.refreshFeatureFlags();

      console.log(
        "[useSubscriptionSync] Successfully synchronized subscription and feature flags"
      );
    } catch (error) {
      console.error(
        "[useSubscriptionSync] Error synchronizing subscription and feature flags:",
        error
      );
      throw error;
    }
  };

  /**
   * Lightweight check to ensure stores are loaded
   * Only fetches if data is not already available
   */
  const ensureLoaded = async () => {
    const user = useSupabaseUser();

    if (!user.value) {
      return;
    }

    // Only fetch if we don't have subscription data yet
    if (subscriptionStore.activeSubscription === undefined) {
      await subscriptionStore.fetchSubscriptionStatus({ forceRefresh: false });
    }

    // Only fetch if we don't have feature flags data yet
    if (
      !featureFlagsStore.featureConfigs ||
      featureFlagsStore.featureConfigs.length === 0
    ) {
      await featureFlagsStore.refreshFeatureFlags();
    }
  };

  return {
    syncSubscriptionAndFeatures,
    ensureLoaded,
  };
}
