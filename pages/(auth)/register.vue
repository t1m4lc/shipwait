<script lang="ts">
export const description = 'A two column login page with a cover image.'

definePageMeta({
  layout: 'blank',
})
</script>


<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <NuxtLink to="/" class="flex items-center gap-2 font-medium">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
X          </div>
          Waitly.dev
        </NuxtLink>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <RegisterForm />
        </div>
      </div>
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
    <div class="relative hidden bg-muted lg:block">
      <img
        src="/"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      >
    </div>
  </div>
</template>
