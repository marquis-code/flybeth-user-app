import { ref } from 'vue';
import { staysApi } from '@/api_factory/modules/stays';

export const useStayDetails = () => {
    const loading = ref(false);
    const rooms = ref<any[]>([]);
    const selectedRoom = ref<any>(null);
    const selectedRate = ref<any>(null);
    const stayDetails = ref<any>(null);

    const fetchStayDetails = async (id: string, provider: string) => {
        loading.value = true;
        try {
            const { data: response } = await staysApi.getStay(id, { provider });
            stayDetails.value = response?.data || response;
            return stayDetails.value;
        } catch (error) {
            console.error('Error fetching stay details:', error);
            stayDetails.value = null;
        } finally {
            loading.value = false;
        }
    };

    const fetchStayRates = async (searchResultId: string, provider: string, query?: any) => {
        loading.value = true;
        try {
            const { data: response } = await staysApi.fetchRates(searchResultId, provider, query);
            const responseData = response?.data || response;
            rooms.value = Array.isArray(responseData) ? responseData : (responseData?.results || []);
            return rooms.value;
        } catch (error) {
            console.error('Error fetching stay rates:', error);
            rooms.value = [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * Resolve a property by accommodation id through the live search so we can
     * recover the provider's opaque `searchResultId`, then load its rates from
     * `/stays/rates` - the only endpoint that returns the backend-computed
     * customer price (`priceWithCommission`).
     */
    const fetchStayRatesByAccommodationId = async (accommodationId: string, query?: any) => {
        const adultsCount = Number(query?.adults) > 0 ? Number(query.adults) : 2;
        const childrenCount = Number(query?.children) > 0 ? Number(query.children) : 0;
        try {
            const { data: response } = await staysApi.searchLive({
                accommodationId,
                checkInDate: query?.checkIn,
                checkOutDate: query?.checkOut,
                guests: [
                    ...Array.from({ length: adultsCount }).map(() => ({ type: 'adult' })),
                    ...Array.from({ length: childrenCount }).map(() => ({ type: 'child', age: 7 })),
                ],
                rooms: Number(query?.rooms) > 0 ? Number(query.rooms) : 1,
            });
            const payload = response?.data || response;
            const results = payload?.results || (Array.isArray(payload) ? payload : []);
            const hit = results.find((r: any) => r?.searchResultId) || null;
            if (!hit) return null;
            await fetchStayRates(hit.searchResultId, hit.provider, query);
            return hit;
        } catch (error) {
            console.error('Error resolving stay rates by accommodation id:', error);
            return null;
        }
    };

    /**
     * Last-resort fallback: read the platform inventory straight from the stay's
     * rooms when no usable `searchResultId` exists (e.g. a direct/deep link to
     * /stays/<id>). Maps internal Room documents onto the same shape `/stays/rates`
     * returns so the page and checkout stay agnostic to where the room came from.
     *
     * NOTE: this endpoint exposes NET internal pricing only (no commission), so
     * `priceWithCommission` is intentionally left null here - the UI must never
     * present the net `price` as the payable amount.
     */
    const fetchStayRooms = async (stayId: string, query?: any) => {
        loading.value = true;
        try {
            const { data: response } = await staysApi.getStayRooms(stayId);
            const responseData = response?.data || response;
            const list = Array.isArray(responseData) ? responseData : [];

            let nights = 1;
            if (query?.checkIn && query?.checkOut) {
                const diff = Math.round(
                    (new Date(query.checkOut).getTime() - new Date(query.checkIn).getTime()) / 86400000
                );
                if (Number.isFinite(diff) && diff > 0) nights = diff;
            }
            const roomsCount = Number(query?.rooms) > 0 ? Number(query.rooms) : 1;

            rooms.value = list.map((room: any) => {
                const netTotal = Math.round(Number(room.pricePerNight || 0) * nights * roomsCount * 100) / 100;
                return {
                    name: room.name,
                    photos: room.images || [],
                    beds: room.beds || [],
                    // Internal Mongo Room id - accepted by POST /bookings for flybeth inventory.
                    roomId: room._id,
                    rates: [{
                        rateId: room.rateId || null,
                        price: netTotal,
                        // NET on purpose: no customer price is available from this endpoint.
                        priceWithCommission: null,
                        currency: 'USD',
                        boardType: 'room_only',
                        cancellationTimeline: [],
                        conditions: [],
                    }],
                };
            });
            return rooms.value;
        } catch (error) {
            console.error('Error fetching stay rooms:', error);
            rooms.value = [];
        } finally {
            loading.value = false;
        }
    };

    const createQuote = async (rateId: string, provider: string) => {
        loading.value = true;
        try {
            const { data: response } = await staysApi.createQuote(rateId, provider);
            return response?.data || response;
        } catch (error) {
            console.error('Error creating quote:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        rooms,
        selectedRoom,
        selectedRate,
        stayDetails,
        fetchStayDetails,
        fetchStayRates,
        fetchStayRatesByAccommodationId,
        fetchStayRooms,
        createQuote
    };
};
