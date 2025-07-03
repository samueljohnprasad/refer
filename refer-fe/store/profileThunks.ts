import { createAsyncThunk } from '@reduxjs/toolkit';
import * as profileService from '../services/profile.service';
import { Profile, ProfileFormData } from '../types/profile.types';
import { 
  setProfile, 
  setPublicProfile, 
  setLoading, 
  setError, 
  setUsernameAvailability, 
  setCheckingUsername 
} from './profileSlice';

/**
 * Fetch current user's profile
 */
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const profile: Profile = await profileService.getUserProfile();
      dispatch(setProfile(profile));
      return profile;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch profile'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Fetch profile by username (public view)
 */
export const fetchProfileByUsername = createAsyncThunk(
  'profile/fetchProfileByUsername',
  async (username: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const profile: Profile = await profileService.getProfileByUsername(username);
      dispatch(setPublicProfile(profile));
      return profile;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch profile'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: ProfileFormData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const updatedProfile: Profile = await profileService.updateProfile(profileData);
      dispatch(setProfile(updatedProfile));
      return updatedProfile;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to update profile'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Check username availability
 */
export const checkUsernameAvailability = createAsyncThunk(
  'profile/checkUsernameAvailability',
  async (username: string, { dispatch }) => {
    try {
      dispatch(setCheckingUsername(true));
      const isAvailable: boolean = await profileService.checkUsernameAvailability(username);
      dispatch(setUsernameAvailability(isAvailable));
      return isAvailable;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to check username'));
      throw error;
    }
  }
);
