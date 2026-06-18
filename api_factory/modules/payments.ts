import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const paymentsApi = {
    initialize(data: { bookingId: string; amount?: number; currency?: string; provider?: string; callbackUrl?: string }) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/payments/initialize", data);
    },
    getById(id: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get(`/payments/${id}`);
    },
    getByBooking(bookingId: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get(`/payments/booking/${bookingId}`);
    },
    authorizeBnpl(data: { bookingId: string; provider: string; checkoutToken: string; amount?: number; currency?: string }) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/payments/bnpl/authorize", data);
    },
    verifyPayment(data: { bookingId: string; provider: string; checkoutToken: string; amount?: number; currency?: string }) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/payments/verify", data);
    },

    /**
     * Get active bank accounts for manual payment
     */
    getBankAccounts(currency?: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get('/payments/bank-accounts', {
            params: { currency }
        });
    },

    /**
     * Convert amount between currencies using backend
     */
    convertCurrency(amount: number, from: string, to: string) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get('/currency/convert', {
            params: { amount, from, to }
        });
    },

    /**
     * Initialize a wallet top-up session
     */
    initializeTopUp(data: { amount: number; currency: string; callbackUrl: string }) {
        return GATEWAY_ENDPOINT_WITH_AUTH.post("/payments/wallet/topup", data);
    }
};
