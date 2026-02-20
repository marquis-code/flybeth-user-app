<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-6 sticky top-0 z-30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <LocationPicker v-model="searchQuery.location" placeholder="Pick-up location" id="cars-location" class="text-sm" />
            <div class="space-y-2">
              <label class="text-[11px] uppercase tracking-[0.15em] text-brand-gray font-black px-1 opacity-70 font-header block">Pick-up Date</label>
              <UiBaseInput v-model="searchQuery.date" type="date" placeholder="Dates" class="text-sm !py-5 !rounded-[1.5rem]" />
            </div>
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-12 mb-1">Search</UiBaseButton>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 class="font-bold text-gray-900 mb-4">Filter by</h3>
            
            <!-- Car Type -->
            <div class="mb-6">
              <h4 class="font-medium text-sm text-gray-700 mb-2">Car Type</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Economy</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">SUV</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Luxury</span>
                </label>
              </div>
            </div>

             <!-- Transmission -->
            <div>
              <h4 class="font-medium text-sm text-gray-700 mb-2">Transmission</h4>
                <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Automatic</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="custom-checkbox">
                  <span class="ml-2 text-sm text-gray-600">Manual</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <h2 v-if="cars.length" class="text-xl font-bold text-gray-900 mb-4">{{ cars.length }} cars found</h2>

           <div v-if="loading" class="space-y-4">
             <div v-for="i in 3" :key="i" class="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
           </div>
           
           <EmptyState 
             v-else-if="!cars.length"
             variant="cars"
             title="No cars available"
             message="We couldn't find rental cars at this location. Try a different pick-up point or date."
             actionLabel="Search Dubai Airport"
             @action="searchQuery.location = 'Dubai International Airport (DXB)'; handleSearch();"
           />
           
           <CarCard 
             v-for="car in cars" 
             :key="car._id || car.id" 
             :car="car"
             @select="selectCar" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSearchCars } from '@/composables/modules/cars/useSearchCars';

const { loading, cars, searchCars } = useSearchCars();

const searchQuery = ref({
  location: '',
  date: ''
});

const handleSearch = () => {
  searchCars(searchQuery.value);
};

const selectCar = (car: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'car',
      id: car._id || car.id,
      name: `${car.name} (${car.category})`,
      price: car.pricing?.basePrice || car.price
    }
  });
}

onMounted(() => {
  const route = useRoute();
  if (!route.query.location) {
    searchQuery.value = {
      location: 'Dubai International Airport (DXB)',
      date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
    };
  } else {
    if (route.query.location) searchQuery.value.location = String(route.query.location);
    if (route.query.date) searchQuery.value.date = String(route.query.date);
  }
  handleSearch();
});
</script>
