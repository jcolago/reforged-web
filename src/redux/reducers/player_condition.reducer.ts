/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { playerConditionService } from '../../api/service';

// Types

export interface PlayerCondition {
    id: number;
    player_id: number;
    condition_id: number;
    condition_length: number;
    condition?: {
      id: number;
      name: string;
    };
  }

export interface PlayerConditionCreate {
  player_id: number;
  condition_id: number;
  condition_length: number;
}

export interface ValidationErrors {
  base?: string[];
  player_id?: string[];
  condition_id?: string[];
  condition_length?: string[];
  [key: string]: string[] | undefined;
}

export interface PlayerConditionsState {
  playerConditions: PlayerCondition[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: ValidationErrors | string | null;
}

const initialState: PlayerConditionsState = {
  playerConditions: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchPlayerConditions = createAsyncThunk(
    'playerConditions/fetchPlayerConditions',
    async (_, { rejectWithValue }) => {
      try {
        const response = await playerConditionService.getPlayerConditions();
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch conditions');
      }
    }
  );

export const createPlayerCondition = createAsyncThunk(
  'playerConditions/createPlayerCondition',
  async (data: PlayerConditionCreate, { rejectWithValue }) => {
    try {
      const response = await playerConditionService.createPlayerCondition(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to create player condition');
    }
  }
);

export const updatePlayerCondition = createAsyncThunk(
  'playerConditions/updatePlayerCondition',
  async ({ id, condition_length }: { id: number; condition_length: number }, { rejectWithValue }) => {
    try {
      const response = await playerConditionService.updatePlayerCondition(id, { condition_length });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to update player condition');
    }
  }
);

export const deletePlayerCondition = createAsyncThunk(
  'playerConditions/deletePlayerCondition',
  async (id: number, { rejectWithValue }) => {
    try {
      await playerConditionService.deletePlayerCondition(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to delete player condition');
    }
  }
);

const playerConditionsSlice = createSlice({
  name: 'playerConditions',
  initialState,
  reducers: {
    clearPlayerConditionErrors: (state) => {
      state.error = null;
    },
    decrementConditionLengths: (state) => {
      state.playerConditions = state.playerConditions.map(pc => ({
        ...pc,
        condition_length: Math.max(0, pc.condition_length - 1)
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Player Conditions
      .addCase(fetchPlayerConditions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlayerConditions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.playerConditions = action.payload;
      })
      .addCase(fetchPlayerConditions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors | string;
      })
      // Create Player Condition
      .addCase(createPlayerCondition.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPlayerCondition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.playerConditions.push(action.payload);
        state.error = null;
      })
      .addCase(createPlayerCondition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors;
      })
      // Update Player Condition
      .addCase(updatePlayerCondition.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePlayerCondition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.playerConditions.findIndex(pc => pc.id === action.payload.id);
        if (index !== -1) {
          state.playerConditions[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePlayerCondition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors;
      })
      // Delete Player Condition
      .addCase(deletePlayerCondition.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePlayerCondition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.playerConditions = state.playerConditions.filter(pc => pc.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePlayerCondition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors;
      });
  },
});

export const { 
  clearPlayerConditionErrors,
  decrementConditionLengths 
} = playerConditionsSlice.actions;

// Selectors
export const selectAllPlayerConditions = (state: { playerConditions: PlayerConditionsState }) => 
  state.playerConditions.playerConditions;

export const selectPlayerConditionsByPlayerId = (
  state: { playerConditions: PlayerConditionsState },
  playerId: number
) => state.playerConditions.playerConditions.filter(pc => pc.player_id === playerId);

export const selectActivePlayerConditions = (
  state: { playerConditions: PlayerConditionsState },
  playerId: number
) => state.playerConditions.playerConditions.filter(
  pc => pc.player_id === playerId && pc.condition_length > 0
);

export const selectPlayerConditionsStatus = (state: { playerConditions: PlayerConditionsState }) => 
  state.playerConditions.status;

export const selectPlayerConditionsError = (state: { playerConditions: PlayerConditionsState }) => 
  state.playerConditions.error;

export default playerConditionsSlice.reducer;