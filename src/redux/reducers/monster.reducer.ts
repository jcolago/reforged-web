import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Enum types matching Rails enums
enum MonsterSize {
  Tiny = "tiny",
  Small = "small",
  Medium = "medium",
  Large = "large",
  Huge = "huge",
  Gargantuan = "gargantuan"
}

enum MonsterAlignment {
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

// Type for a single monster
interface MonsterState {
  id?: number;
  name: string;
  armor_class: number;
  hit_points: number;
  speed: number;
  p_bonus: number;
  resistances: string[];
  attacks: string[]; // You might want to create a specific type for attacks
  displayed: boolean;
  size: MonsterSize;
  alignment: MonsterAlignment;
  game_id: number;
}

// State interface for the reducer
interface MonstersState {
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

// Async thunks for API communication
export const fetchMonsters = createAsyncThunk(
  'monsters/fetchMonsters',
  async () => {
    const response = await axios.get('/api/v1/monsters/monsters');
    return response.data;
  }
);

export const addMonster = createAsyncThunk(
  'monsters/addMonster',
  async (monsterData: Omit<MonsterState, 'id'>) => {
    const response = await axios.post('/api/v1/monsters/add_monster', { monster: monsterData });
    return response.data;
  }
);

export const updateMonster = createAsyncThunk(
  'monsters/updateMonster',
  async ({ id, monsterData }: { id: number; monsterData: Partial<MonsterState> }) => {
    const response = await axios.patch(`/api/v1/monsters/${id}`, { monster: monsterData });
    return response.data;
  }
);

export const removeMonster = createAsyncThunk(
  'monsters/removeMonster',
  async (id: number) => {
    await axios.delete(`/api/v1/monsters/remove_monster`, { data: { id } });
    return id;
  }
);

const monstersSlice = createSlice({
  name: 'monsters',
  initialState,
  reducers: {
    setCurrentMonster: (state, action: PayloadAction<MonsterState>) => {
      state.currentMonster = action.payload;
    },
    clearCurrentMonster: (state) => {
      state.currentMonster = null;
    },
    toggleMonsterDisplay: (state, action: PayloadAction<number>) => {
      const monster = state.monsters.find(m => m.id === action.payload);
      if (monster) {
        monster.displayed = !monster.displayed;
      }
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
      })
      .addCase(fetchMonsters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch monsters';
      })
      // Add Monster
      .addCase(addMonster.fulfilled, (state, action) => {
        state.monsters.push(action.payload);
      })
      // Update Monster
      .addCase(updateMonster.fulfilled, (state, action) => {
        const index = state.monsters.findIndex(monster => monster.id === action.payload.id);
        if (index !== -1) {
          state.monsters[index] = action.payload;
        }
        if (state.currentMonster?.id === action.payload.id) {
          state.currentMonster = action.payload;
        }
      })
      // Remove Monster
      .addCase(removeMonster.fulfilled, (state, action) => {
        state.monsters = state.monsters.filter(monster => monster.id !== action.payload);
        if (state.currentMonster?.id === action.payload) {
          state.currentMonster = null;
        }
      });
  },
});

export const { 
  setCurrentMonster, 
  clearCurrentMonster, 
  toggleMonsterDisplay 
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