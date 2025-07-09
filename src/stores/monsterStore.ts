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