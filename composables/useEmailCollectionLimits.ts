import type { Database } from "~/types/supabase";

export function useEmailCollectionLimits(projectId: string) {
  const client = useSupabaseClient<Database>();
  const featureFlagsStore = useFeatureFlagsStore();

  const emailCount = ref<number>(0);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  /**
   * Fetch current email count for the project
   */
  const fetchEmailCount = async () => {
    if (!projectId) return;

    loading.value = true;
    error.value = null;

    try {
      const { count, error: countError } = await client
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("project_id", projectId);

      if (countError) {
        throw countError;
      }

      emailCount.value = count || 0;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Error fetching email count";
      console.error("Error fetching email count:", e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get email collection limit information
   */
  const limitInfo = computed(() => {
    return featureFlagsStore.checkEmailCollectionLimit(emailCount.value);
  });

  /**
   * Check if user can collect more emails
   */
  const canCollectMore = computed(() => {
    return limitInfo.value.canCollect;
  });

  /**
   * Get warning message if user is close to limit
   */
  const warningMessage = computed(() => {
    const info = limitInfo.value;

    if (info.limit === "unlimited") {
      return null;
    }

    const limit =
      typeof info.limit === "number" ? info.limit : Number(info.limit);
    const remaining = info.remaining || 0;

    if (remaining === 0) {
      return `You've reached your email collection limit of ${limit} emails for this project. Upgrade to Pro for unlimited email collection.`;
    }

    if (remaining <= 5) {
      return `You have ${remaining} email${
        remaining === 1 ? "" : "s"
      } left before reaching your limit of ${limit}. Consider upgrading to Pro for unlimited collection.`;
    }

    return null;
  });

  /**
   * Get progress percentage (0-100)
   */
  const progressPercentage = computed(() => {
    const info = limitInfo.value;

    if (info.limit === "unlimited") {
      return 0; // No progress bar needed for unlimited
    }

    const limit =
      typeof info.limit === "number" ? info.limit : Number(info.limit);
    return Math.min(100, (emailCount.value / limit) * 100);
  });

  /**
   * Refresh email count
   */
  const refresh = () => {
    return fetchEmailCount();
  };

  // Auto-fetch on mount and when projectId changes
  watch(() => projectId, fetchEmailCount, { immediate: true });

  return {
    emailCount: readonly(emailCount),
    loading: readonly(loading),
    error: readonly(error),
    limitInfo,
    canCollectMore,
    warningMessage,
    progressPercentage,
    refresh,
    fetchEmailCount,
  };
}
