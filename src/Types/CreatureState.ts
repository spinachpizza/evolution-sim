export const CreatureState = {
    Wandering: "wandering",
    Foraging: "foraging",
    Hunting: "hunting",
    Fighting: "fighting"
} as const;

export type CreatureState =
    typeof CreatureState[keyof typeof CreatureState];