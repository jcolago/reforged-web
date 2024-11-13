/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { monsterService } from '../../api/service';

// Enum types matching Rails enums
export enum MonsterSize {
  Tiny = "tiny",
  Small = "small",
  Medium = "medium",
  Large = "large",
  Huge = "huge",
  Gargantuan = "gargantuan"
}

export enum MonsterAlignment {
  LawfulGood = "lawful_good",
  NeutralGood = "neutral_good",
  ChaoticGood = "chaotic_good",
  LawfulNeutral = "lawful_neutral",
  TrueNeutral = "true_neutral",
  ChaoticNeutral = "chaotic_neutral",
  LawfulEvil = "lawful_evil",
  NeutralEvil = "neutral_evil",
  ChaoticEvil = "chaotic_evil"
}

// Types
export interface MonsterState {
  id: number;
  name: string;
  armor_class: number;
  hit_points: number;
  speed: number;
  p_bonus: number;
  resistances: string;
  attacks: string;
  displayed: boolean;
  size: MonsterSize;
  alignment: MonsterAlignment;
  game_id: number;
}

export interface MonstersState {
  monsters: MonsterState[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentMonster: MonsterState | null;
}

const initialState: MonstersState = {
  monsters: [],
  status: 'idle',
  error: null,
  currentMonster: null,
};

// Async thunks
export const fetchMonsters = createAsyncThunk(
  'monsters/fetchMonsters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await monsterService.getMonsters();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch monsters');
    }
  }
);

export const addMonster = createAsyncThunk(
  'monsters/addMonster',
  async (monsterData: Omit<MonsterState, 'id'>, { rejectWithValue }) => {
    try {
      const response = await monsterService.addMonster(monsterData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add monster');
    }
  }
);

export const updateMonster = createAsyncThunk(
  'monsters/updateMonster',
  async ({ id, monsterData }: { id: number; monsterData: Partial<MonsterState> }, { rejectWithValue }) => {
    try {
      const response = await monsterService.updateMonster(id, monsterData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update monster');
    }
  }
);

export const removeMonster = createAsyncThunk(
  'monsters/removeMonster',
  async (id: number, { rejectWithValue }) => {
    try {
      await monsterService.removeMonster(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove monster');
    }
  }
);

const monstersSlice = createSlice({
  name: 'monsters',
  initialState,
  reducers: {
    setCurrentMonster: (state, action) => {
      state.currentMonster = action.payload;
    },
    clearCurrentMonster: (state) => {
      state.currentMonster = null;
    },
    toggleMonsterDisplay: (state, action) => {
      const monster = state.monsters.find(m => m.id === action.payload);
      if (monster) {
        monster.displayed = !monster.displayed;
      }
    },
    clearMonsterError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Monsters
      .addCase(fetchMonsters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMonsters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monsters = action.payload;
        state.error = null;
      })
      .addCase(fetchMonsters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add Monster
      .addCase(addMonster.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMonster.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monsters.push(action.payload);
        state.error = null;
      })
      .addCase(addMonster.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update Monster
      .addCase(updateMonster.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMonster.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.monsters.findIndex(monster => monster.id === action.payload.id);
        if (index !== -1) {
          state.monsters[index] = action.payload;
        }
        if (state.currentMonster?.id === action.payload.id) {
          state.currentMonster = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMonster.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Remove Monster
      .addCase(removeMonster.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeMonster.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monsters = state.monsters.filter(monster => monster.id !== action.payload);
        if (state.currentMonster?.id === action.payload) {
          state.currentMonster = null;
        }
        state.error = null;
      })
      .addCase(removeMonster.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentMonster, 
  clearCurrentMonster, 
  toggleMonsterDisplay,
  clearMonsterError
} = monstersSlice.actions;

// Selectors
export const selectAllMonsters = (state: { monsters: MonstersState }) => state.monsters.monsters;
export const selectMonsterById = (state: { monsters: MonstersState }, monsterId: number) =>
  state.monsters.monsters.find(monster => monster.id === monsterId);
export const selectCurrentMonster = (state: { monsters: MonstersState }) => state.monsters.currentMonster;
export const selectDisplayedMonsters = (state: { monsters: MonstersState }) =>
  state.monsters.monsters.filter(monster => monster.displayed);
export const selectMonstersStatus = (state: { monsters: MonstersState }) => state.monsters.status;
export const selectMonstersError = (state: { monsters: MonstersState }) => state.monsters.error;

export default monstersSlice.reducer;