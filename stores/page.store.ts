import { defineStore } from "pinia";
import type { Database, Tables } from "~/types/supabase";

export type PageTemplate = Tables<"page_template">;
export type Page = Tables<"pages">;

/**
 * Generic API response type for consistent return patterns
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const usePageStore = defineStore("page", () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient<Database>();
  const config = useRuntimeConfig();

  // Import subscription store for template access control
  const subscriptionStore = useSubscriptionStore();

  // State
  const selectedTemplate = ref<PageTemplate | null>(null);
  const templates = ref<PageTemplate[]>([]);
  const page = ref<Page | null>(null);
  const isLoading = ref(false);
  const lastError = ref<string | null>(null);

  // Computed properties for template access control
  const freeTemplates = computed(() => {
    return templates.value.filter((template) => {
      return template.is_free === true || template.is_free === null;
    });
  });

  const premiumTemplates = computed(() => {
    return templates.value.filter((template) => template.is_free === false);
  });

  const accessibleTemplates = computed(() => {
    if (subscriptionStore.isActive) {
      // Pro users can access all templates
      return templates.value;
    }
    // Free users can only access free templates
    return freeTemplates.value;
  });

  const restrictedTemplates = computed(() => {
    if (subscriptionStore.isActive) {
      return [];
    }
    return premiumTemplates.value;
  });

  // Helper function to check if user can access a specific template
  const canAccessTemplate = (templateId: string): boolean => {
    const template = templates.value.find((t) => t.id === templateId);
    if (!template) return false;

    // Free templates (is_free = true or null) are accessible to everyone
    if (template.is_free === true || template.is_free === null) return true;

    // Premium templates (is_free = false) require active subscription
    return subscriptionStore.isActive;
  };

  // Computed
  const publicPageUrl = computed(() => {
    try {
      const slug = page.value?.slug;
      const isActive = page.value?.active;
      // Only return URL if page exists, has a slug, AND is deployed (active = true)
      return slug && isActive ? `/p/${slug}` : null;
    } catch (error) {
      console.error("Error computing publicPageUrl:", error);
      return null;
    }
  });

  const hasActivePage = computed(() => {
    try {
      return !!(page.value && page.value.active);
    } catch (error) {
      console.error("Error computing hasActivePage:", error);
      return false;
    }
  });

  // Template functions
  async function fetchTemplates(): Promise<ApiResponse<PageTemplate[]>> {
    isLoading.value = true;
    lastError.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("page_template")
        .select("*")
        .order("order", { ascending: true });

      if (fetchError) throw fetchError;

      templates.value = data || [];
      return { success: true, data: data || [] };
    } catch (err: any) {
      console.error("Error fetching templates:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  async function selectTemplate(
    templateId: string
  ): Promise<ApiResponse<PageTemplate | null>> {
    const template = templates.value.find((t) => t.id === templateId);
    if (template) {
      // Check if user can access this template
      if (!canAccessTemplate(templateId)) {
        return {
          success: false,
          error:
            "This template requires a Pro subscription. Please upgrade to access premium templates.",
        };
      }

      selectedTemplate.value = template;
      return { success: true, data: template };
    }
    return { success: false, error: "Template not found" };
  }

  // Page functions
  async function fetchPage(
    projectId: string
  ): Promise<ApiResponse<Page | null>> {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      const { data, error: fetchError } = await supabase
        .from("pages")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      page.value = data;
      return { success: true, data };
    } catch (err: any) {
      console.error("Error fetching page:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  async function getPageBySlug(
    slug: string
  ): Promise<ApiResponse<Page | null>> {
    isLoading.value = true;
    lastError.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (fetchError) throw fetchError;

      return { success: true, data };
    } catch (err: any) {
      console.error("Error fetching page by slug:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  async function savePage(
    projectId: string,
    projectSlug: string,
    title: string,
    html: string
  ): Promise<ApiResponse<Page>> {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      // Upsert the page (update if exists, insert if not)
      const { data, error: upsertError } = await supabase
        .from("pages")
        .upsert({
          slug: projectSlug,
          project_id: projectId,
          title,
          html,
          active: false, // Save as inactive by default
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      // Update the local state
      page.value = data;

      return { success: true, data };
    } catch (err: any) {
      console.error("Error saving page:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  async function deployPage(
    projectId: string,
    projectSlug: string,
    title: string,
    html: string
  ): Promise<ApiResponse<{ publicUrl: string }>> {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      // Upsert the page with active = true
      const { data, error: deployError } = await supabase
        .from("pages")
        .upsert({
          slug: projectSlug,
          project_id: projectId,
          title,
          html,
          active: true, // Deploy as active
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (deployError) throw deployError;

      // Update the local state
      page.value = data;

      const publicUrl = `${config.public.baseUrl}/p/${projectSlug}`;
      return { success: true, data: { publicUrl } };
    } catch (err: any) {
      console.error("Error deploying page:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  async function pausePage(projectId: string): Promise<ApiResponse<Page>> {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      if (!page.value) {
        throw new Error("No page to pause");
      }

      // Update the page to inactive
      const { data, error: updateError } = await supabase
        .from("pages")
        .update({
          active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("project_id", projectId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update the local state
      page.value = data;

      return { success: true, data };
    } catch (err: any) {
      console.error("Error pausing page:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Delete page - will be handled by CASCADE when project is deleted
   * This method is mainly for direct page deletion if needed
   */
  async function deletePage(projectId: string): Promise<ApiResponse<void>> {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      // Simple delete - CASCADE from project deletion usually handles this
      const { error: deleteError } = await supabase
        .from("pages")
        .delete()
        .eq("project_id", projectId);

      if (deleteError) throw deleteError;

      // Clear local state if this was the current page
      if (page.value?.project_id === projectId) {
        page.value = null;
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error deleting page:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  // Initialize page data for project
  async function initializePageData(projectId: string): Promise<
    ApiResponse<{
      templates: PageTemplate[];
      page: Page | null;
    }>
  > {
    isLoading.value = true;
    lastError.value = null;

    try {
      // Fetch templates and page in parallel
      const [templatesResult, pageResult] = await Promise.all([
        fetchTemplates(),
        fetchPage(projectId),
      ]);

      if (!templatesResult.success) {
        throw new Error(templatesResult.error);
      }

      if (!pageResult.success) {
        throw new Error(pageResult.error);
      }

      return {
        success: true,
        data: {
          templates: templatesResult.data || [],
          page: pageResult.data || null,
        },
      };
    } catch (err: any) {
      console.error("Error initializing page data:", err);
      lastError.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Clear store data when user changes
   */
  function clearStore(): void {
    selectedTemplate.value = null;
    templates.value = [];
    page.value = null;
    isLoading.value = false;
    lastError.value = null;
  }

  return {
    // State
    selectedTemplate,
    templates,
    page,
    isLoading,
    lastError,

    // Computed
    publicPageUrl,
    hasActivePage,
    freeTemplates,
    premiumTemplates,
    accessibleTemplates,
    restrictedTemplates,

    // Helper functions
    canAccessTemplate,

    // Template methods
    fetchTemplates,
    selectTemplate,

    // Page methods
    fetchPage,
    getPageBySlug,
    savePage,
    deployPage,
    pausePage,
    deletePage,

    // Utility methods
    initializePageData,
    clearStore,
  };
});
