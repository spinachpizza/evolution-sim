export interface Genes {
    speed: number;
    size: number;
    vision: number;
    aggression: number;
    strength: number;
}

export const BaseGenes: Genes = {
    speed: 5,
    size: 5,
    vision: 5,
    aggression: 3,
    strength: 5
};

export const Ants: Genes = {
    speed: 8,
    size: 2,
    vision: 2,
    aggression: 8,
    strength: 3
}

export const GentleGiants: Genes = {
    speed: 2,
    size: 8,
    vision: 3,
    aggression: 2,
    strength: 7
}

export const PooGenes: Genes = {
    speed: 3,
    size: 5,
    vision: 3,
    aggression: 4,
    strength: 3
}