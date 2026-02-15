<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white shadow-sm border-b border-gray-200 py-4 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <UiBaseInput placeholder="Pick-up location" icon="location-marker" class="text-sm" />
            <UiBaseInput type="date" placeholder="Dates" class="text-sm" />
        </div>
        <UiBaseButton>Search</UiBaseButton>
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
                  <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Economy</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">SUV</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Luxury</span>
                </label>
              </div>
            </div>

             <!-- Transmission -->
            <div>
              <h4 class="font-medium text-sm text-gray-700 mb-2">Transmission</h4>
                <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Automatic</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Manual</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <h2 class="text-xl font-bold text-gray-900 mb-4">{{ cars.length }} cars found</h2>
           
           <CarCard 
             v-for="car in cars" 
             :key="car.id" 
             :car="car"
             @select="selectCar" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cars = ref([
  {
    id: 1,
    name: 'Toyota Corolla',
    category: 'Economy',
    image: 'https://media.istockphoto.com/id/1157655660/photo/generic-red-suv-on-white-background.jpg?s=612x612&w=0&k=20&c=ecce2a-kC2t-2_FwW4h-x8k-8y-8x-8x-8x-8x-8x.jpg', // Placeholder
    seats: 5,
    bags: 2,
    transmission: 'Automatic',
    rating: 8.5,
    reviews: 120,
    price: 45
  },
  {
    id: 2,
    name: 'Jeep Grand Cherokee',
    category: 'SUV',
    image: 'https://media.istockphoto.com/id/1157655660/photo/generic-red-suv-on-white-background.jpg?s=612x612&w=0&k=20&c=ecce2a-kC2t-2_FwW4h-x8k-8y-8x-8x-8x-8x-8x.jpg', // Placeholder
    seats: 5,
    bags: 4,
    transmission: 'Automatic',
    rating: 9.0,
    reviews: 85,
    price: 85
  },
  {
    id: 3,
    name: 'Mercedes-Benz C-Class',
    category: 'Luxury',
    image: 'https://media.istockphoto.com/id/1157655660/photo/generic-red-suv-on-white-background.jpg?s=612x612&w=0&k=20&c=ecce2a-kC2t-2_FwW4h-x8k-8y-8x-8x-8x-8x-8x.jpg', // Placeholder
    seats: 5,
    bags: 2,
    transmission: 'Automatic',
    rating: 9.5,
    reviews: 40,
    price: 120
  }
])

const selectCar = (id: number) => {
  const car = cars.value.find(c => c.id === id)
  navigateTo({
    path: '/checkout',
    query: {
      type: 'car',
      id: car?.id,
      name: `${car?.name} (${car?.category})`,
      price: car?.price
    }
  })
}
</script>
