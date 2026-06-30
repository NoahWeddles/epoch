import { useCallback, useRef } from "react";
import { useGameStore } from "../context/GameContext"
import { forage, useForageLoop } from "../hooks/useForageLoop";

export default function Forage() {
    const progressRef = useRef<HTMLHRElement>(null);

    const handleTick = useCallback((progress: number) => {
        if (progressRef.current) {
            progressRef.current.style.width = `${progress * 100}%`
        }
    }, [])

    useForageLoop(handleTick)

    const foragers = useGameStore(s => s.foragers)

    return (
        <div className="flex flex-col items-start justify-start p-2 gap-4">
            <p className="italic text-main0">Foraging</p>
            <hr className="border-main0 w-full" />
            <p>Foragers: {foragers}</p>
            <hr ref={progressRef} className="border-3 border-emerald-600 w-0 rounded-full" />
            <button onClick={forage} className="p-2 bg-main2 hover:brightness-120 rounded-lg">
                Forage
            </button>
        </div>
    )
}
