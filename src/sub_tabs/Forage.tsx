import { useCallback, useRef } from "react";
import { useGameStore } from "../context/GameContext"
import { forage, useForageLoop } from "../hooks/useForageLoop";
import { playAudio } from "../lib/audio";

export default function Forage(){
    const progressRef = useRef<HTMLHRElement>(null);

    const handleTick = useCallback((progress: number)=>{
        if (progressRef.current){
            progressRef.current.style.width = `${progress * 100}%`
        }
    }, [])

    useForageLoop(handleTick)

    const foragers = useGameStore(s=>s.foragers)

    return (
        <>
            <div className="flex flex-col items-start justify-start p-2 gap-4">

                <div className="flex">
                    <p className="italic text-main0">Foraging</p>
                </div>

                <hr ref={progressRef} className="border-main0 w-full"/>

                <div className="contents">
                    <p className="foragers">Foragers: {foragers}</p>
                    <hr className="forage-progress border-emerald-600 w-0 rounded-full"/>
                </div>
                <button onClick={()=>{forage()}} className="forage-button p-2 bg-main2 hover:brightness-120 rounded-lg">
                    <p className="">Forage</p>
                </button>
            </div>
        </>
    )
}