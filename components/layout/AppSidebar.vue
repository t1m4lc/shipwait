<script setup lang="ts">
import { Cable, FileCode2, Settings2, UserPlus } from 'lucide-vue-next';
import type { SidebarProps } from '../ui/sidebar';


const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const store = useProjectsStore();

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
      <LayoutProjectSwitcher :projects="store.projects" />
    </SidebarHeader>
    <SidebarContent>
      <LayoutNavMain :items="navMain" />
    </SidebarContent>
    <SidebarFooter>
      <LayoutNavUser v-if="userData" :user="userData" @logout="logout()" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
