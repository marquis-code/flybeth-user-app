<template>
  <SideDrawer :visible="show" title="Fund Wallet" @close="$emit('close')">
    <div class="flex flex-col h-full bg-white relative">
      <div class="w-full flex flex-col items-center p-6">
        <div class="relative w-full max-w-sm flex flex-col items-center">
          <div class="flex flex-col items-center mb-8 text-center mt-6">
            <div class="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg mb-4">
              <Wallet class="w-6 h-6" />
            </div>
            <p class="text-black font-bold text-[10px] mt-1">Instant replenishment</p>
          </div>

          <!-- Step 1: Amount & Method Selection -->
          <div v-if="step === 1" class="w-full space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-black ml-1 uppercase">Amount</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-black">{{ currencySymbol }}</span>
                <input 
                  :value="formattedAmount" 
                  @input="handleAmountInput"
                  type="text" 
                  placeholder="0.00"
                  class="w-full h-14 bg-white border border-gray-200 rounded-xl pl-10 pr-4 text-xl font-black text-black focus:bg-white transition-all outline-none"
                />
              </div>
              <div v-if="amount" class="flex items-center gap-2 ml-1">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <p class="text-[10px] font-black text-blue-600">New Balance: {{ currencySymbol }}{{ formatNumber(parseFloat(amount) + (currentBalance || 0)) }}</p>
              </div>
            </div>

            <div class="space-y-2">
               <label class="text-[10px] font-black text-black ml-1 uppercase">Method</label>
               
               <button 
                 @click="selectedMethod = 'paystack'"
                 class="w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between group"
                 :class="selectedMethod === 'paystack' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'"
               >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="selectedMethod === 'paystack' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
                      <CreditCard class="w-4 h-4" />
                    </div>
                    <div class="text-left">
                      <span class="text-xs font-black text-black block">Paystack</span>
                      <span class="text-[10px] font-bold text-gray-500">Local NGN</span>
                    </div>
                  </div>
                  <div v-if="selectedMethod === 'paystack'" class="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white">
                    <Check class="w-2.5 h-2.5" />
                  </div>
               </button>

               <button 
                 @click="selectedMethod = 'stripe'"
                 class="w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between group"
                 :class="selectedMethod === 'stripe' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'"
               >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="selectedMethod === 'stripe' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
                      <Globe class="w-4 h-4" />
                    </div>
                    <div class="text-left">
                      <span class="text-xs font-black text-black block">Stripe</span>
                      <span class="text-[10px] font-bold text-gray-500">Intl USD</span>
                    </div>
                  </div>
                  <div v-if="selectedMethod === 'stripe'" class="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white">
                    <Check class="w-2.5 h-2.5" />
                  </div>
               </button>

               <button 
                 @click="selectedMethod = 'bank'"
                 class="w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between group"
                 :class="selectedMethod === 'bank' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'"
               >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="selectedMethod === 'bank' ? 'bg-black text-white' : 'bg-gray-100 text-black'">
                      <Building2 class="w-4 h-4" />
                    </div>
                    <div class="text-left">
                      <span class="text-xs font-black text-black block">Manual</span>
                      <span class="text-[10px] font-bold text-gray-500">Deposit</span>
                    </div>
                  </div>
                  <div v-if="selectedMethod === 'bank'" class="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white">
                    <Check class="w-2.5 h-2.5" />
                  </div>
               </button>
            </div>

            <button 
              @click="handleNext"
              :disabled="!amount || !selectedMethod || loading"
              class="w-full h-12 bg-black text-white rounded-xl font-black text-xs hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center uppercase mt-6"
            >
               <template v-if="loading">Processing...</template>
               <template v-else>Confirm Funding</template>
            </button>
          </div>

          <!-- Step 2: Details Flow -->
          <div v-if="step === 2" class="w-full space-y-6">
            <div v-if="selectedMethod === 'bank'" class="space-y-6">
               <div class="p-5 bg-white rounded-2xl border border-gray-200 space-y-4">
                  <div v-for="bank in bankAccounts" :key="bank._id" class="space-y-3">
                     <div class="flex flex-col">
                       <span class="text-[10px] font-black text-gray-500 uppercase">Bank</span>
                       <span class="text-xs font-black text-black">{{ bank.bankName }}</span>
                   </div>
                   <div class="flex flex-col">
                     <span class="text-[10px] font-black text-gray-500 uppercase">A/C Number</span>
                     <span class="text-sm font-black text-black">{{ bank.accountNumber }}</span>
                   </div>
                   <div class="flex flex-col">
                     <span class="text-[10px] font-black text-gray-500 uppercase">Name</span>
                     <span class="text-xs font-black text-black">{{ bank.accountName }}</span>
                   </div>
                </div>
             </div>

             <div class="space-y-3">
               <button 
                 @click="submitManualTransfer"
                 :disabled="loading"
                 class="w-full h-12 bg-black text-white rounded-xl font-black text-xs uppercase transition-all"
               >
                 Verify Payment
               </button>
               <button @click="step = 1" class="w-full text-xs rounded-lg py-4 bg-gray-100 font-black text-black hover:bg-gray-200">Change Method</button>
             </div>
          </div>

          <div v-else class="py-12 flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 animate-spin">
              <Globe class="w-5 h-5 text-blue-600" />
            </div>
            <p class="text-sm font-black text-black">Secure Redirecting...</p>
          </div>
        </div>
       </div>
      </div>
    </div>
  </SideDrawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Wallet, X, CreditCard, Globe, Building2, Check, Upload, ArrowRight } from 'lucide-vue-next'
