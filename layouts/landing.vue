<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-6xl flex h-16 items-center justify-between">
          <div class="flex items-center gap-2 font-medium">
            <NuxtLink to="/" class="flex items-center gap-2">
              <span class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                S</span>
              ShipWait
            </NuxtLink>
          </div>

          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/pricing" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </NuxtLink>
          </nav>

          <Button variant="outline" as-child>
            <NuxtLink v-if="user" to="/dashboard" class="inline-flex h-9 items-center justify-center">
              Dashboard
            </NuxtLink>
            <NuxtLink v-else to="/register" class="inline-flex h-9 items-center justify-center">
              Get Started
            </NuxtLink>
          </Button>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer>
      <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl">
        <p class="text-center text-sm text-muted-foreground mt-4 md:mt-0">
          © 2025 ShipWait. All rights reserved.
        </p>
        <nav class="flex flex-wrap gap-6 items-center text-sm">
          <NuxtLink :to="INSIGHTO" class="text-muted-foreground hover:text-foreground">Feedback</NuxtLink>
          <NuxtLink to="/privacy" class="text-muted-foreground hover:text-foreground">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="text-muted-foreground hover:text-foreground">Terms</NuxtLink>
          <NuxtLink :to="SOCIAL_X" class="text-muted-foreground hover:text-foreground">Contact</NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { INSIGHTO, SOCIAL_X } from "~/stores/constants";

const user = useSupabaseUser();
</script>
