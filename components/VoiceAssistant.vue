<template>
  <div class="fixed bottom-8 right-8 z-[100]">
    <!-- Trigger Button -->
    <button 
      @click="toggleOverlay"
      class="w-16 h-16 rounded-full bg-brand-blue shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group overflow-hidden relative"
      :class="{ 'animate-pulse bg-red-500': isRecording }"
    >
      <div v-if="isRecording" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div class="voice-wave"></div>
      </div>
      
      <svg v-if="!isRecording" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    </button>

    <!-- Overlay Interface -->
    <Transition name="fade-slide">
      <div v-if="showOverlay" class="absolute bottom-20 right-0 w-[400px] max-h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100/50 flex flex-col overflow-hidden backdrop-blur-xl">
        <!-- Header -->
        <div class="p-8 bg-brand-blue text-white">
          <h3 class="text-xl   flex items-center gap-3">
            Flybeth Voice Assistant
            <span class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
          </h3>
          <p class="text-xs font-bold text-white/50 tracking-tight mt-1 ">Real-time conversational booking</p>
        </div>

        <!-- Chat History -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]" ref="chatBox">
          <div v-for="(msg, i) in conversation" :key="i" 
               :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm',
              msg.role === 'user' ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-gray-50 text-gray-900 rounded-tl-none border border-gray-100'
            ]">
              {{ msg.text }}
            </div>
          </div>
          
          <!-- Partial Transcript (Real-time feedback) -->
          <div v-if="partialTranscript" class="flex justify-end opacity-50 ">
            <div class="max-w-[85%] p-4 rounded-3xl text-sm font-medium bg-brand-blue/30 text-white rounded-tr-none border border-white/20">
              {{ partialTranscript }}...
            </div>
          </div>
          
          <!-- AI Thinking Indicator -->
          <div v-if="isThinking" class="flex justify-start">
            <div class="bg-gray-50 p-4 rounded-3xl rounded-tl-none border border-gray-100 flex gap-1">
              <span class="w-1.5 h-1.5 bg-brand-blue/40 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
          
          <!-- Flight Results Preview -->
          <div v-if="latestResults.length" class="space-y-4 mt-6">
             <div class="flex items-center gap-2 px-2">
                <span class="text-sm  uppercase text-gray-900 tracking-widest">Available Options</span>
                <div class="flex-1 h-[1px] bg-brand-blue/10"></div>
             </div>
             <div v-for="flight in latestResults" :key="flight.offerId" class="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-brand-blue transition-all group overflow-hidden relative">
                <div class="absolute top-0 right-0 p-3">
                   <span class="px-2 py-1 bg-brand-green/10 text-brand-green text-[8px]  rounded-full uppercase">Verified</span>
                </div>
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <div class="text-sm  uppercase text-brand-gray/40 mb-1 leading-none">{{ flight.airline }}</div>
                    <div class="text-[11px] font-bold text-gray-900">{{ flight.flightNumbers?.join(', ') }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-brand-gray/40 font-bold mb-1">Price</div>
                    <div class="text-xl  text-gray-900 leading-none">${{ flight.priceWithCommission }}</div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between gap-4 mt-2">
                   <div class="text-center">
                      <div class="text-lg  text-gray-900 leading-none">{{ flight.origin }}</div>
                      <div class="text-[9px] font-bold text-gray-400 mt-1">Origin</div>
                   </div>
                   
                   <div class="flex-1 flex flex-col items-center gap-1 group-hover:px-2 transition-all">
                      <div class="text-[8px]  text-gray-900 uppercase">{{ flight.duration }}m</div>
                      <div class="w-full h-[2px] bg-brand-blue/10 relative rounded-full overflow-hidden">
                        <div class="absolute inset-0 bg-brand-blue/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </div>
                      <div class="text-[8px]  text-gray-900 uppercase">{{ flight.stops === 0 ? 'Direct' : `${flight.stops} Stop` }}</div>
                   </div>

                   <div class="text-center">
                      <div class="text-lg  text-gray-900 leading-none">{{ flight.destination }}</div>
                      <div class="text-[9px] font-bold text-gray-400 mt-1">Dest</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Debug Perspective Toggle -->
        <div v-if="debugLogs.length" class="px-8 pb-4">
          <button @click="showDebug = !showDebug" class="text-[9px]  uppercase tracking-widest text-brand-gray/40 hover:text-gray-900 flex items-center gap-2">
            {{ showDebug ? 'Hide Console' : 'Show Debug Console' }}
            <span :class="{'rotate-180': showDebug}" class="transition-transform">▼</span>
          </button>
          <div v-if="showDebug" class="mt-2 p-4 bg-black/90 text-sm font-mono text-green-400 rounded-2xl max-h-40 overflow-y-auto border border-white/10 shadow-inner">
            <div v-for="(log, i) in debugLogs" :key="i" class="mb-1 opacity-80 border-b border-white/5 pb-1">
              {{ log }}
            </div>
          </div>
        </div>

        <!-- Footer Control -->
        <div class="p-8 border-t border-gray-50 bg-gray-50/50">
          <div class="flex items-center justify-between mb-4">
             <div class="flex gap-1 h-4 items-center">
                <div v-for="i in 5" :key="i" class="w-1 bg-brand-blue rounded-full" 
                     :style="{ height: isRecording ? `${Math.random() * 100}%` : '20%', transition: 'height 0.1s' }"></div>
             </div>
             <span class="text-sm  text-brand-gray/40 uppercase tracking-widest">
               {{ isThinking ? 'AI is processing...' : (isRecording ? 'Listening...' : 'Ready to help') }}
             </span>
          </div>
          
          <button 
            @click="isRecording ? stopRecording() : startRecording()"
            :disabled="sessionStatus === 'connecting' || isThinking"
            class="w-full py-4 rounded-full  text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-blue/5"
            :class="isRecording ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-brand-blue text-white hover:scale-[1.01] active:scale-[0.98]'"
          >
            <span v-if="sessionStatus === 'connecting'">Connecting...</span>
            <span v-else-if="isThinking">Thinking...</span>
            <span v-else>{{ isRecording ? 'Stop Recording' : 'Start Talking' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useVoiceStreaming } from '~/composables/useVoiceStreaming';
import { useRuntimeConfig } from '#app';
import { useAuth } from '~/composables/modules/auth/useAuth';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { showToast } = useCustomToast();
const { token } = useAuth();
const config = useRuntimeConfig();
const { isRecording, transcripts, aiResponses, debugLogs, sessionStatus, startStreaming, stopStreaming } = useVoiceStreaming(config.public.apiBase || 'http://localhost:3000');

const showOverlay = ref(false);
const showDebug = ref(false);
const chatBox = ref<HTMLElement | null>(null);
const latestResults = ref<any[]>([]);
const conversation = ref<{ role: 'user' | 'assistant'; text: string }[]>([]);
const isThinking = ref(false);
const partialTranscript = ref('');

// Track last processed indices so we append chronologically
let lastTranscriptIdx = 0;
let lastAiResponseIdx = 0;

// Watch for new final transcripts — push to conversation in order
watch(transcripts, (val) => {
  if (!val) return;
  for (let i = lastTranscriptIdx; i < val.length; i++) {
    const item = val[i];
    if (item) {
      if (item.isFinal) {
        conversation.value.push({ role: 'user', text: item.text });
        partialTranscript.value = ''; // Clear partial when final arrives
        
        // Start "Thinking" when a user finishes speaking
        isThinking.value = true;
      } else {
        partialTranscript.value = item.text;
      }
    }
  }
  lastTranscriptIdx = val.length;
  scrollToBottom();
}, { deep: true });

// Watch for new AI responses — push to conversation in order
watch(aiResponses, (val) => {
  if (!val) return;
  for (let i = lastAiResponseIdx; i < val.length; i++) {
    const item = val[i];
    if (item) {
      // AI responded, stop thinking
      isThinking.value = false;
      
      conversation.value.push({ role: 'assistant', text: item.text });

      // Handle specific actions
      if (item.action === 'show_results' && item.data) {
        latestResults.value = item.data;
      }

      if (item.action === 'init_checkout') {
         // In a real app, you'd redirect to /checkout or open a modal
          console.log('Initiating checkout with:', item.data);
          setTimeout(() => {
             showToast({
               title: "Redirecting to Checkout",
               message: `Transferring you to checkout for: ${item.data.fullName || 'booking'}`,
               toastType: "info",
             });
          }, 1500);
      }

      // Speak the AI response aloud
      speakText(item.text);
    }
  }
  lastAiResponseIdx = val.length;
  scrollToBottom();
}, { deep: true });

const toggleOverlay = () => {
  showOverlay.value = !showOverlay.value;
};

const startRecording = async () => {
  // Reset conversation state for a fresh session
  conversation.value = [];
  latestResults.value = [];
  partialTranscript.value = '';
  lastTranscriptIdx = 0;
  lastAiResponseIdx = 0;
  
  try {
    await startStreaming(token.value);
  } catch (err) {
    console.error('Start streaming failed:', err);
    showDebug.value = true; // Auto-show debug on error
  }
};

const stopRecording = () => {
  stopStreaming();
  window.speechSynthesis?.cancel();
};

const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.voice-wave {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, white 0%, transparent 70%);
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(3); opacity: 0.5; }
  100% { transform: scale(1); opacity: 0.1; }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
