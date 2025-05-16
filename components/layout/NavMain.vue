<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';
import { Send, CircleHelp } from 'lucide-vue-next';

defineProps<{
  items: {
    title: string
    pageName: string
    icon: LucideIcon
  }[],
  projectId: string
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Waitlist</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton asChild>
            <NuxtLink :to="{ name: item.pageName, params: { projectId } }" activeClass="bg-accent font-medium">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  <SidebarGroup class="mt-auto">
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="sm">
            <NuxtLink :to="SOCIAL_X" external target="_blank" activeClass="bg-accent font-medium">
              <CircleHelp />
              <span>Help & Support</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="sm">
            <NuxtLink to="https://insigh.to/b/shipwaitdev" external target="_blank" activeClass="bg-accent font-medium">
              <Send />
              <span>Feedback</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
