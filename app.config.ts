import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
    name: 'LocketCloud',
    slug: 'locket-cloud',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0a0a0a',
    },
    ios: {
        supportsTablet: false,
        bundleIdentifier: 'vn.hnaut.locketcloud',
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#0a0a0a',
        },
        package: 'vn.hnaut.locketcloud',
    },
    plugins: [
        'expo-image-picker',
        'expo-web-browser',
    ],
    scheme: 'locketcloud',

    // ─── OTA Updates ───────────────────────────
    runtimeVersion: {
        policy: 'appVersion',
    },
    updates: {
        url: 'https://u.expo.dev/48c57578-4f74-4c19-839a-bc6ff5b51abd',
        fallbackToCacheTimeout: 3000,
    },

    // ─── EAS Project ───────────────────────────
    extra: {
        eas: {
            projectId: '48c57578-4f74-4c19-839a-bc6ff5b51abd',
        },
    },
};

export default config;
