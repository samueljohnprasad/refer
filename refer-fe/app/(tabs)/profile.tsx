import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ProfileView from '../../components/profile/ProfileView';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user || !token) {
      // Navigate to a login screen or show login modal
      // This would depend on your app's auth flow
      // For now we'll just show the unauthorized state in the component
    }
  }, [user, token]);

  if (!user || !token) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Redirecting to login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
