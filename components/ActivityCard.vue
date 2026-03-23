<template>
  <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group">
    <div class="flex flex-col md:flex-row h-full">
      <!-- Activity Image -->
      <div class="md:w-64 h-48 md:h-auto relative overflow-hidden">
        <img :src="activity.content?.media?.images?.[0]?.url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80'" 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <StarIcon class="h-3 w-3 text-[#FFC107] fill-current" />
          <span class="text-sm font-black text-brand-blue">{{ activity.reviews?.summary?.averageRating || '4.8' }}</span>
        </div>
      </div>

      <!-- Activity Details -->
      <div class="flex-grow p-6 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <span class="text-sm font-black text-brand-green uppercase tracking-[0.2em] bg-brand-green/5 px-2 py-1 rounded-md">
              {{ activity.content?.category || 'Activity' }}
            </span>
            <div class="text-right">
              <p class="text-sm text-brand-gray/40 font-bold uppercase tracking-widest">From</p>
              <p class="text-xl font-black text-brand-blue tracking-tighter">{{ formatPrice(activity.amountsFrom?.[0]) }}</p>
            </div>
          </div>
          <h3 class="text-xl font-black text-brand-blue leading-tight group-hover:text-brand-green transition-colors">
            {{ activity.content?.name }}
          </h3>
          <p class="text-xs text-brand-gray/60 font-medium line-clamp-2 leading-relaxed">
            {{ activity.content?.segmentationGroups?.[0]?.description || 'Experience the best of the city with our expert-led tour.' }}
          </p>
        </div>

        <div class="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
          <div class="flex items-center gap-4">
             <div class="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <ClockIcon class="h-4 w-4 text-brand-blue" />
                <span class="text-sm font-bold text-brand-blue uppercase">{{ activity.content?.duration?.value }} {{ activity.content?.duration?.unit }}</span>
             </div>
             <div class="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <TicketIcon class="h-4 w-4 text-brand-blue" />
                <span class="text-sm font-bold text-brand-blue uppercase">Mobile Ticket</span>
             </div>
          </div>
          <UiBaseButton variant="primary" @click="$emit('select', activity)" class="!bg-brand-blue !rounded-xl px-8 font-bold uppercase tracking-widest">
            Book Now
          </UiBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon, ClockIcon, TicketIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  activity: any
}>()

const emit = defineEmits(['select'])

const formatPrice = (priceObj: any) => {
  if (!priceObj) return '$0.00'
  return `${priceObj.currency} ${priceObj.amount}`
}
</script>
