<script setup lang="ts">
import { columns } from '~/components/leads/columns';
import type { Database, Tables } from '~/types/supabase';

const title = ref('Leads')
const subtitle = ref('Meet your future customers')

useHead({
  title
})

definePageMeta({
  middleware: ['project-id']
})

const client = useSupabaseClient<Database>()

const rawProjectId = useRoute().params['projectId']
const projectId = Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId

const leads = ref<Tables<'leads'>[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchLeads = async (projectId: string) => {
  if (!projectId) return []
  loading.value = true
  error.value = null
  try {
    const { data, error: fetchError } = await client
      .from('leads')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at')
    if (fetchError) throw fetchError
    return data || []
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch leads'
    return []
  } finally {
    loading.value = false
  }
}

const refetchLeads = async () => {  
  leads.value = await fetchLeads(projectId);
};


watch(
  () => projectId,
  async (newProjectId) => {
    leads.value = await fetchLeads(newProjectId)
  },
  { immediate: true }
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

  <LeadsTable v-if="leads" :data="leads" :columns="columns" :loading="loading"  @refetch-leads="refetchLeads()" />
</template>