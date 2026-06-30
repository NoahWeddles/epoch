import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateCivilizationName } from './names';
import { CivilizationType } from './civilization_types';
import { addEvent } from '../context/DialogueContext';

export interface Civilization {
    name: string;
    population: number;
    military_strength: number;
    type: CivilizationType;
}

const NUM_CIVS = 5;
const MAX_STRENGTH = 5;
const MAX_POPULATION = 200;
const POP_TO_STRENGTH = 1 / 10;

function generateCivs(): Civilization[] {
    const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const CIV_TYPES = Object.values(CivilizationType) as CivilizationType[];
    return Array.from({ length: NUM_CIVS }, () => {
        const type = randomFrom(CIV_TYPES);
        const name = generateCivilizationName(type);
        let population = Math.floor(Math.random() * MAX_POPULATION) + 1;
        let strength = Math.floor(Math.random() * MAX_STRENGTH) + 1;
        if (type === CivilizationType.Military) strength *= 2;
        if (type === CivilizationType.Primitive) {
            strength = Math.floor(strength * 0.5);
            population = Math.floor(population * 0.5);
        }
        strength *= Math.max(Math.floor(POP_TO_STRENGTH * population), 1);
        return { name, population, military_strength: strength, type };
    });
}

interface ConquestState {
    civs: Civilization[];
}

export const useConquestStore = create<ConquestState>()(
    persist(
        () => ({ civs: generateCivs() }),
        { name: 'neighboringCivs' }
    )
);

export function runCivEvents() {
    const { civs } = useConquestStore.getState();
    if (civs.length < 2) return;
    const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    if (Math.random() < 0.01) {
        const civ1 = randomFrom(civs);
        const others = civs.filter(c => c !== civ1);
        if (!others.length) return;
        const civ2 = randomFrom(others);

        const dom = civ1.military_strength >= civ2.military_strength ? civ1 : civ2;
        const sub = dom === civ1 ? civ2 : civ1;
        const domLoss = Math.floor(dom.population * 0.1);
        const subLoss = Math.floor(sub.population * 0.5);

        addEvent(`${civ1.name} warred with ${civ2.name}`);
        addEvent(`${dom.name} lost ${domLoss}, ${sub.name} lost ${subLoss}`);

        useConquestStore.setState(s => ({
            civs: s.civs.map(c => {
                if (c.name === dom.name) return { ...c, population: Math.max(0, c.population - domLoss) };
                if (c.name === sub.name) return { ...c, population: Math.max(0, c.population - subLoss) };
                return c;
            })
        }));
    }
}
