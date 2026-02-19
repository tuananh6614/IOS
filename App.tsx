import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { pb, isLoggedIn } from './lib/pocketbase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setChecking(false);

    // Lắng nghe thay đổi auth state (ví dụ khi token hết hạn)
    const unsubscribe = pb.authStore.onChange((token) => {
      setLoggedIn(!!token);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color="#ff6b9d" size="large" />
      </View>
    );
  }

  return loggedIn ? <HomeScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1, backgroundColor: '#0a0a0a',
    justifyContent: 'center', alignItems: 'center',
  },
});
