<script setup>
const title = ref('Configure')
const subtitle = ref("Tweak it 'til it's perfect")

useHead({
  title
})

</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold tracking-tight">
      {{ title }}
    </h1>
    <p class="text-muted-foreground">
     {{ subtitle }}
    </p>
  </div>
</template>