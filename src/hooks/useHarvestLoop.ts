import { useEffect, useRef } from "react";
import { useGameStore } from "../context/GameContext";

const TICK_MS = 10;
const HARVEST_RATE = 1 / 1500;
const FOOD_PER_SET = 5;

export function useHarvestLoop(onTick: (progress: number) => void) {
    const timer = useRef(0);

    useEffect(() => {
        const id = setInterval(() => {
            const { farmers, farms } = useGameStore.getState();
            const active_pairs = Math.min(farmers, farms);

            if (active_pairs > 0) {
                timer.current += active_pairs * (1 / 10) * HARVEST_RATE;
                timer.current += active_pairs * HARVEST_RATE;
            }

            onTick(timer.current);

            if (timer.current >= 1) {
                timer.current = 0;
                const { food } = useGameStore.getState();
                useGameStore.setState({ food: food + active_pairs * FOOD_PER_SET });
            }
        }, TICK_MS);

        return () => clearInterval(id);
    }, [onTick]);
}