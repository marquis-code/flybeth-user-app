<template>
  <SideDrawer :visible="visible" @close="$emit('close')">
    <template #title>Notifications</template>
    <template #default>
      <div class="flex flex-col h-full">
        
        <!-- Summary bar -->
        <div class="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between bg-[#F9FAFB]">
          <p class="text-[13px] font-medium text-[#6B7280]">
            {{ notifications.length }} {{ notifications.length === 1 ? 'update' : 'updates' }} received
          </p>
          <button 
            v-if="notifications.length > 0"
            @click="clearAll" 
            class="text-[13px] font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            Clear all
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="notifications.length === 0" class="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
          <div class="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-5">
            <Bell class="w-7 h-7 text-[#9CA3AF]" />
          </div>
          <h3 class="text-[16px] font-bold text-[#111827] mb-2">All caught up!</h3>
          <p class="text-[13px] text-[#9CA3AF] leading-relaxed max-w-xs">
            When you receive updates about your bookings, promotions or support, they'll appear here.
          </p>
        </div>

        <!-- Notification List -->
        <div v-else class="flex-1 overflow-y-auto custom-scrollbar">
          <div
            v-for="(n, i) in notifications"
            :key="i"
            class="flex items-start gap-4 px-6 py-5 border-b border-[#F3F4F6] hover:bg-[#FAFBFC] transition-colors cursor-pointer group"
          >
            <!-- Type Icon -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="getTypeStyles(n.type)"
            >
              <component :is="getTypeIcon(n.type)" class="w-5 h-5" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <p class="text-[14px] font-semibold text-[#111827] leading-tight">{{ n.title || 'Support Update' }}</p>
                <span class="text-[11px] font-medium text-[#9CA3AF] whitespace-nowrap flex-shrink-0 mt-0.5">{{ formatTime(n.timestamp || new Date()) }}</span>
              </div>
              <p class="text-[13px] text-[#6B7280] mt-1.5 leading-relaxed line-clamp-2">{{ n.message || n.content }}</p>
            </div>

            <!-- Unread dot -->
            <div v-if="!n.read" class="w-2 h-2 rounded-full bg-[#6366F1] flex-shrink-0 mt-2"></div>
          </div>
        </div>

      </div>
    </template>

    <template #footer v-if="notifications.length > 0">
      <div class="px-6 py-4 text-center">
        <button 
          @click="$router.push('/dashboard/notifications')" 
          class="text-[13px] font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
        >
          View all activity →
        </button>
      </div>
    </template>
  </SideDrawer>
</template>

<script setup lang="ts">
import { useRealtime } from '@/composables/core/useRealtime'
import { Bell, Info, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-vue-next'
import SideDrawer from '@/components/ui/SideDrawer.vue'

defineProps({
  visible: { type: Boolean, default: false }
})

defineEmits(['close'])

const { notifications } = useRealtime()

const clearAll = () => {
  notifications.value = []
}

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-50 text-emerald-600'
    case 'warning': return 'bg-amber-50 text-amber-600'
    case 'error': return 'bg-red-50 text-red-600'
    case 'message': return 'bg-purple-50 text-purple-600'
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
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 60000)
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
</style>
