<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import type { Database, Tables } from '~/types/supabase'

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
  domain: z.string({
    required_error: 'Required.',
  })
    .regex(
      domainRegex,
      { message: 'Must be a valid domain (e.g., example.com).' }
    ),
}))


const store = useProjectsStore();
const { selectedProject } = storeToRefs(store)

const { handleSubmit } = useForm({
  validationSchema: generalFormSchema,
  initialValues: {
    name: selectedProject.value?.name || '',
    domain: selectedProject.value?.domain || '',
  },
})

const client = useSupabaseClient<Database>()

const updateProject = async (id: string, payload: Partial<Tables<'projects'>>) => {
  const { error } = await client
    .from('projects')
    .update(payload)
    .eq('id', id)

  return { error }
}

const onSubmit = handleSubmit(async (payload) => {
  const { error } = await updateProject(selectedProject.value!.id, payload)

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

    <FormField v-slot="{ componentField }" name="domain">
      <FormItem>
        <FormLabel>Site domain</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Type a domain" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Enter the domain name where your code snippet will be used (e.g., example.com).
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