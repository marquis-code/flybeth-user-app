<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Header Section -->
    <div class="bg-brand-blue text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-brand-green font-black uppercase tracking-[0.3em] text-[10px]">Bundle & Save</span>
        <h1 class="text-5xl font-black tracking-tighter font-header mt-2">Vacation Packages</h1>
        <p class="text-white/60 font-bold mt-2">Save money by booking flights and stays together.</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search/Filters -->
      <div class="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 mb-10 flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-grow">
          <LocationPicker v-model="searchQuery.destination" placeholder="Search destinations..." id="packages-dest" />
        </div>
        <UiBaseButton variant="primary" size="lg" :loading="loading" @click="handleSearch" class="px-12">Search Packages</UiBaseButton>
      </div>

      <!-- Featured Packages -->
      <section v-if="featuredPackages.length" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Deals</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackageCard 
            v-for="pkg in featuredPackages" 
            :key="pkg._id || pkg.id" 
            :package="pkg"
            @select="selectPackage"
          />
        </div>
      </section>

      <!-- All Packages -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">All Vacation Packages</h2>
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        <div v-else-if="packages.length" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PackageCard 
            v-for="pkg in packages" 
            :key="pkg._id || pkg.id" 
            :package="pkg"
            @select="selectPackage"
          />
        </div>
        <EmptyState 
          v-else
          variant="packages"
          title="No packages found"
          message="We couldn't find vacation packages matching your search. Try a different destination."
          actionLabel="Explore Maldives"
          @action="searchQuery.destination = 'Maldives'; handleSearch();"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFetchAllPackages } from '@/composables/modules/packages/useFetchAllPackages';
import { useFetchFeaturedPackages } from '@/composables/modules/packages/useFetchFeaturedPackages';

const { loading, packages, fetchAllPackages } = useFetchAllPackages();
const { featuredPackages, fetchFeaturedPackages } = useFetchFeaturedPackages();

const searchQuery = ref({
  destination: ''
});

const handleSearch = () => {
  fetchAllPackages({ q: searchQuery.value.destination });
};

const selectPackage = (pkg: any) => {
  navigateTo({
    path: '/checkout',
    query: {
      type: 'package',
      id: pkg._id || pkg.id,
      name: pkg.name,
      price: pkg.price?.total || pkg.price?.amount
    }
  });
}

onMounted(() => {
  const route = useRoute();
  if (!route.query.q) {
    searchQuery.value.destination = 'Maldives';
  } else {
    searchQuery.value.destination = String(route.query.q);
  }
  fetchFeaturedPackages();
  handleSearch();
});
</script>
