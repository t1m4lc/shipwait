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
  <div v-else-if="html">
    <div
      v-html="html"
      class="min-h-screen w-full overflow-x-hidden relative"
    ></div>
    <!-- Built with ShipWait link -->
    <div class="fixed bottom-4 right-4 bg-red-500">
      <button variant="outline" class="text-black p-10">
        <!-- <NuxtLink :to="`/?ref=${id}`"> Built with ShipWait </NuxtLink> -->
        Test buuton
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { onMounted, ref } from "vue";
import type { Database } from "~/types/supabase";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const id = route.params.id as string;
const html = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Set the page title
useHead({
  title: "Landing Page",
  meta: [{ name: "robots", content: "noindex" }],
});

onMounted(async () => {
  try {
    isLoading.value = true;

    const supabase = useSupabaseClient<Database>();

    const { data: page, error: fetchError } = await supabase
      .from("pages")
      .select("html, title, active")
      .eq("id", id)
      .limit(1)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // TODO page not active fallback

    if (!page) {
      error.value = "Page not found";
      return;
    }

    html.value = page.html;

    if (page.title) {
      useHead({
        title: page.title,
      });
    }
  } catch (err: any) {
    console.error("Error fetching page:", err);
    error.value = err.message || "Failed to load page";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>
html,
body {
  overflow-x: hidden;
}
</style>
