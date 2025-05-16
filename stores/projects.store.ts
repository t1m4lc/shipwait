import { defineStore } from "pinia";
import type { Database } from "~/types/supabase";
import type { QueryData } from "@supabase/supabase-js";

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();

    if (!user.value) {
      throw new Error("No authenticated user");
    }

    const projectFullQuery = supabase
      .from("projects")
      .select(
        `
      *,
      submission_behaviors(*)
    `
      )
      .eq("user_id", user.value.id)
      .order("name");

    type ProjectFull = QueryData<typeof projectFullQuery>;

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

    const setSelectedProjectId = (id: string) => {
      selectedProjectId.value = id;
    };

    const fetchProjects = async () => {
      loading.value = true;
      error.value = null;

      try {
        if (!user.value) {
          throw new Error("No authenticated user");
        }

        const { data, error } = await projectFullQuery;

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

    return {
      projects,
      loading,
      error,
      selectedProjectId,
      selectedProject,
      setSelectedProjectId,
      fetchProjects,
    };
  },
  {
    persist: true,
  }
);
