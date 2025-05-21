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
import { nextTick, onMounted, ref, watch } from "vue";
import type { Database } from "~/types/supabase";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const slug = route.params.slug as string;
const html = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const pageTitle = ref<string>("Landing Page");
const projectId = ref<string | null>(null);


// Submit form data to the server and handle responses
const submitShipwaitForm = async (form: HTMLFormElement, input: HTMLInputElement): Promise<void> => {
  if (!import.meta.client) return;

  const email = input.value.trim();

  if (!email) {
    showMessage(form, 'Please enter your email.');
    return;
  }

  // Find UI elements
  const messageEl = document.querySelector('[data-shipwait-message]');
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  const originalBtnText = submitBtn?.textContent || 'Submit';

  // Set loading state
  setLoadingState(form, true, submitBtn, originalBtnText, input);

  try {
    // Step 1: Submit the lead using project slug
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, projectSlug: slug }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit form');
    }

    // Step 2: Get behavior configuration
    // Use projectId if available, otherwise use projectSlug parameter
    const queryParam = projectId.value ? `projectId=${projectId.value}` : `projectSlug=${slug}`;
    const behaviorResponse = await fetch(`/api/submission-behaviors?${queryParam}`);
    let behavior = null;

    if (behaviorResponse.ok) {
      const result = await behaviorResponse.json();
      behavior = result.data;
    }

    // Handle submission behavior
    const behaviorType = behavior?.behavior_type || 'do_nothing';
    const payload = behaviorType === 'redirect' ? behavior?.redirect_url : behavior?.message;

    if (behaviorType === 'redirect' && payload) {
      window.location.href = payload;
      return;
    } else if (behaviorType === 'show_message' && payload) {
      showMessage(form, payload);
    } else {
      showMessage(form, 'Thank you for your submission!');
    }

    // Clear the input
    input.value = '';
  } catch (error) {
    console.error('Form submission error:', error);
    showMessage(form, error instanceof Error ? error.message : 'An error occurred');
  } finally {
    setLoadingState(form, false, submitBtn, originalBtnText, input);
  }
};

// Helper function to show messages
const showMessage = (form: HTMLFormElement, message: string): void => {
  const messageEl = form.querySelector('[data-shipwait-message]') || document.querySelector('[data-shipwait-message]');

  if (messageEl && messageEl instanceof HTMLElement) {
    messageEl.textContent = message;

    // Apply consistent styling to message element
    messageEl.style.marginTop = '16px';
    messageEl.style.fontWeight = '600';
    messageEl.style.display = 'block';
    messageEl.style.textAlign = 'center';

    // Determine message type for appropriate styling
    const isError = message.toLowerCase().includes('error') ||
      message.toLowerCase().includes('failed') ||
      message.toLowerCase().includes('already exists');

    if (isError) {
      messageEl.style.color = '#e11d48'; // Error color (red)
    } else {
      messageEl.style.color = '#8A4FFF'; // Success color (purple)
    }
  } else {
    alert(message);
  }
};

// Helper function to set loading state
const setLoadingState = (
  form: HTMLFormElement,
  isLoading: boolean,
  submitBtn: HTMLButtonElement | null,
  originalText: string,
  input: HTMLInputElement
): void => {
  if (input) input.disabled = isLoading;

  if (submitBtn) {
    submitBtn.disabled = isLoading;
    // Force button text reset when loading is complete
    if (isLoading) {
      submitBtn.textContent = `${originalText}...`;
    } else {
      // Use setTimeout to ensure the browser has time to update the UI
      setTimeout(() => {
        if (submitBtn) submitBtn.textContent = originalText;
      }, 0);
    }
  }
};

// This function adds a Vue-level handler to intercept form submissions and process them
const setupFormInterception = (): void => {
  if (!import.meta.client) return;

  // Use capture phase to ensure our handler runs before others
  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('[data-shipwait]') as HTMLInputElement;

    // Only intercept forms with data-shipwait inputs
    if (input) {
      // Prevent the default form submission to avoid page reload
      event.preventDefault();
      console.log('Form submission intercepted by Vue component');

      // Process the form submission directly from our code
      submitShipwaitForm(form, input);
    }
  }, { capture: true });
};

// Watch for HTML content changes to set up form interception
watch(html, (newHtml) => {
  if (newHtml && import.meta.client) {
    nextTick(() => {
      setupFormInterception();
    });
  }
});

useHead({
  title: pageTitle,
  meta: [
    { name: "robots", content: "noindex" }
  ]
});

onMounted(async () => {
  try {
    isLoading.value = true;

    const supabase = useSupabaseClient<Database>();

    // Get the project and its active page in a single request
    const { data, error } = await supabase
      .from("projects")
      .select(`
        id,
        name,
        pages!inner(*)
      `)
      .eq("slug", slug)
      .limit(1, { referencedTable: 'pages' })
      .single();

    if (error) throw error;
    if (!data) throw new Error("Project not found");
    if (!data.pages || data.pages.length === 0) throw new Error("No active page found for this project");

    const project = data;
    const pageData = data.pages[0];

    // Store project ID for API calls
    projectId.value = project.id;

    // Update page title with project name if available
    if (project.name) {
      pageTitle.value = project.name;
      useHead({ title: pageTitle.value });
    }

    // Set HTML content from the page data
    html.value = pageData.html;

    // Set page title from the page data if available
    if (pageData.title) {
      pageTitle.value = pageData.title;
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
