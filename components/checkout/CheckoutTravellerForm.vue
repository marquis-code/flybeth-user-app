<template>
  <div class="">
    <!-- Header with horizontal padding -->
    <div class="ck-tf-hd  flex flex-col md:flex-row md:items-start justify-between gap-6 px-2 sm:px-4">
        <div class="flex-1">
          <div class="ck-tf-badge">
            {{ isFlightBooking ? 'Batch & Group Booking' : (bookingType === 'stay' ? 'Hotel Reservation' : (bookingType === 'activity' ? 'Activity Booking' : (bookingType === 'car' ? 'Car Rental' : 'Booking Details'))) }}
          </div>
          <h2 class="ck-tf-h">
            {{ isFlightBooking ? 'Traveler Details' : (bookingType === 'stay' ? 'Guest Details' : (bookingType === 'activity' ? 'Participant Details' : (bookingType === 'car' ? 'Driver Details' : 'Passenger Details'))) }}
          </h2>
          <p class="ck-tf-p">
            {{ isFlightBooking ? 'Add your group members or upload a CSV to automate the process.' : (bookingType === 'stay' ? 'Enter the lead guest and contact details for your stay.' : (bookingType === 'activity' ? 'Enter primary participant details and contact info for your tickets.' : (bookingType === 'car' ? 'Enter primary driver details and contact information for vehicle pickup.' : 'Enter passenger details and contact information.'))) }}
          </p>
        </div>

        <div class="flex flex-col md:flex-row flex-wrap items-center gap-3 mt-4 md:mt-0">
   <button 
     type="button"
     @click="addTraveler"
     class="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0D1DAD] text-white font-bold text-sm hover:bg-[#0A1485] transition-all shadow-md active:scale-95"
   >
      <Plus class="w-4 h-4" />
      <span>{{ addTravelerBtnLabel }} ({{ travelers.length + 1 }})</span>
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

    <!-- Multi-traveler Quick Navigation Bar when multiple travelers exist -->
    <div v-if="travelers.length > 1" class="mx-2 sm:mx-4 mt-4 p-2.5 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl shadow-sm sticky top-2 z-20 flex items-center justify-between gap-2 overflow-x-auto">
      <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <button
          v-for="(t, idx) in travelers"
          :key="idx"
          type="button"
          @click="scrollToTraveler(idx)"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
          :class="isPassengerComplete(t) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          <span>{{ isFlightBooking ? 'Traveler' : (bookingType === 'stay' ? 'Guest' : (bookingType === 'activity' ? 'Participant' : (bookingType === 'car' ? 'Driver' : 'Passenger'))) }} {{ idx + 1 }}</span>
          <span v-if="t.firstName" class="text-[11px] font-normal opacity-75">({{ t.firstName }})</span>
          <svg v-if="isPassengerComplete(t)" class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
      </div>

      <button
        type="button"
        @click="addTraveler"
        class="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0D1DAD] text-white text-xs font-bold hover:bg-[#0A1485] transition-all shadow-sm whitespace-nowrap active:scale-95"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>+ Add</span>
      </button>
    </div>

    <!-- Autofill Toggle Banner -->
    <div v-if="hasSavedData" class="mx-2 sm:mx-4 mt-6 mb-2 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between transition-all">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <User class="w-4 h-4" />
        </div>
        <div>
          <p class="text-[13px] font-bold text-blue-900">Saved details found!</p>
          <p class="text-[12px] text-blue-700/70 font-medium">Toggle to automatically fill in your previous traveler info.</p>
        </div>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="useSavedData" class="sr-only peer" @change="toggleAutofill">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>

    <div class="space-y-6 mt-6">
      <div 
        v-for="(traveler, index) in travelers" 
        :key="index" 
        :id="'traveler-card-' + index"
        class="relative animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-24"
      >
        <div class="flex items-center justify-between mb-4">
           <div class="flex flex-wrap items-center gap-3">
              <div class="relative w-9 h-9 rounded-full bg-[#FFF0E6] flex items-center justify-center flex-shrink-0">
                <User class="w-4 h-4 text-[#FF7A45]" />
                <div v-if="isPassengerComplete(traveler)" class="absolute -top-1 -right-1 text-[#0D1DAD] bg-white rounded-full leading-none pointer-events-none transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div class="flex flex-col leading-none gap-0.5">
                <span class="text-base font-bold text-gray-900">{{ passengerCardTitle(index) }}</span>
                <span class="text-xs text-gray-500 font-medium">{{ passengerCardSubtitle(index) }}</span>
              </div>
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
        <div class="ck-tf-grid bg-white border-neutral-100 rounded-3xl sm:rounded-[2rem] p-3 sm:p-5 shadow-sm">
           <!-- Basic Info Group -->
           <div class="ck-tf-sec">
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
                 <SelectInput
                   v-model="traveler.title"
                   label="Title"
                   :options="titleOptions"
                   class="sm:col-span-3"
                 />
                 <AnimatedInput
                   v-model="traveler.firstName"
                   type="text"
                   label="First Name"
                   class="sm:col-span-4"
                   position="middle"
                 />
                 <AnimatedInput
                   v-model="traveler.lastName"
                   label="Last Name"
                   type="text"
                   class="sm:col-span-5"
                   position="middle"
                 />
                 
                 <FlatDatePicker
                   v-model="traveler.dateOfBirth"
                   label="Date of Birth"
                   :maxDate="today"
                   class="sm:col-span-6 mt-2"
                 />
                 <SelectInput
                   v-model="traveler.gender"
                   label="Gender"
                   :options="['Male', 'Female', 'Unknown']"
                   class="sm:col-span-6 mt-2"
                 />
              </div>
           </div>

           <!-- Identity Information (Only for flights) -->
           <div v-if="isFlightBooking && index === 0" class="ck-tf-sec mt-6 pt-5 border-t border-neutral-100">
              <div class="flex items-center gap-3 mb-6">
                <div class="relative w-9 h-9 rounded-full bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                  <Globe class="w-4 h-4 text-[#0284C7]" />
                  <div v-if="isIdentityComplete(traveler)" class="absolute -top-1 -right-1 text-[#0D1DAD] bg-white rounded-full leading-none pointer-events-none transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
                <div class="flex flex-col leading-none gap-0.5">
                  <span class="text-base font-bold text-gray-900">Identity Information</span>
                  <span class="text-xs text-gray-500 font-medium ">Passport and nationality details</span>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
                 <SelectInput
                   v-model="traveler.nationality"
                   label="Nationality"
                   :options="countriesNames"
                   class="sm:col-span-4"
                 />
                 <AnimatedInput
                   v-model="traveler.passportNumber"
                   label="Passport Number"
                   type="text"
                   class="sm:col-span-4"
                   position="middle"
                 />
                 <FlatDatePicker
                   v-model="traveler.passportExpiry"
                   label="Passport Expiry Date"
                   :minDate="today"
                   class="sm:col-span-4"
                 />
              </div>
           </div>
        </div>
      </div>

      <!-- Add Another Traveler Button directly below the travelers list -->
      <div class="pt-2">
        <button
          type="button"
          @click="addTraveler"
          class="w-full group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 border-2 border-dashed border-[#0D1DAD]/30 hover:border-[#0D1DAD] hover:shadow-md transition-all active:scale-[0.99] text-left"
        >
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-2xl bg-[#0D1DAD] text-white flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform shrink-0">
              <Plus class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#0D1DAD] transition-colors">
                + {{ addTravelerBtnLabel }} ({{ isFlightBooking ? 'Traveler' : (bookingType === 'stay' ? 'Guest' : (bookingType === 'activity' ? 'Participant' : (bookingType === 'car' ? 'Driver' : 'Passenger'))) }} {{ travelers.length + 1 }})
              </p>
              <p class="text-xs text-gray-500">
                Click here to add {{ isFlightBooking ? 'passenger' : 'guest' }} details without scrolling back up
              </p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1DAD] bg-white px-4 py-2 rounded-xl shadow-sm border border-[#0D1DAD]/20 group-hover:bg-[#0D1DAD] group-hover:text-white transition-colors shrink-0">
            <Plus class="w-3.5 h-3.5" />
            <span>{{ addTravelerBtnLabel }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Contact Group -->
    <div class="mt-8 p-3 sm:p-5 bg-[#0D1DAD]/[0.02] rounded-3xl sm:rounded-[2rem] border border-[#0D1DAD]/10">
        <div class="flex items-center gap-3 mb-6">
          <div class="relative w-9 h-9 rounded-full bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
            <MessageSquare class="w-4 h-4 text-[#0D1DAD]" />
            <div v-if="isContactComplete()" class="absolute -top-1 -right-1 text-[#0D1DAD] bg-white rounded-full leading-none pointer-events-none transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div class="flex flex-col leading-none gap-0.5">
            <span class="text-base font-bold text-gray-900">Contact details</span>
            <span class="text-xs text-gray-500 font-medium ">This is where we'll send your tickets and booking updates</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PhoneInput
                v-model="contact.phone"
                @update:isValid="isPhoneValid = $event"
                label="Mobile Number"
                class="w-full"
              />
              <div class="w-full">
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

    <div class="ck-tf-foot px-2 sm:px-4">
       <div class="flex flex-col gap-3 mb-4">
          <label class="ck-tf-terms">
             <input type="checkbox" v-model="saveForFuture" class="ck-tf-chk custom-checkbox" />
             <span class="font-bold text-black">Save traveler and contact information for future bookings</span>
          </label>
          <div v-if="!isLoggedIn" class="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl mb-2 flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
             </div>
             <div>
                <p class="text-[11px] font-black text-blue-900  ">Guest Mode Active</p>
                <p class="text-sm text-blue-700/70 font-medium">You're booking without an account. We'll send your ticket to the email below.</p>
             </div>
          </div>
          <label class="ck-tf-terms">
             <input type="checkbox" v-model="termsAccepted" class="ck-tf-chk custom-checkbox" />
             <span v-if="isFlightBooking">I verify that all names stated above are identical to those in the original travel documents.</span>
             <span v-else>I confirm that the contact details and names provided above are accurate.</span>
          </label>
       </div>
       <button 
          @click="handleContinue" 
          :disabled="!canContinue" 
          class="ck-tf-btn w-full"
          :class="{ 'ck-tf-btn--off': !canContinue }"
       >
          <span>{{ continueBtnText }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
       </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import PhoneInput from '@/components/ui/PhoneInput.vue';
import FlatDatePicker from '@/components/ui/FlatDatePicker.vue';
import { useAuth } from '@/composables/modules/auth/useAuth';
import { Mail, Globe, Users, User, MessageSquare, Plus, Trash2, Upload } from 'lucide-vue-next'
import axios from 'axios'
import { useCustomToast } from '~/composables/core/useCustomToast';

import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config';

const { isLoggedIn, user } = useAuth()
const { showToast } = useCustomToast()

const today = new Date()
today.setHours(23, 59, 59, 999)

const titleOptions = [
  // Common / Universal
  'Mr', 'Mrs', 'Ms', 'Miss', 'Master', 'Mx',
  // Professional & Academic
  'Dr', 'Prof', 'Professor', 'Engr', 'Barrister', 'Architect', 'Pharm', 'Hon', 'Honorable',
  // Religious & Faith
  'Rev', 'Reverend', 'Pastor', 'Father', 'Brother', 'Sister', 'Bishop', 'Archbishop',
  'Elder', 'Deacon', 'Deaconess', 'Evangelist', 'Imam', 'Sheikh', 'Rabbi', 'Alhaji', 'Alhaja', 'Hajiya',
  // Traditional, Chieftaincy & Dignitaries
  'Chief', 'Sir', 'Dame', 'Lord', 'Lady', 'Baron', 'Baroness', 'Duke', 'Duchess', 'Count', 'Countess',
  'Prince', 'Princess', 'His Excellency', 'Her Excellency', 'Ambassador', 'Senator', 'Governor', 'Mayor',
  'Chancellor', 'Justice', 'Judge',
  // Military & Aviation
  'Capt', 'Captain', 'Commander', 'Cmdr', 'Major', 'Colonel', 'Col', 'General', 'Gen',
  'Lieutenant', 'Lt', 'Sergeant', 'Officer', 'Pilot'
]

const props = defineProps({
  modelValue: { type: Object, default: () => ({ travelers: [], contact: {} }) },
  bookingType: { type: String, default: 'flight' }
})

const isFlightBooking = computed(() => !props.bookingType || props.bookingType === 'flight' || props.bookingType === 'package')

const addTravelerBtnLabel = computed(() => {
  if (props.bookingType === 'stay') return 'Add Guest'
  if (props.bookingType === 'activity') return 'Add Participant'
  if (props.bookingType === 'car') return 'Add Driver'
  return 'Add Traveler'
})

const passengerCardTitle = (index: number) => {
  if (props.bookingType === 'stay') return index === 0 ? 'Lead Guest' : `Guest ${index + 1}`
  if (props.bookingType === 'activity') return index === 0 ? 'Lead Participant' : `Participant ${index + 1}`
  if (props.bookingType === 'car') return index === 0 ? 'Primary Driver' : `Additional Driver ${index + 1}`
  return 'Passenger details'
}

const passengerCardSubtitle = (index: number) => {
  if (props.bookingType === 'stay') return index === 0 ? 'Main contact for check-in' : 'Additional guest'
  if (props.bookingType === 'activity') return index === 0 ? 'Ticket holder & contact' : 'Additional participant'
  if (props.bookingType === 'car') return index === 0 ? 'Must present valid driver license' : 'Additional authorized driver'
  return `Adult ${index + 1}`
}

const continueBtnText = computed(() => {
  if (props.bookingType === 'flight') return 'Continue to Extras'
  return 'Continue to Payment'
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

const hasSavedData = ref(false)
const useSavedData = ref(false)
const savedBackendTravelers = ref<any[]>([])
const savedBackendContact = ref<any>({})
const saveForFuture = ref(false)
const termsAccepted = ref(false)
const countries = ref<{ code: string; name: string }[]>([])
const isPhoneValid = ref(false)

const isPassengerComplete = (traveler: any) => {
  if (!isFlightBooking.value) {
    return Boolean(traveler.title && traveler.firstName && traveler.lastName);
  }
  return Boolean(traveler.title && traveler.firstName && traveler.lastName && traveler.dateOfBirth && traveler.gender);
}

const isIdentityComplete = (traveler: any) => {
  if (!isFlightBooking.value) return true;
  return Boolean(traveler.nationality && traveler.passportNumber && traveler.passportExpiry);
}

const isContactComplete = () => {
  return isPhoneValid.value && contact.value.email;
}

const scrollToTraveler = (index: number) => {
  nextTick(() => {
    const el = document.getElementById(`traveler-card-${index}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const addTraveler = () => {
  const newIndex = travelers.value.length
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
  scrollToTraveler(newIndex)
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

const toggleAutofill = () => {
  if (useSavedData.value) {
    if (savedBackendTravelers.value.length > 0) {
      travelers.value = savedBackendTravelers.value.map(t => ({
        title: t.title || 'Mr',
        firstName: t.firstName || '',
        lastName: t.lastName || '',
        dateOfBirth: t.dateOfBirth ? new Date(t.dateOfBirth).toISOString().split('T')[0] : '',
        gender: t.gender?.toLowerCase() === 'male' ? 'Male' : t.gender?.toLowerCase() === 'female' ? 'Female' : 'Unknown',
        nationality: t.nationality || 'Nigeria',
        passportNumber: t.passportNumber || '',
        passportExpiry: t.passportExpiry ? new Date(t.passportExpiry).toISOString().split('T')[0] : ''
      }));
    }
    if (savedBackendContact.value.email) {
      contact.value = { ...savedBackendContact.value };
    }
    showToast({ title: "Autofill Success", message: "Traveler details automatically loaded.", toastType: "success" });
  } else {
    // Reset to blank
    travelers.value = [{
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      nationality: 'Nigeria',
      passportNumber: '',
      passportExpiry: ''
    }];
    contact.value = {
      email: '',
      phone: '',
      phoneCountryCode: '+234'
    };
  }
}

onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      const [passengersRes, userRes] = await Promise.all([
        GATEWAY_ENDPOINT_WITH_AUTH.get('/passengers'),
        GATEWAY_ENDPOINT_WITH_AUTH.get('/users/me')
      ]);

      const fetchedPassengers = passengersRes.data?.data || passengersRes.data;
      const fetchedUser = userRes.data?.data || userRes.data;

      if (fetchedPassengers && Array.isArray(fetchedPassengers) && fetchedPassengers.length > 0) {
        savedBackendTravelers.value = fetchedPassengers;
        savedBackendContact.value = {
          email: fetchedUser?.email || '',
          phone: fetchedUser?.phone || '',
          phoneCountryCode: '+234'
        };
        hasSavedData.value = true;
        useSavedData.value = true;
        toggleAutofill();
      }
    } catch (error) {
      console.error("Failed to fetch saved travelers from backend", error);
    }
  } else {
    // Guest Mode: load from local storage
    try {
      const localData = localStorage.getItem('flybeth_guest_checkout_info');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.travelers && parsed.travelers.length > 0) {
          savedBackendTravelers.value = parsed.travelers;
          savedBackendContact.value = parsed.contact || {};
          hasSavedData.value = true;
          useSavedData.value = true;
          toggleAutofill();
        }
      }
    } catch(e) {}
  }

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
  const travelersComplete = travelers.value.every(t => {
    if (!isFlightBooking.value) {
      return Boolean(t.firstName && t.lastName);
    }
    return Boolean(t.firstName && t.lastName && t.dateOfBirth);
  });
  const contactComplete = !!(contact.value.email && isPhoneValid.value);
  return travelersComplete && contactComplete;
})

const canContinue = computed(() => isComplete.value && termsAccepted.value)

watch([travelers, contact], () => { 
  emit('update:modelValue', { travelers: [...travelers.value], contact: { ...contact.value } }) 
}, { deep: true })

const handleContinue = async () => { 
  if (canContinue.value) {
    if (saveForFuture.value && isLoggedIn.value) {
      // Save passengers asynchronously
      try {
        // Update user contact info
        GATEWAY_ENDPOINT_WITH_AUTH.patch('/users/me', {
           phone: contact.value.phone
        }).catch(e => console.error("Failed to update user contact", e));

        for (const traveler of travelers.value) {
          const payload = {
            firstName: traveler.firstName,
            lastName: traveler.lastName,
            title: traveler.title,
            gender: traveler.gender.toLowerCase(),
            dateOfBirth: traveler.dateOfBirth ? new Date(traveler.dateOfBirth).toISOString() : undefined,
            nationality: traveler.nationality,
            passportNumber: traveler.passportNumber,
            passportExpiry: traveler.passportExpiry ? new Date(traveler.passportExpiry).toISOString() : undefined,
            type: 'adult', // assuming adult for now from the form
            email: contact.value.email,
            phone: contact.value.phone
          };
          
          // Fire and forget
          GATEWAY_ENDPOINT_WITH_AUTH.post('/passengers', payload).catch(e => console.error("Failed to save passenger", e));
        }
      } catch (error) {
        console.error("Error initiating passenger save", error);
      }
    } else if (saveForFuture.value && !isLoggedIn.value) {
      // Guest Mode: save to local storage
      try {
        localStorage.setItem('flybeth_guest_checkout_info', JSON.stringify({
          travelers: travelers.value,
          contact: contact.value
        }));
      } catch(e) {}
    }
    
    emit('update:modelValue', {
      travelers: travelers.value,
      contact: contact.value
    })
    emit('continue');
  } 
}
</script>

<style scoped>
.ck-tf { padding: 40px 0px; font-family: 'Satoshi', sans-serif; width: 100%; margin: 0 auto; }

.ck-tf-hd { margin-bottom: 28px; }
.ck-tf-badge { 
  display: inline-block; font-size: 10px; font-weight: 800; 
  letter-spacing: 0.1em; color: #0D1DAD; background: rgba(13,29,173,0.08); padding: 6px 14px; 
  border-radius: 100px; margin-bottom: 12px; 
}
.ck-tf-h { font-size: 20px; font-weight: 800; color: #111; margin-bottom: 6px; letter-spacing: -0.025em; white-space: normal; }
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
  padding: 0 28px; width: 100%;
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
