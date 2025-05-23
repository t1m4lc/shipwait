<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-4xl font-bold mb-6 text-center">Pricing Details</h1>
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
      This page will contain more detailed information about our pricing plans, features, and comparisons.
    </p>
    <!-- Add more detailed pricing content here -->
    <div class="grid md:grid-cols-2 gap-8 mt-10">
      <div class="border p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-3">Monthly Plan Details</h2>
        <Button @click="subscribe(STRIPE_MONTHLY_PRICE_ID)">Subscribe Monthly</Button>
      </div>
      <div class="border p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-3">Yearly Plan Details</h2>
        <Button @click="subscribe(STRIPE_YEARLY_PRICE_ID)">Subscribe Yearly</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

useSeoMeta({
  title: 'Pricing Details - Ship κανείς',
  description: 'Detailed information about our flexible pricing plans.',
});

async function subscribe(priceId: string) {
  console.log("Attempting to subscribe with Price ID:", priceId);

  if (!priceId || !priceId.startsWith("price_")) {
    console.error('Stripe Price ID is not configured correctly or is invalid:', priceId);
    // TODO: Handle error: show message to user (e.g., using a toast notification)
    // alert("Error: Stripe Price ID is not configured correctly. Please contact support.");
    return;
  }
  try {
    // Use $fetch for client-side API calls triggered by user actions
    const result = await $fetch<{
      sessionId: string;
      sessionUrl: string;
    }>('/api/stripe/checkout-session', {
      method: 'POST',
      body: { priceId },
    });

    if (result && result.sessionUrl) {
      window.location.href = result.sessionUrl; // Redirect to Stripe
    } else {
      console.error('Checkout session URL not received from API.');
      // TODO: Handle error: show message to user
      // alert("Error: Could not initiate checkout. Please try again.");
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error.data || error.message || error);
    // TODO: Handle error: show message to user (e.g., display error.data.message if available)
    // const errorMessage = error.data?.message || "An unexpected error occurred. Please try again.";
    // alert(`Error: ${errorMessage}`);
  }
}
</script>
