<script setup lang="ts">
import { FlexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, type ColumnDef, type ColumnFiltersState, type SortingState } from '@tanstack/vue-table';
import { TreePalm } from 'lucide-vue-next';
import { Skeleton } from '~/components/ui/skeleton';
import type { Tables } from '~/types/supabase';
import Empty from '../Empty.vue';
import Table from '../ui/table/Table.vue';
import { valueUpdater } from '../ui/table/utils';
import TablePagination from './TablePagination.vue';
import TableToolbar from './TableToolbar.vue';

interface DataTableProps {
  columns: ColumnDef<Tables<'leads'>, any>[]
  data: Tables<'leads'>[]
  loading: boolean
}
const props = defineProps<DataTableProps>()

// Initialize sorting with createdAt in descending order
const sorting = ref<SortingState>([
  {
    id: 'created_at',
    desc: true
  }
])
const columnFilters = ref<ColumnFiltersState>([])


const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
  },
  enableRowSelection: true,
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
})

const emit = defineEmits(['refetch-leads']);

</script>

<template>
  <div class="space-y-4">
    <TableToolbar :disabled="loading || !data?.length" :table="table" @refetch-leads="emit('refetch-leads')" :loading="loading" />

    <div v-if="data?.length" class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length && !loading">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() && 'selected'">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <!-- Loading state for existing data -->
          <template v-else-if="loading && data?.length">
            <TableRow v-for="i in Math.min(data.length, 10)" :key="`loading-${i}`">
              <TableCell v-for="j in columns.length" :key="`loading-cell-${j}`">
                <Skeleton class="h-5 w-full" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else-if="!loading">
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No leads found. Adjust your filters.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Empty v-else title="No leads yet" :icon="TreePalm" class="min-h-[50vh]">
      <p>Just a matter of time, stay patient!</p>
    </Empty>

    <TablePagination v-if="data?.length" :table="table" />
  </div>
</template>