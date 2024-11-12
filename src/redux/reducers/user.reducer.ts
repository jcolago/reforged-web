import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface User {
  id: number;
  email: string;
  // Add other user properties as needed
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthToken {
  token: string;
}

interface UserState {
  currentUser: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define RootState type
export interface RootState {
  user: UserState;
  // Add other slice states as needed
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null
};

// Async thunks
export const login = createAsyncThunk<
  string,
  LoginCredentials,
  { rejectValue: string }
>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthToken>('/api/v1/login', credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.error || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { state: RootState; rejectValue: string }
>(
  'user/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        throw new Error('No token available');
      }
      
      const response = await axios.get<{ user: User }>('/api/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.error || 'Failed to fetch user');
      }
      return rejectWithValue('Failed to fetch user');
    }
  }
);

export const logout = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>(
  'user/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        throw new Error('No token available');
      }

      await axios.delete('/api/v1/logout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.error || 'Logout failed');
      }
      return rejectWithValue('Logout failed');
    }
  }
);

interface RegisterUserData {
  email: string;
  password: string;
  password_confirmation: string;
}

export const registerUser = createAsyncThunk<
  User,
  RegisterUserData,
  { rejectValue: string }
>(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post<User>('/api/v1/users', { user: userData });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.error || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
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
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed';
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch user';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.token = null;
        state.status = 'idle';
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Logout failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Registration failed';
      });
  },
});

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectToken = (state: RootState) => state.user.token;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

export const { clearError } = userSlice.actions;
export default userSlice.reducer;