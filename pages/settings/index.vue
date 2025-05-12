<template>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        () => navigateTo('/settings/profile')
    ]
});
</script>
