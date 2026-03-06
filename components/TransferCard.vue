<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Vehicle Image/Icon -->
      <div class="md:w-48 h-32 bg-gray-50 rounded-2xl flex items-center justify-center p-4 overflow-hidden relative">
        <img v-if="transfer.vehicle_image" :src="transfer.vehicle_image" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
        <div v-else class="text-4xl">🚗</div>
        <div class="absolute top-2 left-2 bg-brand-green text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
          {{ transfer.category || 'Standard' }}
        </div>
      </div>

      <!-- Details -->
      <div class="flex-grow space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-black text-brand-blue tracking-tighter">{{ transfer.vehicle_name || 'Airport Transfer' }}</h3>
            <p class="text-xs font-bold text-brand-gray/60 uppercase tracking-widest">{{ transfer.provider_name }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black text-brand-blue tracking-tighter">{{ formatPrice(transfer.price) }}</p>
            <p class="text-[10px] font-bold text-brand-gray/40 uppercase tracking-widest">Total for 2 pax</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-gray-50">
          <div class="flex items-center gap-2">
            <UserIcon class="h-4 w-4 text-brand-gray/40" />
            <span class="text-xs font-bold text-brand-blue">{{ transfer.capacity || 4 }} Pax</span>
          </div>
          <div class="flex items-center gap-2">
            <BriefcaseIcon class="h-4 w-4 text-brand-gray/40" />
            <span class="text-xs font-bold text-brand-blue">{{ transfer.luggage_limit || 2 }} Bags</span>
          </div>
          <div class="flex items-center gap-2">
            <ClockIcon class="h-4 w-4 text-brand-gray/40" />
            <span class="text-xs font-bold text-brand-blue">{{ transfer.duration || '45 mins' }}</span>
          </div>
          <div class="flex items-center gap-2">
             <ShieldCheckIcon class="h-4 w-4 text-brand-green" />
             <span class="text-xs font-bold text-brand-green">Free Cancellation</span>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <div class="flex items-center gap-2 text-brand-green">
            <CheckCircleIcon class="h-4 w-4" />
            <span class="text-[10px] font-black uppercase tracking-widest">Meet & Greet Included</span>
          </div>
          <UiBaseButton variant="primary" @click="$emit('select', transfer)" class="!bg-brand-blue !rounded-xl px-10 font-bold uppercase tracking-widest">
            Book Now
          </UiBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, BriefcaseIcon, ClockIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  transfer: any
}>()

const emit = defineEmits(['select'])

const formatPrice = (price: any) => {
  if (typeof price === 'number') return `$${price.toFixed(2)}`
  if (typeof price === 'object') return `${price.currency} ${price.amount || price.total}`
  return price
}
</script>
