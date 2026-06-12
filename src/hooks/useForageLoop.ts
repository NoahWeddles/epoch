import { useEffect, useRef } from "react";
import { useGameStore } from "../context/GameContext";
import type { GameState } from "../context/GameContext";
import { unlocked_technologies } from "../lib/research"

const TICK_MS = 10;
const FORAGE_RATE = 1;

interface Forageable {
    chance: number;
    min: number;
    max: number;
    requiresTech?: string;
}

const forageables: Record<string, Forageable> = {
    "ore": {
        chance: 0.05,
        min: 1,
        max: 3,
    },
    "wood": {
        chance: 1,
        min: 5,
        max: 10
    },
    "stone": {
        chance: 1,
        min: 5,
        max: 10,
    }
}

function forage() {
    const keys = Object.keys(forageables) as Array<keyof GameState>
    keys.forEach((key) => {
        const forageable = forageables[key]


        if (String(key) == "ore" && !unlocked_technologies["metal_working"]) return;

        if (Math.random() < forageable.chance) {
            useGameStore.setState((state) => ({ [key]: (state[key] as number) + Math.floor(Math.random() * (forageable.max - forageable.min + 1) + forageable.min) }));
        }
    })
}

export function useForageLoop(onTick: (progress: number) => void) {
    const timer = useRef(0);

    useEffect(() => {
        const id = setInterval(() => {
            const { foragers } = useGameStore.getState();
            timer.current += 0.0001 * foragers * FORAGE_RATE;
            onTick(timer.current);

            if (timer.current >= 1) {
                timer.current = 0;
                forage();
            }
        }, TICK_MS);

        return () => clearInterval(id);
    }, [onTick]);
}

export { forage };