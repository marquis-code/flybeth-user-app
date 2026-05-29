<template>
  <div class="flex flex-wrap justify-center items-center gap-6 lg:gap-10 bg-white">
    <img
      v-for="partner in partners"
      :key="partner.name"
      :src="partner.src"
      :alt="partner.name"
      :style="{ height: partner.height, width: partner.width }"
      class="object-contain transition-all duration-300"
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
import nanta from '@/assets/img/partners/nanta.png';
import ncaa from '@/assets/img/partners/ncaa.png';
import iata from '@/assets/img/partners/iata.png';
import itan from '@/assets/img/partners/itan.webp';

interface Partner {
  name: string;
  src: string;
  height?: string;
  width?: string;
}

const partners: Partner[] = [
  { name: 'Norton Secured', src: norton,   height: '48px', width: 'auto' },
  { name: 'IATAN',          src: iatan,    height: '40px', width: 'auto' },
  { name: 'Visa',           src: visa,     height: '32px', width: 'auto' },
  { name: 'Mastercard',     src: mastercard, height: '40px', width: 'auto' },
  { name: 'American Express', src: amex,  height: '40px', width: 'auto' },
  { name: 'Affirm',         src: affirm,   height: '28px', width: 'auto' },
  { name: 'PayPal',         src: paypal,   height: '36px', width: 'auto' },
  { name: 'Nanta',          src: nanta,    height: '50px', width: 'auto' },
  { name: 'NCAA',           src: ncaa,     height: '48px', width: 'auto' },
  { name: 'IATA',           src: iata,     height: '48px', width: 'auto' },
  { name: 'ITAN',           src: itan,     height: '45px', width: 'auto' },
];
</script>