<template>
  <div class="py-20 max-w-5xl mx-auto px-6">
    <div class="space-y-12">
      <!-- Header -->
      <div class="text-center md:text-left space-y-3">
        <h1 class="text-4xl text-neutral-900 leading-tight">Travel Requirements</h1>
        <p class="text-neutral-500 font-medium">Check visa, passport, and COVID-19 travel requirements for your next trip.</p>
      </div>

      <!-- Form -->
      <div class="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-sm">
        <form @submit.prevent="fetchRequirements" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div class="space-y-2">
            <label class="text-xs font-bold text-neutral-400 uppercase">Origin (Airport Code)</label>
            <input v-model="form.origin" type="text" placeholder="e.g. LHR" required
              class="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:outline-none focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm uppercase" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-neutral-400 uppercase">Destination (Airport Code)</label>
            <input v-model="form.destination" type="text" placeholder="e.g. JFK" required
              class="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:outline-none focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm uppercase" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-neutral-400 uppercase">Passport (ISO-3)</label>
            <input v-model="form.passport" type="text" placeholder="e.g. GBR" required
              class="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:outline-none focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm uppercase" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-neutral-400 uppercase">Departure Date</label>
            <input v-model="form.departureDate" type="date" required
              class="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:outline-none focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm" />
          </div>
          <div class="md:col-span-2 lg:col-span-4 mt-4">
            <button type="submit" :disabled="loading"
              class="w-full px-8 py-4 bg-brand-blue text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? 'Checking...' : 'Check Requirements' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-6 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 text-sm font-medium">
        {{ error }}
      </div>

      <!-- Results Display -->
      <div v-if="results && results.data" class="space-y-8">
         <h2 class="text-2xl text-neutral-900 font-semibold">Results for {{ form.origin.toUpperCase() }} to {{ form.destination.toUpperCase() }}</h2>
         
         <div class="space-y-6">
            <div v-if="!includedRestrictions.length && !includedProcedures.length" class="text-neutral-500 font-medium">
               No specific restrictions or procedures found for this route and passport combination.
            </div>

            <!-- Restrictions Loop -->
            <div v-for="item in includedRestrictions" :key="item.id" class="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
               <div class="flex items-center justify-between">
                  <span class="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase">{{ item.attributes.category }} - {{ item.attributes.subCategory }}</span>
               </div>
               <h3 class="text-lg font-bold text-neutral-900" v-if="item.attributes.descriptions?.[0]?.title">{{ item.attributes.descriptions[0].title }}</h3>
               <div class="prose prose-sm prose-neutral" v-html="item.attributes.descriptions?.[0]?.description || 'No detailed description available.'"></div>
            </div>

            <!-- Procedures -->
            <div v-for="item in includedProcedures" :key="item.id" class="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
               <div class="flex items-center justify-between">
                  <span class="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase">{{ item.attributes.category }} Procedure</span>
               </div>
               <h3 class="text-lg font-bold text-neutral-900" v-if="item.attributes.descriptions?.[0]?.title">{{ item.attributes.descriptions[0].title }}</h3>
               <div class="prose prose-sm prose-neutral" v-html="item.attributes.descriptions?.[0]?.description || 'No detailed description available.'"></div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Travel Requirements | Flybeth'
})

const form = ref({
  origin: '',
  destination: '',
  passport: '',
  departureDate: ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const results = ref<any>(null)

const includedRestrictions = computed(() => {
   if (!results.value?.included) return []
   return results.value.included.filter((i: any) => i.type === 'RESTRICTION')
})

const includedProcedures = computed(() => {
   if (!results.value?.included) return []
   return results.value.included.filter((i: any) => i.type === 'PROCEDURE')
})

const fetchRequirements = async () => {
  loading.value = true
  error.value = null
  results.value = null

  try {
    const data = await $fetch('/api/sherpa/requirements', {
      method: 'POST',
      body: form.value
    })
    results.value = data
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message || 'Failed to fetch travel requirements. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
