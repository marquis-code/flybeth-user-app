<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-6 sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <LocationPicker v-model="searchQuery.destination" placeholder="Where to?" id="cruises-dest" class="text-sm" />
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black px-1 opacity-70 font-header block">Departure Date</label>
              <UiBaseInput v-model="searchQuery.departureDate" type="date" placeholder="Departure Date" class="text-sm !py-5 !rounded-[1.5rem]" />
            </div>
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-12 mb-1">Search Cruises</UiBaseButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 class="font-bold text-gray-900 mb-4">Filter by</h3>
            
            <!-- Cruise Line -->
            <div class="mb-6">
              <h4 class="font-medium text-sm text-gray-700 mb-2">Cruise Line</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Royal Caribbean</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">MSC Cruises</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <h2 v-if="cruises.length" class="text-xl font-bold text-gray-900 mb-4">{{ cruises.length }} cruises found</h2>

           <div v-if="loading" class="space-y-4">
             <div v-for="i in 3" :key="i" class="h-60 bg-gray-200 animate-pulse rounded-lg"></div>
           </div>
           
           <EmptyState 
             v-else-if="!cruises.length"
             variant="cruises"
             title="No cruises found"
             message="We couldn't find cruises matching your search. Try a different destination or sailing dates."
             actionLabel="Explore Caribbean"
             @action="searchQuery.destination = 'Caribbean'; handleSearch();"
           />
           
           <CruiseCard 
             v-for="cruise in cruises" 
             :key="cruise._id || cruise.id" 
             :cruise="cruise"
             @select="selectCruise" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSearchCruises } from '@/composables/modules/cruises/useSearchCruises';

const { loading, cruises, searchCruises } = useSearchCruises();

const searchQuery = ref({
  destination: '',
  departureDate: ''
});

const handleSearch = () => {
  searchCruises(searchQuery.value);
};

const selectCruise = (cruise: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'cruise',
      id: cruise._id || cruise.id,
      name: cruise.name,
      price: cruise.pricing?.startingPrice || cruise.price
    }
  });
}

onMounted(() => {
  const route = useRoute();
  if (!route.query.destination) {
    searchQuery.value = {
      destination: 'Caribbean',
      departureDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
    };
  } else {
    if (route.query.destination) searchQuery.value.destination = String(route.query.destination);
    if (route.query.departureDate) searchQuery.value.departureDate = String(route.query.departureDate);
  }
  handleSearch();
});
</script>
