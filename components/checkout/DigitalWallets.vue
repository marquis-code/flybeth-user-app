<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-sm text-gray-500">Loading digital wallets...</div>
    <div v-if="applePaySupported" id="applepay-container" class="w-full"></div>
    <div v-if="googlePaySupported" id="googlepay-container" class="w-full"></div>
    <div v-if="!loading && !applePaySupported && !googlePaySupported" class="text-sm text-red-500">
      Digital wallets are not supported on this browser/device.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig, useNuxtApp } from '#app'

const props = defineProps({
  amount: { type: Number, required: true },
  currency: { type: String, required: true }
})

const emit = defineEmits(['authorize'])

const loading = ref(true)
const applePaySupported = ref(false)
const googlePaySupported = ref(false)
const config = useRuntimeConfig()

onMounted(() => {
  const script = document.createElement('script')
  const clientId = config.public.paypalClientId
  const mode = config.public.paypalMode || 'sandbox'
  const domain = mode === 'sandbox' ? 'www.sandbox.paypal.com' : 'www.paypal.com'
  script.src = `https://${domain}/sdk/js?client-id=${clientId}&components=applepay,googlepay,buttons&currency=${props.currency}`
  script.async = true
  
  script.onload = () => {
    loading.value = false
    initWallets()
  }
  
  script.onerror = () => {
    loading.value = false
    console.error('Failed to load PayPal SDK')
  }
  
  document.body.appendChild(script)
})

const initWallets = async () => {
  const paypal = (window as any).paypal
  
  if (!paypal) return

  try {
    if (paypal.Applepay) {
      const applepay = paypal.Applepay();
      const { isEligible } = await applepay.config();
      if (isEligible) {
        applePaySupported.value = true;
        // Wait for next tick so container is rendered
        setTimeout(() => {
          paypal.Buttons({
            fundingSource: paypal.FUNDING.APPLEPAY,
            style: {
              height: 48,
              shape: 'rect',
            },
            createOrder: async () => {
              return await new Promise(resolve => {
                emit('authorize', { provider: 'paypal', channel: 'applepay', resolveOrder: resolve })
              })
            },
            onApprove: async (data: any) => {
              emit('authorize', { provider: 'paypal', channel: 'applepay_approve', data })
            }
          }).render('#applepay-container');
        }, 50)
      }
    }
  } catch (err) {
    console.warn('Apple Pay not supported', err)
  }

  try {
    if (paypal.Googlepay) {
      const googlepay = paypal.Googlepay();
      const { isEligible } = await googlepay.config();
      if (isEligible) {
        googlePaySupported.value = true;
        setTimeout(() => {
          paypal.Buttons({
            fundingSource: paypal.FUNDING.GOOGLEPAY,
            style: {
              height: 48,
              shape: 'rect',
            },
            createOrder: async () => {
              return await new Promise(resolve => {
                emit('authorize', { provider: 'paypal', channel: 'googlepay', resolveOrder: resolve })
              })
            },
            onApprove: async (data: any) => {
              emit('authorize', { provider: 'paypal', channel: 'googlepay_approve', data })
            }
          }).render('#googlepay-container');
        }, 50)
      }
    }
  } catch (err) {
    console.warn('Google Pay not supported', err)
  }
}
</script>
