import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface User {
  id: number;
  email: string;
  // Add other user fields but exclude password_digest
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface PasswordResetRequest {
  email_address: string;
}

interface PasswordResetUpdate {
  token: string;
  password: string;
  password_confirmation: string;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  status: 'idle',
  error: null
};

// Login thunk to match your sessions#login endpoint
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>('api/v1/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          return rejectWithValue('Too many attempts. Please try again later.');
        }
        return rejectWithValue(error.response?.data?.error || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Fetch current user thunk to match your sessions#me endpoint
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.token;
      console.log('Fetching current user with token:', token);

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get<{ user: User }>('/api/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Current user response:', response.data);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      if (axios.isAxiosError(error)) {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
        return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Logout thunk to match your sessions#logout endpoint
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      await axios.delete('/api/v1/logout', {
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Authorization: `Bearer ${(getState() as any).auth.token}`
        }
      });
      localStorage.removeItem('token');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Logout failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Password reset request thunk
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (data: PasswordResetRequest, { rejectWithValue }) => {
    try {
      await axios.post('/api/v1/passwords', data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Password reset request failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Reset password thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: PasswordResetUpdate, { rejectWithValue }) => {
    try {
      await axios.patch(`/api/v1/passwords/${data.token}`, {
        password: data.password,
        password_confirmation: data.password_confirmation
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Password reset failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })
      // Password Reset Request
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => 
  !!state.auth.token && !!state.auth.user;

export const selectCurrentUser = (state: { auth: AuthState }) => 
  state.auth.user;

export const selectAuthStatus = (state: { auth: AuthState }) => 
  state.auth.status;

export const selectAuthError = (state: { auth: AuthState }) => 
  state.auth.error;

export default authSlice.reducer;