<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-4xl font-bold mb-6 text-center">Pricing Details</h1>
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
      This page will contain more detailed information about our pricing plans, features, and comparisons.
    </p>
    <div class="grid md:grid-cols-2 gap-8 mt-10">
      <div class="border p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-3">Monthly Plan Details</h2>
        <Button @click="handleSubscriptionAttempt(stripeMonthlyPriceId)" :disabled="isLoadingSubscriptionStatus">Subscribe Monthly</Button>
      </div>
      <div class="border p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-3">Yearly Plan Details</h2>
        <Button @click="handleSubscriptionAttempt(stripeYearlyPriceId)" :disabled="isLoadingSubscriptionStatus">Subscribe Yearly</Button>
      </div>
    </div>
    <div v-if="isLoadingSubscriptionStatus" class="text-center mt-4">Checking your subscription status...</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSubscriptionStore } from '~/stores/subscription.store';

const stripeMonthlyPriceId = ref(STRIPE_MONTHLY_PRICE_ID);
const stripeYearlyPriceId = ref(STRIPE_YEARLY_PRICE_ID);
const subscriptionStore = useSubscriptionStore();
const isUserActiveSubscriber = computed(() => subscriptionStore.isActive);
const isLoadingSubscriptionStatus = computed(() => subscriptionStore.isLoading);

useSeoMeta({
  title: 'Pricing Details - Shipwait',
  description: 'Detailed information about our flexible pricing plans.',
});


async function handleSubscriptionAttempt(priceId: string) {
  // The store handles caching, forceRefresh: false will use cache if valid
  await subscriptionStore.fetchSubscriptionStatus({ forceRefresh: false });

  if (isUserActiveSubscriber.value) {
    console.log("User is already subscribed. Redirecting to customer portal.");
    await subscriptionStore.redirectToCustomerPortal();
    return;
  }
  await subscribeToPrice(priceId);
}

async function subscribeToPrice(priceId: string) {
  console.log("Attempting to subscribe with Price ID:", priceId);

  if (!priceId || !priceId.startsWith("price_")) {
    console.error('Stripe Price ID is not configured correctly or is invalid:', priceId);
    return;
  }
  try {
    const result = await $fetch<{
      sessionId: string;
      sessionUrl: string;
    }>('/api/stripe/checkout-session', {
      method: 'POST',
      body: { priceId },
    });

    if (result && result.sessionUrl) {
      await navigateTo(result.sessionUrl, { external: true });
    } else {
      console.error('Checkout session URL not received from API.');
    }
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      console.warn('User already has an active subscription. Redirecting to customer portal.');
      await subscriptionStore.redirectToCustomerPortal();
    } else {
      console.error('Error creating checkout session:', error.data || error.message || error);
    }
  }
}
</script>
