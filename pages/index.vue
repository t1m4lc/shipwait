<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <div class="flex text-xl items-center gap-2 font-semibold">
        <span class="font-bold">
          ShipWait
        </span>
      </div>
      <Button as-child>
        <NuxtLink to="/register" class="inline-flex h-9 items-center justify-center">
          Get Started
        </NuxtLink>
      </Button>
    </header>
    <main class="flex-1">
      <!-- Hero Section -->
      <section class="container space-y-16 md:space-y-28 mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h1 class="text-3xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl">
            Ship in 2 minutes with a waitlist
          </h1>
          <p class="max-w-[42rem] text-muted-foreground sm:text-xl">
            Embed one line of code. Start collecting emails. Launch before you build.
          </p>
          <div class="flex flex-col gap-3 min-[400px]:flex-row pt-10">
            <Button size="lg" as-child>
              <NuxtLink to="/register" class="inline-flex items-center justify-center">
                Get Started
              </NuxtLink>
            </Button>
            <Button size="lg" variant="outline">
              How it works?
            </Button>
          </div>
        </div>

        <div class="bg-white">
          <div class="container mx-auto px-4 md:px-6">
            <div class="mx-auto max-w-6xl">
              <div class="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl">
                <iframe class="h-full w-full object-cover" src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
                <!-- <video src="https://youtu.be/dQw4w9WgXcQ?si=_m6Wkcqgk2sn5vQ8" class="h-full w-full object-cover"
                  controls poster="https://placehold.co/600x400">
                  <source src="" type="video/mp4" />
                  Your browser does not support the video tag.
                </video> -->
              </div>
              <p class="mt-4 text-center text-muted-foreground">
                Watch how easy it is to set up your waitlist and start collecting emails in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24 bg-gray-50">
        <div class="container mx-auto px-4 md:px-6">
          <div class="mx-auto max-w-6xl">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
                Join Thousands of Builders
              </h2>
              <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
                Solopreneurs and indie makers around the world trust ShipWait to validate their ideas
              </p>
            </div>

            <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-3 justify-items-center">
              <div v-for="i in 24" :key="i" class="flex flex-col items-center">
                <Avatar class="size-14 md:size-16  shadow-sm hover:scale-110 transition-transform duration-200">
                  <AvatarImage :src="`https://i.pravatar.cc/150?img=${(i % 70) + 1}`" alt="User avatar" />
                  <AvatarFallback>{{ String.fromCharCode(65 + (i % 26)) }}</AvatarFallback>
                </Avatar>
                <span class="text-xs mt-2 font-medium">{{ ['Maker', 'Founder', 'Creator', 'Developer', 'Designer',
                  'Solopreneur', 'Hacker'][i %
                  7] }}</span>
              </div>
            </div>

            <div class="mt-16 text-center uppercase tracking-wider">
              <Button size="lg" as-child class="mx-auto">
                <NuxtLink to="/register" class="inline-flex items-center justify-center">
                  Ship now
                </NuxtLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
    <footer class="border-t bg-white">
      <div
        class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-10 md:h-24 md:flex-row md:py-0">
        <div class="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 ShipWait. All rights reserved.
          </p>
        </div>
        <div class="flex gap-4">
          <NuxtLink to="/terms" class="text-sm text-muted-foreground hover:underline">
            Terms
          </NuxtLink>
          <NuxtLink to="/privacy" class="text-sm text-muted-foreground hover:underline">
            Privacy
          </NuxtLink>
          <NuxtLink :to="SOCIAL_X" class="text-sm text-muted-foreground hover:underline">
            Contact
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
