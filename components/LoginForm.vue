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
    // Check for redirect parameter
    const route = useRoute();
    const redirectTo = route.query.redirect as string;

    if (redirectTo && redirectTo.startsWith('/')) {
      navigateTo(redirectTo);
    } else {
      navigateTo('/dashboard');
    }
  }
})

const login = useGoogleOAuth().loginWithGoogle

</script>

<template>
  <form class="space-y-8" @submit.prevent="onSubmit">
    <div class="grid gap-6">
      <div class="flex flex-col gap-4">
        <Button @click="login" variant="outline" class="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
          </svg>
          Login with Google
        </Button>
      </div>
      <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span class="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>

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