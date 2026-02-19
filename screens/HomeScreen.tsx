import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator, RefreshControl,
    Dimensions, SafeAreaView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { pb, logout } from '../lib/pocketbase';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 32) / 2 - 6; // Tính toán lại gap cho chuẩn

export default function HomeScreen() {
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // 1. Fetch ảnh từ server
    const fetchPhotos = useCallback(async () => {
        try {
            const records = await pb.collection('photos').getList(1, 40, {
                sort: '-created',
                expand: 'user', // Lấy thông tin người upload nếu cần
            });
            setPhotos(records.items);
        } catch (error: any) {
            console.log('Error fetching photos:', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // 2. Realtime & Auto-fetch
    useEffect(() => {
        fetchPhotos();

        // Subscribe nhận ảnh mới tức thì
        pb.collection('photos').subscribe('*', function (e) {
            console.log('Realtime event:', e.action);
            if (e.action === 'create') {
                setPhotos((prev) => [e.record, ...prev]);
            } else if (e.action === 'delete') {
                setPhotos((prev) => prev.filter((p) => p.id !== e.record.id));
            }
        });

        return () => {
            pb.collection('photos').unsubscribe('*'); // Cleanup
        };
    }, []);

    // 3. Upload ảnh
    const handleUpload = async (uri: string) => {
        setUploading(true);
        try {
            // Chuẩn bị form data
            const formData = new FormData();

            // Lấy tên file từ uri hoặc tạo ngẫu nhiên
            const fileName = uri.split('/').pop() || `photo_${Date.now()}.jpg`;

            // Append file đúng chuẩn React Native
            formData.append('image', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: fileName,
                type: 'image/jpeg', // Giả định là JPEG, thực tế nên check đuôi file
            } as any);

            formData.append('user', pb.authStore.model?.id);

            // Gửi lên server
            await pb.collection('photos').create(formData);

            // Không cần fetch lại vì đã có realtime lo vụ update UI
        } catch (error: any) {
            Alert.alert('Lỗi upload', error.message || 'Không thể tải ảnh lên');
        } finally {
            setUploading(false);
        }
    };

    const pickImage = async (useCamera: boolean) => {
        try {
            let result;
            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Cần quyền camera', 'Vui lòng cấp quyền camera trong cài đặt');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    quality: 0.6,
                    allowsEditing: true,
                    aspect: [3, 4], // Ảnh dọc
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Cần quyền thư viện', 'Vui lòng cấp quyền thư viện ảnh');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.6,
                    allowsEditing: true,
                    aspect: [3, 4], // Ảnh dọc
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                handleUpload(result.assets[0].uri);
            }
        } catch (e) {
            console.log('Picker error:', e);
        }
    };

    // Helper lấy URL ảnh từ PocketBase
    const getImageUrl = (record: any) => {
        // Dùng URL Cloudflare
        return `${'https://cloud.hnaut.id.vn'}/api/files/${record.collectionId}/${record.id}/${record.image}`;
    };

    const renderPhoto = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.photoCard} activeOpacity={0.9}>
            <Image
                source={{ uri: getImageUrl(item) }}
                style={styles.photoImage}
                resizeMode="cover"
            />
            <View style={styles.photoOverlay}>
                <Text style={styles.photoDate}>
                    {new Date(item.created).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>☁️ LocketCloud</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Thoát</Text>
                </TouchableOpacity>
            </View>

            {/* Upload Bar */}
            <View style={styles.uploadRow}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => pickImage(true)}
                    disabled={uploading}
                >
                    <Text style={styles.btnIcon}>📷</Text>
                    <Text style={styles.btnText}>Chụp luôn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.galleryBtn]}
                    onPress={() => pickImage(false)}
                    disabled={uploading}
                >
                    <Text style={styles.btnIcon}>🖼️</Text>
                    <Text style={styles.btnText}>Thư viện</Text>
                </TouchableOpacity>
            </View>

            {/* Upload Progress */}
            {uploading && (
                <View style={styles.progress}>
                    <ActivityIndicator color="#ff6b9d" size="small" />
                    <Text style={styles.progressText}>Đang tải lên server...</Text>
                </View>
            )}

            {/* Main List */}
            {loading ? (
                <ActivityIndicator size="large" color="#ff6b9d" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={photos}
                    renderItem={renderPhoto}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.row}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); fetchPhotos(); }}
                            tintColor="#ff6b9d"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyIcon}>✨</Text>
                            <Text style={styles.emptyText}>Chưa có ảnh nào</Text>
                            <Text style={styles.emptySub}>Hãy là người đầu tiên đăng ảnh!</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: '#333'
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
    logoutBtn: { padding: 8 },
    logoutText: { color: '#ff4444', fontWeight: '600' },

    uploadRow: { flexDirection: 'row', padding: 12, gap: 12 },
    actionBtn: {
        flex: 1, backgroundColor: '#ff6b9d', borderRadius: 16,
        padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8
    },
    galleryBtn: { backgroundColor: '#222' },
    btnIcon: { fontSize: 18 },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    progress: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        padding: 8, gap: 8, backgroundColor: '#1a1a1a'
    },
    progressText: { color: '#ccc', fontSize: 12 },

    grid: { padding: 12 },
    row: { gap: 12, marginBottom: 12 },
    photoCard: {
        width: CARD_SIZE, height: CARD_SIZE * 1.2, // Tỷ lệ dọc đẹp hơn
        backgroundColor: '#1a1a1a', borderRadius: 16, overflow: 'hidden',
        position: 'relative'
    },
    photoImage: { width: '100%', height: '100%' },
    photoOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 8, backgroundColor: 'rgba(0,0,0,0.4)'
    },
    photoDate: { color: '#fff', fontSize: 10, textAlign: 'center', fontWeight: '600' },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    emptySub: { color: '#888', marginTop: 8 }
});
