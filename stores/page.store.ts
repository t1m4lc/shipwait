import { defineStore } from "pinia";
import type { Database, Tables } from "~/types/supabase";

export type PageTemplate = Tables<"custom_page_template">;

export type Page = Tables<"pages">;

export const usePageStore = defineStore("page", () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient<Database>();

  const templates = ref<PageTemplate[]>([]);
  const currentTemplate = ref<PageTemplate | null>(null);
  const deployedPages = ref<Page[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const publicPageUrl = ref<string | null>(null);

  // Fetch templates for current user and project
  async function fetchTemplates(projectId: string) {
    loading.value = true;
    error.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      const { data: templateList, error: fetchError } = await supabase
        .from("custom_page_template")
        .select("*")
        .eq("user_id", user.value.id)
        .eq("project_id", projectId);

      if (fetchError) throw fetchError;

      templates.value = templateList || [];
    } catch (err: any) {
      console.error("Error fetching templates:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function saveTemplate(
    template:
      | Omit<PageTemplate, "user_id">
      | Omit<PageTemplate, "user_id" | "id">
  ) {
    loading.value = true;
    error.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      const completeTemplate = {
        ...template,
        user_id: user.value.id,
        updated_at: new Date().toISOString(),
      };

      const { data, error: saveError } = await supabase
        .from("custom_page_template")
        .upsert(completeTemplate, {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      if (data) {
        currentTemplate.value = data;
        const templateIndex = templates.value.findIndex(
          (t) => t.id === data.id
        );
        if (templateIndex >= 0) {
          templates.value[templateIndex] = data;
        } else {
          templates.value.push(data);
        }
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("Error saving template:", err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function deployPage(projectId: string, template: PageTemplate) {
    loading.value = true;
    error.value = null;

    try {
      if (!user.value) {
        throw new Error("No authenticated user");
      }

      // Ensure the template has an ID (must be saved first)
      if (!template.id) {
        throw new Error("Template must be saved before deployment");
      }

      const page = {
        project_id: projectId,
        title: template.name,
        html: template.html,
        active: true,
      };

      const { data, error: deployError } = await supabase
        .from("pages")
        .insert(page)
        .select()
        .single();

      if (deployError) throw deployError;

      if (data) {
        deployedPages.value.push(data);
        publicPageUrl.value = `/p/${data.id}`;
      }

      return { success: true, data, url: publicPageUrl.value };
    } catch (err: any) {
      console.error("Error deploying page:", err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  // Fetch deployed pages for a project
  async function fetchDeployedPages(projectId: string) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("pages")
        .select("*")
        .eq("project_id", projectId)
        .order("updated_at", { ascending: false });

      if (fetchError) throw fetchError;

      deployedPages.value = data || [];

      // Set the public page URL if there's at least one deployed page
      if (deployedPages.value.length > 0) {
        publicPageUrl.value = `/p/${deployedPages.value[0].id}`;
      }

      return { success: true, data: deployedPages.value };
    } catch (err: any) {
      console.error("Error fetching deployed pages:", err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  // Get a single deployed page
  async function getDeployedPage(pageId: string) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .single();

      if (fetchError) throw fetchError;

      return { success: true, data };
    } catch (err: any) {
      console.error("Error fetching page:", err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  return {
    templates,
    currentTemplate,
    deployedPages,
    loading,
    error,
    publicPageUrl,
    fetchTemplates,
    saveTemplate,
    deployPage,
    fetchDeployedPages,
    getDeployedPage,
  };
});
