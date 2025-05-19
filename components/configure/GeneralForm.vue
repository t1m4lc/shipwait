<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toast } from 'vue-sonner'

const generalFormSchema = toTypedSchema(z.object({
  name: z.string({
    required_error: 'Required.',
  })
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
}))

const store = useProjectsStore();
const { selectedProject } = storeToRefs(store)

const { handleSubmit } = useForm({
  validationSchema: generalFormSchema,
  initialValues: {
    name: selectedProject.value?.name || '',
  },
})

const onSubmit = handleSubmit(async (payload) => {
  // Use the store method instead of direct API call
  const { error } = await store.updateProjectData(selectedProject.value!.id, payload);

  if (!error) {
    toast('Updated successfully!', {
      description: 'The general project settings have been saved.',
    });
  } else {
    toast('Update failed', {
      description: error.message || 'An error occurred while updating the project.',
    });
  }
})

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

    <div class="flex justify-start">
      <Button type="submit">
        Update general
      </Button>
    </div>
  </form>
</template>