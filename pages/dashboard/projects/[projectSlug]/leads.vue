<script setup lang="ts">
import { columns } from '~/components/leads/columns';
import type { Database } from '~/types/supabase';

const title = ref('Leads')
const subtitle = ref('Meet your future customers')

useHead({
  title
})

definePageMeta({
  middleware: ['project-handler']
})

const client = useSupabaseClient<Database>()
const store = useProjectsStore()
const projectId = computed(() => store.selectedProjectId || '')

const { data: leads, pending: loading, refresh } = useAsyncData(
  'project-leads',
  async () => {
    if (!projectId.value) return [];

    const { data, error } = await client
      .from("leads")
      .select("*")
      .eq("project_id", projectId.value)
      .order("created_at");
    if (error) throw error;
    return data;
  },
  {
    watch: [projectId]
  }
)
</script>

<template>
  <div class="space-y-1 mb-6">
    <h1 class="text-3xl font-bold tracking-tight">
      {{ title }}
    </h1>
    <p class="text-lg text-muted-foreground">
      {{ subtitle }}
    </p>
  </div>

  <LeadsTable v-if="leads" :data="leads" :columns="columns" :loading="loading" @refetch-leads="refresh()" />
</template>