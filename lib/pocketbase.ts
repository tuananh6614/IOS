import PocketBase from 'pocketbase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Cloudflare Tunnel
export const pb = new PocketBase('https://cloud.hnaut.id.vn');

// Đăng nhập Google
export const loginWithGoogle = async () => {
    try {
        const redirectUrl = AuthSession.makeRedirectUri();

        // 1. Mở session login Google
        const authData = await pb.collection('users').authWithOAuth2({
            provider: 'google',
            urlCallback: async (url) => {
                // Mở browser native của điện thoại
                const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

                // Nếu user bấm Cancel hoặc lỗi
                if (result.type === 'cancel') {
                    throw new Error('Đã huỷ đăng nhập');
                }
            }
        });

        return authData;
    } catch (error) {
        throw error;
    }
};

export const isLoggedIn = () => pb.authStore.isValid;
export const logout = () => pb.authStore.clear();
