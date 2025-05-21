<script setup lang="ts">
import { ref } from "vue";

type FaqType = {
  question: string;
  answer: string;
};

const props = defineProps<{
  faqs: FaqType[];
  bgColor?: string;
  contactEmail?: string;
  contactTwitter?: string;
}>();

const openItem = ref<string | null>(null);

const toggleItem = (id: string) => {
  openItem.value = openItem.value === id ? null : id;
};


</script>

<template>
  <section :class="[bgColor || 'bg-background', 'py-24']" id="faq">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-6xl flex flex-col md:flex-row gap-12">
        <div class="flex flex-col text-left basis-1/2">
          <h2 class="text-3xl font-bold sm:text-4xl mb-5 ">
            Frequently <span class="gradient-text">Asked Questions</span>
          </h2>
          <p class="text-muted-foreground mb-6">
            Have another question? Contact me on
            <NuxtLink :to="SOCIAL_X" target="_blank" class="text-primary hover:underline font-medium" rel="noopener">
              Twitter
            </NuxtLink>
            or by
            <NuxtLink :to="`mailto:${CONTACT_EMAIL}`" target="_blank" class="text-primary hover:underline font-medium" rel="noopener">
              email
            </NuxtLink>.
          </p>
        </div>

        <div class="basis-1/2">
          <ul>
            <li v-for="(faq, i) in faqs" :key="i" class="border-t border-border">
              <button @click="toggleItem(`item-${i}`)" class="relative cursor-pointer flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg" :aria-expanded="openItem === `item-${i}`" :class="{ 'gradient-text': openItem === `item-${i}` }">
                <span class="flex-1">{{ faq.question }}</span>
                <svg class="flex-shrink-0 w-4 h-4 ml-auto fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <rect y="7" width="16" height="2" rx="1" class="transition duration-200 ease-out" :class="{ 'transform origin-center': true }"></rect>
                  <rect y="7" width="16" height="2" rx="1" class="transition duration-200 ease-out" :class="{ 'transform origin-center rotate-90': openItem !== `item-${i}` }"></rect>
                </svg>
              </button>
              <div class="transition-all duration-300 ease-in-out overflow-hidden" :class="{ 'max-h-0 opacity-0': openItem !== `item-${i}`, 'opacity-80': openItem === `item-${i}` }" :style="openItem === `item-${i}` ? 'max-height: 1000px;' : 'max-height: 0px;'">
                <div class="pb-5 leading-relaxed">
                  <div class="space-y-4 text-muted-foreground" v-html="faq.answer"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
