/**
 * Formats any raw amenity (string, object, Duffel JSON string, etc.) into a clean human label.
 * Aggressively purges raw JSON artifacts like `{"type": "WIFI", "description": "wifi"}`.
 */
export const formatAmenity = (am: any): string => {
  if (!am) return ''
  let text = ''

  if (typeof am === 'string') {
    const trimmed = am.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed)
        return formatAmenity(parsed)
      } catch {
        const match = trimmed.match(/"description"\s*:\s*"([^"]+)"/i) || trimmed.match(/"type"\s*:\s*"([^"]+)"/i)
        text = match ? match[1] : trimmed.replace(/[{}"']/g, '').trim()
      }
    } else {
      text = trimmed
    }
  } else if (typeof am === 'object') {
    text = am.description || am.name || am.label || am.type || ''
  } else {
    text = String(am)
  }

  if (!text) return ''

  // Purge any residual JSON or string formatting
  const clean = text.replace(/[{}"':]/g, ' ').replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim()
  const upper = clean.toUpperCase()

  if (upper === 'WIFI' || upper.includes('WIFI') || upper.includes('INTERNET')) return 'Free WiFi'
  if (upper === 'POOL' || upper.includes('SWIMMING POOL') || upper.includes('POOL')) return 'Swimming Pool'
  if (upper === 'GYM' || upper === 'FITNESS' || upper.includes('FITNESS')) return 'Fitness Centre'
  if (upper === 'SPA' || upper.includes('SPA') || upper.includes('WELLNESS')) return 'Spa & Wellness'
  if (upper === 'PARKING' || upper.includes('PARKING')) return 'Free Parking'
  if (upper === 'BREAKFAST' || upper.includes('BREAKFAST')) return 'Breakfast Incl.'
  if (upper === 'RESTAURANT' || upper.includes('RESTAURANT') || upper.includes('DINING')) return 'Restaurant'
  if (upper === 'AC' || upper === 'AIR CONDITIONING' || upper.includes('AIR CONDITIONING')) return 'Air Conditioning'
  if (upper === 'PRIVATE BEACH' || upper.includes('BEACH')) return 'Private Beach'
  if (upper === 'BAR' || upper.includes('BAR') || upper.includes('LOUNGE')) return 'Bar & Lounge'
  if (upper === 'ROOM SERVICE' || upper.includes('ROOM SERVICE')) return 'Room Service'
  if (upper === 'FRONT DESK' || upper.includes('CONCIERGE') || upper.includes('24 HOUR')) return '24/7 Front Desk'

  return clean
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export const getFormattedAmenities = (stayOrRoom: any, limit = 3): string[] => {
  if (!stayOrRoom) return []
  const rawList = stayOrRoom.amenities || stayOrRoom.facilities || []
  const result: string[] = []
  for (const item of rawList) {
    const label = formatAmenity(item)
    if (label && !result.includes(label)) {
      result.push(label)
      if (limit && result.length >= limit) break
    }
  }
  return result
}
