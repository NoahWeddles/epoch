import { add_event } from "../event_dialogue";

interface Civilization {
    name: string;
    population: number;
    military_strength: number;
    type: CivilizationType;
}

enum CivilizationType{
    Agriculture = "Agriculture",
    Military = "Military",
    Primitive = "Primitive",
    Mining = "Mining",
    Trade = "Trade",   
}

const CIVILIZATIONS : number = 5;

const AG_PREFIXES : string[] = [
    "Jo",
    "Ho",
    "Ro",
    "Ja",
    "Ha",
    "Ra",
    "Man",
    "Jan",
    "Kan",
    "Ya'an",
    "Xa'an"
]
const MILI_PREFIXES: string[] = [
    "Akka",
    "Alla",
    "Amma",
    "Okka",
    "Olla",
    "Omma",
    "Elle",
    "Ello",
    "Akko",
    "Allo",
    "Ammo",
    "Okko",
    "Ari",
    "Ori",
    "Eri",
]
const PRIMI_PREFIXES: string[] = [
    "A",
    "E",
    "O",
    "I",
]
const MINING_PREFIXES: string[] = [
    "Dur",
    "Gur",
    "Bur",
    "Drak",
    "Grak",
    "Brak",
    "Kor",
    "More",
    "Tor",
    "Keld",
    "Meld",
    "Grond",
    "Thrum",
    "Khur",
]
const TRADE_PREFIXES: string[] = [
    "Aamba",
    "Aar",
    "Il",
    "Ak",
    "Falm",
    "Barad",
    "Rijad"
]
const MIDPIECES : string[] = [
    "nal",
    "kal",
    "xal",
    "ral",
    "'al",
    "nan",
    "kan",
    "xan",
    "ran",
    "'an"
]
const SUFFIXES : string[] = [
    "ara",
    "ura",
    "ira",
    "eth",
    "oth",
    "ash",
    "esh",
    "on",
    "en",
    "is",
    "os",
    "en",
    "is",
    "os",
    "ax",
    "ix",
    "67",
    "tung",
    "sahur",
    "'a",
    "'i",
    "'u",
    ""
]



const PREFIX_MAP: Record<CivilizationType, string[]> = {
    [CivilizationType.Agriculture]: AG_PREFIXES,
    [CivilizationType.Military]: MILI_PREFIXES,
    [CivilizationType.Primitive]: PRIMI_PREFIXES,
    [CivilizationType.Mining]: MINING_PREFIXES,
    [CivilizationType.Trade]: TRADE_PREFIXES,
};

//Name
const max_midpieces = 1

//Civ Adjustments
const max_strength = 5
const max_population = 200

const pop_to_strength_factor = 1/10

export const neighboring_civilizations: Civilization[] = localStorage.getItem("neighboring_civilizations")    ? JSON.parse(localStorage.getItem("neighboring_civilizations")!)
    : generateCivilizations()

// --------------------------------------------------------

//Create a list of procedurally generated civ names
function generateCivilizations(): Civilization[] {
    const civs: Civilization[] = [];
    const CIV_TYPES = Object.values(CivilizationType) as CivilizationType[];

    const randomFrom = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < CIVILIZATIONS; i++) {
        const type = randomFrom(CIV_TYPES)
        const pref = randomFrom(PREFIX_MAP[type] ?? '')

        //Set a random amount of midpieces
        let midCount = Math.floor(Math.random() * max_midpieces) + 1

        const mids = Array.from({ length: midCount}, ()=> randomFrom(MIDPIECES) ?? '')
        const suf = randomFrom(SUFFIXES)
        const name = pref + mids.join('') + suf;


        //Population
        let population = Math.floor(Math.random() * max_population) + 1

        //Strength
        let strength = Math.floor(Math.random() * max_strength) + 1

        if (type == CivilizationType.Military) {
            strength *= 2
        }
        if (type == CivilizationType.Primitive){
            strength = Math.floor(strength*0.5)
            population = Math.floor(population*0.5)
        }

        strength *= Math.max(Math.floor((pop_to_strength_factor)*population), 1)
        
        civs.push({
            name: `${name}`,
            population: population,
            military_strength: strength,
            type: type
        });
    }
    localStorage.setItem("neighboring_civilizations", JSON.stringify(civs))
    return civs;
}

// --------------------------------------------------------

interface CivEvent{
    id: string
    chance: number
    action: (civ1 : Civilization, civ2 : Civilization) => void;
}

const civEvents: CivEvent[] = [
    {
        id: "war",
        chance: 1,
        action: (civ1, civ2)=>{
            add_event(`${civ1.name} warred with ${civ2.name}`)

            const dominant_civ = civ1.military_strength > civ2.military_strength ? civ1 : civ2
            const subordinate_civ = dominant_civ === civ1 ? civ2 : civ1

            const dominant_losses = Math.floor(dominant_civ.population*0.1)
            const subordinate_losses = Math.floor(subordinate_civ.population*0.5)

            // setTimeout(() => {
            //     add_event(`${dominant_civ.name} lost ${dominant_losses}, ${subordinate_civ.name} lost ${subordinate_losses}`)
            // }, 500)
        }
    }
]

setInterval(() => {
    const randomFrom = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];
    civEvents.forEach((e)=>{
        const civ1 = randomFrom(neighboring_civilizations)
        const civ2 = randomFrom(neighboring_civilizations.filter(c => c !== civ1))
        if(Math.random()<e.chance){
            e.action(civ1,civ2)
        }
    })
}, 100);

export function init(): void {
}


