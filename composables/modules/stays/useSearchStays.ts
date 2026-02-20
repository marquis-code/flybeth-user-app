import { ref } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useSearchStays = () => {
    const loading = ref(false);
    const stays = ref<any[]>([]);

    const searchStays = async (params: any) => {
        loading.value = true;
        try {
            const { data } = await staysApi.search(params);
            stays.value = data;
            return data;
        } catch (error) {
            console.error('Error searching stays:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        stays,
        searchStays,
    };
};
