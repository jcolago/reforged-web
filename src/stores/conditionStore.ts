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