<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-6 sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <LocationPicker v-model="searchQuery.location" placeholder="Where to?" id="stays-location" class="text-sm" />
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black px-1 opacity-70 font-header block">Check-in</label>
              <UiBaseInput v-model="searchQuery.checkIn" type="date" placeholder="Check-in" class="text-sm !py-5 !rounded-[1.5rem]" />
            </div>
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black px-1 opacity-70 font-header block">Guests</label>
              <UiBaseInput v-model="searchQuery.guests" type="number" placeholder="2 travelers" class="text-sm !py-5 !rounded-[1.5rem]" />
            </div>
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-10 mb-1">Update Search</UiBaseButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 class="font-bold text-gray-900 mb-4">Filter by</h3>
            
            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-medium text-sm text-gray-700 mb-2">Price per night</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Less than $100</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">$100 - $200</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">$200 - $300</span>
                </label>
              </div>
            </div>

            <!-- Property Type -->
            <div>
              <h4 class="font-medium text-sm text-gray-700 mb-2">Property Type</h4>
                <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Hotel</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Resort</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Apartment</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <h2 v-if="stays.length" class="text-xl font-bold text-gray-900 mb-4">{{ stays.length }} properties found</h2>

           <div v-if="loading" class="space-y-4">
             <div v-for="i in 3" :key="i" class="h-60 bg-gray-200 animate-pulse rounded-lg"></div>
           </div>
           
           <EmptyState 
             v-else-if="!stays.length"
             variant="stays"
             title="No properties found"
             message="We couldn't find stays matching your criteria. Try a different location or adjust your dates."
             actionLabel="Search Dubai"
             @action="searchQuery.location = 'Dubai, UAE'; handleSearch();"
           />
           
           <StayCard 
             v-for="stay in stays" 
             :key="stay._id || stay.id" 
             :stay="stay"
             @select="selectStay" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSearchStays } from '@/composables/modules/stays/useSearchStays';

const { loading, stays, searchStays } = useSearchStays();

const searchQuery = ref({
  location: '',
  checkIn: '',
  guests: 2
});

const handleSearch = () => {
  searchStays(searchQuery.value);
};

const selectStay = (stay: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'stay',
      id: stay._id || stay.id,
      name: stay.name,
      price: stay.price?.total || stay.price?.amount
    }
  });
}

onMounted(() => {
  const route = useRoute();
  if (!route.query.location) {
    searchQuery.value = {
      location: 'Dubai, UAE',
      checkIn: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
      guests: 2
    };
  } else {
    if (route.query.location) searchQuery.value.location = String(route.query.location);
    if (route.query.checkIn) searchQuery.value.checkIn = String(route.query.checkIn);
    if (route.query.guests) searchQuery.value.guests = parseInt(String(route.query.guests)) || 2;
  }
  handleSearch();
});
</script>
