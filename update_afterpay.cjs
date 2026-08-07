const fs = require('fs');

const path = 'pages/checkout.vue';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Afterpay State
const afterpayState = `
// Afterpay Integration State
const isAuthorizingAfterpay = ref(false)
const afterpayOrderId = ref('')
const afterpayPnr = ref('')
const userCountryCode = ref('US')

const loadAfterpaySdk = (token) => {
  return new Promise((resolve, reject) => {
    if ((window as any).AfterPay) {
      initAfterpay(token)
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://portal.sandbox.afterpay.com/afterpay.js'
    script.async = true
    script.onload = () => {
      initAfterpay(token)
      resolve(true)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initAfterpay = (token) => {
  const AfterPay = (window as any).AfterPay
  if (!AfterPay) {
    showToast({ title: 'Error', message: 'Afterpay SDK not found', toastType: 'error' })
    return
  }
  
  // Dynamically set country code based on browser locale
  const locale = navigator.language
  if (locale && locale.includes('-')) {
    userCountryCode.value = locale.split('-')[1].toUpperCase()
  }

  AfterPay.initialize({ countryCode: userCountryCode.value })
  
  AfterPay.onComplete = async (event) => {
    if (event.data.status === "SUCCESS") {
      isAuthorizingAfterpay.value = true
      try {
        await paymentsApi.authorizeBnpl({
          bookingId: afterpayOrderId.value,
          provider: 'afterpay',
          checkoutToken: token,
        })
        router.push(\`/confirmation?pnr=\${afterpayPnr.value}&status=success\`)
      } catch (err) {
        showToast({ title: 'Payment Failed', message: 'Afterpay authorization failed on backend', toastType: 'error' })
        isAuthorizingAfterpay.value = false
      }
    } else {
      isAuthorizingAfterpay.value = false
      showToast({ title: 'Payment Cancelled', message: 'Afterpay checkout was cancelled', toastType: 'error' })
    }
  }

  AfterPay.open()
  AfterPay.transfer({ token: token })
}
`;

content = content.replace('// Cash App Integration State', afterpayState + '\n// Cash App Integration State');

// 2. Add Afterpay logic to handlePayment
const klarnaInitLogic = `} else if (responseData.url === 'klarna_sdk' && responseData.reference) {`;
const afterpayRedirectLogic = `} else if (responseData.url === 'afterpay_sdk' && responseData.reference) {
              showBrandedLoader.value = false;
              afterpayOrderId.value = booking._id;
              afterpayPnr.value = booking.pnr;
              await loadAfterpaySdk(responseData.reference);
              return;
            } else if (responseData.url === 'klarna_sdk' && responseData.reference) {`;

content = content.replace(klarnaInitLogic, afterpayRedirectLogic);

fs.writeFileSync(path, content, 'utf8');
