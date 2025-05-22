<template>
    <div class="size-full">
        <SplitHtmlPreview v-model="htmlCode" :validation-errors="validationErrors" :is-html-valid="isHtmlValid" :is-saving="isSaving" :is-deploying="isDeploying" :is-loading="isLoading" :title="pageTitle" :public-page-url="publicPageUrl ?? undefined" :has-template="!!template?.id" @validate="validateHtmlCode" @format="formatCode" @save="saveTemplate" @deploy="deployPage" />
    </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import pkg from 'js-beautify';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";
import SplitHtmlPreview from '~/components/SplitHtmlPreview.vue';
import { LANDING_PAGE_EXAMPLE } from "~/stores/landing";
import { usePageStore } from "~/stores/page.store";
import { useProjectsStore } from '~/stores/projects.store';
import { validateHtml } from '~/utils/validateHtml';
const { html_beautify } = pkg;

definePageMeta({
    middleware: ['project-handler'],
    layout: "page"
});

// Project information
const projectsStore = useProjectsStore();
const projectId = computed(() => projectsStore.selectedProjectId || '');
const projectSlug = computed(() => projectsStore.selectedProjectSlug || '');

// Page store with template and page data
const pageStore = usePageStore();
const { template, isLoading: storeLoading, publicPageUrl } = storeToRefs(pageStore);

// Local state
const isSaving = ref(false);
const isDeploying = ref(false);
const isLoading = computed(() => storeLoading.value || isSaving.value || isDeploying.value);
const templateName = computed(() => template.value?.name || "My Landing Page");
const pageTitle = ref('Page Editor');

// HTML editor state
const htmlCode = ref('');
const validationErrors = ref<string[]>([]);
const isHtmlValid = computed(() => validationErrors.value.length === 0);

/**
 * Format the HTML code using js-beautify
 */
function formatCode(silent = false) {
    try {
        const formatted = html_beautify(htmlCode.value, {
            indent_size: 2,
            indent_char: ' ',
            max_preserve_newlines: 1,
            preserve_newlines: true,
            indent_inner_html: true,
            wrap_line_length: 120,
            end_with_newline: true,
            ...(({
                indent_scripts: 'normal',
                brace_style: 'collapse',
                space_before_conditional: true,
                unescape_strings: false,
            } as any))
        });

        htmlCode.value = formatted;

        if (!silent) {
            toast.success("Code formatted successfully");
        }
    } catch (error) {
        console.error("Failed to format code:", error);

        if (!silent) {
            toast.error("Failed to format code");
        }
    }
}

/**
 * Save the current template
 */
async function saveTemplate() {
    if (!isHtmlValid.value) {
        toast.error("Cannot save invalid HTML");
        return;
    }

    isSaving.value = true;

    try {
        const result = await pageStore.saveTemplate({
            id: template.value?.id ?? undefined,
            name: templateName.value,
            html: htmlCode.value,
            project_id: projectId.value,
            created_at: template.value?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        if (result.success) {
            toast.success("Template saved successfully");
        } else {
            toast.error(`Failed to save template: ${result.error}`);
        }
    } catch (error) {
        console.error("Error saving template:", error);
        toast.error("Failed to save template");
    } finally {
        isSaving.value = false;
    }
}

/**
 * Deploy the page using the current template
 */
async function deployPage() {
    if (!template.value?.id) {
        toast.error("Please save the template before deploying");
        return;
    }

    isDeploying.value = true;

    try {
        const result = await pageStore.deployPage(
            projectId.value,
            projectSlug.value,
            template.value
        );

        if (result.success) {
            toast.success("Page deployed successfully");

            if (result.data?.publicUrl) {
                toast.success(`Your page is live at ${result.data.publicUrl}`);
            }
        } else {
            toast.error(`Failed to deploy page: ${result.error}`);
        }
    } catch (error) {
        console.error("Error deploying page:", error);
        toast.error("Failed to deploy page");
    } finally {
        isDeploying.value = false;
    }
}

/**
 * Validate the HTML code
 */
const validateHtmlCode = (content = htmlCode.value) => {
    if (typeof window !== 'undefined') {
        validationErrors.value = validateHtml(content);
    }
};

// Watch for changes to validate HTML
watch(htmlCode, validateHtmlCode);

// Key events for saving
useEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveTemplate();
    }
});

// Initialize page data
onMounted(async () => {
    // Make sure projectId is valid before proceeding
    if (!projectId.value || !projectSlug.value) {
        console.warn("Missing projectId or projectSlug, waiting for projects to load");
        // Give projects time to load, then check again
        await new Promise(resolve => setTimeout(resolve, 500));

        // If still no projectId, show an error and use default content
        if (!projectId.value || !projectSlug.value) {
            toast.error("Missing project information, using default template");
            htmlCode.value = LANDING_PAGE_EXAMPLE;
            formatCode(true);
            validateHtmlCode();
            return;
        }
    }

    try {
        const result = await pageStore.initializePageData(projectId.value);

        if (result.success) {
            // If we have a template, use its HTML
            if (template.value) {
                htmlCode.value = template.value.html;
            } else {
                // Otherwise use default example
                htmlCode.value = LANDING_PAGE_EXAMPLE;
            }

            // Format the code
            formatCode(true);
            validateHtmlCode();
        } else {
            toast.error(`Failed to load page data: ${result.error}`);
            htmlCode.value = LANDING_PAGE_EXAMPLE;
            formatCode(true);
            validateHtmlCode();
        }
    } catch (error) {
        console.error("Error loading page data:", error);
        toast.error("Failed to load page data");

        // Set default content
        htmlCode.value = LANDING_PAGE_EXAMPLE;
        formatCode(true);
        validateHtmlCode();
    }
});
</script>