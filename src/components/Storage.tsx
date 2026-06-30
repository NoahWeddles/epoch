import { useCallback, useRef } from "react";
import { changeValue, useGameStore } from "../context/GameContext";
import { useFoodLoop } from "../hooks/useFoodLoop";

export default function Storage(){
    const progressRef = useRef<HTMLHRElement>(null);

    const handleTick = useCallback((progress: number)=>{
        if (progressRef.current){
            progressRef.current.style.width = `${progress * 100}%`
        }
    }, [])

    useFoodLoop(handleTick)

    const { food, ore, wood, stone, research_points } = useGameStore();

    return(
        <div className="w-full h-full max-w-xs flex-col p-5 justify-start rounded-2xl items-start gap-4">
            <div className="flex">
                <p className="p-2">Storage</p>
            </div>
            <hr className="mt-2" />
            <div className="flex flex-col gap-4 justify-start items-start max-w-3xs w-full pt-5 pr-0 h-full overflow-hidden">
                <div className="p-2 rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:10%] w-full">
                    <span className="food">Food: {food}</span>
                    <div className="border-2 border-hr w-full h-2.3">
                        <hr ref={progressRef} className="food-depletion-progress border-3 border-orange-700 w-0" />
                    </div>
                </div>

                <span
                    className="ore metal_working_unlocked p-2 rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:10%] w-full">Ore:
                    {ore}</span>

                <span className="wood p-2 rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:10%] w-full">Wood: {wood}</span>

                <span className="stone p-2 rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:10%] w-full">Stone: {stone}</span>

                <span className="research-points p-2 rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:10%] w-full">Research:
                    {research_points}</span>
                <button onClick={() => changeValue('research_points', 50)} className="give-research p-2 min-w-0 bg-main2 hover:brightness-120 rounded-lg">Give Research</button>
            </div>
        </div>
    )
}