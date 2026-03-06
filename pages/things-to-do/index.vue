<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-6 sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <LocationPicker v-model="searchQuery.location" label="Search Destination" placeholder="Where are you going?" id="activity-location" class="text-sm" />
            <div class="space-y-2">
              <UiAnimatedInput v-model="searchQuery.fromDate" type="date" label="From Date" placeholder="Start Date" class="!py-0" />
            </div>
            <div class="space-y-2">
              <UiAnimatedInput v-model="searchQuery.toDate" type="date" label="To Date" placeholder="End Date" class="!py-0" />
            </div>
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-10 mb-1">Search</UiBaseButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 class="font-black text-brand-blue mb-4">Categories</h3>
            <div class="space-y-3">
              <label v-for="cat in ['Tours', 'Attractions', 'Food & Drink', 'Sports', 'Art & Culture']" :key="cat" class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" class="h-5 w-5 rounded-lg border-2 border-gray-200 text-brand-blue focus:ring-brand-blue checked:bg-brand-blue transition-all" />
                <span class="text-sm font-bold text-brand-gray group-hover:text-brand-blue transition-colors">{{ cat }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-6">
          <div v-if="thingsToDo.length" class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-black text-brand-blue tracking-tighter">{{ thingsToDo.length }} activities found</h2>
          </div>

          <div v-if="loading" class="space-y-6">
            <div v-for="i in 3" :key="i" class="h-64 bg-white animate-pulse rounded-3xl border border-gray-100"></div>
          </div>

          <EmptyState 
            v-else-if="!thingsToDo.length"
            variant="activities"
            title="No activities found"
            message="We couldn't find things to do in this location. Try searching for a different destination or date range."
            actionLabel="View All Destinations"
            @action="navigateTo('/')"
          />

          <ActivityCard 
            v-for="activity in thingsToDo" 
            :key="activity.code" 
            :activity="activity"
            @select="selectActivity" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSearchThingsToDo } from '@/composables/modules/things-to-do/useSearchThingsToDo'
import ActivityCard from '@/components/ActivityCard.vue'

const { loading, thingsToDo, searchThingsToDo } = useSearchThingsToDo()

const searchQuery = ref({
  location: '',
  fromDate: '',
  toDate: ''
})

const handleSearch = () => {
  searchThingsToDo(searchQuery.value)
}

const selectActivity = (activity: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'activity',
      id: activity.code,
      name: activity.content?.name,
      price: activity.amountsFrom?.[0]?.amount || 0,
      provider: 'HotelBeds'
    }
  })
}

onMounted(() => {
  const route = useRoute()
  if (route.query.location) searchQuery.value.location = String(route.query.location)
  if (route.query.startDate) searchQuery.value.fromDate = String(route.query.startDate)
  if (route.query.endDate) searchQuery.value.toDate = String(route.query.endDate)
  
  if (searchQuery.value.location) {
    handleSearch()
  } else {
    // defaults
    searchQuery.value = {
      location: 'Dubai, UAE',
      fromDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
      toDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
    }
    handleSearch()
  }
})
</script>
