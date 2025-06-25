<template>
  <Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="transform translate-y-full" enter-to-class="transform translate-y-0" leave-active-class="transition-transform duration-300 ease-in" leave-from-class="transform translate-y-0" leave-to-class="transform translate-y-full">
    <div ref="alertElement" class="fixed bottom-0 left-0 right-0 z-[100] bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-gray-200 text-gray-900 shadow-lg" role="banner" aria-labelledby="launch-alert-title">
      <div class="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-3">
        <!-- Desktop Layout (lg and up) -->
        <div class="hidden lg:flex items-center justify-center">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-lg" role="img" aria-label="Rocket">🚀</span>
              <span id="launch-alert-title" class="font-medium">Launch promotion</span>
            </div>
            <span class="text-sm text-gray-700">First 50 users get 30% off with code:</span>
            <div class="flex items-center space-x-2">
              <div class="relative">
                <code class="bg-gray-100 px-3 py-1 rounded-md font-mono font-semibold text-gray-800 cursor-pointer select-all hover:bg-gray-200 transition-colors border border-gray-300" @click="handleCopy" title="Click to copy discount code" tabindex="0" @keydown.enter="handleCopy" @keydown.space.prevent="handleCopy" role="button" aria-label="Copy discount code FRIENDS30">
                FRIENDS30
              </code>
                <!-- Tooltip -->
                <div v-if="copied" class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10" role="status" aria-live="polite">
                  Copied!
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <button @click="handleCopy" class="p-1 hover:bg-gray-100 rounded transition-colors" title="Copy discount code" aria-label="Copy discount code FRIENDS30">
                <Check v-if="copied" class="w-4 h-4 text-gray-800" />
                <Copy v-else class="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <!-- Tablet Layout (sm to lg) -->
        <div class="hidden sm:flex lg:hidden items-center justify-center">
          <div class="flex flex-col space-y-1 items-center">
            <div class="flex items-center space-x-2">
              <span class="text-lg" role="img" aria-label="Rocket">🚀</span>
              <span class="font-medium">Launch promotion</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700">30% off with:</span>
              <div class="relative">
                <code class="bg-gray-100 px-2 py-1 rounded font-mono font-semibold text-gray-800 cursor-pointer select-all hover:bg-gray-200 transition-colors text-sm border border-gray-300" @click="handleCopy" title="Click to copy discount code" tabindex="0" @keydown.enter="handleCopy" @keydown.space.prevent="handleCopy" role="button" aria-label="Copy discount code FRIENDS30">
                FRIENDS30
              </code>
                <!-- Tooltip -->
                <div v-if="copied" class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10" role="status" aria-live="polite">
                  Copied!
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <button @click="handleCopy" class="p-1 hover:bg-gray-100 rounded transition-colors" title="Copy discount code" aria-label="Copy discount code FRIENDS30">
                <Check v-if="copied" class="w-4 h-4 text-gray-800" />
                <Copy v-else class="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Layout (below sm) -->
        <div class="flex sm:hidden items-center justify-center">
          <div class="flex flex-col space-y-1 items-center">
            <div class="flex items-center space-x-1">
              <span class="text-base" role="img" aria-label="Rocket">🚀</span>
              <span class="font-medium text-sm">Launch: 30% off!</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="relative">
                <code class="bg-gray-100 px-2 py-1 rounded text-xs font-mono font-semibold text-gray-800 cursor-pointer select-all hover:bg-gray-200 transition-colors border border-gray-300" @click="handleCopy" title="Click to copy discount code" tabindex="0" @keydown.enter="handleCopy" @keydown.space.prevent="handleCopy" role="button" aria-label="Copy discount code FRIENDS30">
                FRIENDS30
              </code>
                <!-- Mobile Tooltip -->
                <div v-if="copied" class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10" role="status" aria-live="polite">
                  Copied!
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <button @click="handleCopy" class="p-0.5 hover:bg-gray-100 rounded transition-colors" title="Copy discount code" aria-label="Copy discount code FRIENDS30">
                <Check v-if="copied" class="w-3 h-3 text-gray-800" />
                <Copy v-else class="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'

// VueUse composables
const { copy, copied } = useClipboard({ source: 'FRIENDS30' })

// Simple copy handler
const handleCopy = () => copy()
</script>
