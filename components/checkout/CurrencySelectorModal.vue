<template>
  <Transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="close-btn" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 class="modal-heading">
          Select your preferred currency for payment to streamline your booking experience.
        </h3>

        <div class="currency-grid">
          <button
            v-for="currency in currencies"
            :key="currency.code"
            class="currency-card"
            :class="{ active: currentCurrency === currency.code }"
            @click="selectCurrency(currency.code)"
          >
            <div class="flag-wrapper">
              <img :src="`https://flagcdn.com/w80/${currency.countryCode.toLowerCase()}.png`" :alt="currency.name" class="flag-img" />
            </div>
            <span class="currency-code">{{ currency.code }}</span>
          </button>
        </div>

        <div class="modal-footer">
          <button class="btn-continue" @click="handleContinue">
            Continue
          </button>
          
          <div class="security-info">
            <div class="security-item main">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              This booking is 100% protected
            </div>
            <div class="security-items">
              <span class="security-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Secure transmission
              </span>
              <span class="security-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Encrypted storage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  currentCurrency: String
})

const emit = defineEmits(['close', 'select'])

const selectedCode = ref(props.currentCurrency)

// Currencies based on the user's screenshot and backend support
const currencies = [
  { code: 'GBP', countryCode: 'GB', name: 'British Pound' },
  { code: 'KES', countryCode: 'KE', name: 'Kenyan Shilling' },
  { code: 'GHS', countryCode: 'GH', name: 'Ghanaian Cedi' },
  { code: 'USD', countryCode: 'US', name: 'US Dollar' },
  { code: 'NGN', countryCode: 'NG', name: 'Nigerian Naira' },
  { code: 'NLE', countryCode: 'SL', name: 'Sierra Leonean Leone' },
  { code: 'GMD', countryCode: 'GM', name: 'Gambian Dalasi' },
  { code: 'AED', countryCode: 'AE', name: 'UAE Dirham' },
  { code: 'XOF', countryCode: 'SN', name: 'CFA Franc BCEAO' },
  { code: 'XAF', countryCode: 'CM', name: 'CFA Franc BEAC' },
  { code: 'RWF', countryCode: 'RW', name: 'Rwandan Franc' },
  { code: 'TZS', countryCode: 'TZ', name: 'Tanzanian Shilling' },
  { code: 'UGX', countryCode: 'UG', name: 'Ugandan Shilling' },
  { code: 'ZAR', countryCode: 'ZA', name: 'South African Rand' },
  { code: 'CAD', countryCode: 'CA', name: 'Canadian Dollar' },
  { code: 'MAD', countryCode: 'MA', name: 'Moroccan Dirham' },
  { code: 'EUR', countryCode: 'EU', name: 'Euro' },
  { code: 'TND', countryCode: 'TN', name: 'Tunisian Dinar' },
  { code: 'EGP', countryCode: 'EG', name: 'Egyptian Pound' },
  { code: 'DZD', countryCode: 'DZ', name: 'Algerian Dinar' },
]

const selectCurrency = (code: string) => {
  selectedCode.value = code
}

const handleContinue = () => {
  if (selectedCode.value) {
    emit('select', selectedCode.value)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 1.5rem;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-heading {
  font-size: 1.1rem;
  color: #1aae6f; /* Greenish/Teal from screenshot */
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
  padding: 0 1rem;
}

.currency-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.currency-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.currency-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.currency-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.flag-wrapper {
  width: 40px;
  height: 28px;
  overflow: hidden;
  border-radius: 0.25rem;
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flag-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.currency-code {
  font-size: 0.75rem;
  font-weight: 800;
  color: #374151;
}

.modal-footer {
  text-align: center;
}

.btn-continue {
  width: 100%;
  max-width: 200px;
  background: #f97316; /* Orange from buttons */
  color: white;
  font-weight: 800;
  text-transform: uppercase;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
}

.btn-continue:hover {
  background: #ea580c;
  transform: translateY(-1px);
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 700;
}

.security-item.main {
  color: #111827;
  font-size: 0.85rem;
}

.security-items {
  display: flex;
  gap: 1.5rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 540px) {
  .currency-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 440px) {
  .currency-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
