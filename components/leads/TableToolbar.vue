<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import type { Task } from './data/schema';
import { priorities, statuses } from './data/data';
import { Loader2, LoaderCircleIcon, RefreshCw, X } from 'lucide-vue-next';
import TableFacetedFilter from './TableFacetedFilter.vue';

interface DataTableToolbarProps {
  table: Table<Task>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex items-center justify-between">
<div class="flex items-center justify-between w-full">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter leads..."
        :model-value="(table.getColumn('title')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('title')?.setFilterValue($event.target.value)"
      />
      <TableFacetedFilter
        v-if="table.getColumn('status')"
        :column="table.getColumn('status')"
        title="Status"
        :options="statuses"
      />
      <TableFacetedFilter
        v-if="table.getColumn('priority')"
        :column="table.getColumn('priority')"
        title="Priority"
        :options="priorities"
      />

      <Button
        v-if="isFiltered"
        variant="outline"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <X class="size-4" />
      </Button>
    </div>
    <div>
        <!-- TODO refetch -->
        <Button
        variant="outline"
        class="h-8 px-2 lg:px-3"
        @click=""
        >
      <RefreshCw class="size-4" />
        Refetch
      </Button>
    </div>
</div>
    <DataTableViewOptions :table="table" />
  </div>
</template>