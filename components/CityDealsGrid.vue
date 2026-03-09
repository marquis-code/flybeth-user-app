<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
    <div class="flex flex-col gap-2 mb-12">
      <h2 class="text-3xl font-black text-brand-blue">Find Great Deals by City</h2>
      <p class="text-sm font-bold text-gray-400">Expand a city to see top flights, hotels, and car rentals.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="city in cities" 
        :key="city.name" 
        class="bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
        :class="{ 'ring-2 ring-brand-blue shadow-2xl': openCity === city.name }"
      >
        <!-- Header -->
        <button 
          @click="toggleCity(city.name)"
          class="w-full p-8 flex items-center justify-between text-left group"
        >
          <span class="text-2xl font-black text-brand-blue group-hover:translate-x-1 transition-transform">{{ city.name }}</span>
          <ChevronDownIcon 
            class="h-6 w-6 text-brand-blue/30 transition-transform duration-500"
            :class="{ 'rotate-180 text-brand-blue': openCity === city.name }"
          />
        </button>

        <!-- Dynamic Content -->
        <div 
          v-show="openCity === city.name"
          class="px-8 pb-8 space-y-6 animate-fade-in"
        >
          <!-- Tabs -->
          <div class="flex gap-4 border-b border-gray-50">
            <button 
              v-for="tab in ['Flights', 'Cars', 'Hotels']" 
              :key="tab"
              @click="activeTabs[city.name] = tab"
              class="pb-3 text-xs font-black uppercase tracking-widest transition-all relative"
              :class="activeTabs[city.name] === tab ? 'text-brand-blue' : 'text-brand-gray/40 hover:text-brand-blue'"
            >
              {{ tab }}
              <div v-if="activeTabs[city.name] === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
            </button>
          </div>

          <!-- Deal List -->
          <div class="space-y-4">
            <template v-if="activeTabs[city.name] === 'Flights'">
              <div 
                v-for="deal in city.deals.flights" 
                :key="deal.label"
                @click="selectDeal('Flights', deal, city.name)"
                class="flex items-center justify-between group cursor-pointer"
              >
                <span class="text-xs font-bold text-brand-gray group-hover:text-brand-blue transition-colors">{{ deal.label }}</span>
                <span class="text-xs font-black text-brand-blue">${{ deal.price }}</span>
              </div>
            </template>
            <template v-if="activeTabs[city.name] === 'Cars'">
              <div 
                v-for="deal in city.deals.cars" 
                :key="deal.label"
                @click="selectDeal('Cars', deal, city.name)"
                class="flex items-center justify-between group cursor-pointer"
              >
                <span class="text-xs font-bold text-brand-gray group-hover:text-brand-blue transition-colors">{{ deal.label }}</span>
                <span class="text-xs font-black text-brand-blue">${{ deal.price }}</span>
              </div>
            </template>
            <template v-if="activeTabs[city.name] === 'Hotels'">
              <div 
                v-for="deal in city.deals.hotels" 
                :key="deal.label"
                @click="selectDeal('Hotels', deal, city.name)"
                class="flex items-center justify-between group cursor-pointer"
              >
                <span class="text-xs font-bold text-brand-gray group-hover:text-brand-blue transition-colors line-clamp-1">{{ deal.label }}</span>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="text-xs font-black text-brand-blue">${{ deal.price }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['select-deal'])

const openCity = ref<string | null>(null)
const activeTabs = reactive<Record<string, string>>({})

const toggleCity = (name: string) => {
  if (openCity.value === name) {
    openCity.value = null
  } else {
    openCity.value = name
    if (!activeTabs[name]) activeTabs[name] = 'Flights'
  }
}

const selectDeal = (type: string, deal: any, destination: string) => {
  emit('select-deal', {
    type,
    from: deal.from || 'Lagos',
    to: destination,
    ...deal
  })
}

