<template>
    <div class="size-full">
        <SplitHtmlPreview v-model="htmlCode" :validation-errors="validationErrors" :is-html-valid="isHtmlValid" :is-saving="isSaving" :is-deploying="isDeploying" :is-loading="isLoading" :title="pageTitle" :public-page-url="publicPageUrl ?? undefined" :has-template="!!currentTemplate?.id" @validate="validateHtmlCode" @format="formatCode" @save="saveTemplate" @deploy="deployPage" />
    </div>
</template>

<script setup lang="ts">
import { html_beautify } from 'js-beautify';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import SplitHtmlPreview from '~/components/SplitHtmlPreview.vue';
import { usePageStore } from "~/stores/page.store";
import { useProjectsStore } from '~/stores/projects.store';

definePageMeta({
    middleware: ['project-id'],
    layout: "page"
});

const route = useRoute();
const projectsStore = useProjectsStore();
const projectId = computed(() => projectsStore.selectedProjectId || route.params.projectId as string);

const pageStore = usePageStore();
const { templates, currentTemplate, publicPageUrl } = storeToRefs(pageStore);

const isSaving = ref(false);
const isDeploying = ref(false);
const isLoading = ref(false);
const templateName = ref("My Landing Page");
const pageTitle = ref('Page Editor');

const htmlCode = ref('');
const validationErrors = ref<string[]>([]);

function formatCode() {
    try {
        const formatted = html_beautify(htmlCode.value, {
            indent_size: 2,
            indent_char: ' ',
            max_preserve_newlines: 1,
            preserve_newlines: true,
            indent_inner_html: true,
            wrap_line_length: 120,
            end_with_newline: true,
            // Cast to any to handle properties that might not be in the type definitions
            ...(({
                indent_scripts: 'normal',
                brace_style: 'collapse',
                space_before_conditional: true,
                unescape_strings: false,
            } as any))
        });

        htmlCode.value = formatted;
        toast.success("Code formatted successfully");
    } catch (error) {
        console.error("Failed to format code:", error);
        toast.error("Failed to format code");
    }
}

async function saveTemplate() {
    if (!isHtmlValid.value) {
        toast.error("Cannot save invalid HTML");
        return;
    }

    isSaving.value = true;
    try {
        const template = {
            id: currentTemplate.value?.id,
            name: templateName.value,
            html: htmlCode.value,
            project_id: projectId.value,
            // Add required properties with current timestamp if new template
            created_at: currentTemplate.value?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const result = await pageStore.saveTemplate(template);

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

async function deployPage() {
    if (!currentTemplate.value?.id) {
        toast.error("Please save the template before deploying");
        return;
    }

    isDeploying.value = true;
    try {
        const result = await pageStore.deployPage(projectId.value, currentTemplate.value);

        if (result.success) {
            toast.success("Page deployed successfully");
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

function validateHtml(htmlContent: string): string[] {
    const errors: string[] = [];

    // Check if HTML is well-formed
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const parserErrors = doc.querySelectorAll("parsererror");

        if (parserErrors.length > 0) {
            errors.push("HTML is not well-formed");
        }

        // Check for script tags
        const scriptTags = doc.querySelectorAll("script");
        if (scriptTags.length > 0) {
            errors.push("Script tags are not allowed");
        }

        // Check for input with data-shipwait attribute inside a form
        const shipwaitInputs = doc.querySelectorAll("form input[data-shipwait]");
        if (shipwaitInputs.length === 0) {
            errors.push("Missing form input with data-shipwait attribute");
        }
    } catch (error) {
        errors.push("Could not parse HTML");
    }

    return errors;
}

const isHtmlValid = computed(() => validationErrors.value.length === 0);

const validateHtmlCode = (content = htmlCode.value) => {
    validationErrors.value = validateHtml(content);
};

// Format code on initialization and fetch data
onMounted(async () => {
    validateHtmlCode();

    // Load deployed pages to check if we already have a public URL
    if (projectId.value) {
        isLoading.value = true;
        try {
            await pageStore.fetchDeployedPages(projectId.value);

            // Initialize with existing template if available
            await pageStore.fetchTemplates(projectId.value);
            if (templates.value.length > 0) {
                currentTemplate.value = templates.value[0];
                htmlCode.value = currentTemplate.value.html || htmlCode.value;
                templateName.value = currentTemplate.value.name;
            }

            // Format after loading
            formatCode();
        } catch (error) {
            console.error("Error loading page data:", error);
            toast.error("Failed to load page data");
        } finally {
            isLoading.value = false;
        }
    }
});
</script>