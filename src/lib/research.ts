import { changeValue, useGameStore} from "../context/GameContext";

export interface Technology {
    id: string;
    display: string;
    description: string;
    requiredTech?: Array<string>;
    action: () => void;
    researchCost: number;
    x?: number;
    y?: number;
}

export const technologies: Array<Technology> = [
    {
        id: "metal_working",
        display: "Metal Working",
        researchCost: 10,
        action: () => {
            document.body.classList.add("tech-metal_working");
        },
        description: "Allows the use of metals and alloys, stronger than the primitive materials. Unlocks the ability to forage for small amounts of ore"
    },
    {
        id: "basic_military",
        display: "Basic Military",
        researchCost: 25,
        requiredTech: ["metal_working", "agriculture"],
        action: () => {
            document.body.classList.add("tech-basic_military");
        },
        description: "Allows the formation of a rudimentary military. Unlocks soldiers and conquest functionality."
    },
    {
        id: "agriculture",
        display: "Agriculture",
        researchCost: 5,
        action: () => {
            document.body.classList.add("tech-agriculture");
        },
        description: "Grants the ability to cultivate crops. Unlocks farms."
    },
    {
        id: "pottery",
        display: "Pottery",
        researchCost: 10,
        action: () => {
            document.body.classList.add("tech-pottery");
        },
        description: "Pottery"
    },
];

const stored_unlocked = localStorage.getItem("unlocked_technologies");
export const unlocked_technologies: Record<string, boolean> = stored_unlocked
    ? JSON.parse(stored_unlocked)
    : Object.fromEntries(technologies.map(tech => [tech.id, false]));

technologies.forEach(tech => {
    if (unlocked_technologies[tech.id]) {
        tech.action();
    }
});

export function unlockTechnology(tech: Technology): void {
    let can_unlock: boolean = true

    const research_points = useGameStore.getState().research_points

    if (research_points < tech.researchCost) can_unlock = false;
    if (unlocked_technologies[tech.id] === true) can_unlock = false;

    tech.requiredTech?.forEach(id => {
        if (!unlocked_technologies[id]) can_unlock = false
    });

    if (can_unlock) {
        unlocked_technologies[tech.id] = true
        localStorage.setItem("unlocked_technologies", JSON.stringify(unlocked_technologies));
        
        changeValue("research_points", -tech.researchCost)

        tech.action()
    }
}