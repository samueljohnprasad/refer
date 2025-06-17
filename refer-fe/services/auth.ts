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
  const res = await api.post<{data: RegisterResponse}>('/auth/register', payload);
  return res.data.data;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<{data: LoginResponse}>('/auth/login', payload);
  return res.data.data;
}
