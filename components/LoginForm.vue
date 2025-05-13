<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toast } from 'vue-sonner'

const loginFormSchema = toTypedSchema(z.object({
  email: z.string().min(1, { message: 'Field is required' }).email('Enter a valid email.'),
  password: z.string().min(1, { message: 'Field is required' }),
}))

const { handleSubmit } = useForm({
  validationSchema: loginFormSchema,
  initialValues: {
    email: '',
    password: '',
  },
})


const supabase = useSupabaseClient()

const onSubmit = handleSubmit(async (values, actions) => {
  const { error } = await supabase.auth.signInWithPassword(values)
  if (error) console.log(error)

  actions.resetForm();
});


// const onSubmit = handleSubmit(() => {
//   toast('Updated with success!', {
//     description: 'Project General updated.',
//     action: {
//       label: 'Undo',
//       onClick: () => console.log('Undo'),
//     },
//   });
// })
</script>

<template>

  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Type your email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>


    <div class="flex justify-start">
      <Button type="submit">
        Login
      </Button>
    </div>
  </form>
</template>