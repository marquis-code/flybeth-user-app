<template>
  <div class="">
    <!-- Header with horizontal padding -->
    <div class="ck-tf-hd  flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div class="flex-1">
          <div class="ck-tf-badge">Batch & Group Booking</div>
          <h2 class="ck-tf-h">Traveler Details</h2>
          <p class="ck-tf-p">Add your group members or upload a CSV to automate the process.</p>
        </div>

        <div class="flex flex-col md:flex-row flex-wrap items-center gap-3 mt-4 md:mt-0">
   <input 
     type="file" 
     ref="csvInput" 
     accept=".csv" 
     class="hidden" 
     @change="handleCSVUpload" 
   />
   <button 
     @click="$refs.csvInput.click()"
     class="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 text-neutral-600 font-bold text-sm hover:bg-neutral-200 transition-colors"
   >
      <Upload class="w-4 h-4" />
      <span>Import CSV</span>
   </button>
   <button 
     @click="addTraveler"
     class="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
   >
      <Plus class="w-4 h-4" />
      <span>Add Traveler</span>
   </button>
</div>

    <!-- <div class="lg:flex   flex-wrap items-center gap-3 mt-4 md:mt-0">
            <input 
              type="file" 
              ref="csvInput" 
              accept=".csv" 
              class="hidden" 
              @change="handleCSVUpload" 
            />
            <button 
              @click="$refs.csvInput.click()"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 text-neutral-600 font-bold text-sm hover:bg-neutral-200 transition-colors"
            >
               <Upload class="w-4 h-4" />
               <span>Import CSV</span>
            </button>
            <button 
              @click="addTraveler"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
               <Plus class="w-4 h-4" />
               <span>Add Traveler</span>
            </button>
         </div> -->
    </div>

    <div class="space-y-6 mt-8">
      <div v-for="(traveler, index) in travelers" :key="index" class="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center justify-between mb-4">
           <div class="flex flex-wrap items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-black flex items-center justify-center">
                {{ index + 1 }}
              </div>
              <span class="text-sm font-black text-neutral-900 tracking-tight">Traveler {{ index + 1 }}</span>
           </div>
           <button 
             v-if="travelers.length > 1" 
             @click="removeTraveler(index)"
             class="p-2 text-red-400 hover:text-red-600 transition-colors"
           >
             <Trash2 class="w-4 h-4" />
           </button>
        </div>

        <!-- Form Box with reduced internal padding -->
        <div class="ck-tf-grid bg-white border-neutral-100 rounded-[2rem] shadow-sm">
           <!-- Basic Info Group -->
           <div class="ck-tf-sec">
              <div class="ck-tf-cards">
                 <div class="ck-tf-row">
                    <SelectInput
                      v-model="traveler.title"
                      label="Title"
                      :options="['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']"
                      class="flex-[0.3]"
                    />
                    <AnimatedInput
                      v-model="traveler.lastName"
                      label="Last Name / Surname"
                      type="text"
                      class="flex-1"
                      position="middle"
                    />
                 </div>
                 <div class="ck-tf-row">
                    <AnimatedInput
                      v-model="traveler.firstName"
                      type="text"
                      label="First Name"
                      class="flex-1"
                      position="middle"
                    />
                 </div>
                 <div class="ck-tf-row">
                    <FlatDatePicker
                      v-model="traveler.dateOfBirth"
                      label="Date of Birth"
                      :maxDate="today"
                      class="flex-1"
                    />
                    <SelectInput
                      v-model="traveler.gender"
                      label="Gender"
                      :options="['Male', 'Female', 'Unknown']"
                      class="flex-1"
                    />
                 </div>
              </div>
           </div>

           <!-- Identity Information -->
           <div v-if="index === 0" class="ck-tf-sec mt-5 pt-5 border-t border-neutral-100">
              <h3 class="ck-tf-sh flex items-center gap-2">
                <Globe class="w-4 h-4 text-[#0D1DAD]" />
                Identity Information
              </h3>
              <div class="ck-tf-cards">
                  <div class="ck-tf-row">
                    <SelectInput
                      v-model="traveler.nationality"
                      label="Nationality"
                      :options="countriesNames"
                      class="flex-1"
                    />
                    <AnimatedInput
                      v-model="traveler.passportNumber"
                      label="Passport Number"
                      type="text"
                      class="flex-1"
                      position="middle"
                    />
                 </div>
                 <div class="ck-tf-row">
                    <FlatDatePicker
                      v-model="traveler.passportExpiry"
                      label="Passport Expiry Date"
                      :minDate="today"
                      class="flex-1"
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Contact Group -->
    <div class="mt-8 p-5  bg-[#0D1DAD]/[0.02] rounded-[2rem] border border-[#0D1DAD]/10">
        <h3 class="ck-tf-sh flex items-center text-sm gap-2 mb-5">
          <Mail class="w-4 h-4 text-[#0D1DAD]" />
          Booking Contact (For the whole group)
        </h3>
        <div class="ck-tf-cards space-y-6">
              <PhoneInput
                v-model="contact.phone"
                label="Mobile Number"
                class="w-full max-w-md"
              />
              <div class="w-full max-w-md">
                <label class="block text-sm font-medium text-brand-gray  mb-1.5 ml-1">Email Address</label>
                <AnimatedInput
                  v-model="contact.email"
                  label=""
                  placeholder="e.g. jdoe@example.com"
                  type="email"
                  class="w-full"
                  position="middle"
                />
              </div>
        </div>
    </div>

    <div class="ck-tf-foot">
       <div class="flex flex-col gap-3 mb-4">
          <label v-if="isLoggedIn" class="ck-tf-terms">
             <input type="checkbox" v-model="saveForFuture" class="ck-tf-chk custom-checkbox" />
             <span class="font-bold text-gray-800">Save traveler information for future bookings</span>
          </label>
          <div v-else class="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl mb-2 flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
             </div>
             <div>
                <p class="text-[11px] font-black text-blue-900  tracking-widest">Guest Mode Active</p>
                <p class="text-sm text-blue-700/70 font-medium">You're booking without an account. We'll send your ticket to the email below.</p>
             </div>
          </div>
          <label class="ck-tf-terms">
             <input type="checkbox" v-model="termsAccepted" class="ck-tf-chk custom-checkbox" />
             <span>I verify that all names stated above are identical to those in the original travel documents.</span>
          </label>
       </div>
       <button 
          @click="handleContinue" 
          :disabled="!canContinue" 
          class="ck-tf-btn w-full md:w-fit"
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
import { Mail, Globe, Users, Plus, Trash2, Upload } from 'lucide-vue-next'
import axios from 'axios'
import { useCustomToast } from '~/composables/core/useCustomToast';

