<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-vue-next";

defineProps<{
  showHeading?: boolean;
}>();

const billingCycle = ref<'monthly' | 'yearly'>('yearly');

const prices = {
  monthly: {
    free: 0,
    pro: 7
  },
  yearly: {
    free: 0,
    pro: 3.5
  },
  lifetime: 79
};

const saving = computed(() => {

  return Math.round((1 - prices.yearly.pro / prices.monthly.pro) * 100)
});


</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-6xl">
        <div v-if="showHeading" class="text-center mb-12">
          <h2 class="text-3xl font-bold sm:text-4xl mb-3">
            Simple, Transparent Pricing
          </h2>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free, upgrade as you grow.
          </p>
        </div>

        <div class="flex justify-center mb-8">
          <div class="text-center space-y-4">
            <Tabs v-model="billingCycle" class="w-[280px]">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" class="relative">
                  Yearly
                  <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    Save {{ saving }}%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <Card class="shadow-md flex flex-col">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for testing your first idea</CardDescription>
              <div class="mt-4 flex items-baseline">
                <span class="text-4xl font-bold">€{{ prices[billingCycle]['free'] }}</span>
                <span class="ml-1 text-muted-foreground">/forever</span>
              </div>
            </CardHeader>
            <CardContent class="flex-grow">
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-muted-foreground" />
                  <span class="text-muted-foreground">1 project <span class="text-xs">(vs unlimited in Pro)</span></span>
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-muted-foreground" />
                  <span class="text-muted-foreground">1 landing page template <span class="text-xs">(vs unlimited in Pro)</span></span>
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  1 page
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  Unlimited emails
                </li>
                <li class="flex items-center gap-1">
                  <X class="mr-2 h-4 w-4 text-red-500" />
                  <span class="text-muted-foreground">"Built with ShipWait" badge required</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter class="mt-auto">
              <Button class="w-full" variant="outline" as-child>
                <NuxtLink to="/register" class="inline-flex h-9 w-full items-center justify-center">
                  Get Started Free
                </NuxtLink>
              </Button>
            </CardFooter>
          </Card>

          <Card class="shadow-md border-primary relative flex flex-col">
            <div class="absolute -top-3 left-0 right-0 flex justify-center">
              <!-- <span class="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                MOST POPULAR
              </span> -->
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For serious makers and startups</CardDescription>
              <div class="mt-4 space-y-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold">€{{ prices[billingCycle]['pro'] }}</span>
                  <span class="ml-1 text-muted-foreground">/month</span>
                  <span v-if="billingCycle === 'yearly'" class="text-sm line-through text-muted-foreground">€{{ prices.monthly.pro }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="billingCycle === 'yearly'" class="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                    Save {{ saving }}% yearly
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {{ billingCycle === 'yearly' ? `€${prices.yearly.pro * 12}/year` : 'Billed monthly' }}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent class="flex-grow">
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  <span class="font-bold">Unlimited </span> projects
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  <span class="font-bold">Unlimited</span> templates
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  <span class="font-bold">Unlimited </span> emails
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  No branding, badge removed
                </li>
              </ul>
            </CardContent>
            <CardFooter class="mt-auto">
              <Button class="w-full" as-child>
                <NuxtLink to="/register?plan=pro" class="inline-flex h-9 w-full items-center justify-center">
                  Get Started
                </NuxtLink>
              </Button>
            </CardFooter>
          </Card>

          <Card class="shadow-md border-2 border-amber-400 relative flex flex-col">
            <div class="absolute -top-3 left-0 right-0 flex justify-center">
              <span class="bg-amber-400 text-amber-900 text-xs px-3 py-1 rounded-full font-medium">
                LIFETIME DEAL
              </span>
            </div>
            <CardHeader>
              <CardTitle>Lifetime Access</CardTitle>
              <CardDescription>Pay once, use forever</CardDescription>
              <div class="mt-4 space-y-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold">€ {{ prices.lifetime }}</span>
                  <span class="ml-1 text-muted-foreground">/lifetime</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                    No recurring fees
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent class="flex-grow">
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  <span>Everything in Pro</span>
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  Priority support
                </li>
                <li class="flex items-center gap-1">
                  <Check class="mr-2 h-4 w-4 text-primary" />
                  <span>Lifetime updates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter class="mt-auto">
              <Button class="w-full" as-child>
                <NuxtLink to="/register?plan=lifetime" class="inline-flex h-9 w-full items-center justify-center">
                  Get Lifetime Access
                </NuxtLink>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
