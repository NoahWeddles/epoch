import { useEffect, useRef } from "react";
import { changeValue, setValue, useGameStore } from "../context/GameContext";

const TICK_MS = 10;
const FOOD_DEPLETION_RATE = 0.005;

export function useFoodLoop(onTick: (progress: number) => void) {
    const timer = useRef(0);

    useEffect(() => {
        const id = setInterval(() => {
            timer.current += FOOD_DEPLETION_RATE;
            onTick(timer.current);

            if (timer.current >= 1) {
                timer.current = 0;
                const { food, population } = useGameStore.getState();
                const depletion = 1;

                if (food - depletion >= 0) {
                    changeValue("food", -depletion);
                    console.log(`Depleted ${depletion} food, {food: ${food - depletion}}`);
                } else {
                    setValue("population", Math.max(0, Math.max(population-1, Math.floor( population - (population * 0.1) ))));
                }
            }
        }, TICK_MS);

        return () => clearInterval(id);
    }, [onTick]);
}