<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-5">
      <div
        v-for="partner in partners"
        :key="partner.name"
        class="h-10 sm:h-11 flex items-center justify-center shrink-0"
      >
        <img
          :src="partner.src"
          :alt="partner.name"
          :style="{ maxHeight: partner.height }"
          class="w-auto object-contain transition-all duration-200 hover:scale-105"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import affirm from '@/assets/img/partners/affirm.png';
import amex from '@/assets/img/partners/american-express.png';
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
  { name: 'Visa',           src: visa,     height: '18px' },
  { name: 'Mastercard',     src: mastercard, height: '28px' },
  { name: 'American Express', src: amex,  height: '32px' },
  { name: 'Affirm',         src: affirm,   height: '22px' },
  { name: 'PayPal',         src: paypal,   height: '26px' },
  { name: 'Nanta',          src: nanta,    height: '36px' },
  { name: 'NCAA',           src: ncaa,     height: '36px' },
  { name: 'IATA',           src: iata,     height: '34px' },
  { name: 'IATAN',          src: itan,     height: '32px' },
];
</script>
