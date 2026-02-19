import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { pb, loginWithGoogle } from '../lib/pocketbase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
            return;
        }
        setLoading(true);
        try {
            if (isRegister) {
                // Đăng ký user mới và tự động login luôn
                await pb.collection('users').create({
                    email, password, passwordConfirm: password,
                });
                await pb.collection('users').authWithPassword(email, password);
            } else {
                await pb.collection('users').authWithPassword(email, password);
            }
        } catch (e: any) {
            Alert.alert('Lỗi', e?.message || 'Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (e: any) {
            if (e.message !== 'Đã huỷ đăng nhập') {
                Alert.alert('Lỗi Google', e?.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.card}>
                <Text style={styles.logo}>📸 LocketCloud</Text>
                <Text style={styles.subtitle}>Lưu giữ khoảnh khắc real-time</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {isRegister ? 'Đăng ký ngay' : 'Đăng nhập'}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Google Login Button */}
                <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin} disabled={loading}>
                    <Text style={styles.googleBtnText}>G</Text>
                    <Text style={styles.googleBtnLabel}>Tiếp tục với Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsRegister(!isRegister)} style={styles.switchRow}>
                    <Text style={styles.switchText}>
                        {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
                        <Text style={styles.switchLink}>{isRegister ? 'Đăng nhập' : 'Đăng ký'}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#0a0a0a',
        justifyContent: 'center', alignItems: 'center', padding: 20,
    },
    card: {
        width: '100%', maxWidth: 400,
        backgroundColor: '#1a1a1a', borderRadius: 24, padding: 32,
        alignItems: 'center', borderWidth: 1, borderColor: '#333',
    },
    logo: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 8, letterSpacing: -1 },
    subtitle: { color: '#888', fontSize: 14, marginBottom: 32 },
    input: {
        width: '100%', backgroundColor: '#2a2a2a', borderRadius: 12,
        padding: 16, color: '#fff', fontSize: 16, marginBottom: 12,
        borderWidth: 1, borderColor: '#333',
    },
    button: {
        width: '100%', backgroundColor: '#ff6b9d', borderRadius: 12,
        padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 12,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    googleBtn: {
        width: '100%', backgroundColor: '#fff', borderRadius: 12,
        padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 12, marginBottom: 20,
    },
    googleBtnText: {
        fontSize: 22, fontWeight: '900', color: '#0a0a0a',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
    },
    googleBtnLabel: { color: '#0a0a0a', fontSize: 16, fontWeight: '600' },
    switchRow: { marginTop: 8 },
    switchText: { color: '#888', fontSize: 14 },
    switchLink: { color: '#ff6b9d', fontWeight: '600' },
});
