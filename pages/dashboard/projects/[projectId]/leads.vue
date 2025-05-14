<script setup lang="ts">
import { columns } from '~/components/leads/columns';
import type { Database } from '~/types/supabase';

const title = ref('Leads')
const subtitle = ref('Meet your future customers')

useHead({
  title
})

definePageMeta({
  middleware: ['project-id']
})

const client = useSupabaseClient<Database>()
const route = useRoute()
const projectId = computed(() => `${route.params.projectId}`)

const { data: leads, pending: loading, refresh } = useAsyncData(
  projectId,
  async () => {
    const { data, error } = await client
      .from("leads")
      .select("*")
      .eq("project_id", projectId.value)
      .order("created_at");
    if (error) throw error;
    return data;
  },

)
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

  <LeadsTable v-if="leads" :data="leads" :columns="columns" :loading="loading" @refetch-leads="refresh()" />
</template>