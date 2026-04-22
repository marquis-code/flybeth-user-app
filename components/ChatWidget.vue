<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useChat } from '@/composables/modules/chat/useChat'
import { useRealtime } from '@/composables/core/useRealtime'
import { useUser } from '@/composables/modules/auth/user'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  SparklesIcon,
} from '@heroicons/vue/24/solid'

const BOT_USER_ID = "000000000000000000000001"
const isOpen = ref(false)
const isIdentifying = ref(false)
const messageText = ref('')
const scrollContainer = ref<HTMLElement | null>(null)
const unreadCount = ref(0)
const isTypingIndicator = ref(false)

// Guest info
const guestInfo = ref({
  name: '',
  email: ''
})

const { user, isLoggedIn } = useUser()
const { messages, activeRoom, findAdminAndStartChat, loading } = useChat()
const { socket, connect, isConnected } = useRealtime()

const isUserIdentified = computed(() => {
  if (isLoggedIn.value) return true
  return guestInfo.value.name.trim() !== '' && guestInfo.value.email.trim() !== ''
})

const currentUserId = computed(() => {
  if (isLoggedIn.value) return user.value?._id || user.value?.id
  return 'guest'
})

const toggleChat = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    if (!isConnected.value) connect()
    
    if (!isUserIdentified.value && !isLoggedIn.value) {
      isIdentifying.value = true
    } else if (!activeRoom.value) {
      await initializeChatRoom()
    }
  }
}

const submitIdentification = async () => {
  if (!guestInfo.value.name.trim() || !guestInfo.value.email.trim()) return
  isIdentifying.value = false
  await initializeChatRoom()
}

