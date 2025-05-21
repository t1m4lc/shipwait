<script setup lang="ts">
import { Button } from "@/components/ui/button";
</script>

<template>
  <section class="py-20 border-y">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class=" text-3xl font-bold sm:text-4xl mb-6">
          Ready to validate your idea?
        </h2>
        <p class="text-muted-foreground text-xl mb-10">
          Join makers who are shipping faster and smarter with ShipWait.
        </p>
        <Button size="lg" class="text-lg" as-child>
          <NuxtLink to="/register" class="inline-flex items-center justify-center">
            Start now
            <span class="relative flex size-2 ml-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75">
              </span>
              <span class="relative inline-flex size-2 rounded-full bg-green-500"></span>
            </span>
          </NuxtLink>
        </Button>
      </div>
    </div>
  </section>
</template>
