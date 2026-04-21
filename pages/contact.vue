<template>
  <div class="min-h-screen bg-white">
    <!-- Premium White Hero -->
    <section class="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden border-b border-gray-100">
      <!-- Minimalist Background Accents -->
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -skew-x-12 translate-x-1/4"></div>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl"></div>
      
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span class="inline-block mb-4 px-4 py-1.5 bg-brand-blue/5 rounded-full text-[10px] font-bold uppercase  text-brand-blue">Contact Support</span>
            <h1 class="text-5xl lg:text-7xl  text-gray-900 tracking-tighter leading-[1.05] mb-8">
              We're here <br><span class="text-brand-blue italic">for you.</span>
            </h1>
            <p class="text-lg text-gray-500 font-medium max-w-xl leading-relaxed mb-12">
              Have a question about a booking or want to partner with us? Reach out and our team of travel experts will assist you.
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div class="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div class="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all mb-6">
                  <Mail class="h-6 w-6" />
                </div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email Support</p>
                <p class="text-gray-900 ">hello@flybeth.com</p>
              </div>
              <div class="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div class="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all mb-6">
                  <Phone class="h-6 w-6" />
                </div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Call Concierge</p>
                <p class="text-gray-900 ">+1 (800) FLY-BETH</p>
              </div>
            </div>
          </div>

          <!-- Professional Form -->
          <div class="relative my-2 lg:m-6">
            <div class="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
              <form @submit.prevent="handleSubmit" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-3">
                    <label class="text-[10px]  uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input v-model="form.name" required type="text" placeholder="John Doe" class="contact-field" />
                  </div>
                  <div class="space-y-3">
                    <label class="text-[10px]  uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input v-model="form.email" required type="email" placeholder="john@example.com" class="contact-field" />
                  </div>
                </div>
                
                <!-- Custom Dropdown -->
                <div class="space-y-3 relative">
                  <label class="text-[10px]  uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                  <div @click="showDropdown = !showDropdown" 
                       class="contact-field cursor-pointer flex items-center justify-between group"
                       :class="{ 'border-brand-blue ring-4 ring-brand-blue/5': showDropdown }">
                    <span :class="form.subject ? 'text-gray-900' : 'text-gray-300'">
                      {{ form.subject || 'Select a topic' }}
                    </span>
                    <ChevronDown class="h-4 w-4 text-gray-400 transition-transform duration-300" :class="{ 'rotate-180': showDropdown }" />
                  </div>
                  
                  <transition name="fade-slide">
                    <div v-if="showDropdown" class="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl py-2 overflow-hidden">
                      <div v-for="option in subjects" :key="option"
                           @click="selectSubject(option)"
                           class="px-6 py-3.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-blue cursor-pointer transition-all flex items-center justify-between group">
                        {{ option }}
                        <CheckIcon v-if="form.subject === option" class="h-4 w-4" />
                      </div>
                    </div>
                  </transition>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px]  uppercase tracking-widest text-gray-400 ml-1">Message</label>
                  <textarea v-model="form.message" required rows="4" placeholder="How can we help you today?" class="contact-field resize-none"></textarea>
                </div>

                <button :disabled="loading" type="submit" class="w-full h-14 rounded-2xl bg-gray-900 text-white  text-xs uppercase tracking-[0.2em] hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-gray-200">
                  <template v-if="!loading">
                    <Send class="h-4 w-4" />
                    Send Message
                  </template>
                  <div v-else class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Global Offices -->
    <section class="py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div class="p-8 rounded-3xl bg-white border border-gray-100">
            <h3 class="text-sm  text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Corporate Office</h3>
            <p class="text-gray-500 font-bold leading-relaxed">
              1880 S Dairy Ashford Rd, Suite 207,<br>
              Houston, TX 77077
            </p>
          </div>
          <div class="p-8 rounded-3xl bg-white border border-gray-100">
            <h3 class="text-sm  text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Support Hours</h3>
            <p class="text-gray-500 font-bold leading-relaxed">
              Mon - Fri: 9:00 AM - 6:00 PM (GMT)<br>
              Sat: 10:00 AM - 2:00 PM (GMT)
            </p>
          </div>
          <div class="p-8 rounded-3xl bg-white border border-gray-100">
            <h3 class="text-sm  text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Connect</h3>
            <div class="flex items-center justify-center md:justify-start gap-4">
              <a href="#" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Instagram class="h-5 w-5" />
              </a>
              <a href="#" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Twitter class="h-5 w-5" />
              </a>
              <a href="#" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Linkedin class="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Mail, Phone, Send, Instagram, Twitter, Linkedin, ChevronDown, CheckIcon } from 'lucide-vue-next'
import { useSupport } from '@/composables/modules/support/useSupport'

definePageMeta({ title: 'Contact Us | Flybeth' })

const { loading, submitInquiry } = useSupport()
const showDropdown = ref(false)

const subjects = [
  'Booking Inquiry',
  'Cancellation / Refund',
  'Technical Support',
  'Partnership',
  'Other'
]

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const selectSubject = (subject: string) => {
  form.subject = subject
  showDropdown.value = false
}

const handleSubmit = async () => {
  const success = await submitInquiry({ ...form })
  if (success) {
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }
}

// Close dropdown on outside click
const closeDropdown = (e: MouseEvent) => {
  if (showDropdown.value && !(e.target as HTMLElement).closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => window.addEventListener('click', closeDropdown))
onUnmounted(() => window.removeEventListener('click', closeDropdown))
</script>

<style scoped>
.contact-field {
  @apply w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none placeholder:text-gray-300;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  @apply transition-all duration-300;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  @apply opacity-0 -translate-y-4 scale-95;
}
</style>
