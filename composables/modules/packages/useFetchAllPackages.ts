import { ref } from 'vue';
import { packagesApi } from '@/api_factory/modules/packages';

export const useFetchAllPackages = () => {
    const loading = ref(false);
    const packages = ref<any[]>([]);

    const fetchAllPackages = async (params: any = {}) => {
        loading.value = true;
        try {
            const [staticRes, dynamicRes] = await Promise.all([
                packagesApi.getAll(params).catch(() => ({ data: { data: [] } })),
                packagesApi.getDynamic(params).catch(() => ({ data: [] })) // Dynamic returns array directly or wrapped? Wait, NestJS returns directly or wrapped?
            ]);
            
            const staticPackages = staticRes.data?.data || staticRes.data || [];
            const dynamicPackages = dynamicRes.data?.data || dynamicRes.data || [];
            
            packages.value = [...staticPackages, ...dynamicPackages];
            return packages.value;
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
