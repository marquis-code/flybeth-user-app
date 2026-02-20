<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-black rounded-full transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4',
      variantClasses,
      sizeClasses,
      block ? 'w-full' : '',
      'uppercase tracking-widest'
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'green', 'outline', 'ghost', 'blue'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  block: {
    type: Boolean,
    default: false
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-brand-blue text-white shadow-[0_10px_30px_-5px_rgba(13,29,173,0.3)] hover:shadow-brand-blue/40 hover:scale-105 focus:ring-brand-blue/20'
    case 'green':
      return 'bg-brand-green text-white shadow-[0_10px_30px_-5px_rgba(50,180,4,0.3)] hover:shadow-brand-green/40 hover:scale-105 focus:ring-brand-green/20'
    case 'secondary':
      return 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10 focus:ring-brand-blue/20 shadow-sm'
    case 'outline':
      return 'border-2 border-brand-blue/20 text-brand-blue bg-white hover:border-brand-blue hover:shadow-lg focus:ring-brand-blue/20'
    case 'ghost':
      return 'text-brand-gray hover:bg-gray-100 focus:ring-gray-200'
    case 'blue':
      return 'bg-brand-blue text-white shadow-[0_10px_30px_-5px_rgba(13,29,173,0.3)] hover:shadow-brand-blue/40 hover:scale-105 focus:ring-brand-blue/20'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-5 py-2.5 text-[10px]'
    case 'lg':
      return 'px-10 py-4 text-sm'
    default:
      return 'px-8 py-3 text-xs'
  }
})
</script>
