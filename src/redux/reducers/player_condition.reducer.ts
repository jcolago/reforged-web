import { 
    createSlice, 
    createAsyncThunk,
    ActionReducerMapBuilder
  } from "@reduxjs/toolkit";
  import axios, { AxiosError } from "axios";
  
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
  
  export interface PlayerConditionUpdate {
    id: number;
    condition_length?: number;
  }

  export interface Condition {
    id: number;
    name: string;
  }
  
  export interface UpdateHpPayload {
    current_hp: number;
    player_id: number;
  }
  
  export interface AddConditionPayload {
    condition_length: number;
    condition_id: number;
    player_id: number;
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
  export const fetchPlayerConditions = createAsyncThunk<
    PlayerCondition[],
    void,
    { rejectValue: ValidationErrors }
  >('playerConditions/fetchPlayerConditions', async () => {
    const response = await axios.get('/api/v1/player_conditions', {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });
    return response.data;
  });
  
  export const fetchPlayerConditionsForPlayer = createAsyncThunk<
    PlayerCondition[],
    number,
    { rejectValue: ValidationErrors }
  >('playerConditions/fetchPlayerConditionsForPlayer', async (playerId) => {
    const response = await axios.get(`/api/v1/player_conditions?player_id=${playerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });
    return response.data;
  });
  
  export const createPlayerCondition = createAsyncThunk<
    PlayerCondition,
    PlayerConditionCreate,
    { rejectValue: ValidationErrors }
  >('playerConditions/createPlayerCondition', async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/player_conditions', {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        },
        player_condition: data
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ errors: ValidationErrors }>;
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      }
      return rejectWithValue({ base: ['An unexpected error occurred'] });
    }
  });
  
  export const updatePlayerCondition = createAsyncThunk<
    PlayerCondition,
    PlayerConditionUpdate,
    { rejectValue: ValidationErrors }
  >('playerConditions/updatePlayerCondition', async ({ id, condition_length }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/player_conditions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        },
        player_condition: { condition_length }
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ errors: ValidationErrors }>;
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      }
      return rejectWithValue({ base: ['An unexpected error occurred'] });
    }
  });
  
  export const deletePlayerCondition = createAsyncThunk<
    number,
    number,
    { rejectValue: ValidationErrors }
  >('playerConditions/deletePlayerCondition', async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/player_conditions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });
      return id;
    } catch (err) {
      const error = err as AxiosError<{ errors: ValidationErrors }>;
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      }
      return rejectWithValue({ base: ['An unexpected error occurred'] });
    }
  });

  export const addPlayerCondition = createAsyncThunk(
    'playerCondition/addCondition',
    async (conditionData: AddConditionPayload) => {
      const response = await axios.post('/api/v1/player_conditions', conditionData, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });
      return response.data;
    }
  );
  
  export const updatePlayerHp = createAsyncThunk(
    'playerCondition/updateHp',
    async (hpData: UpdateHpPayload) => {
      const response = await axios.patch(`/api/v1/players/${hpData.player_id}/update_hp`, hpData, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });
      return response.data;
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
    extraReducers: (builder: ActionReducerMapBuilder<PlayerConditionsState>) => {
      builder
        // Fetch All Player Conditions
        .addCase(fetchPlayerConditions.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchPlayerConditions.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.playerConditions = action.payload;
        })
        .addCase(fetchPlayerConditions.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch player conditions';
        })
        // Fetch Player Conditions for specific player
        .addCase(fetchPlayerConditionsForPlayer.fulfilled, (state, action) => {
          const otherPlayerConditions = state.playerConditions.filter(
            pc => pc.player_id !== action.payload[0]?.player_id
          );
          state.playerConditions = [...otherPlayerConditions, ...action.payload];
        })
        // Create Player Condition
        .addCase(createPlayerCondition.fulfilled, (state, action) => {
          state.playerConditions.push(action.payload);
          state.error = null;
        })
        .addCase(createPlayerCondition.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || { base: ['Failed to create player condition'] };
        })
        // Update Player Condition
        .addCase(updatePlayerCondition.fulfilled, (state, action) => {
          const index = state.playerConditions.findIndex(pc => pc.id === action.payload.id);
          if (index !== -1) {
            state.playerConditions[index] = action.payload;
          }
          state.error = null;
        })
        .addCase(updatePlayerCondition.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || { base: ['Failed to update player condition'] };
        })
        // Delete Player Condition
        .addCase(deletePlayerCondition.fulfilled, (state, action) => {
          state.playerConditions = state.playerConditions.filter(pc => pc.id !== action.payload);
          state.error = null;
        })
        .addCase(deletePlayerCondition.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || { base: ['Failed to delete player condition'] };
        })
        .addCase(addPlayerCondition.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(addPlayerCondition.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.playerConditions.push(action.payload);
          })
          .addCase(addPlayerCondition.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as ValidationErrors;
          })
          // Update HP
          .addCase(updatePlayerHp.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(updatePlayerHp.fulfilled, (state) => {
            state.status = 'succeeded';
            // Handle HP update response if needed
          })
          .addCase(updatePlayerHp.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as ValidationErrors;
          });
    },
    
  });
  
  export const { 
    clearPlayerConditionErrors,
    decrementConditionLengths 
  } = playerConditionsSlice.actions;
  
  // Selectors with proper type safety
  export const selectAllPlayerConditions = (state: { playerConditions: PlayerConditionsState }) => 
    state.playerConditions.playerConditions;
  
  export const selectPlayerConditionsByPlayerId = (
    state: { playerConditions: PlayerConditionsState },
    playerId: number
  ) => state.playerConditions.playerConditions.filter(pc => pc.player_id === playerId);
  
  export const selectPlayerConditionsStatus = (state: { playerConditions: PlayerConditionsState }) => 
    state.playerConditions.status;
  
  export const selectPlayerConditionsError = (state: { playerConditions: PlayerConditionsState }) => 
    state.playerConditions.error;
  
  export const selectActivePlayerConditions = (
    state: { playerConditions: PlayerConditionsState },
    playerId: number
  ) => state.playerConditions.playerConditions.filter(
    pc => pc.player_id === playerId && pc.condition_length > 0
  );
  
  export default playerConditionsSlice.reducer;