<template>
  <div class="pc-card" :class="{ 'pc-card--featured': featured }" @click="$emit('select', package)">
    <div class="pc-img-wrap">
      <img v-if="imageUrl" :src="imageUrl" class="pc-img" loading="lazy" />
      <div v-else class="pc-img-placeholder">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
      </div>
      <div class="pc-badges">
        <div v-if="featured" class="pc-badge pc-badge--feat">Featured Deal</div>
        <div v-if="package.duration" class="pc-badge pc-badge--white">{{ package.duration }} Days</div>
      </div>
    </div>
    <div class="pc-content">
      <div class="pc-hd">
        <h3 class="pc-name">{{ package.name || 'Untitled Package' }}</h3>
        <p class="pc-loc" v-if="package.destination">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ package.destination }}
        </p>
      </div>
      <div class="pc-desc" v-if="package.description">
        {{ truncate(package.description, 80) }}
      </div>
      <div class="pc-foot">
        <div class="pc-price-grp">
          <span class="pc-price-label">Starts from</span>
          <span class="pc-price-val">{{ currencySymbol }}{{ formatPrice(package.price?.total || package.price?.amount || 0) }}</span>
        </div>
        <button class="pc-btn">View Details →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  package: { type: Object, required: true },
  featured: { type: Boolean, default: false }
})

defineEmits(['select'])

const imageUrl = computed(() => {
  if (props.package.photos?.[0]) return props.package.photos[0]
  if (props.package.image) return props.package.image
  return null
})

const currencySymbol = computed(() => props.package.currency || '$')

const formatPrice = (p: any) => {
  const num = parseFloat(p)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const truncate = (str: string, len: number) => {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}
</script>

<style scoped>
.pc-card {
  background: #fff;
  border: 1px solid #eaeae3;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  position: relative;
}

.pc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
  border-color: #d8d8d0;
}

.pc-card--featured {
  border: 1.5px solid #1d7a4f;
  box-shadow: 0 4px 12px rgba(29, 122, 79, 0.08);
}

.pc-img-wrap {
  height: 200px;
  position: relative;
  background: #f8faf9;
  overflow: hidden;
}

.pc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.pc-card:hover .pc-img {
  transform: scale(1.05);
}

.pc-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.pc-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.pc-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.pc-badge--feat {
  background: #1d7a4f;
  color: #fff;
}

.pc-badge--white {
  background: #fff;
  color: #111;
}

.pc-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pc-hd {
  margin-bottom: 10px;
}

.pc-name {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  color: #111;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.pc-loc {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pc-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
}

.pc-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #f0f0ea;
}

.pc-price-grp {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.pc-price-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  color: #bbb;
  letter-spacing: 0.05em;
}

.pc-price-val {
  font-size: 18px;
  font-weight: 700;
  color: #111;
}

.pc-btn {
  padding: 8px 16px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.pc-card:hover .pc-btn {
  background: #1d7a4f;
}

@media (max-width: 640px) {
  .pc-name { font-size: 16px; }
  .pc-price-val { font-size: 16px; }
}
</style>
