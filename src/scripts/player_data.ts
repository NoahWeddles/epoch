interface PlayerFieldConfig {
    default: number;
    type?: string;
    selector: string;
    format: (x: number) => string;
}

export const PLAYER_FIELDS = {
    population: {
        default: 5,
        selector: ".population",
        format: (x: number) => `Population: ${x}`,
    },
    farmers: {
        type: "occupation",
        default: 0,
        selector: ".farmers",
        format: (x: number) => `Farmers: ${x}`,
    },
    soldiers: {
        type: "occupation",
        default: 0,
        selector: ".soldiers",
        format: (x: number) => `Soldiers: ${x}`,
    },
    foragers:{
        type: "occupation",
        default: 0,
        selector: ".foragers",
        format: (x: number) => `Foragers: ${x}`
    },

    // ---------------------------------------------

    food: {
        default: 25,
        selector: ".food",
        format: (x: number) => `Food: ${x}`,
    },

    wood: {
        default: 0,
        selector: ".wood",
        format: (x: number) => `Wood: ${x}`,
    },
    stone: {
        default: 0,
        selector: ".stone",
        format: (x: number) => `Stone: ${x}`,
    },
    ore: {
        default: 0,
        selector: ".ore",
        format: (x: number) => `Ore: ${x}`,
    },
    
    // ---------------------------------------------

    research_points: {
        default: 10,
        selector: ".research",
        format: (x:number) => `Research Points: ${x}`,
    },
} satisfies Record<string, PlayerFieldConfig>;

export type PlayerData = { [K in keyof typeof PLAYER_FIELDS]: number };

function createPlayerData(fields: typeof PLAYER_FIELDS): PlayerData {
    const state = Object.fromEntries(
        Object.entries(fields).map(([key, { default: def }]) => [key, def])
    ) as PlayerData;

    let proxy: PlayerData;

    proxy = new Proxy(state, {
        set(target, key, value) {
            if (!(key in fields)) {
                console.error(
                    `Unknown playerData field: "${String(key)}". Add it to PLAYER_FIELDS in player_data.ts`
                );
                return false;
            }
            const k = key as keyof PlayerData;

            if (k === "population") {
                const occupations = (Object.entries(fields) as [keyof PlayerData, PlayerFieldConfig][])
                    .filter(([, config]) => config.type === "occupation")
                    .map(([key]) => key);

                let excess = occupations.reduce((sum, occ) => sum + target[occ], 0) - value;
                for (const occ of occupations) {
                    if (excess <= 0) break;
                    const trimmed = Math.max(0, target[occ] - excess);
                    excess -= target[occ] - trimmed;
                    proxy[occ] = trimmed;
                }
            }

            target[k] = value;
            localStorage.setItem("playerData", JSON.stringify(target));

            const { selector, format } = fields[k];
            const els = document.querySelectorAll(selector);
            els.forEach((el) => {
                if (el) el.textContent = format(value);
            });

            return true;
        },

        get(target, key) {
            if (!(key in fields)) {
                console.warn(`Reading unknown playerData field: "${String(key)}"`);
            }
            return target[key as keyof PlayerData];
        },
    });

    return proxy;
}

export const playerData: PlayerData = (() => {
    const proxy = createPlayerData(PLAYER_FIELDS);
    const saved = localStorage.getItem("playerData");
    if (saved) {
        const parsed = JSON.parse(saved) as Partial<PlayerData>;
        Object.assign(proxy, parsed);
    }
    return proxy;
})();
