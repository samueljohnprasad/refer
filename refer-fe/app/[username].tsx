import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import ProfileView from '../components/profile/ProfileView';
import { RootState, AppDispatch } from '../store';
import { fetchProfileByUsername } from '../store/profileThunks';
import { clearPublicProfile } from '../store/profileSlice';

export default function PublicProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { publicProfile, isLoading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (username) {
      dispatch(fetchProfileByUsername(username));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearPublicProfile());
    };
  }, [username, dispatch]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {username ? (
        <ProfileView username={username} />
      ) : (
        <Text style={styles.errorText}>Invalid profile URL</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
