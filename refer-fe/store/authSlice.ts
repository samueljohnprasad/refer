import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  RegisterPayload, 
  RegisterResponse, 
  LoginResponse,
  LoginPayload 
} from '../services/auth';
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
import { registerThunk, loginThunk, initAuth } from './authThunks';
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
  extraReducers: (builder) => {
    // Register cases
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        state.initialized = true;
        console.log('[registerThunk.fulfilled reducer] payload:', action.payload);
      })
      .addCase(registerThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.initialized = true;
      })
      
      // Login cases
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        state.initialized = true;
        console.log('[loginThunk.fulfilled reducer] payload:', action.payload);
      })
      .addCase(loginThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.initialized = true;
      })
      
      // Init auth case
      .addCase(initAuth.fulfilled, (state, action: PayloadAction<StoredAuth>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.initialized = true;
      })
      .addCase(initAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
