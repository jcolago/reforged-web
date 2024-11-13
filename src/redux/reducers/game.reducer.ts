/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gameService } from '../../api/service';

// Types
export interface Game {
  id: number;
  name: string;
  dm_id: number;
  monsters?: Monster[];
}

export interface Monster {
  id: number;
  name: string;
  game_id: number;
}

export interface GameCreate {
  name: string;
  dm_id: number;
}

export interface ValidationErrors {
  name?: string[];
  dm_id?: string[];
  base?: string[];
  [key: string]: string[] | undefined;
}

export interface GamesState {
  games: Game[];
  currentGame: Game | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: ValidationErrors | string | null;
}

const initialState: GamesState = {
  games: [],
  currentGame: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gameService.getGames();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to fetch games');
    }
  }
);

export const fetchGame = createAsyncThunk(
  'games/fetchGame',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await gameService.getGame(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to fetch game');
    }
  }
);

export const createGame = createAsyncThunk(
  'games/createGame',
  async (gameData: GameCreate, { rejectWithValue }) => {
    try {
      const response = await gameService.createGame(gameData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to create game');
    }
  }
);

export const updateGame = createAsyncThunk(
  'games/updateGame',
  async ({ id, gameData }: { id: number; gameData: Partial<GameCreate> }, { rejectWithValue }) => {
    try {
      const response = await gameService.updateGame(id, gameData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to update game');
    }
  }
);

export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (id: number, { rejectWithValue }) => {
    try {
      await gameService.deleteGame(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Failed to delete game');
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setCurrentGame(state, action) {
      state.currentGame = action.payload;
    },
    clearGameErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Games
      .addCase(fetchGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = action.payload;
        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors | string;
      })
      // Fetch Single Game
      .addCase(fetchGame.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentGame = action.payload;
        const index = state.games.findIndex(game => game.id === action.payload.id);
        if (index !== -1) {
          state.games[index] = action.payload;
        } else {
          state.games.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors | string;
      })
      // Create Game
      .addCase(createGame.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games.push(action.payload);
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors;
      })
      // Update Game
      .addCase(updateGame.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.games.findIndex(game => game.id === action.payload.id);
        if (index !== -1) {
          state.games[index] = action.payload;
        }
        if (state.currentGame?.id === action.payload.id) {
          state.currentGame = action.payload;
        }
        state.error = null;
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors;
      })
      // Delete Game
      .addCase(deleteGame.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.games = state.games.filter(game => game.id !== action.payload);
        if (state.currentGame?.id === action.payload) {
          state.currentGame = null;
        }
        state.error = null;
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as ValidationErrors;
      });
  },
});

export const { setCurrentGame, clearGameErrors } = gamesSlice.actions;

// Selectors
export const selectAllGames = (state: { games: GamesState }) => 
  state.games.games;

export const selectGameById = (state: { games: GamesState }, gameId: number) =>
  state.games.games.find(game => game.id === gameId);

export const selectCurrentGame = (state: { games: GamesState }) =>
  state.games.currentGame;

export const selectGamesByDmId = (state: { games: GamesState }, dmId: number) =>
  state.games.games.filter(game => game.dm_id === dmId);

export const selectGamesStatus = (state: { games: GamesState }) =>
  state.games.status;

export const selectGamesError = (state: { games: GamesState }) =>
  state.games.error;

export default gamesSlice.reducer;