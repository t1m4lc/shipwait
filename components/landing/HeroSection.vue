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
      </div>
    </div>

    <div class="mt-16 md:mt-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-6xl">
          <div v-motion-fade class="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl border">
            <iframe class="size-full aspect-video object-cover" src="https://www.tella.tv/video/cmc980mco000h0bl5hex1byjh/embed?b=1&title=0&a=1&loop=1&t=0&muted=0&wt=1" allowfullscreen allowtransparency></iframe>
          </div>

          <p class="mt-4 text-center text-muted-foreground text-sm sm:text-lg">
            Watch how easy it is to set up your landing page and start collecting emails in minutes.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
