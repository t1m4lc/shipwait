<template>
  <div class="size-full">
    <ClientOnly>
      <Splitpanes :horizontal="isSmallScreen" class="size-full">
        <Pane :size="65" :min-size="20" :max-size="70">
          <div class="size-full flex flex-col">
            <header class="flex flex-wrap justify-between items-center p-3 border-b gap-2">
              <div class="flex items-center gap-1 sm:gap-2">
                <SidebarTrigger class="-ml-1" />
                <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
                <h2 class="lg:text-lg font-semibold line-clamp-1">Page Editor</h2>
              </div>
              <div class="flex gap-1 sm:gap-2">
                <Button variant="outline" size="sm" class="gap-1.5" @click="formatCode">
                  <WrapText class="size-4" />
                  <span class="hidden lg:inline">Format</span>
                </Button>

                <Button :disabled="!isHtmlValid || isSaving || isDeploying" variant="outline" size="sm" class="gap-1.5" @click="saveTemplate" :class="{ 'opacity-50': isSaving }">
                  <Loader2 v-if="isSaving" class="size-4 animate-spin" />
                  <Save v-else class="size-4" />
                  <span class="hidden lg:inline">Save</span>
                </Button>

                <Button v-if="publicPageUrl" variant="outline" size="sm" class="gap-1.5" as-child>
                  <NuxtLink :to="publicPageUrl" target="_blank">
                    <ExternalLink class="size-4" />
                    <span class="hidden lg:inline">View Page</span>
                  </NuxtLink>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button :disabled="!isHtmlValid || !currentTemplate?.id || isSaving || isDeploying" size="sm" class="gap-1.5">
                      <Rocket class="size-4" />
                      <span class="hidden lg:inline">Deploy</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deploy your landing page?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will publish your landing page to the live server and
                        make it visible to your visitors. You can always make
                        changes and redeploy later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction @click.prevent="deployPage">Yes, deploy!</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>


              </div>
            </header>
            <div class="relative flex-1 font-medium overflow-hidden">
              <Codemirror v-model="htmlCode" :extensions="extensions" class="html-editor h-full" placeholder="Paste your HTML landing page here..." @update:model-value="validateHtmlCode" />

              <div class="absolute top-3 right-3 flex items-center gap-3">
                <Badge v-if="validationStatus === 'valid'" class="tracking-wider rounded-full bg-accent text-primary-background space-x-1 border border-primary-background">
                  <span class="relative flex size-2">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75">
                    </span>
                    <span class="relative inline-flex size-2 rounded-full bg-green-500"></span>
                  </span>
                  <span class="first-letter:uppercase"> Valid code </span>
                </Badge>
                <HoverCard v-if="validationStatus === 'invalid'">
                  <HoverCardTrigger class="hover:cursor-help">
                    <Badge class="tracking-wider rounded-full bg-accent text-primary-background space-x-1 border border-primary-background">
                      <span class="relative flex size-2">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75">
                        </span>
                        <span class="relative inline-flex size-2 rounded-full bg-red-500"></span>
                      </span>
                      <span class="first-letter:uppercase"> Invalid code </span>
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <ul class="text-xs font-medium">
                      <li v-for="err in validationErrors">&bull; {{ err }}</li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
        </Pane>
        <Pane :size="35" :min-size="20" :max-size="70">
          <iframe :srcdoc="htmlCode" sandbox="allow-same-origin" class="w-full h-full border-none" aria-label="Live preview" />
        </Pane>
      </Splitpanes>
      <template #fallback>
        <div class="flex items-center justify-center size-full">
          <div class="animate-pulse">Loading editor...</div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import { useWindowSize } from "@vueuse/core";
import { Rocket, Save, WrapText, ExternalLink, Loader2 } from "lucide-vue-next";
import { Pane, Splitpanes } from "splitpanes";
import { computed, ref, shallowRef, onMounted } from "vue";
import { Codemirror } from "vue-codemirror";
import { toast } from "vue-sonner";
import { usePageStore, type PageTemplate } from "~/stores/page.store";
import { html_beautify } from 'js-beautify';

// Get route and project ID
const route = useRoute();
const projectsStore = useProjectsStore();
const projectId = computed(() => projectsStore.selectedProjectId || route.params.projectId as string);

