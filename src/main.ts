import { Game } from "./Game";
import "./Components/Menu";
import "./Components/SpeedButton";
import type { Creature } from "./Objects/Creature/Creature";
import "./style.css";

export let game: Game;

export function startGame(creatures: Creature[], foodIndex: number, friendlyFire: boolean) {

    if (game) {
        game.stop();
    }

    game = new Game(creatures, foodIndex, friendlyFire);
    game.start();
}

const creaturePanel = document.getElementById("creature-panel")!;
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        creaturePanel.classList.toggle("hidden");
        e.preventDefault();
    }
});