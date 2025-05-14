<script setup lang="ts">
import { FlexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, type ColumnDef, type ColumnFiltersState, type SortingState } from '@tanstack/vue-table';
import type { Lead } from './data/schema';
import { valueUpdater } from '../ui/table/utils';
import Table from '../ui/table/Table.vue';
import TableToolbar from './TableToolbar.vue';
import TablePagination from './TablePagination.vue';
import type { Tables } from '~/types/supabase';

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
    <TableToolbar :table="table" @refetch-leads="emit('refetch-leads')" :loading="loading" />
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
            <span v-if="data?.length">
                No leads found. Adjust your filters.
            </span>
            <span v-else>
              No leads yet, just a matter of time!
            </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <TablePagination :table="table" />
  </div>
</template>