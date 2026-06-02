interface PlayerFieldConfig {
    default: number;
    type?: string;
    id: string;
    format: (x: number) => string;
}

export const PLAYER_FIELDS = {
    population: {
        default: 5,
        id: "population",
        format: (x: number) => `Population: ${x}`,
    },

    homes: {
        default: 5,
        id: "home",
        format: (x: number) => `Homes: ${x}`,
    },

    // ---------------------------------------------

    farmers: {
        type: "occupation",
        default: 0,
        id: "farmers",
        format: (x: number) => `Farmers: ${x}`,
    },
    soldiers: {
        type: "occupation",
        default: 0,
        id: "soldiers",
        format: (x: number) => `Soldiers: ${x}`,
    },
    foragers:{
        type: "occupation",
        default: 0,
        id: "foragers",
        format: (x: number) => `Foragers: ${x}`
    },

    // ---------------------------------------------

    farms: {
        default: 0,
        id: "farms",
        format: (x: number) => `Farms: ${x}`
    },

    food: {
        default: 25,
        id: "food",
        format: (x: number) => `Food: ${x}`,
    },

    // ---------------------------------------------

    wood: {
        default: 0,
        id: "wood",
        format: (x: number) => `Wood: ${x}`,
    },
    stone: {
        default: 0,
        id: "stone",
        format: (x: number) => `Stone: ${x}`,
    },
    ore: {
        default: 0,
        id: "ore",
        format: (x: number) => `Ore: ${x}`,
    },

    // ---------------------------------------------

    research_points: {
        default: 50,
        id: "research-points",
        format: (x:number) => `Research Points: ${x}`,
    },
} satisfies Record<string, PlayerFieldConfig>;

export type PlayerData = { [K in keyof typeof PLAYER_FIELDS]: number };

type Listener<K extends keyof PlayerData> = (value: PlayerData[K]) => void;
const listeners = new Map<keyof PlayerData, Set<Listener<any>>>();

export function subscribe<K extends keyof PlayerData>(
    key: K,
    listener: Listener<K>
): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    return () => listeners.get(key)?.delete(listener);
}

export function bind<K extends keyof PlayerData>(el: HTMLElement, key: K): () => void {
    const { format } = PLAYER_FIELDS[key];
    el.textContent = format(playerData[key]);
    return subscribe(key, (value) => { el.textContent = format(value as number); });
}


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
            console.log(target)
            console.log(key)
            console.log(value)

            const { id, format } = fields[k];
            document.querySelectorAll<HTMLElement>(`.${id}`).forEach((el) => {
                el.textContent = format(value);
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
    const parsed = saved ? (JSON.parse(saved) as Partial<PlayerData>) : {};
    for (const key of Object.keys(PLAYER_FIELDS) as (keyof PlayerData)[]) {
        proxy[key] = parsed[key] ?? PLAYER_FIELDS[key].default;
    }
    return proxy;
})();
