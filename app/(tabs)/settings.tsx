import { StyleSheet, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

export default function SettingsScreen() {
	const [notify, setNotify] = useState(true);
	const [autoLock, setAutoLock] = useState(true);

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Text style={styles.label}>Thông báo mở khóa</Text>
				<Switch value={notify} onValueChange={setNotify} />
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Tự động khóa sau 30s</Text>
				<Switch value={autoLock} onValueChange={setAutoLock} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 12 },
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.06)'
	},
	label: { fontSize: 16 },
});


