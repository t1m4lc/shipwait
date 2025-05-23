<template>
  <div>
    <div v-if="subscription.isLoading.value">Loading subscription status...</div>
    <div v-else-if="subscription.isActive.value">
      <p>Welcome, Pro User!</p>
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
const subscription = useSubscriptionStatus();
</script>