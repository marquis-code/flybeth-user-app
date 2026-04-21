import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const financeApi = {
    getWalletBalance() {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/finance/wallet/balance");
    },
    getTransactions(limit: number = 10) {
        return GATEWAY_ENDPOINT_WITH_AUTH.get("/finance/wallet/transactions", {
            params: { limit }
        });
    }
};
