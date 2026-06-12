// import { add_event } from "../event_dialogue";
// import { drawCivilizations } from "../sub_tabs/conquest/plan";
import { generateCivilizationName } from "../names";
import { CivilizationType } from "../civilization_types";

interface Civilization {
    name: string;
    population: number;
    military_strength: number;
    type: CivilizationType;
}

const CIVILIZATIONS: number = 5;

//Civ Adjustments
const max_strength = 5
const max_population = 200

const pop_to_strength_factor = 1 / 10

export const neighboring_civilizations: Civilization[] = localStorage.getItem("neighboring_civilizations") ? JSON.parse(localStorage.getItem("neighboring_civilizations")!)
    : generateCivilizations()

// --------------------------------------------------------

//Create a list of procedurally generated civ names
function generateCivilizations(): Civilization[] {
    const civs: Civilization[] = [];
    const randomFrom = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];
    for (let i = 0; i < CIVILIZATIONS; i++) {
        const CIV_TYPES = Object.values(CivilizationType) as CivilizationType[];

        const type = randomFrom(CIV_TYPES)

        const name = generateCivilizationName(type)

        //Population
        let population = Math.floor(Math.random() * max_population) + 1

        //Strength
        let strength = Math.floor(Math.random() * max_strength) + 1

        if (type == CivilizationType.Military) {
            strength *= 2
        }
        if (type == CivilizationType.Primitive) {
            strength = Math.floor(strength * 0.5)
            population = Math.floor(population * 0.5)
        }

        strength *= Math.max(Math.floor((pop_to_strength_factor) * population), 1)

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

interface CivEvent {
    id: string
    chance: number
    action: (civ1: Civilization, civ2: Civilization) => void;
}

const civEvents: CivEvent[] = [
    {
        id: "war",
        chance: 0.01,
        action: (civ1, civ2) => {
            add_event(`${civ1.name} warred with ${civ2.name}`)

            const dominant_civ = civ1.military_strength > civ2.military_strength ? civ1 : civ2
            const subordinate_civ = dominant_civ === civ1 ? civ2 : civ1

            const dominant_losses = Math.floor(dominant_civ.population * 0.1)
            const subordinate_losses = Math.floor(subordinate_civ.population * 0.5)

            dominant_civ.population -= dominant_losses
            subordinate_civ.population -= subordinate_losses



            setTimeout(() => {
                add_event(`${dominant_civ.name} lost ${dominant_losses}, ${subordinate_civ.name} lost ${subordinate_losses}`)
                drawCivilizations()
            }, 500)
        }
    },
    {
        id: "war",
        chance: 0.01,
        action: (civ1, civ2) => {
            add_event(`${civ1.name} warred with ${civ2.name}`)

            const dominant_civ = civ1.military_strength > civ2.military_strength ? civ1 : civ2
            const subordinate_civ = dominant_civ === civ1 ? civ2 : civ1

            const dominant_losses = Math.floor(dominant_civ.population * 0.1)
            const subordinate_losses = Math.floor(subordinate_civ.population * 0.5)

            dominant_civ.population -= dominant_losses
            subordinate_civ.population -= subordinate_losses



            setTimeout(() => {
                add_event(`${dominant_civ.name} lost ${dominant_losses}, ${subordinate_civ.name} lost ${subordinate_losses}`)
                drawCivilizations()
            }, 500)
        }
    }
]

setInterval(() => {
    const randomFrom = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];
    civEvents.forEach((e) => {
        const civ1 = randomFrom(neighboring_civilizations)
        const civ2 = randomFrom(neighboring_civilizations.filter(c => c !== civ1))
        if (Math.random() < e.chance) {
            e.action(civ1, civ2)
        }
    })
}, 1000);

export function init(): void {
}

