<script setup lang="ts">

const title = ref('Configure')
const subtitle = ref("Customize the behavior of your email collection flow.")
</script>

<template>
  <div class="pb-16 space-y-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">
        {{ title }}
      </h1>
      <p class="text-lg text-muted-foreground">
        {{ subtitle }}
      </p>
    </div>
    <div class="flex flex-col lg:flex-row space-y-6 lg:space-x-12 lg:space-y-0">
      <div class="w-full overflow-x-auto pb-2 lg:w-1/6 lg:pb-0">
        <ConfigureSidebarNav />
      </div>
      <div class="flex-1 lg:max-w-2xl">
        <div class="space-y-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>