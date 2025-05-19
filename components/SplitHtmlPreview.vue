<template>
  <div class="size-full">
    <ClientOnly>
      <Splitpanes :horizontal="isSmallScreen" class="size-full">
        <Pane :size="65" :min-size="20" :max-size="70">
          <div class="size-full flex flex-col">
            <div class="flex justify-between items-center p-3 border-b">
              <h2 class="text-lg font-semibold">HTML Editor</h2>
              <div class="flex gap-2">
                <Button :disabled="!isHtmlValid" variant="outline" size="sm" class="gap-1.5">
                  <Save class="size-4" />
                  <!-- <Loader2 class="size-4 animate-spin" /> -->
                  Save
                </Button>

                <AlertDialog v-model:open="deployAlertOpen">
                  <AlertDialogTrigger as-child>
                    <Button :disabled="!isHtmlValid" size="sm" class="gap-1.5">
                      <Rocket class="size-4" />
                      Deploy
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
                      <AlertDialogAction @click.prevent="onDeploy">Yes, deploy!</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div class="relative flex-1 font-medium overflow-hidden">
              <Codemirror v-model="htmlCode" :extensions="extensions" class="html-editor h-full" placeholder="Paste your HTML landing page here..." @update:model-value="validateHtmlCode" />

              <div class="absolute top-0 right-0 p-4 flex items-center gap-3">
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
import { Rocket, Save } from "lucide-vue-next";
import { Pane, Splitpanes } from "splitpanes";
import { computed, ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";

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

const deployAlertOpen = ref(false);

function onDeploy() {
  deployAlertOpen.value = true;
  setTimeout(() => {
    deployAlertOpen.value = false;
  }, 2000);
}

const { width } = useWindowSize();
const isSmallScreen = computed(() => width.value < 1024);

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

const htmlCode = ref(LANDING_PAGE_EXAMPLE);

const validationErrors = ref<string[]>([]);
const isHtmlValid = computed(() => validationErrors.value.length === 0);
const validationStatus = computed(() =>
  isHtmlValid.value ? "valid" : "invalid"
);

const validateHtmlCode = () => {
  validationErrors.value = validateHtml(htmlCode.value);
};

validateHtmlCode();
</script>

<style>
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
