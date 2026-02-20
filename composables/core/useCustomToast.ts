import { ref } from "vue";

export interface ToastOptions {
    title: string;
    message: string;
    toastType: "success" | "error" | "info" | "warning";
    duration?: number;
}

export const useCustomToast = () => {
    const showToast = (options: ToastOptions) => {
        // Basic implementation for now, could be integrated with a toast library
        console.log(`[TOAST][${options.toastType.toUpperCase()}] ${options.title}: ${options.message}`);

        // In a real app, you'd trigger a global state or a library call here
        // alert(`${options.title}\n${options.message}`);
    };

    return {
        showToast,
    };
};
