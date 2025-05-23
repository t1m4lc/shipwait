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
const { isPro, redirectToCustomerPortal, isLoading } = useSubscriptionStatus();

async function manageSubscription() {
  await redirectToCustomerPortal();
}
</script>