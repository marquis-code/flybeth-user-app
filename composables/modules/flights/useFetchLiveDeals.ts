import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useFetchLiveDeals = () => {
    const loadingDeals = ref(false);
    const liveDeals = ref<any[]>([]);

    const fetchLiveDeals = async (origin = 'LOS') => {
        loadingDeals.value = true;
        try {
            const { data: res } = await flightsApi.getLiveDeals(origin);
            liveDeals.value = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
            return liveDeals.value;
        } catch (error) {
            console.error('Error fetching live flight deals:', error);
            liveDeals.value = [];
        } finally {
            loadingDeals.value = false;
        }
    };

    return {
        loadingDeals,
        liveDeals,
        fetchLiveDeals,
    };
};
