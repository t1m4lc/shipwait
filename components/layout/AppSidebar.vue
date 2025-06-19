<script setup lang="ts">
import { Cable, FileCode2, Settings2, UserPlus } from 'lucide-vue-next';
import type { SidebarProps } from '../ui/sidebar';


const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const user = useSupabaseUser()
const userStore = useUserStore();
const store = user.value ? useProjectsStore() : null;

// Ensure there's always a selected project (default to first one)
watch(() => store?.projects, (projects) => {
  if (store && projects && projects.length > 0 && !store.selectedProjectId) {
    store.setSelectedProjectId(projects[0].id);
  }
}, { immediate: true });

const navMain = [
  {
    title: 'Page',
    pageName: 'dashboard-projects-projectSlug-page',
    icon: FileCode2,
  },
  {
    title: 'Leads',
    pageName: 'dashboard-projects-projectSlug-leads',
    icon: UserPlus,
  },
  {
    title: 'Connect',
    pageName: 'dashboard-projects-projectSlug-connect',
    icon: Cable,
  },
  {
    title: 'Configure',
    pageName: 'dashboard-projects-projectSlug-configure',
    icon: Settings2,
  },
]
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <LayoutProjectSwitcher v-if="store" :projects="store.projects" />
    </SidebarHeader>
    <SidebarContent>
      <LayoutNavMain v-if="store && store.projects.length > 0" :items="navMain" />
    </SidebarContent>
    <SidebarFooter>
      <LayoutNavUser v-if="userStore.userData" :user="userStore.userData" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
