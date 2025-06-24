<template>
  <nav class="flex" aria-label="Breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li v-for="(item, index) in items" :key="index" class="inline-flex items-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <div v-if="index === 0" class="inline-flex items-center">
          <NuxtLink :to="item.href" class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground" itemprop="item">
            <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            <span itemprop="name">{{ item.text }}</span>
          </NuxtLink>
        </div>
        <div v-else class="flex items-center">
          <svg class="rtl:rotate-180 w-3 h-3 text-muted-foreground mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
          </svg>
          <NuxtLink v-if="item.href && index < items.length - 1" :to="item.href" class="ms-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ms-2" itemprop="item">
            <span itemprop="name">{{ item.text }}</span>
          </NuxtLink>
          <span v-else class="ms-1 text-sm font-medium text-foreground md:ms-2" aria-current="page" itemprop="name">
            {{ item.text }}
          </span>
        </div>
        <meta itemprop="position" :content="(index + 1).toString()" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  text: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();
</script>
