import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

type HistoryItem = {
	id: string;
	time: string;
	user: string;
	method: 'Fingerprint' | 'FaceID' | 'App' | 'Card' | 'Passcode';
};

const MOCK: HistoryItem[] = [
	{ id: '1', time: '2025-08-15 08:21', user: 'Nguyễn Văn A', method: 'Fingerprint' },
	{ id: '2', time: '2025-08-15 12:05', user: 'Trần Thị B', method: 'App' },
];

export default function HistoryScreen() {
	return (
		<View style={styles.container}>
			<FlatList
				data={MOCK}
				keyExtractor={(i) => i.id}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<View style={{ flex: 1 }}>
							<Text style={styles.time}>{item.time}</Text>
							<Text style={styles.user}>{item.user}</Text>
						</View>
						<Text style={styles.method}>{item.method}</Text>
					</View>
				)}
				ItemSeparatorComponent={() => <View style={styles.sep} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
	time: { fontWeight: '600' },
	user: { opacity: 0.7, marginTop: 4 },
	method: { fontWeight: '700' },
	sep: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)' },
});