const { isLoggedIn } = useAuth()
const { showToast } = useCustomToast()

const today = new Date()
today.setHours(23, 59, 59, 999)

const props = defineProps({
  modelValue: { type: Object, default: () => ({ travelers: [], contact: {} }) }
})

const emit = defineEmits(['update:modelValue', 'continue', 'email-blur'])

const travelers = ref(props.modelValue.travelers?.length ? [...props.modelValue.travelers] : [{
  title: 'Mr',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Male',
  nationality: 'Nigeria',
  passportNumber: '',
  passportExpiry: ''
}])

const contact = ref(props.modelValue.contact?.email ? { ...props.modelValue.contact } : {
  email: '',
  phone: '',
  phoneCountryCode: '+234'
})

const saveForFuture = ref(false)
const termsAccepted = ref(false)
const countries = ref<{ code: string; name: string }[]>([])

const addTraveler = () => {
  travelers.value.push({
    title: 'Mr',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: travelers.value[0]?.nationality || 'Nigeria',
    passportNumber: '',
    passportExpiry: ''
  })
}

const removeTraveler = (index: number) => {
  travelers.value.splice(index, 1)
}

const handleCSVUpload = (event: any) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e: any) => {
    try {
      const text = e.target.result
      const lines = text.split('\n').filter(l => l.trim())
      
      const newTravelers = lines.slice(1).map(line => {
        const values = line.split(',')
        return {
          title: values[0] || 'Mr',
          firstName: values[1] || '',
          lastName: values[2] || '',
          dateOfBirth: values[3] || '',
          gender: values[4] || 'Male',
          nationality: values[5] || travelers.value[0]?.nationality || 'Nigeria'
        }
      })

      if (newTravelers.length) {
        travelers.value = newTravelers
        showToast({ title: "Batch Import Successful", message: `Imported ${newTravelers.length} travelers from CSV.`, toastType: "success" })
      }
    } catch (err) {
      showToast({ title: "Import Error", message: "Failed to parse CSV file. Ensure it follows: title,firstName,lastName,dob,gender,nationality", toastType: "error" })
    }
  }
  reader.readAsText(file)
}

