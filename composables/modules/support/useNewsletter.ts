import { ref } from 'vue';
import { supportApi } from '@/api_factory/modules/support';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useNewsletter = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const subscribe = async (email: string, source: string = 'footer') => {
    if (!email) return;
    loading.value = true;
    try {
      const { status } = await supportApi.subscribeNewsletter(email, source);
      if (status === 200 || status === 201) {
        showToast({
          title: 'Subscription Successful',
          message: 'You have been successfully added to our newsletter list.',
          toastType: 'success'
        });
        return true;
      }
    } catch (error: any) {
      // Errors are already toasted by the global axios interceptor in axios.config.ts
      // but we can add specific handling here if needed.
      console.error('Newsletter error:', error);
    } finally {
      loading.value = false;
    }
    return false;
  };

  return {
    loading,
    subscribe
  };
};
