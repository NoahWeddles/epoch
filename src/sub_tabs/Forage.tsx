import { useGameStore } from "../context/GameContext"
import { playAudio } from "../lib/audio";

export default function Forage(){
    const foragers = useGameStore(s=>s.foragers)
    return (
        <>
            <div className="flex flex-col items-start justify-start p-2 gap-4">

                <div className="flex">
                    <p className="italic text-main0">Foraging</p>
                </div>

                <hr className="border-main0 w-full"/>

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

function forage(){

}