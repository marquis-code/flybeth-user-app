<template>
  <div class="flex flex-col w-full font-body">
    <label 
      v-if="label" 
      :for="id" 
      class="text-[11px] uppercase  text-brand-gray  mb-2 px-1 opacity-70 "
    >
      {{ label }}
    </label>
    <div class="relative group">
      <textarea
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :class="[
          'block w-full bg-white border border-gray-200 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 font-bold text-black placeholder:text-black focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue focus:shadow-xl px-8 py-6 text-sm  min-h-[150px] resize-none'
        ]"
        v-bind="$attrs"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  id: String,
  modelValue: [String, Number]
})

defineEmits(['update:modelValue'])
</script>
