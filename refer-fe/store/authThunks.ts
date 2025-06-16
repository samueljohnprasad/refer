import { createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, RegisterPayload, RegisterResponse } from '../services/auth';
import { saveAuth, loadAuth, StoredAuth } from '../services/authStorage';

export const registerThunk = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload: RegisterPayload, { rejectWithValue }): Promise<RegisterResponse | any> => {
  try {
    const res: RegisterResponse = await registerUser(payload);
    await saveAuth({ token: res.token, user: res.user });
    return res;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || 'Registration failed');
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
