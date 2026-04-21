<template>
  <div class="ck-tf">
    <div class="ck-tf-hd">
        <div class="ck-tf-badge"> Traveler 1 (Adult)</div>
        <h2 class="ck-tf-h flex items-center gap-3">
          <User class="w-6 h-6 text-blue-600" />
          Who is traveling?
        </h2>
        <p class="ck-tf-p">Names must match IDs exactly to avoid boarding issues.</p>
    </div>

    <div class="ck-tf-grid">
       <!-- Basic Info Group -->
       <div class="ck-tf-sec">
          <div class="ck-tf-cards">
             <div class="ck-tf-row">
                <SelectInput
                  v-model="form.title"
                  label="Title"
                  :options="['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']"
                  class="flex-[0.3]"
                />
                <AnimatedInput
                  v-model="form.lastName"
                  label="Last Name / Surname"
                  type="text"
                  class="flex-1"
                  position="middle"
                />
             </div>
             <div class="ck-tf-row">
                <AnimatedInput
                  v-model="form.firstName"
                  type="text"
                  label="First Name"
                  class="flex-1"
                  position="middle"
                />
             </div>
             <div class="ck-tf-row">
                <FlatDatePicker
                  v-model="form.dateOfBirth"
                  label="Date of Birth"
                  :maxDate="today"
                  :hasError="dobError"
                  class="flex-1"
                />
                <SelectInput
                  v-model="form.gender"
                  label="Gender"
                  :options="['Male', 'Female', 'Unknown']"
                  class="flex-1"
                />
             </div>
          </div>
       </div>

       <!-- Contact Group -->
       <div class="ck-tf-sec">
          <h3 class="ck-tf-sh flex items-center gap-2">
            <Mail class="w-4 h-4 text-blue-600" />
            Contact details
          </h3>
          <div class="ck-tf-cards">
             <div class="ck-tf-row">
                <PhoneInput
                  v-model="form.phone"
                  label="Mobile Number"
                  class="flex-1"
                />
             </div>
             <div class="ck-tf-row">
                <AnimatedInput
                  v-model="form.email"
                  label="Email Address"
                  type="email"
                  class="flex-1"
                  position="middle"
                  @blur="$emit('email-blur', form.email)"
                />
             </div>
          </div>
       </div>

       <!-- Identification Group -->
       <div class="ck-tf-sec">
          <h3 class="ck-tf-sh flex items-center gap-2">
            <Globe class="w-4 h-4 text-blue-600" />
            Identification
          </h3>
          <div class="ck-tf-cards">
             <div class="ck-tf-row">
                <SelectInput
                  v-model="form.nationality"
                  label="Nationality"
                  :options="countriesNames"
                  class="flex-1"
                />
             </div>
             <div class="ck-tf-row">
                <AnimatedInput
                  v-model="form.passportNumber"
                  label="Passport Number (Optional)"
                  class="flex-1"
                  type="text"
                  position="standalone"
                />
                <FlatDatePicker
                  v-model="form.passportExpiry"
                  label="Passport Expiry"
                  :minDate="today"
                  class="flex-1"
                />
             </div>
          </div>
       </div>
    </div>

    <!-- Actions -->
    <div class="ck-tf-foot">
       <div class="flex flex-col gap-4 mb-6">
          <label v-if="isLoggedIn" class="ck-tf-terms">
             <input type="checkbox" v-model="form.saveForFuture" class="ck-tf-chk custom-checkbox" />
             <span class="font-bold text-gray-800">Save traveler information for future bookings</span>
          </label>
          <label class="ck-tf-terms">
             <input type="checkbox" v-model="termsAccepted" class="ck-tf-chk custom-checkbox" />
             <span>I verify that all names stated above are identical to those in the original travel documents.</span>
          </label>
       </div>
       <button 
          @click="handleContinue" 
          :disabled="!canContinue" 
          class="ck-tf-btn"
          :class="{ 'ck-tf-btn--off': !canContinue }"
       >
          <span>Continue to Extras</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
       </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import PhoneInput from '@/components/ui/PhoneInput.vue';
import FlatDatePicker from '@/components/ui/FlatDatePicker.vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { User, Mail, Globe } from 'lucide-vue-next'
import axios from 'axios'

