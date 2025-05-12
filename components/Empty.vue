<script setup lang="ts">

const props = defineProps<{
    title: string,
    icon?: LucideIcon,
}>()
</script>

<template>
    <div
        class="flex flex-col items-center justify-center size-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
        <component class="size-16 mb-4 text-muted-foreground/80" v-if="icon" :is="icon" />
        <h3 class="text-xl font-medium mb-2">{{ title }}</h3>
        <p class="text-muted-foreground text-center max-w-md">
            <slot />
        </p>
    </div>
</template>