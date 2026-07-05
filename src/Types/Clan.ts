export interface Clan {
    name: string;
    hue: number;
    saturation: number,
    lightness: number    
}

export const RedClan: Clan = {
    name: "Red",
    hue: 5,
    saturation: 70,
    lightness: 70
};

export const BlueClan: Clan = {
    name: "Blue",
    hue: 215,
    saturation: 45,
    lightness: 55
};

export const AntClan: Clan = {
    name: "Ants",
    hue: 28,
    saturation: 45,
    lightness: 32,
};