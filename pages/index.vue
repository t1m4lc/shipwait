<script setup lang="ts">
import { useSeo } from "~/composables/useSeo";
import { generateLandingPageStructuredData } from "~/composables/useStructuredData";

import CtaSection from "~/components/landing/CtaSection.vue";
import FaqSection from "~/components/landing/FaqSection.vue";
import HeroSection from "~/components/landing/HeroSection.vue";
import LaunchAlert from "~/components/landing/LaunchAlert.vue";
import PricingSection from "~/components/landing/PricingSection.vue";
import TestimonialsSection from "~/components/landing/TestimonialsSection.vue";
import WhyUseItSection from "~/components/landing/WhyUseItSection.vue";

definePageMeta({
  layout: 'landing'
});


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
    answer: "Exporting your email list as a CSV is available on Pro plan. Upgrade anytime to unlock this feature and easily import your waitlist into your favorite email marketing tool."
  },
  {
    question: "What happens after I collect emails?",
    answer: "You'll have access to a dashboard where you can view all collected emails, send updates to your waitlist, and track conversion metrics. When you're ready to launch, you can notify everyone with just one click."
  }
];

useSeo({
  title: 'ShipWait - Validate Your Ideas Before Building Them',
  description: 'Create landing pages and collect emails in minutes. Test your ideas and build only what people want. Start validating your startup ideas today with ShipWait\'s simple waitlist builder.',
  keywords: [
    'landing page builder',
    'email collection',
    'startup validation',
    'waitlist builder',
    'idea validation',
    'product launch',
    'email marketing',
    'lead generation',
    'MVP validation',
    'pre-launch marketing',
    'startup tools',
    'no-code builder'
  ]
});

// Enhanced structured data for better search visibility
const structuredData = generateLandingPageStructuredData();
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData)
    }
  ]
});

const testimonials = [
  {
    name: "Alex Johnson",
    handle: "@alexbuilds",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "Finally! I've been looking for a simple way to validate ideas before building. Can't wait to try ShipWait for my next launch! 🚀",
    date: "2d ago"
  },
  {
    name: "Sarah Chen",
    handle: "@sarahcodes",
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "This is exactly what I need for my pre-launch strategy. Building anticipation before launching has always been a challenge for solo founders.",
    date: "1w ago"
  },
  {
    name: "Mike Rivera",
    handle: "@mikebuilds",
    avatar: "https://i.pravatar.cc/150?img=11",
    text: "Love the concept! I've wasted so much time building features nobody wanted. ShipWait could have saved me months of development time.",
    date: "3d ago"
  }
];
</script>

<template>
  <HeroSection />
  <WhyUseItSection class="bg-muted/30" />
  <FaqSection :faqs="faqs" />
  <TestimonialsSection class="bg-muted/30" :testimonials="testimonials" />
  <PricingSection :showHeading="true" />
  <CtaSection class="bg-muted/80" />
  <LaunchAlert />
</template>
