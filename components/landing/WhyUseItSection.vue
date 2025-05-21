<script setup lang="ts">
import { BarChart3, CheckCircle2, LayoutTemplate, Paintbrush, Rocket, Users } from 'lucide-vue-next';

// Component that explains why users should choose ShipWait
</script>

<template>
  <section class="py-20 bg-muted/30">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold sm:text-4xl mb-3 ">
            Why use <span class="gradient">ShipWait</span>
          </h2>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            Validate ideas before you spend months building something nobody wants
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mt-12">
          <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
            <div class="rounded-full bg-primary/10 p-4 mb-4">
              <Rocket class="text-primary size-7" />
            </div>
            <h3 class="text-xl font-bold mb-2">Launch in Minutes</h3>
            <p class="text-muted-foreground">Create a beautiful landing page with a single line of code. No development skills needed.</p>
          </div>

          <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
            <div class="rounded-full bg-primary/10 p-4 mb-4">
              <BarChart3 class="text-primary size-7" />
            </div>
            <h3 class="text-xl font-bold mb-2">Track Conversions</h3>
            <p class="text-muted-foreground">Get real-time insights into how many visitors sign up. Validate your idea with real data.</p>
          </div>

          <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
            <div class="rounded-full bg-primary/10 p-4 mb-4">
              <Users class="text-primary size-7" />
            </div>
            <h3 class="text-xl font-bold mb-2">Grow Your Audience</h3>
            <p class="text-muted-foreground">Collect emails before you even have a product. Start building your community from day one.</p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mt-8">
          <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
            <div class="rounded-full bg-primary/10 p-4 mb-4">
              <LayoutTemplate class="text-primary size-7" />
            </div>
            <h3 class="text-xl font-bold mb-2">Multiple Landing Templates</h3>
            <p class="text-muted-foreground">Choose from a variety of professional templates designed to convert. Pick the one that fits your project's style.</p>
          </div>

          <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
            <div class="rounded-full bg-primary/10 p-4 mb-4">
              <Paintbrush class="text-primary size-7" />
            </div>
            <h3 class="text-xl font-bold mb-2">Custom Branding</h3>
            <p class="text-muted-foreground">Fully customize your waitlist with HTML editor. Match your brand perfectly and create a seamless experience for visitors.</p>
          </div>

          <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
            <div class="rounded-full bg-primary/10 p-4 mb-4">
              <CheckCircle2 class="text-primary size-7" />
            </div>
            <h3 class="text-xl font-bold mb-2">Fast Validation</h3>
            <p class="text-muted-foreground">Test multiple ideas quickly. Double down on what works. Save months of wasted development time.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
