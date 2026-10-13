import { ref } from 'vue';
import { thingsToDoApi } from '@/api_factory/modules/things-to-do';

export const useSearchThingsToDo = () => {
    const loading = ref(false);
    const thingsToDo = ref<any[]>([]);

    const searchThingsToDo = async (searchData: any) => {
        loading.value = true;
        try {
            const { data } = await thingsToDoApi.searchLive(searchData);
            // Backend wraps live searches as { success, data: { results } };
            // alternate shapes may be { results } or a bare array.
            const payload = data?.data ?? data;
            const list = payload?.results ?? payload;
            thingsToDo.value = Array.isArray(list) ? list : [];
            return data;
        } catch (error) {
            console.error('Error searching things to do:', error);
            thingsToDo.value = [];
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        thingsToDo,
        searchThingsToDo,
    };
};
