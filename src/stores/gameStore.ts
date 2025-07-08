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