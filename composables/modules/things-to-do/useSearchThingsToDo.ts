import { ref } from 'vue';
import { thingsToDoApi } from '@/api_factory/modules/things-to-do';

export const useSearchThingsToDo = () => {
    const loading = ref(false);
    const thingsToDo = ref<any[]>([]);

    const searchThingsToDo = async (searchData: any) => {
        loading.value = true;
        try {
            const { data } = await thingsToDoApi.searchLive(searchData);
            thingsToDo.value = data.results;
            return data;
        } catch (error) {
            console.error('Error searching things to do:', error);
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
