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
    };

    const logOut = () => {
        user.value = null;
        userCookie.value = null;
        
        // Clear tokens just in case (though backend should handle this)
        const accessToken = useCookie('accessToken');
        const refreshToken = useCookie('refreshToken');
        accessToken.value = null;
        refreshToken.value = null;

        if (import.meta.client) {
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