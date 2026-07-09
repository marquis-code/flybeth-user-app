<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-[20px] font-bold text-[#111827]">Review your booking</h2>
    </div>

    <!-- Flight Details Summary -->
    <div v-if="bookingType === 'flight'" class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-bold text-gray-900">Flight details</h3>
          <span class="px-2 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider rounded-md">
            {{ flightOffer.tripType || (flightOffer.isRoundTrip ? 'Round Trip' : 'One-way') }}
          </span>
        </div>
        <button @click="$emit('edit', 0)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div v-if="flightOffer.itineraries" class="space-y-4">
          <div 
            v-for="(itinerary, idx) in flightOffer.itineraries" 
            :key="idx" 
            class="flex items-center gap-4"
            :class="{ 'pt-4 border-t border-gray-100': idx > 0 }"
          >
            <img v-if="itinerary.segments?.[0]?.airlineLogo || flightOffer.airlineLogo" :src="itinerary.segments?.[0]?.airlineLogo || flightOffer.airlineLogo" class="w-8 h-8 object-contain" />
            <div class="flex flex-col">
              <span class="text-base font-bold text-gray-900">{{ itinerary.origin }} ➔ {{ itinerary.destination }}</span>
              <span class="text-sm text-gray-500">
                {{ itinerary.segments?.[0]?.airline || flightOffer.airline }} • 
                <span v-if="flightOffer.tripType === 'Multi-city'">Flight {{ idx + 1 }}</span>
                <span v-else-if="flightOffer.tripType === 'Round Trip'">{{ idx === 0 ? 'Outbound' : 'Return' }}</span>
                <span v-else>Outbound</span> • 
                {{ formatDate(itinerary.departureTime) }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center gap-4">
          <img v-if="flightOffer.airlineLogo" :src="flightOffer.airlineLogo" :alt="flightOffer.airline" class="w-8 h-8 object-contain" />
          <div class="flex flex-col">
            <span class="text-base font-bold text-gray-900">{{ flightOffer.origin }} ➔ {{ flightOffer.destination }}</span>
            <span class="text-sm text-gray-500">{{ flightOffer.airline }} • Outbound • {{ formatDate(flightOffer.departureTime) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stay Details Summary -->
    <div v-else-if="bookingType === 'stay'" class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-bold text-gray-900">Stay details</h3>
        </div>
        <button @click="$emit('edit', 0)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-base font-bold text-gray-900">{{ flightOffer.hotelName }}</span>
            <span class="text-sm text-gray-500">
              {{ flightOffer.roomType }} • {{ formatDate(flightOffer.checkInDate) }} – {{ formatDate(flightOffer.checkOutDate) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Details Summary -->
    <div v-else-if="bookingType === 'package'" class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-bold text-gray-900">Package details</h3>
          <span class="px-2 py-1 bg-green-100 text-green-800 text-[11px] font-bold uppercase tracking-wider rounded-md">
            Curated
          </span>
        </div>
        <button @click="$emit('edit', 0)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-base font-bold text-gray-900">{{ flightOffer?.name || 'Exclusive Vacation Package' }}</span>
            <span class="text-sm text-gray-500">Multi-Day Experience</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Details Summary -->
    <div v-else-if="bookingType === 'transfer'" class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-bold text-gray-900">Transfer details</h3>
        </div>
        <button @click="$emit('edit', 0)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.18a2 2 0 0 1 1.9.95l1.6 2.4A2 2 0 0 0 11.36 10H21a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="16.5" cy="18.5" r="2.5"/><circle cx="5.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-base font-bold text-gray-900">{{ flightOffer.name }}</span>
            <span class="text-sm text-gray-500">Provider: {{ flightOffer.provider }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Passengers Summary -->
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900">Passengers</h3>
        <button @click="$emit('edit', 0)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div v-for="(traveler, idx) in travellerData.travelers" :key="idx" class="flex flex-col mb-4 last:mb-0">
          <span class="text-sm font-bold text-gray-900">{{ traveler.title }} {{ traveler.firstName }} {{ traveler.lastName }}</span>
          <span class="text-xs text-gray-500">Date of birth: {{ traveler.dateOfBirth }}</span>
        </div>
      </div>
    </div>

    <!-- Contact Summary -->
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900">Contact details</h3>
        <button @click="$emit('edit', 0)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-900">{{ travellerData.contact?.email }}</span>
          <span class="text-sm text-gray-500">{{ travellerData.contact?.phone }}</span>
        </div>
      </div>
    </div>

    <!-- Customise & Protect Summary -->
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900">Add-ons</h3>
        <button @click="$emit('edit', 1)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div v-if="selectedAddOns.length === 0" class="text-sm text-gray-500">No add-ons selected.</div>
        <ul v-else class="space-y-3">
          <li v-for="addon in selectedAddOns" :key="addon.id" class="flex justify-between items-center">
            <span class="text-sm font-semibold text-gray-900">{{ addon.name }}</span>
            <span class="text-sm font-bold text-gray-900">+{{ formatPriceValue(addon.price) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettings } from '~/composables/useSettings'

const props = defineProps({
  bookingType: { type: String, default: 'flight' },
  flightOffer: { type: Object, required: true },
  travellerData: { type: Object, required: true },
  selectedAddOns: { type: Array as () => any[], default: () => [] },
  selectedSeats: { type: Array as () => any[], default: () => [] },
  seatPrice: { type: Number, default: 0 },
  currencySymbol: { type: String, default: '$' },
})

defineEmits(['edit'])

const { formatPrice } = useSettings()

const formatDate = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatPriceValue = (price: number) => {
  return formatPrice(price || 0)
}
</script>
