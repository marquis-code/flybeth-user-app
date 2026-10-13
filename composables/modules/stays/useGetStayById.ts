import { ref } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useGetStayById = () => {
    const loading = ref(false);
    const selectedStay = ref<any>(null);

    const getStayById = async (id: string, provider?: string) => {
        loading.value = true;
        try {
            // `getById` never existed on staysApi - the backend route is GET /stays/:id.
            const { data } = await staysApi.getStay(id, provider ? { provider } : {});
            selectedStay.value = data?.data || data;
            return selectedStay.value;
        } catch (error) {
            console.error('Error fetching stay details:', error);
            selectedStay.value = null;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        selectedStay,
        getStayById,
    };
};
