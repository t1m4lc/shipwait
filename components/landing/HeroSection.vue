<script setup lang="ts">
import { Button } from "@/components/ui/button";

</script>

<template>
  <section class="container mx-auto px-4 py-16 md:px-6 md:py-30" itemscope itemtype="https://schema.org/SoftwareApplication">
    <div class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
      <h1 class="text-3xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl" itemprop="name">
        Launch in <span class="gradient-text">minutes</span>, not days
      </h1>
      <p class="max-w-3xl text-muted-foreground sm:text-2xl" itemprop="description">
        Create a customizable landing page and start collecting emails. Validate your startup ideas before building them.
      </p>
      <div class="flex flex-col gap-4 sm:flex-row pt-10">
        <Button size="lg" as-child class="bg-primary hover:bg-primary/90 text-lg" itemprop="potentialAction" itemscope itemtype="https://schema.org/Action">
          <NuxtLink to="/register" class="inline-flex items-center justify-center" itemprop="target" aria-label="Start building your landing page for free">
            Start for Free
          </NuxtLink>
        </Button>
      </div>

      <!-- Trust signals for better conversion -->
      <div class="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>No credit card required</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Setup in under 5 minutes</span>
        </div>
      </div>
    </div>

    <div class="mt-16 md:mt-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-6xl">
          <div v-motion-fade class="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl border" itemprop="video" itemscope itemtype="https://schema.org/VideoObject">
            <iframe class="size-full aspect-video object-cover" src="https://www.tella.tv/video/cmc980mco000h0bl5hex1byjh/embed?b=1&title=0&a=1&loop=1&t=0&muted=1&wt=1" allowfullscreen allowtransparency title="ShipWait Demo - How to create a landing page in minutes" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <meta itemprop="name" content="ShipWait Demo - How to create a landing page in minutes" />
            <meta itemprop="description" content="Watch how easy it is to set up your landing page and start collecting emails in minutes with ShipWait." />
            <meta itemprop="thumbnailUrl" content="https://www.shipwait.com/img/video-thumbnail.jpg" />
            <meta itemprop="uploadDate" content="2024-12-01" />
          </div>

          <p class="mt-4 text-center text-muted-foreground text-sm sm:text-lg">
            Watch how easy it is to set up your landing page and start collecting emails in minutes.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
