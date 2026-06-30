import { useConquestStore } from '../lib/conquest'

export default function Plan() {
    const civs = useConquestStore(s => s.civs)

    return (
        <div className="flex flex-col items-start justify-start gap-4 h-full overflow-y-auto scrollbar-none">
            <div className="flex flex-col items-start w-full justify-start gap-8">
                {civs.map((civ, i) => (
                    <div key={i} className="hover:brightness-110 flex flex-col p-5 gap-2 border-2 w-full border-main1">
                        <div className="flex">
                            <p>{civ.name}</p>
                            <p className="ml-auto">Pop: {civ.population}</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative inline-block group">
                                <div className="p-2 bg-main2 rounded-lg">
                                    <p>⚔ {civ.military_strength}</p>
                                </div>
                                <div className="absolute top-full z-50 left-1/2 mt-2
                                        invisible opacity-0 group-hover:visible group-hover:opacity-100
                                        transition-opacity duration-200
                                        p-2 text-sm max-w-150 min-w-50 min-h-0 border-2 bg-main2">
                                    Military power
                                </div>
                            </div>
                            <div className="relative inline-block group">
                                <div className="p-2 bg-main2 rounded-lg">
                                    <p>{civ.type}</p>
                                </div>
                                <div className="absolute top-full z-50 left-1/2 mt-2
                                        invisible opacity-0 group-hover:visible group-hover:opacity-100
                                        transition-opacity duration-200
                                        p-2 text-sm max-w-150 min-w-50 min-h-0 border-2 bg-main2">
                                    Civilization type
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
