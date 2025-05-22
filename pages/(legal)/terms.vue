<script setup lang="ts">
import ContentEmailLink from '~/components/content/EmailLink.vue';

definePageMeta({
    layout: 'default'
})

const { data: post } = await useAsyncData('terms', () => {
    return queryCollection('content').path('/terms').first()
})

</script>

<template>
    <main v-if="post" class="mx-auto max-w-3xl px-4 py-8 ">
        <NuxtLink to="/" class="flex items-center text-sm text-primary hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Return to Home
        </NuxtLink>
        <h1 class="text-3xl pt-6 font-bold tracking-tight text-primary">
            {{ post.title }}
        </h1>
        <p class="my-2 text-sm text-muted-foreground">
            Last updated: {{ post.meta.date }}
        </p>

        <ContentRenderer :value="post" :components="{ ContentEmailLink }" :data="{ email: CONTACT_EMAIL }" class="prose pt-8 pb-16 border-y max-w-none" />

        <NuxtLink to="/" class="flex pt-6 items-center text-sm text-primary hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Return to Home
        </NuxtLink>
    </main>
</template>
