<template>
  <!-- Hero Section -->
  <section class="py-24 text-center bg-gradient-to-b from-background to-muted/30">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-4xl">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p class="text-2xl text-muted-foreground mb-8">
          Choose the plan that fits your needs. Start free, upgrade as you grow.
        </p>
        <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full text-lg font-medium">
          <span>🎉</span>
          <span>Limited time: Lifetime deal available!</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <PricingSection v-model:billing-cycle="billingCycle" :show-heading="false" :on-subscribe="handleSubscriptionAttempt" :is-loading-subscription="isLoadingSubscriptionStatus" />

  <!-- Comparison Table -->
  <section class="py-16 bg-muted/30">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-12">
          Feature Comparison
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse bg-background rounded-lg shadow-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left p-4 font-semibold">Feature</th>
                <th class="text-center p-4 font-semibold">Free</th>
                <th class="text-center p-4 font-semibold bg-primary/5">Pro</th>
                <th class="text-center p-4 font-semibold text-muted-foreground">Ultimate <span class="text-xs">(Coming Soon)</span></th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-4 font-medium">Projects</td>
                <td class="text-center p-4 text-muted-foreground">1</td>
                <td class="text-center p-4 bg-primary/5 font-semibold">Unlimited</td>
                <td class="text-center p-4 text-muted-foreground">Unlimited</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 font-medium">Landing Page Templates</td>
                <td class="text-center p-4 text-muted-foreground">1</td>
                <td class="text-center p-4 bg-primary/5 font-semibold">Unlimited</td>
                <td class="text-center p-4 text-muted-foreground">Unlimited</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 font-medium">Pages per Project</td>
                <td class="text-center p-4">1</td>
                <td class="text-center p-4 bg-primary/5">1</td>
                <td class="text-center p-4 text-muted-foreground">Unlimited</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 font-medium">Email Collection</td>
                <td class="text-center p-4">✓</td>
                <td class="text-center p-4 bg-primary/5">✓</td>
                <td class="text-center p-4 text-muted-foreground">✓</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 font-medium">Remove Branding</td>
                <td class="text-center p-4 text-red-500">✗</td>
                <td class="text-center p-4 bg-primary/5 text-green-600">✓</td>
                <td class="text-center p-4 text-muted-foreground">✓</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 font-medium">AI-Generated Pages</td>
                <td class="text-center p-4 text-red-500">✗</td>
                <td class="text-center p-4 bg-primary/5 text-red-500">✗</td>
                <td class="text-center p-4 text-muted-foreground">✓</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 font-medium">Priority Support</td>
                <td class="text-center p-4 text-red-500">✗</td>
                <td class="text-center p-4 bg-primary/5 text-green-600">✓</td>
                <td class="text-center p-4 text-muted-foreground">✓</td>
              </tr>
              <tr>
                <td class="p-4 font-medium">Advanced Analytics</td>
                <td class="text-center p-4 text-red-500">✗</td>
                <td class="text-center p-4 bg-primary/5 text-red-500">✗</td>
                <td class="text-center p-4 text-muted-foreground">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="py-16">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-3xl font-bold text-center mb-12">
          Pricing FAQ
        </h2>
        <div class="space-y-6">
          <div class="border rounded-lg p-6">
            <h3 class="font-semibold mb-2">Can I change my plan anytime?</h3>
            <p class="text-muted-foreground">Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div class="border rounded-lg p-6">
            <h3 class="font-semibold mb-2">What happens to my data if I downgrade?</h3>
            <p class="text-muted-foreground">Your data is always safe. If you downgrade, you'll keep access to all your existing projects, but new project creation may be limited based on your plan.</p>
          </div>
          <div class="border rounded-lg p-6">
            <h3 class="font-semibold mb-2">Do you offer refunds?</h3>
            <p class="text-muted-foreground">Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.</p>
          </div>
          <div class="border rounded-lg p-6">
            <h3 class="font-semibold mb-2">How much can I save with yearly billing?</h3>
            <p class="text-muted-foreground">You can save up to 44% with yearly billing. Pro plan saves you €48/year, and Ultimate saves you €240/year!</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Authentication Dialog -->
  <AuthenticationDialog v-model:open="showAuthDialog" :return-url="currentUrl" />

  <!-- Error Dialog -->
  <ErrorDialog v-model:open="showErrorDialog" :title="errorDialog.title" :message="errorDialog.message" :details="errorDialog.details" :suggestion="errorDialog.suggestion" :show-details="errorDialog.showDetails" :action-text="errorDialog.actionText" :action-handler="errorDialog.actionHandler" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AuthenticationDialog from '~/components/AuthenticationDialog.vue';
import ErrorDialog from '~/components/ErrorDialog.vue';
import PricingSection from '~/components/landing/PricingSection.vue';
import { useSeo } from '~/composables/useSeo';
import { useSubscriptionStore } from '~/stores/subscription.store';

definePageMeta({
  layout: 'landing'
});

// SEO
useSeo({
  title: 'Pricing - ShipWait | Validate Your Ideas Before Building',
  description: 'Choose the perfect plan for your needs. Start free and upgrade as you grow. Save up to 44% with yearly billing.'
});

type BillingCycle = 'monthly' | 'yearly';
const billingCycle = ref<BillingCycle>("yearly"); // Default to yearly

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

// Handle subscription attempts
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
