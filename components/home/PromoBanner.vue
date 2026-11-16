<template>
  <!-- Rendered only when the API returns a live public coupon: we never show a
       made-up promo code that would fail at checkout. -->
  <section v-if="coupon" class="mx-auto max-w-7xl px-5 pb-4">
    <div class="rounded-lg border border-[#DBE2EA] bg-[#F4F7FB] p-6 sm:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0450A0]">Limited time</p>
          <h2 class="mt-2 text-2xl font-black tracking-tight text-[#0B1B33] sm:text-3xl">
            {{ coupon.headline || 'Start saving today. Never miss a promotion.' }}
          </h2>
          <p v-if="coupon.description" class="mt-2 max-w-xl text-sm leading-relaxed text-[#5F7185]">
            {{ coupon.description }}
          </p>
        </div>

        <div class="w-full max-w-md shrink-0">
          <div class="flex items-stretch gap-2 rounded-md border border-dashed border-[#B9C6E6] bg-white p-1.5">
            <div class="flex flex-1 items-center gap-2 px-3">
              <span class="text-[12px] font-medium text-[#5F7185]">Use promo code:</span>
              <span class="font-mono text-base font-bold tracking-wider text-[#0B1B33]">{{ coupon.code }}</span>
            </div>
            <button
              type="button"
              class="shrink-0 rounded bg-[#0450A0] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#03396F]"
              @click="copyCode"
            >{{ copied ? 'Copied' : 'Copy' }}</button>
          </div>

          <p class="mt-2 text-[11px] text-[#8A97A8]">
            <template v-if="expiryLabel">Expires {{ expiryLabel }}. </template>
            <template v-if="discountLabel">{{ discountLabel }}. </template>
            Restrictions apply.
            <NuxtLink :to="coupon.termsUrl || '/terms'" class="underline hover:text-[#0450A0]">Terms</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { couponsApi } from '@/api_factory/modules/coupons';
import { useSettings } from '@/composables/useSettings';

interface Coupon {
  code: string;
  headline?: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency: string;
  expiresAt?: string | null;
  termsUrl?: string;
}

const { formatPrice } = useSettings();
const coupon = ref<Coupon | null>(null);
const copied = ref(false);

const expiryLabel = computed(() => {
  if (!coupon.value?.expiresAt) return '';
  const d = new Date(coupon.value.expiresAt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

const discountLabel = computed(() => {
  if (!coupon.value) return '';
  return coupon.value.type === 'percentage'
    ? `${coupon.value.value}% off`
    : `${formatPrice(coupon.value.value)} off`;
});

const copyCode = async () => {
  if (!coupon.value) return;
  try {
    await navigator.clipboard.writeText(coupon.value.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    copied.value = false;
  }
};

onMounted(async () => {
  try {
    const res: any = await couponsApi.getActive(1);
    const items = res?.data?.data ?? res?.data ?? [];
    coupon.value = Array.isArray(items) && items.length ? items[0] : null;
  } catch {
    coupon.value = null; // no banner rather than a broken one
  }
});
</script>
