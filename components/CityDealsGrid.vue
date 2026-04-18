<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div class="flex flex-col gap-3">
        <h2 class="text-4xl  text-gray-900 tracking-tight">Find Great Deals by City</h2>
        <p class="text-sm font-bold text-gray-400 max-w-lg leading-relaxed">
          Explore curated savings across top destinations. Select a city to discover the best flights, premier stays, and car rentals.
        </p>
      </div>
      <div class="flex gap-2">
         <button @click="scroll('left')" class="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <ChevronLeftIcon class="h-5 w-5 text-gray-400" />
         </button>
         <button @click="scroll('right')" class="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <ChevronRightIcon class="h-5 w-5 text-gray-400" />
         </button>
      </div>
    </div>

    <div ref="scrollContainer" class="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory scroll-smooth">
      <div 
        v-for="city in cities" 
        :key="city.name" 
        class="flex-shrink-0 w-[400px] snap-start"
      >
        <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden group h-[520px] flex flex-col">
          <!-- City Image Header -->
          <div class="h-48 relative overflow-hidden flex-shrink-0">
            <img :src="city.image" :alt="city.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-6 left-8">
              <h3 class="text-2xl  text-white leading-none">{{ city.name }}</h3>
              <p class="text-[10px] text-white/70 uppercase tracking-widest mt-1 font-bold">Starting from ${{ Math.min(...Object.values(city.deals).flat().map((d: any) => d.price)) }}</p>
            </div>
          </div>

          <!-- Internal Tabs -->
          <div class="flex-1 p-8 flex flex-col">
            <div class="flex gap-6 mb-8 border-b border-gray-50">
              <button 
                v-for="tab in ['Flights', 'Hotels', 'Cars']" 
                :key="tab"
                @click="activeTabs[city.name] = tab"
                class="pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative"
                :class="activeTabs[city.name] === tab ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-900'"
              >
                {{ tab }}
                <div v-show="activeTabs[city.name] === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full animate-grow"></div>
              </button>
            </div>

            <!-- List Content -->
            <div class="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <TransitionGroup v-if="activeTabs[city.name]" name="list" tag="div" class="space-y-3">
                <div 
                  v-for="deal in ((city.deals as any)[(activeTabs[city.name] as string).toLowerCase()] || [])" 
                  :key="deal.label"
                  @click="selectDeal(activeTabs[city.name] as string, deal, city.name)"
                  class="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-brand-blue/5 border border-transparent hover:border-brand-blue/10 transition-all cursor-pointer group/item"
                >
                  <div class="flex flex-col gap-0.5">
                    <span class="text-xs font-bold text-gray-900 group-hover/item:text-brand-blue transition-colors">{{ deal.label }}</span>
                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ activeTabs[city.name] === 'Flights' ? 'One Way' : 'Per Night' }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-sm  text-gray-900">${{ deal.price }}</span>
                    <div class="h-6 w-6 rounded-full bg-white border border-gray-100 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <ChevronRightIcon class="h-3 w-3 text-brand-blue" />
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
            
            <button 
              @click="toggleAllDeals(city.name)"
              class="mt-6 w-full py-4 text-[10px] flex items-center justify-center gap-2 border border-brand-blue/10 rounded-xl font-bold uppercase tracking-widest text-brand-blue hover:bg-brand-blue hover:text-white transition-all active:scale-95"
            >
              See all {{ city.name }} deals
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['select-deal'])
const scrollContainer = ref<HTMLElement | null>(null)

const activeTabs = reactive<Record<string, string>>({})

const scroll = (direction: 'left' | 'right') => {
  if (!scrollContainer.value) return
  const offset = 432 // Card width + gap
  scrollContainer.value.scrollBy({ left: direction === 'left' ? -offset : offset, behavior: 'smooth' })
}

const selectDeal = (type: string, deal: any, destination: string) => {
  emit('select-deal', {
    type,
    from: deal.from || 'Lagos',
    to: destination,
    ...deal
  })
}

const toggleAllDeals = (name: string) => {
  console.log('Toggle all for', name)
}

const cities: any = [
  {
    name: 'Miami',
    image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&q=80&w=800',
    deals: {
      flights: [
        { label: 'From Dallas to Miami', price: 118, from: 'Dallas' },
        { label: 'From Atlanta to Miami', price: 64, from: 'Atlanta' },
        { label: 'From Denver to Miami', price: 44, from: 'Denver' }
      ],
      hotels: [
        { label: 'Hilton Miami Airport', price: 237 },
        { label: 'North Miami Beach Inn', price: 59 },
        { label: 'Holiday Inn Express', price: 124 }
      ],
      cars: [
        { label: 'Economy Car Rental', price: 28 },
        { label: 'SUV Rental Airport', price: 54 }
      ]
    }
  },
  {
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
    deals: {
      flights: [
        { label: 'From Dallas to NYC', price: 218, from: 'Dallas' },
        { label: 'From Denver to NYC', price: 366, from: 'Denver' }
      ],
      hotels: [
        { label: 'DoubleTree by Hilton', price: 320 },
        { label: 'Holiday Inn Manhattan', price: 251 }
      ],
      cars: [
        { label: 'Premium Rental Newark', price: 75 }
      ]
    }
  },
  {
    name: 'Las Vegas',
    image: 'https://images.unsplash.com/photo-1605833559746-6d16fd329c32?auto=format&fit=crop&q=80&w=800',
    deals: {
      flights: [
        { label: 'From Atlanta to Vegas', price: 163, from: 'Atlanta' },
        { label: 'From Dallas to Vegas', price: 421, from: 'Dallas' }
      ],
      hotels: [
        { label: 'Flamingo Las Vegas', price: 78 },
        { label: 'The STRAT Hotel', price: 50 }
      ],
      cars: [
        { label: 'Minivan Rental', price: 82 }
      ]
    }
  },
  {
    name: 'Chicago',
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=800',
    deals: {
      flights: [
        { label: 'From Detroit to Chicago', price: 312, from: 'Detroit' },
        { label: 'From Dallas to Chicago', price: 251, from: 'Dallas' }
      ],
      hotels: [
        { label: 'Congress Plaza Hotel', price: 160 },
        { label: 'Embassy Suites Hilton', price: 179 }
      ],
      cars: [
        { label: 'Economy Rental O\'Hare', price: 35 }
      ]
    }
  },
  {
    name: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1534067783520-218023f14db1?auto=format&fit=crop&q=80&w=800',
    deals: {
      flights: [
        { label: 'From Dallas to LA', price: 248, from: 'Dallas' },
        { label: 'From Denver to LA', price: 326, from: 'Denver' }
      ],
      hotels: [
        { label: 'Sheraton Gateway LA', price: 149 },
        { label: 'Hilton LA Airport', price: 187 }
      ],
      cars: [
        { label: 'Luxury Car Rental', price: 120 }
      ]
    }
  }
]

onMounted(() => {
  cities.forEach((city: any) => {
    activeTabs[city.name] = 'Flights'
  })
})
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.animate-grow {
  animation: grow 0.3s ease-out;
}

@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
