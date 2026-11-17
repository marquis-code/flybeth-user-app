<template>
  <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200 group">
    <div class="flex flex-col md:flex-row h-full">
      <!-- Activity Image -->
      <div class="md:w-64 h-48 md:h-auto relative overflow-hidden">
        <img :src="coverImage" 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <StarIcon class="h-3 w-3 text-[#FFC107] fill-current" />
          <span class="text-sm  text-black">{{ activity.rating || activity.reviews?.summary?.averageRating || '4.8' }}</span>
        </div>
      </div>

      <!-- Activity Details -->
      <div class="flex-grow p-6 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
              {{ activity.content?.category || activity.categories?.[0] || 'Activity' }}
            </span>
            <div class="text-right">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">From</p>
              <p class="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{{ displayPrice }}</p>
            </div>
          </div>
          <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-[#0D1DAD] transition-colors">
            {{ activity.content?.name || activity.name }}
          </h3>
          <p class="text-xs text-gray-500 font-normal line-clamp-2 leading-relaxed">
            {{ activity.content?.segmentationGroups?.[0]?.description || activity.shortDescription || activity.description || 'Experience the best of the city with our expert-led tour.' }}
          </p>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div class="flex items-center gap-3">
             <div class="flex items-center gap-1 text-gray-500">
                <ClockIcon class="h-3.5 w-3.5 text-gray-400" />
                <span class="text-xs font-semibold uppercase">{{ activity.content?.duration?.value || activity.minimumDuration || '' }} {{ activity.content?.duration?.unit || '' }}</span>
             </div>
             <div class="flex items-center gap-1 text-gray-500">
                <TicketIcon class="h-3.5 w-3.5 text-gray-400" />
                <span class="text-xs font-semibold uppercase">Mobile Ticket</span>
             </div>
          </div>
          <button 
            @click="$emit('select', activity)" 
            class="h-9 sm:h-10 px-5 bg-[#0D1DAD] hover:bg-[#002a66] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon, ClockIcon, TicketIcon } from '@heroicons/vue/24/outline'
import { useSettings } from '@/composables/useSettings'

const { formatPrice } = useSettings()

const props = defineProps<{
  activity: any
}>()

const emit = defineEmits(['select'])

const getFormattedPrice = (priceObj: any) => {
  if (!priceObj) return formatPrice(0)
  // priceObj.amount should be standard USD base
  return formatPrice(priceObj.amount)
}

// ── Computed fallbacks so the card renders both the Hotelbeds `content` shape
//    and the flat live-search shape (photos[], name, price, rating). ──────────
const coverImage = computed(() => {
  return props.activity.content?.media?.images?.[0]?.url ||
         props.activity.photos?.[0] ||
         'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80'
})

const displayPrice = computed(() => {
  // `price` is the NET supplier rate; `priceWithCommission` is the customer price.
  const flat = props.activity.priceWithCommission ?? props.activity.price
  if (typeof flat === 'number') return formatPrice(flat)
  if (flat?.amount || flat?.total) return formatPrice(Number(flat.amount || flat.total))
  return getFormattedPrice(props.activity.amountsFrom?.[0])
})
</script>
