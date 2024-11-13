import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Types
interface Game {
  id: number;
  name: string;
  dm_id: number;
  monsters?: Monster[];
}

interface Monster {
  id: number;
  name: string;
  game_id: number;
}

interface GameCreate {
  name: string;
  dm_id: number;
}

interface ValidationErrors {
  name?: string[];
  dm_id?: string[];
  base?: string[];
  [key: string]: string[] | undefined;
}

interface GamesState {
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
export const fetchGames = createAsyncThunk<
  Game[],
  void,
  { rejectValue: ValidationErrors }
>('games/fetchGames', async () => {
  const response = await axios.get('/api/v1/games', {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });
  return response.data;
});

export const fetchGame = createAsyncThunk<
  Game,
  number,
  { rejectValue: ValidationErrors }
>('games/fetchGame', async (id) => {
  const response = await axios.get(`/api/v1/games/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });
  return response.data;
});

export const createGame = createAsyncThunk<
  Game,
  GameCreate,
  { rejectValue: ValidationErrors }
>('games/createGame', async (gameData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/v1/games', { 
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        },
        game: gameData });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ errors: ValidationErrors }>;
    if (error.response?.data?.errors) {
      return rejectWithValue(error.response.data.errors);
    }
    return rejectWithValue({ base: ['An unexpected error occurred'] });
  }
});

export const updateGame = createAsyncThunk<
  Game,
  { id: number; gameData: Partial<GameCreate> },
  { rejectValue: ValidationErrors }
>('games/updateGame', async ({ id, gameData }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/api/v1/games/${id}`, { 
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        },
        game: gameData });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ errors: ValidationErrors }>;
    if (error.response?.data?.errors) {
      return rejectWithValue(error.response.data.errors);
    }
    return rejectWithValue({ base: ['An unexpected error occurred'] });
  }
});

export const deleteGame = createAsyncThunk<
  number,
  number,
  { rejectValue: ValidationErrors }
>('games/deleteGame', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/v1/games/${id}`, {
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

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setCurrentGame(state, action: PayloadAction<Game | null>) {
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
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch games';
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
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch game';
      })
      // Create Game
      .addCase(createGame.fulfilled, (state, action) => {
        state.games.push(action.payload);
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { base: ['Failed to create game'] };
      })
      // Update Game
      .addCase(updateGame.fulfilled, (state, action) => {
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
        state.error = action.payload || { base: ['Failed to update game'] };
      })
      // Delete Game
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.games = state.games.filter(game => game.id !== action.payload);
        if (state.currentGame?.id === action.payload) {
          state.currentGame = null;
        }
        state.error = null;
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { base: ['Failed to delete game'] };
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