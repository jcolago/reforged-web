import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { monsterService } from '../api/service';

// Monster size enum type
export enum MonsterSize {
    Tiny = "tiny",
    Small = "small",
    Medium = "medium",
    Large = "large",
    Huge = "huge",
    Gargantuan = "gargantuan"
}

// Monster alignment enum type
export enum MonsterAlignment{
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

//Interfaces
export interface MonsterState{
    id: number;
    name: string;
    armor_class: number;
    hit_points: number;
    speed: number;
    p_bonus: number;
    resistances: string;
    size: MonsterSize;
    alignment: MonsterAlignment;
    game_id: number;
}

interface MonsterStore{
    //state
    monsters: MonsterStore[];
    currentMonster: MonsterState | null;
    isLoading: boolean;
    error: string | null;
    displayedMonsters: MonsterState[];

    //actions
    fetchMonsters: () => Promise<void>;
    addMonster: (monsterData: Omit<MonsterState, 'id'>) => Promise<MonsterState>;
    updateMonster: (id: number, monsterData: Partial<MonsterState>) => Promise<void>;
    removeMonster: (id: number) => Promise<void>;
    toggleMonsterDisplay: (id: number) => void;
    setCurrentMonster: (monster: MonsterState | null) => void;
    clearError: () => void;
    reset: () => void;
}