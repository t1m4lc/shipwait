<script setup lang="ts">
import { Button } from "@/components/ui/button";

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="container mx-auto px-4 py-16 md:px-6 md:py-24">
    <div class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
      <h1 class="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Launch in <span class="gradient">5 minutes</span>
      </h1>
      <p class="max-w-3xl text-muted-foreground sm:text-2xl">
        Publish your next idea and start collecting feedback as you build.
      </p>
      <div class="flex flex-col gap-4 sm:flex-row pt-10">
        <Button size="lg" as-child class="bg-primary hover:bg-primary/90 text-lg">
          <NuxtLink to="/register" class="inline-flex items-center justify-center">
            Start Building For Free
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
          <div class="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl border">
            <iframe class="h-full w-full object-cover" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
          </div>
          <p class="mt-4 text-center text-muted-foreground text-sm sm:text-lg">
            Watch how easy it is to set up your waitlist and start collecting emails in minutes.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
