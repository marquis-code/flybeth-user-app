import { ref } from 'vue';
import { packagesApi } from '@/api_factory/modules/packages';

export const useFetchFeaturedPackages = () => {
    const featuredPackages = ref<any[]>([]);

    const fetchFeaturedPackages = async () => {
        try {
            const { data } = await packagesApi.getFeatured();
            featuredPackages.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching featured packages:', error);
        }
    };

    return {
        featuredPackages,
        fetchFeaturedPackages,
    };
};
