<script setup lang="ts">
interface Partner {
  name: string
  logo: string
}

const partners: Partner[] = [
  { name: 'Aegean Airlines', logo: 'https://www.mondee.com/app/uploads/2023/11/AegeanLogo-1.png' },
  { name: 'Air Canada', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_2_air_canada_large.png' },
  { name: 'Air India', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_3_air_india_large.png' },
  { name: 'American Airlines', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_4_american_airline_larges.png' },
  { name: 'Avis', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_11_avis_large.png' },
  { name: 'Budget', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_14_budget_large.png' },
  { name: 'Carnival', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_17_carnival_large.png' },
  { name: 'Dollar Car Rental', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_10_dollar_car_rental_large.png' },
  { name: 'Emerald Cruises', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_13_emerald_cruises_large.png' },
  { name: 'Etihad', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_6_etihad_large.png' },
  { name: 'Hertz', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_15_hertz_large.png' },
  { name: 'Hilton', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_24_hilton_large.png' },
  { name: 'Hyatt', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_26_hyatt_large.png' },
  { name: 'Lufthansa', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_7_lufthansa_large.png' },
  { name: 'Four Seasons', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_1_four_season_large.png' },
  { name: 'Princess Cruises', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_29_Princess_large.png' },
  { name: 'Marriott Bonvoy', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_27_marriott_bonvoy_large.png' },
  { name: 'National', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_12_national_large.png' },
  { name: 'Norwegian Cruise Line', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_18_norwegian_cruise_line_large.png' },
  { name: 'Qatar Airways', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_8_qatar_large.png' },
  { name: 'Radisson Hotels', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_22_radisson_hotels_large.png' },
  { name: 'Royal Caribbean', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_20_royal_caribbean_large.png' },
  { name: 'Singapore Airlines', logo: 'https://www.mondee.com/app/uploads/2024/02/Singapore-Airlines-3-1.png' },
  { name: 'The Ritz-Carlton', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_28_the_ritz_carlton_large.png' },
  { name: 'United Airlines', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_9_united_large.png' },
  { name: 'Voyages', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_21_voyages_large.png' },
  { name: 'Wyndham Hotels & Resorts', logo: 'https://www.mondee.com/app/uploads/2023/11/c_partner_icon_23_wyndham_hotels_resorts_large.png' },
]

// Duplicate for seamless infinite scroll
const duplicatedPartners = computed(() => [...partners, ...partners])

const isHovered = ref(false)
</script>

<template>
  <section class="partner-section w-full">
    <!-- <p class="partner-label">Trusted by the world's leading travel brands</p> -->

    <div
      class="carousel-wrapper"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Fade edge masks -->
      <div class="fade-left" />
      <div class="fade-right" />

      <div class="carousel-track" :class="{ paused: isHovered }">
        <div
          v-for="(partner, index) in duplicatedPartners"
          :key="`${partner.name}-${index}`"
          class="logo-item"
        >
          <img
            :src="partner.logo"
            :alt="partner.name"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.partner-section {
  width: 100%;
  padding: 3rem 0;
  overflow: hidden;
  background: #fff;
}

.partner-label {
  text-align: center;
  font-family: 'Georgia', serif;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  margin: 0 0 2.25rem;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* Gradient fade on left/right edges */
.fade-left,
.fade-right {
  position: absolute;
  top: 0;
  width: 120px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.fade-left {
  left: 0;
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}

.fade-right {
  right: 0;
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}

/* The moving track */
.carousel-track {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  width: max-content;
  animation: marquee 40s linear infinite;
  will-change: transform;
}

.carousel-track.paused {
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    /* Moves exactly one copy's worth so it loops seamlessly */
    transform: translateX(-50%);
  }
}

/* Individual logo tiles */
.logo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 72px;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  background: #fafafa;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.logo-item:hover {
  background: #fff;
  border-color: #d8d8d8;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07);
}

.logo-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.65;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.logo-item:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

/* Reduce motion preference */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    animation: none;
  }
}
</style>