import { ref } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export interface Currency {
    code: string
    symbol: string
    name: string
    flag: string
    rate: number
}

interface AncillaryPrices {
    bags: number
    seats: number
    insurance: number
    vipSupport: number
}

const currencies = ref<Currency[]>([])
const currentCurrency = ref<Currency>({ 
    code: 'USD', 
    symbol: '$', 
    name: 'US Dollar', 
    flag: 'https://flagcdn.com/us.svg',
    rate: 1
})
const ancillaryPrices = ref<AncillaryPrices>({ bags: 25, seats: 15, insurance: 12, vipSupport: 15 })
const isLoading = ref(false)

// Module-scoped single-flight cache for the settings/currency bootstrap.
// Shared by every `useSettings()` instance (see `fetchSettings`).
const SETTINGS_TTL = 5 * 60 * 1000
let settingsPromise: Promise<void> | null = null
let settingsLoadedAt = 0

// Country code to flag mapping for currencies with non-obvious codes
const flagMap: Record<string, string> = {
    'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'NGN': 'ng', 'CAD': 'ca',
    'AUD': 'au', 'JPY': 'jp', 'CNY': 'cn', 'INR': 'in', 'ZAR': 'za',
    'KES': 'ke', 'GHS': 'gh', 'AED': 'ae', 'BRL': 'br', 'MXN': 'mx',
    'CHF': 'ch', 'SEK': 'se', 'NOK': 'no', 'DKK': 'dk', 'PLN': 'pl',
    'SGD': 'sg', 'HKD': 'hk', 'THB': 'th', 'MYR': 'my', 'PHP': 'ph',
    'KRW': 'kr', 'TWD': 'tw', 'TRY': 'tr', 'EGP': 'eg', 'SAR': 'sa',
    'QAR': 'qa', 'KWD': 'kw', 'BHD': 'bh', 'OMR': 'om', 'JOD': 'jo',
    'COP': 'co', 'ARS': 'ar', 'CLP': 'cl', 'PEN': 'pe', 'RUB': 'ru',
    'UAH': 'ua', 'CZK': 'cz', 'HUF': 'hu', 'RON': 'ro', 'BGN': 'bg',
    'HRK': 'hr', 'ISK': 'is', 'NZD': 'nz', 'FJD': 'fj', 'XOF': 'sn',
    'XAF': 'cm', 'MAD': 'ma', 'TND': 'tn', 'DZD': 'dz', 'LYD': 'ly',
    'TZS': 'tz', 'UGX': 'ug', 'RWF': 'rw', 'ETB': 'et', 'BWP': 'bw',
    'MUR': 'mu', 'SCR': 'sc',
}

// Map locale codes to currency codes for auto-suggestion
export const localeToCurrency: Record<string, string> = {
    'en': 'USD',
    'es': 'EUR',
    'fr': 'EUR',
    'de': 'EUR',
    'it': 'EUR',
    'pt': 'BRL',
    'ja': 'JPY',
    'zh': 'CNY',
    'ko': 'KRW',
    'tr': 'TRY',
    'ar': 'SAR',
    'hi': 'INR',
    'ng': 'NGN',
    'gb': 'GBP',
    'ca': 'CAD',
    'au': 'AUD',
}

