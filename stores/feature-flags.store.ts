import { useQuery } from "@tanstack/vue-query";
import { defineStore, storeToRefs } from "pinia";
import { computed, watch } from "vue";
import type { Database } from "~/types/supabase";
import { FEATURE_FLAGS } from "./constants";

type FeatureConfig = {
  name: string;
  limit: string | boolean;
};

export const useFeatureFlagsStore = defineStore("featureFlags", () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const subscriptionStore = useSubscriptionStore();

  // Reactive queryKey: TanStack Query will re-fetch when this changes
  // Use storeToRefs to properly track reactivity to subscription changes
  const { activeSubscription } = storeToRefs(subscriptionStore);
  const queryKey = computed(() => [
    "featureFlags",
    user.value?.id,
    activeSubscription.value?.price_id,
  ]);

  const {
    data: featureConfigs,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<FeatureConfig[], Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (!user.value) {
        return []; // No user, no feature flags
      }

      const subscription = activeSubscription.value;

      // If user has a subscription, get the stripe_price_id from the prices table
      let stripePriceId: string | null = null;
      if (subscription?.price_id) {
        console.log(
          "[FeatureFlagsStore] Fetching stripe_price_id for price_id:",
          subscription.price_id
        );
        const { data: priceData } = await supabase
          .from("prices")
          .select("stripe_price_id")
          .eq("id", subscription.price_id)
          .single();

        stripePriceId = priceData?.stripe_price_id || null;
        console.log(
          "[FeatureFlagsStore] Found stripe_price_id:",
          stripePriceId
        );
      }

      const { data, error: queryError } = await supabase
        .from("feature_flags")
        .select("name, price_configs")
        .order("name");

      if (queryError) {
        console.error(
          "[FeatureFlagsStore] Supabase error fetching feature flags:",
          queryError
        );
        throw queryError;
      }

      // Transform data to include features based on subscription or free features
      return (data || [])
        .map((flag) => {
          // Explicitly type priceConfigs as an array of expected objects
          const priceConfigs = Array.isArray(flag.price_configs)
            ? (flag.price_configs as Array<{
                price_id: string | null;
                limit: string | boolean;
              }>)
            : [];

          // Check for free features (price_id: null)
          const freeConfig = priceConfigs.find(
            (config: { price_id: string | null; limit: string | boolean }) =>
              config.price_id === null
          );

          // If user has no subscription, only return free features
          if (!subscription) {
            return freeConfig
              ? {
                  name: flag.name,
                  limit: freeConfig.limit,
                }
              : null;
          }

          // If user has subscription, check for matching config or fall back to free
          // Use stripe_price_id for matching against feature flag configurations
          const matchingConfig = priceConfigs.find(
            (config: { price_id: string | null; limit: string | boolean }) =>
              config.price_id === stripePriceId
          );

          const activeConfig = matchingConfig || freeConfig;

          return activeConfig
            ? {
                name: flag.name,
                limit: activeConfig.limit,
              }
            : null;
        })
        .filter(
          (config): config is FeatureConfig =>
            config !== null && config.limit !== false
        );
    },
  });

  /**
   * Check if user has access to a specific feature
   */
  const hasFeature = (featureName: string): boolean => {
    if (!featureConfigs.value) return false;
    return featureConfigs.value.some((config) => config.name === featureName);
  };

  /**
   * Get the limit value for a specific feature
   */
  const getFeatureLimit = (featureName: string): string | boolean | null => {
    if (!featureConfigs.value) return null;
    const config = featureConfigs.value.find(
      (config) => config.name === featureName
    );
    return config?.limit ?? null;
  };

  /**
   * Check if user can perform an action based on feature limits
   */
  const canPerformAction = (
    featureName: string,
    currentCount: number
  ): boolean => {
    if (!hasFeature(featureName)) return false;

    const limit = getFeatureLimit(featureName);

    // If limit is boolean, return it directly
    if (typeof limit === "boolean") return limit;

    // If limit is "unlimited", always allow
    if (limit === "unlimited") return true;

    // If limit is a number string, check against current count
    if (typeof limit === "string" && !isNaN(Number(limit))) {
      return currentCount < Number(limit);
    }

    return false;
  };

  /**
   * Check project limit and current usage
   */
  const checkProjectLimit = (currentProjectCount: number) => {
    const limit = getFeatureLimit(FEATURE_FLAGS.PROJECT_LIMIT);

    if (limit === "unlimited") {
      return {
        canCreate: true,
        limit: "unlimited",
        current: currentProjectCount,
      };
    }

    if (typeof limit === "string" && !isNaN(Number(limit))) {
      const maxProjects = Number(limit);
      return {
        canCreate: currentProjectCount < maxProjects,
        limit: maxProjects,
        current: currentProjectCount,
        remaining: Math.max(0, maxProjects - currentProjectCount),
      };
    }

    return {
      canCreate: false,
      limit: Number(limit),
      current: currentProjectCount,
    };
  };

  /**
   * Check if user can remove branding
   */
  const canRemoveBranding = (): boolean => {
    return hasFeature(FEATURE_FLAGS.REMOVE_BRANDING_ON_PAGE);
  };

  /**
   * Refresh feature flags
   */
  const refreshFeatureFlags = async (): Promise<void> => {
    await refetch();
  };

  // Watch for subscription changes and automatically refresh feature flags
  // This provides an additional layer of synchronization
  watch(
    () => activeSubscription.value?.price_id,
    (newPriceId, oldPriceId) => {
      // Only refresh if the price_id actually changed and it's not the initial undefined -> null
      if (
        newPriceId !== oldPriceId &&
        (newPriceId !== undefined || oldPriceId !== undefined)
      ) {
        console.log(
          "[FeatureFlagsStore] Subscription price_id changed, refreshing feature flags"
        );
        refreshFeatureFlags();
      }
    }
  );

  return {
    // State
    featureConfigs, // Ref<FeatureConfig[] | undefined>
    loading, // Ref<boolean>
    error, // Ref<Error | null>

    // Actions
    hasFeature,
    getFeatureLimit,
    canPerformAction,
    checkProjectLimit,
    canRemoveBranding,
    refreshFeatureFlags,
  };
});
