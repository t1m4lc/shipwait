<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Item {
  title: string
  href: string
}

const route = useRoute()
const store = useProjectsStore()
const { selectedProjectSlug } = storeToRefs(store)

// Éléments de navigation par défaut pour les pages de configuration
const sidebarNavItems: Item[] = [
  {
    title: 'Project',
    href: `/dashboard/projects/${selectedProjectSlug.value}/configure`,
  },
  {
    title: 'Collection rules',
    href: `/dashboard/projects/${selectedProjectSlug.value}/configure/rules`,
  },
  {
    title: 'Submission feedback',
    href: `/dashboard/projects/${selectedProjectSlug.value}/configure/feedback`,
  },
]

</script>

<template>
  <nav class="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
    <Button v-for="item in sidebarNavItems" :key="item.title" variant="ghost" :class="cn(
      ' text-left justify-start items-start',
      route.path === item.href && 'bg-muted hover:bg-muted',
    )" as-child>
      <NuxtLink :to="item.href">
        {{ item.title }}
      </NuxtLink>
    </Button>
  </nav>
</template>