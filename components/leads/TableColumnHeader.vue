<script setup lang="ts">
import type { Column } from '@tanstack/vue-table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-vue-next';
import type { Tables } from '~/types/supabase';

interface DataTableColumnHeaderProps {
  column: Column<Tables<'leads'>, any>
  title: string
}

defineProps<DataTableColumnHeaderProps>()

function cycleSorting(column: Column<Tables<'leads'>, any>) {
  const currentSort = column.getIsSorted()

  if (currentSort === false) {
    // Not sorted -> sort ascending
    column.toggleSorting(false)
  } else if (currentSort === 'asc') {
    // Ascending -> sort descending
    column.toggleSorting(true)
  } else {
    // Descending -> clear sort
    column.clearSorting()
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2 py-2', $attrs.class ?? '')">
    <Button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent" @click="cycleSorting(column)">
      <span>{{ title }}</span>
      <ArrowDown v-if="column.getIsSorted() === 'desc'" class="ml-1 size-4" />
      <ArrowUp v-else-if="column.getIsSorted() === 'asc'" class="ml-1 size-4" />
      <ChevronsUpDown v-else class="ml-1 size-4" />
    </Button>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>