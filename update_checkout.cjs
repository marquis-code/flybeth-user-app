const fs = require('fs');

const path = 'pages/checkout.vue';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Cash App State
const cashAppState = `
// Cash App Integration State
const showCashAppWidget = ref(false)
const isAuthorizingCashApp = ref(false)
const cashAppOrderId = ref('')
const cashAppPnr = ref('')
const cashAppAmount = ref(0)
const cashAppCurrency = ref('USD')
const cashAppClientId = 'client_id_placeholder'

const closeCashAppWidget = () => {
  showCashAppWidget.value = false
}

const loadCashAppSdk = () => {
  return new Promise((resolve, reject) => {
    if ((window as any).CashApp) {
      initCashApp()
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://sandbox.paykit.cash.app/paykit.js'
    script.async = true
    script.onload = () => {
      initCashApp()
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initCashApp = async () => {
  try {
    const PayKit = (window as any).CashApp.PayKit
    const paykit = await PayKit(cashAppClientId, { environment: 'sandbox' })
    const elements = paykit.elements({ button: { theme: 'dark', shape: 'semicircle' } })
    await elements.mount('#cash-app-pay')
    
    // Create customer request
    paykit.customerRequest({
      actions: {
        payment: {
          amount: Math.round(cashAppAmount.value * 100),
          currency: cashAppCurrency.value,
          scope_id: 'merchant_id_placeholder' 
        }
      },
      redirect_url: window.location.href
    }).addEventListener('DELEGATE_REQUEST_APPROVED', async (event) => {
      const grantId = event.detail.grant.id
      isAuthorizingCashApp.value = true
      try {
        await paymentsApi.processCashAppPayment({
          bookingId: cashAppOrderId.value,
          grantId: grantId
        })
        router.push(\`/confirmation?pnr=\${cashAppPnr.value}&status=success\`)
      } catch (err) {
        showToast({ title: 'Payment Failed', message: 'Cash App authorization failed on backend', toastType: 'error' })
        isAuthorizingCashApp.value = false
      }
    }).addEventListener('DELEGATE_REQUEST_DECLINED', () => {
      showToast({ title: 'Payment Declined', message: 'Cash App declined the payment', toastType: 'error' })
    })
  } catch(e) {
    console.error('PayKit Initialization Error', e)
  }
}
`;

content = content.replace('// Klarna Integration State', cashAppState + '\n// Klarna Integration State');

// 2. Add Cash App UI
const cashAppModal = `
  <!-- Cash App Widget Modal -->
  <div v-if="showCashAppWidget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-white/50">
        <h3 class="text-xl font-bold text-black flex items-center gap-2">
           <span class="text-green-500 italic text-2xl">Cash App</span> Pay
        </h3>
        <button @click="closeCashAppWidget" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <XIcon class="w-5 h-5 text-black" />
        </button>
      </div>
      <div class="p-12 overflow-y-auto flex flex-col items-center justify-center">
        <p class="text-center text-gray-500 mb-8 font-medium">Click the button below to authorize the payment via Cash App.</p>
        <div id="cash-app-pay" class="w-full max-w-[280px]"></div>
      </div>
    </div>
  </div>
`;

content = content.replace('<!-- Klarna Widget Modal -->', cashAppModal + '\n  <!-- Klarna Widget Modal -->');


// 3. Update handlePayment to catch cashapp
const klarnaInitIndex = content.indexOf(`          "paystack",`);
if(klarnaInitIndex !== -1) {
  content = content.replace(`          "paystack",
          "stripe"`, `          "paystack",
          "stripe",
          "cashapp"`);
}

// And redirect Cash App to Cash App logic
const sdkInitLogic = `            if (responseData.url === 'klarna_sdk' && responseData.reference) {`;
const cashAppRedirectLogic = `            if (paymentInfo.provider === 'cashapp') {
              showBrandedLoader.value = false;
              cashAppOrderId.value = booking._id;
              cashAppPnr.value = booking.pnr;
              cashAppAmount.value = booking.pricing.totalAmount;
              cashAppCurrency.value = booking.pricing.currency || 'USD';
              showCashAppWidget.value = true;
              
              await loadCashAppSdk();
              return;
            } else if (responseData.url === 'klarna_sdk' && responseData.reference) {`;

content = content.replace(sdkInitLogic, cashAppRedirectLogic);

fs.writeFileSync(path, content, 'utf8');
