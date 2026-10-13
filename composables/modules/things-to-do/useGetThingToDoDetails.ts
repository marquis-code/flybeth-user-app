import { ref } from 'vue';
import { thingsToDoApi } from '@/api_factory/modules/things-to-do';

export const useGetThingToDoDetails = () => {
    const loading = ref(false);
    const thingToDo = ref<any>(null);

    const getDetails = async (id: string, provider: string) => {
        loading.value = true;
        try {
            const { data } = await thingsToDoApi.getDetails(id, provider);
            // Details come back as { success, data: {...} } — unwrap to the record.
            const payload = (data as any)?.data ?? data;
            thingToDo.value = payload;
            return payload;
        } catch (error) {
            console.error('Error fetching thing to do details:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        thingToDo,
        getDetails,
    };
};
