<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useSeo } from "~/composables/useSeo";
import { useFaqSchema, useOrganizationSchema } from "~/composables/useStructuredData";

// Import landing components
import CtaSection from "~/components/landing/CtaSection.vue";
import FaqSection from "~/components/landing/FaqSection.vue";
import HeroSection from "~/components/landing/HeroSection.vue";
import TestimonialsSection from "~/components/landing/TestimonialsSection.vue";
import WhyUseItSection from "~/components/landing/WhyUseItSection.vue";

const user = useSupabaseUser();
const prices = {
  monthly: {
    free: 0,
    pro: 9,
    ultimate: 49,
  },
  yearly: {
    free: 0,
    pro: 5,
    ultimate: 29,
  },
};

type BillingCycle = keyof typeof prices;
const billingCycle = ref<BillingCycle>("yearly"); // Default to yearly billing

// FAQs data
const faqs = [
  {
    question: "How does ShipWait help me validate my idea?",
    answer: "ShipWait lets you create a landing page and start collecting emails in minutes, so you can gauge interest in your product before you build it. This way, you can validate your idea with real users and build only what people want."
  },
  {
    question: "Do I need technical skills to use ShipWait?",
    answer: "Not at all. ShipWait is designed to be extremely user-friendly. If you can copy and paste a line of code, you can use ShipWait. The platform handles all the technical aspects for you."
  },
  {
    question: "How do I embed the waitlist on my website?",
    answer: "Simply copy the single line of code we provide and paste it into your website's HTML. Our script will automatically create a beautiful, customizable waitlist form that matches your brand."
  },
  {
    question: "Can I export my waitlist emails?",
    answer: "Yes! You can export your email list at any time in CSV format, making it easy to import into your favorite email marketing tool when you're ready to launch."
  },
  {
    question: "What happens after I collect emails?",
    answer: "You'll have access to a dashboard where you can view all collected emails, send updates to your waitlist, and track conversion metrics. When you're ready to launch, you can notify everyone with just one click."
  }
];

useSeo({
  title: 'ShipWait - Validate Your Ideas Before Building Them',
  description: 'Create landing pages and collect emails in minutes. Test your ideas and build only what people want.'
});

useOrganizationSchema();
useFaqSchema(faqs);

const testimonials = [
  {
    name: "Alex Johnson",
    handle: "@alexbuilds",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "Started collecting emails for my SaaS idea last night. Woke up to 43 signups! ShipWait made this stupidly simple. 🚀",
    date: "2d ago"
  },
  {
    name: "Sarah Chen",
    handle: "@sarahcodes",
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "Finally validated my course idea without writing a single line of code. ShipWait is the tool I've been looking for all this time.",
    date: "1w ago"
  },
  {
    name: "Mike Rivera",
    handle: "@mikebuilds",
    avatar: "https://i.pravatar.cc/150?img=11",
    text: "Made $4.2K in pre-sales from a landing page I set up in 10 minutes with ShipWait. Ship first, build later!",
    date: "3d ago"
  },
  {
    name: "Emma Lewis",
    handle: "@emmafounder",
    avatar: "https://i.pravatar.cc/150?img=9",
    text: "Used ShipWait to test 3 different ideas in a weekend. Found my winner and saved months of development time. Game changer!",
    date: "5d ago"
  },
  {
    name: "Jamal Thompson",
    handle: "@jamalmakes",
    avatar: "https://i.pravatar.cc/150?img=8",
    text: "My waitlist hit 500 signups in 48 hours. The conversion rate blew my mind. This tool pays for itself instantly.",
    date: "2w ago"
  },
  {
    name: "Lisa Wong",
    handle: "@lisaproduct",
    avatar: "https://i.pravatar.cc/150?img=7",
    text: "As a non-technical founder, ShipWait has been a lifesaver. Launched my MVP without hiring a developer. Highly recommended!",
    date: "1w ago"
  }
];
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-6xl flex h-16 items-center justify-between">
          <div class="flex items-center gap-2 font-medium">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              S</span>
            ShipWait
          </div>
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

      <HeroSection />
      <TestimonialsSection class="bg-muted/30" :testimonials="testimonials" />

      <!-- <HowItWorksSection class="bg-muted/30" />
      <PricingSection 
      :prices="prices" 
      v-model:billing-cycle="billingCycle" 
      /> -->
      <FaqSection :faqs="faqs" />
      <WhyUseItSection class="bg-muted/30" />
      <CtaSection class="bg-muted/80" />
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
