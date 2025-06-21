import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile, ProfileViewMode } from '../types/profile.types';

interface ProfileState {
  profile: Profile | null;
  viewMode: ProfileViewMode;
  isLoading: boolean;
  error: string | null;
  publicProfile: Profile | null;
  isUsernameAvailable: boolean | null;
  isCheckingUsername: boolean;
}

const initialState: ProfileState = {
  profile: null,
  viewMode: ProfileViewMode.PUBLIC,
  isLoading: false,
  error: null,
  publicProfile: null,
  isUsernameAvailable: null,
  isCheckingUsername: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state: ProfileState, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
      state.error = null;
    },
    setPublicProfile: (state: ProfileState, action: PayloadAction<Profile>) => {
      state.publicProfile = action.payload;
      state.error = null;
    },
    setViewMode: (state: ProfileState, action: PayloadAction<ProfileViewMode>) => {
      state.viewMode = action.payload;
    },
    setLoading: (state: ProfileState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: ProfileState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUsernameAvailability: (state: ProfileState, action: PayloadAction<boolean | null>) => {
      state.isUsernameAvailable = action.payload;
      state.isCheckingUsername = false;
    },
    setCheckingUsername: (state: ProfileState, action: PayloadAction<boolean>) => {
      state.isCheckingUsername = action.payload;
    },
    clearProfile: (state: ProfileState) => {
      state.profile = null;
    },
    clearPublicProfile: (state: ProfileState) => {
      state.publicProfile = null;
    },
  },
});

export const {
  setProfile,
  setPublicProfile,
  setViewMode,
  setLoading,
  setError,
  setUsernameAvailability,
  setCheckingUsername,
  clearProfile,
  clearPublicProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
