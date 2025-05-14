<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { Copy } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const props = defineProps<{
  title?: string;
  language?: string;
  lineNumbers?: boolean;
  variant?: 'default' | 'dark' | 'light';
  withCopy?: boolean
}>()

const title = props.title || 'Code Snippet';
const showLineNumbers = props.lineNumbers !== false;

const contentRef = ref<HTMLElement | null>(null);
const lineCount = ref(0);

onMounted(() => {
  if (contentRef.value && showLineNumbers) {
    const content = contentRef.value.textContent || '';
    lineCount.value = content.split('\n').length;
  }
});

async function onCopy(source: string) {
  await useClipboard({ source }).copy(source)
  toast('Coppied to clipboad')
}

</script>

<template>
  <article
    class="w-full select-none rounded-lg shadow-lg overflow-hidden border dark:border-gray-800 border-gray-200 dark:bg-gray-950 bg-white">
    <div
      class="flex items-center justify-between px-4 py-2 border-b dark:border-gray-800 border-gray-200 dark:bg-gray-900 bg-gray-50">
      <div class="font-medium text-sm dark:text-gray-200 text-gray-700">
        {{ title }}
      </div>
      <Button type="button" @click="onCopy(contentRef?.textContent || '')" variant="outline">
        <Copy />
      </Button>

    </div>

    <div class="flex cursor-text">
      <div v-if="showLineNumbers"
        class="py-4 text-right select-none border-r min-w-[2.5rem] px-2 dark:bg-gray-900 bg-gray-50 dark:text-gray-500 text-gray-400 dark:border-gray-800 border-gray-200">
        <div v-for="i in lineCount" :key="i" class="text-xs font-mono">
          {{ i }}
        </div>
      </div>

      <div ref="contentRef"
        class="select-text p-4 overflow-auto w-full text-sm font-mono dark:bg-gray-950 bg-white dark:text-green-300 text-gray-700">
        <pre class="whitespace-pre"><code><slot /></code></pre>
      </div>
    </div>

    <div class="flex justify-end px-4 py-2 border-t dark:border-gray-800 border-gray-200 dark:bg-gray-900 bg-gray-50">
      <Badge variant="secondary" v-if="language" class="block font-mono">{{ language }}</Badge>
    </div>
  </article>
</template>