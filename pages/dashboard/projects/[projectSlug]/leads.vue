<script setup lang="ts">
import { columns } from '~/components/leads/columns';
import EmailLimitIndicator from '~/components/leads/EmailLimitIndicator.vue';
import { Skeleton } from '~/components/ui/skeleton';
import type { Database } from '~/types/supabase';

const title = ref('Leads')
const subtitle = ref('Meet your future customers')

useHead({
  title
})

definePageMeta({
  middleware: ['project-handler'],
  layout: 'dashboard'
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
    <h1 class="text-2xl font-bold tracking-tight">
      {{ title }}
    </h1>
    <p class="text-base text-muted-foreground">
      {{ subtitle }}
    </p>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="space-y-4">
    <!-- Toolbar skeleton -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Skeleton class="h-10 w-[300px]" />
        <Skeleton class="h-10 w-[120px]" />
      </div>
      <Skeleton class="h-10 w-[100px]" />
    </div>

    <!-- Table skeleton -->
    <div class="rounded-md border">
      <div class="p-4">
        <!-- Header row -->
        <div class="flex justify-between gap-2 mb-4">
          <Skeleton class="h-6 w-[120px]" />
          <Skeleton class="h-6 w-[200px]" />
          <Skeleton class="h-6 w-[150px]" />
          <Skeleton class="h-6 w-[100px]" />
        </div>

        <!-- Data rows -->
        <div v-for="i in 5" :key="i" class="flex justify-between gap-2 py-3">
          <Skeleton class="h-5 w-[120px]" />
          <Skeleton class="h-5 w-[200px]" />
          <Skeleton class="h-5 w-[150px]" />
          <Skeleton class="h-5 w-[100px]" />
        </div>
      </div>
    </div>
  </div>

  <!-- Data loaded state -->
  <div class="space-y-4" v-else-if="leads">
    <EmailLimitIndicator :project-id="projectId" />
    <LeadsTable :data="leads" :columns="columns" :loading="loading" @refetch-leads="refresh()" />
  </div>
</template>