<template>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: [
        () => navigateTo('/dashboard/settings/profile')
    ]
});
</script>
