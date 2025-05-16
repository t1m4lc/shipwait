<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { countries, devices } from './data';
import { RefreshCw, X } from 'lucide-vue-next';
import TableFacetedFilter from './TableFacetedFilter.vue';
import type { Tables } from '~/types/supabase';

interface DataTableToolbarProps {
  table: Table<Tables<'leads'>>
  loading: boolean
  disabled: boolean,
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

const { countryCodeToFlag } = useCountryFlag();

const countryOptions = computed((): { value: string; label: string }[] => {
  const uniqueCountriesMap = new Map<string, { value: string; label: string }>();

  for (const row of props.table.getCoreRowModel().rows) {
    const country = row.original.country;
    // Skip if already processed or invalid
    if (!country || typeof country !== 'string' || uniqueCountriesMap.has(country)) continue;

    const flag = countryCodeToFlag(country);
    uniqueCountriesMap.set(country, {
      value: country,
      label: `${flag} ${countries[country]}`
    });
  }

  return Array.from(uniqueCountriesMap.values());
})

const osOptions = computed((): { value: string; label: string }[] => {
  const uniqueOsMap = new Map<string, { value: string; label: string }>();

  for (const row of props.table.getCoreRowModel().rows) {
    const os = row.original.os;
    // Skip if already processed or invalid
    if (!os || typeof os !== 'string' || uniqueOsMap.has(os)) continue;

    uniqueOsMap.set(os, {
      value: os,
      label: os
    });
  }

  return Array.from(uniqueOsMap.values());
})

const browserOptions = computed((): { value: string; label: string }[] => {
  const uniqueBrowserMap = new Map<string, { value: string; label: string }>();

  for (const row of props.table.getCoreRowModel().rows) {
    const browser = row.original.browser;
    // Skip if already processed or invalid
    if (!browser || typeof browser !== 'string' || uniqueBrowserMap.has(browser)) continue;

    uniqueBrowserMap.set(browser, {
      value: browser,
      label: browser
    });
  }

  return Array.from(uniqueBrowserMap.values());
})


const emit = defineEmits(['refetch-leads']);

</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col w-full md:flex-row items-center gap-y-4 gap-x-2">
        <Input placeholder="Filter emails..."
          :model-value="(table.getColumn('email')?.getFilterValue() as string) ?? ''"
          class="h-10 md:h-8 w-full min-w-[220px] md:w-[250px]"
          @input="table.getColumn('email')?.setFilterValue($event.target.value)" :disabled="disabled" />

        <div class="flex gap-4 justify-between w-full">
          <div class="flex gap-2 overflow-y-auto">
            <TableFacetedFilter v-if="table.getColumn('country')" :column="table.getColumn('country')" title="Country"
              :options="countryOptions" :disabled="disabled" />

            <TableFacetedFilter v-if="table.getColumn('device_type')" :column="table.getColumn('device_type')"
              title="Device" :options="devices" :disabled="disabled" />

            <TableFacetedFilter v-if="table.getColumn('browser')" :column="table.getColumn('browser')" title="Browser"
              :options="browserOptions" :disabled="disabled" />

            <TableFacetedFilter v-if="table.getColumn('os')" :column="table.getColumn('os')" title="OS"
              :options="osOptions" :disabled="disabled" />

            <Button v-if="isFiltered" variant="outline" class="h-8 px-2 lg:px-3" @click="table.resetColumnFilters()"
              :disabled="disabled">
              Reset
              <X class="size-4" />
            </Button>
          </div>

          <Button variant="outline" class="h-8 px-2 lg:px-3" @click="emit('refetch-leads')" :disabled="loading">
            <RefreshCw class="size-4" :class="{ 'animate-spin': loading }" />
            Refetch
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>