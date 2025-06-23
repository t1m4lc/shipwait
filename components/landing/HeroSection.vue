<script setup lang="ts">
import { Button } from "@/components/ui/button";

</script>

<template>
  <section class="container mx-auto px-4 py-16 md:px-6 md:py-30">
    <div class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
      <h1 class="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Launch in <span class="gradient-text">minutes</span>, not days
      </h1>
      <p class="max-w-3xl text-muted-foreground sm:text-2xl">
        Create a customizable landing page and start collecting emails.
      </p>
      <div class="flex flex-col gap-4 sm:flex-row pt-10">
        <Button size="lg" as-child class="bg-primary hover:bg-primary/90 text-lg">
          <NuxtLink to="/register" class="inline-flex items-center justify-center">
            Start for Free
          </NuxtLink>
        </Button>
        <Button size="lg" variant="outline" class="text-lg hidden lg:block">
          See How It Works
        </Button>
      </div>
    </div>

    <div class="mt-16 md:mt-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-6xl">
          <!-- <div v-motion-fade class="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl border">
            <iframe class="size-full aspect-video object-cover" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
          </div> -->
          <div v-motion-fade class="group relative aspect-video w-full overflow-hidden rounded-lg shadow-xl border flex items-center justify-center bg-gradient-to-br from-muted to-background">
            <div class="flex flex-col items-center justify-center w-full h-full">
              <svg class="mx-auto mb-4 text-muted-foreground" width="64" height="64" fill="none" viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="16" fill="currentColor" fill-opacity="0.08" />
                <path d="M26 22v20l16-10-16-10z" fill="currentColor" fill-opacity="0.2" />
                <path d="M26 22v20l16-10-16-10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              </svg>
              <span class="text-muted-foreground text-lg font-medium">
                Tutorial screencast coming soon
              </span>
              <span class="text-muted-foreground text-sm mt-1">
                This section will feature a step-by-step video walkthrough.
              </span>
            </div>
          </div>
          <p class="mt-4 text-center text-muted-foreground text-sm sm:text-lg">
            Watch how easy it is to set up your waitlist and start collecting emails in minutes.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