import { paymentsApi } from '@/api_factory/modules/payments'
import { useCustomToast } from '@/composables/core/useCustomToast'
import SideDrawer from '@/components/ui/SideDrawer.vue'

const props = defineProps({
  show: Boolean,
  currency: { type: String, default: 'USD' },
  currentBalance: { type: Number, default: 0 }
})

const emit = defineEmits(['close', 'success'])
const { showToast } = useCustomToast()

const step = ref(1)
const amount = ref('')
const formattedAmount = ref('')
const selectedMethod = ref('')
const loading = ref(false)
const evidenceFile = ref<File | null>(null)
const bankAccounts = ref<any[]>([])

const currencySymbol = computed(() => {
  const c = props.currency?.toUpperCase() || 'USD'
  const symbols: any = { NGN: '₦', USD: '$', GBP: '£', EUR: '€', GHS: 'GH₵', KES: 'KSh' }
  return symbols[c] || c
})

const handleAmountInput = (e: any) => {
  let val = e.target.value.replace(/[^0-9.]/g, '')
  const parts = val.split('.')
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('')
  amount.value = val
  formattedAmount.value = formatNumber(val)
}

const formatNumber = (val: string | number) => {
  if (!val) return ''
  const num = typeof val === 'string' ? parseFloat(val) : val
  return isNaN(num) ? '' : new Intl.NumberFormat('en-US').format(num)
}

const handleFileUpload = (e: any) => {
  const file = e.target.files[0]
  if (file) evidenceFile.value = file
}

const handleNext = async () => {
  if (selectedMethod.value === 'bank') {
    loading.value = true
    try {
      const { data } = await paymentsApi.getBankAccounts(props.currency)
      bankAccounts.value = data.data || []
      step.value = 2
    } catch (error) {
      showToast({ title: 'Error', message: 'Fetch failed', toastType: 'error' })
    } finally { loading.value = false }
  } else { initializeGatewaySession() }
}

const initializeGatewaySession = async () => {
  loading.value = true
  step.value = 2
  try {
    const { data } = await paymentsApi.initializeTopUp({
      amount: parseFloat(amount.value),
      currency: selectedMethod.value === 'paystack' ? 'NGN' : 'USD',
      callbackUrl: window.location.href
    })
    if (data.success && (data.data.authorization_url || data.data.url)) {
      window.location.href = data.data.authorization_url || data.data.url
    }
  } catch (error) {
    showToast({ title: 'Error', message: 'Initialization failed', toastType: 'error' })
    step.value = 1
  } finally { loading.value = false }
}

const submitManualTransfer = async () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showToast({ title: 'Success', message: 'Under review', toastType: 'success' })
    emit('close')
  }, 2000)
}

watch(() => props.show, (val) => {
  if (val) {
    step.value = 1
    amount.value = ''
    formattedAmount.value = ''
    evidenceFile.value = null
    selectedMethod.value = ''
  }
})
</script>
