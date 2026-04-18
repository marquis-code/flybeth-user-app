<template>
  <div class="traveller-form-step">
    <div class="traveller-card">
      <div class="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
             <User class="w-5 h-5" />
          </div>
          <h2 class="text-base font-black text-gray-900 uppercase tracking-widest">Adult (12 yrs+)</h2>
        </div>
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ isComplete ? '1' : '0' }}/1 added</span>
      </div>

      <div class="p-6 bg-gray-100/30 text-gray-500 text-[11px] font-bold leading-relaxed border-b border-gray-100">
        Enter your name exactly as it appears on your passport. Passport must be valid for at least 6 months from the date of travel.
      </div>

      <div class="mx-6 mt-6 inline-flex items-center gap-2 bg-brand-green/10 text-brand-green text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-green/20">
        <Check class="w-3 h-3" />
        Primary Traveler
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
        <div class="py-2 px-3 bg-gray-50/50 rounded-2xl border border-gray-200 flex items-center justify-between">
          <span class="text-sm font-bold text-gray-400 tracking-widest pl-2 lowercase">Gender *</span>
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
      <div class="p-6 border-t-[2px] border-dashed border-gray-200 mt-2">
        <h3 class="text-sm  text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          Passport information
          <span class="flex-1 h-[1px] bg-gray-200"></span>
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
        </div>
      </div>
    </div><!-- /.traveller-card -->

    <!-- Terms & Continue -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 px-1">
      <label class="flex items-center gap-3 cursor-pointer group">
        <input type="checkbox" v-model="termsAccepted" class="w-5 h-5 rounded-md border-gray-200 text-brand-blue focus:ring-brand-blue" />
        <span class="text-[11px] font-bold text-gray-400 group-hover:text-gray-900 transition-all uppercase tracking-tight">I have read and agree to the <NuxtLink to="/terms" target="_blank" class="text-brand-blue underline">Terms and Conditions</NuxtLink></span>
      </label>
      <button @click="handleContinue" :disabled="!canContinue" class="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-black active:scale-95 flex items-center justify-center gap-3" :class="{ 'opacity-50 cursor-not-allowed': !canContinue }">
        Continue
        <ChevronRight class="w-4 h-4" />
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
import { User, Check, ChevronRight } from 'lucide-vue-next';

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
.traveller-card {
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #cbd5e1;
  overflow: visible;
}
</style>
