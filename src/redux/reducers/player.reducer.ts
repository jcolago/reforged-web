/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { playerService } from '../../api/service';

export interface PlayerState {
  id: number;
  name: string;
  character: string;
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

export interface PlayersState {
  players: PlayerState[];
  currentPlayer: PlayerState | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  currentPlayer: null,
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

export const createPlayer = createAsyncThunk(
  'players/createPlayer',
  async (playerData: Omit<PlayerState, 'id'>, { rejectWithValue }) => {
    try {
      const response = await playerService.createPlayer(playerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create player');
    }
  }
);

export const updatePlayer = createAsyncThunk(
  'players/updatePlayer',
  async ({ id, playerData }: { id: number; playerData: Partial<PlayerState> }, { rejectWithValue }) => {
    try {
      const response = await playerService.updatePlayer(id, playerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update player');
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
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    clearCurrentPlayer: (state) => {
      state.currentPlayer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Players
      .addCase(fetchPlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Create Player
      .addCase(createPlayer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.players.push(action.payload);
      })
      .addCase(createPlayer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update Player
      .addCase(updatePlayer.fulfilled, (state, action) => {
        const index = state.players.findIndex(player => player.id === action.payload.id);
        if (index !== -1) {
          state.players[index] = action.payload;
        }
        if (state.currentPlayer?.id === action.payload.id) {
          state.currentPlayer = action.payload;
        }
      })
      // Update Player HP
      .addCase(updatePlayerHP.fulfilled, (state, action) => {
        const index = state.players.findIndex(player => player.id === action.payload.id);
        if (index !== -1) {
          state.players[index] = action.payload;
        }
        if (state.currentPlayer?.id === action.payload.id) {
          state.currentPlayer = action.payload;
        }
      })
      // Delete Player
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.players = state.players.filter(player => player.id !== action.payload);
        if (state.currentPlayer?.id === action.payload) {
          state.currentPlayer = null;
        }
      });
  },
});

export const { setCurrentPlayer, clearCurrentPlayer } = playersSlice.actions;

// Selectors
export const selectAllPlayers = (state: { players: PlayersState }) => state.players.players;
export const selectPlayerById = (state: { players: PlayersState }, playerId: number) =>
  state.players.players.find(player => player.id === playerId);
export const selectCurrentPlayer = (state: { players: PlayersState }) => state.players.currentPlayer;
export const selectPlayersStatus = (state: { players: PlayersState }) => state.players.status;
export const selectPlayersError = (state: { players: PlayersState }) => state.players.error;

export default playersSlice.reducer;