import { ref } from "vue";
import { authApiFactory } from "@/api_factory/modules/auth";
import { useUser } from "./user";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useAuth = () => {
    const loading = ref(false);
    const { setToken, setUser, setRefreshToken, logOut: clearUser } = useUser();
    const { showToast } = useCustomToast();

    const login = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.login(payload);
            if (res.status === 200 || res.status === 201) {
                // The data is nested inside a 'data' property
                const authData = res.data.data;
                setToken(authData.accessToken);
                setRefreshToken(authData.refreshToken);
                setUser(authData.user);
                showToast({
                    title: "Success",
                    message: "Login successful",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    const register = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.register(payload);
            if (res.status === 200 || res.status === 201) {
                showToast({
                    title: "Success",
                    message: "Registration successful. Please verify your email.",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    const forgotPassword = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.forgotPassword(payload);
            if (res.status === 200 || res.status === 201) {
                showToast({
                    title: "Success",
                    message: "Password reset link sent to your email",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    const resetPassword = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.resetPassword(payload);
            if (res.status === 200 || res.status === 201) {
                showToast({
                    title: "Success",
                    message: "Password reset successful",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    const verifyOtp = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.verifyOtp(payload);
            if (res.status === 200 || res.status === 201) {
                showToast({
                    title: "Success",
                    message: "Email verified successfully",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        loading.value = true;
        try {
            await authApiFactory.logout();
            clearUser();
        } catch (error: any) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    const loginWithGoogle = () => {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const frontendCallbackUrl = `${window.location.origin}/auth/callback`;
        const googleAuthUrl = `${authApiFactory.googleLoginUrl()}?redirect_uri=${encodeURIComponent(frontendCallbackUrl)}`;

        // AGGRESSIVE FIX: If the user is on a mobile device or if they prefer, 
        // we can use a direct redirect instead of a popup.
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = googleAuthUrl;
            return;
        }

        const popup = window.open(
            googleAuthUrl,
            'google-login',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        const handleMessage = (event: MessageEvent) => {
            // SECURITY: Always verify the origin matches your backend URL
            const expectedOrigin = import.meta.env.VITE_BASE_URL;
            if (event.origin !== expectedOrigin) return;

            if (event.data.type === 'AUTH_SUCCESS') {
                // The data is nested inside a 'data' property in the backend response
                // Based on the user's provided JSON structure
                const authData = event.data.data;
                const { accessToken, refreshToken, user } = authData;

                // Store tokens and update state
                setToken(accessToken);
                setRefreshToken(refreshToken);
                setUser(user);

                showToast({
                    title: "Success",
                    message: "Login successful",
                    toastType: "success",
                });

                if (popup) popup.close();
                window.removeEventListener('message', handleMessage);

                // Redirect to home
                window.location.href = '/';
            }
        };

        window.addEventListener('message', handleMessage);

        // Fallback: If the popup is closed manually or navigating away, clean up
        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
                window.removeEventListener('message', handleMessage);
            }
        }, 1000);
    };

    return {
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        verifyOtp,
        logout,
        loginWithGoogle,
    };
};
