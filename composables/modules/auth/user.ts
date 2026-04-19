import { ref, computed } from "vue";

export const useUser = () => {
    // Persistent user state via cookies (works with SSR)
    const userCookie = useCookie<any>("user_profile", {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: 'lax',
        path: '/'
    });

    const user = ref(userCookie.value || null);

    const setUser = (newUser: any) => {
        user.value = newUser;
        userCookie.value = newUser;
        
        // Save tokens if they are present in the response
        if (newUser.accessToken) {
            const accessToken = useCookie('accessToken');
            accessToken.value = newUser.accessToken;
        }
        if (newUser.refreshToken) {
            const refreshToken = useCookie('refreshToken');
            refreshToken.value = newUser.refreshToken;
        }
    };

    const logOut = (shouldRedirect: boolean = true) => {
        user.value = null;
        userCookie.value = null;
        
        // Clear tokens
        const accessToken = useCookie('accessToken');
        const refreshToken = useCookie('refreshToken');
        accessToken.value = null;
        refreshToken.value = null;

        if (import.meta.client && shouldRedirect) {
            window.location.href = "/auth/login";
        }
    };

    const isLoggedIn = computed(() => !!user.value || !!userCookie.value);

    // Reactive token from cookie for API factory usage
    const accessToken = useCookie('accessToken');
    const token = computed(() => accessToken.value || "");

    return {
        token,
        user,
        setUser,
        logOut,
        isLoggedIn,
    };
};