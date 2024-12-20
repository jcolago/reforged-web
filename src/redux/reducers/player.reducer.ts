/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { playerService } from '../../api/service';

export interface PlayerState {
  id: number;
  name: string;
  character: string;
  image: string;
  character_class: string;
  level: number;
  current_hp: number;
  total_hp: number;
  armor_class: number;
  speed: number;
  initiative_bonus: number;
  strength: number;
  strength_save: number;
  dexterity: number;
  dexterity_save: number;
  constitution: number;
  constitution_save: number;
  intelligence: number;
  intelligence_save: number;
  wisdom: number;
  wisdom_save: number;
  charisma: number;
  charisma_save: number;
  displayed: boolean;
  game_id: number;
  // The bonus fields will come from the backend
  strength_bonus?: number;
  dexterity_bonus?: number;
  constitution_bonus?: number;
  intelligence_bonus?: number;
  wisdom_bonus?: number;
  charisma_bonus?: number;
}

export type CreatePlayerState = Omit<PlayerState, 'id'>;

export interface PlayerInfoFormValues {
  name: string;
  character: string;
  character_class: string;
  image: string;
  level: string;
  current_hp: string;
  total_hp: string;
  armor_class: string;
  speed: string;
  initiative_bonus: string;
  game: string;
}

export interface PlayerStatsFormValues {
  strength: string;
  strength_save: string;
  dexterity: string;
  dexterity_save: string;
  constitution: string;
  constitution_save: string;
  intelligence: string;
  intelligence_save: string;
  wisdom: string;
  wisdom_save: string;
  charisma: string;
  charisma_save: string;
}

export interface PlayersState {
  players: PlayerState[];
  details: PlayerState[] | null;
  currentPlayer: PlayerState | null;
  playerInfo: PlayerInfoFormValues | null;
  playerStats: PlayerStatsFormValues | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Update the convertToPlayerState function to return CreatePlayerState
export const convertToPlayerState = (
  info: PlayerInfoFormValues,
  stats: PlayerStatsFormValues
): Omit<PlayerState, 'id'> => {
  return {
    name: info.name,
    character: info.character,
    character_class: info.character_class,
    image: info.image,
    level: parseInt(info.level) || 0,
    current_hp: parseInt(info.current_hp) || 0,
    total_hp: parseInt(info.total_hp) || 0,
    armor_class: parseInt(info.armor_class) || 0,
    speed: parseInt(info.speed) || 0,
    initiative_bonus: parseInt(info.initiative_bonus) || 0,
    game_id: parseInt(info.game),
    strength: parseInt(stats.strength) || 0,
    strength_save: parseInt(stats.strength_save) || 0,
    dexterity: parseInt(stats.dexterity) || 0,
    dexterity_save: parseInt(stats.dexterity_save) || 0,
    constitution: parseInt(stats.constitution) || 0,
    constitution_save: parseInt(stats.constitution_save) || 0,
    intelligence: parseInt(stats.intelligence) || 0,
    intelligence_save: parseInt(stats.intelligence_save) || 0,
    wisdom: parseInt(stats.wisdom) || 0,
    wisdom_save: parseInt(stats.wisdom_save) || 0,
    charisma: parseInt(stats.charisma) || 0,
    charisma_save: parseInt(stats.charisma_save) || 0,
    displayed: false
  };
};

export type UpdatePlayerData = Partial<Omit<PlayerState, 'id'>> & {
  displayed?: boolean;
};

const initialState: PlayersState = {
  players: [],
  details: null,
  currentPlayer: null,
  playerInfo: null,
  playerStats: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await playerService.getPlayers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch players');
    }
  }
);

export const fetchPlayerDetails = createAsyncThunk(
  'players/fetchPlayerDetails',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await playerService.getPlayer(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch player details');
    }
  }
);

export const createPlayer = createAsyncThunk(
  'player/createPlayer',
  async (playerData: CreatePlayerState) => {
    const response = await playerService.createPlayer(playerData);
    return response.data;
  }
);

export const updatePlayer = createAsyncThunk(
  'players/updatePlayer',
  async ({ id, playerData }: { id: number; playerData: UpdatePlayerData }, { rejectWithValue }) => {
    try {
      const response = await playerService.updatePlayer(id, playerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update player');
    }
  }
);

export const togglePlayerDisplay = createAsyncThunk(
  'players/toggleDisplay',
  async ({ id, displayed }: { id: number; displayed: boolean }, { rejectWithValue }) => {
    try {
      const response = await playerService.updatePlayer(id, { displayed });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to toggle player display');
    }
  }
);


export const updatePlayerHP = createAsyncThunk(
  'players/updatePlayerHP',
  async ({ id, current_hp }: { id: number; current_hp: number }, { rejectWithValue }) => {
    try {
      const response = await playerService.updatePlayerHP(id, current_hp);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update player HP');
    }
  }
);

export const deletePlayer = createAsyncThunk(
  'players/deletePlayer',
  async (id: number, { rejectWithValue }) => {
    try {
      await playerService.deletePlayer(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete player');
    }
  }
);

const playersSlice = createSlice({
  name: 'players',
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
    clearPlayerError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlayer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.players.push(action.payload);
        state.playerInfo = null;
        state.playerStats = null;
      })
      .addCase(createPlayer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchPlayerDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        console.log('Fetch Players Fulfilled - Payload:', action.payload);
        state.status = 'succeeded';
        state.players = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchPlayerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(togglePlayerDisplay.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(togglePlayerDisplay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.players.findIndex(player => player.id === action.payload.id);
        if (index !== -1) {
          state.players[index] = action.payload;
        }
      })
      .addCase(togglePlayerDisplay.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the player in the array
        const index = state.players.findIndex(player => player.id === action.payload.id);
        if (index !== -1) {
          state.players[index] = action.payload;
        }
        state.error = null;
      });
  },
});

export const { 
  setPlayerInfo,
  setPlayerStats,
  clearPlayerForms,
  clearPlayerError
} = playersSlice.actions;

// Selectors
export const selectAllPlayers = (state: { players: PlayersState }) => state.players.players;
export const selectPlayerInfo = (state: { players: PlayersState }) => state.players.playerInfo;
export const selectPlayerStats = (state: { players: PlayersState }) => state.players.playerStats;
export const selectPlayersStatus = (state: { players: PlayersState }) => state.players.status;
export const selectPlayersError = (state: { players: PlayersState }) => state.players.error;

export default playersSlice.reducer;