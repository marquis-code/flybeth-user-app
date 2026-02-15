<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Search Bar Compact -->
    <div class="bg-white shadow-sm border-b border-gray-200 py-4 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <UiBaseInput placeholder="Dubai, Dubai Emirate..." icon="search" class="text-sm" />
            <UiBaseInput type="date" placeholder="Dates" class="text-sm" />
            <UiBaseInput placeholder="2 travelers, 1 room" class="text-sm" />
        </div>
        <UiBaseButton>Update Search</UiBaseButton>
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
                  <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Less than $100</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">$100 - $200</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">$200 - $300</span>
                </label>
              </div>
            </div>

            <!-- Property Type -->
            <div>
              <h4 class="font-medium text-sm text-gray-700 mb-2">Property Type</h4>
                <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Hotel</span>
                </label>
                <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Resort</span>
                </label>
                 <label class="flex items-center">
                   <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">Apartment</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="lg:col-span-3 space-y-4">
           <h2 class="text-xl font-bold text-gray-900 mb-4">{{ stays.length }} properties found</h2>
           
           <StayCard 
             v-for="stay in stays" 
             :key="stay.id" 
             :stay="stay"
             @select="selectStay" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stays = ref([
  {
    id: 1,
    name: 'Trendy Romantic Hotel Guangzhou Baoneng',
    location: 'Guangzhou',
    rating: 4.8,
    description: 'Experience luxury at its finest with breathtaking views of the city skyline.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    amenities: ['Pool', 'Spa', 'Free WiFi'],
    price: { amount: 156, total: 188, discount: 20 }
  },
  {
    id: 2,
    name: 'Mohood Leslie International Hotel',
    location: 'Guangzhou',
    rating: 4.5,
    description: 'A perfect blend of comfort and convenience in the heart of the business district.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    amenities: ['Fitness Center', 'Restaurant'],
    price: { amount: 74, total: 172 }
  },
  {
    id: 3,
    name: 'TRYP by Wyndham Dubai',
    location: 'Dubai',
    rating: 4.2,
    description: 'Modern hotel with stylish rooms and easy access to major attractions.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    amenities: ['Pool', 'Bar', 'Parking'],
    price: { amount: 71, total: 103, discount: 15 }
  }
])

const selectStay = (id: number) => {
  const stay = stays.value.find(s => s.id === id)
  navigateTo({
    path: '/checkout',
    query: {
      type: 'stay',
      id: stay?.id,
      name: stay?.name,
      price: stay?.price.total
    }
  })
}
</script>
