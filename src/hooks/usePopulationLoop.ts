import { useEffect, useRef } from "react";
import { changeValue, useGameStore } from "../context/GameContext";
import { PEOPLE_PER_HOME } from "../lib/constants";

const TICK_MS = 10;

export function usePopulationLoop(onTick: (progress: number) => void) {
    const timer = useRef(0);

    useEffect(() => {
        const id = setInterval(() => {
            const { population } = useGameStore.getState();
            timer.current += 0.0001 * population;
            onTick(timer.current);

            if (timer.current >= 1) {
                timer.current = 0;
                const { population, homes } = useGameStore.getState();
                const cap = homes * PEOPLE_PER_HOME;
                if (population < cap) {
                    changeValue("population", Math.ceil(population * 0.1));
                }
            }
        }, TICK_MS);

        return () => clearInterval(id);
    }, [onTick]);
}
