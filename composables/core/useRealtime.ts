import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useCustomToast } from './useCustomToast';

// Global shared state
const socket = ref<Socket | null>(null);
const isConnected = ref(false);
const notifications = ref<any[]>([]);
const newMessages = ref<any[]>([]);

export const useRealtime = () => {
  const { showToast } = useCustomToast();

  const connect = () => {
    if (socket.value && socket.value.connected) return;

    // Use Nuxt useCookie for SSR-friendly token retrieval
    const token = useCookie('accessToken').value || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '');
    
    if (!token) {
        console.log('[User] Connecting as Guest (no token)');
    }

    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || 'http://localhost:3000/api/v1';
    // Sockets connect to the root + namespace, NOT the /api/v1 prefix
    const rootUrl = apiBase.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
    const socketUrl = `${rootUrl}/chat`;
    
    console.log(`[User] Connecting to WebSocket at: ${socketUrl}`);

    socket.value = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
      console.log('[User] WebSocket connected');
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
      console.log('[User] WebSocket disconnected');
    });

    socket.value.on('connect_error', (err) => {
      console.error('[User] WebSocket connection error:', err);
    });

    socket.value.on('notification', (notification) => {
      notifications.value.unshift(notification);
      showToast({
        title: notification.title || 'Support Update',
        message: notification.message || notification.content,
        toastType: 'info',
      });
      
      window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
    });

    socket.value.on('newMessage', (message) => {
      newMessages.value.push(message);
      window.dispatchEvent(new CustomEvent('new-chat-message', { detail: message }));
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };

  return {
    socket,
    isConnected,
    notifications,
    newMessages,
    connect,
    disconnect
  };
};