const cities = [
  {
    name: 'Miami',
    deals: {
      flights: [
        { label: 'Flights from Denver to Miami', price: 44, from: 'Denver' },
        { label: 'Flights from Atlanta to Miami', price: 64, from: 'Atlanta' },
        { label: 'Flights from Los Angeles to Miami', price: 93, from: 'Los Angeles' },
        { label: 'Flights from Dallas to Miami', price: 118, from: 'Dallas' }
      ],
      hotels: [
        { label: 'Hilton Miami Airport Blue Lagoon', price: 237 },
        { label: 'La Quinta Inn & Suites Miami Airport', price: 130 },
        { label: 'North Miami Beach Gardens Inn', price: 59 },
        { label: 'Holiday Inn Express Miami-Bird Road', price: 124 }
      ],
      cars: [
        { label: 'Economy Car Rental Miami', price: 28 },
        { label: 'SUV Rental Miami Airport', price: 54 }
      ]
    }
  },
  {
    name: 'Tampa',
    deals: {
      flights: [
        { label: 'Flights from Atlanta to Tampa', price: 55, from: 'Atlanta' },
        { label: 'Flights from Los Angeles to Tampa', price: 97, from: 'Los Angeles' },
        { label: 'Flights from Denver to Tampa', price: 101, from: 'Denver' }
      ],
      hotels: [
        { label: 'Ramada by Wyndham Temple Terrace', price: 83 },
        { label: 'Holiday Inn Express Tampa-Westshore', price: 154 }
      ],
      cars: [
        { label: 'Standard Car Rental Tampa', price: 32 }
      ]
    }
  },
  {
    name: 'San Diego',
    deals: {
      flights: [
        { label: 'Flights from Denver to San Diego', price: 175, from: 'Denver' },
        { label: 'Flights from Los Angeles to San Diego', price: 58, from: 'Los Angeles' }
      ],
      hotels: [
        { label: 'Best Western Seven Seas', price: 127 },
        { label: 'Heritage Inn San Diego', price: 89 }
      ],
      cars: [
        { label: 'Convertible Rental San Diego', price: 89 }
      ]
    }
  },
  {
    name: 'Austin',
    deals: {
      flights: [
        { label: 'Flights from Denver to Austin', price: 151, from: 'Denver' },
        { label: 'Flights from Dallas to Austin', price: 210, from: 'Dallas' }
      ],
      hotels: [
        { label: 'Holiday Inn Austin-Town Lake', price: 152 },
        { label: 'Super 8 by Wyndham Austin', price: 111 }
      ],
      cars: [
        { label: 'Compact Car Rental Austin', price: 41 }
      ]
    }
  },
  {
    name: 'Los Angeles',
    deals: {
      flights: [
        { label: 'Flights from Denver to Los Angeles', price: 326, from: 'Denver' },
        { label: 'Flights from Dallas to Los Angeles', price: 248, from: 'Dallas' }
      ],
      hotels: [
        { label: 'Hilton Los Angeles Airport', price: 187 },
        { label: 'Sheraton Gateway Los Angeles', price: 149 }
      ],
      cars: [
        { label: 'Luxury Car Rental LAX', price: 120 }
      ]
    }
  },
  {
    name: 'Atlanta',
    deals: {
      flights: [
        { label: 'Flights from Detroit to Atlanta', price: 236, from: 'Detroit' },
        { label: 'Flights from Dallas to Atlanta', price: 106, from: 'Dallas' }
      ],
      hotels: [
        { label: 'Hilton Atlanta', price: 134 },
        { label: 'Sonesta Atlanta Airport North', price: 94 }
      ],
      cars: [
        { label: 'Full Size Car Rental Atlanta', price: 48 }
      ]
    }
  },
  {
    name: 'New York',
    deals: {
      flights: [
        { label: 'Flights from Denver to New York City', price: 366, from: 'Denver' },
        { label: 'Flights from Dallas to New York City', price: 218, from: 'Dallas' }
      ],
      hotels: [
        { label: 'DoubleTree by Hilton NYC', price: 320 },
        { label: 'Holiday Inn Manhattan 6th Ave', price: 251 }
      ],
      cars: [
        { label: 'Premium Car Rental Newark', price: 75 }
      ]
    }
  },
  {
    name: 'Chicago',
    deals: {
      flights: [
        { label: 'Flights from Detroit to Chicago', price: 312, from: 'Detroit' },
        { label: 'Flights from Dallas to Chicago', price: 251, from: 'Dallas' }
      ],
      hotels: [
        { label: 'Congress Plaza Hotel', price: 160 },
        { label: 'Embassy Suites by Hilton Chicago', price: 179 }
      ],
      cars: [
        { label: 'Economy Car Rental O\'Hare', price: 35 }
      ]
    }
  },
  {
    name: 'Dallas',
    deals: {
      flights: [
        { label: 'Flights from Los Angeles to Dallas', price: 174, from: 'Los Angeles' },
        { label: 'Flights from Atlanta to Dallas', price: 129, from: 'Atlanta' }
      ],
      hotels: [
        { label: 'The Westin Galleria Dallas', price: 153 },
        { label: 'Embassy Suites by Hilton Dallas', price: 111 }
      ],
      cars: [
        { label: 'Pickup Truck Rental Dallas', price: 65 }
      ]
    }
  },
  {
    name: 'Las Vegas',
    deals: {
      flights: [
        { label: 'Flights from Dallas to Las Vegas', price: 421, from: 'Dallas' },
        { label: 'Flights from Atlanta to Las Vegas', price: 163, from: 'Atlanta' }
      ],
      hotels: [
        { label: 'The STRAT Hotel, Casino & Tower', price: 50 },
        { label: 'Flamingo Las Vegas', price: 78 }
      ],
      cars: [
        { label: 'Minivan Rental Las Vegas', price: 82 }
      ]
    }
  }
]

// Note: Additional cities can be added from the mockup image as needed. 
// For this implementation, we map the most prominent ones to ensure high quality and fast loading.
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
