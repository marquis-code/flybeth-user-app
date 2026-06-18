<template>
  <div class="space-y-6">
    <!-- Cancel For Emergencies -->
    <div v-if="cancelService" class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-6">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900">Cancel For Emergencies</h3>
          <p class="text-sm text-gray-500 mt-1">Get a refund if you can't fly due to illness, adverse weather, or other emergencies.</p>
        </div>
      </div>

      <div class="space-y-3 mb-6">
        <label class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
               :class="{'border-blue-600 ring-1 ring-blue-600 bg-blue-50/30': isCancelProtected}">
          <input type="radio" v-model="cancelProtectionSelection" value="yes" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" @change="updateProtection" />
          <div class="flex-1 flex justify-between items-center">
            <span class="text-sm font-semibold text-gray-900">Add protection</span>
            <span class="text-sm font-bold text-gray-900">+{{ formatPriceValue(cancellationPrice) }}</span>
          </div>
        </label>
        <label class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
               :class="{'border-blue-600 ring-1 ring-blue-600 bg-blue-50/30': !isCancelProtected}">
          <input type="radio" v-model="cancelProtectionSelection" value="no" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" @change="updateProtection" />
          <div class="flex-1">
            <span class="text-sm font-semibold text-gray-900">No protection</span>
          </div>
        </label>
      </div>

      <!-- Benefits List -->
      <div class="space-y-2 mt-4 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          100% refund for illness or injury
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Covers adverse weather conditions
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Fast claims process
        </div>
      </div>
    </div>

    <!-- Baggage Protection -->
    <div v-if="baggageProtService" class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-6">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-3a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900">Baggage Protection</h3>
          <p class="text-sm text-gray-500 mt-1">Get compensated if your baggage is delayed or lost.</p>
        </div>
      </div>

      <div class="space-y-3 mb-6">
        <label class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
               :class="{'border-blue-600 ring-1 ring-blue-600 bg-blue-50/30': isBaggageProtected}">
          <input type="radio" v-model="baggageProtectionSelection" value="yes" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" @change="updateProtection" />
          <div class="flex-1 flex justify-between items-center">
            <span class="text-sm font-semibold text-gray-900">Protect my baggage</span>
            <span class="text-sm font-bold text-gray-900">+{{ formatPriceValue(baggageProtectionPrice) }}</span>
          </div>
        </label>
        <label class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
               :class="{'border-blue-600 ring-1 ring-blue-600 bg-blue-50/30': !isBaggageProtected}">
          <input type="radio" v-model="baggageProtectionSelection" value="no" class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" @change="updateProtection" />
          <div class="flex-1">
            <span class="text-sm font-semibold text-gray-900">No protection</span>
          </div>
        </label>
      </div>

      <!-- Benefits List -->
      <div class="space-y-2 mt-4 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          $1000 compensation for lost bags
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Real-time bag tracking
        </div>
      </div>
    </div>

    <div v-if="!cancelService && !baggageProtService" class="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-8 text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">No Additional Protection Services Available</h3>
      <p class="text-sm text-gray-500">The provider (<span class="capitalize font-bold">{{ providerName }}</span>) has not confirmed any extra protection services for this specific flight. Standard airline terms and conditions apply.</p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end pt-4 gap-4">
       <button @click="$emit('back')" class="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[12px] font-bold transition-all text-sm">
          Go Back
       </button>
       <button @click="$emit('continue')" class="px-8 py-3 bg-[#0D1DAD] hover:bg-[#0A1485] text-white rounded-[12px] font-bold transition-all text-sm">
          Continue
       </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSettings } from '~/composables/useSettings'

const props = defineProps({
  flightOffer: { type: Object, default: null },
  currencySymbol: { type: String, default: '$' },
  selectedAddOns: { type: Array as () => any[], default: () => [] },
})

const emit = defineEmits(['continue', 'back', 'update:selectedAddOns'])

const { formatPrice } = useSettings()

const providerName = computed(() => {
  const p = props.flightOffer?.provider
  if (!p) {
    if (props.flightOffer?.rawOffer?.slices) return 'duffel'
    if (props.flightOffer?.rawOffer?.itineraries) return 'amadeus'
  }
  return p || 'unknown'
})

// Check available services from flightOffer (Duffel API)
const availableServices = computed(() => props.flightOffer?.rawOffer?.available_services || [])

const cancelService = computed(() => availableServices.value.find((s: any) => s.type === 'cancel_for_any_reason'))
const cancellationPrice = computed(() => cancelService.value ? parseFloat(cancelService.value.total_amount) : 0)

const baggageProtService = computed(() => availableServices.value.find((s: any) => s.type === 'baggage_protection' || s.metadata?.type === 'protection'))
const baggageProtectionPrice = computed(() => baggageProtService.value ? parseFloat(baggageProtService.value.total_amount) : 0)

const isCancelProtected = computed(() => props.selectedAddOns.some(a => a.id === 'cancellation-protection' || a.id === cancelService.value?.id))
const isBaggageProtected = computed(() => props.selectedAddOns.some(a => a.id === 'baggage-protection' || a.id === baggageProtService.value?.id))

const cancelProtectionSelection = ref(isCancelProtected.value ? 'yes' : 'no')
const baggageProtectionSelection = ref(isBaggageProtected.value ? 'yes' : 'no')

const formatPriceValue = (price: number) => {
  return formatPrice(price || 0)
}

const updateProtection = () => {
  let addons = [...props.selectedAddOns]
  
  // Handle Cancellation
  if (cancelService.value) {
    const cancelId = cancelService.value.id || 'cancellation-protection'
    if (cancelProtectionSelection.value === 'yes') {
      if (!addons.some(a => a.id === cancelId)) {
        addons.push({
          id: cancelId,
          name: cancelService.value.metadata?.label || 'Cancellation Protection',
          price: cancellationPrice.value,
          type: 'duffel',
          service_id: cancelId
        })
      }
    } else {
      addons = addons.filter(a => a.id !== cancelId)
    }
  }

  // Handle Baggage
  if (baggageProtService.value) {
    const bagProtId = baggageProtService.value.id || 'baggage-protection'
    if (baggageProtectionSelection.value === 'yes') {
      if (!addons.some(a => a.id === bagProtId)) {
        addons.push({
          id: bagProtId,
          name: baggageProtService.value.metadata?.label || 'Baggage Protection',
          price: baggageProtectionPrice.value,
          type: 'duffel',
          service_id: bagProtId
        })
      }
    } else {
      addons = addons.filter(a => a.id !== bagProtId)
    }
  }

  emit('update:selectedAddOns', addons)
}

// Reset selections if services are not available
onMounted(() => {
  if (!cancelService.value && cancelProtectionSelection.value === 'yes') cancelProtectionSelection.value = 'no'
  if (!baggageProtService.value && baggageProtectionSelection.value === 'yes') baggageProtectionSelection.value = 'no'
})
</script>