onMounted(async () => {
  try {
    const { data } = await axios.get('https://countriesnow.space/api/v0.1/countries/iso')
    countries.value = data.data.map((c: any) => ({
      code: c.Iso2,
      name: c.name
    }))
  } catch (e) {
    countries.value = [{ code: 'NG', name: 'Nigeria' }, { code: 'US', name: 'United States' }]
  }
})

const countriesNames = computed(() => countries.value.map(c => c.name))

const isComplete = computed(() => {
  const travelersComplete = travelers.value.every(t => t.firstName && t.lastName && t.dateOfBirth)
  const contactComplete = !!(contact.value.email && contact.value.phone)
  return travelersComplete && contactComplete
})

const canContinue = computed(() => isComplete.value && termsAccepted.value)

watch([travelers, contact], () => { 
  emit('update:modelValue', { travelers: [...travelers.value], contact: { ...contact.value } }) 
}, { deep: true })

const handleContinue = () => { if (canContinue.value) emit('continue') }
</script>

<style scoped>
.ck-tf { padding: 40px 0px; font-family: 'Onest', sans-serif; width: 100%; margin: 0 auto; }

.ck-tf-hd { margin-bottom: 28px; }
.ck-tf-badge { 
  display: inline-block; font-size: 10px; font-weight: 800; 
  letter-spacing: 0.1em; color: #0D1DAD; background: rgba(13,29,173,0.08); padding: 6px 14px; 
  border-radius: 100px; margin-bottom: 12px; 
}
.ck-tf-h { font-size: 28px; font-weight: 800; color: #111; margin-bottom: 6px; letter-spacing: -0.025em; white-space: normal; }
@media (min-width: 768px) {
  .ck-tf-h { white-space: nowrap; }
}
.ck-tf-p { font-size: 14px; color: #666; font-weight: 500; }

.ck-tf-grid { display: flex; flex-direction: column; gap: 20px; }
.ck-tf-sh { font-size: 12px; font-weight: 800; color: black; margin-bottom: 18px; }

.ck-tf-sec { position: relative; }
.ck-tf-cards { display: flex; flex-direction: column; gap: 14px; }
.ck-tf-row { display: flex; flex-direction: column; gap: 14px; }
@media (min-width: 640px) {
  .ck-tf-row { flex-direction: row; }
}

.ck-tf-foot { margin-top: 32px; border-top: 1px solid #f0f0ea; padding-top: 28px; display: flex; flex-direction: column; gap: 20px; }
.ck-tf-terms { display: flex; gap: 12px; cursor: pointer; align-items: flex-start; }
.ck-tf-chk { width: 18px; height: 18px; border-radius: 5px; border: 2px solid #eaeaef; cursor: pointer; flex-shrink: 0; margin-top: 2px; }
.ck-tf-terms span { font-size: 13px; color: #555; line-height: 1.6; font-weight: 500; }

.ck-tf-btn {
  background: #0D1DAD; color: #fff; border: none; border-radius: 14px; height: 52px;
  padding: 0 28px; width: fit-content;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 20px -5px rgba(13, 29, 173, 0.2); letter-spacing: 0.05em;
}
.ck-tf-btn:not(.ck-tf-btn--off):hover { background: #0D1DAD; transform: translateY(-3px); box-shadow: 0 20px 40px -10px rgba(13, 29, 173, 0.4); }
.ck-tf-btn:active { transform: scale(0.97); }
.ck-tf-btn--off { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); box-shadow: none; }

@media (max-width: 640px) {
  .ck-tf { padding: 32px 0px; }
  .ck-tf-row { flex-direction: column; gap: 14px; }
}
</style>
