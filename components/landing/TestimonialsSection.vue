<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

</script>

<template>
  <section class="py-24">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl gap-2 font-bold flex justify-center sm:text-4xl mb-3">
            Loved by <span class="gradient-text">Makers</span>
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
