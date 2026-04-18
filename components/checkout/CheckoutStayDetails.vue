<template>
  <div class="stay-details-step animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Stay Summary Card -->
    <div v-if="stay" class="stay-card bg-white rounded-3xl border border-gray-300">
      <div class="bg-brand-blue p-6 flex justify-between items-center">
         <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div>
               <h2 class="text-lg  text-white leading-tight uppercase tracking-tight">{{ stay.hotelName || stay.name || stay.stay?.name }}</h2>
               <div class="text-[9px]  text-blue-100 uppercase tracking-widest opacity-80 italic">Verified Premium Property</div>
            </div>
         </div>
         <div v-if="stay.starRating || stay.rating" class="bg-brand-orange text-white px-3 py-1.5 rounded-lg text-xs font-bold">
           {{ (stay.starRating || stay.rating).toFixed(1) }} ★
         </div>
      </div>

      <div class="p-8 space-y-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="space-y-1">
            <span class="text-[9px]  text-gray-400 uppercase tracking-widest block italic">Room Type</span>
            <span class="text-sm  text-gray-900 leading-tight">{{ stay.roomName || selectedRoom?.name || 'Selected Room' }}</span>
          </div>
          <div class="space-y-1 border-l border-gray-100 pl-6">
            <span class="text-[9px]  text-gray-400 uppercase tracking-widest block italic">Board Type</span>
            <span class="text-sm  text-gray-900 leading-tight">{{ stay.rateType || 'Standard Rate' }}</span>
          </div>
          <div class="space-y-1 border-l border-gray-100 pl-6">
            <span class="text-[9px]  text-gray-400 uppercase tracking-widest block italic">Check-in</span>
            <span class="text-sm  text-gray-900">{{ stay.checkInDate || 'Check-in info' }}</span>
          </div>
          <div class="space-y-1 border-l border-gray-100 pl-6">
            <span class="text-[9px]  text-gray-400 uppercase tracking-widest block italic">Check-out</span>
            <span class="text-sm  text-gray-900">{{ stay.checkOutDate || 'Check-out info' }}</span>
          </div>
        </div>

        <!-- Cancellation Policies -->
        <div v-if="stay.cancellationPolicies?.length > 0" class="bg-gray-50 rounded-2xl p-6 border border-gray-100 border-dashed">
          <h3 class="text-sm  text-gray-900 uppercase tracking-widest mb-4 italic">Cancellation Policy</h3>
          <div class="space-y-3">
            <div v-for="(policy, idx) in stay.cancellationPolicies" :key="idx" class="flex justify-between items-center text-xs font-bold">
              <span class="text-gray-500 uppercase tracking-tight">By {{ formatDate(policy.from) }}</span>
              <span class="text-red-500  tracking-tighter">{{ currencySymbol }}{{ Math.round(policy.amount) }} CHARGE</span>
            </div>
          </div>
        </div>

        <!-- Property Notice -->
        <div class="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
           <svg class="w-5 h-5 text-gray-900 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
           <p class="text-sm font-bold text-gray-500 leading-relaxed uppercase italic">Standard check-in is after 2:00 PM. Please have your identification ready for a seamless check-in experience.</p>
        </div>
      </div>
    </div>

    <!-- Continue Button (Hidden if bundle and step 0) -->
    <div v-if="!isBundle" class="flex justify-end mt-4">
      <button @click="$emit('continue')" class="bg-brand-orange hover:bg-orange-600 text-white  px-12 py-4 rounded-xl transition-all uppercase tracking-widest text-sm active:scale-[0.98]">
        Continue to Traveller Details
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  stay: { type: Object, default: null },
  selectedRoom: { type: Object, default: null },
  currencySymbol: { type: String, default: '$' },
  isBundle: { type: Boolean, default: false }
})

defineEmits(['continue'])

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.bg-brand-blue { background-color: #0084ff; }
.text-gray-900 { color: #0084ff; }
.bg-brand-orange { background-color: #ff8a00; }
</style>
