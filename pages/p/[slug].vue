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
      <div v-if="shouldShowBranding" class="fixed bottom-3 sm:bottom-6 right-3 sm:right-6">
        <BuildWithSipwait :ref="fullPath" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { Loader2 } from "lucide-vue-next";
import { nextTick, onMounted, ref, watch } from "vue";
import { usePageStore } from '~/stores/page.store';

const route = useRoute();
const slug = route.params.slug as string;
const html = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const projectId = ref<string | null>(null);
const shouldShowBranding = ref(true);
const fullPath = computed(() => {
  if (import.meta.client) {
    return window.location.href;
  }
  return route.fullPath || '/';
});

const submitShipwaitForm = async (form: HTMLFormElement, input: HTMLInputElement): Promise<void> => {
  if (!import.meta.client) return;

  const email = input.value.trim();

  if (!email) {
    showMessage(form, 'Please enter your email.');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  const originalBtnText = submitBtn?.textContent || 'Submit';

  setLoadingState(form, true, submitBtn, originalBtnText, input);

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, projectSlug: slug }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit form');
    }

    const queryParam = projectId.value ? `projectId=${projectId.value}` : `projectSlug=${slug}`;
    const behaviorResponse = await fetch(`/api/submission-behaviors?${queryParam}`);
    let behavior = null;

    if (behaviorResponse.ok) {
      const result = await behaviorResponse.json();
      behavior = result.data;
    }

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

    input.value = '';
  } catch (error) {
    console.error('Form submission error:', error);
    showMessage(form, error instanceof Error ? error.message : 'An error occurred');
  } finally {
    setLoadingState(form, false, submitBtn, originalBtnText, input);
  }
};

const showMessage = (form: HTMLFormElement, message: string): void => {
  const messageEl = form.querySelector('[data-shipwait-message]') || document.querySelector('[data-shipwait-message]');

  if (messageEl && messageEl instanceof HTMLElement) {
    messageEl.textContent = message;

    messageEl.style.marginTop = '16px';
    messageEl.style.fontWeight = '600';
    messageEl.style.display = 'block';
    messageEl.style.textAlign = 'center';

    const isError = message.toLowerCase().includes('error') ||
      message.toLowerCase().includes('failed') ||
      message.toLowerCase().includes('already exists');

    if (isError) {
      messageEl.style.color = '#e11d48';
    } else {
      messageEl.style.color = '#8A4FFF';
    }
  } else {
    // Create a temporary message display if no message element exists
    const tempMessage = document.createElement('div');
    tempMessage.textContent = message;
    tempMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') ? '#ef4444' : '#8A4FFF'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-weight: 600;
      font-size: 14px;
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(tempMessage);

    // Remove message after 5 seconds
    setTimeout(() => {
      if (tempMessage && tempMessage.parentNode) {
        tempMessage.parentNode.removeChild(tempMessage);
      }
    }, 5000);
  }
};

const setLoadingState = (
  form: HTMLFormElement,
  isLoading: boolean,
  submitBtn: HTMLButtonElement | null,
  originalText: string,
  input: HTMLInputElement
) => {
  if (input) input.disabled = isLoading;

  if (submitBtn) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtn.textContent = `${originalText}...`;
    } else {
      setTimeout(() => {
        if (submitBtn) submitBtn.textContent = originalText;
      }, 0);
    }
  }
};

const setupFormInterception = (): void => {
  if (!import.meta.client) return;

  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('[data-shipwait]') as HTMLInputElement;

    if (input) {
      event.preventDefault();
      console.log('Form submission intercepted by Vue component');

      submitShipwaitForm(form, input);
    }
  }, { capture: true });
};

watch(html, (newHtml) => {
  if (newHtml && import.meta.client) {
    nextTick(() => {
      setupFormInterception();
    });
  }
});

onMounted(async () => {
  try {
    isLoading.value = true;

    const pageStore = usePageStore();
    const result = await pageStore.getPageBySlug(slug);

    if (!result.success || !result.data) {
      throw new Error("Page not found");
    }

    const page = result.data;
    if (!page?.active) {
      throw new Error("Page not found or inactive");
    }

    html.value = page.html;
    projectId.value = page.project_id;

    // Check if the project owner can remove branding
    if (page.project_id) {
      try {
        const brandingResponse = await fetch(`/api/project/${page.project_id}/can-remove-branding`);
        if (brandingResponse.ok) {
          const brandingData = await brandingResponse.json();
          shouldShowBranding.value = !brandingData.canRemoveBranding;
        } else {
          // If API fails, default to showing branding
          shouldShowBranding.value = true;
        }
      } catch (err) {
        console.warn('Error checking branding removal permission:', err);
        // If check fails, default to showing branding
        shouldShowBranding.value = true;
      }
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
