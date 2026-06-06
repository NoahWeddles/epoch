import { CivilizationType } from "./civilization_types"
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
    "Ur",
    "Un",
    "Ah"
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
    "'an",
    "nar",
    "kar",
    "xar",
    "tar",
    "et'",
    "ef",
    "en"
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

const max_midpieces : number = 1

export function generateCivilizationName(type: CivilizationType){
    const randomFrom = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];
    const pref = randomFrom(PREFIX_MAP[type] ?? '')

    //Set a random amount of midpieces
    let midCount = Math.floor(Math.random() * max_midpieces) + 1

    const mids = Array.from({ length: midCount}, ()=> randomFrom(MIDPIECES) ?? '')
    const suf = randomFrom(SUFFIXES)
    return pref + mids.join('') + suf;
}