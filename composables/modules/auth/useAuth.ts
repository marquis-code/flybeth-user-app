import { ref } from "vue";
import { authApiFactory } from "@/api_factory/modules/auth";
import { useUser } from "./user";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { auth, googleProvider, signInWithPopup } from "@/utils/firebase";

const isAuthModalVisible = ref(false);

export const useAuth = () => {
    const loading = ref(false);
    const { user, setUser, logOut, isLoggedIn } = useUser();
    const { showToast } = useCustomToast();

    const openAuthModal = () => {
        isAuthModalVisible.value = true;
    };

    const closeAuthModal = () => {
        isAuthModalVisible.value = false;
    };

    const login = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.login(payload);
            const authData = res.data?.data || res.data;
            
            if (authData.requiresOtp) {
                showToast({
                    title: "Verification Required",
                    message: "Please enter the OTP sent to your email.",
                    toastType: "info",
                });
                return { requiresOtp: true, email: authData.email || payload.email };
            }

            if (res.status === 200 || res.status === 201) {
                if (authData.user) {
                    setUser({ ...authData.user, accessToken: authData.accessToken, refreshToken: authData.refreshToken });
                }
                closeAuthModal();
                showToast({
                    title: "Success",
                    message: "Login successful",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
            showToast({
                title: "Error",
                message: error?.response?.data?.message || "Login failed",
                toastType: "error",
            });
        } finally {
            loading.value = false;
        }
    };

    const register = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.register(payload);
            const authData = res.data?.data || res.data;

            if (authData.requiresOtp) {
                showToast({
                    title: "Account Created",
                    message: "Registration successful. Please verify your email with the OTP sent.",
                    toastType: "success",
                });
                return { requiresOtp: true, email: authData.email || payload.email };
            }

            if (res.status === 200 || res.status === 201) {
                if (authData.user) {
                    setUser({ ...authData.user, accessToken: authData.accessToken, refreshToken: authData.refreshToken });
                }
                closeAuthModal();
                showToast({
                    title: "Success",
                    message: "Registration successful. You are now logged in.",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
            showToast({
                title: "Error",
                message: error?.response?.data?.message || "Registration failed",
                toastType: "error",
            });
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

    const resendOtp = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.resendOtp(payload);
            if (res.status === 200 || res.status === 201) {
                showToast({
                    title: "Success",
                    message: "New OTP sent to your email",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
            showToast({
                title: "Error",
                message: error?.response?.data?.message || "Failed to resend OTP",
                toastType: "error",
            });
        } finally {
            loading.value = false;
        }
    };

    const verifyOtp = async (payload: any) => {
        loading.value = true;
        try {
            const res = await authApiFactory.verifyOtp(payload);
            if (res.status === 200 || res.status === 201) {
                const authData = res.data?.data || res.data;
                if (authData.user) {
                    setUser({ ...authData.user, accessToken: authData.accessToken, refreshToken: authData.refreshToken });
                }
                closeAuthModal();

                showToast({
                    title: "Success",
                    message: "Email verified successfully",
                    toastType: "success",
                });
                return res;
            }
        } catch (error: any) {
            console.error(error);
            showToast({
                title: "Error",
                message: error?.response?.data?.message || "Verification failed",
                toastType: "error",
            });
        } finally {
            loading.value = false;
        }
    };

    const logoutUser = async () => {
        loading.value = true;
        try {
            await authApiFactory.logout();
            logOut();
        } catch (error: any) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    const loginWithGoogle = async () => {
        loading.value = true;
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            
            const res = await authApiFactory.socialLogin({ token: idToken });
            const authData = res.data?.data || res.data;

            if (res.status === 200 || res.status === 201) {
                if (authData.user) {
                    setUser({ ...authData.user, accessToken: authData.accessToken, refreshToken: authData.refreshToken });
                }
                closeAuthModal();
                showToast({
                    title: "Success",
                    message: "Login successful",
                    toastType: "success",
                });
                
                // Redirect if in auth page
                if (window.location.pathname.startsWith('/auth')) {
                    window.location.href = '/';
                }
                
                return res;
            }
        } catch (error: any) {
            console.error("Firebase Auth Error:", error);
            showToast({
                title: "Authentication Failed",
                message: error?.response?.data?.message || error.message || "Social login failed",
                toastType: "error",
            });
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        verifyOtp,
        resendOtp,
        logout: logoutUser,
        loginWithGoogle,
        isAuthModalVisible,
        openAuthModal,
        closeAuthModal,
        user,
        isLoggedIn
    };
};
