<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useDebounceFn } from '@vueuse/core'
import { Check, Loader2, XCircle } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import type { SlugCheckState } from '~/types/project'
import { SLUG_PATTERN } from '~/utils/regex'
import { checkSlugAvailability, generateSlug } from '~/utils/slug'

const projectFormSchema = toTypedSchema(z.object({
  name: z.string({
    required_error: 'Required.',
  })
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  slug: z.string({
    required_error: 'Required.',
  })
    .min(2, {
      message: 'Slug must be at least 2 characters.',
    })
    .regex(SLUG_PATTERN, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .max(100, 'Slug must be 100 characters or less'),
}))

const store = useProjectsStore();
const { selectedProject } = storeToRefs(store)

// Form state
const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: projectFormSchema,
  initialValues: {
    name: selectedProject.value?.name || '',
    slug: selectedProject.value?.slug || '',
  },
})

// Dialog and slug checking state
const showConfirmDialog = ref(false)
const pendingFormData = ref<{ name: string; slug: string } | null>(null)
const slugCheckState = ref<SlugCheckState>('not-set')
const suggestedSlug = ref('')
const originalSlug = ref(selectedProject.value?.slug || '')

// Watch for changes in selected project to update form
watch(selectedProject, (newProject) => {
  if (newProject) {
    setFieldValue('name', newProject.name)
    setFieldValue('slug', newProject.slug)
    originalSlug.value = newProject.slug
  }
}, { immediate: true })

// Debounced slug checking
const debouncedCheckSlug = useDebounceFn(async (slug: string) => {
  if (!slug || !selectedProject.value) {
    slugCheckState.value = 'not-set';
    return;
  }

  slugCheckState.value = 'loading';

  try {
    const result = await checkSlugAvailability(slug, selectedProject.value.id);

    if (result.available) {
      slugCheckState.value = 'available';
      suggestedSlug.value = '';
    } else {
      slugCheckState.value = 'unavailable';
      suggestedSlug.value = result.suggestedSlug;
    }
  } catch (error) {
    console.error('Error checking slug availability:', error);
    slugCheckState.value = 'not-set';
  }
}, 500)

// Generate slug from name
const updateSlugFromName = () => {
  if (values.name) {
    const newSlug = generateSlug(values.name);
    setFieldValue('slug', newSlug);
    debouncedCheckSlug(newSlug);
  }
}

// Watch slug changes for validation
watch(() => values.slug, (newSlug) => {
  if (newSlug && newSlug !== originalSlug.value) {
    debouncedCheckSlug(newSlug);
  } else if (newSlug === originalSlug.value) {
    slugCheckState.value = 'available';
  }
})

// Check if slug is changing
const isSlugChanging = computed(() => {
  return values.slug !== originalSlug.value
})

const onSubmit = handleSubmit(async (payload) => {
  // Check if slug is changing and show confirmation dialog
  if (isSlugChanging.value) {
    pendingFormData.value = payload;
    showConfirmDialog.value = true;
    return;
  }

  // If slug isn't changing, proceed with update
  await updateProject(payload);
})

const updateProject = async (payload: { name: string; slug: string }) => {
  try {
    const { error } = await store.updateProjectData(selectedProject.value!.id, payload);

    if (!error) {
      toast('Updated successfully!', {
        description: 'The project settings have been saved.',
      });

      // Update the original slug reference
      originalSlug.value = payload.slug;
      slugCheckState.value = 'not-set';
    } else {
      toast('Update failed', {
        description: error.message || 'An error occurred while updating the project.',
      });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    toast('Update failed', {
      description: 'An unexpected error occurred.',
    });
  }
}

const confirmUpdate = async () => {
  if (pendingFormData.value) {
    await updateProject(pendingFormData.value);
    showConfirmDialog.value = false;
    pendingFormData.value = null;
  }
}

const cancelUpdate = () => {
  showConfirmDialog.value = false;
  pendingFormData.value = null;
}

</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Project name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Type a name" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          The name is used to differentiate projects.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="slug">
      <FormItem>
        <FormLabel>Project Slug</FormLabel>
        <FormControl>
          <div class="relative">
            <Input v-bind="componentField" placeholder="my-awesome-project" class="pr-10" />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Loader2 v-if="slugCheckState === 'loading'" class="h-4 w-4 animate-spin text-muted-foreground" />
              <Check v-else-if="slugCheckState === 'available'" class="h-4 w-4 text-green-500" />
              <XCircle v-else-if="slugCheckState === 'unavailable'" class="h-4 w-4 text-destructive" />
            </div>
          </div>
        </FormControl>
        <FormDescription>
          This will be used in your project's URL: shipwait.com/p/{{ values.slug || 'your-slug' }}
        </FormDescription>
        <FormMessage />
        <div v-if="slugCheckState === 'unavailable' && suggestedSlug" class="text-sm text-muted-foreground mt-1">
          The slug is already taken. We suggest: <strong>{{ suggestedSlug }}</strong>
        </div>
      </FormItem>
    </FormField>

    <div class="flex items-center justify-between">
      <Button type="button" variant="outline" @click="updateSlugFromName" :disabled="!values.name">
        Generate slug from name
      </Button>

      <Button type="submit">
        Update project
      </Button>
    </div>
  </form>

  <!-- Confirmation Dialog -->
  <AlertDialog v-model:open="showConfirmDialog">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Project URL Change</AlertDialogTitle>
        <AlertDialogDescription class="space-y-3">
          <p>
            You're about to change your project's slug from
            <code class="bg-muted px-1 py-0.5 rounded text-sm">{{ originalSlug }}</code>
            to
            <code class="bg-muted px-1 py-0.5 rounded text-sm">{{ pendingFormData?.slug }}</code>.
          </p>
          <p>
            <strong>This will change your project's public URL:</strong>
          </p>
          <div class="bg-muted p-3 rounded-md text-sm">
            <div class="text-muted-foreground line-through">
              https://shipwait.com/p/{{ originalSlug }}
            </div>
            <div class="text-foreground font-medium">
              https://shipwait.com/p/{{ pendingFormData?.slug }}
            </div>
          </div>
          <p class="text-sm">
            <strong>Important:</strong> If you've already shared the old URL,
            it will no longer work. Make sure to update any links you've shared.
          </p>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="cancelUpdate">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction @click="confirmUpdate">
          Continue with change
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>