export function useSettings() {
    // ── Single-flight settings loader ────────────────────────────────────
    // `useSettings()` is called by many components (nav, footer, cards,
    // checkout …). Without this guard each caller re-fetched
    // /system-config/public and /currency/supported, producing 4–10 duplicate
    // requests per page. Concurrent callers now share one in-flight promise and
    // the result is cached briefly, so navigations reuse it.
    const fetchSettings = async () => {
        if (settingsLoadedAt && Date.now() - settingsLoadedAt < SETTINGS_TTL) return
        if (settingsPromise) return settingsPromise
        settingsPromise = loadSettings().finally(() => {
            settingsPromise = null
            settingsLoadedAt = Date.now()
        })
        return settingsPromise
    }

    const loadSettings = async () => {
        isLoading.value = true
        try {
            // Fetch directly from the public system-config endpoint (admin-controlled data)
            const configRes = await GATEWAY_ENDPOINT.get('/system-config/public')
            const configData = configRes.data?.data || configRes.data

            // Map exchange rates to currencies
            if (configData?.exchangeRates?.length) {
                currencies.value = configData.exchangeRates.map((c: any) => {
                    const code = c.currency || ''
                    const countryCode = flagMap[code] || code.slice(0, 2).toLowerCase()
                    return {
                        code,
                        name: c.name || code,
                        symbol: c.symbol || code,
                        rate: c.rate ?? 1,
                        flag: `https://flagcdn.com/${countryCode}.svg`
                    }
                })
            }

            // Ensure base currency (USD) is always available in the list
            if (!currencies.value.find(c => c.code === 'USD')) {
                currencies.value.unshift({
                    code: 'USD',
                    name: 'US Dollar',
                    symbol: '$',
                    rate: 1,
                    flag: 'https://flagcdn.com/us.svg'
                })
            }

            // Also try to get richer currency names from /currency/supported
            try {
                const curRes = await GATEWAY_ENDPOINT.get('/currency/supported')
                const supported = curRes.data?.data || curRes.data
                if (Array.isArray(supported) && supported.length > 0) {
                    // Merge names into our currency list
                    const nameMap = new Map(supported.map((s: any) => [s.code || s.currency, s.name]))
                    currencies.value.forEach(c => {
                        const name = nameMap.get(c.code)
                        if (name && name !== c.code) c.name = name
                    })
                }
            } catch { /* fall through, we already have rates */ }

            // First try to detect user country currency via IP
            let targetCurrency = null
            if (typeof window !== 'undefined') {
                targetCurrency = localStorage.getItem('flybeth_currency')

                // Aggressively re-detect if no currency is set yet
                if (!targetCurrency) {
                    // The device timezone is instant, offline and dependency
                    // free — try it before any network call.
                    try {
                        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
                        if (tz.includes('Lagos') || tz.includes('Africa/Lagos')) targetCurrency = 'NGN'
                        else if (tz.includes('Africa/')) targetCurrency = 'NGN'
                        else if (tz.includes('London')) targetCurrency = 'GBP'
                        else if (tz.includes('Europe/')) targetCurrency = 'EUR'
                        else if (tz.includes('Dubai')) targetCurrency = 'AED'
                        else if (tz.includes('Nairobi')) targetCurrency = 'KES'
                        else if (tz.includes('Accra')) targetCurrency = 'GHS'
                        else if (tz.includes('Johannesburg')) targetCurrency = 'ZAR'
                    } catch {}

                    // Best-effort IP refinement. Strict browser/privacy settings
                    // routinely block this (CORS), so it must stay silent and
                    // time-boxed rather than logging an error on every page.
                    if (!targetCurrency) {
                        try {
                            const controller = new AbortController()
                            const timer = setTimeout(() => controller.abort(), 3000)
                            const ipRes = await fetch('https://ipapi.co/currency/', {
                                signal: controller.signal,
                            })
                            clearTimeout(timer)
                            if (ipRes.ok) {
                                const code = await ipRes.text()
                                if (code && code.trim().length === 3) {
                                    targetCurrency = code.trim().toUpperCase()
                                }
                            }
                        } catch {
                            // Blocked or offline — USD is a safe default.
                        }
                    }

                    // Remember the outcome so we never re-probe on every page.
                    try {
                        localStorage.setItem('flybeth_currency', targetCurrency || 'USD')
                    } catch {}
                }
            }
            
            const found = currencies.value.find(c => c.code === (targetCurrency || 'USD'))
            if (found) currentCurrency.value = found

            // Ancillary prices
            if (configData?.ancillaryPrices) {
                ancillaryPrices.value = {
                    bags: configData.ancillaryPrices.bags ?? 25,
                    seats: configData.ancillaryPrices.seats ?? 15,
                    insurance: configData.ancillaryPrices.insurance ?? 12,
                    vipSupport: configData.ancillaryPrices.vipSupport ?? 15
                }
            }
        } catch (error) {
            console.error('[useSettings] Failed to load platform settings:', error)
        } finally {
            isLoading.value = false
        }
    }

    const setCurrency = (code: string) => {
        const found = currencies.value.find(c => c.code === code)
        if (found) {
            currentCurrency.value = found
            if (typeof window !== 'undefined') {
                localStorage.setItem('flybeth_currency', code)
            }
        }
    }

    const formatPrice = (amount: number | string) => {
        if (!amount && amount !== 0) return ''
        const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount
        if (isNaN(num)) return amount.toString()
        
        // Convert from USD base using admin-configured rate
        const converted = num * (currentCurrency.value.rate || 1)
        
        try {
            // Robust localized formatting using Intl API
            return new Intl.NumberFormat(undefined, { 
                style: 'currency', 
                currency: currentCurrency.value.code,
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            }).format(converted)
        } catch (e) {
            // Fallback if currency code is invalid
            return `${currentCurrency.value.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
    }

    // Auto-fetch on first use (client-side only)
    if (typeof window !== 'undefined' && currencies.value.length === 0) {
        fetchSettings()
    }

    return {
        currentCurrency,
        currencies,
        ancillaryPrices,
        isLoading,
        setCurrency,
        formatPrice,
        fetchSettings
    }
}
