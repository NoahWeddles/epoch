import { useCallback, useRef } from "react";
import { useGameStore } from "../context/GameContext";
import { useHarvestLoop } from "../hooks/useHarvestLoop";
import { FARM_COST, FOOD_PER_GATHER, HOME_COST } from "../lib/constants";

export default function Farms(){
    const progressRef = useRef<HTMLHRElement>(null);

    const handleTick = useCallback((progress: number)=>{
        if (progressRef.current){
            progressRef.current.style.width = `${progress * 100}%`
        }
    }, [])

    useHarvestLoop(handleTick)

    const farmers = useGameStore(s=>s.farmers)
    const farms = useGameStore(s => s.farms)
    return (
        <>
            <div className="flex flex-col items-start justify-start gap-4 p-2 h-full">

                <div className="flex w-full">
                    <p className="italic text-main0">Farms</p>
                </div>

                <hr className="border-main0 w-full"/>
                <div className="flex w-full">
                    <div className="w-full h-full flex flex-col gap-5">
                        <div className="relative inline-block group">
                            <button onClick={() => { gatherFood() }} className="p-2 bg-main2 hover:brightness-120 rounded-lg">
                                <p className="gather-food">Gather Food</p>
                            </button>
                            <div
                                className="absolute top-full z-10 left-1/2 mt-2
                                                                                        invisible opacity-0 group-hover:visible group-hover:opacity-100
                                                                                        transition-opacity duration-200
                                                                                        p-2 text-sm max-w-150 min-w-50 min-h-0 border-2 bg-main2">
                                gather 10 food
                            </div>
                        </div>
                        <div className="agriculture_unlocked relative inline-block group">
                            <button onClick={() => { makeFarm() }} className="p-2 bg-main2 hover:brightness-120 rounded-lg">
                                <p className="make-farm">Make Farm</p>
                            </button>

                            <div className="absolute top-full z-10 left-1/2 mt-2
                                                                invisible opacity-0 group-hover:visible group-hover:opacity-100
                                                                transition-opacity duration-200
                                                                p-2 text-sm max-w-150 min-w-50 min-h-0 border-2 bg-main2">
                                costs {HOME_COST.wood} wood and {HOME_COST.stone} stone.
                            </div>
                        </div>


                    <hr ref={progressRef} className="harvest-progress agriculture_unlocked border-emerald-600 w-0 rounded-full"/>
                    </div>
                    <div className="w-full h-full flex flex-col gap-4">
                        <div className="agriculture_unlocked flex gap-4 p-2 rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:10%] w-1/3">
                            <p className="farmers">Farmers: {farmers}</p>
                        </div>
                        <div className="agriculture_unlocked flex gap-4 p-2 rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:10%] w-1/3">
                            <p className="farms">Farms: {farms}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function gatherFood(){
    useGameStore.setState((s) => {
        s.food += FOOD_PER_GATHER
        return s;
    });
}


function makeFarm() {
    useGameStore.setState((s) => {
        if (s.wood >= FARM_COST.wood && s.stone >= FARM_COST.stone) {
            return {
                farms: s.farms + 1,
                wood: s.wood - FARM_COST.wood,
                stone: s.stone - FARM_COST.stone,
            };
        }
        return s;
    });
}