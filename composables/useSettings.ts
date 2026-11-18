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

export interface AncillaryPricingTypes {
    bags: 'percentage' | 'fixed'
    seats: 'percentage' | 'fixed'
    insurance: 'percentage' | 'fixed'
    vipSupport: 'percentage' | 'fixed'
}

export const defaultCurrencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, flag: 'https://flagcdn.com/us.svg' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1550, flag: 'https://flagcdn.com/ng.svg' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.78, flag: 'https://flagcdn.com/gb.svg' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.91, flag: 'https://flagcdn.com/eu.svg' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.36, flag: 'https://flagcdn.com/ca.svg' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.51, flag: 'https://flagcdn.com/au.svg' },
    { code: 'AED', name: 'Emirati Dirham', symbol: 'AED', rate: 3.67, flag: 'https://flagcdn.com/ae.svg' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rate: 14.50, flag: 'https://flagcdn.com/gh.svg' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 130, flag: 'https://flagcdn.com/ke.svg' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.50, flag: 'https://flagcdn.com/za.svg' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 155, flag: 'https://flagcdn.com/jp.svg' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24, flag: 'https://flagcdn.com/cn.svg' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.50, flag: 'https://flagcdn.com/in.svg' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.60, flag: 'https://flagcdn.com/br.svg' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.88, flag: 'https://flagcdn.com/ch.svg' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34, flag: 'https://flagcdn.com/sg.svg' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', rate: 3.75, flag: 'https://flagcdn.com/sa.svg' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', rate: 3.64, flag: 'https://flagcdn.com/qa.svg' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 34.20, flag: 'https://flagcdn.com/tr.svg' }
]

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

const getInitialCurrency = (): Currency => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('flybeth_currency')
            if (saved) {
                const match = defaultCurrencies.find(c => c.code.toUpperCase() === saved.toUpperCase())
                if (match) return { ...match }
                return {
                    code: saved.toUpperCase(),
                    name: saved.toUpperCase(),
                    symbol: saved.toUpperCase(),
                    rate: 1,
                    flag: `https://flagcdn.com/${(flagMap[saved.toUpperCase()] || saved.slice(0, 2)).toLowerCase()}.svg`
                }
            }
            // Fast timezone heuristic before network calls
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
            if (tz.includes('Lagos') || tz.includes('Africa/Lagos') || tz.includes('Africa/')) {
                const ngn = defaultCurrencies.find(c => c.code === 'NGN')
                if (ngn) return { ...ngn }
            } else if (tz.includes('London')) {
                const gbp = defaultCurrencies.find(c => c.code === 'GBP')
                if (gbp) return { ...gbp }
            } else if (tz.includes('Europe/')) {
                const eur = defaultCurrencies.find(c => c.code === 'EUR')
                if (eur) return { ...eur }
            }
        } catch {}
    }
    return defaultCurrencies[0]
}

const currencies = ref<Currency[]>([...defaultCurrencies])
const currentCurrency = ref<Currency>(getInitialCurrency())
const ancillaryPrices = ref<AncillaryPrices>({ bags: 25, seats: 15, insurance: 12, vipSupport: 15 })
const ancillaryPricingTypes = ref<AncillaryPricingTypes>({
    bags: 'fixed',
    seats: 'fixed',
    insurance: 'fixed',
    vipSupport: 'fixed'
})
const isLoading = ref(false)

// Module-scoped single-flight cache for the settings/currency bootstrap.
// Shared by every `useSettings()` instance (see `fetchSettings`).
const SETTINGS_TTL = 5 * 60 * 1000
let settingsPromise: Promise<void> | null = null
let settingsLoadedAt = 0

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
                for (const c of configData.exchangeRates) {
                    const code = (c.currency || '').toUpperCase()
                    if (!code) continue
                    const countryCode = flagMap[code] || code.slice(0, 2).toLowerCase()
                    const existingIdx = currencies.value.findIndex(item => item.code.toUpperCase() === code)
                    const updatedItem: Currency = {
                        code,
                        name: c.name || (existingIdx >= 0 ? currencies.value[existingIdx].name : code),
                        symbol: c.symbol || (existingIdx >= 0 ? currencies.value[existingIdx].symbol : code),
                        rate: c.rate ?? 1,
                        flag: `https://flagcdn.com/${countryCode}.svg`
                    }
                    if (existingIdx >= 0) {
                        currencies.value[existingIdx] = updatedItem
                    } else {
                        currencies.value.push(updatedItem)
                    }
                }
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

            // Sync active currency with latest rate
            const activeCode = currentCurrency.value.code.toUpperCase()
            const updatedActive = currencies.value.find(c => c.code.toUpperCase() === activeCode)
            if (updatedActive) {
                currentCurrency.value = updatedActive
            }

            // Ancillary prices & pricing types
            if (configData?.ancillaryPrices) {
                ancillaryPrices.value = {
                    bags: configData.ancillaryPrices.bags ?? 25,
                    seats: configData.ancillaryPrices.seats ?? 15,
                    insurance: configData.ancillaryPrices.insurance ?? 12,
                    vipSupport: configData.ancillaryPrices.vipSupport ?? 15
                }
            }

            if (configData?.ancillaryPricingTypes) {
                ancillaryPricingTypes.value = {
                    bags: configData.ancillaryPricingTypes.bags || 'fixed',
                    seats: configData.ancillaryPricingTypes.seats || 'fixed',
                    insurance: configData.ancillaryPricingTypes.insurance || 'fixed',
                    vipSupport: configData.ancillaryPricingTypes.vipSupport || 'fixed'
                }
            }
        } catch (error) {
            console.error('[useSettings] Failed to load platform settings:', error)
        } finally {
            isLoading.value = false
        }
    }

    const setCurrency = (code: string) => {
        if (!code) return
        const normalized = code.trim().toUpperCase()
        let found = currencies.value.find(c => c.code.toUpperCase() === normalized)
        if (!found) {
            const defaultMatch = defaultCurrencies.find(c => c.code.toUpperCase() === normalized)
            if (defaultMatch) {
                found = { ...defaultMatch }
                currencies.value.push(found)
            } else {
                const countryCode = flagMap[normalized] || normalized.slice(0, 2).toLowerCase()
                found = {
                    code: normalized,
                    name: normalized,
                    symbol: normalized,
                    rate: 1,
                    flag: `https://flagcdn.com/${countryCode}.svg`
                }
                currencies.value.push(found)
            }
        }
        currentCurrency.value = found
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('flybeth_currency', normalized)
            } catch {}
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
        ancillaryPricingTypes,
        isLoading,
        setCurrency,
        formatPrice,
        fetchSettings
    }
}
