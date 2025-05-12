<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import type { Lead } from './data/schema';
import { countries, devices } from './data/data';
import { RefreshCw, X } from 'lucide-vue-next';
import TableFacetedFilter from './TableFacetedFilter.vue';

interface DataTableToolbarProps {
  table: Table<Lead>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

const { countryCodeToFlag } = useCountryFlag();

const countryOptions = computed((): { value: string; label: string }[] => {
  const uniqueCountries = new Set(
    props.table.getCoreRowModel().rows.map(row => row.original.country)
  )
  return Array.from(uniqueCountries)
    .filter(Boolean)
    .map(country => {
      const flag = countryCodeToFlag(country);

      return ({
        value: country,
        label: `${flag} ${countries[country]}`
      })
    })
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col w-full md:flex-row items-center gap-y-4 gap-x-2">
        <Input placeholder="Filter emails..."
          :model-value="(table.getColumn('email')?.getFilterValue() as string) ?? ''"
          class="h-10 md:h-8 w-full min-w-[220px] md:w-[250px]"
          @input="table.getColumn('email')?.setFilterValue($event.target.value)" />

        <div class="flex gap-4 justify-between w-full">
          <div class="flex gap-2 overflow-y-auto">
            <TableFacetedFilter v-if="table.getColumn('country')" :column="table.getColumn('country')" title="Country"
              :options="countryOptions" />

            <TableFacetedFilter v-if="table.getColumn('device')" :column="table.getColumn('device')" title="Device"
              :options="devices" />

            <Button v-if="isFiltered" variant="outline" class="h-8 px-2 lg:px-3" @click="table.resetColumnFilters()">
              Reset
              <X class="size-4" />
            </Button>
          </div>

          <!-- TODO refetch -->
          <Button variant="outline" class="h-8 px-2 lg:px-3" @click="">
            <RefreshCw class="size-4" />
            Refetch
          </Button>
        </div>
      </div>
    </div>
    <DataTableViewOptions :table="table" />
  </div>
</template>