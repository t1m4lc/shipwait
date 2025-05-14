import { defineStore } from "pinia";
import type { Database, Tables } from "~/types/supabase";

interface ProjectsState {
  projects: Tables<"projects">[];
  loading: boolean;
  error: any;
  selectedProjectId: string;
}

export const useProjectsStore = defineStore(
  "projects",
  () => {
    const supabase = useSupabaseClient<Database>();
    const projects = ref<Tables<"projects">[]>([]);
    const loading = ref(false);
    const error = ref<any>(null);
    const selectedProjectId = ref<string>("");

    const selectedProject = computed(() =>
      projects.value.find((project) => project.id === selectedProjectId.value)
    );

    const setSelectedProjectId = (id: string) => {
      selectedProjectId.value = id;
    };

    const fetchProjects = async () => {
      loading.value = true;
      error.value = null;

      try {
        const user = useSupabaseUser();

        if (!user.value) {
          throw new Error("No authenticated user");
        }

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("name");

        if (error) throw error;

        projects.value = data || [];
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
