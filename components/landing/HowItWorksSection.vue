<script setup lang="ts">
import { Button } from "@/components/ui/button";

interface Step {
  number: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  alt: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Select a landing page template",
    description: "Choose from our collection of high-converting templates designed for waitlists and pre-launches.",
    features: ["Mobile-optimized designs", "Industry-specific templates"],
    image: "/img/step1-template.jpg",
    alt: "Select a landing page template"
  },
  {
    number: 2,
    title: "Make it yours",
    description: "Customize every element to match your brand and messaging.",
    features: ["HTML editor for advanced customization"],
    image: "/img/step2-customize.jpg",
    alt: "Customize your landing page"
  },
  {
    number: 3,
    title: "Set up submission behavior",
    description: "Configure what happens when users join your waitlist.",
    features: ["Custom thank you message", "Redirect to a page (payment pages, social link...)"],
    image: "/img/step3-behavior.jpg",
    alt: "Set up submission behavior"
  },
  {
    number: 4,
    title: "Ship and collect leads",
    description: "Publish instantly or embed on your site to start validating your idea immediately.",
    features: ["One-click publishing", "Embed on your existing site"],
    image: "/img/step4-ship.jpg",
    alt: "Ship your waitlist"
  }
];
</script>

<template>
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-5xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold sm:text-4xl mb-2">How <span class="gradient-text">ShipWait</span> works?</h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to validate your idea and start collecting leads in minutes
          </p>
        </div>

        <div class="space-y-16">
          <div v-for="(step, index) in steps" :key="`step-${step.number}`" class="flex flex-col md:flex-row gap-8 items-center">
            <div :class="[
              'w-full md:w-1/2 shadow-lg rounded-lg border overflow-hidden',
              index % 2 === 0 ? 'md:order-2' : 'md:order-1'
            ]">
              <NuxtImg :src="step.image" :alt="step.alt" width="400" height="300" class="w-full aspect-3/2 object-cover" format="webp" loading="lazy" />
            </div>
            <div :class="[
              'w-full md:w-1/2',
              index % 2 === 0 ? 'md:order-1' : 'md:order-2'
            ]">
              <div class="inline-flex items-center justify-center rounded-full bg-primary/10 h-9 w-9 mb-3">
                <span class="text-primary font-bold">{{ step.number }}</span>
              </div>
              <h3 class="text-xl font-bold mb-2">{{ step.title }}</h3>
              <p class="text-muted-foreground mb-3">{{ step.description }}</p>
              <ul class="space-y-1.5">
                <li v-for="feature in step.features" :key="feature" class="flex items-start">
                  <svg class="mr-2 h-5 w-5 text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-12 text-center">
          <Button size="lg" as-child class="bg-primary hover:bg-primary/90">
            <NuxtLink to="/register" class="inline-flex items-center justify-center">
              Get Started Now
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
