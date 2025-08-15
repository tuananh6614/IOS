import { useCallback, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Link, router } from 'expo-router';

import { Text, View } from '@/components/Themed';

export default function LoginScreen() {
	const [authenticating, setAuthenticating] = useState(false);

	const handleBiometricLogin = useCallback(async () => {
		try {
			setAuthenticating(true);
			const hasHardware = await LocalAuthentication.hasHardwareAsync();
			const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
			const enrolled = await LocalAuthentication.isEnrolledAsync();

			if (!hasHardware || !enrolled || supported.length === 0) {
				// Fallback: tiếp tục vào app nếu không có sinh trắc học (demo)
				router.replace('/(tabs)');
				return;
			}

			const result = await LocalAuthentication.authenticateAsync({
				promptMessage: Platform.OS === 'ios' ? 'Đăng nhập bằng Face ID / Touch ID' : 'Đăng nhập sinh trắc học',
				disableDeviceFallback: false,
			});

			if (result.success) {
				router.replace('/(tabs)');
			} else {
				// Có thể hiển thị thông báo lỗi nhẹ nhàng
			}
		} finally {
			setAuthenticating(false);
		}
	}, []);

	return (
		<View style={styles.container}>
			<Image source={require('../assets/images/icon.png')} style={styles.logo} />
			<Text style={styles.title}>Smart Lock</Text>
			<Text style={styles.subtitle}>Bảo mật thông minh, trải nghiệm sang trọng</Text>

			<View style={styles.cta}>
				<Text onPress={handleBiometricLogin} style={styles.primaryButton}>
					{authenticating ? 'Đang xác thực…' : 'Đăng nhập bằng Face ID / Touch ID'}
				</Text>
				<Link href="/(tabs)" asChild>
					<Text style={styles.secondaryButton}>Bỏ qua</Text>
				</Link>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	logo: {
		width: 96,
		height: 96,
		marginBottom: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		opacity: 0.7,
		marginBottom: 32,
		textAlign: 'center',
	},
	cta: {
		width: '100%',
		gap: 12,
	},
	primaryButton: {
		textAlign: 'center',
		paddingVertical: 14,
		borderRadius: 12,
		backgroundColor: '#111',
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryButton: {
		textAlign: 'center',
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		fontSize: 16,
		fontWeight: '500',
	},
});


