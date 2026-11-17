<template>
  <!-- Renders only once we know the nearest airport. We never prompt for
       geolocation on page load — if the visitor has not already granted it,
       this section simply stays absent. -->
  <DealsRail
    v-if="origin"
    :origin="origin"
    :limit="6"
    title="Flight deals departing near you"
    :caption="caption"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';
import DealsRail from '@/components/home/DealsRail.vue';

const origin = ref('');
const caption = ref('Based on your location');

const hasGrantedGeolocation = async (): Promise<boolean> => {
  try {
    if (!('permissions' in navigator) || !navigator.permissions?.query) return false;
    const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return status.state === 'granted';
  } catch {
    return false;
  }
};

const currentPosition = () =>
  new Promise<GeolocationPosition | null>((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 8000, maximumAge: 10 * 60 * 1000 },
    );
  });

onMounted(async () => {
  if (!(await hasGrantedGeolocation())) return;

  const position = await currentPosition();
  if (!position) return;

  try {
    const res: any = await flightsApi.getNearestAirports(
      position.coords.latitude,
      position.coords.longitude,
    );
    const list = res?.data?.data ?? res?.data ?? [];
    const nearest = Array.isArray(list) ? list.find((a: any) => a?.iataCode) : null;
    if (!nearest?.iataCode) return;

    origin.value = String(nearest.iataCode).toUpperCase();
    const city = nearest.address?.cityName || nearest.name;
    if (city) {
      caption.value = `Departing near you · ${city}${nearest.distanceKm ? ` (${nearest.distanceKm} km)` : ''}`;
    }
  } catch {
    origin.value = '';
  }
});
</script>
