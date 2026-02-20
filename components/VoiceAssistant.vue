<template>
  <div class="fixed bottom-10 right-10 z-[9999]">
    <!-- Trigger Button -->
    <button 
      @click="toggleVoice"
      class="h-18 w-18 md:h-10 md:w-10 rounded-full bg-brand-blue text-white shadow-[0_20px_50px_rgba(13,29,173,0.3)] flex items-center justify-center transform transition-all duration-500 hover:scale-110 active:scale-95 group relative ring-4 ring-white"
      :class="{ 'bg-red-500 shadow-[0_20px_50px_rgba(239,68,68,0.4)]': isRecording }"
      aria-label="Toggle Voice AI Assistant"
    >
      <div v-if="isRecording" class="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></div>
      <div class="absolute -inset-2 bg-brand-blue/20 rounded-full blur-xl group-hover:bg-brand-blue/30 transition-all"></div>
      
      <svg v-if="!isRecording" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Sidebar/Drawer Overlay -->
    <Transition name="slide-up">
      <div 
        v-if="isOpen"
        class="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[-20px_0_60px_-15px_rgba(13,29,173,0.15)] border-l border-gray-50 flex flex-col z-[190] overflow-hidden rounded-l-[3rem]"
      >
        <!-- Header -->
        <div class="p-8 border-b border-gray-50 flex items-center justify-between bg-brand-blue/5">
          <div>
            <h2 class="text-2xl font-black text-brand-blue font-header tracking-tighter">Flybeth AI</h2>
            <p class="text-[10px] uppercase font-black tracking-widest text-brand-blue/40 mt-1">Real-time Voice Assistant</p>
          </div>
          <button @click="isOpen = false" class="text-brand-gray/40 hover:text-brand-blue transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white" ref="chatRef">
          <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center py-12">
            <div class="h-20 w-20 rounded-full bg-brand-blue/5 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-brand-blue/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-black text-brand-blue/40">Ready to help with your booking</h3>
            <p class="text-xs text-brand-gray/40 mt-2 max-w-[240px]">Tap the microphone and say "Find me a flight to London" or "I need a hotel in Paris".</p>
          </div>

          <div v-for="(msg, idx) in messages" :key="idx" :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div 
              :class="[
                'max-w-[85%] p-5 rounded-3xl text-sm font-bold tracking-tight',
                msg.role === 'user' ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' : 'bg-gray-50 text-brand-gray border border-gray-100'
              ]"
            >
              {{ msg.text }}
              
              <!-- Intent Data Cards (Flights/Stays) -->
              <div v-if="msg.data" class="mt-4 space-y-4">
                <div v-if="msg.data.type === 'flight'" class="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <p class="text-[10px] font-black uppercase opacity-60">Search Result</p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-lg font-black">{{ msg.data.origin }} → {{ msg.data.destination }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real-time Partial Transcript -->
          <div v-if="isRecording && partialTranscript" class="flex justify-end">
            <div class="max-w-[85%] p-5 rounded-3xl bg-brand-blue/10 text-brand-blue text-sm font-bold tracking-tight animate-pulse border border-brand-blue/20 italic">
              {{ partialTranscript }}...
            </div>
          </div>
        </div>

        <!-- Footer / Visualizer -->
        <div class="p-8 bg-gray-50/50 border-t border-gray-100">
          <div v-if="isRecording" class="flex flex-col items-center gap-6">
            <div class="flex items-center gap-2 h-12">
              <div v-for="i in 8" :key="i" 
                class="w-1 bg-brand-blue rounded-full transition-all duration-75"
                :style="{ height: Math.max(8, Math.random() * 40) + 'px' }"
              ></div>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-brand-blue animate-pulse">Listening for your command...</p>
            <UiBaseButton variant="secondary" size="lg" block @click="stopRecording" class="!bg-red-500 !text-white hover:!bg-red-600 border-none">
              Stop Recording
            </UiBaseButton>
          </div>
          <div v-else class="flex flex-col items-center gap-4">
             <UiBaseButton 
                variant="primary" 
                size="lg" 
                block 
                @click="startRecording" 
                class="flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/30"
             >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span class="font-black uppercase tracking-widest text-xs">Speak to AI</span>
             </UiBaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useStartVoiceSession } from '@/composables/modules/voice-agent/useStartVoiceSession'
import { useVoiceSocket } from '@/composables/modules/voice-agent/useVoiceSocket'
import { useVoiceResponse } from '@/composables/modules/voice-agent/useVoiceResponse'
import { useVoiceFlow } from '@/composables/modules/voice-agent/useVoiceFlow'
import { useVoiceTextInput } from '@/composables/modules/voice-agent/useVoiceTextInput'

const { startSession, sessionId, streamingToken } = useStartVoiceSession()
const { connect, isConnected } = useVoiceSocket()
const { aiResponse } = useVoiceResponse()
const { flowUpdate } = useVoiceFlow()
const { emitTextInput } = useVoiceTextInput()

const isOpen = ref(false)
const isRecording = ref(false)
const partialTranscript = ref('')
const messages = ref<{role: 'user' | 'ai', text: string, data?: any}[]>([])
const chatRef = ref<HTMLElement | null>(null)

// AssemblyAI Realtime STT State
let transcriber: any = null
let socket: WebSocket | null = null

const toggleVoice = () => {
  isOpen.value = !isOpen.value
}

watch(isOpen, async (val) => {
  if (val) {
    if (!sessionId.value) {
      await startSession()
    }
    connect()
  }
})

watch(aiResponse, (resp) => {
  if (resp) {
    messages.value.push({ role: 'ai', text: resp.response, data: resp.data })
    scrollToBottom()
  }
})

const scrollToBottom = () => {
  nextTick(() => {
    if (chatRef.value) {
      chatRef.value.scrollTop = chatRef.value.scrollHeight
    }
  })
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    isRecording.value = true
    partialTranscript.value = ''
    
    // Direct AssemblyAI WSS implementation
    if (!streamingToken.value) {
      await startSession()
    }

    const url = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${streamingToken.value}`
    socket = new WebSocket(url)

    socket.onmessage = (message) => {
      const { message_type, text } = JSON.parse(message.data)
      if (message_type === 'PartialTranscript') {
        partialTranscript.value = text
      } else if (message_type === 'FinalTranscript') {
        partialTranscript.value = ''
        if (text) {
          messages.value.push({ role: 'user', text })
          emitTextInput(text, sessionId.value!)
          scrollToBottom()
        }
      }
    }

    socket.onopen = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      source.connect(processor)
      processor.connect(audioContext.destination)

      processor.onaudioprocess = (e) => {
        if (socket?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0)
          const audioBuffer = new Int16Array(inputData.length)
          for (let i = 0; i < inputData.length; i++) {
            audioBuffer[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF
          }
          socket.send(JSON.stringify({ audio_data: btoa(String.fromCharCode(...new Uint8Array(audioBuffer.buffer))) }))
        }
      }
    }

    socket.onerror = (e) => {
      console.error('AssemblyAI WSS Error:', e)
      stopRecording()
    }

  } catch (err) {
    console.error('Failed to start recording:', err)
  }
}

const stopRecording = () => {
  isRecording.value = false
  if (socket) {
    socket.send(JSON.stringify({ terminate_session: true }))
    socket.close()
    socket = null
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(13, 29, 173, 0.05);
  border-radius: 10px;
}
</style>
