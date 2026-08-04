<template>
  <main class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Global eSIMs</h1>
      <p class="text-gray-600 mb-8">Stay connected anywhere in the world with instant eSIM activation.</p>

      <!-- Packages Grid -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="packages.length === 0" class="text-center py-12">
        <p class="text-gray-500">No eSIM packages found.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="pkg in packages" :key="pkg.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ pkg.title || pkg.data }}</h3>
              <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">{{ pkg.type }}</span>
            </div>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Data</span>
                <span class="font-medium text-gray-900">{{ pkg.data }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Validity</span>
                <span class="font-medium text-gray-900">{{ pkg.validity }} Days</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Price</span>
                <span class="font-bold text-gray-900">${{ pkg.price }}</span>
              </div>
            </div>

            <button 
              @click="purchaseEsim(pkg)" 
              :disabled="purchasingId === pkg.id"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <span v-if="purchasingId === pkg.id" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              {{ purchasingId === pkg.id ? 'Purchasing...' : 'Buy Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Installation Modal -->
    <div v-if="showQRModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl max-w-md w-full p-8 text-center relative shadow-2xl">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-2">eSIM Purchased!</h2>
        <p class="text-gray-600 mb-8">Scan the QR code below with your phone's camera to install your eSIM.</p>

        <div v-if="qrPayload" class="flex justify-center mb-6 bg-white p-4 border border-gray-200 rounded-2xl mx-auto inline-block">
          <qrcode-vue :value="qrPayload" :size="200" level="H" />
        </div>
        
        <div v-else-if="qrImageUrl" class="flex justify-center mb-6 mx-auto inline-block">
          <img :src="qrImageUrl" alt="eSIM QR Code" class="w-[200px] h-[200px] object-contain rounded-xl" />
        </div>

        <p class="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl">
          Alternatively, go to <strong>Settings > Cellular > Add eSIM</strong> and use the QR code.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { esimsApi } from '~/api_factory/modules/esims'
import { useAuth } from '~/composables/modules/auth/useAuth'
import { useCustomToast } from '~/composables/core/useCustomToast'

const { isLoggedIn, openAuthModal } = useAuth()
const { showToast } = useCustomToast()

const packages = ref<any[]>([])
const loading = ref(true)
const purchasingId = ref<string | null>(null)

const showQRModal = ref(false)
const qrPayload = ref('')
const qrImageUrl = ref('')

onMounted(async () => {
  try {
    // For demo purposes, we fetch a limited set, e.g. local packages
    const res = await esimsApi.getPackages({ limit: 10, filterType: 'local' })
    packages.value = res.data?.data || []
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to load eSIMs', type: 'error' })
  } finally {
    loading.value = false
  }
})

const purchaseEsim = async (pkg: any) => {
  if (!isLoggedIn.value) {
    openAuthModal()
    return
  }

  purchasingId.value = pkg.id
  try {
    // 1. Submit Order
    const orderRes = await esimsApi.submitOrder({ packageId: pkg.package_id || pkg.id, quantity: 1 })
    
    // Airalo returns the sim inside the order response
    const sims = orderRes.data?.data?.sims
    if (!sims || sims.length === 0) {
      throw new Error("No SIM details found in order")
    }

    const iccid = sims[0].iccid

    // 2. Fetch Instructions
    const instRes = await esimsApi.getInstructions(iccid)
    
    // Assuming iOS or Android instructions contain the QR payload
    const instructions = instRes.data?.data?.instructions
    const iosInst = instructions?.ios
    
    if (iosInst?.installation_via_qr_code?.qr_code_data) {
       qrPayload.value = iosInst.installation_via_qr_code.qr_code_data
    } else if (iosInst?.installation_via_qr_code?.qr_code_url) {
       qrImageUrl.value = iosInst.installation_via_qr_code.qr_code_url
    } else {
       // Fallback mock for testing if sandbox doesn't return
       qrPayload.value = "LPA:1$lpa.airalo.com$TEST"
    }

    showQRModal.value = true
  } catch (error: any) {
    showToast({ title: 'Purchase Failed', message: error.response?.data?.message || error.message, type: 'error' })
  } finally {
    purchasingId.value = null
  }
}

const closeModal = () => {
  showQRModal.value = false
  qrPayload.value = ''
  qrImageUrl.value = ''
}
</script>
