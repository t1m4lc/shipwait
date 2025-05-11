<script setup>
import { columns } from '~/components/leads/columns';
import tasks from '~/components/leads/data/tasks.json';

const title = ref('Leads')
const subtitle = ref('Meet your future customers')

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

  <LeadsTable :data="tasks" :columns="columns" />
</template>