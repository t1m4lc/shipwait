<template>
  <div v-if="error" class="min-h-screen flex flex-col items-center justify-center p-4">
    <h1 class="text-2xl font-bold mb-4">Error</h1>
    <p>{{ error }}</p>
    <NuxtLink to="/" class="mt-4 px-4 py-2 bg-primary text-white rounded">
      Go Home
    </NuxtLink>
  </div>
  <div v-else-if="isLoading" class="min-h-screen flex items-center justify-center">
    <Loader2 class="animate-spin size-6">
      <span class="sr-only">Loading...</span>
    </Loader2>
  </div>
  <div v-else-if="html">
    <div class="min-h-screen w-full overflow-hidden relative">
      <div v-html="html"></div>
      <div class="fixed bottom-3 sm:bottom-6 right-3 sm:right-6">
        <BuildWithSipwait :project-slug="slug" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { Loader2 } from "lucide-vue-next";
import { onMounted, ref } from "vue";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const slug = route.params.slug as string;
const html = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const pageTitle = ref<string>("Landing Page");

// Set the initial page title
useHead({
  title: pageTitle,
  meta: [{ name: "robots", content: "noindex" }],
});

onMounted(async () => {
  try {
    isLoading.value = true;

    const supabase = useSupabaseClient();

    // First, get the project by slug
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (projectError) throw projectError;
    if (!project) throw new Error("Project not found");

    const projectId = project.id as string;

    // Update page title with project name if available
    if (project.name) {
      pageTitle.value = project.name as string;
      useHead({ title: pageTitle.value });
    }

    // Then get the page content using the project ID
    const { data: pageData, error: pageError } = await supabase
      .from("pages")
      .select("*")
      .eq("project_id", projectId)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (pageError) throw pageError;
    if (!pageData) throw new Error("No active page found for this project");

    // Using type assertion to bypass TypeScript errors
    html.value = (pageData as any).html as string;

    // Set page title from the page data if available
    if ((pageData as any).title) {
      pageTitle.value = (pageData as any).title as string;
      useHead({ title: pageTitle.value });
    }
  } catch (err: any) {
    console.error("Error loading page:", err);
    error.value = "This page could not be found.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
html,
body {
  overflow-x: hidden;
}
</style>
