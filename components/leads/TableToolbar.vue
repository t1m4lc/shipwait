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
  const uniqueCountries = new Set(
    props.table.getCoreRowModel().rows.map(row => row.original.country)
  )
  return Array.from(uniqueCountries)
    .filter((country): country is string => typeof country === 'string' && !!country)
    .map(country => {
      const flag = countryCodeToFlag(country);

      return ({
        value: country,
        label: `${flag} ${countries[country]}`
      })
    })
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