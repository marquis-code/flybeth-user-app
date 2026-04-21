<template>
  <div class="py-20 max-w-5xl mx-auto px-6">
    <div class="space-y-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div class="space-y-3">
           <h1 class="text-4xl  text-neutral-900 tracking-tight leading-tight">My Support Tickets</h1>
           <p class="text-neutral-500 font-medium">View and manage your active support requests with our 24/7 travel desk.</p>
        </div>
        <button class="px-8 py-4 bg-brand-blue text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-brand-blue/20 hover:scale-105 transition-all">Create New Ticket</button>
      </div>

      <!-- Ticket List -->
      <div v-if="tickets.length" class="space-y-6">
         <div v-for="ticket in tickets" :key="ticket.id" class="bg-white p-8 rounded-[40px] border border-neutral-100 shadow-sm hover:shadow-xl transition-all group">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
               <div class="flex items-center gap-6">
                  <div :class="statusStyles[ticket.status]" class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                     <component :is="statusIcons[ticket.status]" class="h-6 w-6" />
                  </div>
                  <div>
                     <p class="text-[10px]  uppercase tracking-[0.2em] text-neutral-300 mb-1">#{{ ticket.id }} • {{ ticket.category }}</p>
                     <h4 class="text-lg  text-neutral-900">{{ ticket.subject }}</h4>
                  </div>
               </div>
               <div class="flex items-center gap-8 w-full md:w-auto">
                  <div class="hidden sm:block">
                     <p class="text-[10px]  uppercase tracking-widest text-neutral-300 mb-1">Last Updated</p>
                     <p class="text-xs font-bold text-neutral-900">{{ ticket.updatedAt }}</p>
                  </div>
                  <div :class="statusTextStyles[ticket.status]" class="px-4 py-1.5 rounded-full text-[10px]  uppercase tracking-[0.15em] ml-auto md:ml-0">
                     {{ ticket.status }}
                  </div>
                  <button class="h-10 w-10 bg-neutral-50 rounded-full flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all">
                     <ArrowSmallRightIcon class="h-5 w-5" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24 bg-neutral-50 rounded-[50px] space-y-8">
         <div class="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-neutral-200/50">
            <TicketIcon class="h-10 w-10 text-neutral-200" />
         </div>
         <div class="space-y-4">
            <h3 class="text-xl  text-neutral-900">No active tickets</h3>
            <p class="text-sm font-medium text-neutral-500 max-w-sm mx-auto leading-relaxed">You don't have any support requests at the moment. Need help? Create a new ticket above.</p>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  TicketIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowSmallRightIcon 
} from '@heroicons/vue/24/outline'

useHead({
  title: 'My Tickets | Flybeth Support'
})

const tickets = [
  { 
    id: 'FLB-8821', 
    subject: 'Refund request for cancelled flight BA-202', 
    category: 'Billing', 
    status: 'In Progress', 
    updatedAt: '2 hours ago' 
  },
  { 
    id: 'FLB-7740', 
    subject: 'Incorrect baggage allowance on ticket', 
    category: 'Booking', 
    status: 'Resolved', 
    updatedAt: 'Yesterday' 
  }
]

const statusStyles: any = {
  'In Progress': 'bg-brand-blue/5 text-brand-blue',
  'Resolved': 'bg-emerald-50 text-emerald-500',
  'Urgent': 'bg-rose-50 text-rose-500'
}

const statusIcons: any = {
  'In Progress': ClockIcon,
  'Resolved': CheckCircleIcon,
  'Urgent': ExclamationCircleIcon
}

const statusTextStyles: any = {
  'In Progress': 'bg-brand-blue/10 text-brand-blue',
  'Resolved': 'bg-emerald-100 text-emerald-600',
  'Urgent': 'bg-rose-100 text-rose-600'
}
</script>
