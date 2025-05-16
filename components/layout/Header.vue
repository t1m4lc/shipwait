<script setup lang="ts">
import { Plug } from 'lucide-vue-next';

const store = useProjectsStore();
const { selectedProject } = storeToRefs(store)
</script>

<template>
  <header
    class="flex justify-between h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4 lg:px-6">
    <div class="flex items-center gap-2 ">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
    </div>

    <NuxtLink v-if="selectedProject?.id"
      :to="{ name: 'dashboard-projects-projectId-configure-integration', params: { projectId: selectedProject?.id } }">

      <Button variant="outline" class="rounded-full group">
        <Plug class="group-hover:text-yellow-500 transition-colors" />
        <span class="pr-1.5 font-semibold">Connect</span>
      </Button>
    </NuxtLink>
  </header>
</template>