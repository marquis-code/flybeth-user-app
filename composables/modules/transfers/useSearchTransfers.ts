import { ref } from 'vue';
import { transfersApi } from '@/api_factory/modules/transfers';

export const useSearchTransfers = () => {
    const loading = ref(false);
    const transfers = ref<any[]>([]);

    const outboundTransfers = ref<any[]>([]);
    const returnTransfers = ref<any[]>([]);

    const searchTransfers = async (searchData: any, isReturn = false) => {
        loading.value = true;
        try {
            const { data } = await transfersApi.searchLive(searchData);
            const results = data?.data?.results || data?.results || [];
            if (isReturn) {
                returnTransfers.value = results;
            } else {
                outboundTransfers.value = results;
                transfers.value = results; // Backwards compatibility
            }
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
        outboundTransfers,
        returnTransfers,
        searchTransfers,
    };
};
