
interface Civilization {
    name: string;
    population: number;
    military_strength: number;
    type: CivilizationType;
}

enum CivilizationType{
    Agriculture,
    Military,
    Primitive,
    Mining,
    Trade,   
}

const CIVILIZATIONS : number = 5;

const PREFIXES : string[] = [
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
    "'a",
    "'i",
    "'u",
    ""
]

const max_midpieces = 1

export const neighboring_civilizations: Civilization[] = localStorage.getItem("neighboring_civilizations")    ? JSON.parse(localStorage.getItem("neighboring_civilizations")!)
    : generateCivilizations()


//Create a list of procedurally generated civ names
function generateCivilizations(): Civilization[] {
    const civs: Civilization[] = [];
    for (let i = 0; i < CIVILIZATIONS; i++) {
        const randomFrom = <T>(arr: T[]): T | undefined =>
            arr[Math.floor(Math.random() * arr.length)];

        //Set a random amount of midpieces
        let midCount = Math.floor(Math.random() * max_midpieces) + 1

        const mids = Array.from({ length: midCount}, ()=> randomFrom(MIDPIECES) ?? '')

        const pref = randomFrom(PREFIXES)
        const suf = randomFrom(SUFFIXES)
        const name = pref + mids.join('') + suf;

        //temp
        console.error(name)
        
        civs.push({
            name: `${name}`,
            population: (Math.floor(Math.random() * 100) + 1),
            military_strength: 1,
            type: CivilizationType.Agriculture
        });
    }
    localStorage.setItem("neighboring_civilizations", JSON.stringify(civs))
    return civs;
}

export function init(): void {
}


