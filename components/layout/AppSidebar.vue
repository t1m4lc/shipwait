<script setup lang="ts">
import { Settings2, ChartNoAxesCombined, UserPlus, Home } from 'lucide-vue-next';
import type { SidebarProps } from '../ui/sidebar';


const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const projectId = useRoute().params.projectId as string

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: null,
  },
  projects: [
    {
      id: "1",
      name: 'Waitly',
      domain: 'wailtly.dev',
    },
    {
      id: "2",
      name: 'Facebook',
      domain: 'facebook.com',
    },
    {
      id: "3",
      name: 'X',
      domain: 'x.com',
    },
  ],
  navMain: [
    {
      title: 'Overview',
      pageName: 'projects-projectId',
      icon: Home
    },
    {
      title: 'Leads',
      pageName: 'projects-projectId-leads',
      icon: UserPlus,
    },
    {
      title: 'Analytics',
      pageName: 'projects-projectId-analytics',
      icon: ChartNoAxesCombined,
    },
    
    {
      title: 'Configure',
      pageName: 'projects-projectId-configure',
      icon: Settings2,
    },
  ]
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <LayoutProjectSwitcher :projects="data.projects"  />
    </SidebarHeader>
    <SidebarContent>
      <LayoutNavMain :items="data.navMain" :project-id="projectId" />
    </SidebarContent>
    <SidebarFooter>
      <LayoutNavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
