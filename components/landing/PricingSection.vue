<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PriceType = {
  free: number;
  pro: number;
  ultimate: number;
};

defineProps<{
  prices: {
    monthly: PriceType;
    yearly: PriceType;
  };
  billingCycle: 'monthly' | 'yearly';
}>();

defineEmits<{
  (e: 'update:billingCycle', value: 'monthly' | 'yearly'): void;
}>();
</script>

<template>
  <section class="py-24">
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
          <Tabs v-model="billingCycle" class="w-[250px]" @update:modelValue="(val) => $emit('update:billingCycle', val)">
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
              <span v-else class="text-xs text-primary font-medium cursor-pointer hover:underline" @click="$emit('update:billingCycle', 'yearly')">
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
              <span v-else class="text-xs text-primary font-medium cursor-pointer hover:underline" @click="$emit('update:billingCycle', 'yearly')">
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
  </section>
</template>
