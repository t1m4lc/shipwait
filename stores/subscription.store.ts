import { useQuery } from "@tanstack/vue-query"; // Imports from vue-query directly
import { defineStore } from "pinia";
import { computed } from "vue";
import type { Database, Tables } from "~/types/supabase";

export const useSubscriptionStore = defineStore("subscription", () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  // Reactive queryKey: TanStack Query will re-fetch when this changes
  const queryKey = computed(() => ["subscription", user.value?.id]);

  const {
    data: activeSubscription,
    isLoading,
    error,
    refetch,
  } = useQuery<Tables<"subscriptions"> | null, Error>({
    queryKey: queryKey, // Use the computed queryKey
    queryFn: async () => {
      if (!user.value) {
        return null; // No user, no subscription
      }
      const { data, error: queryError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.value.id)
        .in("status", ["active", "trialing"]) // Consider if 'past_due' should grant access
        .order("created_at", { ascending: false })
        .limit(1) // Ensure we only fetch the most recent one before maybeSingle but normally it's forbidden to have multiple subscription
        .maybeSingle();

      if (queryError) {
        console.error(
          "[SubscriptionStore] Supabase error fetching subscription:",
          queryError
        );
        throw queryError; // TanStack Query will catch this and put it in the error state
      }
      return data;
    },
  });

  const isActive = computed(() => {
    return (
      !!activeSubscription.value &&
      ["active", "trialing"].includes(activeSubscription.value.status)
    );
  });

  const hasScheduledCancellation = computed(() => {
    console.log("activeSubscription", activeSubscription.value);

    return (
      !!activeSubscription.value &&
      (activeSubscription.value.status === "active" ||
        activeSubscription.value.status === "trialing") &&
      activeSubscription.value.cancel_at_period_end === true
    );
  });

  async function forceRefreshSubscriptionStatus(p0: { forceRefresh: boolean }) {
    // Invalidate the query to force a refetch
    // await queryClient.invalidateQueries({ queryKey: queryKey.value });
    // Or, more directly for this specific query:
    await refetch();
  }

  async function redirectToCustomerPortal() {
    if (!user.value) {
      console.error("User not available for portal redirection.");
      return;
    }
    try {
      const { portalUrl } = await $fetch<{
        portalUrl: string;
      }>("/api/stripe/customer-portal", {
        method: "POST",
      });
      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        console.error("Customer portal URL not received.");
      }
    } catch (err) {
      console.error("Error redirecting to customer portal:", err);
    }
  }

  // No explicit watch on `user` is needed.
  // `useQuery` re-evaluates and re-fetches when its `queryKey` changes.
  // Since `queryKey` includes `user.value?.id`, it becomes reactive to user login/logout.

  return {
    isActive,
    activeSubscription, // Ref<Tables<'subscriptions'> | null | undefined>
    isLoading, // Ref<boolean>
    error, // Ref<Error | null>
    hasScheduledCancellation,
    fetchSubscriptionStatus: forceRefreshSubscriptionStatus,
    redirectToCustomerPortal,
  };
});