// Initialize page store
const pageStore = usePageStore();
const { templates, currentTemplate, loading, publicPageUrl } = storeToRefs(pageStore);

const isSaving = ref(false);
const isDeploying = ref(false);
const templateName = ref("My Landing Page");

// Format HTML code using js-beautify
function formatCode() {
  try {
    const formatted = html_beautify(htmlCode.value, {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 1,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      wrap_line_length: 120,
      end_with_newline: true
    });

    htmlCode.value = formatted;
    toast.success("Code formatted successfully");
  } catch (error) {
    console.error("Failed to format code:", error);
    toast.error("Failed to format code");
  }
}

// Save the template to the database
async function saveTemplate() {
  if (!isHtmlValid.value) {
    toast.error("Cannot save invalid HTML");
    return;
  }

  isSaving.value = true;
  try {
    const template: Omit<PageTemplate, "user_id"> = {
      id: currentTemplate.value?.id,
      name: templateName.value,
      html: htmlCode.value,
      project_id: projectId.value,
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

// Deploy the page to make it public
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

const { width } = useWindowSize();
const isSmallScreen = computed(() => width.value < 1280); // XL breakpoint

// CodeMirror extensions
const extensions = shallowRef([
  html(),
  EditorView.lineWrapping,
  EditorView.theme({
    "&": {
      fontSize: "0.75rem",
      fontFamily: "monospace",
      height: "100%",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
  }),
]);

// Default HTML template
const LANDING_PAGE_EXAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Landing Page</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    form {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    input {
      padding: 10px;
      width: 100%;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>Join Our Waitlist</h1>
  <p>Be the first to know when we launch!</p>
  
  <form>
    <label for="email">Email Address</label>
    <input data-shipwait type="email" id="email" placeholder="youremail@example.com" required>
    <p data-shipwait-message></p>
    <button type="submit">Join Waitlist</button>
  </form>
</body>
</html>`;

const htmlCode = ref(LANDING_PAGE_EXAMPLE);

const validationErrors = ref<string[]>([]);
const isHtmlValid = computed(() => validationErrors.value.length === 0);
const validationStatus = computed(() => isHtmlValid.value ? "valid" : "invalid");

const validateHtmlCode = () => {
  validationErrors.value = validateHtml(htmlCode.value);
};

// Format code on initialization and fetch data
onMounted(async () => {
  validateHtmlCode();
  formatCode();

  // Load deployed pages to check if we already have a public URL
  if (projectId.value) {
    await pageStore.fetchDeployedPages(projectId.value);

    // Initialize with existing template if available
    await pageStore.fetchTemplates(projectId.value);
    if (templates.value.length > 0) {
      currentTemplate.value = templates.value[0];
      htmlCode.value = currentTemplate.value.html;
      templateName.value = currentTemplate.value.name;
    }
  }
});
</script>

<style>
.splitpanes {
  background-color: var(--background);
}

.splitpanes--vertical>.splitpanes__splitter {
  width: 8px;
  background-color: var(--secondary);
  cursor: grab;
}

.splitpanes--horizontal>.splitpanes__splitter {
  width: 100%;
  height: 8px;
  background-color: var(--secondary);
  cursor: grab;
}

.splitpanes--horizontal>.splitpanes__splitter:active {
  cursor: grabbing;
}

.splitpanes--vertical>.splitpanes__splitter:active {
  cursor: grabbing;
}

/* CodeMirror styling */
.html-editor {
  height: 100%;
  font-size: 0.75rem;
  line-height: 1.25;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.html-editor .cm-editor {
  height: 100%;
  max-height: calc(100vh - 120px);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.html-editor .cm-scroller {
  overflow: auto;
  flex: 1;
}

.html-editor .cm-focused {
  outline: none !important;
}

/* Customize CodeMirror syntax highlighting */
.html-editor .cm-content .cm-tag {
  color: #22863a;
}

.html-editor .cm-content .cm-attribute {
  color: #6f42c1;
}

.html-editor .cm-content .cm-string {
  color: #032f62;
}

.html-editor .cm-content .cm-comment {
  color: #6a737d;
}

/* Add custom selection styling */
.html-editor .cm-editor .cm-selectionBackground {
  background-color: rgb(225, 242, 255) !important;
}

.html-editor .cm-editor .cm-line.cm-activeLine {
  background-color: rgb(225, 242, 255, 0.5) !important;
}
</style>
