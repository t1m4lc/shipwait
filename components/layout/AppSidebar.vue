<script setup lang="ts">
import { Settings2, ChartNoAxesCombined, UserPlus, Eye } from 'lucide-vue-next';
import type { SidebarProps } from '../ui/sidebar';


const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

  const store = useProjectsStore();
  const {selectedProjectId} = storeToRefs(store)

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: null,
  },
  navMain: [
    {
      title: 'Overview',
      pageName: 'dashboard-projects-projectId',
      icon: Eye
    },
    {
      title: 'Leads',
      pageName: 'dashboard-projects-projectId-leads',
      icon: UserPlus,
    },
    {
      title: 'Analytics',
      pageName: 'dashboard-projects-projectId-analytics',
      icon: ChartNoAxesCombined,
    },
    
    {
      title: 'Configure',
      pageName: 'dashboard-projects-projectId-configure',
      icon: Settings2,
    },
  ]
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <LayoutProjectSwitcher :projects="store.projects"  />
    </SidebarHeader>
    <SidebarContent>
      <LayoutNavMain :items="data.navMain" :project-id="selectedProjectId" />
    </SidebarContent>
    <SidebarFooter>
      <LayoutNavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
