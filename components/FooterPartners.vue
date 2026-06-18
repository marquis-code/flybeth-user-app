<template>
  <div class="w-full max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:flex lg:flex-wrap lg:justify-center items-center gap-x-6 gap-y-8 md:gap-x-8 lg:gap-10">
      <div
        v-for="partner in partners"
        :key="partner.name"
        class="h-10 md:h-12 flex items-center justify-center w-full lg:w-auto"
      >
        <img
          :src="partner.src"
          :alt="partner.name"
          :style="{ maxHeight: partner.height }"
          class="w-auto object-contain transition-all duration-300"
        />
      </div>
    </div>
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
import nanta from '@/assets/img/partners/nanta.png';
import ncaa from '@/assets/img/partners/ncaa.png';
import iata from '@/assets/img/partners/iata.png';
import itan from '@/assets/img/partners/itan.webp';

interface Partner {
  name: string;
  src: string;
  height: string;
}

const partners: Partner[] = [
  { name: 'Norton Secured', src: norton,   height: '36px' },
  { name: 'IATAN',          src: iatan,    height: '30px' },
  { name: 'Visa',           src: visa,     height: '18px' },
  { name: 'Mastercard',     src: mastercard, height: '28px' },
  { name: 'American Express', src: amex,  height: '32px' },
  { name: 'Affirm',         src: affirm,   height: '22px' },
  { name: 'PayPal',         src: paypal,   height: '26px' },
  { name: 'Nanta',          src: nanta,    height: '36px' },
  { name: 'NCAA',           src: ncaa,     height: '36px' },
  { name: 'IATA',           src: iata,     height: '34px' },
  { name: 'ITAN',           src: itan,     height: '32px' },
];
</script>