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
}

const currencies = ref<Currency[]>([])
const currentCurrency = ref<Currency>({ 
    code: 'USD', 
    symbol: '$', 
    name: 'US Dollar', 
    flag: 'https://flagcdn.com/us.svg',
    rate: 1
})
const ancillaryPrices = ref<AncillaryPrices>({ bags: 25, seats: 15, insurance: 12 })
const isLoading = ref(false)

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
    const fetchSettings = async () => {
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

            // Restore saved currency preference
            const saved = typeof window !== 'undefined' ? localStorage.getItem('flybeth_currency') : null
            const found = currencies.value.find(c => c.code === (saved || 'USD'))
            if (found) currentCurrency.value = found

            // Ancillary prices
            if (configData?.ancillaryPrices) {
                ancillaryPrices.value = {
                    bags: configData.ancillaryPrices.bags ?? 25,
                    seats: configData.ancillaryPrices.seats ?? 15,
                    insurance: configData.ancillaryPrices.insurance ?? 12
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
        
        return `${currentCurrency.value.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
