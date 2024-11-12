import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
interface User {
  id: number;
  email: string;
  // Add other user fields but exclude password_digest as per your controller
}

interface UserState {
  users: User[];
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | Record<string, string[]>;
}

interface CreateUserData {
  email: string;
  password: string;
  password_confirmation: string;
}

interface UpdateUserData {
  email?: string;
  password?: string;
  password_confirmation?: string;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/users');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Failed to fetch users');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/users/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Failed to fetch user');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: CreateUserData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/users', {
        user: userData // Wrap in user object as required by Rails strong parameters
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        // Handle validation errors from Rails
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }: { id: number; userData: UpdateUserData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/users/${id}`, {
        user: userData // Wrap in user object as required by Rails strong parameters
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        // Handle validation errors from Rails
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/users/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Failed to delete user');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/users/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return rejectWithValue('Invalid email or password');
        }
        return rejectWithValue(error.response?.data?.error || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Fetch Single User
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as Record<string, string[]>;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as Record<string, string[]>;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentUser } = userSlice.actions;

// Selectors
export const selectAllUsers = (state: { user: UserState }) => state.user.users;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUserById = (state: { user: UserState }, userId: number) => 
  state.user.users.find(user => user.id === userId);
export const selectUserStatus = (state: { user: UserState }) => state.user.status;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;