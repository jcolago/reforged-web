/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { conditionService } from '../../api/service';

// Types
export interface Condition {
  id: number;
  name: string;
}

export interface ValidationErrors {
  name?: string[];
  base?: string[];
  [key: string]: string[] | undefined;
}

export interface ConditionsState {
  conditions: Condition[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: ValidationErrors | string | null;
}

const initialState: ConditionsState = {
  conditions: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchConditions = createAsyncThunk(
  'conditions/fetchConditions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await conditionService.getConditions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to fetch conditions');
    }
  }
);

export const createCondition = createAsyncThunk(
  'conditions/createCondition',
  async (conditionData: { name: string }, { rejectWithValue }) => {
    try {
      const response = await conditionService.createCondition(conditionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to create condition');
    }
  }
);

export const updateCondition = createAsyncThunk(
  'conditions/updateCondition',
  async ({ id, conditionData }: { id: number, conditionData: Partial<Condition> }, { rejectWithValue }) => {
    try {
      const response = await conditionService.updateCondition(id, conditionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to update condition');
    }
  }
);

export const deleteCondition = createAsyncThunk(
  'conditions/deleteCondition',
  async (id: number, { rejectWithValue }) => {
    try {
      await conditionService.deleteCondition(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to delete condition');
    }
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
        state.error = null;
      })
      .addCase(fetchConditions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors | string;
      })
      // Create Condition
      .addCase(createCondition.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCondition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conditions.push(action.payload);
        state.error = null;
      })
      .addCase(createCondition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors | string;
      })
      // Update Condition
      .addCase(updateCondition.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCondition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.conditions.findIndex(condition => condition.id === action.payload.id);
        if (index !== -1) {
          state.conditions[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCondition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors | string;
      })
      // Delete Condition
      .addCase(deleteCondition.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCondition.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conditions = state.conditions.filter(condition => condition.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCondition.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors | string;
      });
  },
});

export const { clearConditionErrors } = conditionsSlice.actions;

// Selectors
export const selectAllConditions = (state: { conditions: ConditionsState }) => 
  state.conditions.conditions;

export const selectConditionById = (state: { conditions: ConditionsState }, conditionId: number) =>
  state.conditions.conditions.find(condition => condition.id === conditionId);

export const selectConditionsStatus = (state: { conditions: ConditionsState }) => 
  state.conditions.status;

export const selectConditionsError = (state: { conditions: ConditionsState }) => 
  state.conditions.error;

export default conditionsSlice.reducer;