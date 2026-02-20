import { ref } from 'vue';
import { packagesApi } from '@/api_factory/modules/packages';

export const useFetchAllPackages = () => {
    const loading = ref(false);
    const packages = ref<any[]>([]);

    const fetchAllPackages = async (params: any = {}) => {
        loading.value = true;
        try {
            const { data } = await packagesApi.getAll(params);
            packages.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        packages,
        fetchAllPackages,
    };
};
