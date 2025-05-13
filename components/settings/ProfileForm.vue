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
  email: z.string({
      required_error: 'Required.',
    }).email('Enter a valid email.'),
}))

const { handleSubmit } = useForm({
  validationSchema: generalFormSchema,
  initialValues: {
    name: '',
    email: '',
  },
})

const onSubmit = handleSubmit(() => {
  toast('Updated with success!', {
          description: 'Project General updated.',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        });
})
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Type your name" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Site email</FormLabel>
        <FormControl>
          <Input type="email" placeholder="Type your email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>


    <div class="flex justify-start">
      <Button type="submit">
        Update profile
      </Button>
    </div>
  </form>
</template>