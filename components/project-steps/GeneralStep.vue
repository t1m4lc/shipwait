<script setup lang="ts">
import { Check, Loader2, XCircle } from 'lucide-vue-next';
import type { SlugCheckState } from '~/types/project';

defineProps<{
  name: string
  slug: string
  slugCheckState: SlugCheckState
  suggestedSlug: string
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:slug': [value: string]
  'check-slug': [slug: string]
  'generate-slug-from-name': []
}>()

function onNameChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:name', target.value)
  emit('generate-slug-from-name')
}

function onSlugChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:slug', target.value)
  emit('check-slug', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Project Name</FormLabel>
        <FormControl>
          <Input :value="name" @input="onNameChange" v-bind="componentField" placeholder="My Awesome Project" class="w-full" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="slug">
      <FormItem>
        <FormLabel>Project Slug</FormLabel>
        <FormControl>
          <div class="relative">
            <Input :value="slug" @input="onSlugChange" v-bind="componentField" placeholder="my-awesome-project" class="pr-10 w-full" />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Loader2 v-if="slugCheckState === 'loading'" class="h-4 w-4 animate-spin text-muted-foreground" />
              <Check v-else-if="slugCheckState === 'available'" class="h-4 w-4 text-green-500" />
              <XCircle v-else-if="slugCheckState === 'unavailable'" class="h-4 w-4 text-destructive" />
            </div>
          </div>
        </FormControl>
        <FormDescription>
          This will be used in your project's URL: shipwait.com/p/{{ slug || 'your-slug' }}
        </FormDescription>
        <FormMessage />
        <div v-if="slugCheckState === 'unavailable' && suggestedSlug" class="text-sm text-muted-foreground mt-1">
          The slug is already taken. We suggest: <strong>{{ suggestedSlug }}</strong>
        </div>
      </FormItem>
    </FormField>
  </div>
</template>
