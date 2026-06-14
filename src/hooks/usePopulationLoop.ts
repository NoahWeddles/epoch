import { useEffect, useRef } from "react";
import { changeValue, useGameStore } from "../context/GameContext"
import { change_population } from "../sub_tabs/Government";



const TICK_MS = 10;

export function usePopulationLoop(onTick: (progress: number) => void) {
    const timer = useRef(0);

    useEffect(() => {
        const id = setInterval(() => {
            timer.current += 0.0001;
            onTick(timer.current);

            if (timer.current >= 1) {
                timer.current = 0;
                change_population(useGameStore().population*0.1)
            }
        }, TICK_MS);

        return () => clearInterval(id);
    }, [onTick]);
}