import { ref } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useGetStayById = () => {
    const loading = ref(false);
    const selectedStay = ref<any>(null);

    const getStayById = async (id: string) => {
        loading.value = true;
        try {
            const { data } = await staysApi.getById(id);
            selectedStay.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching stay details:', error);
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
