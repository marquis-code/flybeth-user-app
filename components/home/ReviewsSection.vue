<template>
  <!-- Only real, approved reviews from the API are shown. If there are none the
       section is omitted rather than filled with invented testimonials. -->
  <section v-if="items.length" class="border-y border-[#E6EBF2] bg-[#F4F7FB]">
    <div class="mx-auto max-w-7xl px-5 py-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black tracking-tight text-[#0B1B33] sm:text-3xl">
            What do our customers say about our service?
          </h2>
          <p v-if="summary.reviewCount" class="mt-2 flex items-center gap-2 text-[13px] text-[#5F7185]">
            <span class="flex items-center gap-0.5" aria-hidden="true">
              <svg v-for="n in 5" :key="n" class="h-4 w-4" :class="n <= Math.round(summary.averageRating) ? 'text-[#EB4405]' : 'text-[#D5DCE6]'" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
              </svg>
            </span>
            <span class="font-bold text-[#0B1B33]">{{ summary.averageRating.toFixed(1) }}</span>
            <span>from {{ summary.reviewCount }} verified review{{ summary.reviewCount === 1 ? '' : 's' }}</span>
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="review in items"
          :key="review._id || review.authorName + review.title"
          class="flex flex-col rounded-lg border border-[#DBE2EA] bg-white p-5"
        >
          <div class="flex items-center gap-0.5" aria-hidden="true">
            <svg v-for="n in 5" :key="n" class="h-3.5 w-3.5" :class="n <= review.rating ? 'text-[#EB4405]' : 'text-[#D5DCE6]'" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
            </svg>
          </div>
          <h3 class="mt-2 text-[14px] font-bold text-[#0B1B33]">{{ review.title }}</h3>
          <p class="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-[#5F7185]">{{ review.body }}</p>
          <div class="mt-4 border-t border-[#EEF2F7] pt-3">
            <p class="text-[12px] font-bold text-[#0B1B33]">{{ review.authorName }}</p>
            <p class="text-[11px] text-[#8A97A8]">
              <template v-if="review.route">{{ review.route }} · </template>
              {{ reviewDate(review) }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { testimonialsApi } from '@/api_factory/modules/testimonials';

interface Review {
  _id?: string;
  authorName: string;
  authorLocation?: string;
  rating: number;
  title: string;
  body: string;
  route?: string;
  travelledAt?: string | null;
  createdAt?: string;
}

const items = ref<Review[]>([]);
const summary = ref({ averageRating: 0, reviewCount: 0 });

const reviewDate = (review: Review) => {
  const raw = review.travelledAt || review.createdAt;
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

onMounted(async () => {
  try {
    const res: any = await testimonialsApi.getFeatured(4);
    const payload = res?.data ?? {};
    items.value = Array.isArray(payload.items) ? payload.items : [];
    summary.value = {
      averageRating: Number(payload.summary?.averageRating) || 0,
      reviewCount: Number(payload.summary?.reviewCount) || 0,
    };
  } catch {
    items.value = [];
  }
});
</script>
