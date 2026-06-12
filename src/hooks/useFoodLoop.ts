import { useEffect, useRef } from "react";
import { useGameStore } from "../context/GameContext";

const TICK_MS = 10;
const FOOD_DEPLETION_RATE = 0.0001;
const POPULATION_FACTOR = 1;

export function useFoodLoop(onTick: (progress: number) => void) {
    const timer = useRef(0);

    useEffect(() => {
        const id = setInterval(() => {
            timer.current += FOOD_DEPLETION_RATE;
            onTick(timer.current);

            if (timer.current >= 1) {
                timer.current = 0;
                const { food, population } = useGameStore.getState();
                const depletion = population * POPULATION_FACTOR;

                if (food - depletion >= 0) {
                    useGameStore.setState({ food: food - depletion });
                } else {
                    useGameStore.setState({ population: Math.max(0, population - 1) });
                }
            }
        }, TICK_MS);

        return () => clearInterval(id);
    }, [onTick]);
}