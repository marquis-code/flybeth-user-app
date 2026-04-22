<template>
  <div class="notification-panel" v-bind="$attrs">
    <div class="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] w-80 sm:w-96">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h3 class="text-[14px] font-bold text-gray-900">Notifications</h3>
          <p class="text-[10px] text-gray-400 font-medium mt-0.5">{{ notifications.length }} updates received</p>
        </div>
        <button 
          v-if="notifications.length > 0"
          @click="clearAll" 
          class="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Clear all
        </button>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto bg-gray-50/30 custom-scrollbar">
        <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Bell class="w-6 h-6 text-gray-300" />
          </div>
          <p class="text-sm font-bold text-gray-900">All caught up!</p>
          <p class="text-xs text-gray-400 mt-1">When you receive updates about your bookings or support, they'll appear here.</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div 
            v-for="(n, i) in notifications" 
            :key="i"
            class="p-4 hover:bg-white transition-colors cursor-pointer group"
          >
            <div class="flex gap-3">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-100"
                :class="getTypeStyles(n.type)"
              >
                <component :is="getTypeIcon(n.type)" class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-bold text-gray-900 truncate">{{ n.title || 'Support Update' }}</p>
                  <span class="text-[10px] font-medium text-gray-400 whitespace-nowrap">{{ formatTime(n.timestamp || new Date()) }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{{ n.message || n.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifications.length > 0" class="px-5 py-3 border-t border-gray-100 bg-white text-center">
        <button class="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors">
          View all activity
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRealtime } from '@/composables/core/useRealtime'
import { Bell, Info, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-vue-next'

const { notifications } = useRealtime()

const clearAll = () => {
  notifications.value = []
}

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-50 text-emerald-600'
    case 'warning': return 'bg-amber-50 text-amber-600'
    case 'error': return 'bg-red-50 text-red-600'
    default: return 'bg-blue-50 text-blue-600'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'warning': return AlertTriangle
    case 'error': return Info
    case 'message': return MessageSquare
    default: return Info
  }
}

const formatTime = (date: any) => {
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
</style>
