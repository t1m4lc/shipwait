import { defineStore } from "pinia";
import type { Database } from "~/types/supabase";

export const useUserStore = defineStore("user", () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const isDeleting = ref(false);

  /**
   * Computed user data in a consistent format
   */
  const userData = computed(() => {
    if (!user.value) return null;

    return {
      name:
        user.value.user_metadata?.full_name ||
        user.value.email?.split("@")[0].split(".")[0] ||
        "User",
      email: user.value.email || "",
      id: user.value.id || "",
      avatar_url: user.value.user_metadata?.avatar_url || null,
    };
  });

  /**
   * Member since date formatting
   */
  const memberSince = computed(() => {
    if (!user.value?.created_at) return "Unknown";
    return useDayjs()(user.value.created_at).format("MMMM YYYY");
  });

  /**
   * Delete user account - database CASCADE will handle all related data deletion
   */
  const deleteAccount = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!user.value) {
      return { success: false, error: "No authenticated user" };
    }

    isDeleting.value = true;

    try {
      // Simple delete - CASCADE constraints will handle everything
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.value.id);

      if (error) throw error;

      // Clear all stores
      const projectsStore = useProjectsStore();
      const pageStore = usePageStore();

      projectsStore.clearStore();
      pageStore.clearStore();

      // Sign out the user
      navigateTo("/logout");

      return { success: true };
    } catch (err: any) {
      console.error("Error deleting account:", err);
      return { success: false, error: err.message };
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    // State
    isDeleting,

    // Computed
    userData,
    memberSince,

    // Actions
    deleteAccount,
  };
});
