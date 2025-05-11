<script setup lang="ts">
import { SquareTerminal, Bot, BookOpen, Settings2, ChartNoAxesCombined, UserPlus, HomeIcon, Home } from 'lucide-vue-next';
import type { SidebarProps } from '../ui/sidebar';


const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  projects: [
    {
      name: 'Waitly',
      domain: 'wailtly.dev',
    },
    {
      name: 'Facebook',
      domain: 'facebook.com',
    },
    {
      name: 'X',
      domain: 'x.com',
    },
  ],
  navMain: [
    {
      title: 'Overview',
      url: 'overview',
      icon: Home
    },
    {
      title: 'Leads',
      url: 'leads',
      icon: UserPlus,
    },
    {
      title: 'Analytics',
      url: 'analytics',
      icon: ChartNoAxesCombined,
    },
    
    {
      title: 'Configure',
      url: 'configure',
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
      <LayoutNavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <LayoutNavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
