<template>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        () => navigateTo('/admin/settings/profile')
    ]
});
</script>
