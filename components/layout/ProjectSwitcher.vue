<script setup lang="ts">
import { NuxtLink } from '#components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ChevronsUpDown, Plus } from 'lucide-vue-next'

const props = defineProps<{
  projects: {
    id: string
    name: string
    domain: string
  }[]
}>()

const { isMobile } = useSidebar()

const store = useProjects()

const activeProject = computed(() => props.projects.find(p => p.id === store.selectedProjectId))

function onClick(projectId: string) {
  navigateTo({ name: "projects-projectId", params: { projectId } })
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child class="cursor-pointer">
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
              {{ activeProject?.name.slice(0, 1) }}
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ activeProject?.name }}
              </span>
              <span class="truncate text-xs">{{ activeProject?.domain }}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start"
          :side="isMobile ? 'bottom' : 'right'" :side-offset="4">
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Projects
          </DropdownMenuLabel>
          <DropdownMenuItem v-for="(project) in projects" :key="project.id" class="gap-2 p-2 "
            @click="onClick(project.id)">
            <div class="flex size-6 items-center justify-center rounded-sm border text-xs">
              {{ project.name.slice(0, 1) }}
            </div>
            {{ project.name }}
            <!-- <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut> -->
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2">
            <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <Plus class="size-4" />
            </div>
            <NuxtLink to="/admin/projects/create" class="font-medium text-muted-foreground">
              Add new project
            </NuxtLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
