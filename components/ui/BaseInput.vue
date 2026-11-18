<template>
  <div class="flex flex-col w-full font-sans">
    <label 
      v-if="label" 
      :for="id" 
      class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 px-0.5"
    >
      {{ label }}
    </label>
    <div class="relative group">
      <div 
        v-if="icon" 
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0D1DAD] transition-colors"
      >
        <component :is="icon" class="h-4 w-4" aria-hidden="true" />
      </div>
      <input
        :id="id"
        :type="computedType"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :class="[
          'block w-full bg-white border border-slate-200 rounded-2xl shadow-sm transition-all text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-[#0D1DAD] text-sm sm:text-base font-semibold',
          icon ? 'pl-11' : 'px-4.5',
          isPassword ? 'pr-12' : 'pr-4.5',
          'py-3.5 sm:py-3.5'
        ]"
        v-bind="$attrs"
      />
      <!-- Password visibility toggle button -->
      <button
        v-if="isPassword"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
        tabindex="-1"
      >
        <EyeOff v-if="showPassword" class="h-4 w-4" />
        <Eye v-else class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  label: String,
  id: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  icon: [Object, String]
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)
const isPassword = computed(() => props.type === 'password')
const computedType = computed(() => {
  if (isPassword.value) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>
