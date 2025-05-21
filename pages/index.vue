<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

// Testimonial data
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
      <!-- Hero Section -->
      <section class="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
          <!-- <div class="flex items-center gap-2 rounded-full bg-muted px-4 py-1 text-sm font-medium">
            <span class="text-xs font-semibold uppercase tracking-wider text-primary">Just Launched</span>
            <div class="h-4 w-px bg-muted-foreground/30"></div>
            <span class="text-sm">100+ makers already using ShipWait</span>
          </div> -->
          <h1 class="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Launch in 5 Minutes</h1>
          <p class="max-w-[42rem] text-muted-foreground sm:text-xl">
            Publish a landing page now and gather feedback while you build.
          </p>
          <div class="flex flex-col gap-4 sm:flex-row pt-10">
            <Button size="lg" as-child class="bg-primary hover:bg-primary/90 text-lg">
              <NuxtLink to="/register" class="inline-flex items-center justify-center">
                Start Building For Free
              </NuxtLink>
            </Button>
            <Button size="lg" variant="outline" class="text-lg">
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

      <!-- Why Use ShipWait Section -->
      <section class="py-20 bg-muted/30">
        <div class="container mx-auto px-4 md:px-6">
          <div class="mx-auto max-w-6xl">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold sm:text-4xl mb-3">
                Why Use ShipWait?
              </h2>
              <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
                The smart way to validate ideas before you spend months building something nobody wants
              </p>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mt-12">
              <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div class="rounded-full bg-primary/10 p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary h-8 w-8">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Launch in Minutes</h3>
                <p class="text-muted-foreground">Create a beautiful landing page with a single line of code. No development skills needed.</p>
              </div>

              <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div class="rounded-full bg-primary/10 p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary h-8 w-8">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Track Conversions</h3>
                <p class="text-muted-foreground">Get real-time insights into how many visitors sign up. Validate your idea with real data.</p>
              </div>

              <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div class="rounded-full bg-primary/10 p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary h-8 w-8">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Grow Your Audience</h3>
                <p class="text-muted-foreground">Collect emails before you even have a product. Start building your community from day one.</p>
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mt-8">
              <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div class="rounded-full bg-primary/10 p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary h-8 w-8">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"></path>
                    <path d="M16 8 2 22"></path>
                    <path d="m17.5 15 2-2"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Multiple Landing Templates</h3>
                <p class="text-muted-foreground">Choose from a variety of professional templates designed to convert. Pick the one that fits your project's style.</p>
              </div>

              <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div class="rounded-full bg-primary/10 p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary h-8 w-8">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Custom Branding</h3>
                <p class="text-muted-foreground">Fully customize your waitlist with HTML editor. Match your brand perfectly and create a seamless experience for visitors.</p>
              </div>

              <div class="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
                <div class="rounded-full bg-primary/10 p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary h-8 w-8">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Fast Validation</h3>
                <p class="text-muted-foreground">Test multiple ideas quickly. Double down on what works. Save months of wasted development time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-24">
        <div class="container mx-auto px-4 md:px-6">
          <div class="mx-auto max-w-6xl">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold sm:text-4xl mb-3">
                Loved by Indie Makers
              </h2>
              <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
                Here's what our users say about ShipWait
              </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(testimonial, i) in testimonials" :key="i" class="bg-background rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-4">
                  <Avatar class="h-10 w-10 border">
                    <AvatarImage :src="testimonial.avatar" :alt="testimonial.name" />
                    <AvatarFallback>{{ testimonial.name.charAt(0) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium">{{ testimonial.name }}</div>
                    <div class="text-sm text-muted-foreground">{{ testimonial.handle }}</div>
                  </div>
                </div>
                <p class="mb-3">{{ testimonial.text }}</p>
                <div class="text-xs text-muted-foreground">{{ testimonial.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- <section class="py-24 bg-muted/30">
        <div class="container mx-auto px-4 md:px-6">
          <div class="mx-auto max-w-6xl">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold sm:text-4xl mb-3">
                Simple, Transparent Pricing
              </h2>
              <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the plan that fits your needs. Start free, upgrade as you grow.
              </p>
            </div>

            <div class="flex justify-center mb-8">
              <Tabs v-model="billingCycle" class="w-[250px]">
                <TabsList class="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
              <Card class="shadow-md">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Perfect for testing your first idea</CardDescription>
                  <div class="mt-4 flex items-baseline">
                    <span class="text-4xl font-bold">€{{ prices[billingCycle]['free'] }}</span>
                    <span class="ml-1 text-muted-foreground">/forever</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-3 text-sm">
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      1 project
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      1 landing page template
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      1 page
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Unlimited emails
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      "Built with ShipWait" badge on page
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button class="w-full" variant="outline" as-child>
                    <NuxtLink to="/register" class="inline-flex h-9 w-full items-center justify-center">
                      Get Started Free
                    </NuxtLink>
                  </Button>
                </CardFooter>
              </Card>

              <Card class="shadow-md border-primary relative">
                <div class="absolute -top-3 left-0 right-0 flex justify-center">
                  <span class="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                    MOST POPULAR
                  </span>
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious makers and startups</CardDescription>
                  <div class="mt-4 flex items-baseline">
                    <span class="text-4xl font-bold">€{{ prices[billingCycle]['pro'] }}</span>
                    <span class="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <span v-if="billingCycle === 'yearly'" class="text-xs text-green-600 font-medium">
                    You're saving 40% with yearly billing!
                  </span>
                  <span v-else class="text-xs text-primary font-medium cursor-pointer hover:underline" @click="billingCycle = 'yearly'">
                    👉 Save 40% with yearly plan
                  </span>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-3 text-sm">
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <strong>Unlimited</strong> projects
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <strong>Unlimited</strong> templates
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      1 page per project
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <strong>Unlimited</strong> emails
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      No "Built with ShipWait" badge
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button class="w-full" as-child>
                    <NuxtLink to="/register?plan=pro" class="inline-flex h-9 w-full items-center justify-center">
                      Get Started
                    </NuxtLink>
                  </Button>
                </CardFooter>
              </Card>


              <Card class="shadow-md">
                <CardHeader>
                  <CardTitle>Ultimate</CardTitle>
                  <CardDescription>For power users and growing businesses</CardDescription>
                  <div class="mt-4 flex items-baseline">
                    <span class="text-4xl font-bold">€{{ prices[billingCycle]['ultimate'] }}</span>
                    <span class="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <span v-if="billingCycle === 'yearly'" class="text-xs text-green-600 font-medium">
                    You're saving 40% with yearly billing!
                  </span>
                  <span v-else class="text-xs text-primary font-medium cursor-pointer hover:underline" @click="billingCycle = 'yearly'">
                    👉 Save 40% with yearly plan
                  </span>
                </CardHeader>
                <CardContent>
                  <ul class="space-y-3 text-sm">
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Everything in Pro</span>
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <strong>Unlimited</strong> pages
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      AI-generated landing pages
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Priority support
                    </li>
                    <li class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 text-primary">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Advanced analytics
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button class="w-full" variant="outline" as-child>
                    <NuxtLink to="/register?plan=ultimate" class="inline-flex h-9 w-full items-center justify-center">
                      Get Started
                    </NuxtLink>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section> -->

      <!-- FAQ Section -->
      <section class="py-24">
        <div class="container mx-auto px-4 md:px-6">
          <div class="mx-auto max-w-3xl">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold sm:text-4xl mb-3">
                Frequently Asked Questions
              </h2>
              <p class="text-muted-foreground">
                Everything you need to know about ShipWait
              </p>
            </div>

            <Accordion type="single" collapsible class="w-full">
              <AccordionItem v-for="(faq, i) in faqs" :key="i" :value="`item-${i}`">
                <AccordionTrigger class="text-lg font-medium">{{ faq.question }}</AccordionTrigger>
                <AccordionContent>
                  <p class="text-muted-foreground">{{ faq.answer }}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-20 bg-primary/5 border-y">
        <div class="container mx-auto px-4 md:px-6">
          <div class="mx-auto max-w-3xl text-center">
            <h2 class="text-3xl font-bold sm:text-4xl mb-6">
              Ready to validate your idea?
            </h2>
            <p class="text-muted-foreground text-xl mb-10">
              Join hundreds of makers who are shipping faster and smarter with ShipWait.
            </p>
            <Button size="lg" class="text-lg" as-child>
              <NuxtLink to="/register" class="inline-flex items-center justify-center">
                Ship now
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
    </main>
    <footer class="border-t bg-background">
      <div class="container mx-auto px-4 py-10 md:py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-semibold text-sm mb-3">Product</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/features" class="text-sm text-muted-foreground hover:text-foreground">Features</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/pricing" class="text-sm text-muted-foreground hover:text-foreground">Pricing</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/roadmap" class="text-sm text-muted-foreground hover:text-foreground">Roadmap</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/changelog" class="text-sm text-muted-foreground hover:text-foreground">Changelog</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-sm mb-3">Resources</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/docs" class="text-sm text-muted-foreground hover:text-foreground">Documentation</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/tutorials" class="text-sm text-muted-foreground hover:text-foreground">Tutorials</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/examples" class="text-sm text-muted-foreground hover:text-foreground">Examples</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/blog" class="text-sm text-muted-foreground hover:text-foreground">Blog</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-sm mb-3">Company</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/about" class="text-sm text-muted-foreground hover:text-foreground">About</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-sm text-muted-foreground hover:text-foreground">Contact</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/jobs" class="text-sm text-muted-foreground hover:text-foreground">Jobs</NuxtLink>
              </li>
              <li><a href="https://twitter.com" target="_blank" class="text-sm text-muted-foreground hover:text-foreground">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-sm mb-3">Legal</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/privacy" class="text-sm text-muted-foreground hover:text-foreground">Privacy</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/terms" class="text-sm text-muted-foreground hover:text-foreground">Terms</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/cookies" class="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center gap-2 font-medium mb-4 md:mb-0">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">S</span>
            ShipWait
          </div>
          <p class="text-center text-sm text-muted-foreground">
            © 2025 ShipWait. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
