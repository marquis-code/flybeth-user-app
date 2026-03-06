import { ref, watch } from 'vue'

export interface Currency {
    code: string
    symbol: string
    name: string
    flag: string
}

export const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/us.svg' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: 'https://flagcdn.com/eu.svg' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'https://flagcdn.com/gb.svg' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: 'https://flagcdn.com/ng.svg' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: 'https://flagcdn.com/ca.svg' },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: 'https://flagcdn.com/ae.svg' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'https://flagcdn.com/in.svg' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: 'https://flagcdn.com/au.svg' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: 'https://flagcdn.com/cn.svg' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: 'https://flagcdn.com/jp.svg' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: 'https://flagcdn.com/tr.svg' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: 'https://flagcdn.com/kr.svg' },
    { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal', flag: 'https://flagcdn.com/sa.svg' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: 'https://flagcdn.com/br.svg' },
]

export const localeToCurrency: Record<string, string> = {
    'en': 'USD',
    'es': 'EUR',
    'fr': 'EUR',
    'de': 'EUR',
    'it': 'EUR',
    'ar': 'SAR',
    'zh': 'CNY',
    'ja': 'JPY',
    'pt': 'BRL',
    'ko': 'KRW',
    'tr': 'TRY',
    'hi': 'INR'
}

const currentCurrency = ref<Currency>(currencies[0]!)

export function useSettings() {
    const setCurrency = (code: string) => {
        const found = currencies.find(c => c.code === code)
        if (found) {
            currentCurrency.value = found
            if (typeof window !== 'undefined') {
                localStorage.setItem('flybeth_currency', code)
            }
        }
    }

    const formatPrice = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount
        return `${currentCurrency.value.symbol}${num.toLocaleString()}`
    }

    // Initialize from localStorage
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('flybeth_currency')
        if (saved) {
            const found = currencies.find(c => c.code === saved)
            if (found) currentCurrency.value = found
        }
    }

    return {
        currentCurrency,
        currencies,
        setCurrency,
        formatPrice
    }
}
