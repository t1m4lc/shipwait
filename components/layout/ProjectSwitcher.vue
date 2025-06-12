<script setup lang="ts">
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
import ProjectLimitDialog from '~/components/ProjectLimitDialog.vue';

const props = defineProps<{
  projects: {
    id: string
    name: string
    slug: string
  }[]
}>()

const { isMobile } = useSidebar()

const store = useProjectsStore()
const featureFlagsStore = useFeatureFlagsStore()

const { selectedProject } = storeToRefs(store);

// State for the upgrade dialog
const showUpgradeDialog = ref(false)

// Check project limits
const projectLimitCheck = computed(() => featureFlagsStore.checkProjectLimit(props.projects.length))

function handleCreateProject() {
  const limitCheck = projectLimitCheck.value

  if (!limitCheck.canCreate) {
    showUpgradeDialog.value = true
  }
  else {
    navigateTo('/dashboard/projects/create')
  }
}

function onClick(projectId: string) {
  const route = useRoute()
  store.setSelectedProjectId(projectId)

  // Find the project slug from the ID
  const project = props.projects.find(p => p.id === projectId)
  if (project) {
    navigateTo({ name: route.name as string, params: { ...route.params, projectSlug: project.slug } })
  }
}

const { generateGradient } = useStringGradient();

const customGradient = computed(() =>
  selectedProject?.value?.slug
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
              <span class="first-letter:uppercase lowercase truncate font-medium">
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
            <span class="flex aspect-square size-6 rounded-sm" :style="{ background: generateGradient(project.name) }"></span>
            <span class="first-letter:uppercase lowercase">
              {{ project.name }}
            </span>
            <!-- <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut> -->
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2" :class="{ 'opacity-60': !projectLimitCheck.canCreate }" @click="handleCreateProject">
            <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <Plus class="size-4" />
            </div>
            <span class="font-medium text-muted-foreground">
              Add new project
              <span v-if="!projectLimitCheck.canCreate" class="text-xs text-amber-600 dark:text-amber-400 ml-1">
                (Limit reached)
              </span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <!-- Project limit dialog -->
  <ProjectLimitDialog v-model:open="showUpgradeDialog" :current-project-count="props.projects.length" :project-limit="projectLimitCheck.limit" />
</template>
