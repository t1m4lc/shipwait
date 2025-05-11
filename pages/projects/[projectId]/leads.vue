<script setup>
import { columns } from '~/components/leads/columns';
import tasks from '~/components/leads/data/tasks.json';

const route = useRoute();
const projectId = route.params.projectId;

const title = ref('Leads')

useHead({
  title
})

</script>

<template>
  <h1 class="text-2xl font-bold tracking-tight">
    {{ title }}
  </h1>

  <p>project ID: {{ projectId }}</p>

  <LeadsTable :data="tasks" :columns="columns" />
</template>