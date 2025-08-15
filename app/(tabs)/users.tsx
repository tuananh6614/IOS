import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';

type UserItem = {
	id: string;
	name: string;
	avatar?: string;
	fingerprintId?: string;
};

export default function UsersScreen() {
	const [query, setQuery] = useState('');
	const [users, setUsers] = useState<UserItem[]>([
		{ id: '1', name: 'Nguyễn Văn A', avatar: undefined, fingerprintId: 'fp_01' },
		{ id: '2', name: 'Trần Thị B', avatar: undefined, fingerprintId: 'fp_02' },
	]);

	const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Tìm người dùng"
				placeholderTextColor={'#999'}
				style={styles.search}
				value={query}
				onChangeText={setQuery}
			/>
			<FlatList
				data={filtered}
				keyExtractor={(i) => i.id}
				renderItem={({ item }) => (
					<View style={styles.row}>
						{item.avatar ? (
							<Image source={{ uri: item.avatar }} style={styles.avatar} />
						) : (
							<View style={[styles.avatar, styles.avatarFallback]}>
								<Text style={{ color: '#fff' }}>{item.name.charAt(0).toUpperCase()}</Text>
							</View>
						)}
						<View style={{ flex: 1 }}>
							<Text style={styles.name}>{item.name}</Text>
							<Text style={styles.meta}>Vân tay: {item.fingerprintId ?? '—'}</Text>
						</View>
						<View style={styles.actions}>
							<Pressable style={[styles.actionBtn, styles.add]} onPress={() => { /* add */ }}>
								<Text style={styles.actionText}>Thêm</Text>
							</Pressable>
							<Pressable style={[styles.actionBtn, styles.remove]} onPress={() => { /* remove */ }}>
								<Text style={styles.actionText}>Xóa</Text>
							</Pressable>
						</View>
					</View>
				)}
				ItemSeparatorComponent={() => <View style={styles.sep} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 12 },
	search: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
	},
	row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
	avatar: { width: 44, height: 44, borderRadius: 999, marginRight: 12 },
	avatarFallback: { backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
	name: { fontSize: 16, fontWeight: '600' },
	meta: { fontSize: 12, opacity: 0.6, marginTop: 2 },
	actions: { flexDirection: 'row', gap: 8 },
	actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
	add: { backgroundColor: '#111' },
	remove: { backgroundColor: '#e11d48' },
	actionText: { color: '#fff', fontWeight: '600' },
	sep: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 4 },
});


