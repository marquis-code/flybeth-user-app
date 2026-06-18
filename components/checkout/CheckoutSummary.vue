<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-[28px] font-bold text-[#111827]">Review your booking</h2>
    </div>

    <!-- Flight Details Summary -->
    <div class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900">Flight details</h3>
        <button @click="$emit('edit', 0)" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <img v-if="flightOffer.airlineLogo" :src="flightOffer.airlineLogo" :alt="flightOffer.airline" class="w-8 h-8 object-contain" />
          <div class="flex flex-col">
            <span class="text-base font-bold text-gray-900">{{ flightOffer.origin }} ➔ {{ flightOffer.destination }}</span>
            <span class="text-sm text-gray-500">{{ flightOffer.airline }} • {{ formatDate(flightOffer.departureTime) }}</span>
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
          <span class="text-sm text-gray-500">{{ travellerData.contact?.phoneCountryCode }} {{ travellerData.contact?.phoneNumber }}</span>
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
