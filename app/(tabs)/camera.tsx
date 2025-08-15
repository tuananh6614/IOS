import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Text, View } from '@/components/Themed';

export default function CameraScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);
	const [recording, setRecording] = useState(false);

	useEffect(() => {
		if (!permission || !permission.granted) {
			requestPermission();
		}
	}, [permission]);

	if (!permission?.granted) {
		return (
			<View style={styles.center}> 
				<Text>Yêu cầu quyền camera…</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<RNView style={styles.cameraWrap}>
				<CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
			</RNView>
			<RNView style={styles.controls}>
				<Text style={[styles.btn, styles.capture]} onPress={async () => {
					const photo = await cameraRef.current?.takePictureAsync();
					// TODO: lưu hoặc hiển thị preview
				}}>Chụp ảnh</Text>
				<Text style={[styles.btn, recording ? styles.stop : styles.record]} onPress={async () => {
					if (!recording) {
						setRecording(true);
						await cameraRef.current?.recordAsync();
					} else {
						setRecording(false);
						cameraRef.current?.stopRecording();
					}
				}}>{recording ? 'Dừng' : 'Quay video'}</Text>
			</RNView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	cameraWrap: { flex: 1, borderRadius: 16, overflow: 'hidden', margin: 12 },
	controls: { flexDirection: 'row', justifyContent: 'center', gap: 12, padding: 16 },
	btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, color: '#fff', overflow: 'hidden' },
	capture: { backgroundColor: '#111' },
	record: { backgroundColor: '#dc2626' },
	stop: { backgroundColor: '#16a34a' },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});


