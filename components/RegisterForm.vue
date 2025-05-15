<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const zodRegisterFormSchema = z.object({
  email: z.string({ required_error: 'Email is required' })
    .min(1, { message: 'Field is required' })
    .email('Enter a valid email.'),
  password: z.string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
})

const registerFormSchema = toTypedSchema(zodRegisterFormSchema)

type RegisterFormValues = z.infer<typeof zodRegisterFormSchema>

const { handleSubmit, validate } = useForm<RegisterFormValues>({
  validationSchema: registerFormSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const client = useSupabaseClient()
const runtime = useRuntimeConfig()

const onSubmit = handleSubmit(async (values: RegisterFormValues, ctx) => {
  const { valid } = await validate()

  if (!valid) {
    toast.error('Please check your input and try again')
    return
  }

  const emailRedirectTo = `${runtime.public.baseUrl}/welcome`

  console.log('emailRedirectTo', emailRedirectTo);


  try {
    const { data, error } = await client.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo }
    })

    if (error) {
      toast.error(error.message || 'Failed to register. Please try again.')
      return
    }

    if (data.user) {
      ctx.resetForm()
      toast.success('Registration successful! Please check your email and click the verification link to activate your account.')
    }
  } catch (e) {
    toast.error('An unexpected error occurred. Please try again later.')
  }
})
</script>

<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type=" text" placeholder="Enter your email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" placeholder="Create a password" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="w-full">
      <Button class="w-full" size="lg" type="submit" @keydown.enter="handleSubmit">
        Let's go!
      </Button>
    </div>
  </form>
</template>