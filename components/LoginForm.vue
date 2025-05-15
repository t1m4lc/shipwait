<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const zodLoginFormSchema = z.object({
  email: z.string({ required_error: 'Email is required' })
    .min(1, { message: 'Field is required' })
    .email('Enter a valid email.'),
  password: z.string({ required_error: 'Password is required' })
    .min(1, { message: 'Field is required' }),
})

const loginFormSchema = toTypedSchema(zodLoginFormSchema)

type LoginFormValues = z.infer<typeof zodLoginFormSchema>

const { handleSubmit, validate } = useForm<LoginFormValues>({
  validationSchema: loginFormSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const client = useSupabaseClient()

const onSubmit = handleSubmit(async (values: LoginFormValues) => {
  const { valid } = await validate()

  if (!valid) {
    toast.error('Please check your input and try again')
    return
  }

  try {
    const { error } = await client.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })

    if (error) {
      toast.error(error.message || 'Failed to login. Please try again.')
    }
  } catch (e) {
    toast.error('An unexpected error occurred. Please try again later.')
  }
})

const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})
</script>

<template>
  <form class="space-y-8" @submit.prevent="onSubmit">
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
          <Input type="password" v-bind="componentField" placeholder="Type your password" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="w-full">
      <Button class="w-full" size="lg" type="submit" @keydown.enter="handleSubmit">
        Login
      </Button>
    </div>
  </form>
</template>