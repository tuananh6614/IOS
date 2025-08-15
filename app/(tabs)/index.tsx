import { StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  const isLocked = true;
  const isOnline = true;

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: isOnline ? '#22c55e' : '#ef4444' }]} />
        <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
      </View>

      <FontAwesome name={isLocked ? 'lock' : 'unlock-alt'} size={160} style={styles.lockIcon} />

      <Text style={styles.lockState}>{isLocked ? 'Locked' : 'Unlocked'}</Text>

      <Pressable style={[styles.primaryButton, { backgroundColor: isLocked ? '#111' : '#e11d48' }]}
        onPress={() => { /* TODO: toggle lock */ }}>
        <Text style={styles.primaryButtonText}>{isLocked ? 'Mở khóa' : 'Đóng khóa'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'absolute',
    top: 24,
  },
  dot: { width: 10, height: 10, borderRadius: 999 },
  statusText: { fontSize: 14, opacity: 0.8 },
  lockIcon: { opacity: 0.95 },
  lockState: { fontSize: 18, fontWeight: '600', opacity: 0.9 },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 220,
  },
  primaryButtonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '700' },
});
