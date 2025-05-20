<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { Check, Copy } from 'lucide-vue-next';

const props = defineProps<{
  snippet: string
  projectId: string
  projectSlug: string
}>()

const isCopied = ref(false)

const copySnippet = async () => {
  const { copy, copied } = useClipboard()
  await copy(props.snippet)
  isCopied.value = copied.value
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="mb-8 text-center">
      <h3 class="text-2xl font-semibold">Project Created Successfully! 🎉</h3>
      <p class="text-muted-foreground mt-2">
        How you'd like to start collecting leads:
      </p>
    </div>

    <div class="w-full flex flex-col md:flex-row gap-6 mb-8">
      <!-- Left: Add snippet to your site -->
      <div class="flex-1 bg-muted rounded-md p-6 flex flex-col">
        <h4 class="font-semibold mb-2">Add snippet to your site</h4>
        <p class="text-sm text-muted-foreground mb-4">
          Copy the code below and paste it into your website to start collecting leads.
        </p>
        <div class="relative">
          <Button type="button" variant="outline" size="icon" @click="copySnippet" class="absolute top-1.5 right-1.5" title="Copy to clipboard">
            <Copy v-if="!isCopied" class="h-4 w-4" />
            <Check v-else class="h-4 w-4" />
          </Button>
          <pre class="text-xs overflow-x-auto whitespace-pre-wrap break-all bg-background rounded p-3 border">{{ snippet }}</pre>
        </div>
      </div>

      <!-- Right: Create landing page -->
      <div class="flex-1 bg-muted rounded-md p-6 flex flex-col items-center justify-center">
        <h4 class="font-semibold mb-2">Prefer a hosted landing page?</h4>
        <p class="text-sm text-muted-foreground mb-4 text-center">
          Instantly launch a hosted landing page to start collecting leads.
        </p>
        <Button as-child variant="outline" size="sm">
          <NuxtLink :to="`/dashboard/projects/${props.projectSlug}/page`">
            Create a landing page
          </NuxtLink>
        </Button>
      </div>
    </div>

    <div class="flex justify-center">
      <Button variant="default" size="sm" as-child>
        <NuxtLink to="/dashboard" class="flex items-center">
          <span>Go to Dashboard</span>
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
