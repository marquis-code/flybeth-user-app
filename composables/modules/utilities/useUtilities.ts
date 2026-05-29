import { ref } from 'vue'
import { utilitiesApi } from '@/api_factory/modules/utilities'

export const useUtilities = () => {
  const loadingAirlines = ref(false)
  const airlines = ref<any[]>([])

  const loadingAirports = ref(false)
  const airports = ref<any[]>([])

  const loadingCities = ref(false)
  const cities = ref<any[]>([])

  const fetchAirlines = async () => {
    loadingAirlines.value = true
    try {
      const response = await utilitiesApi.$_get_airlines()
      airlines.value = response.data?.data?.data || response.data?.data || []
    } catch (error) {
      console.error('Failed to fetch airlines:', error)
    } finally {
      loadingAirlines.value = false
    }
  }

  const fetchAirports = async () => {
    loadingAirports.value = true
    try {
      const response = await utilitiesApi.$_get_airports()
      airports.value = response.data?.data?.data || response.data?.data || []
    } catch (error) {
      console.error('Failed to fetch airports:', error)
    } finally {
      loadingAirports.value = false
    }
  }

  const fetchCities = async () => {
    loadingCities.value = true
    try {
      const response = await utilitiesApi.$_get_cities()
      cities.value = response.data?.data?.data || response.data?.data || []
    } catch (error) {
      console.error('Failed to fetch cities:', error)
    } finally {
      loadingCities.value = false
    }
  }

  return {
    loadingAirlines,
    airlines,
    fetchAirlines,
    loadingAirports,
    airports,
    fetchAirports,
    loadingCities,
    cities,
    fetchCities
  }
}
