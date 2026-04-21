import { ref, watch, onMounted } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export interface Currency {
    code: string
    symbol: string
    name: string
    flag: string
}

const currencies = ref<Currency[]>([])
const currentCurrency = ref<Currency>({ code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/us.svg' })
const isLoading = ref(false)

export const localeToCurrency: Record<string, string> = {
    'en': 'USD',
    'es': 'EUR',
    'fr': 'EUR',
    'de': 'EUR',
    'ar': 'SAR',
    'zh': 'CNY',
    'ja': 'JPY',
    'pt': 'BRL',
    'it': 'EUR',
    'ko': 'KRW',
    'tr': 'TRY',
    'hi': 'INR'
}

export function useSettings() {
    const fetchSupportedCurrencies = async () => {
        if (currencies.value.length > 0) return
        isLoading.value = true
        try {
            const res = await GATEWAY_ENDPOINT.get('/currency/supported')
            currencies.value = res.data.map((c: any) => ({
                code: c.code,
                name: c.name,
                symbol: c.symbol,
                flag: `https://flagcdn.com/${c.code.slice(0, 2).toLowerCase()}.svg`
            }))
            
            const saved = typeof window !== 'undefined' ? localStorage.getItem('flybeth_currency') : null
            const found = currencies.value.find(c => c.code === (saved || currentCurrency.value.code))
            if (found) currentCurrency.value = found
        } catch (error) {
            console.error('Failed to load internal currencies', error)
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
        return `${currentCurrency.value.symbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    if (typeof window !== 'undefined' && currencies.value.length === 0) {
        fetchSupportedCurrencies()
    }

    return {
        currentCurrency,
        currencies,
        isLoading,
        setCurrency,
        formatPrice,
        fetchSupportedCurrencies
    }
}
