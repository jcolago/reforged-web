// src/redux/reducers/player.reducer.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// Base PlayerState interface matching your schema exactly
export interface PlayerState {
  id: number;
  name: string;
  character: string;
  class: string;
  image: string;
  level: number;
  current_hp: number;
  total_hp: number;
  armor_class: number;
  speed: number;
  initiative_bonus: number;
  strength: number;
  strength_bonus: number;
  strength_save: number;
  dexterity: number;
  dexterity_bonus: number;
  dexterity_save: number;
  constitution: number;
  constitution_bonus: number;
  constitution_save: number;
  intelligence: number;
  intelligence_bonus: number;
  intelligence_save: number;
  wisdom: number;
  wisdom_bonus: number;
  wisdom_save: number;
  charisma: number;
  charisma_bonus: number;
  charisma_save: number;
  displayed: boolean;
  game: string;
}

// Form values for PlayerInfo step
export interface PlayerInfoFormValues {
  name: string;
  character: string;
  class: string;
  image: string;
  level: string;
  current_hp: string;
  total_hp: string;
  armor_class: string;
  speed: string;
  initiative_bonus: string;
  game: string;
}

// Form values for PlayerStats step
export interface PlayerStatsFormValues {
  strength: string;
  strength_bonus: string;
  strength_save: string;
  dexterity: string;
  dexterity_bonus: string;
  dexterity_save: string;
  constitution: string;
  constitution_bonus: string;
  constitution_save: string;
  intelligence: string;
  intelligence_bonus: string;
  intelligence_save: string;
  wisdom: string;
  wisdom_bonus: string;
  wisdom_save: string;
  charisma: string;
  charisma_bonus: string;
  charisma_save: string;
}


// State interface for the reducer
export interface PlayersState {
  players: PlayerState[];
  playerInfo: PlayerInfoFormValues | null;
  playerStats: PlayerStatsFormValues | null;
  currentPlayer: PlayerState | null;
  details: PlayerState[] | null; // Add this line
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  playerInfo: null,
  playerStats: null,
  currentPlayer: null,
  status: 'idle',
  error: null,
  details: null
};

const convertPlayerDataToNumbers = (
  playerData: PlayerInfoFormValues & PlayerStatsFormValues
): Omit<PlayerState, 'id'> => {
  return {
    name: playerData.name,
    character: playerData.character,
    class: playerData.class,
    image: playerData.image,
    level: Number(playerData.level),
    current_hp: Number(playerData.current_hp),
    total_hp: Number(playerData.total_hp),
    armor_class: Number(playerData.armor_class),
    speed: Number(playerData.speed),
    initiative_bonus: Number(playerData.initiative_bonus),
    strength: Number(playerData.strength),
    strength_bonus: Number(playerData.strength_bonus),
    strength_save: Number(playerData.strength_save),
    dexterity: Number(playerData.dexterity),
    dexterity_bonus: Number(playerData.dexterity_bonus),
    dexterity_save: Number(playerData.dexterity_save),
    constitution: Number(playerData.constitution),
    constitution_bonus: Number(playerData.constitution_bonus),
    constitution_save: Number(playerData.constitution_save),
    intelligence: Number(playerData.intelligence),
    intelligence_bonus: Number(playerData.intelligence_bonus),
    intelligence_save: Number(playerData.intelligence_save),
    wisdom: Number(playerData.wisdom),
    wisdom_bonus: Number(playerData.wisdom_bonus),
    wisdom_save: Number(playerData.wisdom_save),
    charisma: Number(playerData.charisma),
    charisma_bonus: Number(playerData.charisma_bonus),
    charisma_save: Number(playerData.charisma_save),
    displayed: false,
    game: playerData.game
  };
};
// Async thunks
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async () => {
    const response = await axios.get('/api/v1/players', {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });
    return response.data;
  }
);

export const addPlayer = createAsyncThunk(
  'players/addPlayer',
  async (playerData: PlayerInfoFormValues & PlayerStatsFormValues) => {
    const convertedData = convertPlayerDataToNumbers(playerData);
    const response = await axios.post('/api/v1/players', convertedData, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });
    return response.data;
  }
);

export const togglePlayerDisplay = createAsyncThunk(
  'players/toggleDisplay',
  async (id: number) => {
    const response = await axios.patch(`/api/v1/players/${id}/toggle_display`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });
    return response.data;
  }
);

export const deletePlayer = createAsyncThunk(
  'players/deletePlayer',
  async (id: number) => {
    await axios.delete(`/api/v1/players/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });
    return id;
  }
);

export const fetchPlayerDetails = createAsyncThunk(
  'players/fetchPlayerDetails',
  async (id: number) => {
    const response = await axios.get(`/api/v1/players/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });
    return response.data;
  }
);

export const updatePlayer = createAsyncThunk(
  'players/updatePlayer',
  async ({ id, ...playerData }: PlayerState, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/players/${id}`, playerData, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Failed to update player');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);


const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerInfo: (state, action: PayloadAction<PlayerInfoFormValues>) => {
      state.playerInfo = action.payload;
    },
    setPlayerStats: (state, action: PayloadAction<PlayerStatsFormValues>) => {
      state.playerStats = action.payload;
    },
    clearPlayerForms: (state) => {
      state.playerInfo = null;
      state.playerStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch players';
      })
      .addCase(addPlayer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addPlayer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.players.push(action.payload);
        state.playerInfo = null;
        state.playerStats = null;
      })
      .addCase(addPlayer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add player';
      })
      .addCase(togglePlayerDisplay.fulfilled, (state, action) => {
        const index = state.players.findIndex(player => player.id === action.payload.id);
        if (index !== -1) {
          state.players[index].displayed = action.payload.displayed;
        }
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.players = state.players.filter(player => player.id !== action.payload);
        if (state.currentPlayer?.id === action.payload) {
          state.currentPlayer = null;
        }
      })
      .addCase(fetchPlayerDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlayerDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.details = [action.payload];
      })
      .addCase(fetchPlayerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch player details';
      })
      .addCase(updatePlayer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.players.findIndex(player => player.id === action.payload.id);
        if (index !== -1) {
          state.players[index] = action.payload;
        }
        // Also update details if it exists
        if (state.details && state.details.length > 0) {
          state.details[0] = action.payload;
        }
      })
      .addCase(updatePlayer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { 
  setPlayerInfo, 
  setPlayerStats, 
  clearPlayerForms 
} = playerSlice.actions;

// Selectors
export const selectAllPlayers = (state: RootState) => state.player.players;
export const selectPlayerById = (state: RootState, playerId: number) => 
  state.player.players.find(player => player.id === playerId);
export const selectPlayerInfo = (state: RootState) => state.player.playerInfo;
export const selectPlayerStats = (state: RootState) => state.player.playerStats;
export const selectPlayerStatus = (state: RootState) => state.player.status;
export const selectPlayerError = (state: RootState) => state.player.error;

export default playerSlice.reducer;