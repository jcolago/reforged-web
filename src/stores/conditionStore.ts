import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { conditionService } from '../api/service';

export interface Condition {
    id: number;
    name: string;
}

interface ConditionStore {
    conditions: Condition[];
    isLoading: boolean;
    error: string | null;
    availableConditions: Condition[];

    fetchConditions: () => Promise<void>;
    createCondition: (name: string) => Promise<Condition>;
    updateCondition: (id: number, data: Partial<Condition>) => Promise<void>;
    deleteCondition: (id: number) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export const useConditionStore = create<ConditionStore>() (
    devtools(
        immer((set, get) => ({
            //initial state
            conditions: [],
            isLoading: false,
            error: null,

            get availableConditions() {
                return get().conditions.filter(condition => condition.name != "None");
            },

            //actions
            fetchConditions: async () => {
                set ((state) => {
                    state.isLoading = true;
                    state.error = null;
                });

                try {
                    const response = await conditionService.getConditions();
                    set((state) => {
                        state.conditions = response.data;
                        state.isLoading = false;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.errors || 'Failed to fetch conditions';
                        state.isLoading = false;
                    });
                }
            },

            createCondition: async (name: string) => {
                set((state) => { state.isLoading = true; });

                try{
                    const response = await conditionService.createCondition({ name });
                    const newCondition = response.data;

                    set((state) => {
                        state.conditions.push(newCondition);
                        state.isLoading = false;
                        state.error = null;
                    });

                    return newCondition;
                } catch (error: any) {
                    set((state) => {
                        state.error = error.response?.data?.errors || 'Failed to creat condition';
                        state.isLoading = false;
                    });
                    throw error;
                }
            },
            
        }))
    )
)