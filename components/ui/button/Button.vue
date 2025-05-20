<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { type ButtonVariants, buttonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  type: 'button',
})
</script>

<template>
  <Primitive data-slot="button" :as="as" :as-child="asChild" :type="as === 'button' ? type : undefined" :class="cn(buttonVariants({ variant, size }), 'cursor-pointer', props.class)">
    <slot />
  </Primitive>
</template>
