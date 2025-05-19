<script setup lang="ts">
import { countries, devices } from '~/components/leads/data';
import type { Database } from '~/types/supabase';
// Remove direct chart.js imports and use nuxt-charts instead

const title = ref('Lead Analytics')
const subtitle = ref('Visualize your leads data')

useHead({
  title
})

definePageMeta({
  middleware: ['project-id']
})

const client = useSupabaseClient<Database>()
const route = useRoute()
const projectId = computed(() => `${route.params.projectId}`)

// State for selected time range
const dateRange = ref('30d')
const dateRangeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' }
]

// State for loading
const isLoading = ref(true)

// Fetch leads data
const { data: leads, pending: loading, refresh } = useAsyncData(
  'leads-analytics-' + projectId.value + '-' + dateRange.value,
  async () => {
    isLoading.value = true

    try {
      let query = client
        .from("leads")
        .select("*")
        .eq("project_id", projectId.value);

      // Apply date filtering based on selected range
      if (dateRange.value !== 'all') {
        const days = parseInt(dateRange.value);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query.order("created_at");

      if (error) throw error;
      return data || [];
    } finally {
      isLoading.value = false
    }
  },
  {
    watch: [dateRange]
  }
)

// Process data for charts
const leadsByDate = computed(() => {
  if (!leads.value?.length) return { labels: [], datasets: [{ data: [] }] }

  const dayjs = useDayjs()
  const groupedByDate = new Map()

  // Group leads by date
  leads.value.forEach(lead => {
    const date = dayjs(lead.created_at).format('YYYY-MM-DD')
    const count = groupedByDate.get(date) || 0
    groupedByDate.set(date, count + 1)
  })

  // Sort dates
  const sortedDates = Array.from(groupedByDate.keys()).sort()

  return {
    labels: sortedDates.map(date => dayjs(date).format('MMM D')),
    datasets: [
      {
        label: 'New Leads',
        data: sortedDates.map(date => groupedByDate.get(date)),
        backgroundColor: '#6366f1',
        borderColor: '#4f46e5',
        tension: 0.3,
        fill: true
      }
    ]
  }
})

// Create device distribution data
const deviceDistribution = computed(() => {
  if (!leads.value?.length) return { labels: [], datasets: [] }

  const deviceCounts: Record<string, number> = {}

  // Initialize counts for all device types
  devices.forEach(device => {
    deviceCounts[device.value] = 0
  })

  // Count by device type
  leads.value.forEach(lead => {
    const deviceType = lead.device_type || 'unknown'
    deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1
  })

  // Get device labels
  const deviceLabels = Object.keys(deviceCounts).map(key => {
    const device = devices.find(d => d.value === key)
    return device ? device.label : key
  })

  const backgroundColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']

  return {
    labels: deviceLabels,
    datasets: [
      {
        data: Object.values(deviceCounts),
        backgroundColor: backgroundColors.slice(0, deviceLabels.length)
      }
    ]
  }
})

// Create country distribution data
const countryDistribution = computed(() => {
  if (!leads.value?.length) return { labels: [], datasets: [] }

  const countryCounts: Record<string, number> = {}

  // Count by country
  leads.value.forEach(lead => {
    if (!lead.country) return

    const countryName = countries[lead.country] || lead.country
    countryCounts[countryName] = (countryCounts[countryName] || 0) + 1
  })

  // Sort by count (descending) and take top 10
  const sortedCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const countryLabels = sortedCountries.map(([name]) => name)
  const countryData = sortedCountries.map(([, count]) => count)

  // Generate colors (one for each country)
  const colors = [
    '#4f46e5', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#06b6d4', '#0ea5e9',
    '#6366f1', '#d946ef'
  ]

  return {
    labels: countryLabels,
    datasets: [
      {
        label: 'Leads by Country',
        data: countryData,
        backgroundColor: colors.slice(0, countryLabels.length)
      }
    ]
  }
})

// Browser distribution
const browserDistribution = computed(() => {
  if (!leads.value?.length) return { labels: [], datasets: [] }

  const browserCounts: Record<string, number> = {}

  // Count by browser
  leads.value.forEach(lead => {
    if (!lead.browser) return

    browserCounts[lead.browser] = (browserCounts[lead.browser] || 0) + 1
  })

  // Sort by count (descending) and take top 5
  const sortedBrowsers = Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const browserLabels = sortedBrowsers.map(([name]) => name)
  const browserData = sortedBrowsers.map(([, count]) => count)

  return {
    labels: browserLabels,
    datasets: [
      {
        label: 'Leads by Browser',
        data: browserData,
        backgroundColor: [
          '#4f46e5', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b'
        ]
      }
    ]
  }
})

// OS distribution
const osDistribution = computed(() => {
  if (!leads.value?.length) return { labels: [], datasets: [] }

  const osCounts: Record<string, number> = {}

  // Count by OS
  leads.value.forEach(lead => {
    if (!lead.os) return

    osCounts[lead.os] = (osCounts[lead.os] || 0) + 1
  })

  // Sort by count (descending) and take top 5
  const sortedOS = Object.entries(osCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const osLabels = sortedOS.map(([name]) => name)
  const osData = sortedOS.map(([, count]) => count)

  return {
    labels: osLabels,
    datasets: [
      {
        label: 'Leads by OS',
        data: osData,
        backgroundColor: [
          '#10b981', '#0ea5e9', '#6366f1', '#d946ef', '#f59e0b'
        ]
      }
    ]
  }
})

// Calculate total leads and growth
const totalLeads = computed(() => leads.value?.length || 0)

const leadGrowth = computed(() => {
  if (!leads.value?.length) return { percentage: 0, isPositive: true }

  const dayjs = useDayjs()

  // Get current range in days
  let rangeDays = 30
  if (dateRange.value !== 'all') {
    rangeDays = parseInt(dateRange.value)
  }

  // Define current period and previous period
  const now = dayjs()
  const currentPeriodStart = now.subtract(rangeDays, 'day')
  const previousPeriodStart = currentPeriodStart.subtract(rangeDays, 'day')

  // Count leads in each period
  let currentPeriodLeads = 0
  let previousPeriodLeads = 0

  leads.value.forEach(lead => {
    const leadDate = dayjs(lead.created_at)

    if (leadDate.isAfter(currentPeriodStart)) {
      currentPeriodLeads++
    } else if (leadDate.isAfter(previousPeriodStart)) {
      previousPeriodLeads++
    }
  })

  // Calculate growth percentage
  let percentage = 0
  let isPositive = true

  if (previousPeriodLeads > 0) {
    const change = currentPeriodLeads - previousPeriodLeads
    percentage = Math.round((change / previousPeriodLeads) * 100)
    isPositive = percentage >= 0
  } else if (currentPeriodLeads > 0) {
    // If previous period had 0 leads, but current has some, show 100% growth
    percentage = 100
    isPositive = true
  }

  return { percentage: Math.abs(percentage), isPositive }
})
</script>

<template>
  <div class="mb-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          {{ title }}
        </h1>
        <p class="text-muted-foreground">
          {{ subtitle }}
        </p>
      </div>

      <div class="flex items-center space-x-4">
        <Select v-model="dateRange">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in dateRangeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button @click="refresh()" :disabled="isLoading">
          <span v-if="isLoading" class="flex items-center">
            <span class="size-4 mr-2 animate-spin rounded-full border-2 border-background border-t-foreground"></span>
            Loading...
          </span>
          <span v-else>Refresh</span>
        </Button>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalLeads }}</div>
          <p class="text-xs text-muted-foreground flex items-center mt-1">
            <span v-if="leadGrowth.percentage > 0" :class="leadGrowth.isPositive ? 'text-emerald-500' : 'text-red-500'" class="flex items-center">
              <template v-if="leadGrowth.isPositive">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                  <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                </svg>
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                  <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
                </svg>
              </template>
              {{ leadGrowth.percentage }}%
            </span>
            <span v-else class="text-muted-foreground">
              No change
            </span>
            <span class="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Device Breakdown</CardTitle>
        </CardHeader>
        <CardContent class="flex items-center justify-center">
          <div v-if="leads && leads.length > 0" class="w-full h-full flex items-center">
            <ClientOnly>
              <DonutChart :data="deviceDistribution.datasets[0].data" :labels="deviceDistribution.labels.map((label, i) => ({
                name: label,
                color: deviceDistribution.datasets[0].backgroundColor[i]
              }))" :height="120" :radius="40" />
            </ClientOnly>
          </div>
          <div v-else class="text-sm text-muted-foreground">No data available</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Browser Breakdown</CardTitle>
        </CardHeader>
        <CardContent class="flex items-center justify-center">
          <div v-if="leads && leads.length > 0" class="w-full h-full flex items-center">
            <ClientOnly>
              <DonutChart :data="browserDistribution.datasets[0].data" :labels="browserDistribution.labels.map((label, i) => ({
                name: label,
                color: browserDistribution.datasets[0].backgroundColor[i]
              }))" :height="120" :radius="40" />
            </ClientOnly>
          </div>
          <div v-else class="text-sm text-muted-foreground">No data available</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">OS Breakdown</CardTitle>
        </CardHeader>
        <CardContent class="flex items-center justify-center">
          <div v-if="leads && leads.length > 0" class="w-full h-full flex items-center">
            <ClientOnly>
              <DonutChart :data="osDistribution.datasets[0].data" :labels="osDistribution.labels.map((label, i) => ({
                name: label,
                color: osDistribution.datasets[0].backgroundColor[i]
              }))" :height="120" :radius="40" />
            </ClientOnly>
          </div>
          <div v-else class="text-sm text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts -->
    <div class="space-y-6">
      <!-- Leads over time chart -->
      <Card>
        <CardHeader>
          <CardTitle>Leads Over Time</CardTitle>
          <CardDescription>
            New leads acquired during the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="leads && leads.length > 0" class="h-80">
            <ClientOnly>
              <LineChart 
                :data="leadsByDate.datasets[0].data.map((value, i) => ({ 
                  date: leadsByDate.labels[i], 
                  value: value 
                }))" 
                :categories="{
                  value: { name: 'New Leads', color: '#4f46e5' }
                }"
                :height="300"
                :xKey="'date'"
              />
            </ClientOnly>
          </div>
          <div v-else class="flex items-center justify-center h-80 text-muted-foreground">
            No data available for the selected period
          </div>
        </CardContent>
      </Card>

      <!-- Geographic distribution -->
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>
            Top 10 countries by lead count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="leads && leads.length > 0" class="h-80">
            <ClientOnly>
              <BarChart :data="countryDistribution.datasets[0].data.map((value, index) => ({
                country: countryDistribution.labels[index],
                value: value
              }))" :categories="{
                  value: { name: 'Leads', color: '#4f46e5' }
                }" :height="300" :xKey="'country'" />
            </ClientOnly>
          </div>
          <div v-else class="flex items-center justify-center h-80 text-muted-foreground">
            No data available for the selected period
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>