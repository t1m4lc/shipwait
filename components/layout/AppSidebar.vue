<script setup lang="ts">
import { Settings2, UserPlus } from 'lucide-vue-next';
import type { SidebarProps } from '../ui/sidebar';


const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const store = useProjectsStore();
const { selectedProjectId } = storeToRefs(store)

const user = useSupabaseUser()

const userData = computed(() => {
  if (!user.value) return null

  return {
    name: user.value.user_metadata?.full_name || user.value.email?.split('@')[0].split('.')[0] || 'User',
    email: user.value.email || '',
    avatar: user.value.user_metadata?.avatar_url || null
  }
})

const client = useSupabaseClient()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/login')
}

const navMain = [
  // {
  //   title: 'Overview',
  //   pageName: 'dashboard-projects-projectId',
  //   icon: Eye
  // },
  {
    title: 'Leads',
    pageName: 'dashboard-projects-projectId-leads',
    icon: UserPlus,
  },
  // {
  //   title: 'Analytics',
  //   pageName: 'dashboard-projects-projectId-analytics',
  //   icon: ChartNoAxesCombined,
  // },
  {
    title: 'Configure',
    pageName: 'dashboard-projects-projectId-configure',
    icon: Settings2,
  },
]
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <LayoutProjectSwitcher :projects="store.projects" />
    </SidebarHeader>
    <SidebarContent>
      <LayoutNavMain :items="navMain" :project-id="selectedProjectId" />
    </SidebarContent>
    <SidebarFooter>
      <LayoutNavUser v-if="userData" :user="userData" @logout="logout()" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
