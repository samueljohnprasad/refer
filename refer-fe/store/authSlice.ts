import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { registerUser, RegisterPayload, RegisterResponse } from '../services/auth';
import { saveAuth, loadAuth, clearAuth, StoredAuth } from '../services/authStorage';
import { User } from '../types/User';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,
};

// Thunks are now defined in authThunks.ts
import { registerThunk, initAuth } from './authThunks';
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state: AuthState) {
      state.user = null;
      state.token = null;
      state.error = null;
      clearAuth();
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state: AuthState, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        state.initialized = true;
        // No AsyncStorage side-effects here
        console.log('[registerThunk.fulfilled reducer] payload:', action.payload);
      })
      .addCase(registerThunk.rejected, (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(initAuth.fulfilled, (state: AuthState, action: PayloadAction<StoredAuth>) => {
        console.log('[initAuth.fulfilled reducer] payload:', action.payload);
        state.token = action.payload.token;
        state.user = action.payload.user ?? null;
        state.initialized = true;
      })
      .addDefaultCase((state) => {
        // Defensive: never allow state to become undefined
        return state ?? initialState;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
