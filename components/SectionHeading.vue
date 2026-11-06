<template>
  <div class="mb-8 flex flex-wrap items-end justify-between gap-3">
    <div>
      <p v-if="eyebrow" class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D1DAD]">{{ eyebrow }}</p>
      <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{{ title }}</h2>
    </div>
    <NuxtLink
      v-if="linkTo"
      :to="linkTo"
      class="group inline-flex items-center gap-1.5 text-sm font-bold text-[#0D1DAD] hover:underline"
    >
      {{ linkLabel || 'View all' }}
      <span class="transition-transform group-hover:translate-x-0.5">→</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  linkTo?: string
  linkLabel?: string
}>()
</script>
