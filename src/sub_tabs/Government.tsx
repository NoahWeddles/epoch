import { useCallback, useRef } from "react";
import { useGameStore } from "../context/GameContext";
import { usePopulationLoop } from "../hooks/usePopulationLoop";
import { HOME_COST } from "../lib/constants";

function addWorker(type: 'soldiers' | 'farmers' | 'foragers') {
    useGameStore.setState(s => {
        if (s.soldiers + s.farmers + s.foragers >= s.population) return s;
        return { [type]: s[type] + 1 };
    });
}

function removeWorker(type: 'soldiers' | 'farmers' | 'foragers') {
    useGameStore.setState(s => {
        if (s[type] <= 0) return s;
        return { [type]: s[type] - 1 };
    });
}

function makeHome() {
    useGameStore.setState(s => {
        if (s.wood >= HOME_COST.wood && s.stone >= HOME_COST.stone) {
            return { homes: s.homes + 1, wood: s.wood - HOME_COST.wood, stone: s.stone - HOME_COST.stone };
        }
        return s;
    });
}

export default function Government() {
    const progressRef = useRef<HTMLHRElement>(null);

    const handleTick = useCallback((progress: number) => {
        if (progressRef.current) {
            progressRef.current.style.width = `${progress * 100}%`
        }
    }, [])

    usePopulationLoop(handleTick)

    const { soldiers, farmers, foragers, homes, population } = useGameStore(s => s);

    return (
        <div className="flex flex-col items-start justify-start p-2 gap-4">
            <div className="flex">
                <p className="italic text-main0">Government</p>
            </div>

            <hr className="border-main0 w-full" />

            <p>Population: {population}</p>
            <div className="border-2 border-hr w-full h-2.3">
                <hr ref={progressRef} className="border-3 border-emerald-600 w-0" />
            </div>
            <div className="flex flex-col items-start justify-start gap-4 w-full">
                <div className="relative inline-block group w-full">
                    <button onClick={makeHome} className="p-2 bg-main2 hover:brightness-120 w-1/2 rounded-lg">
                        <p>Make Home</p>
                    </button>
                    <div className="absolute top-full z-10 left-1/2 mt-2
                                    invisible opacity-0 group-hover:visible group-hover:opacity-100
                                    transition-opacity duration-200
                                    p-2 text-sm max-w-150 min-w-50 min-h-0 border-2 bg-main2">
                        costs {HOME_COST.wood} wood and {HOME_COST.stone} stone. Increases population cap by 5.
                    </div>
                </div>
                <p>Homes: {homes}</p>
                <div className="basic_military_unlocked flex gap-4 items-center">
                    <p>Soldiers: {soldiers}</p>
                    <button onClick={() => addWorker('soldiers')} className="button p-1 px-2 bg-main2 hover:brightness-120 rounded">+</button>
                    <button onClick={() => removeWorker('soldiers')} className="button p-1 px-2 bg-main2 hover:brightness-120 rounded">-</button>
                </div>

                <div className="agriculture_unlocked flex gap-4 items-center">
                    <p>Farmers: {farmers}</p>
                    <button onClick={() => addWorker('farmers')} className="button p-1 px-2 bg-main2 hover:brightness-120 rounded">+</button>
                    <button onClick={() => removeWorker('farmers')} className="button p-1 px-2 bg-main2 hover:brightness-120 rounded">-</button>
                </div>

                <div className="flex gap-4 items-center">
                    <p>Foragers: {foragers}</p>
                    <button onClick={() => addWorker('foragers')} className="button p-1 px-2 bg-main2 hover:brightness-120 rounded">+</button>
                    <button onClick={() => removeWorker('foragers')} className="button p-1 px-2 bg-main2 hover:brightness-120 rounded">-</button>
                </div>
            </div>
        </div>
    );
}
