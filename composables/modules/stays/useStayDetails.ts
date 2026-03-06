import { ref } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useStayDetails = () => {
    const loading = ref(false);
    const rooms = ref<any[]>([]);
    const selectedRoom = ref<any>(null);
    const selectedRate = ref<any>(null);
    const stayDetails = ref<any>(null);

    const fetchStayDetails = async (id: string, provider: string) => {
        loading.value = true;
        try {
            const { data: response } = await staysApi.getStay(id, { provider });
            stayDetails.value = response?.data || response;
            return stayDetails.value;
        } catch (error) {
            console.error('Error fetching stay details:', error);
            stayDetails.value = null;
        } finally {
            loading.value = false;
        }
    };

    const fetchStayRates = async (searchResultId: string, provider: string, query?: any) => {
        loading.value = true;
        try {
            const { data: response } = await staysApi.fetchRates(searchResultId, provider, query);
            const responseData = response?.data || response;
            rooms.value = Array.isArray(responseData) ? responseData : (responseData?.results || []);
            return rooms.value;
        } catch (error) {
            console.error('Error fetching stay rates:', error);
            rooms.value = [];
        } finally {
            loading.value = false;
        }
    };

    const createQuote = async (rateId: string, provider: string) => {
        loading.value = true;
        try {
            const { data: response } = await staysApi.createQuote(rateId, provider);
            return response?.data || response;
        } catch (error) {
            console.error('Error creating quote:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        rooms,
        selectedRoom,
        selectedRate,
        stayDetails,
        fetchStayDetails,
        fetchStayRates,
        createQuote
    };
};
