import { ref, computed } from "vue";

export const useUser = () => {
    // Persistent user state via cookies (works with SSR)
    const userCookie = useCookie<any>("user_profile", {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: 'lax',
        path: '/'
    });

    const user = useState<any>('global_user_state', () => userCookie.value || null);

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

        // Nuxt's `useCookie` only flushes to `document.cookie` on the next tick,
        // but several flows hard-redirect (`window.location`) or open a new
        // document straight after login. Write the cookies synchronously too, or
        // the freshly signed-in session is lost and the auth middleware bounces
        // the user back to the home page with `requireLogin=1`.
        if (import.meta.client) {
            const maxAge = 7 * 24 * 60 * 60;
            const refreshMaxAge = 30 * 24 * 60 * 60;
            try {
                if (newUser.accessToken) {
                    document.cookie = `accessToken=${encodeURIComponent(newUser.accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
                }
                if (newUser.refreshToken) {
                    document.cookie = `refreshToken=${encodeURIComponent(newUser.refreshToken)}; path=/; max-age=${refreshMaxAge}; SameSite=Lax`;
                }
                if (newUser) {
                    document.cookie = `user_profile=${encodeURIComponent(JSON.stringify(newUser))}; path=/; max-age=${maxAge}; SameSite=Lax`;
                }
            } catch {
                // Cookie writes can throw in privacy modes; the in-memory
                // session still works for the current tab.
            }
        }
    };

    const clearAuthCookies = () => {
        if (!import.meta.client) return;
        for (const name of ['accessToken', 'refreshToken', 'user_profile']) {
            document.cookie = `${name}=; path=/; max-age=0`;
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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

        // Remove them from disk immediately as well (see setUser).
        clearAuthCookies();

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