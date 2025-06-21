import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ProfileViewMode, Profile } from '../../types/profile.types';
import { RootState, AppDispatch } from '../../store';
import { fetchUserProfile, fetchProfileByUsername } from '../../store/profileThunks';
import { setViewMode } from '../../store/profileSlice';
import EditProfileView from '../profile/EditProfileView';
import PublicProfileView from '../profile/PublicProfileView';

type ProfileViewProps = {
  username?: string;  // Optional: if provided, shows a specific user's profile
};

const ProfileView: React.FC<ProfileViewProps> = ({ 
  username 
}: ProfileViewProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, publicProfile, viewMode, isLoading, error } = useSelector(
    (state: RootState) => state.profile
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Determine if this is the current user's profile
  const isCurrentUserProfile = !username || (user && profile && profile.username === username);
  
  // Profile data to display
  const profileData: Profile | null = isCurrentUserProfile ? profile : publicProfile;
  
  useEffect(() => {
    // Load profile data
    if (isCurrentUserProfile) {
      dispatch(fetchUserProfile());
    } else if (username) {
      dispatch(fetchProfileByUsername(username));
    }
  }, [dispatch, username, isCurrentUserProfile]);

  const handleChangeViewMode = (mode: ProfileViewMode): void => {
    dispatch(setViewMode(mode));
  };

  // Display loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Display error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Display no profile found
  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProfileText}>
          {isCurrentUserProfile ? "You don't have a profile yet." : "Profile not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* View Mode Toggle - Only show if it's the current user's profile */}
      {isCurrentUserProfile && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === ProfileViewMode.PUBLIC && styles.activeToggleButton
            ]}
            onPress={() => handleChangeViewMode(ProfileViewMode.PUBLIC)}
          >
            <Text style={styles.toggleButtonText}>Public View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === ProfileViewMode.EDIT && styles.activeToggleButton
            ]}
            onPress={() => handleChangeViewMode(ProfileViewMode.EDIT)}
          >
            <Text style={styles.toggleButtonText}>Edit Mode</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Display appropriate view based on mode */}
      {(isCurrentUserProfile && viewMode === ProfileViewMode.EDIT) ? (
        <EditProfileView profile={profileData} />
      ) : (
        <PublicProfileView profile={profileData} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeToggleButton: {
    backgroundColor: '#007bff',
  },
  toggleButtonText: {
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noProfileText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default ProfileView;
