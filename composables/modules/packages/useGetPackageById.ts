import { ref } from 'vue';
import { packagesApi } from '@/api_factory/modules/packages';

export const useGetPackageById = () => {
    const loading = ref(false);
    const selectedPackage = ref<any>(null);

    const getPackageById = async (id: string) => {
        loading.value = true;
        try {
            const { data } = await packagesApi.getById(id);
            selectedPackage.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching package details:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        selectedPackage,
        getPackageById,
    };
};
