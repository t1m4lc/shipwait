<template>

    <SplitHtmlPreview />
</template>

<script setup lang="ts">
import SplitHtmlPreview from '~/components/SplitHtmlPreview.vue';

definePageMeta({
    middleware: ['project-id'],
    layout: "page"
})

</script>