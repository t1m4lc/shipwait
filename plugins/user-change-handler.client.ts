export default defineNuxtPlugin(() => {
  const user = useSupabaseUser();
  const projectsStore = useProjectsStore();
  const pageStore = usePageStore();

  // Keep track of the current user ID to detect changes
  let currentUserId: string | null = null;

  // Function to clear user-specific localStorage data
  const clearUserData = () => {
    // Clear Pinia persisted store data (projects store uses persist: true)
    try {
      // Pinia persistence typically uses store name as key
      localStorage.removeItem("projects");
      // Clear any other user-specific localStorage keys if needed
    } catch (error) {
      console.warn("[UserChangeHandler] Error clearing localStorage:", error);
    }
  };

  // Watch for user changes
  watch(
    user,
    (newUser, oldUser) => {
      const newUserId = newUser?.id || null;
      const oldUserId = oldUser?.id || null;

      // If user changes (different ID, user logs out, or user logs in)
      if (newUserId !== oldUserId) {
        // Clear localStorage data first
        clearUserData();

        // Clear all user-specific stores when user changes
        projectsStore.clearStore();
        pageStore.clearStore();

        // Update the current user ID
        currentUserId = newUserId;

        // If there's a new user, fetch their projects after a short delay
        // to ensure the stores are properly cleared first
        if (newUser) {
          nextTick(() => {
            projectsStore.fetchProjects();
          });
        }
      }
    },
    { immediate: true }
  );
});
