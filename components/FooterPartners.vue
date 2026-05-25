<template>
  <div class="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
    <img 
      v-for="partner in partners" 
      :key="partner.name" 
      :src="partner.src" 
      :alt="partner.name" 
      class="h-7 sm:h-8 lg:h-10 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
    />
  </div>
</template>

<script setup lang="ts">
import affirm from '@/assets/img/partners/affirm.png';
import amex from '@/assets/img/partners/american-express.png';
import iatan from '@/assets/img/partners/logo-iatan-trans.png';
import mastercard from '@/assets/img/partners/master-card.png';
import norton from '@/assets/img/partners/norton-secured.webp';
import paypal from '@/assets/img/partners/paypal.png';
import visa from '@/assets/img/partners/visa.png';

const partners = [
  { name: 'Norton Secured', src: norton },
  { name: 'IATAN', src: iatan },
  { name: 'Visa', src: visa },
  { name: 'Mastercard', src: mastercard },
  { name: 'American Express', src: amex },
  { name: 'Affirm', src: affirm },
  { name: 'PayPal', src: paypal }
];
</script>
