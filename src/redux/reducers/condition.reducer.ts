import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Types
interface Condition {
  id: number;
  name: string;
}

interface PlayerCondition {
  id: number;
  player_id: number;
  condition_id: number;
}

interface ConditionsState {
  conditions: Condition[];
  playerConditions: PlayerCondition[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ConditionsState = {
  conditions: [],
  playerConditions: [],
  status: 'idle',
  error: null,
};

// Async thunks for conditions
export const fetchConditions = createAsyncThunk(
  'conditions/fetchConditions',
  async () => {
    const response = await axios.get('/api/v1/conditions');
    return response.data;
  }
);

export const createCondition = createAsyncThunk(
  'conditions/createCondition',
  async (name: string) => {
    const response = await axios.post('/api/v1/conditions', { condition: { name } });
    return response.data;
  }
);

export const deleteCondition = createAsyncThunk(
  'conditions/deleteCondition',
  async (id: number) => {
    await axios.delete(`/api/v1/conditions/${id}`);
    return id;
  }
);

// Async thunks for player conditions
export const addConditionToPlayer = createAsyncThunk(
  'conditions/addConditionToPlayer',
  async ({ player_id, condition_id }: { player_id: number; condition_id: number }) => {
    const response = await axios.post('/api/v1/player_conditions', {
      player_condition: { player_id, condition_id }
    });
    return response.data;
  }
);

export const removeConditionFromPlayer = createAsyncThunk(
  'conditions/removeConditionFromPlayer',
  async (playerConditionId: number) => {
    await axios.delete(`/api/v1/player_conditions/${playerConditionId}`);
    return playerConditionId;
  }
);

const conditionsSlice = createSlice({
  name: 'conditions',
  initialState,
  reducers: {
    clearConditionErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conditions
      .addCase(fetchConditions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConditions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conditions = action.payload;
      })
      .addCase(fetchConditions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch conditions';
      })
      // Create Condition
      .addCase(createCondition.fulfilled, (state, action) => {
        state.conditions.push(action.payload);
      })
      // Delete Condition
      .addCase(deleteCondition.fulfilled, (state, action) => {
        state.conditions = state.conditions.filter(condition => condition.id !== action.payload);
        // Also remove any player conditions that referenced this condition
        state.playerConditions = state.playerConditions.filter(
          pc => pc.condition_id !== action.payload
        );
      })
      // Add Condition to Player
      .addCase(addConditionToPlayer.fulfilled, (state, action) => {
        state.playerConditions.push(action.payload);
      })
      // Remove Condition from Player
      .addCase(removeConditionFromPlayer.fulfilled, (state, action) => {
        state.playerConditions = state.playerConditions.filter(
          pc => pc.id !== action.payload
        );
      });
  },
});

export const { clearConditionErrors } = conditionsSlice.actions;

// Selectors
export const selectAllConditions = (state: { conditions: ConditionsState }) => 
  state.conditions.conditions;

export const selectPlayerConditions = (state: { conditions: ConditionsState }, playerId: number) =>
  state.conditions.playerConditions
    .filter(pc => pc.player_id === playerId)
    .map(pc => {
      const condition = state.conditions.conditions.find(c => c.id === pc.condition_id);
      return {
        id: pc.id,
        condition_id: pc.condition_id,
        condition_name: condition?.name
      };
    });

export const selectConditionsStatus = (state: { conditions: ConditionsState }) => 
  state.conditions.status;

export const selectConditionsError = (state: { conditions: ConditionsState }) => 
  state.conditions.error;

export default conditionsSlice.reducer;