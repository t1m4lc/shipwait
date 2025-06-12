<template>
  <div>
    <div v-if="isLoading">Loading subscription status...</div>
    <div v-else-if="isPro">
      <p>Welcome, Pro User!</p>
      <Button @click="manageSubscription">Manage Subscription</Button>
    </div>
    <div v-else>
      <p>This is a Pro feature.</p>

      <Button as-child>
        <NuxtLink to="/pricing">
          Upgrade to Pro
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const subscriptionStore = useSubscriptionStore();
const { isActive: isPro, isLoading } = storeToRefs(subscriptionStore);
const { syncSubscriptionAndFeatures } = useSubscriptionSync();

async function manageSubscription() {
  await subscriptionStore.redirectToCustomerPortal();
}

// Force refresh subscription and feature flags when landing on this page
// This is especially important after a successful subscription payment
onMounted(async () => {
  await syncSubscriptionAndFeatures({ forceRefresh: true });
});
</script>