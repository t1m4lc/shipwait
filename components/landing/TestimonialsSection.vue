<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ref } from "vue";

type TestimonialType = {
  name: string;
  handle: string;
  avatar: string;
  text: string;
  date: string;
};

defineProps<{
  testimonials: TestimonialType[];
}>();

// Define the roles that will be animated
import { useInterval } from "@vueuse/core";

const roles = ["Founders", "Indie Hackers", "Product Managers", "Developers", "Marketers"];
const currentRole = ref(0);

useInterval(2500, {
  callback: () => {
    currentRole.value = (currentRole.value + 1) % roles.length;
  }
});
</script>

<template>
  <section class="py-24">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl gap-2 font-bold flex justify-center sm:text-4xl mb-3">
            Loved by
            <div class="w-40 sm:w-52 text-nowrap h-10 text-center sm:text-left relative">
              <TransitionGroup tag="div" name="slide-y" class="absolute inset-0 flex items-center justify-center sm:justify-start">
                <span v-for="(role, idx) in roles" v-show="idx === currentRole" :key="role" class="gradient-text font-bold absolute left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0">
                  {{ role }}
                </span>
              </TransitionGroup>
            </div>
          </h2>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            Here's what our users say about ShipWait
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(testimonial, i) in testimonials" :key="i" class="bg-background rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-4">
              <Avatar class="h-10 w-10 border">
                <AvatarImage :src="testimonial.avatar" :alt="testimonial.name" />
                <AvatarFallback>{{ testimonial.name.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="font-medium">{{ testimonial.name }}</div>
                <div class="text-sm text-muted-foreground">{{ testimonial.handle }}</div>
              </div>
            </div>
            <p class="mb-3">{{ testimonial.text }}</p>
            <div class="text-xs text-muted-foreground">{{ testimonial.date }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-y-enter-active,
.slide-y-leave-active {
  transition: all 0.5s ease;
}

.slide-y-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-y-leave-to {
  opacity: 0;
  transform: translateX(0px);
}
</style>