const { isLoggedIn } = useAuth()

const today = new Date()
today.setHours(23, 59, 59, 999)

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'continue', 'email-blur'])

const form = ref({
  title: props.modelValue.title || 'Mr',
  firstName: props.modelValue.firstName || '',
  lastName: props.modelValue.lastName || '',
  middleName: props.modelValue.middleName || '',
  email: props.modelValue.email || '',
  phone: props.modelValue.phone || '',
  phoneCountryCode: props.modelValue.phoneCountryCode || '+234',
  gender: props.modelValue.gender || 'Male',
  dateOfBirth: props.modelValue.dateOfBirth || '',
  nationality: props.modelValue.nationality || 'Nigeria',
  passportNumber: props.modelValue.passportNumber || '',
  passportExpiry: props.modelValue.passportExpiry || '',
  passportCountry: props.modelValue.passportCountry || '',
  saveForFuture: props.modelValue.saveForFuture || false,
})

const termsAccepted = ref(false)
const countries = ref<{ code: string; name: string }[]>([])

onMounted(async () => {
  try {
    const { data } = await axios.get('https://countriesnow.space/api/v0.1/countries/iso')
    countries.value = data.data.map((c: any) => ({
      code: c.Iso2,
      name: c.name
    }))

    // Auto-detect location for nationality
    const geo = await axios.get('https://ipapi.co/json/')
    if (geo.data && geo.data.country_name) {
      form.value.nationality = geo.data.country_name
    }
  } catch (e) {
    console.error('Failed to fetch countries', e)
    // Fallback
    countries.value = [
      { code: 'NG', name: 'Nigeria' },
      { code: 'US', name: 'United States' },
      { code: 'GB', name: 'United Kingdom' }
    ]
  }
})

const countriesNames = computed(() => countries.value.map(c => c.name))

const isComplete = computed(() => !!(form.value.firstName && form.value.lastName && form.value.email && form.value.phone && form.value.dateOfBirth))
const dobError = computed(() => form.value.dateOfBirth && new Date(form.value.dateOfBirth) >= new Date())
const canContinue = computed(() => isComplete.value && termsAccepted.value && !dobError.value)

watch(form, (val) => { emit('update:modelValue', { ...val }) }, { deep: true })
const handleContinue = () => { if (canContinue.value) emit('continue') }
</script>

<style scoped>
.ck-tf { padding: 32px; font-family: 'Sora', sans-serif; }

.ck-tf-hd { margin-bottom: 32px; }
.ck-tf-badge { 
  display: inline-block; font-size: 9px; font-weight: 700; 
  letter-spacing: 0.1em; color: #1d7a4f; background: #f0f7f3; padding: 4px 10px; 
  border-radius: 100px; margin-bottom: 12px;
}
.ck-tf-h { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 6px; letter-spacing: -0.02em; }
.ck-tf-p { font-size: 13px; color: #888; }

.ck-tf-grid { display: flex; flex-direction: column; gap: 32px; }
.ck-tf-sh { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #111; margin-bottom: 16px; }

.ck-tf-sec { position: relative; }
.ck-tf-cards { display: flex; flex-direction: column; gap: 16px; }
.ck-tf-row { display: flex; gap: 16px; }

.ck-tf-foot { margin-top: 40px; border-top: 1px solid #f0f0ea; padding-top: 32px; display: flex; flex-direction: column; gap: 24px; }
.ck-tf-terms { display: flex; gap: 12px; cursor: pointer; }
.ck-tf-chk { width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid #eaeaef; cursor: pointer; flex-shrink: 0; margin-top: 2px; }
.ck-tf-terms span { font-size: 12px; color: #888; line-height: 1.5; font-weight: 500; }

.ck-tf-btn {
  background: #111; color: #fff; border: none; border-radius: 12px; height: 48px;
  padding: 0 32px; width: fit-content;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.ck-tf-btn:not(.ck-tf-btn--off):hover { background: #1d7a4f; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
.ck-tf-btn:active { transform: scale(0.98); }
.ck-tf-btn--off { opacity: 0.4; cursor: not-allowed; filter: grayscale(1); }

@media (max-width: 640px) {
  .ck-tf { padding: 24px 16px; }
  .ck-tf-row { flex-direction: column; gap: 12px; }
}
</style>
