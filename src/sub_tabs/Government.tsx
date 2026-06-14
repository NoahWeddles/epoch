import { changeValue, useGameStore } from "../context/GameContext";

export function change_population(delta: number) {
    changeValue("population", Math.ceil(delta))
}

export default function Government(){

    const {soldiers, farmers, foragers, homes, population} = useGameStore(s=>s);

    return(
        <div className="flex flex-col items-start justify-start p-2 gap-4">

            <div className="flex">
                <p className="italic text-main0">Government</p>
            </div>

            <hr className="border-main0 w-full" />

            <p className="population">Population: {population}</p>
            <div className="border-2 border-hr w-full h-2.3">
                <hr className="population-progress border-3 border-emerald-600 w-0" />
            </div>
            <div className="flex flex-col items-start justify-start gap-4 w-full">
                <div className="relative inline-block group w-full">
                    <button className="p-2 bg-main2 hover:brightness-120 w-1/2 rounded-lg">
                        <p className="make-home">Make Home</p>
                    </button>
                    <div
                        className="absolute top-full z-10 left-1/2 mt-2
                                                                                    invisible opacity-0 group-hover:visible group-hover:opacity-100
                                                                                    transition-opacity duration-200
                                                                                    p-2 text-sm max-w-150 min-w-50 min-h-0 border-2 bg-main2">
                        costs 150 wood and 100 stone. Increases population cap by 5.
                    </div>
                </div>
                <p className="homes">Homes: {homes}</p>
                <div className="basic_military_unlocked flex gap-4">
                    <p className="soldiers">Soldiers: {soldiers}</p>
                    <button className="add-soldier button">+</button>
                    <button className="remove-soldier button">-</button>
                </div>

                <div className="agriculture_unlocked flex gap-4">
                    <p className="farmers">Farmers: {farmers}</p>
                    <button className="add-farmer button">
                        <span className="hover:scale-150">+</span>
                    </button>
                    <button className="remove-farmer button">-</button>
                </div>

                <div className="flex gap-4">
                    <p className="foragers">Foragers: {foragers}</p>
                    <button className="add-forager button">
                        <span className="hover:scale-150">+</span>
                    </button>
                    <button className="remove-forager button">-</button>
                </div>
            </div>
        </div>
    );
}