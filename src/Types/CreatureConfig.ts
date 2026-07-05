import type { color } from "./Color";

export type CreatureConfig = {
    genes: {
        speed: number;
        size: number;
        vision: number;
        aggression: number;
        strength: number;
    };
    color: color;
    teamName: string;
};