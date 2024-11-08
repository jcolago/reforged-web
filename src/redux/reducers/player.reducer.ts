import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Type for a single player
interface PlayerState {
  id: number
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

// State interface for the reducer
interface PlayersState {
  players: PlayerState[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPlayer: PlayerState | null;
}

const initialState: PlayersState = {
  players: [],
  status: 'idle',
  error: null,
  currentPlayer: null,
};

// Async thunks for API communication
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async () => {
    const response = await axios.get('/api/v1/players');
    return response.data;
  }
);

export const createPlayer = createAsyncThunk(
  'players/createPlayer',
  async (playerData: Omit<PlayerState, 'id'>) => {
    const response = await axios.post('/api/v1/players', { player: playerData });
    return response.data;
  }
);

export const updatePlayer = createAsyncThunk(
  'players/updatePlayer',
  async ({ id, playerData }: { id: number; playerData: Partial<PlayerState> }) => {
    const response = await axios.patch(`/api/v1/players/${id}`, { player: playerData });
    return response.data;
  }
);

export const updatePlayerHP = createAsyncThunk(
  'players/updatePlayerHP',
  async ({ id, current_hp }: { id: number; current_hp: number }) => {
    const response = await axios.patch(`/api/v1/players/${id}/update_hp`, { current_hp });
    return response.data;
  }
);

export const deletePlayer = createAsyncThunk(
  'players/deletePlayer',
  async (id: number) => {
    await axios.delete(`/api/v1/players/${id}`);
    return id;
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setCurrentPlayer: (state, action: PayloadAction<PlayerState>) => {
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
        state.error = action.error.message || 'Failed to fetch players';
      })
      // Create Player
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.players.push(action.payload);
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