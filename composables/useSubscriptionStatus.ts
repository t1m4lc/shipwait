import { computed, onMounted, ref, watch } from "vue";
import type { Database, Tables } from "~/types/supabase"; // Ensure Database type is imported if not already

export function useSubscriptionStatus() {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const subscription = ref<Tables<"subscriptions"> | null>(null);
  const isLoading = ref<boolean>(true);
  const error = ref<any | null>(null);

  async function fetchSubscriptionStatus() {
    if (!user.value) {
      subscription.value = null;
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await client
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        // Consider active/trialing statuses as primary, then order by period end to get the latest one.
        // This handles cases where a user might have an old canceled subscription and a new active one.
        .in("status", ["active", "trialing", "past_due"])
        .order("current_period_end", { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle to avoid error if no subscription found

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116: 'Searched for a single row, but found no rows'
        throw fetchError;
      }

      subscription.value = data;
    } catch (e) {
      console.error("Error fetching subscription status:", e);
      error.value = e;
      subscription.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    fetchSubscriptionStatus();
  });

  watch(
    user,
    (newUser, oldUser) => {
      // Fetch if user logs in, or if the user ID changes (e.g. re-authentication)
      if (newUser && (!oldUser || newUser.id !== oldUser.id)) {
        fetchSubscriptionStatus();
      } else if (!newUser) {
        // Clear subscription if user logs out
        subscription.value = null;
        isLoading.value = false;
        error.value = null;
      }
    },
    { immediate: false }
  ); // 'immediate: true' could be useful if user is already logged in on component setup

  const isActive = computed(() => {
    return ["active", "trialing"].includes(subscription.value?.status ?? "");
  });

  const isPro = computed(() => isActive.value); // Alias for clarity in components

  return {
    subscription,
    isLoading,
    error,
    fetchSubscriptionStatus,
    isActive,
    isPro, // Expose isPro
  };
}
