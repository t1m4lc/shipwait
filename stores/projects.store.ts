import type { QueryData, SupabaseClient } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import type { Database, Tables } from "~/types/supabase";

function getProjectsQuery(supabase: SupabaseClient<Database>, userId: string) {
  return supabase
    .from("projects")
    .select(
      `
      *,
      submission_behaviors(*)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

type ProjectQuery = ReturnType<typeof getProjectsQuery>;
type ProjectFull = QueryData<ProjectQuery>;

async function createProjectApi(
  supabase: SupabaseClient<Database>,
  userId: string,
  projectData: {
    name: string;
    slug: string;
  },
  behaviorData: Pick<
    Tables<"submission_behaviors">,
    "behavior_type" | "message" | "redirect_url"
  >
) {
  try {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: projectData.name,
        slug: projectData.slug,
        user_id: userId,
      })
      .select("id, slug")
      .single();

    if (projectError) throw projectError;
    if (!project) throw new Error("Failed to create project");

    const { error: behaviorError } = await supabase
      .from("submission_behaviors")
      .insert({
        project_id: project.id,
        behavior_type: behaviorData.behavior_type,
        message: behaviorData.message || null,
        redirect_url: behaviorData.redirect_url || null,
      });

    if (behaviorError) throw behaviorError;

    const { data: completeProject, error: fetchError } = await supabase
      .from("projects")
      .select(
        `
        *,
        submission_behaviors(*)
      `
      )
      .eq("id", project.id)
      .single();

    if (fetchError) throw fetchError;

    return { data: completeProject, error: null };
  } catch (err) {
    console.error("Error creating project:", err);
    return { data: null, error: err };
  }
}

async function updateProjectApi(
  supabase: SupabaseClient<Database>,
  projectId: string,
  payload: Partial<Tables<"projects">>
) {
  try {
    const { error: updateError } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", projectId);

    if (updateError) throw updateError;

    const { data: updatedProject, error: fetchError } = await supabase
      .from("projects")
      .select(
        `
        *,
        submission_behaviors(*)
      `
      )
      .eq("id", projectId)
      .single();

    if (fetchError) throw fetchError;

    return { data: updatedProject, error: null };
  } catch (err) {
    console.error("Error updating project:", err);
    return { data: null, error: err };
  }
}

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();

    // Initialize with empty array and don't throw error immediately
    const projects = ref<ProjectFull>([]);
    const loading = ref(false);
    const error = ref<any>(null);
    const selectedProjectId = ref<string | null>(null);

    const selectedProject = computed(() => {
      if (!selectedProjectId.value) return null;
      return projects.value.find(
        (project) => project.id === selectedProjectId.value
      );
    });

    const selectedProjectSlug = computed(() => {
      if (!selectedProjectId.value) return null;
      const project = projects.value.find(
        (project) => project.id === selectedProjectId.value
      );
      return project?.slug || null;
    });

    const setSelectedProjectId = (id: string) => {
      selectedProjectId.value = id;
    };

    const fetchProjects = async () => {
      loading.value = true;
      error.value = null;

      try {
        if (!user.value) {
          console.warn("No authenticated user, skipping project fetch");
          return [];
        }

        const { data, error } = await getProjectsQuery(supabase, user.value.id);

        if (error) throw error;

        const projectFull: ProjectFull = data;
        projects.value = projectFull || [];
      } catch (err) {
        console.error("Error fetching projects:", err);
        error.value = err;
      } finally {
        loading.value = false;
      }

      return projects.value;
    };

    const createProject = async (
      projectData: {
        name: string;
        slug: string;
      },
      behaviorData: {
        behavior_type: "show_message" | "redirect" | "do_nothing";
        message?: string | null;
        redirect_url?: string | null;
      }
    ) => {
      loading.value = true;
      error.value = null;

      try {
        if (!user.value) {
          const noUserError = new Error(
            "Authentication required to create a project"
          );
          error.value = noUserError;
          return { data: null, error: noUserError };
        }

        const { data: completeProject, error: apiError } =
          await createProjectApi(supabase, user.value.id, projectData, {
            behavior_type: behaviorData.behavior_type,
            message: behaviorData.message || null,
            redirect_url: behaviorData.redirect_url || null,
          });

        if (apiError) throw apiError;

        if (completeProject) {
          addProject(completeProject);
        }

        return { data: completeProject, error: null };
      } catch (err) {
        console.error("Error creating project:", err);
        error.value = err;
        return { data: null, error: err };
      } finally {
        loading.value = false;
      }
    };

    const updateProjectData = async (
      projectId: string,
      payload: Partial<Tables<"projects">>
    ) => {
      loading.value = true;
      error.value = null;

      try {
        const { data: updatedProject, error: apiError } =
          await updateProjectApi(supabase, projectId, payload);

        if (apiError) throw apiError;

        if (updatedProject) {
          updateProject(updatedProject);
        }

        return { data: updatedProject, error: null };
      } catch (err) {
        console.error("Error updating project:", err);
        error.value = err;
        return { data: null, error: err };
      } finally {
        loading.value = false;
      }
    };

    const addProject = (project: ProjectFull[0]) => {
      if (!projects.value.some((p) => p.id === project.id)) {
        projects.value.push(project);
      }
    };

    const updateProject = (updatedProject: ProjectFull[0]) => {
      const index = projects.value.findIndex((p) => p.id === updatedProject.id);
      if (index !== -1) {
        projects.value[index] = updatedProject;
      }
    };

    /**
     * Delete project - database CASCADE will handle all related data deletion
     */
    const deleteProject = async (
      projectId: string
    ): Promise<{ success: boolean; error?: string }> => {
      loading.value = true;
      error.value = null;

      try {
        if (!user.value) {
          throw new Error("Authentication required to delete project");
        }

        // Simple delete - CASCADE handles all related data (leads, pages, behaviors)
        const { error: deleteError } = await supabase
          .from("projects")
          .delete()
          .eq("id", projectId)
          .eq("user_id", user.value.id); // Security: ensure user owns the project

        if (deleteError) throw deleteError;

        // Remove from local store
        const index = projects.value.findIndex((p) => p.id === projectId);
        if (index !== -1) {
          projects.value.splice(index, 1);
        }

        // Clear selected project if it was the deleted one
        if (selectedProjectId.value === projectId) {
          selectedProjectId.value = null;
          const pageStore = usePageStore();
          pageStore.clearStore();
        }

        return { success: true };
      } catch (err: any) {
        console.error("Error deleting project:", err);
        error.value = err;
        return { success: false, error: err.message };
      } finally {
        loading.value = false;
      }
    };

    const clearStore = () => {
      projects.value = [];
      selectedProjectId.value = null;
      loading.value = false;
      error.value = null;
    };

    return {
      projects,
      loading,
      error,
      selectedProjectId,
      selectedProject,
      selectedProjectSlug,
      setSelectedProjectId,
      fetchProjects,
      createProject,
      updateProjectData,
      addProject,
      updateProject,
      deleteProject,
      clearStore,
    };
  },
  {
    persist: true,
  }
);
