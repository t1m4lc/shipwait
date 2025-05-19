<template>
  <div
    v-if="error"
    class="min-h-screen flex flex-col items-center justify-center p-4"
  >
    <h1 class="text-2xl font-bold mb-4">Error</h1>
    <p>{{ error }}</p>
    <NuxtLink to="/" class="mt-4 px-4 py-2 bg-primary text-white rounded">
      Go Home
    </NuxtLink>
  </div>
  <div
    v-else-if="isLoading"
    class="min-h-screen flex items-center justify-center"
  >
    <div
      class="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
    ></div>
  </div>
  <div v-else-if="html" v-html="html" class="min-h-screen"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Database } from "~/types/supabase";

const route = useRoute();
const id = route.params.id as string;
const html = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Create a separate type for Page if it doesn't exist in the DB schema yet
interface Page {
  id: string;
  html: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
}

// Set the page title
useHead({
  title: "Landing Page",
  meta: [{ name: "robots", content: "noindex" }],
});

onMounted(async () => {
  try {
    isLoading.value = true;

    // Get Supabase client
    const supabase = useSupabaseClient<Database>();

    // Fetch the page by id
    const { data, error: fetchError } = await supabase
      .from("pages")
      .select("html, title")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!data) {
      error.value = "Page not found";
      return;
    }

    // Set the HTML content
    html.value = data.html;

    // Update page title if available
    if (data.title) {
      useHead({
        title: data.title,
      });
    }

    // Update visit count
    try {
      // First try to update existing record
      const { error: updateError } = await supabase
        .from("page_stats")
        .update({ visits: supabase.rpc("increment", { row_visits: 1 }) })
        .eq("page_id", id);

      // If the record doesn't exist, create it
      if (updateError) {
        await supabase
          .from("page_stats")
          .insert({ page_id: id, visits: 1, metadata: {} });
      }
    } catch (statsError) {
      console.error("Failed to update page stats:", statsError);
      // Don't throw as this shouldn't prevent page display
    }
  } catch (err: any) {
    console.error("Error fetching page:", err);
    error.value = err.message || "Failed to load page";
  } finally {
    isLoading.value = false;
  }
});
</script>
