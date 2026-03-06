import { useUser } from '~/composables/modules/auth/user';

export default defineNuxtRouteMiddleware((to) => {
    const { token } = useUser();
    if (!token.value) {
        return navigateTo({
            path: '/',
            query: { redirect: to.fullPath, requireLogin: '1' }
        });
    }
});
