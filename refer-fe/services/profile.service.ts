import { Profile, ProfileFormData } from "../types/profile.types";
import api from "./api";

// Set auth token using the centralized API service
export const setAuthToken = (token: string | null): void => {
    api.setToken(token);
};

/**
 * Get current user's profile
 */
export const getUserProfile = async (): Promise<Profile> => {
    try {
        const response = await api.get<{success: boolean, data: Profile}>("/profiles/me");
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get profile by username (public view)
 */
export const getProfileByUsername = async (
    username: string
): Promise<Profile> => {
    try {
        const response = await api.get<{success: boolean, data: Profile}>(`/profiles/username/${username}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (
    profileData: ProfileFormData
): Promise<Profile> => {
    try {
        const response = await api.put<{success: boolean, data: Profile}>("/profiles", profileData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (
    username: string
): Promise<boolean> => {
    try {
        const response = await api.get<{success: boolean, available: boolean}>(`/profiles/username/${username}/check`);
        return response.available;
    } catch (error) {
        throw error;
    }
};

export const getMyProfile = async () => {
    try {
        const response = await api.get('/profiles/me');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateMyProfile = async (profileData: any) => {
    try {
        const response = await api.put('/profiles', profileData);
        return response.data.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const savePushToken = async (token: string) => {
    try {
        console.log('Saving push token to backend:', token);
        const response = await api.post('/profiles/push-token', { token });
        console.log('Push token save response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving push token:', error);
        // We don't want to throw here, as it's not a critical failure
    }
};
