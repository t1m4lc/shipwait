<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
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
  domain: z.string({
      required_error: 'Required.',
    }),
}))

const store = useProjectsStore();
const {selectedProject} = storeToRefs(store)

const { handleSubmit } = useForm({
  validationSchema: generalFormSchema,
  initialValues: {
    name: selectedProject.value?.name || '',
    domain: selectedProject.value?.domain || '',
  },
})

const onSubmit = handleSubmit(() => {
  toast('Updated successfully!', {
    description: 'The general project settings have been saved.',
  });
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