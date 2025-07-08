import { create } from "zustand";
import { devtools} from "zustand/middleware";
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
    fetchGames: (userId: number) => Promise<void>;
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
            fetchGames: async (userId: number) => {
                set((state) => {
                    state.isLoading = true,
                    state.error = null;
                });

                try {
                    const response = await gameService.getGames(userId);
                    set((state) => {
                        state.games = response.data;
                        state.isLoading = false;
                    })
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.errors || 'Failed to fetch games.'
                        state.isLoading = false;
                    });
                };
            },

            fetchGame: async (id: number) => {
                set((state) => { state.isLoading = true; });

                try{
                    const response = await gameService.getGame(id);
                    const game = response.data;

                    set((state) => {
                        state.currentGame = game;
                        
                        const index = state.games.findIndex(g => g.id === id);
                        if (index != -1) {
                            state.games[index] = game;
                        } else {
                            state.games.push(game);
                        }
                        state.isLoading = false;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data.errors || 'Failed to fetch game';
                        state.isLoading = false;
                    });
                }
            },

            createGame: async (gameData: GameCreate) => {
                set((state) => { state.isLoading = true; });

                try{
                    const response = await gameService.createGame(gameData);
                    const newGame = response.data;

                    set((state) => {
                        state.games.push(newGame);
                        state.currentGame = newGame;
                        state.isLoading = false;
                        state.error = null;
                    });

                    return newGame;
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.errors || 'Failed to create game';
                        state.isLoading = false;
                    });
                    throw error;
                }
            },

            updateGame: async (id: number, gameData: Partial<GameCreate>) => {
                set((state) => { state.isLoading = true; })

                try{
                    const response = await gameService.updateGame(id, gameData);
                    const updatedGame = response.data;

                    set((state) => {
                        const index = state.games.findIndex(g => g.id === id);
                        if (index != -1){
                            state.games[index] = updatedGame;
                        }
                        if (state.currentGame?.id === id){
                            state.currentGame = updatedGame;
                        }
                        state.isLoading = false;
                        state.error = null;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.errors || 'Failed to update game';
                        state.isLoading = false;
                    });
                    throw error;
                }
            },

            deleteGame: async (id: number) => {
                set((state) => { state.isLoading = true; })
                
                try{
                    await gameService.deleteGame(id);

                    set((state) => {
                        state.games = state.games.filter(g => g.id != id);
                        if (state.currentGame?.id === id){
                            state.currentGame = null;
                        }
                        state.isLoading = false;
                        state.error = null;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.errors || 'Failed to delete game';
                        state.isLoading = false;
                    });
                    throw error;
                }
            },

            setCurrentGame: (game) => set((state) => { state.currentGame = game; }),

            clearError: () => set((state) => { state.error = null; }),

            reset: () => set((state) => {
                state.games = [];
                state.currentGame = null;
                state.isLoading = false;
                state.error = null;
            }),
        })),
        {name: 'game-store'}
    )
);

export const useGames = () => useGameStore((state) => state.games);
export const useCurrentGame = () => useGameStore((state) => state.currentGame);
export const useGameByDm = (dmId: number) => useGameStore((state) => state.games.filter(game => game.dm_id === dmId));
export const useGameById = (id: number) => useGameStore((state) => state.games.find(game => game.id ===id));