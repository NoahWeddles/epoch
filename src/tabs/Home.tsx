import { setValue, useGameStore } from '../context/GameContext'
import { generateCivilizationName } from '../lib/names'
import { CivilizationType } from '../lib/civilization_types'

const CIV_TYPES = Object.values(CivilizationType) as CivilizationType[]

function randomizeName() {
    const type = CIV_TYPES[Math.floor(Math.random() * CIV_TYPES.length)]
    setValue('civilization_name', generateCivilizationName(type))
}

export default function Home() {
    const civilization_name = useGameStore(s => s.civilization_name)

    return (
        <div className="flex gap-5 p-2 items-center justify-start rounded-xs bg-main0/(--bg-opacity) [--bg-opacity:25%] w-full">
            <span className="italic">Name</span>
            <textarea
                value={civilization_name}
                onChange={e => setValue('civilization_name', e.target.value)}
                className="focus:border-transparent focus:outline-none resize-none w-full h-5 bg-transparent"
            />
            <span onClick={randomizeName} className="cursor-pointer hover:brightness-110 active:brightness-120">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#d9c06d">
                    <path d="M354.5-269.5Q372-287 372-312t-17.5-42.5Q337-372 312-372t-42.5 17.5Q252-337 252-312t17.5 42.5Q287-252 312-252t42.5-17.5Zm0-336Q372-623 372-648t-17.5-42.5Q337-708 312-708t-42.5 17.5Q252-673 252-648t17.5 42.5Q287-588 312-588t42.5-17.5Zm168 168Q540-455 540-480t-17.5-42.5Q505-540 480-540t-42.5 17.5Q420-505 420-480t17.5 42.5Q455-420 480-420t42.5-17.5Zm168 168Q708-287 708-312t-17.5-42.5Q673-372 648-372t-42.5 17.5Q588-337 588-312t17.5 42.5Q623-252 648-252t42.5-17.5Zm0-336Q708-623 708-648t-17.5-42.5Q673-708 648-708t-42.5 17.5Q588-673 588-648t17.5 42.5Q623-588 648-588t42.5-17.5ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z" />
                </svg>
            </span>
        </div>
    )
}
