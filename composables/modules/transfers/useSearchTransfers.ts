import { ref } from 'vue';
import { transfersApi } from '@/api_factory/modules/transfers';

export const useSearchTransfers = () => {
    const loading = ref(false);
    const transfers = ref<any[]>([]);

    const searchTransfers = async (searchData: any) => {
        loading.value = true;
        try {
            const { data } = await transfersApi.searchLive(searchData);
            transfers.value = data.results;
            return data;
        } catch (error) {
            console.error('Error searching transfers:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        transfers,
        searchTransfers,
    };
};
