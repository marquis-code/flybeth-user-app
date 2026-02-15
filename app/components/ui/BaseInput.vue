<template>
  <div class="flex flex-col w-full font-body">
    <label 
      v-if="label" 
      :for="id" 
      class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black mb-2 px-1 opacity-70 font-header"
    >
      {{ label }}
    </label>
    <div class="relative group">
      <div 
        v-if="icon" 
        class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-brand-blue/40 group-focus-within:text-brand-blue transition-colors duration-300"
      >
        <component :is="icon" class="h-5 w-5" aria-hidden="true" />
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :class="[
          'block w-full bg-white border border-gray-100 rounded-[1.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 font-bold text-brand-blue placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue focus:shadow-xl',
          icon ? 'pl-14' : 'px-6',
          'py-4 text-sm tracking-tight'
        ]"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  id: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  icon: Object
})

defineEmits(['update:modelValue'])
</script>
