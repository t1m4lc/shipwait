<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

import { useSeo } from "~/composables/useSeo";

// Apply SEO optimization for registration page
useSeo({
  title: 'Sign Up - ShipWait',
  description: 'Create your ShipWait account to start validating your ideas with landing pages and email collections.',
  robots: 'index, follow',
  type: 'website'
});
</script>


<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <NuxtLink to="/" class="flex items-center gap-2 font-medium">
          <span class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            S</span>
          ShipWait
        </NuxtLink>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <div class="text-center pb-12">
            <h1 class="text-2xl font-bold">
              Create an account
            </h1>
          </div>
          <RegisterForm />
          <div class="text-center text-xs mt-4">
            Already have an account?
            <NuxtLink to="login" class="underline underline-offset-4">
              Login
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
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
    <div class="relative hidden bg-muted lg:block dark:brightness-[0.2] dark:grayscale">
      <NuxtImg src="img/register.jpg" class="absolute inset-0 h-full w-full object-cover object-top" />
    </div>
  </div>
</template>
