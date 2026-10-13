import { ref } from 'vue';
import { packagesApi } from '@/api_factory/modules/packages';

/**
 * The global axios interceptor wraps every response as `{ success, data, ... }`,
 * so a list can arrive as either the payload itself (`res.data` is an array) or
 * nested one level deep (`res.data.data` is an array). Anything else (an error
 * body, an object, undefined) must degrade to an empty list instead of being
 * spread into the results.
 */
const unwrapList = (res: any): any[] => {
    const payload = res?.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(res)) return res;
    return [];
};

export const useFetchAllPackages = () => {
    const loading = ref(false);
    const packages = ref<any[]>([]);

    const fetchAllPackages = async (params: any = {}) => {
        loading.value = true;
        try {
            // `allSettled` semantics: a failure of one source must not hide the
            // other source's results. `/packages/dynamic` intentionally returns
            // `[]` unless both `origin` and `destination` are supplied.
            const [staticRes, dynamicRes] = await Promise.all([
                packagesApi.getAll(params).catch((error: any) => {
                    console.error('Error fetching packages:', error?.message || error);
                    return null;
                }),
                packagesApi.getDynamic(params).catch(() => null), // Dynamic returns [] without origin+destination by design
            ]);

            const merged = [...unwrapList(staticRes), ...unwrapList(dynamicRes)];

            // De-duplicate on `_id` (falling back to `id`) keeping the first
            // occurrence, so a package published by both endpoints appears once.
            const seen = new Set<string>();
            packages.value = merged.filter((pkg: any) => {
                const key = String(pkg?._id || pkg?.id || '');
                if (!key) return true;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            return packages.value;
        } catch (error) {
            console.error('Error fetching packages:', error);
            return packages.value;
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
