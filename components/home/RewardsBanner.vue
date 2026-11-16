<template>
  <!-- Shown only when the benefits programme is enabled in system config, so we
       never advertise a discount that is not actually configured. -->
  <section v-if="program.enabled" class="mx-auto max-w-7xl px-5 py-10">
    <div class="overflow-hidden rounded-lg border border-[#DBE2EA] bg-white">
      <div class="flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between lg:p-8">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#0450A0]/[0.08] text-[#0450A0]">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8L12 3z" />
            </svg>
          </span>
          <div>
            <h2 class="text-xl font-black tracking-tight text-[#0B1B33] sm:text-2xl">{{ program.programName }}</h2>
            <p v-if="program.maxDiscountPercent" class="mt-1 text-sm text-[#5F7185]">
              Save up to {{ program.maxDiscountPercent }}% on packages<template v-if="program.maxDiscountCap"> ({{ formatPrice(program.maxDiscountCap) }} max)</template>.
            </p>
            <ul v-if="program.benefits?.length" class="mt-3 space-y-1.5">
              <li v-for="benefit in program.benefits" :key="benefit" class="flex items-start gap-2 text-[13px] text-[#44546A]">
                <svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0450A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                {{ benefit }}
              </li>
            </ul>
          </div>
        </div>

        <NuxtLink
          to="/packages"
          class="shrink-0 rounded-md bg-[#EB4405] px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#C93A04]"
        >Plan my trip</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';
import { useSettings } from '@/composables/useSettings';

interface RewardsProgram {
  enabled: boolean;
  programName: string;
  maxDiscountPercent: number;
  maxDiscountCap: number;
  pointsPerDollar: number;
  benefits: string[];
}

const { formatPrice } = useSettings();
const program = ref<RewardsProgram>({
  enabled: false,
  programName: '',
  maxDiscountPercent: 0,
  maxDiscountCap: 0,
  pointsPerDollar: 0,
  benefits: [],
});

onMounted(async () => {
  try {
    const res: any = await GATEWAY_ENDPOINT.get('/system-config/public');
    const rewards = res?.data?.rewards;
    if (rewards?.enabled) {
      program.value = {
        enabled: true,
        programName: rewards.programName || 'Flybeth Rewards',
        maxDiscountPercent: Number(rewards.maxDiscountPercent) || 0,
        maxDiscountCap: Number(rewards.maxDiscountCap) || 0,
        pointsPerDollar: Number(rewards.pointsPerDollar) || 0,
        benefits: Array.isArray(rewards.benefits) ? rewards.benefits : [],
      };
    }
  } catch {
    program.value.enabled = false;
  }
});
</script>
