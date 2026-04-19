import { ref } from 'vue';
import { flightsApi } from '@/api_factory/modules/flights';

export const useSearchFlights = () => {
    const loading = ref(false);
    const flights = ref<any[]>([]);
    const searchMeta = ref<any>(null);

    const searchFlights = async (searchData: any) => {
        loading.value = true;
        try {
            // Mapping frontend searchData to backend LiveFlightSearchDto
            const payload = {
                origin: searchData.origin,
                destination: searchData.destination,
                originLat: searchData.originLat,
                originLng: searchData.originLng,
                destLat: searchData.destLat,
                destLng: searchData.destLng,
                departureDate: searchData.departureDate,
                returnDate: searchData.returnDate,
                adults: searchData.adults || (searchData.passengers && !searchData.children && !searchData.infants ? searchData.passengers : 1),
                children: searchData.children || 0,
                infants: searchData.infants || (Number(searchData.infantsOnLap || 0) + Number(searchData.infantsInSeat || 0)) || 0,
                cabinClass: searchData.cabinClass || searchData.class || 'economy',
            };

            const { data, status } = await flightsApi.searchLive(payload);
            console.log(data, 'flights data here')

            if (status === 200 || status === 201) {
                // Robustly unwrap the results
                const results = data?.data?.results || data?.results || (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
                flights.value = results;
                searchMeta.value = data?.meta || data?.data?.meta;
                return results;
            }
            return [];
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        flights,
        searchMeta,
        searchFlights,
    };
};
