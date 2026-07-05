import { startGame } from "../main";
import { Creature } from "../Objects/Creature/Creature";
import type { CreatureConfig } from "../Types/CreatureConfig";
import type { Genes } from "../Types/Genes";

const playButton = document.getElementById("play-button")!;

const friendlyFireToggle = document.getElementById("friendly-toggle")!;

const gameScreen = document.getElementById("game-screen") as HTMLDivElement;

const menuScreen = document.getElementById("menu-screen") as HTMLDivElement;

let creatureConfigs: CreatureConfig[] = [];

let teamsEnabled = false;
let friendlyFire = true;

let panelIndex = 0;

function closeMenu() {
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
}

export function openMenu() {
    menuScreen.style.display = "flex";
    gameScreen.style.display = "none";
}


playButton.onclick = () => {
    closeMenu();

    if (!teamsEnabled) {
        creatureConfigs = creatureConfigs.slice(0, 1);
    }

    const creatures = creatureConfigs.map((c, i) =>
        new Creature(
            100,
            100,
            {
                name: c.teamName ?? `Team ${String.fromCharCode(65 + i)}`,
                hue: c.color.hue,
                saturation: c.color.saturation,
                lightness: c.color.lightness
            },
            c.genes,
            friendlyFire,
            true
        )
    );

    const foodIndexSelect = document.getElementById("food-condition") as HTMLSelectElement;
    const foodIndex = Number(foodIndexSelect.value);

    if (!teamsEnabled)
    {
        const populationBar = document.getElementById("ui-bar-container") as HTMLElement;
        populationBar.classList.add("hidden");
    }

    startGame(creatures, foodIndex, friendlyFire);
}

friendlyFireToggle.addEventListener("click", () => {
    console.log("CLICKED");
    friendlyFire = !friendlyFire;

    friendlyFireToggle.classList.toggle("active", friendlyFire);
});

document.querySelectorAll(".stat-slider").forEach(slider => {
    slider.addEventListener("input", (e) => {

        const target = e.target as HTMLInputElement;
        const id = target.id as keyof Genes;
        const value = Number(target.value);

        const genes = creatureConfigs[panelIndex].genes;

        genes[id] = value;

        const label = document.getElementById(`${id}-stat-display`);
        if (label) label.textContent = value.toString();
    });
});

function applyGeneValuesToUI() {
    const genes = creatureConfigs[panelIndex].genes;

    document.querySelectorAll(".stat-slider").forEach(slider => {
        const target = slider as HTMLInputElement;
        const id = target.id as keyof Genes;

        target.value = genes[id].toString();

        const label = document.getElementById(`${id}-stat-display`);
        if (label) label.textContent = genes[id].toString();
    });
}

function createDefaultCreature(): CreatureConfig {
    return {
        genes: {
            speed: 2,
            size: 3,
            vision: 2,
            aggression: 3,
            strength: 2
        },
        color: {
            hue: 215,
            saturation: 45,
            lightness: 55
        },
        teamName: "TeamA"
    };
}

creatureConfigs = [
    createDefaultCreature()
];

applyGeneValuesToUI();
friendlyFireToggle.classList.toggle("active", friendlyFire);