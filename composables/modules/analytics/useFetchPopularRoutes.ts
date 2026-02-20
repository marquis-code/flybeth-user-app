import { ref } from 'vue';
import { analyticsApi } from '@/api_factory/modules/analytics';

export const useFetchPopularRoutes = () => {
    const loading = ref(false);
    const popularRoutes = ref<any[]>([]);

    const fetchPopularRoutes = async (params: any = {}) => {
        loading.value = true;
        try {
            const { data } = await analyticsApi.getPopularRoutes(params);
            popularRoutes.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching popular routes:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        popularRoutes,
        fetchPopularRoutes,
    };
};
