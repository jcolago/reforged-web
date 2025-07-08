import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { gameService } from "../api/service";

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

interface GameCreate {
    name: string;
    dm_id: number;
}

interface GameStore{
    //state
    games: Game[];
    currentGame: Game | null;
    isLoading: boolean;
    error: string | null;

    //actions
    fetchGames: () => Promise<void>;
    fetchGame: (id: number) => Promise<void>;
    createGame: (gameData: GameCreate) => Promise<Game>;
    updateGame: (id: number, gameData: Partial<GameCreate>) => Promise<void>;
    deleteGame: (id: number) => Promise<void>;
    setCurrentGame: (game: Game | null) => void;
    clearError: () => void;
    reset: () => void;
}

export const useGameStore = create<GameStore>()(
    devtools(
        immer((set, get) => ({
            //initial state
            games: [],
            currentGame: null,
            isLoading: false,
            error: null,

            //actions
            fetchGames: async () => {
                set((state) => {
                    state.isLoading = true,
                    state.error = null;
                });

                try {
                    const response = await gameService.getGames();
                    set((state) => {
                        state.games = response.date;
                        state.isLoading = false;
                    })
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.errors || 'Failed to fetch games.'
                        state.isLoading = false;
                    });
                };
            },
            
        }))
    )
)