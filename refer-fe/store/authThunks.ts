import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  registerUser, 
  RegisterPayload, 
  RegisterResponse, 
  loginUser, 
  LoginPayload, 
  LoginResponse 
} from '../services/auth';
import { saveAuth, loadAuth, StoredAuth } from '../services/authStorage';
interface ApiError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

export const registerThunk = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload: RegisterPayload, { rejectWithValue }): Promise<RegisterResponse | any> => {
  try {
    const res: RegisterResponse = await registerUser(payload);
    await saveAuth({ token: res.token, user: res.user });
    return res;
  } catch (error) {
    const apiError = error as ApiError;

    return rejectWithValue(apiError?.response?.data?.message || 'Registration failed');
  }
});

export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload: LoginPayload, { rejectWithValue }): Promise<LoginResponse | any> => {
  try {
    const res: LoginResponse = await loginUser(payload);
    await saveAuth({ token: res.token, user: res.user });
    return res;
  } catch (error) {
    const apiError = error as ApiError;

    return rejectWithValue(apiError?.response?.data?.message || 'Login failed');
  }
});

export const initAuth = createAsyncThunk<StoredAuth, void, {}>(
  'auth/init',
  async (): Promise<StoredAuth> => {
    const result: StoredAuth = await loadAuth();
    console.log('[initAuth thunk] returning', result);
    return result;
  }
);
