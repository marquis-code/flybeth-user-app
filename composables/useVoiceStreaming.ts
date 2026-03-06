import { ref, onBeforeUnmount } from 'vue';
import { io, Socket } from 'socket.io-client';

export const useVoiceStreaming = (apiBase: string) => {
    const isRecording = ref(false);
    const transcripts = ref<{ text: string; isFinal: boolean }[]>([]);
    const aiResponses = ref<{ text: string; action: string; data?: any }[]>([]);

    const debugLogs = ref<string[]>([]);
    const sessionStatus = ref<'idle' | 'connecting' | 'connected' | 'error'>('idle');

    let socket: Socket | null = null;
    let audioContext: AudioContext | null = null;
    let processor: ScriptProcessorNode | null = null;
    let input: MediaStreamAudioSourceNode | null = null;
    let stream: MediaStream | null = null;

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        debugLogs.value.push(`[${time}] ${msg}`);
        console.log(`[VoiceAI] ${msg}`);
    };

    const startStreaming = async (token?: string) => {
        debugLogs.value = [];
        sessionStatus.value = 'connecting';
        addLog('Requesting microphone access...');

        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            addLog('Microphone access granted.');

            // Initialize Socket.io with the specific namespace
            const socketUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
            addLog(`Connecting to socket: ${socketUrl}/voice-booking`);

            socket = io(`${socketUrl}/voice-booking`, {
                path: '/socket.io',
                transports: ['websocket', 'polling'],
            });

            // Audio Processing setup
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            return new Promise<void>((resolve, reject) => {
                socket!.on('connect', () => {
                    addLog('Socket connected to gateway.');
                    socket?.emit('start-streaming', {
                        sampleRate: 16000,
                        token: token
                    });
                });

                socket!.on('debug-log', (data) => {
                    addLog(data.message);
                });

                socket!.on('session-opened', (data) => {
                    addLog(`Transcription session opened: ${data.id}`);
                    sessionStatus.value = 'connected';
                    isRecording.value = true;
                    resolve();
                });

                socket!.on('transcript', (data) => {
                    transcripts.value.push(data);
                });

                socket!.on('ai-response', (data) => {
                    aiResponses.value.push(data);
                });

                socket!.on('error', (err) => {
                    addLog(`Error: ${err.message || JSON.stringify(err)}`);
                    sessionStatus.value = 'error';
                    reject(err);
                });

                socket!.on('connect_error', (err) => {
                    addLog(`Socket Connection Error: ${err.message}`);
                    sessionStatus.value = 'error';
                    reject(err);
                });

                input = audioContext!.createMediaStreamSource(stream!);
                processor = audioContext!.createScriptProcessor(4096, 1, 1);

                processor.onaudioprocess = (e) => {
                    if (!isRecording.value) return;

                    const inputData = e.inputBuffer.getChannelData(0);
                    const pcmData = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        pcmData[i] = Math.max(-1, Math.min(1, inputData[i] ?? 0)) * 0x7FFF;
                    }

                    if (socket?.connected) {
                        socket.emit('audio-data', new Uint8Array(pcmData.buffer));
                    }
                };

                input.connect(processor);
                processor.connect(audioContext!.destination);
            });
        } catch (err) {
            addLog(`Failed to start: ${err.message}`);
            sessionStatus.value = 'error';
            throw err;
        }
    };

    const stopStreaming = () => {
        addLog('Stopping stream...');
        isRecording.value = false;
        sessionStatus.value = 'idle';

        if (socket) {
            socket.emit('stop-streaming');
            socket.disconnect();
            socket = null;
        }

        if (processor) { processor.disconnect(); processor = null; }
        if (input) { input.disconnect(); input = null; }
        if (audioContext) { audioContext.close(); audioContext = null; }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    };

    onBeforeUnmount(() => {
        stopStreaming();
    });

    return {
        isRecording,
        transcripts,
        aiResponses,
        debugLogs,
        sessionStatus,
        startStreaming,
        stopStreaming,
    };
};
