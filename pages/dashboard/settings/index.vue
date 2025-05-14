<template>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        () => navigateTo('/dashboard/settings/profile')
    ]
});
</script>
