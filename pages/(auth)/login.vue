<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <NuxtLink to="/" class="flex items-center gap-2 self-center font-medium">
        <div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
W        </div>
        Waitly.dev
      </NuxtLink>
      
      <div class="flex flex-col gap-6">
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-xl">
              Welcome back
            </CardTitle>
            <CardDescription>
              Login with your email and password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

          </CardContent>
        </Card>
        <div
          class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking and continue, you agree to our
          <NuxtLink to="terms">
            Terms of Service
          </NuxtLink>
          and
          <NuxtLink to="privacy">
            Privacy Policy
          </NuxtLink>
          .
        </div>
      </div>

    </div>
  </div>
</template>


