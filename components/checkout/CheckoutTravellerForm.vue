<template>
  <div class="traveller-form-step">
    <div class="traveller-card">
      <div class="traveller-header">
        <div class="header-left">
          <div class="traveller-icon">👤</div>
          <h2 class="header-title">Adult (12 yrs+)</h2>
        </div>
        <span class="counter">{{ isComplete ? '1' : '0' }}/1 added</span>
      </div>

      <div class="form-notice">
        Enter your name as it is mentioned on your passport. Passport should be valid for a minimum of 6 months from date of travel.
      </div>

      <div class="adult-badge">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        Adult - 1
      </div>

      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Title -->
          <SelectInput
            v-model="form.title"
            label="Title *"
            :options="['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']"
            position="top"
          />

          <!-- Last Name -->
          <AnimatedInput
            v-model="form.lastName"
            label="Last Name *"
            position="top"
          />

          <!-- First Name -->
          <AnimatedInput
            v-model="form.firstName"
            label="First Name *"
            position="middle"
          />

          <!-- Middle Name -->
          <AnimatedInput
            v-model="form.middleName"
            label="Middle Name"
            position="middle"
          />

          <!-- Date of Birth -->
          <FlatDatePicker
            v-model="form.dateOfBirth"
            label="Date of Birth *"
            :maxDate="today"
            :hasError="dobError"
          />

          <!-- Nationality -->
          <SelectInput
            v-model="form.nationality"
            label="Nationality *"
            :options="countries"
            position="middle"
          />

          <!-- Phone -->
          <PhoneInput
            v-model="form.phone"
            label="Mobile No"
            class="md:col-span-2"
          />

          <!-- Email -->
          <AnimatedInput
            v-model="form.email"
            label="Email Address"
            type="email"
            position="bottom"
            @blur="$emit('email-blur', form.email)"
          />
        </div>

        <!-- Gender -->
        <div class="py-2 px-3 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between">
          <span class="text-sm font-bold text-gray-400 tracking-widest pl-2 italic lowercase">Gender *</span>
          <div class="flex gap-4 pr-2">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="radio" v-model="form.gender" value="male" class="w-4 h-4 accent-brand-blue" />
              <span class="text-sm font-bold text-gray-900 group-hover:text-gray-900 transition-colors">Male</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="radio" v-model="form.gender" value="female" class="w-4 h-4 accent-brand-blue" />
              <span class="text-sm font-bold text-gray-900 group-hover:text-gray-900 transition-colors">Female</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Passport Section -->
      <div class="p-6 border-t-[2px] border-dashed border-gray-100 mt-2">
        <h3 class="text-sm  text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          Passport information
          <span class="flex-1 h-[1px] bg-gray-100"></span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatedInput
            v-model="form.passportNumber"
            label="Passport Number"
            position="standalone"
          />
          <FlatDatePicker
            v-model="form.passportExpiry"
            label="Passport Expiry Date"
            :minDate="today"
          />
          <SelectInput
            v-model="form.passportCountry"
            label="Passport Country"
            :options="countries"
            position="standalone"
            class="md:col-span-2"
          />
        </div>
      </div>
    </div><!-- /.traveller-card -->

    <!-- Terms & Continue -->
    <div class="step-footer">
      <label class="terms-checkbox">
        <input type="checkbox" v-model="termsAccepted" class="checkbox-input" />
        <span>By proceeding you agree you have read and accepted our <NuxtLink to="/terms" target="_blank" class="terms-link underline">Terms and Conditions</NuxtLink></span>
      </label>
      <button @click="handleContinue" :disabled="!canContinue" class="continue-btn" :class="{ disabled: !canContinue }">
        Continue
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import PhoneInput from '@/components/ui/PhoneInput.vue';
import FlatDatePicker from '@/components/ui/FlatDatePicker.vue';

const today = new Date()
today.setHours(23, 59, 59, 999)


const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'continue', 'email-blur'])

const form = ref({
  title: props.modelValue.title || 'mr',
  firstName: props.modelValue.firstName || '',
  lastName: props.modelValue.lastName || '',
  middleName: props.modelValue.middleName || '',
  email: props.modelValue.email || '',
  phone: props.modelValue.phone || '',
  phoneCountryCode: props.modelValue.phoneCountryCode || '+234',
  gender: props.modelValue.gender || 'male',
  dateOfBirth: props.modelValue.dateOfBirth || '',
  nationality: props.modelValue.nationality || 'NG',
  passportNumber: props.modelValue.passportNumber || '',
  passportExpiry: props.modelValue.passportExpiry || '',
  passportCountry: props.modelValue.passportCountry || '',
})

const termsAccepted = ref(false)

const countries = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IN', name: 'India' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'EG', name: 'Egypt' },
]

const isComplete = computed(() => !!(form.value.firstName && form.value.lastName && form.value.email && form.value.dateOfBirth))

const dobError = computed(() => {
  if (!form.value.dateOfBirth) return false
  return new Date(form.value.dateOfBirth) >= new Date()
})

const canContinue = computed(() => isComplete.value && termsAccepted.value && !dobError.value)

watch(form, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })

const handleContinue = () => {
  if (canContinue.value) {
    emit('continue')
  }
}
</script>

<style scoped>
.traveller-form-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.traveller-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
}

.traveller-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.traveller-icon {
  font-size: 1.5rem;
}

.header-title {
  font-family: 'Spectral', serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a2332;
}

.counter {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
}

.form-notice {
  background: #fdf2f2;
  color: #991b1b;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #fee2e2;
}

.adult-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 1.5rem 0;
  background: #f1f5f9;
  color: #1a2332;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 1rem;
  border-radius: 2rem;
  letter-spacing: 0.05em;
  border: 1px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

.form-input,
.form-select {
  padding: 0.65rem 0.85rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: #374151;
  background: #fafafa;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  border-color: #0D1DAD;
  box-shadow: 0 0 0 3px rgba(13, 29, 173, 0.08);
}

.gender-group {
  grid-column: span 1;
}

.radio-group {
  display: flex;
  gap: 1.25rem;
  padding-top: 0.35rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
}

.radio-input {
  accent-color: #0D1DAD;
}

.phone-row {
  display: flex;
  gap: 0;
}

.phone-code-select {
  border-radius: 0.5rem 0 0 0.5rem;
  border-right: none;
  min-width: 100px;
  max-width: 100px;
}

.phone-input {
  border-radius: 0 0.5rem 0.5rem 0;
  flex: 1;
}

.passport-section {
  border-top: 2px dashed #e5e7eb;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.passport-title {
  font-size: 0.85rem;
  font-weight: 900;
  color: #1a2332;
  padding: 0 1.5rem;
  margin-bottom: 0;
}

.step-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: #6b7280;
  cursor: pointer;
}

/* .checkbox-input {
  accent-color: #0D1DAD;
  width: 16px;
  height: 16px;
} */

.terms-link {
  color: #0D1DAD;
  text-decoration: underline;
  font-weight: 700;
}

.continue-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #0D1DAD;
  color: white;
  border: none;
  padding: 0.65rem 1.75rem;
  border-radius: 0.85rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(13, 29, 173, 0.1);
}

.continue-btn:hover:not(.disabled) {
  background: #0a168a;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(13, 29, 173, 0.15);
}

.continue-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
