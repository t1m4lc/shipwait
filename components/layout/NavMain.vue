<script setup lang="ts">
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
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <NuxtLink 
                    :to="{ name: item.pageName, params: { projectId } }" 
                    activeClass="bg-accent font-medium"
                    >
                    <component :is="item.icon" />
                    <span>{{item.title}}</span>
                    </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
</template>
