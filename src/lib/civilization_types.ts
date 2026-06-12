export const CivilizationType = {
    Agriculture: "Agriculture",
    Military: "Military",
    Primitive: "Primitive",
    Mining: "Mining",
    Trade: "Trade",
} as const;

export type CivilizationType = typeof CivilizationType[keyof typeof CivilizationType];