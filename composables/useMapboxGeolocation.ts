import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export interface GeoLocation {
  latitude: number
  longitude: number
  countryCode: string
  countryName: string
  city: string
  region: string
}

/**
 * useMapboxGeolocation
 *
 * Uses Mapbox Reverse Geocoding to determine the user's location
 * from browser geolocation coordinates. Returns country code, city, etc.
 */
export const useMapboxGeolocation = () => {
  const location = ref<GeoLocation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Reverse-geocode coordinates using Mapbox Geocoding API v5
   * Returns country code (ISO 3166-1 alpha-2), country name, city, etc.
   */
  const reverseGeocode = async (lat: number, lng: number): Promise<GeoLocation | null> => {
    const config = useRuntimeConfig()
    const token = config.public.mapboxAccessToken as string

    if (!token) {
      console.warn('[useMapboxGeolocation] No Mapbox access token configured')
      return null
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=country,region,place&limit=1`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Mapbox API returned ${res.status}`)

      const data = await res.json()
      const features = data.features || []

      let countryCode = ''
      let countryName = ''
      let city = ''
      let region = ''

      for (const feature of features) {
        if (feature.place_type?.includes('country')) {
          countryCode = feature.properties?.short_code?.toUpperCase() || ''
          countryName = feature.text || ''
        }
        if (feature.place_type?.includes('place')) {
          city = feature.text || ''
        }
        if (feature.place_type?.includes('region')) {
          region = feature.text || ''
        }
        // Also check context array for country info
        if (feature.context) {
          for (const ctx of feature.context) {
            if (ctx.id?.startsWith('country.') && !countryCode) {
              countryCode = ctx.short_code?.toUpperCase() || ''
              countryName = ctx.text || ''
            }
            if (ctx.id?.startsWith('region.') && !region) {
              region = ctx.text || ''
            }
            if (ctx.id?.startsWith('place.') && !city) {
              city = ctx.text || ''
            }
          }
        }
      }

      if (!countryCode && features.length > 0) {
        // Fallback: try to extract from first feature's context
        const firstFeature = features[0]
        if (firstFeature.context) {
          for (const ctx of firstFeature.context) {
            if (ctx.id?.startsWith('country.')) {
              countryCode = ctx.short_code?.toUpperCase() || ''
              countryName = ctx.text || ''
            }
          }
        }
      }

      return {
        latitude: lat,
        longitude: lng,
        countryCode,
        countryName,
        city: city || region,
        region
      }
    } catch (err: any) {
      console.error('[useMapboxGeolocation] Reverse geocode failed:', err.message)
      return null
    }
  }

  /**
   * Detect user location using browser Geolocation API + Mapbox reverse geocoding.
   * Returns the detected GeoLocation or null.
   */
  const detectUserLocation = (): Promise<GeoLocation | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        console.warn('[useMapboxGeolocation] Geolocation API not available')
        error.value = 'Geolocation not supported'
        resolve(null)
        return
      }

      loading.value = true
      error.value = null

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
            if (geo) {
              location.value = geo
              console.log('[useMapboxGeolocation] Detected location:', geo)
            }
            resolve(geo)
          } catch (err: any) {
            error.value = err.message
            resolve(null)
          } finally {
            loading.value = false
          }
        },
        (geoErr) => {
          console.warn('[useMapboxGeolocation] Browser geolocation denied:', geoErr.message)
          // Fallback: try IP-based geolocation
          detectViaIP().then(resolve).finally(() => { loading.value = false })
        },
        { timeout: 8000, maximumAge: 300000 } // 8s timeout, cache for 5min
      )
    })
  }

  /**
   * Fallback: detect location via free IP geolocation, then reverse geocode
   * with Mapbox to get accurate country info.
   */
  const detectViaIP = async (): Promise<GeoLocation | null> => {
    try {
      // Try ipapi.co first (free, no key needed, returns country code directly)
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) })
      if (!res.ok) throw new Error('IP lookup failed')
      const data = await res.json()

      if (data?.latitude && data?.longitude) {
        const geo = await reverseGeocode(data.latitude, data.longitude)
        if (geo) {
          location.value = geo
          return geo
        }
        // If Mapbox reverse geocode fails, still return IP data
        const fallback: GeoLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
          countryCode: data.country_code || '',
          countryName: data.country_name || '',
          city: data.city || '',
          region: data.region || ''
        }
        location.value = fallback
        return fallback
      }
      return null
    } catch (err: any) {
      console.error('[useMapboxGeolocation] IP fallback failed:', err.message)
      error.value = 'Could not detect location'
      return null
    }
  }

  return {
    location,
    loading,
    error,
    detectUserLocation,
    reverseGeocode
  }
}
