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
                <h2 class="lg:text-lg font-semibold line-clamp-1">{{ title }}</h2>
              </div>
              <div class="flex gap-1 sm:gap-2">
                <Button variant="outline" size="sm" class="gap-1.5" @click="$emit('format')">
                  <WrapText class="size-4" />
                  <span class="hidden lg:inline">Format</span>
                </Button>

                <Button :disabled="!isHtmlValid || isSaving || isDeploying" variant="outline" size="sm" class="gap-1.5" @click="$emit('save')" :class="{ 'opacity-50': isSaving }">
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
                    <Button :disabled="!isHtmlValid || !hasTemplate || isSaving || isDeploying" size="sm" class="gap-1.5">
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
                      <AlertDialogAction @click.prevent="$emit('deploy')">Yes, deploy!</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </header>
            <div class="relative flex-1 font-medium overflow-hidden">
              <Codemirror v-model="localModelValue" :extensions="extensions" class="html-editor h-full" placeholder="Paste your HTML landing page here..." />

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
          <iframe :srcdoc="localModelValue" sandbox="allow-same-origin" class="w-full h-full border-none" aria-label="Live preview" />
        </Pane>
      </Splitpanes>
      <template #fallback>
        <div class="flex items-center justify-center size-full">
          <Loader2 class="animate-spin size-6">
            <span class="sr-only">Loading editor...</span>
          </Loader2>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import { useWindowSize } from "@vueuse/core";
import { ExternalLink, Loader2, Rocket, Save, WrapText } from "lucide-vue-next";
import { Pane, Splitpanes } from "splitpanes";
import { computed, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";

// Props and emits
const props = defineProps<{
  modelValue: string;
  validationErrors: string[];
  isHtmlValid: boolean;
  isSaving: boolean;
  isDeploying: boolean;
  title?: string;
  publicPageUrl?: string;
  hasTemplate?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'validate', value: string): void;
  (e: 'format'): void;
  (e: 'save'): void;
  (e: 'deploy'): void;
}>();

// Create a local computed property for two-way binding
const localModelValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value);
    emit('validate', value);
  }
});

// Computed
const validationStatus = computed(() => props.isHtmlValid ? "valid" : "invalid");

// Window size for responsive layout
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
