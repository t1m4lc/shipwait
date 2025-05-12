<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>
<template>
    <div class="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div class="flex items-center h-10 px-4 bg-gray-800 border-b border-gray-700">
            <div class="flex space-x-2">
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <div class="ml-4 text-gray-400 text-sm">{{props.title}}</div>
        </div>

        <pre class="p-4 overflow-auto text-sm selection:bg-green-800 text-green-400 font-mono bg-gray-900 whitespace-pre-wrap">
<code>
<slot />
</code>
  </pre>
    </div>
</template>