const initializeChatRoom = async () => {
  try {
    let room: any
    if (isLoggedIn.value) {
      room = await findAdminAndStartChat(undefined, {
        userId: user.value?._id || user.value?.id,
        name: `${user.value?.firstName || ''} ${user.value?.lastName || ''}`.trim() || 'User',
        email: user.value?.email || ''
      })
    } else {
      room = await findAdminAndStartChat(guestInfo.value)
    }
    
    if (room && socket.value) {
      socket.value.emit('joinRoom', room._id)
      scrollToBottom()
    }
  } catch (e) {
    console.error('Chat initialization failed', e)
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

const handleSendMessage = () => {
  if (!messageText.value.trim() || !socket.value || !activeRoom.value) {
    if (!activeRoom.value && isUserIdentified.value) {
      initializeChatRoom()
    }
    return
  }

  const payload = {
    roomId: activeRoom.value._id,
    content: messageText.value,
    type: 'text',
    metadata: {
       userName: isLoggedIn.value ? `${user.value?.firstName} ${user.value?.lastName}` : guestInfo.value.name,
       userEmail: isLoggedIn.value ? user.value?.email : guestInfo.value.email,
       isGuest: !isLoggedIn.value
    }
  }

  socket.value.emit('sendMessage', payload)
  
  // Optimistic UI
  const tempMsg = {
     _id: `temp-${Date.now()}`,
     room: activeRoom.value._id,
     sender: { _id: currentUserId.value, firstName: isLoggedIn.value ? user.value?.firstName : guestInfo.value.name },
     content: messageText.value,
     createdAt: new Date().toISOString(),
     isBot: false,
     isAutoResponse: false,
  }
  messages.value.push(tempMsg)
  
  messageText.value = ''
  scrollToBottom()
}

const isBotMessage = (msg: any) => {
  return msg.isBot || msg.isAutoResponse || 
    msg.type === 'bot_response' || 
    String(msg.sender?._id || msg.sender) === BOT_USER_ID ||
    msg.metadata?.isBot
}

const isMyMessage = (msg: any) => {
  if (isBotMessage(msg)) return false
  
  const senderId = String(msg.sender?._id || msg.sender)
  const myId = String(currentUserId.value || '')
  
  // Direct ID match
  if (senderId && myId && senderId !== 'null' && senderId !== 'undefined' && senderId === myId) {
    return true
  }
  
  // Guest/Identity matching via metadata
  const guestIdentifier = msg.metadata?.guestIdentifier || msg.metadata?.guestId
  if (guestIdentifier && guestIdentifier === myId) {
    return true
  }

  // Final fallback for guests
  if (!isLoggedIn.value && msg.metadata?.isGuest && !msg.metadata?.senderRole?.includes('admin')) {
    return true
  }

  return false
}

const getSenderLabel = (msg: any) => {
  if (isBotMessage(msg)) return 'Flybeth Bot'
  if (isMyMessage(msg)) return 'You'
  return msg.sender?.firstName || msg.metadata?.senderName || 'Support Agent'
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  }
}

// Quick question suggestions
const quickQuestions = [
  '✈️ Book a flight',
  '🏨 Find a hotel',
  '💳 Payment help',
  '📋 Check booking status',
  '🚗 Car rental'
]

const sendQuickQuestion = (q: string) => {
  // Remove the emoji prefix for cleaner message
  const cleanText = q.replace(/^[^\s]+\s/, '')
  messageText.value = cleanText
  handleSendMessage()
}

const handleOpenFromEvent = () => {
  isOpen.value = true
  if (isUserIdentified.value || isLoggedIn.value) {
     if (!activeRoom.value) initializeChatRoom()
  } else {
     isIdentifying.value = true
  }
}

onMounted(() => {
  connect()
  window.addEventListener('open-chat-bot', handleOpenFromEvent)
  
  // Real-time message listener
  const messageHandler = (e: any) => {
    const msg = e.detail
    if (activeRoom.value && (msg.room === activeRoom.value._id || msg.room?._id === activeRoom.value._id)) {
       // Logic to replace optimistic message
       const tempIdx = messages.value.findIndex(m => 
         m._id?.toString().startsWith('temp-') && 
         m.content === msg.content &&
         Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 10000
       )

       if (tempIdx !== -1) {
          messages.value[tempIdx] = msg
       } else if (!messages.value.find(m => m._id === msg._id)) {
          messages.value.push(msg)
          scrollToBottom()
          
          // If chat is not open, increment unread
          if (!isOpen.value) {
            unreadCount.value++
          }
          
          // Show typing indicator briefly for bot messages
          if (isBotMessage(msg)) {
            isTypingIndicator.value = false
          }
       }
    }
  }

  window.addEventListener('new-chat-message', messageHandler)
})

onUnmounted(() => {
  window.removeEventListener('open-chat-bot', handleOpenFromEvent)
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[1000005] sm:bottom-6 sm:right-6">
    <!-- Chat Button -->
    <button 
      @click="toggleChat"
      class="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group"
      :class="isOpen 
        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/30' 
        : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-600/40'"
    >
      <Transition name="fade" mode="out-in">
        <XMarkIcon v-if="isOpen" class="h-6 w-6 sm:h-7 sm:w-7" />
        <ChatBubbleLeftRightIcon v-else class="h-6 w-6 sm:h-7 sm:w-7" />
      </Transition>
      <!-- Unread badge -->
      <div 
        v-if="!isOpen && unreadCount > 0" 
        class="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] sm:text-[10px]  text-white animate-bounce"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </div>
      <!-- Online pulse -->
      <div v-if="!isOpen && unreadCount === 0" class="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 rounded-full border-2 border-white">
        <div class="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
      </div>
    </button>

    <!-- Chat Window -->
    <Transition name="slide-up">
      <div v-if="isOpen" 
        class="fixed inset-0 sm:absolute sm:bottom-20 sm:right-0 sm:inset-auto sm:w-[400px] sm:max-w-[calc(100vw-32px)] sm:max-h-[600px] sm:h-[80vh] bg-white sm:rounded-2xl shadow-2xl shadow-black/20 border border-gray-100 flex flex-col overflow-hidden origin-bottom-right"
      >
        <!-- Header -->
        <div class="p-5 bg-primary text-white shrink-0">
          <div class="flex items-center justify-between mb-2">
             <div class="flex items-center space-x-3">
                <div class="h-11 w-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                   <SparklesIcon class="h-6 w-6 text-white" />
                </div>
                <div>
                   <h3 class="font-bold text-base leading-tight">Flybeth Support</h3>
                   <div class="flex items-center space-x-2">
                      <div class="h-2 w-2 rounded-full" :class="isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'"></div>
                      <span class="text-[10px] font-semibold uppercase tracking-widest opacity-80">{{ isConnected ? 'Online' : 'Connecting...' }}</span>
                   </div>
                </div>
             </div>
             <button @click="isOpen = false" class="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <XMarkIcon class="h-5 w-5" />
             </button>
          </div>
          <p class="text-[11px] font-medium text-white">Powered by AI • Live agents available</p>
        </div>

        <!-- Identification Form -->
        <div v-if="isIdentifying" class="flex-1 p-6 flex flex-col justify-center space-y-6">
           <div class="text-center space-y-2">
              <div class="h-16 w-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                <UserIcon class="h-8 w-8 text-blue-600" />
              </div>
              <h4 class="text-xl font-bold text-gray-900">Welcome!</h4>
              <p class="text-sm text-gray-400">Help us get to know you before we chat.</p>
           </div>
           
           <div class="space-y-3">
              <div class="relative group">
                 <IdentificationIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                   v-model="guestInfo.name"
                   type="text" 
                   placeholder="Your name" 
                   class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                 />
              </div>
              <div class="relative group">
                 <EnvelopeIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                   v-model="guestInfo.email"
                   type="email" 
                   placeholder="Your email" 
                   class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                   @keyup.enter="submitIdentification"
                 />
              </div>
           </div>

           <button 
             @click="submitIdentification"
             :disabled="!guestInfo.name.trim() || !guestInfo.email.trim()"
             class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:shadow-none transition-all"
           >
              Start Chatting →
           </button>
        </div>

        <!-- Messages Area -->
        <div 
          v-else
          ref="scrollContainer"
          class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/80"
        >
          <!-- Loading -->
          <div v-if="loading && messages.length === 0" class="flex flex-col items-center justify-center h-full space-y-3 opacity-40">
             <div class="h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p class="text-[10px] font-bold uppercase tracking-widest">Connecting to support...</p>
          </div>

          <!-- Quick Questions (when no messages yet) -->
          <div v-else-if="messages.length === 0 && !loading" class="flex flex-col items-center justify-center h-full space-y-4">
             <div class="h-14 w-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
               <SparklesIcon class="h-7 w-7 text-blue-600" />
             </div>
             <p class="text-sm font-semibold text-gray-700">How can we help you?</p>
             <div class="flex flex-wrap gap-2 justify-center px-2">
               <button 
                 v-for="q in quickQuestions" 
                 :key="q" 
                 @click="sendQuickQuestion(q)"
                 class="px-3 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
               >
                 {{ q }}
               </button>
             </div>
          </div>

          <!-- Messages -->
          <template v-else>
            <div 
              v-for="(msg, idx) in messages" 
              :key="msg._id || idx" 
              class="flex flex-col"
              :class="isMyMessage(msg) ? 'items-end' : 'items-start'"
            >
               <!-- Bot message styling -->
               <div v-if="isBotMessage(msg)" class="max-w-[90%] flex items-start space-x-2">
                 <div class="h-7 w-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 mt-1">
                   <SparklesIcon class="h-3.5 w-3.5 text-white" />
                 </div>
                 <div>
                   <div class="bg-white text-gray-700 p-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm border border-gray-100 whitespace-pre-line">
                     {{ msg.content }}
                   </div>
                   <span class="text-[9px] font-semibold text-gray-400 mt-1 ml-1 block">
                     Flybeth Bot • {{ formatTime(msg.createdAt) }}
                   </span>
                 </div>
               </div>

               <!-- User/Guest message -->
               <div v-else-if="isMyMessage(msg)" class="max-w-[85%]">
                 <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
                   {{ msg.content }}
                 </div>
                 <span class="text-[9px] font-semibold text-gray-400 mt-1 text-right block mr-1">
                   You • {{ formatTime(msg.createdAt) }}
                 </span>
               </div>

               <!-- Admin/Agent message -->
               <div v-else class="max-w-[85%] flex items-start space-x-2">
                 <div class="h-7 w-7 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 mt-1">
                   <UserIcon class="h-3.5 w-3.5 text-gray-500" />
                 </div>
                 <div>
                   <div class="bg-white text-gray-700 p-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm border border-gray-100">
                     {{ msg.content }}
                   </div>
                   <span class="text-[9px] font-semibold text-gray-400 mt-1 ml-1 block">
                     {{ getSenderLabel(msg) }} • {{ formatTime(msg.createdAt) }}
                   </span>
                 </div>
               </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTypingIndicator" class="flex items-start space-x-2">
              <div class="h-7 w-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <SparklesIcon class="h-3.5 w-3.5 text-white" />
              </div>
              <div class="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                <div class="flex space-x-1">
                  <div class="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input Area -->
        <div v-if="!isIdentifying" class="p-3 bg-white border-t border-gray-100 shrink-0">
           <div class="flex items-end bg-gray-50 rounded-xl p-1.5 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
              <textarea 
                v-model="messageText"
                rows="1"
                placeholder="Type your message..." 
                class="flex-1 bg-transparent border-0 focus:ring-0 text-sm font-medium p-2.5 resize-none outline-none placeholder:text-gray-500 max-h-20"
                @keydown="handleKeyDown"
              ></textarea>
              <button 
                @click="handleSendMessage"
                :disabled="!messageText.trim() || !activeRoom"
                class="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md shadow-blue-600/20 disabled:opacity-20 disabled:shadow-none transition-all active:scale-90 shrink-0"
              >
                 <PaperAirplaneIcon class="h-4 w-4" />
              </button>
           </div>
           <p class="text-[9px] text-gray-500 text-center mt-1.5 font-medium">Flybeth Support • Available 24/7</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
</style>
