import { ref } from 'vue';
import { supportApi } from '@/api_factory/modules/support';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useSupport = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const submitInquiry = async (formData: { name: string; email: string; subject: string; message: string }) => {
    loading.value = true;
    try {
      const { status } = await supportApi.submitInquiry(formData);
      if (status === 200 || status === 201) {
        showToast({
          title: 'Message Sent',
          message: 'Your inquiry has been received. Our concierge team will get back to you shortly.',
          toastType: 'success'
        });
        return true;
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to send message. Please try again later.';
      showToast(msg, 'error');
      console.error('Inquiry error:', error);
    } finally {
      loading.value = false;
    }
    return false;
  };

  return {
    loading,
    submitInquiry
  };
};
