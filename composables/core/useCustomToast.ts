import { ref } from "vue";

export interface ToastOptions {
    id?: string;
    title: string;
    message: string;
    toastType: "success" | "error" | "info" | "warning";
    duration?: number;
}

// Global state for toasts
const toasts = ref<ToastOptions[]>([]);

export const useCustomToast = () => {
    const showToast = (options: ToastOptions) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast = { ...options, id };
        
        toasts.value.push(toast);

        if (options.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, options.duration || 5000);
        }
    };

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    };

    return {
        toasts,
        showToast,
        removeToast
    };
};
