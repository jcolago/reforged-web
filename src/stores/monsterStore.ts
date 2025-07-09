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
    attacks: string;
    displayed: boolean;
    size: MonsterSize;
    alignment: MonsterAlignment;
    game_id: number;
}

interface MonsterStore{
    //state
    monsters: MonsterState[];
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

export const useMonsterStore = create<MonsterStore>()(
    devtools(
        immer((set, get) => ({
            monsters: [],
            currentMonster: null,
            isLoading: false,
            error: null,

            get displayedMonsters() {
                return get().monsters.filter(monster => monster.displayed);
            },

            fetchMonsters: async () => {
                set((state) => {
                    state.isLoading = true;
                    state.error = null;
                });

                try {
                    const response = await monsterService.getMonsters();
                    set((state) => {
                        state.monsters = response.data;
                        state.isLoading = false;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.error || 'Failed to fetch monsters';
                        state.isLoading = false;
                    });
                }
            },

            addMonster: async (monsterData) => {
                set((state) => {state.isLoading = true; })

                try{
                    const response = await monsterService.addMonster(monsterData);
                    const newMonster = response.data;

                    set((state) => {
                        state.monsters.push(newMonster);
                        state.isLoading = false;
                        state.error = null;
                    });

                    return newMonster;
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.error || 'Failed to add monster';
                        state.isLoading = false;
                    });
                    throw error;
                }
            },

            
        }))
    )
)