import { Game } from "./Game";
import "./Components/Menu";
import "./Components/MenuButton";
import "./Components/SpeedButton";
import type { Creature } from "./Objects/Creature/Creature";
import "./style.css";
import { openMenu } from "./Components/Menu";

export let game: Game | null;

export function startGame(creatures: Creature[], foodIndex: number, friendlyFire: boolean) {

    if (game) {
        game.stop();
    }

    game = new Game(creatures, foodIndex, friendlyFire);
    game.start();
}

export function returnToMenu() {

    if (game) {
        game.stop();
        game = null;
    }

    openMenu();
}

const creaturePanel = document.getElementById("creature-panel")!;
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        creaturePanel.classList.toggle("hidden");
        e.preventDefault();
    }
});