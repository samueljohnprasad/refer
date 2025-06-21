import axios from "axios";
import { Profile, ProfileFormData } from "../types/profile.types";
import api from "./api";

// Set auth token for API calls
export const setAuthToken = (token: string | null): void => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

/**
 * Get current user's profile
 */
export const getUserProfile = async (): Promise<Profile> => {
    try {
        const response = await api.get("/profiles/me");
        return response.data.data;
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
        const response = await api.get(`/profiles/username/${username}`);
        return response.data.data;
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
        const response = await api.put("/profiles", profileData);
        return response.data.data;
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
        const response = await api.get(`/profiles/username/${username}/check`);
        return response.data.available;
    } catch (error) {
        throw error;
    }
};
