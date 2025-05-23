import { computed, onMounted, ref, watch } from "vue";
import type { Database, Tables } from "~/types/supabase";

export function useSubscriptionStatus() {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const subscription = ref<Tables<"subscriptions"> | null>(null);
  const isLoading = ref<boolean>(true);
  const error = ref<any | null>(null); // Consider a more specific error type

  async function fetchSubscriptionStatus() {
    if (!user.value) {
      subscription.value = null;
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Fetch the most recent, active/trialing/past_due subscription.
      // If multiple such subscriptions exist (which ideally shouldn't for a single user for the same service),
      // this query prioritizes the one with the latest `current_period_end`.
      // If `current_period_end` is the same, it might pick one arbitrarily among those.
      // The webhook logic should ensure that old subscriptions are properly ended or canceled
      // when a new one becomes active or an old one is truly terminated.
      const { data, error: fetchError } = await client
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        .in("status", ["active", "trialing", "past_due"]) // past_due is included as it might still be recoverable
        .order("current_period_end", { ascending: false })
        .order("created_at", { ascending: false }) // Secondary sort for stability if periods end same time
        .limit(1)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      subscription.value = data;
    } catch (e: any) {
      // Capture as any, but could be SupabaseError
      console.error("Error fetching subscription status:", e);
      error.value = e;
      subscription.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    // Initial fetch when component/composable is mounted
    if (user.value) {
      // Only fetch if user is already available
      fetchSubscriptionStatus();
    }
  });

  watch(
    user,
    (newUser, oldUser) => {
      if (newUser && (!oldUser || newUser.id !== oldUser.id)) {
        fetchSubscriptionStatus();
      } else if (!newUser) {
        subscription.value = null;
        isLoading.value = true; // Reset loading state for next potential login
        error.value = null;
      }
    },
    { immediate: true } // Set immediate to true to run the watcher when the composable is initialized
    // This will call fetchSubscriptionStatus if user.value is already populated.
  );

  const isActive = computed(() => {
    return [
      "active",
      "trialing",
      // "past_due" can be considered active for some features, or you might want a separate check for it.
      // For now, strictly active or trialing.
    ].includes(subscription.value?.status ?? "");
  });

  const isPro = computed(() => isActive.value);

  // Function to redirect to customer portal
  const redirectToCustomerPortal = async (
    redirectPath: string = "/dashboard"
  ) => {
    try {
      const { data, error: portalError } = await useFetch(
        "/api/stripe/customer-portal",
        {
          method: "POST",
          body: { redirect: redirectPath },
        }
      );

      if (portalError.value || !data.value?.portalUrl) {
        throw (
          portalError.value || new Error("Failed to get customer portal URL")
        );
      }

      await navigateTo(data.value.portalUrl, { external: true });
      return true;
    } catch (e) {
      console.error("Error redirecting to customer portal:", e);
      // Optionally, show a user-facing error message here
      return false;
    }
  };

  return {
    subscription,
    isLoading,
    error,
    fetchSubscriptionStatus,
    isActive,
    isPro,
    redirectToCustomerPortal,
  };
}
