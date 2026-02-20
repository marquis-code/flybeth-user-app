import { ref } from "vue";

const isBrowser = typeof window !== "undefined";

export const useUser = () => {
    const token = ref(isBrowser ? localStorage.getItem("token") || "" : "");
    const refreshToken = ref(isBrowser ? localStorage.getItem("refreshToken") || "" : "");
    const user = ref(isBrowser ? JSON.parse(localStorage.getItem("user") || "null") : null);

    const setToken = (newToken: string) => {
        token.value = newToken;
        if (isBrowser) localStorage.setItem("token", newToken);
    };

    const setRefreshToken = (newRefreshToken: string) => {
        refreshToken.value = newRefreshToken;
        if (isBrowser) localStorage.setItem("refreshToken", newRefreshToken);
    };

    const setUser = (newUser: any) => {
        user.value = newUser;
        if (isBrowser) localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logOut = () => {
        token.value = "";
        refreshToken.value = "";
        user.value = null;
        if (isBrowser) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/auth/login";
        }
    };

    return {
        token,
        refreshToken,
        user,
        setToken,
        setRefreshToken,
        setUser,
        logOut,
    };
};