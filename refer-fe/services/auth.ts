import api from './api';

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
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

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await api.post<{data: RegisterResponse}>('/auth/register', payload);
  return res.data.data;
}
