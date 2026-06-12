import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateCivilizationName } from "../lib/names";
import { CivilizationType } from "../lib/civilization_types";

export interface GameState {
    civilization_name: string;
    population: number;
    homes: number;
    farmers: number;
    soldiers: number;
    foragers: number;
    farms: number;
    food: number;
    wood: number;
    stone: number;
    ore: number;
    research_points: number;
}

export const useGameStore = create<GameState>()(
    persist(
        () => ({
            civilization_name: generateCivilizationName(CivilizationType.Agriculture),
            population: 5,
            homes: 5,
            farmers: 0,
            soldiers: 0,
            foragers: 0,
            farms: 0,
            food: 25,
            wood: 0,
            stone: 0,
            ore: 0,
            research_points: 50,
        }),
        { name: "playerData" }
    )
);

export function changeValue(key: keyof GameState, change: number){
    useGameStore.setState((state) => ({ [key]: (state[key] as number) + change }));
}

export function setValue(key: keyof GameState, value: any) {
    useGameStore.setState({ [key]: value });
}

// export const useResearchStore = create<GameState>()(
//     persist(
//         () => ({
            
//         }),
//         { name: "research" }
//     )
// );