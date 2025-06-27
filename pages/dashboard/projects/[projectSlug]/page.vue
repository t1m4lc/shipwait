<template>
    <div class="size-full">
        <SplitHtmlPreview v-model="htmlCode" :validation-errors="validationErrors" :is-html-valid="isHtmlValid" :is-saving="isSaving" :is-deploying="isDeploying" :is-loading="isLoading" :title="pageTitle" :public-page-url="publicPageUrl ?? undefined" :has-active-page="hasActivePage" :has-pending-changes="hasPendingChanges" :templates="templates" :selected-template-id="selectedTemplateId" @validate="validateHtmlCode" @format="formatCode" @save="savePage" @deploy="deployPage" @pause="pausePage" @template-change="handleTemplateChange" />

        <!-- Template Change Warning Dialog -->
        <AlertDialog :open="showTemplateChangeWarning" @update:open="showTemplateChangeWarning = $event">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>⚠️ Switch template?</AlertDialogTitle>
                    <AlertDialogDescription class="space-y-2">
                        <p>Switching templates will replace your current HTML code with the selected template.</p>
                        <div class="rounded-md bg-orange-50 p-3 text-sm">
                            <p class="font-medium text-orange-900">Warning:</p>
                            <ul class="mt-1 text-orange-700 list-disc list-inside space-y-1">
                                <li>All current code in the editor will be lost</li>
                                <li>Any unsaved changes will be permanently deleted</li>
                                <li>Make sure to save your work first if you want to keep it</li>
                            </ul>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="cancelTemplateChange">Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="confirmTemplateChange" variant="destructive">
                        Yes, switch template
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import pkg from 'js-beautify';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";
import SplitHtmlPreview from '~/components/SplitHtmlPreview.vue';
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
const { selectedTemplate, templates, page, isLoading: storeLoading, publicPageUrl, hasActivePage, hasPendingChanges } = storeToRefs(pageStore);

// Local state
const isSaving = ref(false);
const isDeploying = ref(false);
const isLoading = computed(() => storeLoading.value || isSaving.value || isDeploying.value);
const pageTitle = ref('Page Editor');

// HTML editor state
const htmlCode = ref('');
const validationErrors = ref<string[]>([]);
const isHtmlValid = computed(() => validationErrors.value.length === 0);

// Template selection
const selectedTemplateId = computed(() => selectedTemplate.value?.id || '');

// Warning dialog state
const showTemplateChangeWarning = ref(false);
const pendingTemplateId = ref<string | null>(null);

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
 * Save the current page
 */
async function savePage() {
    if (!isHtmlValid.value) {
        toast.error("Cannot save invalid HTML");
        return;
    }

    isSaving.value = true;

    try {
        const title = selectedTemplate.value?.name || "My Landing Page";
        const result = await pageStore.savePage(
            projectId.value,
            projectSlug.value,
            title,
            htmlCode.value
        );

        if (result.success) {
            toast.success("Page saved successfully");
        } else {
            toast.error(`Failed to save page: ${result.error}`);
        }
    } catch (error) {
        console.error("Error saving page:", error);
        toast.error("Failed to save page");
    } finally {
        isSaving.value = false;
    }
}

/**
 * Deploy the page
 */
async function deployPage() {
    if (!isHtmlValid.value) {
        toast.error("Cannot deploy invalid HTML");
        return;
    }

    isDeploying.value = true;

    try {
        const title = selectedTemplate.value?.name || "My Landing Page";
        const result = await pageStore.deployPage(
            projectId.value,
            projectSlug.value,
            title,
            htmlCode.value
        );

        if (result.success && result.data?.publicUrl) {
            toast.success(`Page deployed and live at ${result.data.publicUrl}`);
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
 * Pause the page
 */
async function pausePage() {
    isDeploying.value = true;

    try {
        const result = await pageStore.pausePage(projectId.value);

        if (result.success) {
            toast.success("Page paused successfully");
        } else {
            toast.error(`Failed to pause page: ${result.error}`);
        }
    } catch (error) {
        console.error("Error pausing page:", error);
        toast.error("Failed to pause page");
    } finally {
        isDeploying.value = false;
    }
}

/**
 * Handle template change with warning
 */
async function handleTemplateChange(templateId: string) {
    // If there are unsaved changes, show the warning dialog
    if (htmlCode.value.trim()) {
        pendingTemplateId.value = templateId;
        showTemplateChangeWarning.value = true;
        return;
    }

    // Apply the template change directly if no content
    await applyTemplateChange(templateId);
}

/**
 * Apply template change
 */
async function applyTemplateChange(templateId: string) {
    const result = await pageStore.selectTemplate(templateId);
    if (result.success && result.data) {
        htmlCode.value = result.data.html;
        formatCode(true);
        validateHtmlCode();
        toast.success(`Template "${result.data.name}" loaded`);
    } else if (result.error && result.error.includes('Pro subscription')) {
        // Show upgrade prompt for premium templates
        toast.error(result.error, {
            action: {
                label: "Upgrade to Pro",
                onClick: () => navigateTo('/pricing')
            }
        });
    } else {
        toast.error("Failed to load template");
    }
}

/**
 * Confirm template change from dialog
 */
async function confirmTemplateChange() {
    if (pendingTemplateId.value) {
        await applyTemplateChange(pendingTemplateId.value);
    }
    showTemplateChangeWarning.value = false;
    pendingTemplateId.value = null;
}

/**
 * Cancel template change
 */
function cancelTemplateChange() {
    showTemplateChangeWarning.value = false;
    pendingTemplateId.value = null;
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
        savePage();
    }
});

// Initialize page data
onMounted(async () => {
    // Make sure projectId is valid before proceeding
    if (!projectId.value || !projectSlug.value) {
        console.warn("Missing projectId or projectSlug, waiting for projects to load");
        // Give projects time to load, then check again
        await new Promise(resolve => setTimeout(resolve, 500));

        // If still no projectId, show an error and return
        if (!projectId.value || !projectSlug.value) {
            toast.error("Missing project information");
            return;
        }
    }

    try {
        const result = await pageStore.initializePageData(projectId.value);

        if (result.success && result.data) {
            // Check if we have a saved page
            if (result.data.page && result.data.page.html) {
                // Load the saved page
                htmlCode.value = result.data.page.html;
            } else if (result.data.templates && result.data.templates.length > 0) {
                // Load the first template if no saved page exists
                const firstTemplate = result.data.templates[0];
                await pageStore.selectTemplate(firstTemplate.id);
                htmlCode.value = firstTemplate.html;
            } else {
                // No templates available - show empty editor
                htmlCode.value = '';
                toast.warning("No templates available. Contact admin to add page templates.");
            }

            // Format the code
            formatCode(true);
            validateHtmlCode();
        } else {
            toast.error(`Failed to load page data: ${result.error}`);
            htmlCode.value = '';
        }
    } catch (error) {
        console.error("Error loading page data:", error);
        toast.error("Failed to load page data");

        // Set empty content on error
        htmlCode.value = '';
    }
});
</script>