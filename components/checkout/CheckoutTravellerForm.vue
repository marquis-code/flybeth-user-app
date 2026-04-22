<template>
  <div class="ck-tf">
    <div class="ck-tf-hd">
        <div class="ck-tf-badge"> Traveler 1 (Adult)</div>
        <h2 class="ck-tf-h flex items-center gap-4">
          <div class="w-10 h-10 rounded-2xl bg-[#0D1DAD]/10 flex items-center justify-center">
            <User class="w-6 h-6 text-[#0D1DAD]" />
          </div>
          Primary Traveler
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
            <Mail class="w-4 h-4 text-[#0D1DAD]" />
            Contact Information
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
            <Globe class="w-4 h-4 text-[#0D1DAD]" />
            Document details
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
.ck-tf { padding: 40px 32px; font-family: 'Onest', sans-serif; }

.ck-tf-hd { margin-bottom: 40px; }
.ck-tf-badge { 
  display: inline-block; font-size: 10px; font-weight: 800; 
  letter-spacing: 0.1em; color: #0D1DAD; background: #0D1DAD/10; padding: 6px 14px; 
  border-radius: 100px; margin-bottom: 16px; 
}
.ck-tf-h { font-size: 28px; font-weight: 800; color: #111; margin-bottom: 8px; letter-spacing: -0.025em; }
.ck-tf-p { font-size: 14px; color: #666; font-weight: 500; }

.ck-tf-grid { display: flex; flex-direction: column; gap: 40px; }
.ck-tf-sh { font-size: 12px; font-weight: 800; letter-spacing: 0.15em; color: #999; margin-bottom: 24px;  }

.ck-tf-sec { position: relative; }
.ck-tf-cards { display: flex; flex-direction: column; gap: 16px; }
.ck-tf-row { display: flex; gap: 16px; }

.ck-tf-foot { margin-top: 48px; border-top: 1px solid #f0f0ea; padding-top: 40px; display: flex; flex-direction: column; gap: 32px; }
.ck-tf-terms { display: flex; gap: 14px; cursor: pointer; align-items: flex-start; }
.ck-tf-chk { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #eaeaef; cursor: pointer; flex-shrink: 0; margin-top: 2px; }
.ck-tf-terms span { font-size: 13px; color: #555; line-height: 1.6; font-weight: 500; }

.ck-tf-btn {
  background: #0D1DAD; color: #fff; border: none; border-radius: 16px; height: 60px;
  padding: 0 40px; width: fit-content;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 25px -5px rgba(50, 180, 4, 0.25);  letter-spacing: 0.1em;
}
.ck-tf-btn:not(.ck-tf-btn--off):hover { background: #0D1DAD; transform: translateY(-3px); box-shadow: 0 20px 40px -10px rgba(50, 180, 4, 0.4); }
.ck-tf-btn:active { transform: scale(0.97); }
.ck-tf-btn--off { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); box-shadow: none; }

@media (max-width: 640px) {
  .ck-tf { padding: 32px 20px; }
  .ck-tf-row { flex-direction: column; gap: 16px; }
}
</style>
