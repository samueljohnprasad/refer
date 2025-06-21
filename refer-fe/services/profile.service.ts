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
