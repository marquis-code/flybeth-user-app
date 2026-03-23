import { GATEWAY_ENDPOINT } from '../axios.config'

export const activitiesApi = {
    searchLive(data: { latitude: number, longitude: number, date?: string, radius?: number }) {
        return GATEWAY_ENDPOINT.post('/experiences/search/live', data)
    },
    getDetails(id: string, provider: string) {
        return GATEWAY_ENDPOINT.get(`/experiences/${id}`, { params: { provider } })
    }
}
