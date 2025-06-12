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

    <!-- Authentication Dialog -->
    <AuthenticationDialog v-model:open="showAuthDialog" :return-url="currentUrl" />

    <!-- Error Dialog -->
    <ErrorDialog v-model:open="showErrorDialog" :title="errorDialog.title" :message="errorDialog.message" :details="errorDialog.details" :suggestion="errorDialog.suggestion" :show-details="errorDialog.showDetails" :action-text="errorDialog.actionText" :action-handler="errorDialog.actionHandler" />
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

// Authentication dialog state
const showAuthDialog = ref(false);
const currentUrl = ref('/pricing');

// Error dialog state
const showErrorDialog = ref(false);
const errorDialog = ref({
  title: '',
  message: '',
  details: '',
  suggestion: '',
  showDetails: false,
  actionText: '',
  actionHandler: undefined as (() => void) | undefined
});

useSeoMeta({
  title: 'Pricing Details - Shipwait',
  description: 'Detailed information about our flexible pricing plans.',
});

// Helper function to show error dialog
function showError(options: {
  title?: string;
  message?: string;
  details?: string;
  suggestion?: string;
  showDetails?: boolean;
  actionText?: string;
  actionHandler?: () => void;
}) {
  errorDialog.value = {
    title: options.title || 'Something went wrong',
    message: options.message || 'An unexpected error occurred. Please try again.',
    details: options.details || '',
    suggestion: options.suggestion || '',
    showDetails: options.showDetails || false,
    actionText: options.actionText || '',
    actionHandler: options.actionHandler
  };
  showErrorDialog.value = true;
}


async function handleSubscriptionAttempt(priceId: string) {
  // Check if user is authenticated first
  const user = useSupabaseUser();
  if (!user.value) {
    // Show authentication dialog instead of direct redirect
    showAuthDialog.value = true;
    return;
  }

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
    showError({
      title: 'Configuration Error',
      message: 'Invalid pricing configuration detected.',
      details: `Price ID "${priceId}" is not valid.`,
      suggestion: 'This appears to be a configuration issue. Please contact support.',
      showDetails: true,
      actionText: 'Contact Support',
      actionHandler: () => {
        window.open('mailto:support@shipwait.com?subject=Pricing Configuration Error', '_blank');
      }
    });
    return;
  }

  try {
    console.log("Making API request to /api/stripe/checkout-session...");
    const result = await $fetch<{
      sessionId: string;
      sessionUrl: string;
    }>('/api/stripe/checkout-session', {
      method: 'POST',
      body: { priceId },
    });

    console.log("API response received:", result);

    if (result && result.sessionUrl) {
      console.log("Redirecting to Stripe checkout:", result.sessionUrl);
      await navigateTo(result.sessionUrl, { external: true });
    } else {
      console.error('Checkout session URL not received from API.');
      console.error('Full API response:', result);

      showError({
        title: 'Checkout Error',
        message: 'Unable to initialize payment session.',
        details: 'The payment system did not return a valid checkout URL.',
        suggestion: 'This is usually a temporary issue. Please try again in a few moments.',
        showDetails: true
      });
    }
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.data);
    console.error('Error message:', error.message);

    if (error.statusCode === 500 && error.statusMessage === "Auth session missing!") {
      console.error('Authentication error: User session is missing');
      showAuthDialog.value = true;
      return;
    }

    if (error.response && error.response.status === 409) {
      console.warn('User already has an active subscription. Redirecting to customer portal.');
      await subscriptionStore.redirectToCustomerPortal();
    } else {
      // Show proper error dialog instead of alert
      const errorMessage = error.data?.message || error.message || 'An unexpected error occurred';
      const isNetworkError = !error.response && error.message?.includes('fetch');

      showError({
        title: 'Subscription Error',
        message: isNetworkError
          ? 'Unable to connect to our servers. Please check your internet connection.'
          : 'Failed to create checkout session. Please try again.',
        details: errorMessage,
        showDetails: true,
        suggestion: isNetworkError
          ? 'Check your internet connection and try again.'
          : 'If this problem persists, please contact our support team.',
        actionText: 'Contact Support',
        actionHandler: () => {
          window.open('mailto:support@shipwait.com?subject=Subscription Error&body=' + encodeURIComponent(`Error details: ${errorMessage}`), '_blank');
        }
      });
    }
  }
}
</script>
