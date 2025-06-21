import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
  };
  message: string;
  success: boolean;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
}

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  try {
    const response = await api.post<{success: boolean, data: RegisterResponse}>('/auth/register', payload);
    // Set the token in our centralized API service after successful registration
    if (response.data?.token) {
      api.setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<{success: boolean, data: LoginResponse}>('/auth/login', payload);
    // Set the token in our centralized API service after successful login
    if (response.data?.token) {
      console.log("Setting auth token", response.data.token);
      api.setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  // Clear the token from our centralized API service
  api.clearToken();
}
