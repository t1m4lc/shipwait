<script setup lang="ts">
import { NuxtLink } from '#components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChevronsUpDown, Plus } from 'lucide-vue-next';

const props = defineProps<{
  projects: {
    id: string
    name: string
  }[]
}>()

const { isMobile } = useSidebar()

const store = useProjectsStore()

const { selectedProject } = storeToRefs(store);

function onClick(projectId: string) {
  const route = useRoute()
  store.setSelectedProjectId(projectId)
  navigateTo({ name: route.name as string, params: { ...route.params, projectId } })
}

const { generateGradient } = useStringGradient();

const customGradient = computed(() =>
  selectedProject?.value?.name
    ? generateGradient(selectedProject?.value?.name)
    : 'var(--sidebar-background)')
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child class="cursor-pointer">
          <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <span class="flex aspect-square size-8 rounded-lg" :style="{ background: customGradient }"></span>
            <div class="grid pl-0.5 flex-1 text-left text-lg leading-tight">
              <span class="truncate font-medium">
                {{ selectedProject?.name }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" :side="isMobile ? 'bottom' : 'right'" :side-offset="4">
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Projects
          </DropdownMenuLabel>
          <DropdownMenuItem v-for="(project) in props.projects" :key="project.id" class="gap-2 p-2" @click="onClick(project.id)">
            <span class="flex aspect-square size-6 rounded-sm" :style="{ background: customGradient }"></span>
            {{ project.name }}
            <!-- <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut> -->
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2">
            <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <Plus class="size-4" />
            </div>
            <NuxtLink to="/dashboard/projects/create" class="font-medium text-muted-foreground">
              Add new project
            </NuxtLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
